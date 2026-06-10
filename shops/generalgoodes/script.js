// THIS IS THE "GENERAL GOODE'S" PAGE JS

let character;

const userMessage = document.querySelector('.user-message');
const inventory = document.querySelector('.inventory');



async function loadCharacter() {
    const params = new URLSearchParams(window.location.search);
    const characterId = params.get('character_id');

    const res = await fetch(`/api/characters?character_id=${characterId}`);
    const characters = await res.json();
    character = characters[0]; // NOTE: This is because the API still returns an array even if it's just one character.

    userMessage.textContent = `You are logged in as ${character.first_name}. You have ${formatMoney(character.money)} to spend.`;

}

loadCharacter();




fetch('/api/items')
    .then(res => res.json())
    .then(items => {
        items.forEach(item => {
            createItem(item);
        });
    });

function createItem(item) {
    const inventoryItem = document.createElement('div');
    inventoryItem.classList.add('inventory-item');

    const itemMain = document.createElement('div')
    itemMain.classList.add('item-main');
    inventoryItem.append(itemMain);

    const caret = document.createElement('span');
    caret.classList.add('caret');
    caret.innerText = '▶';
    itemMain.append(caret);

    const itemName = document.createElement('span');
    itemName.classList.add('item-name');
    itemName.innerText = item.name;
    itemMain.append(itemName);

    const itemPrice = document.createElement('span');
    itemPrice.classList.add('item-price');
    itemPrice.innerText = formatPrice(item.price);
    itemMain.append(itemPrice);

    const itemBuyButton = document.createElement('button');
    itemBuyButton.classList.add('item-button');
    itemBuyButton.innerText = 'buy';
    itemBuyButton.addEventListener('click', async (event) => {
        event.stopPropagation();
        
        const res = await fetch('/api/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                character_id: character.id,
                item_id: item.id
            })
        })

        const result = await res.json();
        
        if (result.success) {
            showToast(`Purchased ${item.name} for ${formatPrice(item.price)}.`);
        } else {
            showToast(result.message);
        }
    });
    itemMain.append(itemBuyButton);

    const itemDesc = document.createElement('div');
    itemDesc.classList.add('item-description');
    itemDesc.classList.add('hidden');
    inventoryItem.append(itemDesc);

    const itemDescText = document.createElement('p');
    itemDescText.innerText = item.description;
    itemDesc.append(itemDescText);

    inventory.append(inventoryItem);

    inventoryItem.addEventListener('click', () => {
        itemDesc.classList.toggle('hidden');
        caret.classList.toggle('open');
    })
};



// TOAST NOTIFICATION
const toast = document.querySelector('.toast');

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}


// MONEY FORMATTING FUNCTIONS
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
}