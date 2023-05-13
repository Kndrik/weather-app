import './style.css';

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchValue = document.querySelector('input').value;
    requestNewCity(searchValue);
})

document.querySelector('.search').addEventListener('click', () => {
    const searchValue = document.querySelector('input').value;
    requestNewCity(searchValue);
});



const domManager = (() => {
    const city = document.querySelector('.city');
    const temperature = document.querySelector('.temperature');
    const weather = document.querySelector('.weather');
    const weatherDesc = document.querySelector('.weather-description');
    const felt = document.querySelector('.felt');
    const humidity = document.querySelector('.humidity');
    const wind = document.querySelector('.wind');

    const updateDomValues = (dataSet) => {
        city.textContent = dataSet.cityName;
        temperature.textContent = conversionManager.getDegree(dataSet.temperature);
        felt.textContent = conversionManager.getDegree(dataSet.feltTemperature);
        weatherDesc.textContent = dataSet.description;
        humidity.textContent = dataSet.humidity + '%';
        wind.textContent = conversionManager.getWind(dataSet.wind);

        console.log(dataSet.main);
        switch(dataSet.main) {
            case 'Thunderstorm':
                weather.textContent = 'thunderstorm';
            break;

            case 'Drizzle':
                weather.textContent = 'rainy';
            break;

            case 'Rain':
                weather.textContent = 'rainy';
            break;

            case 'Snow':
                weather.textContent = 'weather_snowy';
            break;

            case 'Atmosphere':
                weather.textContent = 'water';
            break;

            case 'Clear':
                weather.textContent = 'sunny';
            break;

            case 'Clouds':
                weather.textContent = 'cloudy';
            break;
        }
    }

    return { updateDomValues };
})();

const conversionManager = (() => {
    let celcius = true;

    const getDegree = (value) => {
        value = Math.round(value);
        return celcius ? value + '°C' : value + '°F';
    }

    const getWind = (value) => {
        value = Math.round(value);
        return celcius ? value + 'km/h' : value + 'mph';
    }

    const changeUnit = () => {
        celcius = !celcius;
    }

    const isCelcius = () => celcius;

    return { getDegree, changeUnit, isCelcius, getWind }; 
})();

async function requestNewCity(value) {
    const coordinates = await getCoordinatesFromCityName(value).catch(() => {
        alert('Invalid city name');
    });
    const weatherData = await getCurrentWeatherData(coordinates[0], coordinates[1]);
    
    const dataSet = {
        cityName: coordinates[2],
        temperature: weatherData.main.temp,
        feltTemperature: weatherData.main.feels_like,
        description: weatherData.weather[0].description,
        main: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        wind: weatherData.wind.speed,
    }

    domManager.updateDomValues(dataSet);
}

async function getCoordinatesFromCityName(value) {
    const coordinates = new Array(3);
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&appid=2f05fe6ff8b0e1dfa1bd432d77789e6c`);
    const responseJson = await response.json();
    coordinates[0] = responseJson[0].lat;
    coordinates[1] = responseJson[0].lon;
    coordinates[2] = responseJson[0].name;
    return coordinates;
}

async function getCurrentWeatherData(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2f05fe6ff8b0e1dfa1bd432d77789e6c&units=${conversionManager.isCelcius() ? 'metric' : 'imperial'}`);
    return await response.json();
}

requestNewCity('Paris');