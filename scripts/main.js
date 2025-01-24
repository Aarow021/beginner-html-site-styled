let myButton = document.querySelector("#change-user");
let myHeading = document.querySelector("h1");
let myImage = document.querySelector("img");
let nightToggle = document.querySelector(".night-mode");
const particleLimit = 100;
let spinDeg = 0;
let spinSpeed = 1;
let mouseX = 0;
let mouseY = 0;
let particleQueue = []
let itemTypes = {
    'common': ['wooden_pickaxe', 'wooden_shovel', 'wooden_sword', 'wooden_axe', 'oak_planks', 'stick'],
    'uncommon': ['stone_pickaxe', 'stone_shovel', 'stone_sword', 'stone_axe', 'steak'],
    'rare': ['iron_pickaxe', 'iron_shovel', 'iron_sword', 'iron_axe', 'potion_of_healing'],
    'epic': ['diamond_pickaxe', 'diamond_shovel', 'diamond_sword', 'diamond_axe', 'golden_apple'],
    'legendary': ['netherite_pickaxe', 'netherite_shovel', 'netherite_sword', 'netherite_axe', 'enchanted_golden_apple'],
    'mythical': ['beacon', 'elytra', 'dragon_egg', 'totem_of_undying', 'trident'],
    'godly': ['command_block', 'barrier', 'herobrine']
};

let inventory = {'default': {'rarity': 'common', 'count': 0}}


//Waits for period of time (ms)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initInv() {
    let statContainer = document.querySelector('.stats-container');
    for (rarity of Object.entries(itemTypes)) {
        let rarityContainer = statContainer.querySelector(`.${rarity[0]}-container`)
        for (let i = 0; i < rarity[1].length; i++) {
            inventory[rarity[1][i]] = {'rarity': rarity[0], 'count': 0}
            let statCard = document.createElement('div');
            let statImg = document.createElement('img');
            let statNum = document.createElement('p');
            statCard.className = `stat-card ${rarity[1][i]}-card`;
            statImg.className = `${rarity[0]} hidden`;
            statImg.src = `images/${rarity[1][i]}.webp`;
            statNum.innerText = '0';
            statCard.appendChild(statImg);
            statCard.appendChild(statNum);
            rarityContainer.appendChild(statCard);
        }
        statContainer.appendChild(rarityContainer);
    }
    document.querySelector('.body-wrapper').appendChild(statContainer);
}

//Prompts user to give name, changes h1 content based on name
function setUserName() {
    const myName = prompt("PLEASE, ENTER YOUR NAME!");
    if (!myName) {
        setUserName();
    }
    localStorage.setItem("name", myName);
    myHeading.innerHTML = `Mozilla is cool, ${myName}`;
}

function addQueue(obj, queue=particleQueue) {
    queue.push(obj);
}

function takeQueue(queue=particleQueue) {
    return queue.pop();
}

//Rotates an object (keeps previous rotation)
async function rotate(obj, degrees=360, speed=1) {
    if (!obj) return
    if (!obj.style.transform) obj.style.transform = 'rotate(0deg)';
    if (speed)
    for (let index = 0; index < degrees; index += speed) {
        obj.style.transform = `rotate(${parseFloat(obj.style.transform.substring(obj.style.transform.indexOf('rotate') + 7, obj.style.transform.indexOf('deg'))) + speed}deg)`;
        await sleep(1);
    }
}

async function foreverSpin(obj, speed=1) {
    if (!obj) return
    if (!obj.style.transform) obj.style.transform = 'rotate(0deg)';
    if (speed)
    while (obj.style.display != 'none') {
        obj.style.transform = `rotate(${parseFloat(obj.style.transform.substring(obj.style.transform.indexOf('rotate') + 7, obj.style.transform.indexOf('deg'))) + speed}deg)`;
        await sleep(1);
    }
}

//Prompts user for new spin degrees
function changeSpinDeg() {
    spinDeg = parseFloat(prompt("How many degrees do you want things to spin?"));
}

//Prompts user for new spin speed
function changeSpinSpeed() {
    spinSpeed = parseFloat(prompt("How fast do you want things to spin?"));
    if (spinSpeed <= 0) {
        spinSpeed = 1;
    }
}

//Recursively adds click event listener (rotate) to an object and its children
function initChildren(obj) {
    for (let index = 0; index < obj.childElementCount; index++) {
        initChildren(obj.children[index]);
    }
    obj.addEventListener('click', (e) => {
        rotate(e.target, spinDeg, spinSpeed);
        e.stopPropagation()
    });
}

// //Returns position of object relative to its parent
// function relPos(obj) {
//     if (!obj || !obj.parentElement) return {'top': 0, 'bottom': 0, 'left': 0, 'Right': 0, };
//     let objBox = obj.getBoundingClientRect();
//     let parentBox = obj.parentElement.getBoundingClientRect();
//     let relPos = {};
//     relPos.top = objBox.top - parentBox.top;
//     relPos.bottom = objBox.bottom - parentBox.bottom;
//     relPos.left = objBox.left - parentBox.left;
//     relPos.Right = objBox.Right - parentBox.Right;
//     return relPos;
// }

function getPos(obj) {
    if (!obj) return;
    let objBox = obj.getBoundingClientRect();
    let pos = {};
    pos.top = objBox.top
    pos.bottom = objBox.bottom
    pos.left = objBox.left
    pos.Right = objBox.Right
    return pos;
}

//Adds values to object's transform
async function applyPhysics(obj, velocity=[0,-5], acceleration=[0,.1]) {
    let time = 0;
    while(obj.style.display != 'none') {
        obj.style.left = `${getPos(obj).left + velocity[0] + acceleration[0]*time}px`;
        obj.style.top = `${getPos(obj).top + velocity[1] + acceleration[1]*time}px`;
        time++;
        if (obj.style.display === 'none' || time >= 150) return;
        await sleep(10);
    }
}

async function applyFade(obj) {
    if (!obj.style.opacity) obj.style.opacity = '1';
    while(parseFloat(obj.style.opacity) > 0) {
        obj.style.opacity = `${parseFloat(obj.style.opacity) - .1}`
        await sleep(10);
    }
}

function invAdd(item) {
    let statCard = document.getElementsByClassName(`${item}-card`)[0];
    if (inventory[item].count === 0) {
        statCard.querySelector('img').classList.remove('hidden');
    }
    inventory[item].count++;
    statCard.querySelector('p').innerText = inventory[item].count;
}

function generateType() {
    let rarityRoll = Math.random() * 100;
    let rarity;
    if (rarityRoll <= .01) {
        rarity = 'godly';
    } else if (rarityRoll <= .1) {
        rarity = 'mythical';
    } else if (rarityRoll <= .5) {
        rarity = 'legendary';
    } else if (rarityRoll <= 1.5) {
        rarity = 'epic';
    } else if (rarityRoll <= 10) {
        rarity = 'rare';
    } else if (rarityRoll <= 40) {
        rarity = 'uncommon';
    } else {
        rarity = 'common';
    }
    let itemTable = itemTypes[rarity];
    let itemType = itemTable[Math.floor(Math.random() * (itemTable.length))]
    return {'item': itemType, 'rarity': rarity};
}

async function generateItem() {
    let item;
    let itemDisplay;
    if (particleQueue.length > 1) {
        item = takeQueue();
        itemDisplay = item.children[0];
        itemDisplay.className = 'item-display'
        item.style.display = 'block';
        itemDisplay.style.display = 'block'
        item.style.opacity = 1;
    } else {
        if (document.querySelector('.particle-holder').childElementCount > particleLimit) return;

        item = document.createElement('div');
        item.classList.add('item-particle');
        item.height = 50;
        item.width = 50;
        item.style.position = 'absolute';
        itemDisplay = document.createElement('img');
        itemDisplay.classList.add('item-display')
        item.appendChild(itemDisplay);
        document.querySelector('.particle-holder').appendChild(item);
    }
    let itemGen = generateType();
    invAdd(itemGen.item);
    itemDisplay.classList.add(itemGen.rarity);
    itemDisplay.src = `images/${itemGen.item}.webp`;
    item.style.top = `${mouseY - item.height/2}px`;
    item.style.left = `${mouseX - item.width/2}px`;
    let velocity = [Math.random()*(5 - -5) + -5, Math.random()*(-5) - 1]
    applyPhysics(item, velocity);
    foreverSpin(itemDisplay, Math.random() * (2 - -2) + -2);
    await sleep(1500);
    await applyFade(item);
    item.style.display = 'none';
    itemDisplay.style.display = 'none';
    addQueue(item);
}


//Sets or prompts stored name on page load
if (!localStorage.getItem("name")) {
    setUserName();
} else {
    const storedName = localStorage.getItem("name");
    myHeading.innerHTML = `Mozilla is cool, ${storedName}`;
}

//Actual code running starts here

initInv();
myButton.addEventListener('click', setUserName);
document.getElementById('spin-degrees').addEventListener('click', changeSpinDeg);
document.getElementById('spin-speed').addEventListener('click', changeSpinSpeed);

myImage.addEventListener('click', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    generateItem();
});

//Adds rotate on click to all of body's children
initChildren(document.querySelector('.body-wrapper'));

nightToggle.addEventListener('click', (e) => {
    let btn = e.target;
    btn.classList.toggle('active')
    if (btn.classList.contains('active')) {
        document.querySelector('.body-wrapper').style.backgroundColor = 'black';
        document.querySelector('.body-wrapper').style.color = 'white';
        document.body.style.backgroundColor = '#002344';
        document.querySelector('html').style.backgroundColor = '#002344';
        document.querySelector('.stats-container').style.backgroundColor = '#808080';
        
    } else {
        document.querySelector('.body-wrapper').style.backgroundColor = '';
        document.querySelector('.body-wrapper').style.color = '';
        document.body.style.backgroundColor = '';
        document.querySelector('html').style.backgroundColor = '';
        document.querySelector('.stats-container').style.backgroundColor = ''
    }
})