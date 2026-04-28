import initSqlJs from 'sql.js';

let db = null;

export async function initDatabase() {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: file => {
      // Use the production-ready WASM from the dist/public folder
      // In production (GitHub Pages), this needs to be relative to the base
      return `${import.meta.env.BASE_URL}${file}`.replace(/\/+/g, '/');
    }
  });

  const dbPath = `${import.meta.env.BASE_URL}stilmittel.sqlite`.replace(/\/+/g, '/');
  const response = await fetch(dbPath);
  if (!response.ok) {
    throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  db = new SQL.Database(new Uint8Array(buffer));
  return db;
}

export function getAllStilmittel(database) {
  const res = database.exec("SELECT * FROM stilmittel");
  if (res.length === 0) return [];
  
  const columns = res[0].columns;
  const values = res[0].values;
  
  return values.map(row => {
    const item = {};
    columns.forEach((col, i) => {
      item[col] = row[i];
    });
    
    // Get examples
    const exRes = database.exec(`SELECT example FROM examples WHERE stilmittel_id = ${item.id}`);
    item.examples = exRes.length > 0 ? exRes[0].values.map(v => v[0]) : [];
    
    return item;
  });
}
