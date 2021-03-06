import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import logger from './logger';

import initJobs from './jobs';

import swaggerDocument from '../swagger.json';

initJobs();

const app = express();
const router = express.Router();

router.use('/zombies', routes.zombie);
router.use('/items', routes.item);
router.use('/rates', routes.rates);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', router);

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`zombie-api-sh app listening on port ${port}`));
