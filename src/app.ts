import express from 'express';
import 'express-async-errors';

import { routes } from './routes';
import { errorHandling } from './middlewares/error-handling';

const app = express(); //iniciando o express

app.use(express.json()); // passando a flag para utilizar o json
app.use(routes); // passando as rotas
app.use(errorHandling); // utilizando o middleware de tratamento de excecoes

export { app };
