import weatherData from './weather-data';
import UI from './weather-display';

async function initializeApp() {
    let currentIndex = 0;
    const searchBar = document.querySelector('input[type="search"]');
    const arrowLeft = document.getElementById('arrow-left');
    const arrowRight = document.getElementById('arrow-right');

    async function fetchAndUpdateWeatherData() {
        try {
            const data = await weatherData.fetchWeatherData();
            UI.updateWeatherData(data);
            currentIndex = data.current.currentHour;
            UI.updateHourlyDisplay(currentIndex);
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }

    await fetchAndUpdateWeatherData();

    arrowLeft.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            UI.updateHourlyDisplay(currentIndex);
        }
    });

    arrowRight.addEventListener('click', () => {
        if (currentIndex < Number(UI.hours.length - UI.cardsToShow)) {
            currentIndex++;
            UI.updateHourlyDisplay(currentIndex);
        }
    });

    searchBar.addEventListener('keydown', async function (event) {
        if (event.key === 'Enter') {
            await fetchAndUpdateWeatherData();
            UI.searchLocation(event.key);
        }
    });
}

export { initializeApp };
