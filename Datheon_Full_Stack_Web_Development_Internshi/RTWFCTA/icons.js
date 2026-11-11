/**
 * Dynamic SVG Weather & Telemetry Icons
 * Modern scalable vector icons with CSS micro-animations
 * Compatible with both standard script tags and ES Modules
 */

const WeatherIcons = {
  // Clear Day / Sunny
  clearDay: `
    <svg class="weather-svg icon-sun" viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff176"/>
          <stop offset="100%" stop-color="#f57f17"/>
        </radialGradient>
      </defs>
      <g class="sun-rays" stroke="#ffa726" stroke-width="3" stroke-linecap="round">
        <line x1="32" y1="6" x2="32" y2="14" />
        <line x1="32" y1="50" x2="32" y2="58" />
        <line x1="6" y1="32" x2="14" y2="32" />
        <line x1="50" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="19.3" y2="19.3" />
        <line x1="44.7" y1="44.7" x2="50.4" y2="50.4" />
        <line x1="13.6" y1="50.4" x2="19.3" y2="44.7" />
        <line x1="44.7" y1="19.3" x2="50.4" y2="13.6" />
      </g>
      <circle class="sun-core" cx="32" cy="32" r="14" fill="url(#sunGrad)" filter="drop-shadow(0 0 6px rgba(255, 179, 0, 0.6))" />
    </svg>
  `,

  // Clear Night
  clearNight: `
    <svg class="weather-svg icon-moon" viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <path class="moon-body" d="M38 12 A 20 20 0 1 0 52 46 A 24 24 0 0 1 38 12 Z" fill="url(#moonGrad)" filter="drop-shadow(0 0 8px rgba(254, 243, 199, 0.4))" />
      <circle class="star star-1" cx="48" cy="18" r="1.5" fill="#f8fafc" />
      <circle class="star star-2" cx="22" cy="16" r="1" fill="#f8fafc" />
      <circle class="star star-3" cx="54" cy="32" r="1.2" fill="#f8fafc" />
    </svg>
  `,

  // Partly Cloudy Day
  partlyCloudyDay: `
    <svg class="weather-svg icon-partly-cloudy" viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="sunGradHalf" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff176"/>
          <stop offset="100%" stop-color="#f57f17"/>
        </radialGradient>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <g class="sun-behind" transform="translate(6, -2)">
        <circle cx="34" cy="22" r="11" fill="url(#sunGradHalf)" />
        <g stroke="#ffa726" stroke-width="2.5" stroke-linecap="round">
          <line x1="34" y1="4" x2="34" y2="8" />
          <line x1="48" y1="12" x2="52" y2="10" />
          <line x1="50" y1="26" x2="54" y2="28" />
        </g>
      </g>
      <path class="cloud-front" d="M18 48 h28 a10 10 0 0 0 2-19.8 a14 14 0 0 0-26.6-4.6 A9 9 0 0 0 18 48 Z" fill="url(#cloudGrad)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
    </svg>
  `,

  // Partly Cloudy Night
  partlyCloudyNight: `
    <svg class="weather-svg icon-partly-cloudy-night" viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="cloudGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <path class="moon-behind" d="M36 14 A 14 14 0 1 0 47 38 A 17 17 0 0 1 36 14 Z" fill="#fef3c7" />
      <path class="cloud-front" d="M18 48 h28 a10 10 0 0 0 2-19.8 a14 14 0 0 0-26.6-4.6 A9 9 0 0 0 18 48 Z" fill="url(#cloudGradDark)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
    </svg>
  `,

  // Overcast / Cloudy
  overcast: `
    <svg class="weather-svg icon-overcast" viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="cloudGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
        <linearGradient id="cloudGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <path class="cloud-back" d="M24 38 h26 a9 9 0 0 0 1-17.9 a12 12 0 0 0-22.8-3.6 A8 8 0 0 0 24 38 Z" fill="url(#cloudGradBack)" opacity="0.8" />
      <path class="cloud-front" d="M16 50 h30 a10 10 0 0 0 2-19.8 a14 14 0 0 0-26.6-4.6 A9 9 0 0 0 16 50 Z" fill="url(#cloudGradFront)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
    </svg>
  `,

  // Rain
  rain: `
    <svg class="weather-svg icon-rain" viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <path class="cloud-rain" d="M16 42 h30 a10 10 0 0 0 2-19.8 a14 14 0 0 0-26.6-4.6 A9 9 0 0 0 16 42 Z" fill="url(#rainCloudGrad)" />
      <g class="rain-drops" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round">
        <line class="drop drop-1" x1="22" y1="46" x2="19" y2="55" />
        <line class="drop drop-2" x1="32" y1="46" x2="29" y2="57" />
        <line class="drop drop-3" x1="42" y1="46" x2="39" y2="55" />
      </g>
    </svg>
  `,

  // Thunderstorm
  thunderstorm: `
    <svg class="weather-svg icon-thunder" viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="thunderCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#64748b"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <path class="cloud-thunder" d="M16 40 h30 a10 10 0 0 0 2-19.8 a14 14 0 0 0-26.6-4.6 A9 9 0 0 0 16 40 Z" fill="url(#thunderCloud)" />
      <polygon class="lightning-bolt" points="34,36 26,48 33,48 28,60 42,46 35,46" fill="#facc15" filter="drop-shadow(0 0 6px #facc15)" />
    </svg>
  `,

  // Snow
  snow: `
    <svg class="weather-svg icon-snow" viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="snowCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <path class="cloud-snow" d="M16 40 h30 a10 10 0 0 0 2-19.8 a14 14 0 0 0-26.6-4.6 A9 9 0 0 0 16 40 Z" fill="url(#snowCloud)" />
      <g class="snowflakes" fill="#38bdf8">
        <circle cx="23" cy="48" r="2.2" />
        <circle cx="33" cy="54" r="2.2" />
        <circle cx="43" cy="48" r="2.2" />
        <circle cx="28" cy="58" r="1.8" />
        <circle cx="38" cy="58" r="1.8" />
      </g>
    </svg>
  `,

  // Mist / Fog / Haze
  mist: `
    <svg class="weather-svg icon-mist" viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <g stroke="#94a3b8" stroke-width="3" stroke-linecap="round">
        <line class="mist-line mist-1" x1="14" y1="24" x2="50" y2="24" />
        <line class="mist-line mist-2" x1="18" y1="32" x2="46" y2="32" />
        <line class="mist-line mist-3" x1="12" y1="40" x2="52" y2="40" />
        <line class="mist-line mist-4" x1="20" y1="48" x2="44" y2="48" />
      </g>
    </svg>
  `,

  // Telemetry Metric Icons
  humidity: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg>
  `,

  wind: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
    </svg>
  `,

  pressure: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6v6l4 2"></path>
      <path d="M16 12a4 4 0 0 0-8 0"></path>
    </svg>
  `,

  thermometer: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
    </svg>
  `,

  compass: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"></polygon>
    </svg>
  `,

  visibility: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `,

  search: `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,

  gps: `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path>
      <circle cx="12" cy="12" r="8"></circle>
    </svg>
  `,

  settings: `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  `
};

/**
 * Maps condition strings and icon codes to corresponding SVG icons.
 * @param {string} code - OpenWeatherMap icon code (e.g. '01d', '10n') or generic condition name
 * @param {boolean} isNight - Whether current time at location is nighttime
 * @returns {string} SVG HTML markup
 */
function getWeatherIcon(code, isNight = false) {
  if (!code) return WeatherIcons.partlyCloudyDay;

  const normalized = String(code).toLowerCase().trim();

  // Match OWM icon codes
  if (normalized.startsWith('01')) {
    return (normalized.endsWith('n') || isNight) ? WeatherIcons.clearNight : WeatherIcons.clearDay;
  }
  if (normalized.startsWith('02')) {
    return (normalized.endsWith('n') || isNight) ? WeatherIcons.partlyCloudyNight : WeatherIcons.partlyCloudyDay;
  }
  if (normalized.startsWith('03') || normalized.startsWith('04')) {
    return WeatherIcons.overcast;
  }
  if (normalized.startsWith('09') || normalized.startsWith('10')) {
    return WeatherIcons.rain;
  }
  if (normalized.startsWith('11')) {
    return WeatherIcons.thunderstorm;
  }
  if (normalized.startsWith('13')) {
    return WeatherIcons.snow;
  }
  if (normalized.startsWith('50')) {
    return WeatherIcons.mist;
  }

  // Fallback string matching
  if (normalized.includes('thunder') || normalized.includes('lightning')) {
    return WeatherIcons.thunderstorm;
  }
  if (normalized.includes('rain') || normalized.includes('drizzle') || normalized.includes('shower')) {
    return WeatherIcons.rain;
  }
  if (normalized.includes('snow') || normalized.includes('blizzard') || normalized.includes('sleet') || normalized.includes('ice')) {
    return WeatherIcons.snow;
  }
  if (normalized.includes('cloud') || normalized.includes('overcast')) {
    return WeatherIcons.overcast;
  }
  if (normalized.includes('mist') || normalized.includes('fog') || normalized.includes('haze') || normalized.includes('smoke')) {
    return WeatherIcons.mist;
  }
  if (normalized.includes('clear') || normalized.includes('sun')) {
    return isNight ? WeatherIcons.clearNight : WeatherIcons.clearDay;
  }

  return isNight ? WeatherIcons.partlyCloudyNight : WeatherIcons.partlyCloudyDay;
}

// Expose on global window object for universal browser compatibility
if (typeof window !== 'undefined') {
  window.WeatherIcons = WeatherIcons;
  window.getWeatherIcon = getWeatherIcon;
}
