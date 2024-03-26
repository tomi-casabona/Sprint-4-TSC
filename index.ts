let joke : Element  = document.getElementsByClassName("joke")[0];
let jokeBtn : Element = document.getElementsByClassName("get-joke")[0];

let API : string = 'https://icanhazdadjoke.com/';


async function addJokeToParagraph() {

    let res =  await fetch(API, {
        headers: {
            'accept': 'application/json',
        }
    });

    let data =  await res.json();

    console.log(data);
    joke.innerHTML = data.joke ;
}
addJokeToParagraph();

jokeBtn.addEventListener('click', addJokeToParagraph);


