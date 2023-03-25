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

    static get Empty() {
        return new Coords(0, 0);
    }
}

export { Coords };