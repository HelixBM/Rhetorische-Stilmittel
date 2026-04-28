const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.js');
const dbPath = path.join(__dirname, '../public/stilmittel.sqlite');

if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

const dataContent = fs.readFileSync(dataPath, 'utf8');
const arrayMatch = dataContent.match(/export const STILMITTEL = (\[[\s\S]*?\]);/);
const STILMITTEL = eval(arrayMatch[1]);

db.exec("CREATE TABLE stilmittel (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, definition TEXT)");
db.exec("CREATE TABLE examples (id INTEGER PRIMARY KEY AUTOINCREMENT, stilmittel_id INTEGER, example TEXT, FOREIGN KEY(stilmittel_id) REFERENCES stilmittel(id))");

const insertStil = db.prepare("INSERT INTO stilmittel (name, definition) VALUES (?, ?)");
const insertEx = db.prepare("INSERT INTO examples (stilmittel_id, example) VALUES (?, ?)");

const insertMany = db.transaction((data) => {
  for (const item of data) {
    const result = insertStil.run(item.name, item.definition);
    const stilId = result.lastInsertRowid;
    for (const ex of item.examples) {
      insertEx.run(stilId, ex);
    }
  }
});

insertMany(STILMITTEL);

db.close();
console.log('Database built successfully at ' + dbPath);
