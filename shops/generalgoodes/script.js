const inventory = document.querySelector('.inventory');

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
    itemBuyButton.addEventListener('click', (event) => {
        event.stopPropagation();
        alert('Item bought');
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



/*
                <div class='inventory-item' id='test'>
                    <div class='item-main'>
                        <span class='caret' id='test-caret'>▶</span>
                        <span class='item-name'>Potion of Example</span>
                        <span class='item-price'>300 gp</span>
                        <button class='item-button'>add</button>
                    </div>

                    <div class='item-description hidden' id='test-desc'>
                        <p>Here is some text.</p>
                    </div>
                </div>

*/