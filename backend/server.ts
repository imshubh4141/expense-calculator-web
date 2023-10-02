import express, { Request, Response } from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import { readFileSync } from "fs";
import { Categories } from './interfaces/Categories';
import { Transaction } from './interfaces/Transaction';
import { log } from 'console';

const upload = multer({dest: '../uploads'});

console.log("Fantastic!!!");

const app = express();
const port = 3000;

app.get('/checkAlive', (req: Request, res: Response) => {
    res.send(`<h1>Alive on port ${port}</h1>`);
});


app.post('/upload', upload.single('uploaded_file'), (req: Request, res: Response) => {
    if(!req.file){
        return res.status(400).json({message: 'No file uploaded'});
    }
    console.log('Recieved file: ' + req.file.filename);

    //parsing logic here
    
    res.status(200).json({message: 'file uploaded successfully'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);

    const buf = readFileSync('/Users/shubh/Desktop/repos/expense-calculator-web/backend/uploads/september_expense.xls');
    const workbook = xlsx.read(buf, {type: "buffer"});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // console.log(worksheet);

    const transactions : Transaction[] = xlsx.utils.sheet_to_json(worksheet);

    let categories : Categories = {};
    
    transactions.map(transaction => {
        
    });
    // console.log(jsonData);
});