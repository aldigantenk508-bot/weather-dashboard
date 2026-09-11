// OpenWeatherMap API Key (Free tier)
const API_KEY = 'b6fd43b42d4a647b72b920dd49873767'; // Free API Key
const API_BASE = 'https://api.openweathermap.org/data/2.5';
const GEO_API = 'https://api.openweathermap.org/geo/1.0';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const hourly = document.getElementById('hourly');
const suggestions = document.getElementById('suggestions');
const recentList = document.getElementById('recentList');

// Recent searches from localStorage
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// Initialize
window.addEventListener('load', () => {
    displayRecentSearches();
    // Load default city
    searchWeather('London');
});

// Search input listener
searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        suggestions.classList.remove('show');
        return;
    }

    try {
        const response = await fetch(
            `${GEO_API}/direct?q=${query}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.length > 0) {
            displaySuggestions(data);
        } else {
            suggestions.classList.remove('show');
        }
    } catch (err) {
        console.error('Error fetching suggestions:', err);
    }
});

// Display suggestions
function displaySuggestions(data) {
    suggestions.innerHTML = '';
    
    data.forEach(location => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `
            <strong>${location.name}</strong>
            ${location.state ? ', ' + location.state : ''}
            <span style="color: #999;">${location.country}</span>
        `;
        div.onclick = () => {
            searchInput.value = location.name;
            suggestions.classList.remove('show');
            searchWeatherByCoords(location.lat, location.lon, location.name);
        };
        suggestions.appendChild(div);
    });
    
    suggestions.classList.add('show');
}

// Search weather
function searchWeather(city = null) {
    const query = city || searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a city name');
        return;
    }
    
    fetchWeatherByCity(query);
}

// Fetch weather by city name
async function fetchWeatherByCity(city) {
    try {
        showLoading(true);
        hideError();
        
        // Get coordinates from city name
        const geoResponse = await fetch(
            `${GEO_API}/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();
        
        if (geoData.length === 0) {
            throw new Error('City not found');
        }
        
        const { lat, lon, name } = geoData[0];
        searchWeatherByCoords(lat, lon, name);
        
        // Add to recent searches
        addToRecentSearches(name);
        
    } catch (err) {
        showError(`Error: ${err.message}`);
        showLoading(false);
    }
}

// Fetch weather by coordinates
async function searchWeatherByCoords(lat, lon, cityName) {
    try {
        showLoading(true);
        hideError();
        
        // Current weather
        const currentResponse = await fetch(
            `${API_BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const currentData = await currentResponse.json();
        
        // Forecast (5 days)
        const forecastResponse = await fetch(
            `${API_BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();
        
        // Display data
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        displayHourlyForecast(forecastData);
        
        showLoading(false);
        currentWeather.classList.remove('hidden');
        forecast.classList.remove('hidden');
        hourly.classList.remove('hidden');
        suggestions.classList.remove('show');
        
        // Add to recent searches
        addToRecentSearches(cityName || currentData.name);
        
    } catch (err) {
        showError(`Error fetching weather: ${err.message}`);
        showLoading(false);
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const { main, weather, wind, clouds, sys, visibility } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('dateTime').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('weatherIcon').src = iconUrl;
    document.getElementById('temperature').textContent = Math.round(main.temp);
    document.getElementById('description').textContent = weather[0].description;
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById('feelsLike').textContent = `${Math.round(main.feels_like)}°C`;
    document.getElementById('uvIndex').textContent = `${(clouds.all / 10).toFixed(1)}`; // Approximation
}

// Display 5-day forecast
function displayForecast(data) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = '';
    
    // Group by day
    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
    });
    
    // Get one forecast per day (at noon)
    Object.keys(dailyForecasts).slice(0, 5).forEach(date => {
        const forecasts = dailyForecasts[date];
        const noonForecast = forecasts.find(f => f.dt_txt.includes('12:00')) || forecasts[Math.floor(forecasts.length / 2)];
        
        const temps = forecasts.map(f => f.main.temp);
        const maxTemp = Math.round(Math.max(...temps));
        const minTemp = Math.round(Math.min(...temps));
        
        const iconUrl = `https://openweathermap.org/img/wn/${noonForecast.weather[0].icon}@2x.png`;
        const dateObj = new Date(date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h4>${dayName}<br><small style="color: #999;">${dayDate}</small></h4>
            <div class="icon">
                <img src="${iconUrl}" alt="Weather">
            </div>
            <div class="temps">
                <span class="temp-max">${maxTemp}°</span>
                <span class="temp-min">${minTemp}°</span>
            </div>
            <p class="weather-desc">${noonForecast.weather[0].main}</p>
        `;
        forecastCards.appendChild(card);
    });
}

// Display hourly forecast
function displayHourlyForecast(data) {
    const hourlyCards = document.getElementById('hourlyCards');
    hourlyCards.innerHTML = '';
    
    // Get next 24 hours
    const next24Hours = data.list.slice(0, 8); // 3-hour intervals, so 8 items = 24 hours
    
    next24Hours.forEach(item => {
        const time = new Date(item.dt * 1000);
        const hour = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        const temp = Math.round(item.main.temp);
        
        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="time">${hour}</div>
            <div class="icon">
                <img src="${iconUrl}" alt="Weather">
            </div>
            <div class="temp">${temp}°C</div>
        `;
        hourlyCards.appendChild(card);
    });
}

// Add to recent searches
function addToRecentSearches(city) {
    // Remove if already exists
    recentSearches = recentSearches.filter(c => c !== city);
    
    // Add to beginning
    recentSearches.unshift(city);
    
    // Keep only last 10
    recentSearches = recentSearches.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    
    displayRecentSearches();
}

// Display recent searches
function displayRecentSearches() {
    recentList.innerHTML = '';
    
    if (recentSearches.length === 0) {
        recentList.innerHTML = '<p style="opacity: 0.7;">No recent searches</p>';
        return;
    }
    
    recentSearches.forEach(city => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.innerHTML = `
            <i class="fas fa-map-pin" style="margin-right: 5px;"></i>
            ${city}
        `;
        div.onclick = () => searchWeather(city);
        recentList.appendChild(div);
    });
}

// Utility functions
function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

// Allow Enter key to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (e.target !== searchInput && e.target !== suggestions) {
        suggestions.classList.remove('show');
    }
});