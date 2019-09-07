
let stage;
let preloader;
// for keeping track of scaling ratio in makeResponsive;
let scalingRatio = 1;

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
            extendedName += "ten";
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

function initializeImages(initialCards) {
    sources = [];
    // add card back
    sources.push({
        id: "cardback",
        src: "images/ace_of_spades.png"
    });
    for (card of initialCards) {
        sources.push({
            id: card.name,
            src: "images/" + extendCardName(card.name) + ".png"
        })
    }
    return sources;
}

function initializeCards(initialCards) {
    for (card of initialCards) {
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
        let isFaceUp = card.faceUp;
        let isDragging = false;
        cardContainer.on("click", e => {
            if (isDragging) return;
            let nextImage;
            if (isFaceUp) {
                nextImage = cardback;
            }
            else {
                nextImage = image;
            }
            isFaceUp = !isFaceUp;
            nextImage.scale = .2;
            cardContainer.removeAllChildren();
            cardContainer.addChild(nextImage);
            
        });
        cardContainer.on("pressmove", event => {
            isDragging = true;
            mouseX = event.stageX / scalingRatio;
            mouseY = event.stageY / scalingRatio;
            // currentTarget will be the container that the event listener was added to:
            event.currentTarget.x = mouseX;
            event.currentTarget.y = mouseY;
            // bring to front
            stage.setChildIndex(cardContainer, stage.numChildren-1);
            // make sure to redraw the stage to show the change:
            stage.update();
        });
        cardContainer.on("pressup", e => {
            isDragging = false;
        });
        cardContainer.mouseChildren = false;
        stage.addChild(cardContainer);
    }
    stage.update();
}

function init() {
    stage = new createjs.Stage("canvas");
    preloader = new createjs.LoadQueue();

    let initialCards = getInitialCards();
    preloader.loadManifest(initializeImages(initialCards));
    preloader.on("complete", e => handleFileComplete(initialCards));

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


}