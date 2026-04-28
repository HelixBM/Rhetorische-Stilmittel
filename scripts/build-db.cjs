const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.js');
const dbPath = path.join(__dirname, '../public/stilmittel.sqlite');
const wasmPath = path.join(__dirname, '../node_modules/sql.js/dist/sql-wasm.wasm');

async function build() {
    // Ensure public directory exists
    const publicDir = path.dirname(dbPath);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const SQL = await initSqlJs({
        // In node, we need to provide the wasm binary manually
        wasmBinary: fs.readFileSync(wasmPath)
    });

    const db = new SQL.Database();

    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const arrayMatch = dataContent.match(/export const STILMITTEL = (\[[\s\S]*?\]);/);
    const STILMITTEL = eval(arrayMatch[1]);

    db.run("CREATE TABLE stilmittel (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, definition TEXT)");
    db.run("CREATE TABLE examples (id INTEGER PRIMARY KEY AUTOINCREMENT, stilmittel_id INTEGER, example TEXT, FOREIGN KEY(stilmittel_id) REFERENCES stilmittel(id))");

    const insertStil = "INSERT INTO stilmittel (name, definition) VALUES (?, ?)";
    const insertEx = "INSERT INTO examples (stilmittel_id, example) VALUES (?, ?)";

    for (const item of STILMITTEL) {
        db.run(insertStil, [item.name, item.definition]);
        // Get the last inserted ID
        const res = db.exec("SELECT last_insert_rowid()");
        const stilId = res[0].values[0][0];

        for (const ex of item.examples) {
            db.run(insertEx, [stilId, ex]);
        }
    }

    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
    console.log('Database built successfully using sql.js at ' + dbPath);
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
