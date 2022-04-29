const inputEl = document.querySelector("#cityInput");
const weatherTodayEl = document.querySelector("#displayTodayInfo");
const fiveDayForecastEl = document.querySelector("#displayFiveDayForecast");
const fiveDayContainerEl = document.querySelector("#fiveDayContainer");
const searchHistoryEl = document.querySelector("#searchHistory");
// our instructors advised us that in this case, there was no need to hide the API key, but in the future it's very good practice to do so
const APIkey = "6d5bd2a287faabc4a551540637c5a51d";
let city;
let coordQueryURL;
let weatherQueryURL;
let cityDisplayName;
// Attempts to set a variable to a locally stored array's value; failing that it will set the variable to an array with an initial default value of A-town at index 0
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) ?? [
  "Atlanta, Georgia, US",
];
// This will display all weather info about the first city in the index (this will be Atlanta until the user has other local storage saved);

displayHistory();
city = searchHistory[0];
submitHandler();

// if the first API call returns a city, this will store the city, state, and country of that search in the searchistory array
// it will then store the newly created array in local storage for later use
// if the city name already exists in the array, it will be deleted and unshifted to the beginning of the array
// finally, setting the length of the array will cap the number of stored items at 10
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

// iterates through the searchHistory array and appends li elements to a list; displaying previous searches
function displayHistory() {
  searchHistoryEl.innerHTML = "";
  searchHistory.forEach((element) => {
    if (element) {
      let historyLi = document.createElement("li");
      historyLi.classList.add(
        "bg-dark",
        "mt-2",
        "p-1",
        "text-white",
        "searchBtnLi",
        "rounded"
      );
      historyLi.innerHTML = element;
      // the intent is to use these as buttons
      historyLi.setAttribute("type", "button");
      searchHistoryEl.append(historyLi);
    }
  });
}

// this function uses the coordinate information from the initial API call in a second API call's search parameters
// an object containing the weather info for those coordinates is returned
// we pass that object into the displayWeather function as an argument
function fetchWeather(coordData) {
  let stateName = "";
  if (coordData[0].state) {
    stateName = `, ${coordData[0].state}`;
  }
  cityDisplayName = `${coordData[0].name}${stateName}, ${coordData[0].country}`;
  addHistory();
  weatherQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordData[0].lat}&lon=${coordData[0].lon}&exclude=hourly&appid=${APIkey}&units=imperial`;
  fetch(weatherQueryURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (weatherData) {
        displayWeather(weatherData);
      });
    } else {
      weatherTodayEl.innerHTML = "404 error. Connection issue.";
    }
  });
}

function displayWeather(weatherData) {
  // this portion of the function uses the weatherData object, which was returned by the API call to set the HTML of a container to display today's weather
  weatherTodayEl.classList.add("borderDisplay");
  let date = new Date(weatherData.current.dt * 1000);
  weatherTodayEl.innerHTML = `<h2>${cityDisplayName} (${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()})</h2>
  <img src="http://openweathermap.org/img/wn/${
    weatherData.current.weather[0].icon
  }@2x.png"/>
  <p>Temp: ${weatherData.current.temp}° F</p>
  <p>Feels like: ${weatherData.current.feels_like}° F</p>
  <p>Wind: ${weatherData.current.wind_speed} MPH</p>
  <p>Humidity: ${weatherData.current.humidity}%</p>
  <p>UV Index: <span id="uvIndexSpan">${weatherData.current.uvi}</span></p>`;

  // this will set the color of the UV index span, based on what range the UV index is in
  const uvSpanEl = document.querySelector("#uvIndexSpan");
  if (weatherData.current.uvi > 7.99) {
    uvSpanEl.classList.add("bg-danger", "p-1", "rounded");
  } else if (weatherData.current.uvi > 2.99) {
    uvSpanEl.classList.add("bg-warning", "p-1", "rounded");
  } else {
    uvSpanEl.classList.add("bg-success", "p-1", "rounded");
  }

  // this will clear out the previous five day forecast and then iterates through the .daily key in the weatherdata object to display cards
  //  with the projected weather for the next 5 days
  fiveDayForecastEl.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    let newCard = document.createElement("div");
    date = new Date(weatherData.daily[i].dt * 1000);
    newCard.innerHTML = `<h4>(${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()})</h4>
    <img src="http://openweathermap.org/img/wn/${
      weatherData.daily[i].weather[0].icon
    }@2x.png"/>
    <p>High: ${weatherData.daily[i].temp.max}° F</p>
    <p>Low: ${weatherData.daily[i].temp.min}° F</p>
    <p>Wind: ${weatherData.daily[i].wind_speed} MPH</p>
    <p>Humidity: ${weatherData.daily[i].humidity}%</p>`;
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
// this can get called 3 different ways: on page load it is called, with city set to the first index in the searchHistory array
// when a user searches a city, if the API call is successful this function will be called with city set to the value of the input box
// when a user clicks a button in the search history, this function is called with city set to the text of the button
// the function will concatenate a URL together from the city and API key, and static portions of the URL, and then calls an API to search for a city
function submitHandler() {
  coordQueryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIkey}&units=imperial`;
  fetch(coordQueryURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (coordData) {
        if (coordData[0] === undefined) {
          window.alert(
            "No results found! Check if there are alternate spellings, or try including the state or country name."
          );
          return;
        }
        fetchWeather(coordData);
      });
    } else {
      window.alert("404 error. Connection issue.");
      return;
    }
  });
}
// if the user hits enter, the submitHandler function is called
inputEl.addEventListener("keydown", function (event) {
  if (event.keyCode === 13 && inputEl.value.length > 0) {
    city = inputEl.value;
    inputEl.value = "";
    submitHandler(event);
  }
});
// if a search history button is clicked, the submitHandler function is called
searchHistoryEl.addEventListener("click", function (event) {
  event.stopPropagation;
  if (event.target.classList.contains("searchBtnLi")) {
    city = event.target.innerText;
    submitHandler();
  }
});
