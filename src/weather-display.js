import weatherData from './weather-data.js'

const UI = (function () {
  //html elements, units and dom manipulation
  const tempUnit = "&deg;C";
  const tempUnitSup = "<sup>&degC</sup>";
  const windUnit = " km/h";
  const probabilityUnit = "%";
  const dayNames = ["Today", "Tomorrow"];
  const searchBar = document.querySelector('input[type="search"]');
  const hourlyForecastContainer = document.querySelector('.weather-hours');
  const currentWeatherLogoContainer = document.querySelector('.today-temperature');
  const appHeader = document.querySelector('.app-header');
  const currentWeatherIcon = new Image();
  currentWeatherIcon.classList.add('weather-icon');
  //data storage and updating
  const tempIntervals = [];
  const hourlyTemperatures = [];
  const hourlyChancesOfRain = [];
  const hours = [];
  const hourlyWeatherIcons = [];
  const nextDaysChancesOfRain = [];
  const nextDaysWeatherLogo = [];
  let currentIndex;
  let currentHour;
  const cardsToShow = 4;

  async function searchLocation() {
    try {
      const searchInput = document.getElementById('search');
      const location = searchInput.value;

      if (location) {
        const data = await weatherData.fetchWeatherData(location);
        updateWeatherData(data);
        removeErrorMessage()
        return data;
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      removeErrorMessage()
      createErrorMessage()
    }
  }

  function updateWeatherData(weatherData) {
    document.querySelector('.location').textContent = weatherData.current.location;
    document.querySelector('.date').textContent = weatherData.current.formattedLocalTime;
    document.querySelector('.today-degrees').innerHTML = weatherData.current.temperatureCelsius + tempUnitSup;
    document.querySelector('.current-hour').textContent = weatherData.current.formattedLocalHour;
    document.querySelector('.current-temp-interval').innerHTML = tempIntervals[0];
    document.querySelector('.current-weather-condition').textContent = weatherData.current.weatherCondition;
    document.querySelector('.sunrise-hour').textContent = weatherData.current.sunrise;
    document.querySelector('.sunset-hour').textContent = weatherData.current.sunset;
    document.getElementById('perceived-temperature-value').innerHTML = weatherData.currentDetails.perceivedTemperature + tempUnit;
    document.getElementById('rain-probability-value').textContent = weatherData.currentDetails.currentRainProbability + probabilityUnit;
    document.getElementById('wind-speed-value').textContent = weatherData.currentDetails.windSpeed + windUnit;
    document.getElementById('air-humidity-value').textContent = weatherData.currentDetails.airHumidity + probabilityUnit;
    document.getElementById('uv-index-value').textContent = weatherData.currentDetails.uvIndex;
    document.querySelector('.day1-name').textContent = weatherData.daily.day1Name;
    document.querySelector('.day2-name').textContent = weatherData.daily.day2Name;
    document.querySelector('.day3-name').textContent = weatherData.daily.day3Name;
    document.getElementById('day1-temp-interval').innerHTML = tempIntervals[0];
    document.getElementById('day2-temp-interval').innerHTML = tempIntervals[1];
    document.getElementById('day3-temp-interval').innerHTML = tempIntervals[2];
    document.getElementById('day1-weather-icon').setAttribute('src', nextDaysWeatherLogo[0]);
    document.getElementById('day2-weather-icon').setAttribute('src', nextDaysWeatherLogo[1]);
    document.getElementById('day3-weather-icon').setAttribute('src', nextDaysWeatherLogo[2]);
    document.querySelector('.day1-rain-chance').textContent = nextDaysChancesOfRain[0];
    document.querySelector('.day2-rain-chance').textContent = nextDaysChancesOfRain[1];
    document.querySelector('.day3-rain-chance').textContent = nextDaysChancesOfRain[2];
    currentHour = weatherData.current.currentHour;
  }

  function updateHourlyDisplay(currentIndex) {
    // Clear the container
    while (hourlyForecastContainer.firstChild) {
      hourlyForecastContainer.removeChild(hourlyForecastContainer.firstChild);
    }
    // Create and display cards for the current index and the next 'cardsToShow' hours.
    for (let i = currentIndex; i < currentIndex + cardsToShow; i++) {
      if (i < hours.length) {
        currentWeatherLogoContainer.removeChild(currentWeatherLogoContainer.lastChild)
        currentWeatherIcon.src = hourlyWeatherIcons[currentHour];
        const hourlyForecastCard = document.createElement('article');
        hourlyForecastCard.innerHTML = `
          <p class="day-label">${dayNames[Math.floor(i / 24)]}</p>
          <p>${hours[i]}</p>
          <p>
              <img
              class="weather-hours-icon"
              src="${hourlyWeatherIcons[i]}"
              alt="sunny-weather"
              />
          </p>
          <p class="weather-hours-temperature">${hourlyTemperatures[i]}</p>
          <div class="rain-chances-hours">
              <img
              src="/src/images/weather-details/rain_probability.svg"
              alt="rain probability"
              />
              <span>${hourlyChancesOfRain[i]}</span>
          </div>
          `;

        currentWeatherLogoContainer.appendChild(currentWeatherIcon)
        hourlyForecastContainer.appendChild(hourlyForecastCard);
      }
    }
    return currentIndex;
  }
  updateHourlyDisplay();

  function removeErrorMessage() {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }

  function createErrorMessage() {
    const errorMessage = document.createElement('div');
    errorMessage.backgroundColor ='#9C2B2E';
    errorMessage.classList.add('error-message');
    errorMessage.innerHTML = "⚠️ Location not found.";
    appHeader.appendChild(errorMessage);
  }
  return { searchLocation, updateWeatherData, updateHourlyDisplay, searchBar, tempIntervals, hourlyTemperatures, hourlyChancesOfRain, hours, hourlyWeatherIcons, nextDaysChancesOfRain, nextDaysWeatherLogo, tempUnit, tempUnitSup, probabilityUnit, currentIndex, cardsToShow }
})();
export default UI;

