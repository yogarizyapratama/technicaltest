import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors'
import routes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/api-docs.js'; 

dotenv.config();

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('dev'));

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
  const name = process.env.NAME || 'YOGA RIZYA PRATAMA';
  res.send(`Hello ${name}!`);
});

const port = parseInt(process.env.PORT) || 3000;

// connect mongodb
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('connected to database')

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
} catch (error) {
  throw error
}

app.use('/api', routes.router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app