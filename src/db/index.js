const lodashId = require('lodash-id');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const dbName = process.env.DB_NAME || 'dev_db';

const adapter = new FileSync(`${dbName}.json`);
const db = low(adapter);

db._.mixin(lodashId);

db.defaults({
  zombies: [],
  items: [],
}).write();

export default db;
