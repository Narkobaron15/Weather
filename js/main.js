import { WeatherRequests } from "./class.js";
import { key } from "./key.js";

const printasync = r => console.log(r);

const options = {
  enableHighAccuracy: false,
  maximumAge: 0,
};
const manager = new WeatherRequests(key, 'uk', 'metric', options);

