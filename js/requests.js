import { Coords } from "./libraries.js";

class WeatherRequests {
    static #stdcoords = new Coords(49.842957, 24.031111);

    static #fetchURL = `https://api.openweathermap.org/data/2.5/weather`;
    static #forecastURL = `https://api.openweathermap.org/data/2.5/forecast`;
    #apiKey = '';

    static #langsMap = new Map([
        ['af', 'Afrikaans'],
        ['al', 'Albanian'],
        ['ar', 'Arabic'],
        ['az', 'Azerbaijani'],
        ['bg', 'Bulgarian'],
        ['ca', 'Catalan'],
        ['cz', 'Czech'],
        ['da', 'Danish'],
        ['de', 'German'],
        ['el', 'Greek'],
        ['en', 'English'],
        ['eu', 'Basque'],
        ['fa', 'Persian (Farsi)'],
        ['fi', 'Finnish'],
        ['fr', 'French'],
        ['gl', 'Galician'],
        ['he', 'Hebrew'],
        ['hi', 'Hindi'],
        ['hr', 'Croatian'],
        ['hu', 'Hungarian'],
        ['id', 'Indonesian'],
        ['it', 'Italian'],
        ['ja', 'Japanese'],
        ['kr', 'Korean'],
        ['la', 'Latvian'],
        ['lt', 'Lithuanian'],
        ['mk', 'Macedonian'],
        ['no', 'Norwegian'],
        ['nl', 'Dutch'],
        ['pl', 'Polish'],
        ['pt', 'Portuguese'],
        ['pt_br', 'Português Brasil'],
        ['ro', 'Romanian'],
        ['ru', 'Russian'],
        ['sv', 'Swedish'],
        ['sk', 'Slovak'],
        ['sl', 'Slovenian'],
        ['es', 'Spanish'],
        ['sr', 'Serbian'],
        ['th', 'Thai'],
        ['tr', 'Turkish'],
        ['ua', 'Ukrainian'],
        ['vi', 'Vietnamese'],
        ['zh_cn', 'Chinese Simplified'],
        ['zh_tw', 'Chinese Traditional'],
        ['zu', 'Zulu']
    ]);
    #lang;

    static #supportedUnits = ['standard', 'metric', 'imperial'];
    #units;

    #gpsOptions;

    constructor(key, lang, unitsSystem, gpsOptions) {
        this.#apiKey = key;
        this.languageCode = lang;
        this.units = unitsSystem;
        this.gpsOptions = gpsOptions;
    }

    async coords() {
        return new Promise(resolve => {
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

    async getWeather(city = null) {
        return this.#innerFetchWeather(WeatherRequests.#fetchURL, city);
    }

    async getHourlyWeather(city = null) {
        return this.#innerFetchWeather(WeatherRequests.#forecastURL, city);
    }

    async #innerFetchWeather(url, city = null) {
        const coords = await this.coords(),
            urlcds = city ? `q=${city}` : `lat=${coords.lat}&lon=${coords.lon}`;

        return await fetch(`
            ${url}?appid=${this.#apiKey}&units=${this.units}&lang=${this.languageCode}&${urlcds}
            `).then(r => r.json()).catch(r => false);
    }

    static get supportedLanguages() {
        let arr = [];
        for (const it of this.#langsMap.keys()) {
            arr.push(it);
        }
        return arr;
    }

    static get supportedLanguagesNames() {
        let arr = [];
        for (const it of this.#langsMap.values()) {
            arr.push(it);
        }
        return arr;
    }

    static supportsLanguage(lang) {
        return WeatherRequests.supportedLanguages.includes(lang);
    }
    get languageCode() {
        return this.#lang;
    }
    set languageCode(lang) {
        if (WeatherRequests.supportsLanguage(lang)) {
            this.#lang = lang;
        }
        else {
            throw new Error(`The language ${lang} is not supported`);
        }
    }
    get language() {
        return WeatherRequests.#langsMap.get(this.languageCode);
    }

    static supportsUnits(system) {
        return WeatherRequests.#supportedUnits.includes(system);
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
        return this.#gpsOptions;
    }
    set options(value) {
        this.#gpsOptions = value;
    }
}

export { WeatherRequests };