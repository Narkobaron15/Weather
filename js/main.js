import { WeatherRequests, Process } from "./libraries.js";
import { key } from "./key.js";

const options = {
  enableHighAccuracy: false,
  maximumAge: 0,
};

const requests = new WeatherRequests(key, 'en', 'metric', options);
const manager = new Process(requests);
let city = null, oneday = true;

/* 
 * ui elements
 * DD - dropdown
 * 
 */
const unitsDD = document.getElementById("units"),
  langsDD = document.getElementById("langs");
const odBtn = document.getElementById('onedayBtn'),
  fdBtn = document.getElementById('fivedaysBtn'),
  searchBtn = document.getElementById('searchBtn');
const searchbox = document.getElementById('searchBox');
const content = document.getElementById('content');


searchBtn.onclick = () => {
  city = searchbox.value === '' ? null : searchbox.value;
  Update(city);
};
searchbox.onsearch = () => {
  city = null;
  Update()
};

odBtn.onclick = () => {
  odBtn.disabled = true;
  fdBtn.disabled = false;

  oneday = true;

  Update();
};
fdBtn.onclick = () => {
  fdBtn.disabled = true;
  odBtn.disabled = false;

  oneday = false;

  Update();
};

unitsDD.onchange = () => {
  requests.units = unitsDD.value;
  Update();
};
langsDD.onchange = () => {
  requests.languageCode = langsDD.value;
  Update();
};
for (let i = 0; i < WeatherRequests.supportedLanguages.length; i++) {
  let opt = document.createElement('option');
  opt.innerText = WeatherRequests.supportedLanguagesNames[i];
  opt.value = WeatherRequests.supportedLanguages[i];
  langsDD.appendChild(opt);
}
unitsDD.value = requests.units;
langsDD.value = requests.languageCode;

Update();

async function Update() {
  let result = await (oneday
    ? manager.ConstructDailyForecast(city)
    : manager.Construct5DayForecast(city)
  );

  content.innerHTML = '';
  content.appendChild(result);
}
