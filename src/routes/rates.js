import { Router } from 'express';
import db from '../db';

const router = Router();
const model = 'rates';

router.get('/', (req, res) => {
  const rates = db.get(model).value();
  return res.json(rates);
});

export default router;
