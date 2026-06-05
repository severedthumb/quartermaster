const inventory = document.querySelector('.inventory');

fetch('/api/items')
    .then(res => res.json())
    .then(items => {
        items.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('inventory-item');
            const p = document.createElement('p');
            p.textContent = item.name;
            const button = document.createElement('button');
            button.textContent = `buy for ${item.price} gp`;
            div.appendChild(p);
            div.appendChild(button);
            inventory.appendChild(div);
            
        });
    });



/*
                <div class='inventory-item'>
                    <p>item example</p>
                    <button class='button-sell-item'>sell for 3 gp</button>
                </div>

*/