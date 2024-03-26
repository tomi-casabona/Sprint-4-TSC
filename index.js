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
let joke = document.getElementsByClassName("joke")[0];
let jokeBtn = document.getElementsByClassName("get-joke")[0];
let API = 'https://icanhazdadjoke.com/';
function addJokeToParagraph() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(API, {
            headers: {
                'accept': 'application/json',
            }
        });
        let data = yield res.json();
        console.log(data);
        joke.innerHTML = data.joke;
    });
}
addJokeToParagraph();
jokeBtn.addEventListener('click', addJokeToParagraph);
