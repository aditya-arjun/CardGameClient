var displayGameSettingsButtonElement = document.getElementById('display-game-settings-button');
var gameSettingsElement = document.getElementById('game-settings');
displayGameSettingsButtonElement.addEventListener('click', function() {
  displayElement(gameSettingsElement);
});

var cards = ['1C', '1D', '1H', '1S',
             '2C', '2D', '2H', '2S',
             '3C', '3D', '3H', '3S',
             '4C', '4D', '4H', '4S',
             '5C', '5D', '5H', '5S',
             '6C', '6D', '6H', '6S',
             '7C', '7D', '7H', '7S',
             '8C', '8D', '8H', '8S',
             '9C', '9D', '9H', '9S',
             'TC', 'TD', 'TH', 'TS',
             'JC', 'JD', 'JH', 'JS',
             'QC', 'QD', 'QH', 'QS',
             'KC', 'KD', 'KH', 'KS',
             'JB', 'JR']

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
    socket.emit('create', {userName: getUserName(), userPPUrl: getProfilePicUrl(), excluded: excluded, numPlayers: numPlayersInputElement.value});
  	resetMaterialTextfield(numPlayersInputElement);
    toggleCreateButton();
  }
}

// Saves message on form submit.
createFormElement.addEventListener('submit', onCreateFormSubmit);

// Toggle for the button.
numPlayersInputElement.addEventListener('keyup', toggleCreateButton);
numPlayersInputElement.addEventListener('change', toggleCreateButton);