var cards = ['1C', '1D', '1H', '1S']

function toggleCardInclusion(cardLayerElement) {
	if (cardLayerElement.classList.value.includes('visible')) {
		cardLayerElement.classList.remove('visible');
	} else {
		cardLayerElement.classList.add('visible');
	}
}

function test(e) {
	toggleCardInclusion(e.target);
}

for (let i = 0; i < cards.length; i++) {
	elt = document.getElementById(cards[i]).addEventListener('click', test, false);
}



var createFormElement = document.getElementById('create-form');
var numPlayersInputElement = document.getElementById('num-players')
var createSubmitButtonElement = document.getElementById('create-submit');

function toggleCreateButton() {
	toggleButton(numPlayersInputElement, createSubmitButtonElement);
}

function onCreateFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered number of players code and is signed in.
  if (numPlayersInputElement.value && checkSignedInWithMessage()) {
  	// launch game with form values
  	var excluded = [];
  	for (let i = 0; i < cards.length; i++)
  		if (document.getElementById(cards[i]).classList.value.includes('visible'))
  			excluded.push(cards[i]);
  	// create game with excluded ()
  	socket.emit('my event', {data: 'I\'m connected!'});
  	console.log(excluded);
  	console.log(numPlayersInputElement.value);
  	resetMaterialTextfield(numPlayersInputElement);
    toggleCreateButton();
  }
}

// Saves message on form submit.
createFormElement.addEventListener('submit', onCreateFormSubmit);

// Toggle for the button.
numPlayersInputElement.addEventListener('keyup', toggleCreateButton);
numPlayersInputElement.addEventListener('change', toggleCreateButton);