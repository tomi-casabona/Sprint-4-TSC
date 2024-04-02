//Global Constants
const APIJOKES1: string = 'https://icanhazdadjoke.com/'; // API endpoint
const APIJOKES2: string = "https://v2.jokeapi.dev/joke/Any?type=single";//API endpoint
const APIJOKESRELIGIOUS: string = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,political,racist,sexist,explicit&type=single";//API endpoint
const APIWEATHER: string = "https://www.meteosource.com/api/v1/free/point?place_id=barcelona&sections=current&timezone=Europe%2FMadrid&language=en&units=auto&key=ls7dk118dcil19tkre8c7pwzkdgoerlvo5dmtbsm" // API endpoint
const sunnyDayImg = "/Icons/weather/sol.png";
const partlyCloudyDay = "/Icons/weather/nube.png";
const cloudyDay = "/Icons/weather/nubes.png";
const rainyDay = "/Icons/weather/lluvia.png";

//Global Variables
let apiSelectorNumber: number; // used for choosing the jokes API
let currentReport: JokeReport | undefined; // jokeReport variable
let reportAcudits: JokeReport[] = []; // Array of joke reports
let acumulatedBackground: number; // variable number for changing the background

//Dom Elements
let jokeElement = document.getElementById("joke"); // joke paragraph element
let jokeBtn = document.getElementById("next"); // next joke button
let btnScore1 = document.getElementById("score1");// button of "boring"
let btnScore2 = document.getElementById("score2");// button of "average"
let btnScore3 = document.getElementById("score3");// button of "very nice"
let bubbleWeather = document.getElementById("weather"); // bubble of the weather
let containerElement = document.getElementById("container") // general container element
let imageWeatherElement = document.getElementById("weather-img");// weather img element
let textWeatherElement = document.getElementById("weather-text");// weather text element

/*
Type JokeReport 
 joke : string
 score : 1|2|3
 date : string (date in format ISO)
*/
type JokeReport = {
    joke: string | null,
    score: 1 | 2 | 3,
    date: string
}

//Add the first joke in the html /////////////////////////////////////////////////////
addJokeToParagraph();
weatherRequest();
iniciarEventListeners();

//Event Listeners
function iniciarEventListeners() {
    //'Next' button for execute addJokeToParagraph function, if jokeBtn exists
    if (jokeBtn) {
        jokeBtn.addEventListener('click', () => nextJoke());
    } else {
        throw new Error("Next button is not found");
    }
    // for scoring buttons
    if (btnScore1) {
        btnScore1.addEventListener('click', () => createReport(1));
    }
    if (btnScore2) {
        btnScore2.addEventListener('click', () => createReport(2));
    }
    if (btnScore3) {
        btnScore3.addEventListener('click', () => createReport(3));
    }
}
// changePattern function, change the background image in every click
function changePattern(): void {
    let className = "";

    if (acumulatedBackground < 1) {
        className = "pattern1";
        acumulatedBackground = 2;
    } else if (acumulatedBackground === 2) {
        className = "pattern2";
        acumulatedBackground = 3;
    } else {
        className = "pattern3";
        acumulatedBackground = 0;
    }
    if (containerElement) {
        containerElement.className = className;
    }
}
// async function for fetching data from a given api Endpoint
async function fetchData(url: string): Promise<any> {
    try {
        const response = await fetch(url, {
            headers: {
                'accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error in the API request');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            console.log('error: ' + error);
            throw new Error('Unknown error occurred');
        }
    }
}

// AddJokeToParagrapg try to make the request to the API & manage function calls about jokes
async function addJokeToParagraph() {
    try {
        apiSelectorNumber = Math.floor(Math.random() * 3 + 1);
        const apiUrl = apiSelectorNumber === 1 ? APIJOKES1 : apiSelectorNumber === 2 ? APIJOKES2 : APIJOKESRELIGIOUS;
        const data = await fetchData(apiUrl);

        if (jokeElement) {
            jokeElement.innerHTML = data.joke;
            changePattern();
        } else {
            throw new Error('JokeElement is null')
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            console.log('error: ' + error);
            throw new Error('Unknown error occurred');
        }
    }
}

// weather api request & handling the functions calls about the weather
async function weatherRequest() {
    try {
        const data = await fetchData(APIWEATHER);

        console.log(data);

        const clouds = data.current.cloud_cover;
        const rain = data.current.precipitation.total;
        const temperature = data.current.temperature;

        changeImage(clouds, rain);
        changeTemperature(temperature);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            console.log('error: ' + error);
            throw new Error('Unknown error occurred');
        }
    }
}

// createReport function create an object type JokeReport where the client leave the joke's score (1|2|3) and store it with the joke and the date.
//@param jokeReport is for scoring the joke
function createReport(num: 1 | 2 | 3): JokeReport {
    if (jokeElement) {
        let report: JokeReport = {
            joke: jokeElement.textContent,
            score: num,
            date: new Date().toISOString()
        }
        currentReport = report;
        return report;

    } else {
        throw new Error("JokeElement is not found");
    }
}

// addReport function receive a report parameter and save it in reportAcudits array when nextJoke button is clicked
function addReport() {
    if (currentReport) {
        reportAcudits.push(currentReport); // add report to reportAcudits array
        currentReport = undefined; //reset variable
    } else { console.log("last joke is not scored") }
}

// show reportAcudits array
function showJokesReport() {
    console.log(reportAcudits)
}

// nextJoke function for handling the next joke event
function nextJoke() {
    addReport();
    addJokeToParagraph();
    showJokesReport();
}

// change the weather image in the widget depending on atribute SRC in IMG element based on two parameters 
// @param clouds: number = percentage of clouds in the sky requested to the API
// @param rain: number = percentage of posibility to rain requested to the API

function changeImage(clouds: number, rain: number) {
    if (imageWeatherElement) {
        if (rain > 50) {
            imageWeatherElement.setAttribute('src', rainyDay);
        } else if (clouds < 20) {
            imageWeatherElement.setAttribute('src', sunnyDayImg);
        } else if (clouds >= 20 && clouds < 40) {
            imageWeatherElement.setAttribute('src', partlyCloudyDay);
        } else if (clouds >= 4) {
            imageWeatherElement.setAttribute('src', cloudyDay);
        }
    } else {
        throw new Error('imageWeatherElement is not available')
    }
}

// changeTemperature is for change the temperature number to weather widget
function changeTemperature(temp: number) {
    if (textWeatherElement) {
        textWeatherElement.innerHTML = `${temp} °C`
    } else {
        throw new Error('textWetherElement is not available')
    }
}

