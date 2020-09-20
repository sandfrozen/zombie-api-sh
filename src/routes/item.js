import { Router } from 'express';
import db from '../db';
import { getItemListFromIds } from '../helpers/itemsHelper';

const router = Router();
const zombiesModel = 'zombies';
const itemsModel = 'items';

router.get('/', (req, res) => {
  const items = db.get(itemsModel).value();
  return res.json(items);
});

router.get('/:zombieId', (req, res) => {
  const zombie = db.get(zombiesModel).find({ id: req.params.zombieId }).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const items = getItemListFromIds(zombie.items);
  return res.json(items);
});

router.post('/:zombieId', (req, res) => {
  const zombie = db.get(zombiesModel).find({ id: req.params.zombieId }).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  return res.status(400).text('Not supported');
});

router.put('/:zombieId', (req, res) => {
  const zombie = db.get(zombiesModel).find({ id: req.params.zombieId }).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const items = getItemListFromIds(zombie.items);
  return res.json(items);
});

router.delete('/:zombieId', (req, res) => {
  const zombie = db.get(zombiesModel).find({ id: req.params.zombieId }).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const items = getItemListFromIds(zombie.items);
  return res.json(items);
});

export default router;
