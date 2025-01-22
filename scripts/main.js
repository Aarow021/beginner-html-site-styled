let myButton = document.querySelector("button");
let spinButton = document.querySelector("button:nth-of-type(2)");
let myHeading = document.querySelector("h1");
let myImage = document.querySelector("img");
let spinDeg = 0;
let spinSpeed = 1;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setUserName() {
    const myName = prompt("PLEASE, ENTER YOUR NAME!");
    if (!myName) {
        setUserName();
    }
    localStorage.setItem("name", myName);
    myHeading.innerHTML = `Mozilla is cool, ${myName}`;
}

async function rotate(object, degrees=360, speed=1) {
    for (let index = 0; index < degrees / speed || 1; index++) {
        object.style.transform = `rotate(${index * speed}deg)`;
        await sleep(1);
    }
}

function changeSpin() {
    spinDeg = prompt("How many degrees do you want things to spin?");
    spinSpeed = prompt("How many fast do you want things to spin?");
    if (spinSpeed <= 0) {
        spinSpeed = 1;
    }
}

if (!localStorage.getItem("name")) {
    setUserName();
} else {
    const storedName = localStorage.getItem("name");
    myHeading.innerHTML = `Mozilla is cool, ${storedName}`;
}

myButton.addEventListener('click', setUserName);
spinButton.addEventListener('click', changeSpin);

let eveything = document.querySelectorAll('*');
for (let index = 0; index < array.length; index++) {
    let item = eveything[index];
    item.addEventListener('click', (e) => {
        rotate(e.target, spinDeg, spinSpeed);
    });
    
}

myImage.addEventListener('click', (e) => {
    rotate(e.target, 9999, 10);
})
