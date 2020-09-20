import db from '../db';
import { getItemListFromIds, getItemsTotalValue } from './itemsHelper';

const getReadableZombie = (zombieId) => {
  const zombie = db.get('zombies').getById(zombieId).value();
  if (!zombie) return null;
  return {
    id: zombie.id,
    name: zombie.name,
    createdAt: new Date(zombie.createdAt).toLocaleString(),
    items: getItemListFromIds(zombie.items),
    itemsTotalValue: getItemsTotalValue(zombie.items),
  };
};

export default getReadableZombie;
