import { format, parseISO, parse } from 'date-fns';

const apiKey = 'cd21f6b65bf347d6a4e142840231310';
let location = document.querySelector('.location').textContent;
console.log(location)
let apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
let searchBar = document.querySelector('input[type="search"]');
const hourlyForecastContainer = document.querySelector('.weather-hours');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');
const currentWeatherLogoContainer = document.querySelector('.today-temperature');
let tempUnit = "&deg;C";
let tempUnitSup = "<sup>&degC</sup>";
let windUnit = " km/h";
let probabilityUnit = "%";
const tempIntervals = [];
const hourlyTemperatures = [];
const hourlyChancesOfRain = [];
const hours = [];
let currentIndex;
const cardsToShow = 4;
const dayNames = ["Today", "Tomorrow"];
let hourlyWeatherIcons = [];
let nextDaysChancesOfRain = [];
let nextDaysWeatherLogo = [];
const currentWeatherIcon = new Image();
currentWeatherIcon.classList.add('weather-icon')
let currentHour;
    
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
            document.getElementById('day1-weather-icon').setAttribute('src', nextDaysWeatherLogo[0]);
            document.getElementById('day2-weather-icon').setAttribute('src', nextDaysWeatherLogo[1]);
            document.getElementById('day3-weather-icon').setAttribute('src', nextDaysWeatherLogo[2]);
            document.querySelector('.day1-rain-chance').textContent = nextDaysChancesOfRain[0];
            document.querySelector('.day2-rain-chance').textContent = nextDaysChancesOfRain[1];
            document.querySelector('.day3-rain-chance').textContent = nextDaysChancesOfRain[2];



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
        document.getElementById('day1-weather-icon').setAttribute('src', nextDaysWeatherLogo[0]);
        document.getElementById('day2-weather-icon').setAttribute('src', nextDaysWeatherLogo[1]);
        document.getElementById('day3-weather-icon').setAttribute('src', nextDaysWeatherLogo[2]);
        document.querySelector('.day1-rain-chance').textContent = nextDaysChancesOfRain[0];
        document.querySelector('.day2-rain-chance').textContent = nextDaysChancesOfRain[1];
        document.querySelector('.day3-rain-chance').textContent = nextDaysChancesOfRain[2];


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
        currentHour = Number(formattedlocalHour.substring(0, 2))
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

        tempIntervals.length = 0; // clear the array to use the recently fetched data
        nextDaysChancesOfRain.length = 0;
        nextDaysWeatherLogo.length = 0;
        for (let i = 0; i < 3; i++) { // get temp intervals for the 3 days
            let minTemp = Math.round(data.forecast.forecastday[i].day.mintemp_c) + tempUnit;
            let maxTemp = Math.round(data.forecast.forecastday[i].day.maxtemp_c) + tempUnit;
            let tempInterval = minTemp + " / " + maxTemp;
            tempIntervals.push(tempInterval)
            let chanceOfRain = data.forecast.forecastday[i].day.daily_chance_of_rain + probabilityUnit;
            nextDaysChancesOfRain.push(chanceOfRain);
            let weatherIcon = data.forecast.forecastday[i].day.condition.icon;
            nextDaysWeatherLogo.push(weatherIcon)
        }
        //today hourly forecast

        // clear the arrays for temperature, chances of rain and hours to use the recently fetched data
        hourlyTemperatures.length = 0;
        hourlyChancesOfRain.length = 0;
        hours.length = 0;

        for (let i = 0; i < 2; i++) { //get today&tomorrow
            for (let j = 0; j < 24; j++) { //get hourly temperatures
                let hourlyTemperature = Math.round(data.forecast.forecastday[i].hour[j].temp_c) + tempUnit;
                hourlyTemperatures.push(hourlyTemperature);
                let hourlyChanceOfRain = data.forecast.forecastday[i].hour[j].chance_of_rain + probabilityUnit;
                hourlyChancesOfRain.push(hourlyChanceOfRain);
                let hour = data.forecast.forecastday[i].hour[j].time.split(' ')[1];
                hours.push(hour);
                let hourlyWeatherIcon = data.forecast.forecastday[i].hour[j].condition.icon;
                hourlyWeatherIcons.push(hourlyWeatherIcon);
            }
        }

        //weather image
        // currentWeatherIcon = data.current.condition.icon;
        // const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;


        currentIndex = currentHour; //track the current index for updateHourlyDisplay

        updateHourlyDisplay(currentIndex, hours, hourlyTemperatures, hourlyChancesOfRain);

        let weatherData = { location, formattedLocalTime, formattedlocalHour, weatherCondition, temperatureCelsius, sunrise, sunset, perceivedTemperature, currentRainProbability, windSpeed, airHumidity, uvIndex, day1Name, day2Name, day3Name };

        return weatherData;
    }
    catch (error) {
        console.error('An error occurred:', error.message);
    }
}

// Define the updateHourlyDisplay function outside fetchWeatherData.
function updateHourlyDisplay(currentIndex, hours, hourlyTemperatures, hourlyChancesOfRain) {
    const cardsToShow = 4;
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
}

updateHourlyDisplay(currentIndex, hours, hourlyTemperatures, hourlyChancesOfRain);

arrowLeft.addEventListener('click', () => {
    console.log("current index before --: " + currentIndex);
    if (currentIndex > 0) {
        currentIndex--;
        updateHourlyDisplay(currentIndex, hours, hourlyTemperatures, hourlyChancesOfRain);
    }
});

arrowRight.addEventListener('click', () => {
    // let currentIndex = Number(formattedlocalHour.substring(0, 2));
    console.log("current index before ++: " + currentIndex);
    if (currentIndex < Number(hours.length - cardsToShow)) {
        currentIndex++;
        updateHourlyDisplay(currentIndex, hours, hourlyTemperatures, hourlyChancesOfRain);
    }
});

searchBar.addEventListener('keydown', searchLocation);
document.addEventListener('DOMContentLoaded', searchInitialLocation)
