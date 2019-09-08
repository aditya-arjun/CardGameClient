
let stage;
let preloader;
// for keeping track of scaling ratio in makeResponsive;
let scalingRatio = 1;
// cardDict
let cardDict = {};
let playerDict = {};
let cardOwners = {};
let cursorsDict = {};
let sessionId;
let username;
let currentCard = null;
let personalHand = [];
let cursorColor = "#32CD32";

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

var socket = io();

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

function getInitialCards(board) {
    let initialCards = []
    for (let key in board.card_list)
        initialCards.push(board.card_list[key]);
    return initialCards;
}


// function getUsername() {
//     return "richardg";
// }

function getAllPlayers(board) {
    let players =  [];
    for (let player in board.player_list)
        players.push(player[username]);
    return players;
}

function initializePositions(num, length) {
    partitions = num+1;
    positions = [];
    for (let i = 1; i < partitions; i++) {
        positions.push(i/partitions * length);
    }
    return positions;
}

function createPlayerHands(num) {
    let hand = new createjs.Container();
    let deltaX = 8;
    let deltaY = 15;
    for (let i = 0; i < num; i++) {
        let nextCard = new createjs.Bitmap(preloader.getResult("cardback"));
        nextCard.x = i*deltaX - (num/2*deltaX);
        nextCard.y = deltaY;
        nextCard.scale = .07;
        hand.addChild(nextCard);
    }
    hand.x = 80;
    hand.y = 60;
    return hand;
}

function createPersonalHand(arr) {
    //let hand = new createjs.Container();
    let deltaX = 30;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == null) {
            // haha blank
        }
        else {
            receiveMoveCard(arr[i], i * deltaX+ 190, 640);
            receiveBringFront(arr[i]);
        }
    }
}

function initializePlayers(players, playerImages) {
    let positions = initializePositions(players.length-1, 1000);
    let idx = 0;
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        //let playerImage = playerImages[i];
        if (player == username) {
            continue;
        }
        let playerContainer = new createjs.Container();
        playerContainer.x = positions[idx];
        playerContainer.y = 70;
        let playerShape = new createjs.Shape();
        playerShape.graphics.beginFill("rgba(2, 136, 209, 0.25)").drawEllipse(0, 0, 100, 100);
        playerShape.regX = -50;
        let image = document.createElement("img");
        image.crossOrigin = "Anonymous";
        image.src = playerImages[i];
        let playerImage = new createjs.Bitmap(image);
        playerImage.crossOrigin = "Anonymous";
        playerImage.scale = .2;
        playerImage.mask = playerShape;
        playerImage.x = 50;
        playerContainer.addChild(playerShape, playerImage);
        //let playerName = new createjs.Text(player, "20px Arial");
        //let playerCardCount = new createjs.Text("0", "20px Arial");
        //playerCardCount.y = 30;
        //playerCardCount.name = "count";
        //playerContainer.addChild(playerName, playerCardCount);
        //playerContainer.count = 0;
        let count = 0;
        let hand = createPlayerHands(count);
        playerContainer.addChild(hand);
        //stage.addChild(hand);
        playerContainer.increment = () => {
            count++;
            playerContainer.removeChild(hand);
            hand = createPlayerHands(count);
            playerContainer.addChild(hand);
            stage.update();
        }
        playerContainer.decrement = () => {
            count--;
            playerContainer.removeChild(hand);
            hand = createPlayerHands(count);
            playerContainer.addChild(hand);
            stage.update();
        }
        playerContainer.mouseChildren = false;
        playerDict[player] = playerContainer;
        stage.addChild(playerContainer);
        idx++;
    }
    stage.update();
}

function initializeCursors(players) {
    for (let player of players) {
        if (player == username) continue;
        let cursor = new createjs.Shape();
        cursor.graphics.beginStroke(cursorColor).drawEllipse(0, 0, 10, 10);
        cursor.x = -10;
        cursor.y = -10;
        stage.addChild(cursor);
        cursorsDict[player] = cursor;
    }
}

function initializeImages(initialCards) {
    sources = [];
    // add card back
    sources.push({
        id: "cardback",
        src: "images/card_back.png"
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
        image.scale = .15;
        let cardback = new createjs.Bitmap(preloader.getResult("cardback"));
        cardback.scale = .15;
        if (card.faceUp) {
            cardContainer.addChild(image);
        }
        else {
            cardContainer.addChild(cardback);
        }
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
            receiveBringFront(card.name);
            sendMoveCard(card.name, mouseX, mouseY);
            // make sure to redraw the stage to show the change:
            stage.update();
        });
        cardContainer.on("pressup", e => {
            sendBringFront(card.name);
            isDragging = false;

        });
        cardContainer.mouseChildren = false;
        stage.addChild(cardContainer);
        cardDict[card.name] = cardContainer;
        cardOwners[card.name] = null;
    }
    stage.update();
}

function init(board) {
    stage = new createjs.Stage("canvas");
    preloader = new createjs.LoadQueue();

    let initialCards = board["card_list"];
    let players = board["players_list"];
    let cursorColor = "#32CD32";
    preloader.loadManifest(initializeImages(initialCards));
    preloader.on("complete", e => handleFileComplete(initialCards, players));
    username = getUserName();

    initializePlayers(players, playerImages);
    initializeCursors(players);

    function makeResponsive(isResp, respDim, isScale, scaleType) {
        let can = document.getElementById("canvas");
        var lastW, lastH, lastS = 1;
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        function resizeCanvas() {
            var w = CANVAS_WIDTH, h = CANVAS_HEIGHT;
            let hackyTopHeight = document.getElementById("top-header").offsetHeight;
            var iw = window.innerWidth, ih = window.innerHeight - hackyTopHeight;
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

function handleFileComplete(initialCards, players) {
    initializeCards(initialCards);

    let personalArea = new createjs.Shape();
    personalArea.graphics.beginFill("rgba(2, 136, 209, 0.25)").drawRoundRect(CANVAS_WIDTH*.1, CANVAS_HEIGHT*.75, CANVAS_WIDTH*.8, CANVAS_HEIGHT*.2, 15);
    stage.addChild(personalArea);
    //let players = getAllPlayers();
/*
    let deckArea = new createjs.Shape();
    deckArea.graphics.beginFill("#FFFFE0").drawRoundRect(300, 300, 90, 130, 10);
    stage.addChild(deckArea);*/

    //createPersonalHand(["5D", "3C"]);

    let dealButton = new createjs.DOMElement("deal-button");
    dealButton.x = 55/ PIXEL_RATIO;
    dealButton.y = 200 / PIXEL_RATIO;
    dealButton.scale = .5 / PIXEL_RATIO;
    stage.addChild(dealButton);
    let resetButton = new createjs.DOMElement("reset-button");
    resetButton.x = 55 / PIXEL_RATIO;
    resetButton.y = 220 / PIXEL_RATIO;
    resetButton.scale = .5 / PIXEL_RATIO;
    stage.addChild(resetButton);
    document.getElementById("deal-button").addEventListener("click", e => sendDealEvent());
    document.getElementById("reset-button").addEventListener("click", e => sendResetEvent());

    stage.on("stagemouseup", e => {
        let newOwner = null;

        if (currentCard != null) {
            let mouseX = e.stageX / scalingRatio;
            let mouseY = e.stageY / scalingRatio;
            if (personalArea.hitTest(mouseX, mouseY)) {
                newOwner = username;
                let deltaX = 30;
                for (let i = 0; i < personalHand.length; i++) {
                    if (mouseX > i*deltaX+160 && mouseX <= deltaX*(i+1)+160) {
                        //movePersonalToIndex(currentCard, i);
                        break;
                    }
                }
            }

            for (let player of players) {
                if (player == username) continue;
                let playerContainer = playerDict[player];
                let point = playerContainer.globalToLocal(e.stageX, e.stageY);
                if (playerContainer.hitTest(point.x, point.y)) {
                    newOwner = player;
                }
            }
            sendChangeOwner(currentCard, newOwner);
            currentCard = null;
        }
    });



    stage.on("stagemousemove", e => {
        let mouseX = e.stageX / scalingRatio;
        let mouseY = e.stageY / scalingRatio;
        sendMoveCursor(username, mouseX, mouseY);
    });
    stage.update();
}

function movePersonalToIndex(card, index) {
    if (personalHand.includes(card)) {
        personalHand.splice(personalHand.indexOf(card), 1);
    }
    personalHand.splice(index, 0, card);
    createPersonalHand(personalHand);
    console.log(personalHand);
}

function sendMoveCursor(name, newX, newY) {

}

function receiveMoveCursor(name, newX, newY) {
    if (name == username) return;
    let cursor = cursorsDict[name];
    cursor.x = newX;
    cursor.y = newY;
    stage.update();
}

function sendDealEvent() {

}

function sendResetEvent() {

}

function sendChangeOwner(cardName, newOwner) {
    socket.emit('transfer',{
        "author": sessionId,
        'cardName': cardName,
        'newOwner': newOwner
    });
    receiveChangeOwner(cardName, newOwner);
}

function receiveChangeOwner(cardName, newOwner) {
    console.log(cardName + ", new owner:" + newOwner);
    if (cardOwners[cardName] != null) {
        if (cardOwners[cardName] == username) {
            personalHand.splice(personalHand.indexOf(cardName), 1);
        }
        else {
            let owner = cardOwners[cardName];
            playerDict[owner].decrement();
        }

    }
    cardOwners[cardName] = newOwner;
    if (newOwner == null) {
        cardDict[cardName].visible = true;
    }
    else if (username != newOwner) {
        cardDict[cardName].visible = false;
        playerDict[newOwner].increment();

    }
    else {
        // what happens if i'm the new owner
        if (!personalHand.includes(cardName)) {
            movePersonalToIndex(cardName, personalHand.length);
        }
        else {
            movePersonalToIndex(cardName, personalHand.length);
        }
        /*
        personalHand.push(cardName);
        createPersonalHand(personalHand);*/
    }
}

// Server commands
function sendBringFront(cardName) {
    // @aditya change this
    socket.emit('card_front', {
        "author": sessionId,
        "cardName": cardName
    });
    receiveBringFront(cardName);
}

function sendFlipCard(cardName) {
    // @aditya change this
    socket.emit('card_flip', {
        "author": sessionId,
        'cardName': cardName
    });
    receiveFlipCard(cardName);
}

function sendMoveCard(cardName, newX, newY) {
    // @aditya change this
    socket.emit('card_move', {
        "author":     sessionId,
        "cardName":   cardName,
        "newX":       newX,
        "newY":       newY});
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
    nextImage.scale = .15;
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

// Insert some listeners

socket.on('connect', function() {
    socket.emit('generate_user_id');
    socket.on('generate_user_id', function(msg) {
        sessionId = msg['data'];
    });
    // socket.emit('createExtra',{'settings': null});
    // socket.emit('join_room',{'room': 'A'})
});

socket.on('start', function(msg){
    init(msg);
});

socket.on('transfer', function(msg) {
    if (!("author" in msg) || (msg["author"] != sessionId))
        receiveChangeOwner(msg['cardName'],msg['newOwner']);
});

socket.on('card_front', function(msg) {
    if (!("author" in msg) || (msg["author"] != sessionId))
        receiveBringFront(msg['cardName']);
});

socket.on('card_flip', function(msg) {
    if (!("author" in msg) || (msg["author"] != sessionId))
        receiveFlipCard(msg['cardName']);
});

socket.on('card_move', function(msg) {
    if (!("author" in msg) || (msg["author"] != sessionId))
        receiveMoveCard(msg['cardName'], msg['newX'], msg['newY']);
});
