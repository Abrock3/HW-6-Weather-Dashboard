inputEl = document.querySelector("#cityInput");
cardDisplayEl = document.querySelector("#weatherInfoDisplay");
weatherTodayEl = document.querySelector("#displayTodayInfo");
fiveDayForecastEl = document.querySelector("#displayFiveDayForecast");
fiveDayContainerEl = document.querySelector("#fiveDayContainer");
const APIkey = "6d5bd2a287faabc4a551540637c5a51d";
let city;
let coordQueryURL;
let weatherQueryURL;
let lat;
let lon;
let cityDisplayName;
function fetchWeather(coordData) {
  weatherQueryURL =
    `https://api.openweathermap.org/data/2.5/onecall?lat=` +
    coordData[0].lat +
    `&lon=` +
    coordData[0].lon +
    `&exclude=hourly&appid=` +
    APIkey +
    `&units=imperial`;
  fetch(weatherQueryURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (weatherData) {
        console.log(weatherData);
        displayWeather(weatherData);
      });
    } else {
      weatherTodayEl.innerHTML = "404 connection error";
    }
  });
}
function displayWeather(weatherData) {
  let date = new Date(weatherData.current.dt * 1000);
  weatherTodayEl.innerHTML =
    `<h2>` +
    cityDisplayName +
    ` (` +
    (date.getMonth() + 1) +
    `/` +
    date.getDate() +
    `/` +
    date.getFullYear() +
    `)` +
    `<img src="http://openweathermap.org/img/wn/` +
    weatherData.current.weather[0].icon +
    `@2x.png"></img></h2>
  <p>Temp: ` +
    weatherData.current.temp +
    `° F</p>
  <p>Feels like: ` +
    weatherData.current.feels_like +
    `° F
  <p>Wind: ` +
    weatherData.current.wind_speed +
    ` MPH</p>
  <p>Humidity: ` +
    weatherData.current.humidity +
    `%</p>
  <p>UV Index: <span id="uvIndexSpan">` +
    weatherData.current.uvi +
    `</span></p>`;
  for (let i = 1; i <= 5; i++) {
    let newCard = document.createElement("div");
    date = new Date(weatherData.daily[i].dt * 1000);
    newCard.innerHTML =
      `<h4>(` +
      (date.getMonth() + 1) +
      `/` +
      date.getDate() +
      `/` +
      date.getFullYear() +
      `)` +
      `</h4><img src="http://openweathermap.org/img/wn/` +
      weatherData.daily[i].weather[0].icon +
      `@2x.png"></img><p>High: ` +
      weatherData.daily[i].temp.max +
      `° F</p><p>Low: ` +
      weatherData.daily[i].temp.min +
      `° F</p><p>Wind: ` +
      weatherData.daily[i].wind_speed +
      ` MPH</p><p>Humidity: ` +
      weatherData.daily[i].humidity +
      `%</p>`;
    newCard.classList.add(
      "col",
      "bg-dark",
      "border-black",
      "text-white",
      "p-2",
      "m-2"
    );
    fiveDayForecastEl.append(newCard);
  }
}

inputEl.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    city = inputEl.value;
    coordQueryURL =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&appid=" +
      APIkey +
      "&units=imperial";
    fetch(coordQueryURL).then(function (response) {
      if (response.ok) {
        response.json().then(function (coordData) {
          console.log(coordData);

          cityDisplayName =
            coordData[0].name +
            ", " +
            coordData[0].state +
            ", " +
            coordData[0].country;
          fetchWeather(coordData);
        });
      } else {
        weatherTodayEl.innerHTML = "No results found";
      }
    });
  }
});
