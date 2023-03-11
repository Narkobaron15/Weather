import { WeatherRequests, Coords } from "./class.js";

// const key = 'ac8a3d5b3621088a412c4be16fff52ef',
//   lang = 'uk-UA',
//   units = 'metric';

// const options = {
//   enableHighAccuracy: false,
//   maximumAge: 0,
// };

// navigator.geolocation.getCurrentPosition(success, error, options);

// async function success(pos) {
//   const crd = pos.coords;

//   let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=${key}`)
//     .then(r => r.json());

//   console.log(result);
//   console.log(result.rain);
// }

// function error(err) {
//   console.warn(`Error when getting geoposition data (${err.code}): ${err.message}`);
// }

// navigator.geolocation.watchPosition()

WeatherRequests.coords().then(x => console.log(x));