import { Router } from 'express';
import { v1 as uuidv1 } from 'uuid';

import { zombiePostValidationRules, validate } from '../validators/validator';

import db from '../db';
import { getItemListFromIds, getItemsTotalValue, getValidItemIds } from '../helpers/itemsHelper';

const router = Router();
const model = 'zombies';

router.get('/', (req, res) => {
  let zombies = db.get(model).value();
  zombies = zombies.map((zombie) => ({
    ...zombie,
    items: getItemListFromIds(zombie.items),
  }));
  return res.json(zombies);
});

router.get('/:zombieId', (req, res) => {
  const zombie = db.get(model).find({ id: req.params.zombieId }).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const items = getItemListFromIds(zombie.items);
  return res.json({ ...zombie, items });
});

router.post('/', zombiePostValidationRules(), validate, (req, res) => {
  const { name, items } = req.body;
  const zombie = {
    id: uuidv1(),
    createdAt: Date.now(),
    name,
    items: getValidItemIds(items),
    itemsTotalValue: getItemsTotalValue(items),
  };
  const saved = db.get(model).push(zombie).write();
  return saved ? res.json(saved[0]) : res.status(500);
});

router.put('/:zombieId', (req, res) => {
  const { zombieId } = req.params;
  const zombie = db.get(model).find({ id: zombieId }).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const { name, items } = req.body;
  const errors = {};
  if (name?.length < 2) {
    errors.name = 'Min 2 characters';
  }
  if (items && !Array.isArray(items)) {
    errors.items = 'Must be array';
  }
  if (Object.keys(errors).length) {
    return res.status(500).json({ errors });
  }
  zombie.name = name || zombie.name;
  zombie.items = getValidItemIds(items || zombie.items);
  zombie.itemsTotalValue = getItemsTotalValue(zombie.items);
  const saved = db
    .get(model)
    .find({ id: zombieId })
    .assign({
      name: zombie.name,
      items: zombie.items,
      itemsTotalValue: zombie.itemsTotalValue,
    })
    .write();
  return saved
    ? res.json({ ...saved, items: getItemListFromIds(saved.items) })
    : res.sendStatus(500);
});

router.delete('/:zombieId', (req, res) => {
  const result = db.get(model).remove({ id: req.params.zombieId }).write();
  const deleted = result ? result.length : false;
  return deleted ? res.sendStatus(204) : res.sendStatus(404);
});

export default router;
