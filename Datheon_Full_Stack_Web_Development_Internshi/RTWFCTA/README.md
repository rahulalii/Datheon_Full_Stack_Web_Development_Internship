# AeroMetrics — Live Weather Telemetry Dashboard

[![HTML5](https://img.shields.io/badge/HTML5-Semantic%20%26%20Accessible-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Flexbox%20%26%20Glassmorphism-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B%20%7C%20Fetch%20API-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A high-precision **Live Weather Telemetry Application** designed for tracking global meteorological metrics in real time. Features animated SVG weather representations, real-time barometric and aerodynamic indicators, dynamic time-of-day and weather-adaptive gradient themes, 5-day forecasts rendered with `Array.map()`, and graceful error/loading state management.

---

## 🌟 Key Features

- **Global City Search with Instant Telemetry**:
  - Search any city worldwide with instant geocoding and live data retrieval.
  - Quick-access telemetry station buttons (London, Tokyo, New York, Paris, Sydney, Mumbai).
  - Geolocation support via **GPS button** (`navigator.geolocation`).
- **Real-Time Weather Metrics**:
  - **Current Temperature** with reactive **°C / °F** toggle switcher.
  - **Atmospheric Conditions** (Sunny, Rainy, Overcast, Thunderstorm, Snow, Mist) with custom animated vector icons.
  - **Humidity Saturation** with percentage gauge and atmospheric comfort rating.
  - **Wind Velocity & Direction** with dynamic rotating compass dial and 16-point cardinal indicators.
  - **Atmospheric Pressure** in hPa with sea-level barometric status.
  - **Optical Visibility** distance rating and sky clarity analysis.
  - **Station Coordinates** (Latitude / Longitude) and local time.
- **5-Day Meteorological Forecast**:
  - Dynamically mapped and rendered using modern JavaScript `Array.prototype.map()`.
  - Daily High/Low temperatures, condition descriptions, precipitation probability (💧), and peak wind speeds (💨).
- **Dynamic Background Gradients**:
  - Smooth 1-second gradient transitions that reflect live local weather and day/night cycles:
    - ☀️ **Sunny / Clear Day**: Vibrant azure to golden sunburst.
    - 🌙 **Clear / Starry Night**: Midnight navy with celestial purple glow.
    - 🌧️ **Rain / Drizzle / Storm**: Oceanic storm slate with rain highlights.
    - ☁️ **Overcast / Cloudy**: High-altitude silvery mist.
    - ⚡ **Thunderstorm**: Electric violet and deep tempest obsidian.
    - ❄️ **Snow / Frost**: Arctic cyan to silver-ice.
    - 🌫️ **Fog / Mist / Haze**: Atmospheric sage-slate.
  - Synchronized `<meta name="theme-color">` updates for mobile browser header tinting.
- **Resilient Dual-Engine Architecture**:
  - **Primary Engine**: Official [OpenWeatherMap API](https://openweathermap.org/api) (Weather 2.5 + 5-Day Forecast).
  - **Zero-Configuration Engine**: Automatic fallback to **Open-Meteo API** (100% free, no API key required, zero setup).
  - **Offline Simulation Mode**: Built-in cached telemetry for popular stations if offline or network is disconnected.
- **Robust Error & Loading State Management**:
  - Modern orbiting CSS spinner overlay during network fetch operations.
  - Graceful alert banner for unknown cities (HTTP 404), API key validation (HTTP 401), or offline dropouts.
  - Non-destructive inline error handling with "Retry" and "Switch Engine" actions.

---

## 🚀 Quick Start

### 1. Directly in Any Browser (No Server Required)
Simply double-click `index.html` or open it with your web browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 2. Or Run with a Local Web Server
```bash
# Using Python 3
python -m http.server 8080

# Using Node.js
npx serve .
```
Then visit `http://localhost:8080` in your browser.

---

## 🔑 OpenWeatherMap API Key Setup

The application works immediately out-of-the-box using the open telemetry engine. To connect your personal **OpenWeatherMap** account:

1. Register for a free account at [OpenWeatherMap Free API Portal](https://openweathermap.org/api).
2. Navigate to your [API Keys](https://home.openweathermap.org/api_keys) page and generate or copy your free 32-character key.
3. In the AeroMetrics dashboard:
   - Click the **"API Key"** button in the top-right header.
   - Paste your key into the modal input field.
   - Click **"Save Key"**.
4. The application saves your key securely in browser `localStorage` and immediately queries OpenWeatherMap!

> **Note on New Keys**: OpenWeatherMap free API keys can take **10 to 60 minutes** to become globally active on their CDN. If you receive an activation notice, AeroMetrics will display a 1-click fallback button to keep querying live data via Open-Meteo until your OpenWeatherMap key is fully active!

---

## 📁 Project Structure

```
RTWFCTA/
├── index.html       # Semantic HTML5 markup, accessible search form, hero & metrics cards
├── styles.css       # Responsive Flexbox & Grid layouts, dynamic theme gradients, glassmorphism
├── app.js          # Core logic: async/await fetch, state management, Array.map() forecast, error handling
├── icons.js        # High-definition scalable vector (SVG) icons with micro-animations
└── README.md       # Comprehensive documentation and setup instructions
```

---

## 🛠️ Technical Highlights

### 1. Asynchronous `fetch()` with `try...catch` Error Handling
```javascript
async function fetchFromOpenWeatherMap(city, apiKey) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  const [currentRes, forecastRes] = await Promise.all([
    fetch(currentWeatherUrl),
    fetch(forecastUrl)
  ]);

  if (currentRes.status === 401 || forecastRes.status === 401) {
    const err = new Error('Invalid or inactive OpenWeatherMap API key');
    err.isOwmAuth = true;
    throw err;
  }

  if (currentRes.status === 404 || forecastRes.status === 404) {
    const err = new Error('City not found');
    err.isNotFound = true;
    throw err;
  }

  // ... normalized into state telemetry
}
```

### 2. Forecast Cards Mapped via `Array.map()`
```javascript
function renderForecast(forecastList) {
  const forecastCardsHtml = forecastList.map((day, index) => {
    const iconHtml = getWeatherIcon(day.iconCode, false);
    const isToday = index === 0;

    return `
      <article class="forecast-card ${isToday ? 'forecast-today' : ''}" data-day-index="${index}">
        <span class="forecast-day">${day.dayName}</span>
        <span class="forecast-date">${day.formattedDate}</span>
        <div class="forecast-icon">${iconHtml}</div>
        <span class="forecast-condition">${day.condition}</span>
        <div class="forecast-temps">
          <span class="temp-max">${formatTemp(day.tempMax)}</span>
          <span class="temp-min">${formatTemp(day.tempMin)}</span>
        </div>
        <div class="forecast-meta">
          <span>💧 ${day.precipChance}%</span>
          <span>💨 ${formatWind(day.windSpeed)}</span>
        </div>
      </article>
    `;
  }).join('');

  elements.forecastCardsContainer.innerHTML = forecastCardsHtml;
}
```

### 3. Dynamic Background Gradients & Micro-Animations
- Adaptive CSS classes (`.theme-sunny`, `.theme-night`, `.theme-rain`, `.theme-clouds`, `.theme-thunder`, `.theme-snow`, `.theme-mist`) update CSS variables smoothly with `transition: background 1s ease`.
- Pure CSS keyframe animations for sun rays spinning (`@keyframes sun-rotate`), rain droplets falling (`@keyframes rain-fall`), and lightning bolts flickering (`@keyframes flash-bolt`).
- Wind compass needle rotates smoothly to match real degree azimuth with `transform: rotate(${deg}deg)`.

---

## 📱 Mobile Responsiveness & Accessibility

- **Fluid Layout**: Uses CSS Flexbox with wrapping (`flex-wrap: wrap`) and responsive CSS Grid with `repeat(auto-fit, minmax(240px, 1fr))`.
- **Fluid Typography**: Dynamic sizing using `clamp()` (e.g. `font-size: clamp(2rem, 4vw, 3rem)`).
- **Semantic HTML5**: Native `<search>`, `<form>`, `<header>`, `<main>`, `<section>`, `<article>`, `<time>`.
- **Screen Reader Support**: ARIA live regions (`aria-live="polite"` and `aria-live="assertive"`), descriptive `aria-label`s, and `aria-busy` state during loading.
- **Keyboard Navigation**: Complete tab indexing with high-contrast `:focus-visible` outlines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
