// THIS IS THE "HUB PAGE" JS

const characterSelection = document.querySelector('.character-selection');

const characterDetails = document.querySelector('.character-details');
const characterName = document.querySelector('.character-name');
const characterClass = document.querySelector('.character-class');
const detailsCoins = document.querySelector('.details-coins');

const inventory = document.querySelector('.inventory');

const linkGeneralGoodes = document.getElementById('link-general-goodes');


// CREATE CHARACTER SELECTION BUTTONS
fetch('/api/characters')
    .then(res => res.json())
    .then(characters => {
        characters.forEach(character => {
            const button = document.createElement('div');
            button.classList.add('character-option');
            const buttonText = document.createElement('p');
            buttonText.textContent = character.first_name;
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



// FUNCTIONS - THESE ARE BOTH CALLED WHEN A CHARACTER IS SELECTED


function fillCharacterDetails(character) {
    characterName.textContent = character.first_name;
    characterClass.textContent = `${character.race} ${character.class}, level ${character.level}`;
    detailsCoins.textContent = formatMoney(character.money);
    linkGeneralGoodes.href = `/shops/generalgoodes/index.html?character_id=${character.id}`;
};

function renderInventory(items) {

    if (items.length === 0) {
        const div = document.createElement('div');
        div.classList.add('inventory-item');
        const p = document.createElement('p');
        p.textContent = "this guy ain't got nothin' in his inventory";
        div.appendChild(p);
        inventory.appendChild(div);
        return;
    }

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
};






// HELPER FUNCTION
function formatMoney(money) {
    const gp = Math.floor(money / 100);
    money %= 100;

    const sp = Math.floor(money / 10);
    money %= 10;

    const cp = money;

    return `${gp} gp, ${sp} sp, ${cp} cp`;
};