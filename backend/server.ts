import express, { Request, Response } from 'express';
// import multer from 'multer';
const multer = require('multer');

const upload = multer({dest: '../uploads'});

const app = express();
const port = 3000;

app.get('/checkAlive', (req: Request, res: Response) => {
    res.send(`<h1>Alive on port ${port}</h1>`);
});


app.post('/upload', upload.single('uploaded_file'), (req: Request, res: Response) => {
    if(!req.file){
        return res.status(400).json({message: 'No file uploaded'});
    }
    res.status(200).json({message: 'file uploaded successfully'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});