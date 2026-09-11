# 🌤️ Weather Dashboard

A beautiful and interactive weather dashboard that fetches real-time weather data from the OpenWeatherMap API.

## Features

✨ **Current Weather Display**
- Real-time temperature, humidity, wind speed, and pressure
- Weather description with appropriate icons
- Feels-like temperature and visibility
- UV index approximation

🔍 **Search Functionality**
- Search by city name with auto-suggestions
- City search with country information
- Recent searches saved in browser storage

📅 **5-Day Forecast**
- Daily weather predictions
- High and low temperatures
- Weather condition icons
- Beautiful card layout

⏰ **24-Hour Hourly Forecast**
- Next 24 hours weather predictions
- Temperature and weather icons
- Scrollable horizontal layout

💾 **Local Storage**
- Automatically saves recent searches
- Persists data in browser storage

📱 **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Beautiful gradient background
- Smooth animations and transitions

## How to Run

### Option 1: Direct File Opening
1. Download or clone the repository
2. Open `index.html` in your web browser
3. That's it! No server needed.

### Option 2: Using Python (if you prefer)
```bash
# Python 3.x
python -m http.server 8000

# Or Python 2.x
python -m SimpleHTTPServer 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Using Node.js
```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Run the server
http-server
```
Then open the provided local address in your browser.

## File Structure

```
weather-dashboard/
├── index.html          # Main HTML file
├── style.css           # Styling and animations
├── script.js           # JavaScript logic and API calls
└── README.md          # This file
```

## API Information

**API Used:** OpenWeatherMap (Free Tier)
- **Endpoint:** https://api.openweathermap.org/data/2.5/
- **Features:** 
  - Current weather data
  - 5-day forecast (updated every 3 hours)
  - Geolocation by city name
- **Rate Limit:** 60 calls/minute for free tier
- **No API Key Required:** Public key included (for demonstration)

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **JavaScript (Vanilla)** - Logic and API integration
- **Font Awesome Icons** - Weather and UI icons
- **OpenWeatherMap API** - Weather data

## Usage

1. **Search for a City:**
   - Type a city name in the search box
   - Select from suggestions or press Enter
   - Weather data will load automatically

2. **View Recent Searches:**
   - Click any recent search to reload that city's weather
   - Last 10 searches are saved

3. **Explore Weather Data:**
   - Current weather with detailed metrics
   - 5-day forecast for planning
   - Hourly forecast for the next 24 hours

## Features Explained

### Current Weather
- **Temperature**: Main temperature in Celsius
- **Feels Like**: Perceived temperature based on wind and humidity
- **Humidity**: Moisture level in the air
- **Wind Speed**: Speed of the wind in m/s
- **Pressure**: Atmospheric pressure in hPa
- **Visibility**: How far you can see in km
- **UV Index**: Approximation based on cloud coverage

### Forecast Data
- Shows weather predictions for the next 5 days
- Displays minimum and maximum temperatures
- Weather conditions with icons
- Hourly breakdown for detailed planning

## Customization

### Change Default City
Edit line in `script.js`:
```javascript
searchWeather('London'); // Change to your preferred city
```

### Change Units (Celsius to Fahrenheit)
In `script.js`, change `units=metric` to `units=imperial`:
```javascript
const currentResponse = await fetch(
    `${API_BASE}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
);
```

### Change Color Theme
Edit CSS variables in `style.css`:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers

## Notes

- The app uses a public API key for demonstration purposes
- For production use, consider using your own API key
- Data is cached in browser local storage
- No backend server required
- Works entirely in the browser

## License

Free to use and modify.

## Support

For issues or questions:
1. Check API status at openweathermap.org
2. Ensure browser has internet connection
3. Clear browser cache if data is not updating
4. Check browser console for error messages

---

**Enjoy your weather dashboard! 🌤️**