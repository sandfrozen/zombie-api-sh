const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const dbName = process.env.DB_NAME || 'dev_db';

const adapter = new FileSync(`${dbName}.json`);
const db = low(adapter);

db.defaults({
  zombies: [],
  items: [],
  rates: {
    usd: 3.81,
    eur: 4.5,
  },
}).write();

export default db;
