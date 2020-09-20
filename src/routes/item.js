import { Router } from 'express';
import db from '../db';
import { getItemListFromIds } from '../helpers/itemsHelper';
import { itemsPostRules, zombieIdRules, validate } from '../validators/validator';

const router = Router();
const zombieCollection = db.get('zombies');
const itemCollection = db.get('items');

router.get('/', (req, res) => {
  return res.json(itemCollection);
});

router.get('/:zombieId', zombieIdRules(), validate, (req, res) => {
  const zombie = zombieCollection.getById(req.params.zombieId).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const items = getItemListFromIds(zombie.items);
  return res.json(items);
});

router.post('/:zombieId', itemsPostRules(), validate, (req, res) => {
  const { zombieId } = req.params;
  const zombie = zombieCollection.getById(zombieId).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const { items } = req.body;
  const saved = zombieCollection
    .updateById(zombieId, {
      items: items || zombie.items,
    })
    .write();
  return saved ? res.json(getItemListFromIds(saved.items)) : res.sendStatus(500);
});

router.put('/:zombieId', itemsPostRules(), validate, (req, res) => {
  const { zombieId } = req.params;
  const zombie = zombieCollection.getById(zombieId).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const { items } = req.body;
  const newZombieItems = zombie.items;
  newZombieItems.unshift(...items);
  if (newZombieItems.length > 5) {
    newZombieItems.length = 5;
  }
  const saved = zombieCollection
    .updateById(zombieId, {
      items: newZombieItems,
    })
    .write();
  return saved ? res.json(getItemListFromIds(saved.items)) : res.sendStatus(500);
});

router.delete('/:zombieId/:itemId', zombieIdRules(), validate, (req, res) => {
  const { zombieId, itemId } = req.params;
  const zombie = zombieCollection.getById(zombieId).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const newZombieItems = zombie.items.filter((item) => item !== +itemId);
  const saved = zombieCollection
    .updateById(zombieId, {
      items: newZombieItems,
    })
    .write();
  return saved ? res.json(getItemListFromIds(saved.items)) : res.sendStatus(500);
});

export default router;
