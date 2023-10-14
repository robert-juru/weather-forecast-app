import { format, parseISO } from 'date-fns';

const apiKey = 'cd21f6b65bf347d6a4e142840231310';
let location = document.querySelector('.location').textContent;
let apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
let searchBar = document.querySelector('input[type="search"]');
//unity of measure for data
let tempUnit = "&deg;C";
let tempUnitSup = "<sup>&degC</sup>";
let windUnit = " km/h";
let probabilityUnit = "%";

async function searchLocation(event) {
    if (event.key === 'Enter') {
        try {
            const weatherData = await fetchWeatherData();
            document.querySelector('.location').textContent = weatherData.location;
            document.querySelector('.date').textContent = weatherData.formattedLocalTime;
            document.querySelector('.today-degrees').innerHTML = weatherData.temperatureCelsius + tempUnitSup;
            document.querySelector('.current-hour').textContent = weatherData.localHour;
            document.querySelector('.current-temp-interval').textContent = weatherData.tempInterval;
            document.querySelector('.current-weather-condition').textContent = weatherData.weatherCondition;
            document.querySelector('.sunrise-hour').textContent = weatherData.sunrise;
            document.querySelector('.sunset-hour').textContent = weatherData.sunset;
            document.getElementById('perceived-temperature-value').innerHTML = weatherData.perceivedTemperature + tempUnit;
            document.getElementById('rain-probability-value').textContent = weatherData.currentRainProbability + probabilityUnit;
            document.getElementById('wind-speed-value').textContent = weatherData.windSpeed + windUnit;
            document.getElementById('air-humidity-value').textContent = weatherData.airHumidity + probabilityUnit;
            document.getElementById('uv-index-value').textContent = weatherData.uvIndex;
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }
}

async function searchInitialLocation() {
    try {
        const weatherData = await fetchWeatherData();
        document.querySelector('.location').textContent = weatherData.location;
        document.querySelector('.date').textContent = weatherData.formattedLocalTime;
        document.querySelector('.today-degrees').innerHTML = weatherData.temperatureCelsius + '<sup>&degC</sup>';
        document.querySelector('.current-hour').textContent = weatherData.localHour;
        document.querySelector('.current-temp-interval').textContent = weatherData.tempInterval;
        document.querySelector('.current-weather-condition').textContent = weatherData.weatherCondition;
        document.querySelector('.sunrise-hour').textContent = weatherData.sunrise;
        document.querySelector('.sunset-hour').textContent = weatherData.sunset;
        document.getElementById('perceived-temperature-value').innerHTML = weatherData.perceivedTemperature + tempUnit;
        document.getElementById('rain-probability-value').textContent = weatherData.currentRainProbability + probabilityUnit;
        document.getElementById('wind-speed-value').textContent = weatherData.windSpeed + windUnit;
        document.getElementById('air-humidity-value').textContent = weatherData.airHumidity + probabilityUnit;
        document.getElementById('uv-index-value').textContent = weatherData.uvIndex;
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

async function fetchWeatherData() {
    if (searchBar.value !== '') {
        location = searchBar.value;
        apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
    }
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data)

        // main current weather + location
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
        // const dailyChanceOfRain = data.forecast.forecastday[0].day.daily_chance_of_rain; - using it for forecast for 3 days

        //real-time weather details
        const perceivedTemperature = Math.round(data.current.feelslike_c);
        let currentRainProbability = null;
        const hourlyForecasts = data.forecast.forecastday[0].hour;
        for (let i = 0; i < hourlyForecasts.length; i++) {
            let hourForecast = hourlyForecasts[i].time.split(' ')[1];
            if (localHour.substring(0, 2) === hourForecast.substring(0, 2)) {
                currentRainProbability = hourlyForecasts[i].chance_of_rain;
            }
        }
        const windSpeed = Math.round(data.current.wind_kph);
        const airHumidity = data.current.humidity;
        const uvIndex = data.current.uv;

        let weatherData = { location, formattedLocalTime, localHour, tempInterval, weatherCondition, temperatureCelsius, sunrise, sunset, perceivedTemperature, currentRainProbability, windSpeed, airHumidity, uvIndex }

        return weatherData;
    }
    catch (error) {
        console.error('An error occurred:', error.message);
    }
}

searchBar.addEventListener('keydown', searchLocation);
document.addEventListener('DOMContentLoaded', searchInitialLocation)
