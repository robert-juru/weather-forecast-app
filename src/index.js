import { format, parseISO, parse } from 'date-fns';

const apiKey = 'cd21f6b65bf347d6a4e142840231310';
let location = document.querySelector('.location').textContent;
let apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
let searchBar = document.querySelector('input[type="search"]');
//unity of measure for data
let tempUnit = "&deg;C";
let tempUnitSup = "<sup>&degC</sup>";
let windUnit = " km/h";
let probabilityUnit = "%";
const tempIntervals = [];

async function searchLocation(event) {
    if (event.key === 'Enter') {
        try {
            const weatherData = await fetchWeatherData();
            document.querySelector('.location').textContent = weatherData.location;
            document.querySelector('.date').textContent = weatherData.formattedLocalTime;
            document.querySelector('.today-degrees').innerHTML = weatherData.temperatureCelsius + tempUnitSup;
            document.querySelector('.current-hour').textContent = weatherData.formattedlocalHour;
            document.querySelector('.current-temp-interval').innerHTML = tempIntervals[0];
            document.querySelector('.current-weather-condition').textContent = weatherData.weatherCondition;
            document.querySelector('.sunrise-hour').textContent = weatherData.sunrise;
            document.querySelector('.sunset-hour').textContent = weatherData.sunset;
            document.getElementById('perceived-temperature-value').innerHTML = weatherData.perceivedTemperature + tempUnit;
            document.getElementById('rain-probability-value').textContent = weatherData.currentRainProbability + probabilityUnit;
            document.getElementById('wind-speed-value').textContent = weatherData.windSpeed + windUnit;
            document.getElementById('air-humidity-value').textContent = weatherData.airHumidity + probabilityUnit;
            document.getElementById('uv-index-value').textContent = weatherData.uvIndex;
            document.querySelector('.day1-name').textContent = weatherData.day1Name;
            document.querySelector('.day2-name').textContent = weatherData.day2Name;
            document.querySelector('.day3-name').textContent = weatherData.day3Name;
            document.getElementById('day1-temp-interval').innerHTML = tempIntervals[0];
            document.getElementById('day2-temp-interval').innerHTML = tempIntervals[1];
            document.getElementById('day3-temp-interval').innerHTML = tempIntervals[2];
            document.querySelector('.day1-rain-chance').textContent = weatherData.day1ChanceOfRain;
            document.querySelector('.day2-rain-chance').textContent = weatherData.day2ChanceOfRain;
            document.querySelector('.day3-rain-chance').textContent = weatherData.day3ChanceOfRain;

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
        document.querySelector('.today-degrees').innerHTML = weatherData.temperatureCelsius + tempUnitSup;
        document.querySelector('.current-hour').textContent = weatherData.formattedlocalHour;
        document.querySelector('.current-temp-interval').innerHTML = tempIntervals[0];
        document.querySelector('.current-weather-condition').textContent = weatherData.weatherCondition;
        document.querySelector('.sunrise-hour').textContent = weatherData.sunrise;
        document.querySelector('.sunset-hour').textContent = weatherData.sunset;
        document.getElementById('perceived-temperature-value').innerHTML = weatherData.perceivedTemperature + tempUnit;
        document.getElementById('rain-probability-value').textContent = weatherData.currentRainProbability + probabilityUnit;
        document.getElementById('wind-speed-value').textContent = weatherData.windSpeed + windUnit;
        document.getElementById('air-humidity-value').textContent = weatherData.airHumidity + probabilityUnit;
        document.getElementById('uv-index-value').textContent = weatherData.uvIndex;
        document.querySelector('.day1-name').textContent = weatherData.day1Name;
        document.querySelector('.day2-name').textContent = weatherData.day2Name;
        document.querySelector('.day3-name').textContent = weatherData.day3Name;
        document.getElementById('day1-temp-interval').innerHTML = tempIntervals[0];
        document.getElementById('day2-temp-interval').innerHTML = tempIntervals[1];
        document.getElementById('day3-temp-interval').innerHTML = tempIntervals[2];
        document.querySelector('.day1-rain-chance').textContent = weatherData.day1ChanceOfRain;
        document.querySelector('.day2-rain-chance').textContent = weatherData.day2ChanceOfRain;
        document.querySelector('.day3-rain-chance').textContent = weatherData.day3ChanceOfRain;


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
        const localHour = localTime.split(' ')[1];
        const parsedLocalHour = parse(localHour, 'H:mm', new Date());
        const formattedlocalHour = format(parsedLocalHour, 'HH:mm');
        const formattedLocalTime = format(parseISO(localTime.split(' ')[0]), 'EEEE, MMMM dd yyyy')
        const sunrise = data.forecast.forecastday[0].astro.sunrise;
        const sunset = data.forecast.forecastday[0].astro.sunset;

        //real-time weather details
        const perceivedTemperature = Math.round(data.current.feelslike_c);
        let currentRainProbability = null;
        const hourlyForecasts = data.forecast.forecastday[0].hour;
        for (let i = 0; i < hourlyForecasts.length; i++) {
            let hourForecast = hourlyForecasts[i].time.split(' ')[1];
            if (formattedlocalHour.substring(0, 2) === hourForecast.substring(0, 2)) {
                currentRainProbability = hourlyForecasts[i].chance_of_rain;
            }
        }
        const windSpeed = Math.round(data.current.wind_kph);
        const airHumidity = data.current.humidity;
        const uvIndex = data.current.uv;

        //forecast for 3 days
        const day1Name = "Today";
        const day2Name = format(parseISO(data.forecast.forecastday[1].date), 'EEEE');
        const day3Name = format(parseISO(data.forecast.forecastday[2].date), 'EEEE');

        tempIntervals.length = 0; //clearing the array to use the fresh fetched data
        for (let i = 0; i < 3; i++) {
            let minTemp = Math.round(data.forecast.forecastday[i].day.mintemp_c) + tempUnit;
            let maxTemp = Math.round(data.forecast.forecastday[i].day.maxtemp_c) + tempUnit;
            let tempInterval = minTemp + " / " + maxTemp;
            tempIntervals.push(tempInterval)
        }
        const day1ChanceOfRain = data.forecast.forecastday[0].day.daily_chance_of_rain + probabilityUnit;
        const day2ChanceOfRain = data.forecast.forecastday[1].day.daily_chance_of_rain + probabilityUnit;
        const day3ChanceOfRain = data.forecast.forecastday[2].day.daily_chance_of_rain + probabilityUnit;

        let weatherData = { location, formattedLocalTime, formattedlocalHour, weatherCondition, temperatureCelsius, sunrise, sunset, perceivedTemperature, currentRainProbability, windSpeed, airHumidity, uvIndex, day1Name, day2Name, day3Name, day1ChanceOfRain, day2ChanceOfRain, day3ChanceOfRain };

        return weatherData;
    }
    catch (error) {
        console.error('An error occurred:', error.message);
    }
}

searchBar.addEventListener('keydown', searchLocation);
document.addEventListener('DOMContentLoaded', searchInitialLocation)
