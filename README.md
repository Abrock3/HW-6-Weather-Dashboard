# HW-6-Weather-Dashboard

## Description

I was asked to use the following user story and acceptance criteria to create a weather dashboard:

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```


I wrote all code from scratch using my prior knowledge from my class's content, with minimal assistance from googled articles. When the user searches for a city, an API call is made that attempts to return the coordinates of that city; then those coordinates are used to make a second API call to obtain extensive weather information about that location. The object that is returned is used to display today's weather and the five-day forecast. In addition, the user's previous searches are displayed and when clicked will display the weather of that city.

An image was provided to us to demonstrate proper functionality; I tried to mimic the functions in that image as closely as possible.

## Usage

Here's a link to the deployed webpage: https://abrock3.github.io/HW-6-Weather-Dashboard/

Below is a screenshot of the page:

![Screenshot](./assets/images/screenshot.jpg?raw=true "Screenshot")

## Credits

I used bootstrap to help style this page.
I used a W3 schools tutorial on how to convert unix timestamps into different time values.