const http = require('http');
const url = require('url');
const fs = require('fs');
const db = require('./db');

const server = http.createServer((req, res) => {


    // SERVE HTML
    if (req.url === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });


    // SERVE CSS
    } else if (req.url === '/styles.css') {
        fs.readFile('styles.css', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });


    // SERVE JAVASCRIPT
    } else if (req.url === '/script.js') {
        fs.readFile('script.js', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });


    // SERVE DATA (TEMPORARY)
    } else if (req.url === '/api/characters') {
        const rows = db.prepare('SELECT name, gold, id FROM characters').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
        return;

    } else if (req.url === '/api/items') {
        const rows = db.prepare('SELECT name, price FROM items').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
        return;

    } else if (req.url.startsWith('/api/inventory')) {

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