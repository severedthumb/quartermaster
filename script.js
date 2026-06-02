const characterSelection = document.querySelector('.character-selection');
const characterDetails = document.querySelector('.character-details');

const buttonCade = document.querySelector('.button-cade');

buttonCade.addEventListener('click', () => {
    characterSelection.style.display = 'none';
    characterDetails.style.display = 'block';
})