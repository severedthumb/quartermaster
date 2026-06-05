const characterSelection = document.querySelector('.character-selection');

const characterDetails = document.querySelector('.character-details');
const characterName = document.querySelector('.character-name');
const characterClass = document.querySelector('.character-class');

const inventory = document.querySelector('.inventory');

fetch('/api/characters')
    .then(res => res.json())
    .then(characters => {
        characters.forEach(character => {
            const button = document.createElement('div');
            button.classList.add('character-option');
            const buttonText = document.createElement('p');
            buttonText.textContent = character.name;
            button.appendChild(buttonText);

            const characterId = character.id;

            button.addEventListener('click', async () => {
                const res = await fetch(`/api/inventory?character_id=${characterId}`);
                const items = await res.json();

                fillCharacterDetails(character);
                renderInventory(items);

                characterSelection.style.display = 'none';
                characterDetails.style.display = 'block';
            });

            characterSelection.appendChild(button);
        });
    });



// FUNCTIONS

function fillCharacterDetails(character) {
    characterName.textContent = character.name;
    characterClass.textContent = 'placeholder text for race and class';
}

function renderInventory(items) {
    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('inventory-item');
        const p = document.createElement('p');
        p.textContent = item.name;
        const button = document.createElement('button');
        button.textContent = `sell for ${item.price} gp`;
        div.appendChild(p);
        div.appendChild(button);
        inventory.appendChild(div);

    })
}