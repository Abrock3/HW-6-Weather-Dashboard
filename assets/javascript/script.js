const inputEl = document.querySelector("#cityInput");
const weatherTodayEl = document.querySelector("#displayTodayInfo");
const fiveDayForecastEl = document.querySelector("#displayFiveDayForecast");
const fiveDayContainerEl = document.querySelector("#fiveDayContainer");
const searchHistoryEl = document.querySelector("#searchHistory");
const APIkey = "6d5bd2a287faabc4a551540637c5a51d";
let city;
let coordQueryURL;
let weatherQueryURL;
let lat;
let lon;
let cityDisplayName;
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) ?? [];
if (searchHistory.length) {
  displayHistory();
  city = searchHistory[0];
  submitHandler();
}
function addHistory() {
  if (
    searchHistory.indexOf(cityDisplayName) ||
    searchHistory.indexOf(cityDisplayName) === 0
  ) {
    searchHistory.splice(searchHistory.indexOf(cityDisplayName), 1);
  }
  searchHistory.unshift(cityDisplayName);
  searchHistory.length = 10;
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  displayHistory();
}

function displayHistory() {
  searchHistoryEl.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
    if (searchHistory[i]) {
      let historyLi = document.createElement("li");
      historyLi.classList.add(
        "bg-dark",
        "mt-2",
        "p-1",
        "text-white",
        "searchBtnLi",
        "rounded"
      );
      historyLi.innerHTML = searchHistory[i];
      historyLi.setAttribute("type", "button");
      searchHistoryEl.append(historyLi);
    }
  }
}

function fetchWeather(coordData) {
  let stateName = "";
  if (coordData[0].state) {
    stateName = ", " + coordData[0].state;
  }
  cityDisplayName = coordData[0].name + stateName + ", " + coordData[0].country;
  addHistory();
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
  weatherTodayEl.classList.add("borderDisplay");
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
  const uvSpanEl = document.querySelector("#uvIndexSpan");
  if (weatherData.current.uvi > 7.99) {
    uvSpanEl.classList.add("bg-danger", "p-1","rounded");
  } else if (weatherData.current.uvi > 2.99) {
    uvSpanEl.classList.add("bg-warning", "p-1", "rounded");
  } else {
    uvSpanEl.classList.add("bg-success", "p-1", "rounded");
  }
  fiveDayForecastEl.innerHTML = "";
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
      "m-2",
      "rounded"
    );

    fiveDayForecastEl.append(newCard);
  }
}
function submitHandler() {
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
        fetchWeather(coordData);
      });
    } else {
      weatherTodayEl.innerHTML = "No results found";
      return;
    }
  });
}
inputEl.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    city = inputEl.value;
    submitHandler(event);
  }
});
searchHistoryEl.addEventListener("click", function (event) {
  event.stopPropagation;
  if (event.target.classList.contains("searchBtnLi")) {
    city = event.target.innerText;
    submitHandler();
  }
});
