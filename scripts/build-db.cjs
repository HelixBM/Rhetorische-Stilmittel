const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.js');
const dbPath = path.join(__dirname, '../public/stilmittel.sqlite');

if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

const dataContent = fs.readFileSync(dataPath, 'utf8');
const arrayMatch = dataContent.match(/export const STILMITTEL = (\[[\s\S]*?\]);/);
const STILMITTEL = eval(arrayMatch[1]);

db.serialize(() => {
    db.run("CREATE TABLE stilmittel (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, definition TEXT)");
    db.run("CREATE TABLE examples (id INTEGER PRIMARY KEY AUTOINCREMENT, stilmittel_id INTEGER, example TEXT, FOREIGN KEY(stilmittel_id) REFERENCES stilmittel(id))");

    let finishedStil = 0;
    let totalExamples = STILMITTEL.reduce((acc, curr) => acc + curr.examples.length, 0);
    let finishedExamples = 0;

    STILMITTEL.forEach(item => {
        db.run("INSERT INTO stilmittel (name, definition) VALUES (?, ?)", [item.name, item.definition], function(err) {
            if (err) return console.error(err.message);
            const stilId = this.lastID;
            finishedStil++;
            
            item.examples.forEach(ex => {
                db.run("INSERT INTO examples (stilmittel_id, example) VALUES (?, ?)", [stilId, ex], function(err) {
                    if (err) return console.error(err.message);
                    finishedExamples++;
                    checkDone();
                });
            });
        });
    });

    function checkDone() {
        if (finishedStil === STILMITTEL.length && finishedExamples === totalExamples) {
            db.close((err) => {
                if (err) return console.error(err.message);
                console.log('Database built successfully at ' + dbPath);
            });
        }
    }
});
