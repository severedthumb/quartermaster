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
                renderInventory(character, items);

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

function renderInventory(character, items) {

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

        const itemName = document.createElement('p');
        itemName.classList.add('item-name');
        itemName.textContent = item.name;

        const itemQuantity = document.createElement('p');
        itemQuantity.classList.add('item-quantity');
        itemQuantity.textContent = `quantity: ${item.quantity}`;

        const itemButton = document.createElement('button');
        itemButton.classList.add('item-button');
        itemButton.textContent = `sell for ${formatPrice(item.price)}`;
        itemButton.addEventListener('click', async (event) => {
            event.stopPropagation();
        
            const res = await fetch('/api/sell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    character_id: character.id,
                    item_id: item.id
                })
            })

            const result = await res.json();
            
            if (result.success) {
                showToast(`Sold ${item.name} for ${formatPrice(item.price)}.`);
                character = await refreshCharacter(character);
                refreshInventory(character);
            } else {
                showToast(result.message);
            }
        });

        div.appendChild(itemName);
        div.appendChild(itemQuantity);
        div.appendChild(itemButton);
        inventory.appendChild(div);

    })
};


// REFRESH INVENTORY (called after an inventory item is sold)
async function refreshInventory(character) {
    inventory.innerHTML = '';

    const res = await fetch(`/api/inventory?character_id=${character.id}`);
    const items = await res.json();

    renderInventory(character, items);
};

// REFRESH CHARACTER (called after an inventory item is sold, to get new money total)
async function refreshCharacter(character) {
    const res = await fetch(`/api/characters?character_id=${character.id}`);
    const data = await res.json();

    const updatedCharacter = data[0];

    fillCharacterDetails(updatedCharacter);

    return updatedCharacter;
};


// TOAST NOTIFICATION
const toast = document.querySelector('.toast');

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
};



// HELPER FUNCTION
// for displaying player money total, which includes 0s (e.g., 10 gp, 0 sp, 0 cp)
function formatMoney(money) {
    const gp = Math.floor(money / 100);
    money %= 100;

    const sp = Math.floor(money / 10);
    money %= 10;

    const cp = money;

    return `${gp} gp, ${sp} sp, ${cp} cp`;
};

// for displaying item prices, which does NOT include 0s (e.g., 5 sp)
function formatPrice(price) {
    const gp = Math.floor(price / 100);
    price %= 100;

    const sp = Math.floor(price / 10);
    price %= 10;

    const cp = price;

    const parts = [];

    if (gp > 0) parts.push(`${gp} gp`);
    if (sp > 0) parts.push(`${sp} sp`);
    if (cp > 0) parts.push(`${cp} cp`);

    return parts.join(' ');
};