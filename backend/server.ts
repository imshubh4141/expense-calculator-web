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

    let transactions : Transaction[] = xlsx.utils.sheet_to_json(worksheet);
    // console.log(transactions);

    function validTransactionCheck(transaction : Transaction) : boolean{
        return (Object.keys(transaction).length === 6) && (transaction.Date !== undefined) && (transaction.Narration !== undefined) && (transaction['Chq./Ref.No.'] !== undefined) && (transaction['Value Dt'] !== undefined) && (transaction['Withdrawal Amt.'] !== undefined) && (transaction['Closing Balance'] !== undefined);
    }

    transactions = transactions.filter(transaction => validTransactionCheck(transaction));

    let categories : Categories = {
        travel: 0,
        food: 0,
        grocery: 0,
        rent: 0,
        maid: 0,
        electricity: 0,
        leisure: 0,
        investments: 0,
    };
    
    transactions.map(transaction => {
        // console.log(transaction);
        const txnDate = transaction.Date;
        const narration = transaction.Narration.toLowerCase();
        const refNo = transaction['Chq./Ref.No.'];
        const valueDate = transaction['Value Dt'];
        const withdrawalAmount = transaction['Withdrawal Amt.'];
        const closingBalance = transaction['Closing Balance'];

        if(narration.includes('travel')){
            categories.travel += withdrawalAmount;
        } else if(!narration.includes('swiggystores') && (narration.includes('swiggy') || narration.includes('lunch') || narration.includes('breakfast') || narration.includes('snacks'))){
            categories.food += withdrawalAmount;
        } else if(narration.includes('swiggystores') || narration.includes('grocery')){
            categories.grocery += withdrawalAmount;
        } else if(narration.includes('rent')){
            categories.rent += withdrawalAmount;
        } else if(narration.includes('maid')){
            categories.maid += withdrawalAmount;
        } else {
            categories.leisure += withdrawalAmount;
        }

        
        

        
    });
    // console.log(jsonData);
    console.log(categories);

});