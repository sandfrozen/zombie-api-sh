import schedule from 'node-schedule';
import axios from 'axios';

import log from '../logger';
import db from '../db';

let itemsUpdateJob;
let ratesUpdateJob;

const updateItems = async () => {
  try {
    const {
      data: { items },
    } = await axios.get('https://zombie-items-api.herokuapp.com/api/items');
    db.set('items', items).write();
    log.info(`ITEMS FETCHED. Items sum: ${items.length}`);
  } catch (e) {
    log.error('Error while item update: ', e);
  }
};

const updateRates = async () => {
  try {
    const { data } = await axios.get('http://api.nbp.pl/api/exchangerates/tables/C');
    const { rates } = data[0];
    const prevRates = db.get('rates').value();
    const usd = rates.find((i) => i.code === 'USD')?.ask || prevRates?.usd || 1;
    const eur = rates.find((i) => i.code === 'EUR')?.ask || prevRates?.eur || 1;
    db.set('rates', { usd, eur }).write();
    log.info(`RATES FETCHED. USD: ${usd}  EUR: ${eur}`);
  } catch (e) {
    log.error('Error while rates update: ', e);
  }
};

const fetchInitialData = async () => {
  const itemsCount = db.get('items').value().length;
  if (!itemsCount) {
    await updateItems();
  }
  const rates = db.get('rates').value();
  if (!rates) {
    await updateRates();
  }
};

export default async function init() {
  await fetchInitialData();

  itemsUpdateJob = schedule.scheduleJob(
    {
      tz: 'UTC',
      hour: 0,
      minute: 1,
    },
    async () => {
      await updateItems();
      log.info(`Next Items Update: ${itemsUpdateJob.nextInvocation()}`);
    }
  );

  ratesUpdateJob = schedule.scheduleJob(
    {
      tz: 'Poland',
      hour: 8,
      minute: 16,
      dayOfWeek: new schedule.Range(1, 5),
    },
    async () => {
      await updateRates();
      log.info(`Next Rates Update: ${ratesUpdateJob.nextInvocation()}`);
    }
  );

  log.info(`Next Items Update: ${itemsUpdateJob.nextInvocation()}`);
  log.info(`Next Rates Update: ${ratesUpdateJob.nextInvocation()}`);
}
