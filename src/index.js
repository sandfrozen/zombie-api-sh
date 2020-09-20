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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/zombies', routes.zombie);
app.use('/zombie-items', routes.item);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || 4000, () =>
  logger.info(`zombie-api-sh app listening on port ${process.env.PORT}`)
);
