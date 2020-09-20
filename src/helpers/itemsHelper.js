import db from '../db';

export const getItemsTotalValue = (itemIds) => {
  const sum = { pln: 0, usd: 0, eur: 0 };
  const rates = db.get('rates').value();
  itemIds.forEach((id) => {
    const price = db.get('items').find({ id }).value()?.price;
    if (price) {
      sum.pln += price;
      sum.usd += price * rates.usd;
      sum.eur += price * rates.eur;
    }
  });

  sum.pln = +sum.pln.toFixed(2);
  sum.usd = +sum.usd.toFixed(2);
  sum.eur = +sum.eur.toFixed(2);
  return sum;
};

export const getValidItemIds = (itemIds) => {
  const items = db.get('items').value() || [];
  const validIds = items.map((i) => i.id) || [];

  return itemIds.filter((i) => validIds.includes(+i)).map((id) => +id);
};

export const getItemListFromIds = (itemIds) => {
  const validIds = getValidItemIds(itemIds);
  const items = db.get('items').value();

  return validIds.map((id) => items.find((i) => i.id === id));
};
