import { format, parseISO } from 'date-fns';

const apiKey = 'cd21f6b65bf347d6a4e142840231310';
let location = document.querySelector('.location').textContent;
let apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
let searchBar = document.querySelector('input[type="search"]');

async function searchLocation(event) {
    if (event.key === 'Enter') {
        try {
            const currentWeather = await fetchCurrentWeather();
            document.querySelector('.location').textContent = currentWeather.location;
            document.querySelector('.date').textContent = currentWeather.formattedLocalTime;
            document.querySelector('.today-degrees').innerHTML = currentWeather.temperatureCelsius +'<sup>&degC</sup>';
            document.querySelector('.current-hour').textContent = currentWeather.localHour;
            document.querySelector('.current-temp-interval').textContent = currentWeather.tempInterval;
            document.querySelector('.current-weather-condition').textContent = currentWeather.weatherCondition;
            document.querySelector('.sunrise-hour').textContent = currentWeather.sunrise;
            document.querySelector('.sunset-hour').textContent = currentWeather.sunset;
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }
}

async function searchInitialLocation() {
        try {
            const currentWeather = await fetchCurrentWeather();
            console.log(currentWeather)
            document.querySelector('.location').textContent = currentWeather.location;
            document.querySelector('.date').textContent = currentWeather.formattedLocalTime;
            document.querySelector('.today-degrees').innerHTML = currentWeather.temperatureCelsius +'<sup>&degC</sup>';
            document.querySelector('.current-hour').textContent = currentWeather.localHour;
            document.querySelector('.current-temp-interval').textContent = currentWeather.tempInterval;
            document.querySelector('.current-weather-condition').textContent = currentWeather.weatherCondition;
            document.querySelector('.sunrise-hour').textContent = currentWeather.sunrise;
            document.querySelector('.sunset-hour').textContent = currentWeather.sunset;
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }

async function fetchCurrentWeather() {
    if (searchBar.value !== '') {
        location = searchBar.value;
        apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
    }
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const cityName = data.location.name;
        const countryName = data.location.country;
        location = cityName + ', ' + countryName;
        const localTime = data.location.localtime;
        const weatherCondition = data.current.condition.text;
        const temperatureCelsius = Math.round(data.current.temp_c);
        const minTemp = Math.round(data.forecast.forecastday[0].day.mintemp_c) + "°C";
        const maxTemp = Math.round(data.forecast.forecastday[0].day.maxtemp_c) + "°C";
        const tempInterval = minTemp + " / " + maxTemp;
        const localHour = localTime.split(' ')[1];
        const formattedLocalTime = format(parseISO(localTime), 'EEEE, MMMM dd yyyy')
        const sunrise = data.forecast.forecastday[0].astro.sunrise;
        const sunset = data.forecast.forecastday[0].astro.sunset;

        let currentWeather = { location, formattedLocalTime, localHour, tempInterval, weatherCondition, temperatureCelsius, sunrise, sunset }
        return currentWeather;
    }
    catch (error) {
        console.error('An error occurred:', error.message);
    }
}

searchBar.addEventListener('keydown', searchLocation);
document.addEventListener('DOMContentLoaded', searchInitialLocation)
