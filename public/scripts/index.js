var joinFormElement = document.getElementById('join-form');
var gameCodeInputElement = document.getElementById('join-code')
var joinSubmitButtonElement = document.getElementById('join-submit');

function toggleJoinButton() {
	toggleButton(gameCodeInputElement, joinSubmitButtonElement);
}

function onJoinFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a game code and is signed in.
  if (gameCodeInputElement.value && checkSignedInWithMessage()) {
  	// launch game with gameCodeInputElement.value
  	resetMaterialTextfield(gameCodeInputElement);
    toggleJoinButton();
    // saveMessage(messageInputElement.value).then(function() {
    //   // Clear message text field and re-enable the SEND button.
    //   resetMaterialTextfield(gameCodeInputElement);
    //   toggleChatButton();
    // });
  }
}

// Saves message on form submit.
joinFormElement.addEventListener('submit', onJoinFormSubmit);

// Toggle for the button.
gameCodeInputElement.addEventListener('keyup', toggleJoinButton);
gameCodeInputElement.addEventListener('change', toggleJoinButton);