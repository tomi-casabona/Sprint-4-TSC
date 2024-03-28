"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Variables
let jokeElement = document.getElementById("joke"); // joke paragraph element
let jokeBtn = document.getElementById("next"); // next joke button
let APIJOKES1 = 'https://icanhazdadjoke.com/'; // API endpoint
let APIJOKES2 = "https://v2.jokeapi.dev/joke/Any?type=single"; //API endpoint
let APIJOKESRELIGIOUS = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,political,racist,sexist,explicit&type=single"; //API endpoint
let APIWEATHER = "https://www.meteosource.com/api/v1/free/point?place_id=barcelona&sections=current&timezone=Europe%2FMadrid&language=en&units=auto&key=ls7dk118dcil19tkre8c7pwzkdgoerlvo5dmtbsm"; // API endpoint
let apiSelectorNumber; // used for choosing the jokes API
let currentReport; // jokeReport variable
let reportAcudits = []; // Array of joke reports
let btnScore1 = document.getElementById("score1"); // button of "boring"
let btnScore2 = document.getElementById("score2"); // button of "average"
let btnScore3 = document.getElementById("score3"); // button of "very nice"
let bubbleWeather = document.getElementById("weather"); // bubble of the weather
function addJokeToParagraph() {
    return __awaiter(this, void 0, void 0, function* () {
        // try to make the request to the API and get the data
        try {
            apiSelectorNumber = Math.floor(Math.random() * 3 + 1); // get random number from 1 to 3 for choosing the API where we will request
            let res = yield fetch(apiSelectorNumber === 1 ? APIJOKES1 : apiSelectorNumber === 2 ? APIJOKES2 : APIJOKESRELIGIOUS, {
                headers: {
                    'accept': 'application/json',
                }
            });
            console.log(apiSelectorNumber);
            // Verify if the response is ok, if it isn't then throw an error
            if (!res.ok) {
                throw new Error('Error in the API request');
            }
            // Pick the data from the json formant and assign to 'data' variable
            let data = yield res.json();
            console.log(data);
            // If jokeElement exists then assign the new joke from data.joke
            if (jokeElement) {
                jokeElement.innerHTML = data.joke;
            }
            else {
                throw new Error('JokeElement is null');
            }
        }
        catch (e) {
            // Catch all exceptions from API request
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            else {
                console.log('error: ' + e);
            }
        }
    });
}
//Add the first joke in the html
addJokeToParagraph();
//Add event listener to 'Next' button for execute addJokeToParagraph function, if jokeBtn exists
if (jokeBtn) {
    jokeBtn.addEventListener('click', () => nextJoke());
}
else {
    throw new Error("Next button is not found");
}
//Add event listener for scoring buttons
if (btnScore1) {
    btnScore1.addEventListener('click', () => createReport(1));
}
if (btnScore2) {
    btnScore2.addEventListener('click', () => createReport(2));
}
if (btnScore3) {
    btnScore3.addEventListener('click', () => createReport(3));
}
// createReport function create an object type JokeReport where the client leave the joke's score (1|2|3) and store it with the joke and the date
function createReport(num) {
    if (jokeElement) {
        let report = {
            joke: jokeElement.textContent,
            score: num,
            date: new Date().toISOString()
        };
        currentReport = report;
        return report;
    }
    else {
        throw new Error("JokeElement is not found");
    }
}
// addReport function receive a report parameter and save it in reportAcudits array when nextJoke button is clicked
function addReport() {
    if (currentReport) {
        reportAcudits.push(currentReport); // add report to reportAcudits array
        currentReport = undefined; //reset variable
    }
    else {
        console.log("last joke is not scored");
    }
}
// show reportAcudits array
function showJokesReport() {
    console.log(reportAcudits);
}
// nextJoke function call addReport function and call addJokeReport function;
function nextJoke() {
    addReport();
    addJokeToParagraph();
    showJokesReport();
}
// weather api request
function weatherRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let res = yield fetch(APIWEATHER, {
                headers: {
                    'accept': 'application/json',
                }
            });
            if (!res.ok) {
                throw new Error('Error in the API request');
            }
            let data = yield res.json();
            // create elements for weather data
            let location = document.createElement("p");
            let temperature = document.createElement("p");
            let wind = document.createElement("p");
            let clouds = document.createElement("p");
            location.innerHTML = `Barcelona`;
            temperature.innerHTML = `Temperature : ${data.current.temperature}°C`;
            wind.innerHTML = `Wind : ${data.current.wind.speed} km/h`;
            clouds.innerHTML = `Clouds cover : ${data.current.cloud_cover} %`;
            bubbleWeather === null || bubbleWeather === void 0 ? void 0 : bubbleWeather.appendChild(location);
            bubbleWeather === null || bubbleWeather === void 0 ? void 0 : bubbleWeather.appendChild(temperature);
            bubbleWeather === null || bubbleWeather === void 0 ? void 0 : bubbleWeather.appendChild(wind);
            bubbleWeather === null || bubbleWeather === void 0 ? void 0 : bubbleWeather.appendChild(clouds);
            return data;
        }
        catch (e) {
            // Catch all exceptions from API request
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            else {
                console.log('error: ' + e);
            }
        }
    });
}
weatherRequest();
