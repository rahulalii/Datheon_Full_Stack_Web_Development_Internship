/**
 * Live Weather Telemetry Application - Core Logic
 * Handles OpenWeatherMap API & Open-Meteo telemetry engine,
 * dynamic SVG icons, Array.map() 5-day forecast rendering,
 * and adaptive background gradients.
 */

// Retrieve Weather Icons from window or global
const WeatherIcons = window.WeatherIcons || {};
const getWeatherIcon = window.getWeatherIcon || function() { return ''; };

// Application State
const state = {
  currentCity: 'London',
  unit: localStorage.getItem('aerometrics_unit') || 'metric', // 'metric' (°C) or 'imperial' (°F)
  owmApiKey: localStorage.getItem('aerometrics_owm_key') || '',
  activeEngine: localStorage.getItem('aerometrics_owm_key') ? 'owm' : 'open-meteo',
  weatherData: null,
  forecastData: [],
  isLoading: false,
  error: null,
  lastSuccessfulQuery: 'London'
};

// DOM Element References
const elements = {
  body: document.body,
  metaThemeColor: document.getElementById('meta-theme-color'),
  searchForm: document.getElementById('search-form'),
  cityInput: document.getElementById('city-input'),
  quickCitiesContainer: document.getElementById('quick-cities-container'),
  btnUnitC: document.getElementById('btn-unit-c'),
  btnUnitF: document.getElementById('btn-unit-f'),
  btnGps: document.getElementById('btn-gps'),
  btnApiConfig: document.getElementById('btn-api-config'),
  providerBadge: document.getElementById('provider-badge'),
  loadingSpinner: document.getElementById('loading-spinner'),
  loadingText: document.getElementById('loading-text'),
  errorBanner: document.getElementById('error-banner'),
  errorTitle: document.getElementById('error-title'),
  errorMessage: document.getElementById('error-message'),
  errorRetryBtn: document.getElementById('error-retry-btn'),
  errorDismissBtn: document.getElementById('error-dismiss-btn'),
  mainContent: document.getElementById('main-content'),

  // Hero Card Elements
  cityName: document.getElementById('city-name'),
  countryCode: document.getElementById('country-code'),
  localTime: document.getElementById('local-time'),
  stationCoords: document.getElementById('station-coords'),
  currentTempValue: document.getElementById('current-temp-value'),
  heroUnitSymbol: document.getElementById('hero-unit-symbol'),
  weatherConditionDesc: document.getElementById('weather-condition-desc'),
  feelsLikeValue: document.getElementById('feels-like-value'),
  tempHighValue: document.getElementById('temp-high-value'),
  tempLowValue: document.getElementById('temp-low-value'),
  heroWeatherIcon: document.getElementById('hero-weather-icon'),

  // Telemetry Metric Elements
  humidityVal: document.getElementById('humidity-val'),
  humidityComfort: document.getElementById('humidity-comfort'),
  humidityMeterBar: document.getElementById('humidity-meter-bar'),
  windVal: document.getElementById('wind-val'),
  windUnitLabel: document.getElementById('wind-unit-label'),
  windGustLabel: document.getElementById('wind-gust-label'),
  windDirectionText: document.getElementById('wind-direction-text'),
  compassArrow: document.getElementById('compass-arrow'),
  pressureVal: document.getElementById('pressure-val'),
  pressureStatus: document.getElementById('pressure-status'),
  visibilityVal: document.getElementById('visibility-val'),
  visibilityUnitLabel: document.getElementById('visibility-unit-label'),
  visibilityRating: document.getElementById('visibility-rating'),
  visibilityDesc: document.getElementById('visibility-desc'),

  // Forecast Container
  forecastCardsContainer: document.getElementById('forecast-cards-container'),

  // Decorative Icon Slots
  searchIconSlot: document.getElementById('search-icon-slot'),
  gpsIconSlot: document.getElementById('gps-icon-slot'),
  settingsIconSlot: document.getElementById('settings-icon-slot'),
  humidityIconSlot: document.getElementById('humidity-icon-slot'),
  windIconSlot: document.getElementById('wind-icon-slot'),
  pressureIconSlot: document.getElementById('pressure-icon-slot'),
  visibilityIconSlot: document.getElementById('visibility-icon-slot'),

  // API Config Modal Elements
  apiModal: document.getElementById('api-modal'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  inputOwmKey: document.getElementById('input-owm-key'),
  modalSaveKeyBtn: document.getElementById('modal-save-key-btn'),
  modalUseOpenmeteoBtn: document.getElementById('modal-use-openmeteo-btn')
};

// Inject UI Vector Icons into decorative slots
function populateDecorativeIcons() {
  if (elements.searchIconSlot) elements.searchIconSlot.innerHTML = WeatherIcons.search || '';
  if (elements.gpsIconSlot) elements.gpsIconSlot.innerHTML = WeatherIcons.gps || '';
  if (elements.settingsIconSlot) elements.settingsIconSlot.innerHTML = WeatherIcons.settings || '';
  if (elements.humidityIconSlot) elements.humidityIconSlot.innerHTML = WeatherIcons.humidity || '';
  if (elements.windIconSlot) elements.windIconSlot.innerHTML = WeatherIcons.wind || '';
  if (elements.pressureIconSlot) elements.pressureIconSlot.innerHTML = WeatherIcons.pressure || '';
  if (elements.visibilityIconSlot) elements.visibilityIconSlot.innerHTML = WeatherIcons.visibility || '';
}

/**
 * Format Temperature based on active unit
 */
function formatTemp(tempC) {
  if (tempC === null || tempC === undefined) return '--';
  if (state.unit === 'imperial') {
    const tempF = Math.round((tempC * 9) / 5 + 32);
    return `${tempF}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

/**
 * Format Wind Speed based on active unit
 */
function formatWind(speedKmh) {
  if (speedKmh === null || speedKmh === undefined) return '--';
  if (state.unit === 'imperial') {
    const speedMph = (speedKmh * 0.621371).toFixed(1);
    return `${speedMph} mph`;
  }
  return `${Number(speedKmh).toFixed(1)} km/h`;
}

/**
 * Converts wind azimuth in degrees to 16-point cardinal string
 */
function degToCardinal(deg) {
  if (deg === undefined || deg === null) return 'N/A';
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return arr[val % 16];
}

/**
 * Categorize humidity level for telemetry status
 */
function getHumidityCategory(percentage) {
  if (percentage < 30) return 'Dry Atmosphere';
  if (percentage <= 60) return 'Optimal Comfort';
  if (percentage <= 80) return 'Elevated Moisture';
  return 'Saturated / Humid';
}

/**
 * Categorize atmospheric pressure
 */
function getPressureStatus(pressureHpa) {
  if (pressureHpa < 1000) return 'Low (Storm Tendency)';
  if (pressureHpa <= 1020) return 'Standard Barometric';
  return 'High (Stable Anticyclone)';
}

/**
 * Categorize visibility
 */
function getVisibilityCategory(distanceKm) {
  if (distanceKm < 1) return { rating: 'Dense Fog', desc: 'Severe optical obstruction' };
  if (distanceKm < 4) return { rating: 'Mist / Haze', desc: 'Reduced optical clarity' };
  if (distanceKm < 10) return { rating: 'Moderate', desc: 'Typical urban horizon' };
  return { rating: 'Clear Horizon', desc: 'Unobstructed visual range' };
}

/* ==========================================================================
   Asynchronous Telemetry Fetching (Async / Await with Try-Catch)
   ========================================================================== */

/**
 * Primary telemetry controller: switches between OpenWeatherMap and Open-Meteo
 * @param {string} city - Target city name
 */
async function fetchWeatherTelemetry(city) {
  if (!city || !city.trim()) {
    showError('Search Term Missing', 'Please enter a global city name before querying.');
    return;
  }

  const query = city.trim();
  setLoading(true, `Querying atmospheric telemetry for ${query}...`);
  hideError();

  try {
    let result;
    if (state.owmApiKey && state.activeEngine === 'owm') {
      result = await fetchFromOpenWeatherMap(query, state.owmApiKey);
    } else {
      result = await fetchFromOpenMeteo(query);
    }

    state.weatherData = result.current;
    state.forecastData = result.forecast;
    state.currentCity = result.current.cityName;
    state.lastSuccessfulQuery = result.current.cityName;

    // Render Dashboard
    renderCurrentWeather(state.weatherData);
    renderForecast(state.forecastData);
    updateBackgroundTheme(state.weatherData.conditionCategory, state.weatherData.isNight);
    updateEngineBadge();
    setLoading(false);
  } catch (err) {
    setLoading(false);
    console.error('Weather Telemetry Retrieval Failed:', err);

    // If OWM failed with 401 (invalid/inactive key), suggest Open-Meteo fallback
    if (err.isOwmAuth) {
      showError(
        'OpenWeatherMap Key Activation Issue',
        'Your OpenWeatherMap key is either invalid or still activating (new keys can take up to 60 mins). You can switch to the Open-Meteo engine for instant live data.',
        true
      );
    } else if (err.isNotFound) {
      showError(
        'City Not Found',
        `No meteorological telemetry found for "${query}". Please check spelling or search a major neighboring city.`
      );
    } else {
      // Offline fallback attempt
      const offlineFallback = getOfflineTelemetry(query);
      if (offlineFallback) {
        state.weatherData = offlineFallback.current;
        state.forecastData = offlineFallback.forecast;
        state.currentCity = offlineFallback.current.cityName;
        renderCurrentWeather(state.weatherData);
        renderForecast(state.forecastData);
        updateBackgroundTheme(state.weatherData.conditionCategory, state.weatherData.isNight);
        showError(
          'Operating in Cached Demo Mode',
          'Live network connection unreachable. Displaying cached high-resolution telemetry simulation.'
        );
      } else {
        showError(
          'Network Communication Failure',
          'Failed to reach weather servers. Please verify your internet connection and try again.'
        );
      }
    }
  }
}

/**
 * Fetch from OpenWeatherMap API (Current weather + 5-Day forecast)
 */
async function fetchFromOpenWeatherMap(city, apiKey) {
  // Current weather endpoint
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
    const err = new Error('City not found on OpenWeatherMap');
    err.isNotFound = true;
    throw err;
  }

  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error(`OpenWeatherMap request failed: ${currentRes.status} / ${forecastRes.status}`);
  }

  const currentJson = await currentRes.json();
  const forecastJson = await forecastRes.json();

  // Normalize current weather
  const weatherItem = currentJson.weather[0] || {};
  const isNight = weatherItem.icon ? weatherItem.icon.endsWith('n') : false;
  const conditionCat = mapOwmCategory(weatherItem.main, weatherItem.id);

  // Calculate local time from timezone offset
  const localTimestamp = (currentJson.dt + (currentJson.timezone || 0)) * 1000;
  const localDate = new Date(localTimestamp);
  const timeString = localDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

  const current = {
    cityName: currentJson.name,
    countryCode: currentJson.sys ? currentJson.sys.country : '',
    coords: `${currentJson.coord.lat.toFixed(2)}°N, ${currentJson.coord.lon.toFixed(2)}°E`,
    localTime: `${timeString} (UTC${formatUtcOffset(currentJson.timezone)})`,
    tempC: currentJson.main.temp,
    feelsLikeC: currentJson.main.feels_like,
    tempHighC: currentJson.main.temp_max,
    tempLowC: currentJson.main.temp_min,
    condition: weatherItem.description || weatherItem.main || 'Clear',
    conditionCategory: conditionCat,
    iconCode: weatherItem.icon || '01d',
    isNight: isNight,
    humidity: currentJson.main.humidity,
    windSpeedKmh: (currentJson.wind.speed * 3.6), // convert m/s to km/h
    windDeg: currentJson.wind.deg || 0,
    pressureHpa: currentJson.main.pressure,
    visibilityKm: currentJson.visibility ? (currentJson.visibility / 1000).toFixed(1) : '10.0'
  };

  // Process 5-day forecast list by grouping 3-hour forecasts by day
  const dailyGroups = {};
  forecastJson.list.forEach(entry => {
    const dateKey = entry.dt_txt.split(' ')[0];
    if (!dailyGroups[dateKey]) {
      dailyGroups[dateKey] = [];
    }
    dailyGroups[dateKey].push(entry);
  });

  const forecast = Object.keys(dailyGroups).slice(0, 5).map(dateKey => {
    const entries = dailyGroups[dateKey];
    // Find entry closest to midday (12:00:00)
    let middayEntry = entries.find(e => e.dt_txt.includes('12:00:00')) || entries[Math.floor(entries.length / 2)];

    let min = Infinity;
    let max = -Infinity;
    entries.forEach(e => {
      if (e.main.temp_min < min) min = e.main.temp_min;
      if (e.main.temp_max > max) max = e.main.temp_max;
    });

    const d = new Date(dateKey + 'T12:00:00Z');
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

    const wItem = middayEntry.weather[0] || {};
    return {
      dayName: dayName,
      formattedDate: formattedDate,
      tempMax: max,
      tempMin: min,
      condition: wItem.description || wItem.main || 'Sunny',
      iconCode: wItem.icon || '01d',
      precipChance: Math.round((middayEntry.pop || 0) * 100),
      windSpeed: (middayEntry.wind.speed * 3.6).toFixed(0)
    };
  });

  return { current, forecast };
}

/**
 * Fetch from Open-Meteo Engine (Zero-Configuration, Free, No API Key Required)
 */
async function fetchFromOpenMeteo(city) {
  // 1. Geocoding search
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) throw new Error('Geocoding service unavailable');

  const geoJson = await geoRes.json();
  if (!geoJson.results || geoJson.results.length === 0) {
    const err = new Error('City not found');
    err.isNotFound = true;
    throw err;
  }

  const loc = geoJson.results[0];
  const { latitude, longitude, name, country_code } = loc;

  // 2. Weather & Forecast
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  const weatherRes = await fetch(weatherUrl);
  if (!weatherRes.ok) throw new Error('Open-Meteo forecast failed');

  const data = await weatherRes.json();
  const currentRaw = data.current;
  const isNight = currentRaw.is_day === 0;
  const weatherMeta = parseWmoCode(currentRaw.weather_code, isNight);

  const localTimeObj = new Date(currentRaw.time);
  const timeFormatted = isNaN(localTimeObj) ? 'Live' : localTimeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const current = {
    cityName: name,
    countryCode: country_code || '',
    coords: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
    localTime: `${timeFormatted} Local`,
    tempC: currentRaw.temperature_2m,
    feelsLikeC: currentRaw.apparent_temperature,
    tempHighC: data.daily.temperature_2m_max[0],
    tempLowC: data.daily.temperature_2m_min[0],
    condition: weatherMeta.desc,
    conditionCategory: weatherMeta.category,
    iconCode: weatherMeta.iconCode,
    isNight: isNight,
    humidity: currentRaw.relative_humidity_2m,
    windSpeedKmh: currentRaw.wind_speed_10m,
    windDeg: currentRaw.wind_direction_10m,
    pressureHpa: Math.round(currentRaw.surface_pressure),
    visibilityKm: '10.0'
  };

  // 5-day daily forecast
  const daily = data.daily;
  const forecast = [];
  const daysToMap = Math.min(5, daily.time.length);

  for (let i = 0; i < daysToMap; i++) {
    const dateObj = new Date(daily.time[i] + 'T12:00:00');
    const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dMeta = parseWmoCode(daily.weather_code[i], false);

    forecast.push({
      dayName: dayName,
      formattedDate: formattedDate,
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      condition: dMeta.desc,
      iconCode: dMeta.iconCode,
      precipChance: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
      windSpeed: daily.wind_speed_10m_max ? daily.wind_speed_10m_max[i] : 0
    });
  }

  return { current, forecast };
}

/**
 * WMO Weather Code interpreter (converts code to description, category, and icon)
 */
function parseWmoCode(code, isNight) {
  switch (code) {
    case 0:
      return { desc: 'Clear Sky', category: 'sunny', iconCode: isNight ? '01n' : '01d' };
    case 1:
      return { desc: 'Mainly Clear', category: 'sunny', iconCode: isNight ? '01n' : '01d' };
    case 2:
      return { desc: 'Partly Cloudy', category: 'clouds', iconCode: isNight ? '02n' : '02d' };
    case 3:
      return { desc: 'Overcast', category: 'clouds', iconCode: isNight ? '04n' : '04d' };
    case 45:
    case 48:
      return { desc: 'Fog & Mist', category: 'mist', iconCode: '50d' };
    case 51:
    case 53:
    case 55:
      return { desc: 'Light Drizzle', category: 'rain', iconCode: '09d' };
    case 61:
    case 63:
      return { desc: 'Moderate Rain', category: 'rain', iconCode: '10d' };
    case 65:
      return { desc: 'Heavy Rain', category: 'rain', iconCode: '10d' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { desc: 'Snowfall', category: 'snow', iconCode: '13d' };
    case 80:
    case 81:
    case 82:
      return { desc: 'Rain Showers', category: 'rain', iconCode: '09d' };
    case 85:
    case 86:
      return { desc: 'Snow Showers', category: 'snow', iconCode: '13d' };
    case 95:
    case 96:
    case 99:
      return { desc: 'Thunderstorm', category: 'thunder', iconCode: '11d' };
    default:
      return { desc: 'Scattered Clouds', category: 'clouds', iconCode: isNight ? '03n' : '03d' };
  }
}

/**
 * Maps OWM conditions to broad categories
 */
function mapOwmCategory(mainText, id) {
  if (!mainText) return 'sunny';
  const main = mainText.toLowerCase();
  if (main.includes('thunder')) return 'thunder';
  if (main.includes('rain') || main.includes('drizzle')) return 'rain';
  if (main.includes('snow')) return 'snow';
  if (main.includes('mist') || main.includes('fog') || main.includes('haze') || main.includes('smoke')) return 'mist';
  if (main.includes('cloud')) return 'clouds';
  return 'sunny';
}

function formatUtcOffset(offsetSeconds) {
  if (!offsetSeconds && offsetSeconds !== 0) return '';
  const hours = offsetSeconds / 3600;
  const sign = hours >= 0 ? '+' : '';
  return `${sign}${hours}`;
}

/* ==========================================================================
   UI Rendering: Hero, Metrics & 5-Day Forecast (Array.map())
   ========================================================================== */

/**
 * Render Current Weather Telemetry in Hero and Metric Cards
 */
function renderCurrentWeather(data) {
  if (!data) return;

  // Hero Card
  elements.cityName.textContent = data.cityName;
  elements.countryCode.textContent = data.countryCode || '--';
  elements.localTime.textContent = data.localTime;
  elements.stationCoords.textContent = data.coords;

  elements.currentTempValue.textContent = Math.round(state.unit === 'imperial' ? (data.tempC * 9/5 + 32) : data.tempC);
  elements.heroUnitSymbol.textContent = state.unit === 'imperial' ? '°F' : '°C';
  elements.weatherConditionDesc.textContent = data.condition;
  elements.feelsLikeValue.textContent = formatTemp(data.feelsLikeC);
  elements.tempHighValue.textContent = formatTemp(data.tempHighC);
  elements.tempLowValue.textContent = formatTemp(data.tempLowC);

  // Dynamic SVG Weather Icon
  elements.heroWeatherIcon.innerHTML = getWeatherIcon(data.iconCode, data.isNight);

  // Metric 1: Humidity
  elements.humidityVal.textContent = data.humidity;
  elements.humidityComfort.textContent = getHumidityCategory(data.humidity);
  elements.humidityMeterBar.style.width = `${Math.min(100, Math.max(0, data.humidity))}%`;

  // Metric 2: Wind Speed & Direction
  elements.windVal.textContent = state.unit === 'imperial' ? (data.windSpeedKmh * 0.621371).toFixed(1) : data.windSpeedKmh.toFixed(1);
  elements.windUnitLabel.textContent = state.unit === 'imperial' ? 'mph' : 'km/h';
  const cardinal = degToCardinal(data.windDeg);
  elements.windDirectionText.textContent = `${cardinal} (${data.windDeg}°)`;
  elements.compassArrow.style.transform = `rotate(${data.windDeg}deg)`;
  elements.windGustLabel.textContent = data.windSpeedKmh > 35 ? 'Strong Winds Detected' : 'Nominal Velocity';

  // Metric 3: Pressure
  elements.pressureVal.textContent = data.pressureHpa;
  elements.pressureStatus.textContent = getPressureStatus(data.pressureHpa);

  // Metric 4: Visibility
  const visNum = parseFloat(data.visibilityKm);
  const visRating = getVisibilityCategory(visNum);
  elements.visibilityVal.textContent = state.unit === 'imperial' ? (visNum * 0.621371).toFixed(1) : visNum.toFixed(1);
  elements.visibilityUnitLabel.textContent = state.unit === 'imperial' ? 'mi' : 'km';
  elements.visibilityRating.textContent = visRating.rating;
  elements.visibilityDesc.textContent = visRating.desc;
}

/**
 * Render 5-Day Forecast using Array.map() as required by prompt
 * @param {Array} forecastList - Array of 5 day telemetry objects
 */
function renderForecast(forecastList) {
  if (!forecastList || forecastList.length === 0) {
    elements.forecastCardsContainer.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">No forecast data available.</p>';
    return;
  }

  // Display 5-day forecast cards using Array.map()
  const forecastCardsHtml = forecastList.map((day, index) => {
    const iconHtml = getWeatherIcon(day.iconCode, false);
    const isToday = index === 0;

    return `
      <article class="forecast-card ${isToday ? 'forecast-today' : ''}" data-day-index="${index}" aria-label="Forecast for ${day.dayName}">
        <span class="forecast-day">${day.dayName}</span>
        <span class="forecast-date">${day.formattedDate}</span>
        <div class="forecast-icon" role="img" aria-label="${day.condition}">
          ${iconHtml}
        </div>
        <span class="forecast-condition">${day.condition}</span>
        <div class="forecast-temps">
          <span class="temp-max">${formatTemp(day.tempMax)}</span>
          <span class="temp-min">${formatTemp(day.tempMin)}</span>
        </div>
        <div class="forecast-meta">
          <span title="Precipitation Probability">💧 ${day.precipChance}%</span>
          <span title="Peak Wind Speed">💨 ${formatWind(day.windSpeed)}</span>
        </div>
      </article>
    `;
  }).join('');

  elements.forecastCardsContainer.innerHTML = forecastCardsHtml;
}

/**
 * Dynamically updates body background gradient and theme-color meta tag
 * based on condition category and whether it's night or day.
 */
function updateBackgroundTheme(category, isNight) {
  // Remove all previous theme classes
  elements.body.classList.remove(
    'theme-sunny',
    'theme-night',
    'theme-rain',
    'theme-clouds',
    'theme-thunder',
    'theme-snow',
    'theme-mist'
  );

  let appliedTheme = 'theme-sunny';
  let metaColor = '#0284c7';

  if (isNight) {
    appliedTheme = 'theme-night';
    metaColor = '#050814';
  } else {
    switch (category) {
      case 'rain':
        appliedTheme = 'theme-rain';
        metaColor = '#0f172a';
        break;
      case 'thunder':
        appliedTheme = 'theme-thunder';
        metaColor = '#18002e';
        break;
      case 'snow':
        appliedTheme = 'theme-snow';
        metaColor = '#1e3a8a';
        break;
      case 'clouds':
        appliedTheme = 'theme-clouds';
        metaColor = '#334155';
        break;
      case 'mist':
        appliedTheme = 'theme-mist';
        metaColor = '#1f2937';
        break;
      case 'sunny':
      default:
        appliedTheme = 'theme-sunny';
        metaColor = '#0284c7';
        break;
    }
  }

  elements.body.classList.add(appliedTheme);
  if (elements.metaThemeColor) {
    elements.metaThemeColor.setAttribute('content', metaColor);
  }
}

/**
 * Update the active engine pill in header
 */
function updateEngineBadge() {
  if (state.owmApiKey && state.activeEngine === 'owm') {
    elements.providerBadge.textContent = 'Engine: OpenWeatherMap 2.5';
    elements.providerBadge.style.color = '#38bdf8';
    elements.providerBadge.style.borderColor = 'rgba(56, 189, 248, 0.4)';
  } else {
    elements.providerBadge.textContent = 'Engine: Open-Meteo (Zero-Config)';
    elements.providerBadge.style.color = '#34d399';
    elements.providerBadge.style.borderColor = 'rgba(52, 211, 153, 0.4)';
  }
}

/* ==========================================================================
   Loading & Error Handling
   ========================================================================== */

function setLoading(isLoading, message = 'Acquiring telemetry...') {
  state.isLoading = isLoading;
  if (isLoading) {
    elements.loadingSpinner.classList.remove('hidden');
    elements.loadingText.textContent = message;
    elements.mainContent.style.opacity = '0.4';
    elements.mainContent.setAttribute('aria-busy', 'true');
  } else {
    elements.loadingSpinner.classList.add('hidden');
    elements.mainContent.style.opacity = '1';
    elements.mainContent.removeAttribute('aria-busy');
  }
}

function showError(title, message, isAuth = false) {
  elements.errorBanner.classList.remove('hidden');
  elements.errorTitle.textContent = title;
  elements.errorMessage.textContent = message;

  if (isAuth) {
    elements.errorRetryBtn.textContent = 'Switch to Open-Meteo';
    elements.errorRetryBtn.onclick = () => {
      state.activeEngine = 'open-meteo';
      hideError();
      fetchWeatherTelemetry(state.currentCity || 'London');
    };
  } else {
    elements.errorRetryBtn.textContent = 'Retry Station';
    elements.errorRetryBtn.onclick = () => {
      hideError();
      fetchWeatherTelemetry(state.lastSuccessfulQuery || 'London');
    };
  }
}

function hideError() {
  elements.errorBanner.classList.add('hidden');
}

/* ==========================================================================
   Offline Realistic Demo Fallback Generator
   ========================================================================== */

function getOfflineTelemetry(city) {
  const norm = (city || '').toLowerCase().trim();
  const database = {
    london: {
      cityName: 'London',
      countryCode: 'GB',
      coords: '51.51°N, 0.13°W',
      localTime: '12:00 PM Local',
      tempC: 18,
      feelsLikeC: 17,
      tempHighC: 21,
      tempLowC: 12,
      condition: 'Partly Cloudy',
      conditionCategory: 'clouds',
      iconCode: '02d',
      isNight: false,
      humidity: 62,
      windSpeedKmh: 14.5,
      windDeg: 45,
      pressureHpa: 1014,
      visibilityKm: '10.0'
    },
    tokyo: {
      cityName: 'Tokyo',
      countryCode: 'JP',
      coords: '35.68°N, 139.76°E',
      localTime: '9:00 PM Local',
      tempC: 22,
      feelsLikeC: 23,
      tempHighC: 26,
      tempLowC: 19,
      condition: 'Clear Night',
      conditionCategory: 'sunny',
      iconCode: '01n',
      isNight: true,
      humidity: 55,
      windSpeedKmh: 11.2,
      windDeg: 130,
      pressureHpa: 1018,
      visibilityKm: '10.0'
    },
    'new york': {
      cityName: 'New York',
      countryCode: 'US',
      coords: '40.71°N, 74.01°W',
      localTime: '8:00 AM Local',
      tempC: 24,
      feelsLikeC: 25,
      tempHighC: 28,
      tempLowC: 18,
      condition: 'Sunny & Bright',
      conditionCategory: 'sunny',
      iconCode: '01d',
      isNight: false,
      humidity: 48,
      windSpeedKmh: 16.0,
      windDeg: 280,
      pressureHpa: 1012,
      visibilityKm: '10.0'
    },
    paris: {
      cityName: 'Paris',
      countryCode: 'FR',
      coords: '48.86°N, 2.35°E',
      localTime: '1:00 PM Local',
      tempC: 19,
      feelsLikeC: 19,
      tempHighC: 22,
      tempLowC: 13,
      condition: 'Scattered Showers',
      conditionCategory: 'rain',
      iconCode: '10d',
      isNight: false,
      humidity: 78,
      windSpeedKmh: 20.4,
      windDeg: 210,
      pressureHpa: 1008,
      visibilityKm: '8.5'
    },
    sydney: {
      cityName: 'Sydney',
      countryCode: 'AU',
      coords: '33.87°S, 151.21°E',
      localTime: '10:00 PM Local',
      tempC: 17,
      feelsLikeC: 16,
      tempHighC: 20,
      tempLowC: 14,
      condition: 'Overcast Cloud Cover',
      conditionCategory: 'clouds',
      iconCode: '04n',
      isNight: true,
      humidity: 68,
      windSpeedKmh: 18.0,
      windDeg: 160,
      pressureHpa: 1022,
      visibilityKm: '10.0'
    },
    mumbai: {
      cityName: 'Mumbai',
      countryCode: 'IN',
      coords: '19.08°N, 72.88°E',
      localTime: '5:30 PM Local',
      tempC: 31,
      feelsLikeC: 36,
      tempHighC: 34,
      tempLowC: 27,
      condition: 'Tropical Thunderstorm',
      conditionCategory: 'thunder',
      iconCode: '11d',
      isNight: false,
      humidity: 84,
      windSpeedKmh: 28.0,
      windDeg: 240,
      pressureHpa: 1004,
      visibilityKm: '6.0'
    }
  };

  const current = database[norm] || database['london'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIdx = new Date().getDay();

  const forecast = [
    { dayName: 'Today', formattedDate: 'Current', tempMax: current.tempHighC, tempMin: current.tempLowC, condition: current.condition, iconCode: current.iconCode, precipChance: 20, windSpeed: 15 },
    { dayName: days[(todayIdx + 1) % 7], formattedDate: 'Day 2', tempMax: current.tempHighC + 1, tempMin: current.tempLowC, condition: 'Partly Cloudy', iconCode: '02d', precipChance: 10, windSpeed: 12 },
    { dayName: days[(todayIdx + 2) % 7], formattedDate: 'Day 3', tempMax: current.tempHighC - 2, tempMin: current.tempLowC - 1, condition: 'Light Rain', iconCode: '10d', precipChance: 65, windSpeed: 22 },
    { dayName: days[(todayIdx + 3) % 7], formattedDate: 'Day 4', tempMax: current.tempHighC + 2, tempMin: current.tempLowC + 1, condition: 'Clear Sky', iconCode: '01d', precipChance: 5, windSpeed: 9 },
    { dayName: days[(todayIdx + 4) % 7], formattedDate: 'Day 5', tempMax: current.tempHighC, tempMin: current.tempLowC, condition: 'Scattered Clouds', iconCode: '03d', precipChance: 15, windSpeed: 14 }
  ];

  return { current, forecast };
}

/* ==========================================================================
   Event Listeners & User Interaction
   ========================================================================== */

function setupEventListeners() {
  // 1. Search Form Submission
  elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = elements.cityInput.value.trim();
    if (city) {
      fetchWeatherTelemetry(city);
    }
  });

  // 2. Quick City Pill Selectors
  elements.quickCitiesContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.city-pill');
    if (pill && pill.dataset.city) {
      elements.cityInput.value = pill.dataset.city;
      fetchWeatherTelemetry(pill.dataset.city);
    }
  });

  // 3. Unit Toggle (°C / °F)
  elements.btnUnitC.addEventListener('click', () => {
    if (state.unit !== 'metric') {
      state.unit = 'metric';
      localStorage.setItem('aerometrics_unit', 'metric');
      elements.btnUnitC.classList.add('active');
      elements.btnUnitC.setAttribute('aria-pressed', 'true');
      elements.btnUnitF.classList.remove('active');
      elements.btnUnitF.setAttribute('aria-pressed', 'false');
      renderCurrentWeather(state.weatherData);
      renderForecast(state.forecastData);
    }
  });

  elements.btnUnitF.addEventListener('click', () => {
    if (state.unit !== 'imperial') {
      state.unit = 'imperial';
      localStorage.setItem('aerometrics_unit', 'imperial');
      elements.btnUnitF.classList.add('active');
      elements.btnUnitF.setAttribute('aria-pressed', 'true');
      elements.btnUnitC.classList.remove('active');
      elements.btnUnitC.setAttribute('aria-pressed', 'false');
      renderCurrentWeather(state.weatherData);
      renderForecast(state.forecastData);
    }
  });

  // 4. GPS Geolocation
  elements.btnGps.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showError('GPS Not Supported', 'Geolocation is not supported by your current browser.');
      return;
    }

    setLoading(true, 'Triangulating telemetry station coordinates...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode via Open-Meteo or fetch coordinates
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed to fetch GPS coordinates');
          
          // Reverse lookup city name
          const revUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${latitude.toFixed(2)},${longitude.toFixed(2)}&count=1`;
          const revRes = await fetch(revUrl).catch(() => null);
          let detectedName = 'Local GPS Station';
          if (revRes && revRes.ok) {
            const revData = await revRes.json();
            if (revData.results && revData.results[0]) {
              detectedName = revData.results[0].name;
            }
          }

          const data = await res.json();
          const currentRaw = data.current;
          const isNight = currentRaw.is_day === 0;
          const meta = parseWmoCode(currentRaw.weather_code, isNight);

          state.weatherData = {
            cityName: detectedName,
            countryCode: 'GPS',
            coords: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
            localTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            tempC: currentRaw.temperature_2m,
            feelsLikeC: currentRaw.apparent_temperature,
            tempHighC: data.daily.temperature_2m_max[0],
            tempLowC: data.daily.temperature_2m_min[0],
            condition: meta.desc,
            conditionCategory: meta.category,
            iconCode: meta.iconCode,
            isNight: isNight,
            humidity: currentRaw.relative_humidity_2m,
            windSpeedKmh: currentRaw.wind_speed_10m,
            windDeg: currentRaw.wind_direction_10m,
            pressureHpa: Math.round(currentRaw.surface_pressure),
            visibilityKm: '10.0'
          };

          const daily = data.daily;
          state.forecastData = daily.time.slice(0, 5).map((t, i) => {
            const dateObj = new Date(t + 'T12:00:00');
            const dMeta = parseWmoCode(daily.weather_code[i], false);
            return {
              dayName: i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
              formattedDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              tempMax: daily.temperature_2m_max[i],
              tempMin: daily.temperature_2m_min[i],
              condition: dMeta.desc,
              iconCode: dMeta.iconCode,
              precipChance: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
              windSpeed: daily.wind_speed_10m_max ? daily.wind_speed_10m_max[i] : 0
            };
          });

          renderCurrentWeather(state.weatherData);
          renderForecast(state.forecastData);
          updateBackgroundTheme(state.weatherData.conditionCategory, state.weatherData.isNight);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          showError('GPS Fetch Error', 'Unable to retrieve meteorological metrics for your current coordinates.');
        }
      },
      (err) => {
        setLoading(false);
        showError('GPS Access Denied', 'Location permission was denied. You can search any city by name.');
      },
      { timeout: 10000 }
    );
  });

  // 5. API Modal Triggers
  elements.btnApiConfig.addEventListener('click', () => {
    elements.inputOwmKey.value = state.owmApiKey || '';
    elements.apiModal.classList.remove('hidden');
    elements.inputOwmKey.focus();
  });

  elements.modalCloseBtn.addEventListener('click', () => {
    elements.apiModal.classList.add('hidden');
  });

  elements.apiModal.addEventListener('click', (e) => {
    if (e.target === elements.apiModal) {
      elements.apiModal.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.apiModal.classList.contains('hidden')) {
      elements.apiModal.classList.add('hidden');
    }
  });

  elements.modalSaveKeyBtn.addEventListener('click', () => {
    const key = elements.inputOwmKey.value.trim();
    if (key) {
      state.owmApiKey = key;
      state.activeEngine = 'owm';
      localStorage.setItem('aerometrics_owm_key', key);
    } else {
      state.owmApiKey = '';
      state.activeEngine = 'open-meteo';
      localStorage.removeItem('aerometrics_owm_key');
    }
    elements.apiModal.classList.add('hidden');
    updateEngineBadge();
    fetchWeatherTelemetry(state.currentCity || 'London');
  });

  elements.modalUseOpenmeteoBtn.addEventListener('click', () => {
    state.activeEngine = 'open-meteo';
    elements.apiModal.classList.add('hidden');
    updateEngineBadge();
    fetchWeatherTelemetry(state.currentCity || 'London');
  });

  // 6. Dismiss error banner
  elements.errorDismissBtn.addEventListener('click', hideError);
}

// Initialization function
function init() {
  populateDecorativeIcons();
  setupEventListeners();

  // Initialize temperature unit buttons
  if (state.unit === 'imperial') {
    elements.btnUnitF.classList.add('active');
    elements.btnUnitF.setAttribute('aria-pressed', 'true');
    elements.btnUnitC.classList.remove('active');
    elements.btnUnitC.setAttribute('aria-pressed', 'false');
  }

  updateEngineBadge();

  // Load initial city telemetry
  fetchWeatherTelemetry(state.currentCity);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
