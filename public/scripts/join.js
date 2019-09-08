var joinFormElement = document.getElementById('join-form');
var joinCodeInputElement = document.getElementById('join-code')
var joinSubmitButtonElement = document.getElementById('join-submit');

function toggleJoinButton() {
	toggleButton(joinCodeInputElement, joinSubmitButtonElement);
}

function onJoinFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a game code and is signed in.
  if (joinCodeInputElement.value && checkSignedInWithMessage()) {
    // joins game
    socket.emit('join_room', {userName: getUserName(), userPPUrl: getProfilePicUrl(), roomCode: joinCodeInputElement.value});
  	resetMaterialTextfield(joinCodeInputElement);
    toggleJoinButton();
  }
  socket.on('confirm', function() {
    loadGamePage();
    // window.location.href = '/game.html';
  });
}

// Saves message on form submit.
joinFormElement.addEventListener('submit', onJoinFormSubmit);

// Toggle for the button.
joinCodeInputElement.addEventListener('keyup', toggleJoinButton);
joinCodeInputElement.addEventListener('change', toggleJoinButton);