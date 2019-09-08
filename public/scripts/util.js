// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton(inputElement, buttonElement) {
	if (inputElement.value) {
		buttonElement.removeAttribute('disabled');
	} else {
		buttonElement.setAttribute('disabled', 'true');
	}
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

function displayElement(element) {
	element.style.display = "block";
}