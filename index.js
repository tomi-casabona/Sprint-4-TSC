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
//Global Constants
const APIJOKES1 = 'https://icanhazdadjoke.com/'; // API endpoint
const APIJOKES2 = "https://v2.jokeapi.dev/joke/Any?type=single"; //API endpoint
const APIJOKESRELIGIOUS = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,political,racist,sexist,explicit&type=single"; //API endpoint
const APIWEATHER = "https://www.meteosource.com/api/v1/free/point?place_id=barcelona&sections=current&timezone=Europe%2FMadrid&language=en&units=auto&key=ls7dk118dcil19tkre8c7pwzkdgoerlvo5dmtbsm"; // API endpoint
const sunnyDayImg = "/Icons/weather/sol.png";
const partlyCloudyDay = "/Icons/weather/nube.png";
const cloudyDay = "/Icons/weather/nubes.png";
const rainyDay = "/Icons/weather/lluvia.png";
//Global Variables
let apiSelectorNumber; // Used for choosing the jokes API
let currentReport; // new JokeReport 
let reportAcudits = []; // Array of joke reports
let backgroundNumber; // Variable number for changing the background
let apiUrl; // Selected api url 
let clouds; // Percentage of clouds for weather widget
let rain; // Percentage of rain for weather widget
let temperature; // Temperature for weather widget
//Dom Elements
let jokeElement = document.getElementById("joke"); // joke paragraph element
let jokeBtn = document.getElementById("next"); // next joke button
let btnScore1 = document.getElementById("score1"); // button of "boring"
let btnScore2 = document.getElementById("score2"); // button of "average"
let btnScore3 = document.getElementById("score3"); // button of "very nice"
let bubbleWeather = document.getElementById("weather"); // bubble of the weather
let containerElement = document.getElementById("container"); // general container element
let imageWeatherElement = document.getElementById("weather-img"); // weather img element
let textWeatherElement = document.getElementById("weather-text"); // weather text element
// TODO: ANIMATION FOR SCORING //////////////////////////////////////////////////
runWeb(); // Run webApp
////////////////////// Run web app ////////////////////// 
function runWeb() {
    getApiSelectorNumber(); // get number of API selectors
    getApiUrl(); // Get API url from selector number
    addJokeToParagraph(); //Add the first joke in the html    
    changeBackground(); //change background
    handleWeatherWidget(); //Add weather widget 
    handleEventListeners(); // add event listeners
}
// nextJoke function handle the next joke event
function nextJoke() {
    getApiSelectorNumber();
    getApiUrl();
    addJokeToParagraph();
    changeBackground();
    addReport();
    showJokesReport();
}
//////////////////////  Event Listeners methods ////////////////////// 
//Event Listeners handler
function handleEventListeners() {
    eventListenerNextBtn();
    eventListenerScoringGroup();
}
//Add event listener for next joke btn
function eventListenerNextBtn() {
    if (jokeBtn) {
        jokeBtn.addEventListener('click', () => nextJoke());
    }
    else {
        throw new Error("Next button is not found");
    }
}
//Add event listeer for scoring buttons
function eventListenerScoringGroup() {
    if (btnScore1) {
        btnScore1.addEventListener('click', () => handleIconClick(1, btnScore1));
    }
    else {
        throw new Error("Scoring button is not found");
    }
    if (btnScore2) {
        btnScore2.addEventListener('click', () => handleIconClick(2, btnScore2));
    }
    else {
        throw new Error("Scoring button is not found");
    }
    if (btnScore3) {
        btnScore3.addEventListener('click', () => handleIconClick(3, btnScore3));
    }
    else {
        throw new Error("Scoring button is not found");
    }
}
////////////////////// APIs Request Methods ////////////////////// 
// async function for fetching data from a given api Endpoint
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url, {
                headers: {
                    'accept': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Error in the API request');
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                console.log('error: ' + error);
                throw new Error('Unknown error occurred');
            }
        }
    });
}
//// JOKES APIs ////
// Change the api selector number
function getApiSelectorNumber() {
    apiSelectorNumber === 1 ? apiSelectorNumber = 2 : apiSelectorNumber === 2 ? apiSelectorNumber = 3 : apiSelectorNumber = 1;
}
// Select API URL from apiSelectorNumber
function getApiUrl() {
    apiUrl = apiSelectorNumber === 1 ? APIJOKES1 : apiSelectorNumber === 2 ? APIJOKES2 : APIJOKESRELIGIOUS;
}
// AddJokeToParagraph add a new joke to paragraph
function addJokeToParagraph() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield fetchData(apiUrl);
            if (jokeElement) {
                jokeElement.innerHTML = data.joke;
            }
            else {
                throw new Error('JokeElement is null');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                console.log('error: ' + error);
                throw new Error('Unknown error occurred');
            }
        }
    });
}
//// WEATHER API ////
// handle weather functions
function handleWeatherWidget() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield weatherRequest();
        if (data) {
            setWeatherVariables(data);
            changeWeatherImage(clouds, rain);
            changeTemperature(temperature);
        }
        else {
            throw new Error('data is not available from  weather');
        }
    });
}
// weather api request 
function weatherRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield fetchData(APIWEATHER);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                console.log('error: ' + error);
                throw new Error('Unknown error occurred');
            }
        }
    });
}
// set the meteorological variables with the data obtained from the API
function setWeatherVariables(data) {
    if (data) {
        clouds = data.current.cloud_cover;
        rain = data.current.precipitation.total;
        temperature = data.current.temperature;
    }
    else {
        throw new Error('data is not available from handleWeatherWidget');
    }
}
// change the weather image in the widget depending on atribute SRC in IMG element based on two parameters 
// @param clouds: number = percentage of clouds in the sky requested to the API
// @param rain: number = percentage of posibility to rain requested to the API
function changeWeatherImage(clouds, rain) {
    if (imageWeatherElement) {
        if (rain > 50) {
            imageWeatherElement.setAttribute('src', rainyDay);
        }
        else if (clouds < 20) {
            imageWeatherElement.setAttribute('src', sunnyDayImg);
        }
        else if (clouds >= 20 && clouds < 40) {
            imageWeatherElement.setAttribute('src', partlyCloudyDay);
        }
        else if (clouds >= 4) {
            imageWeatherElement.setAttribute('src', cloudyDay);
        }
    }
    else {
        throw new Error('imageWeatherElement is not available');
    }
}
// changeTemperature is for change the temperature number to weather widget
function changeTemperature(temp) {
    if (textWeatherElement) {
        textWeatherElement.innerHTML = `${temp} °C`;
    }
    else {
        throw new Error('textWetherElement is not available');
    }
}
////////////////////// Scoring methods ////////////////////// 
// createReport function create an object type JokeReport where the client leave the joke's score (1|2|3) and store it with the joke and the date.
//@param jokeReport is for scoring the joke
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
// addReport function save a report in reportAcudits array when nextJoke button is clicked
function addReport() {
    if (currentReport) {
        reportAcudits.push(currentReport); // add report to reportAcudits array
        currentReport = undefined; //reset variable
    }
    else {
        alert("last joke was not scored");
    }
}
// show reportAcudits array
function showJokesReport() {
    console.log(reportAcudits);
}
////////////////////// Styling methods ////////////////////// 
// changeBackground function, change the background image in every new joke
function changeBackground() {
    let className = "";
    if (backgroundNumber < 1) {
        className = "pattern1";
        backgroundNumber = 2;
    }
    else if (backgroundNumber === 2) {
        className = "pattern2";
        backgroundNumber = 3;
    }
    else {
        className = "pattern3";
        backgroundNumber = 0;
    }
    if (containerElement) {
        containerElement.className = className;
    }
}
// call createReport for create a scoring report and then call animation function for tehe clicked icon
function handleIconClick(num, e) {
    createReport(num);
    if (e) {
        addAnimationToClickedIcon(e);
    }
}
// add a class for the clicked Icon , that trows an animation, and 2 seconds later, remove that class 
function addAnimationToClickedIcon(e) {
    e.classList.add("clicked");
    setTimeout(() => {
        e.classList.remove('clicked');
    }, 2000);
}
;
