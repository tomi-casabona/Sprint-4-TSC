//Variables
let jokeElement = document.getElementById("joke"); // joke paragraph element
let jokeBtn = document.getElementById("next"); // next joke button
let APIJOKES1: string = 'https://icanhazdadjoke.com/'; // API endpoint
let APIJOKES2: string = "https://v2.jokeapi.dev/joke/Any?type=single";//API endpoint
let APIJOKESRELIGIOUS: string = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,political,racist,sexist,explicit&type=single";//API endpoint
let APIWEATHER: string = "https://www.meteosource.com/api/v1/free/point?place_id=barcelona&sections=current&timezone=Europe%2FMadrid&language=en&units=auto&key=ls7dk118dcil19tkre8c7pwzkdgoerlvo5dmtbsm" // API endpoint
let apiSelectorNumber: number; // used for choosing the jokes API
let currentReport: JokeReport | undefined; // jokeReport variable
let reportAcudits: JokeReport[] = []; // Array of joke reports
let btnScore1 = document.getElementById("score1");// button of "boring"
let btnScore2 = document.getElementById("score2");// button of "average"
let btnScore3 = document.getElementById("score3");// button of "very nice"
let bubbleWeather = document.getElementById("weather"); // bubble of the weather

/*
Type JokeReport 
@Param joke : string
@Param score : 1|2|3
@param date : string (date in format ISO)
*/
type JokeReport = {
    joke: string | null,
    score: 1 | 2 | 3,
    date: string
}

async function addJokeToParagraph() {
    // try to make the request to the API and get the data
    try {
        apiSelectorNumber = Math.floor(Math.random() * 3 + 1) // get random number from 1 to 3 for choosing the API where we will request
        let res = await fetch(apiSelectorNumber === 1 ? APIJOKES1 : apiSelectorNumber === 2 ? APIJOKES2 : APIJOKESRELIGIOUS, {
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
        let data = await res.json();
        console.log(data);
        // If jokeElement exists then assign the new joke from data.joke
        if (jokeElement) {
            jokeElement.innerHTML = data.joke;
        } else {
            throw new Error('JokeElement is null')
        }

    } catch (e) {
        // Catch all exceptions from API request
        if (e instanceof Error) {
            throw new Error(e.message);

        } else {
            console.log('error: ' + e);
        }
    }
}
//Add the first joke in the html
addJokeToParagraph();

//Add event listener to 'Next' button for execute addJokeToParagraph function, if jokeBtn exists
if (jokeBtn) {
    jokeBtn.addEventListener('click', () => nextJoke());
} else {
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

// nextJoke function call addReport function and call addJokeReport function;
function nextJoke() {
    addReport();
    addJokeToParagraph();
    showJokesReport();
}

// weather api request
async function weatherRequest() {
    try {
        let res = await fetch(APIWEATHER, {
            headers: {
                'accept': 'application/json',
            }
        });
        if (!res.ok) {
            throw new Error('Error in the API request');
        }
        let data = await res.json();
        // create elements for weather data
        let location = document.createElement("p");
        let temperature = document.createElement("p");
        let wind = document.createElement("p");
        let clouds = document.createElement("p");
        location.innerHTML = `Barcelona`;
        temperature.innerHTML = `Temperature : ${data.current.temperature}°C`;
        wind.innerHTML = `Wind : ${data.current.wind.speed} km/h`;
        clouds.innerHTML = `Clouds cover : ${data.current.cloud_cover} %`;
        bubbleWeather?.appendChild(location);
        bubbleWeather?.appendChild(temperature);
        bubbleWeather?.appendChild(wind);
        bubbleWeather?.appendChild(clouds);
        return data;

    } catch (e) {
        // Catch all exceptions from API request
        if (e instanceof Error) {
            throw new Error(e.message);
        } else {
            console.log('error: ' + e);
        }
    }
}
weatherRequest();