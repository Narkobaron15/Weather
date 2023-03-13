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

    #apiKey = '';
    #fetchURL = `https://api.openweathermap.org/data/2.5/weather?appid=${this.#apiKey}&`;

    static #supportedLangs = ['af', 'al', 'ar', 'az', 'bg', 'ca', 'cz', 'da', 'de', 'el', 'en', 'eu', 'fa', 'fi', 'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kr', 'la', 'lt', 'mk', 'no', 'nl', 'pl', 'pt', 'pt_br', 'ro', 'ru', 'sv', 'se', 'sk', 'sl', 'sp', 'es', 'sr', 'th', 'tr', 'ua', 'uk', 'vi', 'zh_cn', 'zh_tw', 'zu'];
    #lang;

    static #supportedUnits = ['standard', 'metric', 'imperial'];
    #units;

    #options = {
        enableHighAccuracy: false,
        maximumAge: 0,
    };

    constructor(key, lang, unitsSystem, options) {
        this.#apiKey = key;
        this.language = lang;
        this.units = unitsSystem;
        this.options = options;
    }

    async coords() {
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

    async getWeather() {
        let coords = await this.coords();
        return await fetch(`${this.#fetchURL}lat=${lat}&lon=${lon}&units=${units}`).then(r => r.json());
    }

    listenWeather(success, err) {
        navigator.geolocation.watchPosition(success, err, this.options);

        // HERE
    }

    static get supportedLanguages() {
        return JSON.parse(JSON.stringify(WeatherRequests.#supportedLangs));
    }

    static supportsLanguage(lang) {
        return WeatherRequests.#supportedLangs.includes(lang);
    }
    get language() {
        return this.#lang;
    }
    set language(lang) {
        if (WeatherRequests.supportsLanguage(lang)) {
            this.#lang = lang;
        }
        else {
            throw new Error(`The language ${lang} is not supported`);
        }
    }

    static supportsUnits(system) {
        return WeatherRequests.#units.includes(system);
    }
    get units() {
        return this.#units;
    }
    set units(system) {
        if (WeatherRequests.supportsUnits(system)) {
            this.#units = system;
        }
        else {
            throw new Error(`The language ${lang} is not supported`);
        }
    }

    get options() {
        return this.#options;
    }
    set options(value) {
        this.#options = value;
    }
}

export { WeatherRequests, Coords };