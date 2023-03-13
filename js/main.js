import { WeatherRequests, Coords } from "./class.js";
import { key } from "./key.js";

const options = {
  enableHighAccuracy: false,
  maximumAge: 0,
};
const manager = new WeatherRequests(key, 'uk', 'metric', options);

