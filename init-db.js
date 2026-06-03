const db = require('./db');

db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        gold INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS inventory (
        character_id INTEGER,
        item_id INTEGER,
        quantity INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY (character_id, item_id)
    );
`);

console.log('DB initialized');