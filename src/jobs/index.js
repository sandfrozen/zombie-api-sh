import schedule from 'node-schedule';
import axios from 'axios';

import log from '../logger';
import db from '../db';

const updateItems = async () => {
  try {
    const {
      data: { items },
    } = await axios.get('https://zombie-items-api.herokuapp.com/api/items');
    db.set('items', items).write();
  } catch (e) {
    log.error('Error while item update: ', e);
  }
};

const updateRates = async () => {
  try {
    const { data } = await axios.get('http://api.nbp.pl/api/exchangerates/tables/C');
    const { rates } = data[0];
    const prevRates = db.get('rates').value();
    const eur = rates.find((i) => i.code === 'EUR')?.ask || prevRates?.eur || 1;
    const usd = rates.find((i) => i.code === 'USD')?.ask || prevRates?.usd || 1;
    db.set('rates', { eur, usd }).write();
  } catch (e) {
    log.error('Error while rates update: ', e);
  }
};

const updateZombies = async () => {
  log.warn('updateZombies not implemented..');
};

const performUpdate = async () => {
  await updateItems();
  await updateRates();
  await updateZombies();
};

export default function init() {
  performUpdate();

  schedule.scheduleJob('1 * * * * *', (fireDate) => {
    performUpdate();
    log.info(`This job was supposed to run at ${fireDate}, but actually ran at ${new Date()}`);
  });
}
