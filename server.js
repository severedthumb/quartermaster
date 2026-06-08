const http = require('http');
const url = require('url');
const fs = require('fs');
const db = require('./db');



const server = http.createServer((req, res) => {

    if (req.url === '/') {                                                  // SERVE HUB HTML
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });

    } else if (req.url === '/styles.css') {                                 // SERVE HUB CSS
        fs.readFile('styles.css', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });

    } else if (req.url === '/script.js') {                                  // SERVE HUB JS
        fs.readFile('script.js', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    
    } else if (req.url.startsWith('/shops/generalgoodes/index.html')) {     // SERVE GENERAL GOODE'S HTML
        fs.readFile('shops/generalgoodes/index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });

    } else if (req.url === '/shops/generalgoodes/styles.css') {             // SERVE GENERAL GOODE' CSS
        fs.readFile('shops/generalgoodes/styles.css', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });

    } else if (req.url === '/shops/generalgoodes/script.js') {              // SERVE GENERAL GOODE'S JS
        fs.readFile('shops/generalgoodes/script.js', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });

    } else if (req.url.startsWith('/api/characters')) {                     // API CHARACTERS

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);       // FIX THIS LINE
        const characterId = parsedUrl.searchParams.get('character_id');

        if (!characterId) {
            const rows = db.prepare('SELECT id, first_name, last_name, race, class, level, money FROM characters').all();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
            return;
        }

        const rows = db.prepare(`
            SELECT id, first_name, last_name, race, class, level, money
            FROM characters
            WHERE id = ?    
        `).all(characterId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
        return;

    } else if (req.url === '/api/items') {                                  // API ITEMS
        const rows = db.prepare('SELECT id, name, price, description FROM items').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
        return;

    } else if (req.url.startsWith('/api/inventory')) {                      // API INVENTORY

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);     // FIX THIS LINE
        const characterId = parsedUrl.searchParams.get('character_id');

        if (!characterId) {
            const rows = db.prepare('SELECT character_id, item_id, quantity FROM inventory').all();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
            return;
        }

        const rows = db.prepare(`
            SELECT
                items.name,
                items.price,
                items.description,
                inventory.quantity
            FROM inventory
            JOIN items ON inventory.item_id = items.id
            WHERE inventory.character_id = ?
        `).all(characterId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
        return;

    } else if (req.url === '/api/purchase' && req.method === 'POST') {      // API PURCHASE (FOR 'POST' REQUESTS!)

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const purchase = JSON.parse(body);

            // look up the character
            const character = db.prepare(`
                SELECT *
                FROM characters
                WHERE id = ?
            `).get(purchase.character_id);

            // look up the item
            const item = db.prepare(`
                SELECT *
                FROM items
                WHERE id = ?
            `).get(purchase.item_id);

            // make sure character can afford the item
            if (character.money < item.price) {
                console.log('Not enough money.');

                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Not enough money.'
                }));

                return;
            };

            // actually make the purchase
            const newMoney = character.money - item.price;

            db.prepare(`
                UPDATE characters
                SET money = ?
                WHERE id = ?
            `).run(newMoney, character.id);

            // check if other items of same ID are already in the character's inventory; if so, increment; if not, create row
            const inventoryRow = db.prepare(`
                SELECT quantity
                FROM inventory
                WHERE character_id = ?
                AND item_id = ?
            `).get(character.id, item.id);

            if (inventoryRow) {
                db.prepare(`
                    UPDATE inventory
                    SET quantity = quantity + 1
                    WHERE character_id = ?
                    AND item_id = ?
                `).run(character.id, item.id);
            } else {
                db.prepare(`
                    INSERT INTO inventory (
                        character_id,
                        item_id,
                        quantity                    
                    )
                    VALUES (?, ?, 1)
                `).run(character.id, item.id);
            }



            // send result back to shop page
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                succes: true
            }));
        });

        return;
    }
});



server.listen(3000, () => {
    console.log('Listening on port 3000.');
});