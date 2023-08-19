import express, { Request, Response } from 'express';

const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.get('/checkAlive', (req: Request, res: Response) => {
    res.send(`<h1>Alive on port ${port}</h1>`);
});

app.post('/upload', (req: Request, res: Response) => {

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})