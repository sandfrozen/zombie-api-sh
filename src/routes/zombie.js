import { Router } from 'express';
import shortid from 'shortid';

import db from '../db';
import { zombieIdRules, zombiePostRules, zombiePutRules, validate } from '../validators/validator';
import { getValidItemIds } from '../helpers/itemsHelper';
import getReadableZombie from '../helpers/zombieHelper';

const router = Router();
const collection = db.get('zombies');

router.get('/', (req, res) => {
  const zombies = collection.map((zombie) => getReadableZombie(zombie.id));
  return res.json(zombies);
});

router.get('/:zombieId', zombieIdRules(), validate, (req, res) => {
  const zombie = getReadableZombie(req.params.zombieId);
  return zombie ? res.json(zombie) : res.sendStatus(404);
});

router.post('/', zombiePostRules(), validate, (req, res) => {
  const { name, items } = req.body;
  const zombie = {
    id: shortid.generate(),
    createdAt: Date.now(),
    name,
    items: getValidItemIds(items),
  };
  const saved = collection.insert(zombie).write();
  return saved ? res.json(getReadableZombie(saved.id)) : res.status(500);
});

router.put('/:zombieId', zombiePutRules(), validate, (req, res) => {
  const { zombieId } = req.params;
  const zombie = collection.getById(zombieId).value();
  if (!zombie) {
    return res.sendStatus(404);
  }
  const { name } = req.body;
  const saved = collection
    .updateById(zombieId, {
      name: name || zombie.name,
    })
    .write();
  return saved ? res.json(getReadableZombie(saved.id)) : res.sendStatus(500);
});

router.delete('/:zombieId', zombieIdRules(), validate, (req, res) => {
  const deleted = collection.removeById(req.params.zombieId).write();
  return deleted ? res.sendStatus(204) : res.sendStatus(404);
});

export default router;
