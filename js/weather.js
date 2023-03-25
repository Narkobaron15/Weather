import { Coords } from './libraries.js';

class OWM_Common {
    static #degreeMap = new Map([
        ['standard', 'K'],
        ['metric', '°C'],
        ['imperial', '°F'],
    ]);
    static #speedMap = new Map([
        ['standard', ' m/s'],
        ['metric', ' m/s'],
        ['imperial', ' mph'],
    ]);
    static #pressureUnits = ' hPa';
    static #dateOptions = {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: true,
    };

    #clouds;
    #dt;
    #main;
    #sys;
    #units;
    #visibility;
    #weather;
    #wind;

    constructor({ clouds, dt, main, sys, units, visibility, weather, wind }) {
        this.#dt = dt;
        this.#main = main;
        this.#sys = sys;
        this.#units = units;
        this.#visibility = visibility;
        this.#wind = wind;
        this.#clouds = !(clouds.all === undefined || clouds.all === null) ? clouds.all : clouds;
        this.#weather = Array.isArray(weather) ? weather[0] : weather;
    }

    get clouds() {
        return this.#clouds;
    }

    get dt() {
        return this.#dt;
    }

    get main() {
        return this.#main;
    }

    get sys() {
        return this.#sys;
    }

    get units() {
        return this.#units;
    }

    get visibility() {
        return this.#visibility;
    }

    get weather() {
        return this.#weather;
    }

    get wind() {
        return this.#wind;
    }

    get temp() {
        return this.main.temp;
    }

    get feels_like() {
        return this.main.feels_like;
    }

    get temp_min() {
        return this.main.temp_min;
    }

    get temp_max() {
        return this.main.temp_max;
    }

    get pressure() {
        return this.main.pressure;
    }

    get humidity() {
        return this.main.humidity;
    }

    get weatherName() {
        return this.weather.main;
    }

    get weatherDescription() {
        return OWM_Weather.Capitalize(this.weather.description);
    }

    get weatherIcon() {
        return this.weather.icon;
    }

    get windSpeed() {
        return this.wind.speed;
    }

    get windDirection_degree() {
        return this.wind.deg;
    }

    get windGust() {
        return this.wind.gust;
    }

    set clouds(value) {
        this.#clouds = value;
    }

    set dt(value) {
        this.#dt = value;
    }

    set main(value) {
        this.#main = value;
    }

    set sys(value) {
        this.#sys = value;
    }

    set units(value) {
        this.#units = value;
    }

    set visibility(value) {
        this.#visibility = value;
    }

    set weather(value) {
        this.#weather = value;
    }

    set wind(value) {
        this.#wind = value;
    }


    static get degreeMap() {
        return this.#degreeMap;
    }
    static get speedMap() {
        return this.#speedMap;
    }
    static get pressureUnits() {
        return this.#pressureUnits;
    }
    static get dateOptions() {
        return this.#dateOptions;
    }

    static DateStrNormalize(unixdate) {
        return OWM_Common.UnixUTCToLocalTime(unixdate).toLocaleString('en-US', OWM_Common.dateOptions);
    }

    static DateToTime(unixdate) {
        return OWM_Common.UnixUTCToLocalTime(unixdate).toLocaleTimeString('en-US', { timeStyle: 'short' });
    }

    static Capitalize(str) {
        if (typeof str !== 'string') {
            throw new Error('Value must be a string object');
        }

        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static NumericValNormalize(num, units) {
        if (num === undefined) {
            return undefined;
        }

        if (isNaN(+num)) {
            throw new Error('Parameter should be a valid number');
        }

        return num.toFixed() + units;
    }

    static UnixUTCToLocalTime(unixUtcTime) {
        if (typeof unixUtcTime !== 'number') {
            throw new Error('UTC Unix time is a numeric value');
        }

        const date = new Date(unixUtcTime * 1000);
        // const offsetMs = date.getTimezoneOffset() * 60 * 1000;
        // const localDate = new Date(date.getTime() - offsetMs);
        return date;
    }

    /* 
     * WARNING: Deep clone object in order not to lose data
     */
    static _Publish(instance) {
        if (!(instance instanceof OWM_Common)) {
            throw new Error('Cloning supported only for instances of this class')
        }

        const tempunits = OWM_Common.degreeMap.get(instance.units),
            speedUnits = OWM_Common.speedMap.get(instance.units);
        const normalize = OWM_Common.NumericValNormalize;

        instance.main.temp = normalize(instance.main.temp, tempunits);
        instance.main.temp_max = normalize(instance.main.temp_max, tempunits);
        instance.main.temp_min = normalize(instance.main.temp_min, tempunits);
        instance.main.feels_like = normalize(instance.main.feels_like, tempunits);
        instance.main.pressure = normalize(instance.main.pressure, OWM_Common.pressureUnits);
        instance.main.sea_level = normalize(instance.main.sea_level, OWM_Common.pressureUnits);
        instance.main.grnd_level = normalize(instance.main.grnd_level, OWM_Common.pressureUnits);
        instance.wind.speed = normalize(instance.wind.speed, speedUnits);
        instance.wind.gust = normalize(instance.wind.gust, speedUnits);
        instance.wind.deg = instance.wind.deg + '°';
        instance.clouds = instance.clouds + '%';
        instance.main.humidity = instance.main.humidity + '%';

        return instance;
    }
}


class OWM_Weather extends OWM_Common {
    #coord;
    #id;
    #name;
    #timezone;

    constructor({
        clouds,
        dt,
        id,
        main,
        name,
        sys,
        timezone,
        visibility,
        weather,
        wind,
        coord,
        units
    }, _units = 'standard') {
        super({ clouds, dt, main, sys, units: units ? units : _units, visibility, weather, wind });
        this.#coord = new Coords(coord.lat, coord.lon);
        this.#id = id;
        this.#name = name;
        this.#timezone = timezone;
    }

    get coord() {
        return this.#coord;
    }

    get lat() {
        return this.#coord.lat;
    }

    get lon() {
        return this.#coord.lon;
    }

    get dtStr() {
        return OWM_Common.DateStrNormalize(this.dt);
    }

    get cityId() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get country() {
        return this.sys.country;
    }

    get sunrise() {
        return this.sys.sunrise;
    }

    get sunriseStr() {
        return OWM_Common.DateToTime(this.sunrise);
    }

    get sunset() {
        return this.sys.sunset;
    }

    get sunsetStr() {
        return OWM_Common.DateToTime(this.sunset);
    }

    get timezone() {
        return this.#timezone;
    }
    Publish() {
        return OWM_Common._Publish(new OWM_Weather(this));
    }
}

class OWM_HRForecast extends OWM_Common {
    #pop;

    constructor({ clouds, dt, main, sys, visibility, weather, wind, pop, units }, _units = 'standard') {
        super({ clouds, dt, main, sys, units: units ? units : _units, visibility, weather, wind });
        this.#pop = pop;
    }

    get pop() {
        return this.#pop;
    }

    get dtStr() {
        return OWM_Common.DateStrNormalize(this.dt);
    }

    get timeStr() {
        return OWM_Common.DateToTime(this.dt);
    }

    Publish() {
        const _new = new OWM_HRForecast(this);
        _new.#pop = OWM_Common.NumericValNormalize(_new.pop * 100, '%');
        return OWM_Common._Publish(_new);
    }
}

class OWM_Forecast {
    static #weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    #arr;
    #units;
    #temp_max;
    #temp_min;
    #pop;
    #humidity;
    #wind;

    constructor(arr, units = 'standard') {
        if (!Array.isArray(arr)) {
            throw new Error('Only arrays of hourly forecasts allowed');
        }

        this.#arr = arr.map(x => new OWM_HRForecast(x, units));
        this.#units = units;
        this.#temp_max = Math.max(...this.#arr.map(x => parseFloat(x.temp_max)))
        this.#temp_min = Math.min(...this.#arr.map(x => parseFloat(x.temp_min)));
        this.#pop = OWM_Forecast.#mostFrequentElem(this.arr.map(x => x.pop));
        this.#humidity = OWM_Forecast.#Avg(this.arr.map(x => x.humidity));
        this.#wind = OWM_Forecast.#Avg(this.arr.map(x => x.windSpeed));
    }

    get arr() {
        return this.#arr;
    }

    get temp_max() {
        return this.#temp_max;
    }

    get temp_min() {
        return this.#temp_min;
    }

    get weatherDescription() {
        return OWM_Forecast.#mostFrequentElem(this.#arr.map(x => x.weatherDescription));
    }

    get dt() {
        return this.#arr[0].dt;
    }

    get dtDate() {
        return OWM_Common.UnixUTCToLocalTime(this.#arr[0].dt);
    }

    get dtStr() {
        return OWM_Common.DateStrNormalize(this.dt);
    }

    get dayOfWeek() {
        return OWM_Forecast.#weekdays[this.dtDate.getDay()];
    }

    get weatherIcon() {
        return OWM_Forecast.#mostFrequentElem(this.arr.map(x => x.weatherIcon));
    }

    get pop() {
        return this.#pop;
    }

    get humidity() {
        return this.#humidity;
    }

    get windSpeed() {
        return this.#wind;
    }

    Publish() {
        const _new = new OWM_Forecast(new Array(...this.#arr), this.#units);
        const degrees = OWM_Common.degreeMap.get(this.#units);
        const speed = OWM_Common.speedMap.get(this.#units);
        const normalize = OWM_Common.NumericValNormalize;

        _new.#temp_max = normalize(_new.temp_max, degrees);
        _new.#temp_min = normalize(_new.temp_min, degrees);
        _new.#pop = normalize(_new.pop, '%');
        _new.#humidity = normalize(_new.humidity, '%');
        _new.#wind = normalize(_new.windSpeed, speed);
        
        return _new;
    }

    static #Avg(arr) {
        return arr.reduce((a, b) => a + b) / arr.length || 0;
    }

    static #mostFrequentElem(array) {
        return array.sort((a, b) =>
            array.filter(v => v === a).length -
            array.filter(v => v === b).length
        ).pop();
    }

    static get dailyHRForecasts() {
        return 8;
    }
}

export { OWM_Weather, OWM_Forecast, OWM_HRForecast };