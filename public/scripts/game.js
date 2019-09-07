
let stage;
let preloader;
// for keeping track of scaling ratio in makeResponsive;
let scalingRatio = 1;
// cardDict
let cardDict = {};
let playerDict = {};
let username;
let currentCard = null;

// calculuate the pixel ratio of the screen
const PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
    let pRatio = dpr / bsr;
    return pRatio;
})();

// constants regarding canvas size
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 750;

function extendCardName(card) {
    if (card == "JB") {
        return "black_joker";
    }
    else if (card == "JR") {
        return "red_joker";
    }
    let extendedName = "";
    switch (card.charAt(0)) {
        case '1':
            extendedName += "ace";
            break;
        case 'T':
            extendedName += "10";
            break;
        case 'J': 
            extendedName += "jack";
            break;
        case 'Q':
            extendedName += "queen";
            break;
        case 'K':
            extendedName += "king";
            break;
        default:
            extendedName += card.charAt(0);
            break;
    }
    extendedName += "_of_";
    switch (card.charAt(1)) {
        case 'C':
            extendedName += "clubs";
            break;
        case 'D':
            extendedName += "diamonds";
            break;
        case 'H':
            extendedName += "hearts";
            break;
        case 'S':
            extendedName += "spades";
            break;
    }
    return extendedName;
}

function getInitialCards() {
    return [{
        name: "JC",
        x: 100,
        y: 200,
        faceUp: true,
        owner: null
    },
    {
        name: "3D",
        x: 100,
        y: 200,
        faceUp: true,
        owner: null
    }]
}

// function getUsername() {
//     return "richardg";
// }

function getAllPlayers() {
    let players =  ["Richard Guo", "bob"];
    return players;
}

function initializePlayers() {
    let players = getAllPlayers();
    for (let player of players) {
        let playerContainer = new createjs.Container();
        let playerShape = new createjs.Shape();
        playerShape.graphics.beginFill("#FFFFE0").drawEllipse(300, 300, 150, 150);
        playerContainer.addChild(playerShape);
        stage.addChild(playerContainer);
        playerDict[player] = playerContainer;
    }
    stage.update();
}

function initializeImages(initialCards) {
    sources = [];
    // add card back
    sources.push({
        id: "cardback",
        src: "images/ace_of_spades.png"
    });
    for (let card of initialCards) {
        sources.push({
            id: card.name,
            src: "images/" + extendCardName(card.name) + ".png"
        })
    }
    return sources;
}

function initializeCards(initialCards) {
    for (let card of initialCards) {
        let cardContainer = new createjs.Container();
        cardContainer.x = card.x;
        cardContainer.y = card.y;
        let image = new createjs.Bitmap(preloader.getResult(card.name));
        image.scale = .2;
        let cardback = new createjs.Bitmap(preloader.getResult("cardback"));
        cardback.scale = .2;
        cardContainer.addChild(image);
        let bounds = image.getBounds();
        cardContainer.regX = bounds.width*image.scale/2;
        cardContainer.regY = bounds.height*image.scale/2;
        cardContainer.faceUp = card.faceUp;
        let isDragging = false;
        cardContainer.on("click", e => {
            if (isDragging) return;
            
            sendBringFront(card.name);
            sendFlipCard(card.name);
            stage.update();
        });
        cardContainer.on("pressmove", event => {
            isDragging = true;
            currentCard = card.name;
            mouseX = event.stageX / scalingRatio;
            mouseY = event.stageY / scalingRatio;
            // bring to front
            sendBringFront(card.name);
            sendMoveCard(card.name, mouseX, mouseY);

            // make sure to redraw the stage to show the change:
            stage.update();
        });
        cardContainer.on("pressup", e => {
            isDragging = false;
            currentCard = null;
            
        });
        cardContainer.mouseChildren = false;
        stage.addChild(cardContainer);
        cardDict[card.name] = cardContainer;
    }
    stage.update();
}

function init() {
    stage = new createjs.Stage("canvas");
    preloader = new createjs.LoadQueue();

    let initialCards = getInitialCards();
    preloader.loadManifest(initializeImages(initialCards));
    preloader.on("complete", e => handleFileComplete(initialCards));
    username = getUserName();
    initializePlayers();

    function makeResponsive(isResp, respDim, isScale, scaleType) {
        let can = document.getElementById("canvas");
        var lastW, lastH, lastS = 1;
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        function resizeCanvas() {
            var w = CANVAS_WIDTH, h = CANVAS_HEIGHT;
            var iw = window.innerWidth, ih = window.innerHeight;
            var pRatio = PIXEL_RATIO;
            // necessary for dom elements to look right
            pRatio *= 2;
            var xRatio = iw / w, yRatio = ih / h, sRatio = 1;
            if (isResp) {
                if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
                    sRatio = lastS;
                }
                else if (!isScale) {
                    if (iw < w || ih < h)
                        sRatio = Math.min(xRatio, yRatio);
                }
                else if (scaleType == 1) {
                    sRatio = Math.min(xRatio, yRatio);
                }
                else if (scaleType == 2) {
                    sRatio = Math.max(xRatio, yRatio);
                }
            }
            can.width = w * pRatio * sRatio;
            can.height = h * pRatio * sRatio;
            can.style.width = w * sRatio + 'px';
            can.style.height = h * sRatio + 'px';
            stage.scaleX = scalingRatio = pRatio * sRatio;
            stage.scaleY = scalingRatio = pRatio * sRatio;
            lastW = iw; lastH = ih; lastS = sRatio;
            stage.tickOnUpdate = false;
            stage.update();
            stage.tickOnUpdate = true;
        }
    }

    // create canvas with the device resolution.
    //let myCanvas = createHiPPICanvas(CANVAS_WIDTH, CANVAS_HEIGHT, PIXEL_RATIO);
    makeResponsive(true, 'both', true, 1);

    // required to enable mouse hover events
    stage.enableMouseOver(10);

    // Ticker is primarily for mouse hover event
    createjs.Ticker.addEventListener("tick", stage);
}

function handleFileComplete(initialCards) {
    initializeCards(initialCards);

    let personalArea = new createjs.Shape();
    personalArea.graphics.beginFill("#FFFFE0").drawRoundRect(CANVAS_WIDTH*.1, CANVAS_HEIGHT*.7, CANVAS_WIDTH*.8, CANVAS_HEIGHT*.25, 15);
    stage.addChild(personalArea);
/*
    
  */  
    let players = getAllPlayers();

    
    stage.on("stagemouseup", e => {
        let newOwner = null;
        if (currentCard != null) {
            let mouseX = e.stageX / scalingRatio;
            let mouseY = e.stageY / scalingRatio;
            if (personalArea.hitTest(mouseX, mouseY)) {
                newOwner = username;
            }
            for (let player of players) {
                if (player == username) continue;
                if (playerDict[player].hitTest(mouseX, mouseY)) {
                    newOwner = player;
                }
            }
            sendChangeOwner(currentCard, newOwner);
            
        }
    });
    
    stage.update();

}

function sendChangeOwner(cardName, newOwner) {
    receiveChangeOwner(cardName, newOwner);
}

function receiveChangeOwner(cardName, newOwner) {
    console.log(cardName + "new owner:" + newOwner);
    if (newOwner == null) {
        cardDict[cardName].visible = true;
    }
    else if (username != newOwner) {
        cardDict[cardName].visible = false;
    }
    else {
        // what happens if i'm the new owner
    }
}

// Server commands
function sendBringFront(cardName) {
    // @aditya change this
    receiveBringFront(cardName);
}

function sendFlipCard(cardName) {
    // @aditya change this
    receiveFlipCard(cardName);
}

function sendMoveCard(cardName, newX, newY) {
    // @aditya change this
    receiveMoveCard(cardName, newX, newY);
}

// @aditya call this
function receiveBringFront(cardName) {
    stage.setChildIndex(cardDict[cardName], stage.numChildren-1);
    stage.update();
}

// @aditya call this
function receiveFlipCard(cardName) {
    let cardContainer = cardDict[cardName];
    let nextImage;
    if (cardContainer.faceUp) {
        nextImage = new createjs.Bitmap(preloader.getResult("cardback"));
        cardContainer.faceUp = false;
    }
    else {
        nextImage = new createjs.Bitmap(preloader.getResult(cardName));
        cardContainer.faceUp = true;
    }
    nextImage.scale = .2;
    cardContainer.removeAllChildren();
    cardContainer.addChild(nextImage);
    stage.update();
}

// @aditya call this
function receiveMoveCard(cardName, newX, newY) {
    let cardContainer = cardDict[cardName];
    cardContainer.x = newX;
    cardContainer.y = newY;
    stage.update();
}