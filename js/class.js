class Coords {
    #lat;
    #lon;

    constructor(lat, lon) {
        this.#lat = lat;
        this.#lon = lon;
    }

    get lat() {
        return this.#lat;
    }
    set lat(value) {
        this.#lat = value;
    }

    get lon() {
        return this.#lon;
    }
    set lon(value) {
        this.#lon = value;
    }

    toString() {
        return `Latitude: ${this.#lat}, longitude: ${this.#lon}`;
    }
}


class WeatherRequests {
    static #stdcoords = new Coords(49.842957, 24.031111);

    static #apiKey = '';
    static #fetchURL = `https://api.openweathermap.org/data/2.5/weather?appid=${WeatherRequests.#apiKey}&`;

    static #supportedLangs = ['af', 'al', 'ar', 'az', 'bg', 'ca', 'cz', 'da', 'de', 'el', 'en', 'eu', 'fa', 'fi', 'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kr', 'la', 'lt', 'mk', 'no', 'nl', 'pl', 'pt', 'pt_br', 'ro', 'ru', 'sv', 'se', 'sk', 'sl', 'sp', 'es', 'sr', 'th', 'tr', 'ua', 'uk', 'vi', 'zh_cn', 'zh_tw', 'zu'];
    static #lang = 'ua';

    static #supportedUnits = ['standard', 'metric', 'imperial'];
    static #units = WeatherRequests.#supportedUnits;

    static #options = {
        enableHighAccuracy: false,
        maximumAge: 0,
    };

    static async coords() {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const coords = new Coords(position.coords.latitude, position.coords.longitude);
                        resolve(coords);
                    },
                    error => {
                        console.error(error);
                        resolve(WeatherRequests.#stdcoords);
                    }
                );
            } else {
                console.error('Geolocation is not supported.');
                resolve(WeatherRequests.#stdcoords);
            }
        });
    }



    static async #fetchWeather(lat, lon, units = WeatherRequests.units, lang = WeatherRequests.language) {
        let coords = await WeatherRequests.coords();
        return await fetch(`${this.#fetchURL}lat=${lat}&lon=${lon}&units=${units}`).then(r => r.json());
    }

    static async getWeather() {
        let coords = await WeatherRequests.coords();
        return WeatherRequests.#fetchWeather(coords.lat, coords.lon);
    }

    static listenWeather(success, err) {
        navigator.geolocation.watchPosition(success, err, WeatherRequests.#options);

        // HERE
    }

    static get supportedLanguages() {
        return JSON.parse(JSON.stringify(WeatherRequests.#supportedLangs));
    }

    static supportsLanguage(lang) {
        return WeatherRequests.#supportedLangs.includes(lang);
    }
    static get language() {
        return WeatherRequests.#lang;
    }
    static set language(lang) {
        if (WeatherRequests.supportsLanguage(lang)) {
            WeatherRequests.#lang = lang;
        }
        else {
            throw new Error(`The language ${lang} is not supported`);
        }
    }

    static supportsUnits(system) {
        return WeatherRequests.#units.includes(system);
    }
    static get units() {
        return WeatherRequests.#units;
    }
    static set units(system) {
        if (WeatherRequests.supportsUnits(system)) {
            WeatherRequests.#units = system;
        }
        else {
            throw new Error(`The language ${lang} is not supported`);
        }
    }
}

export { WeatherRequests, Coords };