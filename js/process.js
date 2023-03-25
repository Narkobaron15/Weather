import { WeatherRequests, OWM_Weather, OWM_Forecast, OWM_HRForecast } from "./libraries.js";

class Process {
    #requests;

    constructor(requests) {
        if (!(requests instanceof WeatherRequests)) {
            throw new Error("Weather requests' manager should be a WeatherRequests object");
        }
        this.#requests = requests;
    }

    get requests() {
        return this.#requests;
    }

    async ConstructDailyForecast(city = null) {
        const requestlg = await this.requests.getWeather(city),
            requestsm = await this.requests.getHourlyWeather(city);
        if (+requestlg.cod !== 200 && +requestsm.cod !== 200) {
            return this.#ConstructErrorCard(city);
        }

        const parentDiv = document.createElement('div');

        const weather = new OWM_Weather(requestlg, this.requests.units).Publish();
        const mainCardDiv = this.#ConstructMainCard(weather);
        parentDiv.appendChild(mainCardDiv);

        const headingH2 = document.createElement('h2');
        headingH2.textContent = 'Hourly forecast';
        parentDiv.appendChild(headingH2);

        const forecast = new OWM_Forecast(requestsm.list.slice(0, OWM_Forecast.dailyHRForecasts), this.requests.units);
        const hourlyCardsDiv = this.#ConstructHourlyCards(forecast);
        parentDiv.appendChild(hourlyCardsDiv);

        return parentDiv;
    }

    async Construct5DayForecast(city = null) {
        const request = await this.requests.getHourlyWeather(city);
        if (+request.cod !== 200) {
            return this.#ConstructErrorCard(city);

        }

        const days = [];
        const hrlist = request.list;

        let day = null, curdate = null, lastindex = 0;
        for (let i = 0; i < hrlist.length; i++) {
            curdate = new Date(hrlist[i].dt * 1000).getDate();
            if (day === null) {
                day = curdate;
                continue;
            }

            if (day < curdate) {
                days.push(new OWM_Forecast(hrlist.slice(lastindex, i), this.requests.units));
                day++;
                lastindex = i;
            }
        }

        const parentDiv = document.createElement('div');
        const header = document.createElement('h2');
        header.classList.add('mb-10')
        header.innerHTML = `Weather in 
            ${OWM_Weather.Capitalize(city ? city : request.city.name)}
            for 5 days`;
        parentDiv.appendChild(header);
        for (const day of days) {
            parentDiv.appendChild(this.#ConstructFiveDayCard(day.Publish()));
        }
        return parentDiv;
    }

    #ConstructMainCard(weatherObj) {
        const fragment = document.createDocumentFragment();

        const mainCardDiv = fragment.appendChild(document.createElement('div'));
        mainCardDiv.classList.add('card', 'maincard');

        const generalDiv = mainCardDiv.appendChild(document.createElement('div'));
        generalDiv.classList.add('flex', 'flex-col', 'justify-center');

        const locationHeading = generalDiv.appendChild(document.createElement('p'));
        locationHeading.classList.add('text-lg');
        locationHeading.innerHTML = `Weather in <strong>${weatherObj.name}</strong>, ${weatherObj.country}`;

        const datetimePara = generalDiv.appendChild(document.createElement('p'));
        datetimePara.classList.add('text-sm');
        datetimePara.textContent = weatherObj.dtStr;

        const weatherInfoDiv = generalDiv.appendChild(document.createElement('div'));
        weatherInfoDiv.classList.add('flex', 'items-center', 'mt-auto');

        const weatherIconSpan = weatherInfoDiv.appendChild(document.createElement('span'));
        weatherIconSpan.classList.add('weathericon', `_${weatherObj.weatherIcon}`);

        const temperatureSpan = weatherInfoDiv.appendChild(document.createElement('span'));
        temperatureSpan.classList.add('degrees');
        temperatureSpan.textContent = weatherObj.temp;

        const infoDiv = mainCardDiv.appendChild(document.createElement('div'));
        infoDiv.classList.add('mt-8', 'lg:mt-0');

        const weatherDescriptionHeading = infoDiv.appendChild(document.createElement('p'));
        weatherDescriptionHeading.classList.add('text-xl', 'font-bold', 'text-left');
        weatherDescriptionHeading.textContent = weatherObj.weatherDescription;

        const feelsLikePara = infoDiv.appendChild(document.createElement('p'));
        feelsLikePara.classList.add('text-xl');
        feelsLikePara.innerHTML = `Feels like:<strong class="ml-4">${weatherObj.feels_like}</strong>`;

        const cardGridDiv = infoDiv.appendChild(document.createElement('div'));
        cardGridDiv.classList.add('cardgrid', 'mt-8');

        const cardGridItems = [
            { label: 'Sunrise:', value: weatherObj.sunriseStr },
            { label: 'Sunset:', value: weatherObj.sunsetStr },
            { label: 'Humidity:\u00A0\u00A0', value: weatherObj.humidity },
            { label: 'Wind:', value: weatherObj.windSpeed },
        ];

        cardGridItems.forEach((item) => {
            const labelSpan = cardGridDiv.appendChild(document.createElement('span'));
            labelSpan.textContent = item.label;

            const valueSpan = cardGridDiv.appendChild(document.createElement('strong'));
            valueSpan.textContent = item.value;
        });

        return fragment;
    }

    #ConstructHourlyCards(forecast) {
        const hourlyCardsDiv = document.createElement('div');
        hourlyCardsDiv.classList.add('cards');
        for (const hr of forecast.arr) {
            hourlyCardsDiv.appendChild(this.#ConstructHourlyCard(hr.Publish()));
        }

        return hourlyCardsDiv;
    }

    #ConstructHourlyCard(hr_forecast) {
        if (!(hr_forecast instanceof OWM_HRForecast)) {
            throw new Error("hr_forecast should be a hourly weather forecast");
        }

        const parentDiv = document.createElement('div');
        parentDiv.classList.add('card', 'smcard');

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('flex', 'flex-col', 'justify-center');

        const weatherIconSpan = document.createElement('span');
        weatherIconSpan.classList.add('block', 'weathericon', '_' + hr_forecast.weatherIcon);
        infoDiv.appendChild(weatherIconSpan);

        const tempSpan = document.createElement('span');
        tempSpan.classList.add('block', 'degrees');
        tempSpan.textContent = hr_forecast.temp_max;
        infoDiv.appendChild(tempSpan);

        const timeStrong = document.createElement('strong');
        timeStrong.className = 'ml-1';
        timeStrong.textContent = hr_forecast.timeStr;
        infoDiv.appendChild(timeStrong);

        const cardGridDiv = document.createElement('div');
        cardGridDiv.classList.add('cardgrid');

        const humiditySpan = document.createElement('span');
        humiditySpan.textContent = 'Humidity:  ';
        cardGridDiv.appendChild(humiditySpan);

        const humidityValueSpan = document.createElement('strong');
        humidityValueSpan.textContent = hr_forecast.humidity;
        cardGridDiv.appendChild(humidityValueSpan);

        const windSpan = document.createElement('span');
        windSpan.textContent = 'Wind: ';
        cardGridDiv.appendChild(windSpan);

        const windSpeedSpan = document.createElement('strong');
        windSpeedSpan.textContent = hr_forecast.windSpeed;
        cardGridDiv.appendChild(windSpeedSpan);

        const precipSpan = document.createElement('span');
        precipSpan.textContent = 'Precipitation: ';
        cardGridDiv.appendChild(precipSpan);

        const precipValueSpan = document.createElement('strong');
        precipValueSpan.textContent = hr_forecast.pop;
        cardGridDiv.appendChild(precipValueSpan);

        parentDiv.appendChild(infoDiv);
        parentDiv.appendChild(cardGridDiv);
        return parentDiv;
    }

    #ConstructFiveDayCard(weatherObj) {
        const mainCardDiv = document.createElement('div');
        mainCardDiv.classList.add('card', 'smcard');

        const generalDiv = document.createElement('div');
        generalDiv.classList.add('flex', 'flex-col', 'justify-center');

        const weatherInfoDiv = document.createElement('div');
        weatherInfoDiv.classList.add('flex', 'items-center', 'mt-auto');

        const dayOfWeekHeading = document.createElement('p');
        dayOfWeekHeading.classList.add('text-xl', 'font-medium');
        dayOfWeekHeading.innerHTML = `${weatherObj.dayOfWeek},
            ${weatherObj.dtDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`;
        generalDiv.appendChild(dayOfWeekHeading);

        const weatherDescriptionHeading = document.createElement('p');
        weatherDescriptionHeading.classList.add('text-3xl', 'font-bold', 'text-left');
        weatherDescriptionHeading.textContent = weatherObj.weatherDescription;
        generalDiv.appendChild(weatherDescriptionHeading);

        const weatherIconSpan = document.createElement('span');
        weatherIconSpan.classList.add('weathericon', `_${weatherObj.weatherIcon}`);
        weatherInfoDiv.appendChild(weatherIconSpan);

        const temperatureSpan = document.createElement('span');
        temperatureSpan.classList.add('degrees', 'ml-6');
        temperatureSpan.textContent = `${weatherObj.temp_max} / ${weatherObj.temp_min}`;
        weatherInfoDiv.appendChild(temperatureSpan);

        generalDiv.appendChild(weatherInfoDiv);

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('cardgrid');

        const humiditySpan = document.createElement('span');
        humiditySpan.textContent = 'Humidity:  ';
        infoDiv.appendChild(humiditySpan);

        const humidityValueSpan = document.createElement('strong');
        humidityValueSpan.textContent = weatherObj.humidity;
        infoDiv.appendChild(humidityValueSpan);

        const windSpan = document.createElement('span');
        windSpan.textContent = 'Wind: ';
        infoDiv.appendChild(windSpan);

        const windSpeedSpan = document.createElement('strong');
        windSpeedSpan.textContent = weatherObj.windSpeed;
        infoDiv.appendChild(windSpeedSpan);

        const precipSpan = document.createElement('span');
        precipSpan.textContent = 'Precipitation: ';
        infoDiv.appendChild(precipSpan);

        const precipValueSpan = document.createElement('strong');
        precipValueSpan.textContent = weatherObj.pop;
        infoDiv.appendChild(precipValueSpan);

        mainCardDiv.appendChild(generalDiv);
        mainCardDiv.appendChild(infoDiv);
        return mainCardDiv;
    }

    #ConstructErrorCard(city) {
        const parentDiv = document.createElement('div');
        parentDiv.classList.add('card', 'p-7', 'mt-16', 'flex', 'flex-col', 'items-center', 'flex-wrap');

        const errorImgSpan = document.createElement('span');
        errorImgSpan.classList.add('errorimg');
        parentDiv.appendChild(errorImgSpan);

        const cityNotFoundHeading = document.createElement('h2');
        cityNotFoundHeading.classList.add('my-2');
        cityNotFoundHeading.innerHTML = `<strong>${OWM_Weather.Capitalize(city)}</strong> could not be found.`;
        parentDiv.appendChild(cityNotFoundHeading);

        const errorMessagePara = document.createElement('p');
        errorMessagePara.textContent = "Maybe you're looking for something else?";
        parentDiv.appendChild(errorMessagePara);

        return parentDiv;
    }
}

export { Process };