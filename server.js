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
    
    } else if (req.url === '/shops/generalgoodes/index.html') {             // SERVE GENERAL GOODE'S HTML
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

    } else if (req.url === '/api/characters') {                             // API CHARACTERS
        const rows = db.prepare('SELECT id, first_name, last_name, race, class, level, money FROM characters').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
        return;

    } else if (req.url === '/api/items') {                                  // API ITEMS
        const rows = db.prepare('SELECT name, price, description FROM items').all();
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

    }
});



server.listen(3000, () => {
    console.log('Listening on port 3000.');
});