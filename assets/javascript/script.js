inputEl = document.querySelector("#cityInput");
cardDisplayEl = document.querySelector("#weatherInfoDisplay");
weatherTodayEl = document.querySelector("#displayTodayInfo");
fiveDayForecastEl = document.querySelector("#displayFiveDayForecast");
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
  weatherTodayEl.innerHTML =
    `<h2>` +
    cityDisplayName +
    ` (` +
    weatherData.current.dt +
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
    `</span></p>
  `;
  fiveDayForecastEl.innerHTML = "<h3>Five-Day Forecast</h3>";
  for(let i=1; i <=6;i++){
      let newCard= document.createElement("div")
      newCard.innerHTML =
        `<h3>` +
        weatherData.daily[i].dt +
        `</h3><img src="http://openweathermap.org/img/wn/` +
        weatherData.daily[i].weather[0].icon +
        `@2x.png"></img><p>High: ° F` +
        weatherData.daily[i].temp.max +
        `</p><p>Low: ` +
        weatherData.daily[i].temp.min +
        `° F</p><p>Wind: `+weatherData.daily[i].wind_speed+` MPH</p><p>Humidity: `+weatherData.daily[i].humidity+`%</p>`;
       newCard.classList.add("bg-dark", "border-black", "text-white")
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
