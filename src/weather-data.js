import { format, parseISO, parse } from 'date-fns';
import UI from './weather-display.js';

const weatherData = (function () {
    const apiKey = 'cd21f6b65bf347d6a4e142840231310';
    let location = document.querySelector('.location').textContent;
    let apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
    let currentWeatherDetailsData = {};
    let currentWeatherData = {};
    let dailyForecastsData = {};

    async function fetchWeatherData(location) {
        if (UI.searchBar.value !== '') {
            location = UI.searchBar.value;
            apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
        }
        try {
            const response = await fetch(apiUrl, {
                mode: 'cors'
            });
            const data = await response.json();

            const current = currentWeather(data);
            const currentDetails = currentWeatherDetails(data);
            const daily = dailyForecasts(data);
            const hourly = hourlyForecast(data);

            return { current, currentDetails, daily };
            // 
        } catch (error) {
            console.error('An error occurred:', error.message);
            throw error;
        }
    }

    function currentWeatherDetails(data) {
        const perceivedTemperature = Math.round(data.current.feelslike_c);
        let currentRainProbability = null;
        const hourlyForecasts = data.forecast.forecastday[0].hour;
        for (let i = 0; i < hourlyForecasts.length; i++) {
            let hourForecast = hourlyForecasts[i].time.split(' ')[1];
            if (currentWeatherData.formattedLocalHour.substring(0, 2) === hourForecast.substring(0, 2)) {
                currentRainProbability = hourlyForecasts[i].chance_of_rain;
            }
        }
        const windSpeed = Math.round(data.current.wind_kph);
        const airHumidity = data.current.humidity;
        const uvIndex = data.current.uv;

        currentWeatherDetailsData = { perceivedTemperature, currentRainProbability, windSpeed, airHumidity, uvIndex }

        return currentWeatherDetailsData;
    }

    function currentWeather(data) {
        const cityName = data.location.name;
        const countryName = data.location.country;
        location = cityName + ', ' + countryName;
        const localTime = data.location.localtime;
        const formattedLocalTime = format(parseISO(localTime.split(' ')[0]), 'EEEE, MMMM dd yyyy')
        const weatherCondition = data.current.condition.text;
        const temperatureCelsius = Math.round(data.current.temp_c);
        const localHour = localTime.split(' ')[1];
        const parsedLocalHour = parse(localHour, 'H:mm', new Date());
        const formattedLocalHour = format(parsedLocalHour, 'HH:mm');
        const currentHour = Number(formattedLocalHour.substring(0, 2));
        const sunrise = data.forecast.forecastday[0].astro.sunrise;
        const sunset = data.forecast.forecastday[0].astro.sunset;

        currentWeatherData = { location, weatherCondition, temperatureCelsius, localHour, currentHour, formattedLocalTime, formattedLocalHour, sunrise, sunset }

        return currentWeatherData;
    }

    function dailyForecasts(data) {
        const day1Name = "Today";
        const day2Name = format(parseISO(data.forecast.forecastday[1].date), 'EEEE');
        const day3Name = format(parseISO(data.forecast.forecastday[2].date), 'EEEE');

        UI.tempIntervals.length = 0; // clear the arrays to use the recently fetched data
        UI.nextDaysChancesOfRain.length = 0;
        UI.nextDaysWeatherLogo.length = 0;

        for (let i = 0; i < 3; i++) { // get temp intervals, chances of rain and the icon for the 3 days
            let minTemp = Math.round(data.forecast.forecastday[i].day.mintemp_c) + UI.tempUnit;
            let maxTemp = Math.round(data.forecast.forecastday[i].day.maxtemp_c) + UI.tempUnit;
            let tempInterval = minTemp + " / " + maxTemp;
            UI.tempIntervals.push(tempInterval)
            let chanceOfRain = data.forecast.forecastday[i].day.daily_chance_of_rain + UI.probabilityUnit;
            UI.nextDaysChancesOfRain.push(chanceOfRain);
            let weatherIcon = data.forecast.forecastday[i].day.condition.icon;
            UI.nextDaysWeatherLogo.push(weatherIcon)
        }
        dailyForecastsData = { day1Name, day2Name, day3Name }

        return dailyForecastsData;
    }

    function hourlyForecast(data) {
        // clear the arrays for temperature, chances of rain and hours to use the recently fetched data
        UI.hourlyTemperatures.length = 0;
        UI.hourlyChancesOfRain.length = 0;
        UI.hours.length = 0;

        for (let i = 0; i < 2; i++) { //get today&tomorrow
            for (let j = 0; j < 24; j++) { //get hourly data
                let hourlyTemperature = Math.round(data.forecast.forecastday[i].hour[j].temp_c) + UI.tempUnit;
                UI.hourlyTemperatures.push(hourlyTemperature);
                let hourlyChanceOfRain = data.forecast.forecastday[i].hour[j].chance_of_rain + UI.probabilityUnit;
                UI.hourlyChancesOfRain.push(hourlyChanceOfRain);
                let hour = data.forecast.forecastday[i].hour[j].time.split(' ')[1];
                UI.hours.push(hour);
                let hourlyWeatherIcon = data.forecast.forecastday[i].hour[j].condition.icon;
                UI.hourlyWeatherIcons.push(hourlyWeatherIcon);
            }
        }
    }
    return {
        fetchWeatherData, currentWeather, location, currentWeatherData, currentWeatherDetailsData, dailyForecastsData,
    };
})();
export default weatherData;

