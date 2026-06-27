import express from 'express';

const app = express(); //iniciando o express

app.use(express.json()); // passando a flag para utilizar o json

export { app };
