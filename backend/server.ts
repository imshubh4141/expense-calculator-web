import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import xlsx from 'xlsx';
import { readFileSync } from "fs";
import { Categories } from './interfaces/Categories';
import { Transaction } from './interfaces/Transaction';
import { log } from 'console';

const storage = multer.diskStorage({
    destination: path.join('../uploads'),
    filename: (req,file,cb)=>{
        const uniqueSuffix = file.originalname.split('.')[0] + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9);
        const addXLSExtenstion = '.xls'
        const fileName = uniqueSuffix + addXLSExtenstion;
        cb(null, fileName);
    },
})

const upload = multer({storage: storage});

console.log("Fantastic!!!");

const app = express();
const port = 3000;

app.get('/checkAlive', (req: Request, res: Response) => {
    res.send(`<h1>Alive on port ${port}</h1>`);
});

function addXLSExtenstion(name : string) : string {
    const newName = name.split('.')[0] + '.xls';
    return newName;
}

app.post('/upload', upload.single('uploaded_file'), (req: Request, res: Response) => {
    if(!req.file){
        return res.status(400).json({message: 'No file uploaded'});
    }

    console.log('Recieved file: ' + req.file.filename);

    //parsing logic here
    const buf = readFileSync(`/Users/shubh/Desktop/repos/expense-calculator-web/backend/uploads/${req.file.filename}`);
    const workbook = xlsx.read(buf, {type: "buffer"});
    // console.log('Workbook: ' + workbook);
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // console.log('worksheet: ' + worksheet);

    let transactions : Transaction[] = xlsx.utils.sheet_to_json(worksheet);
    // console.log('txns: ' + transactions);

    function validTransactionCheck(transaction : Transaction) : boolean{
        let temp : boolean = (Object.keys(transaction).length === 6) && (transaction.Date !== undefined) && (transaction.Narration !== undefined) && (transaction['Chq./Ref.No.'] !== undefined) && (transaction['Value Dt'] !== undefined) && (transaction['Withdrawal Amt.'] !== undefined || transaction['Deposit Amt.'] !== undefined) && (transaction['Closing Balance'] !== undefined);
        if(!temp){
            console.log(transaction);
        }
        return temp;
    }

    function isDebit(transaction : Transaction): boolean{
        return transaction['Withdrawal Amt.'] !== undefined;
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
        credits: 0,
    };
    
    let debits = 0;

    transactions.map(transaction => {
        // console.log(transaction);
        if(isDebit(transaction)){
            const txnDate = transaction.Date;
            const narration = transaction.Narration.toLowerCase();
            const refNo = transaction['Chq./Ref.No.'];
            const valueDate = transaction['Value Dt'];
            const withdrawalAmount = transaction['Withdrawal Amt.'];
            const closingBalance = transaction['Closing Balance'];

            debits += withdrawalAmount;

            if(narration.includes('travel')){
                categories.travel += withdrawalAmount;
            } else if(!narration.includes('swiggystores') && (narration.includes('swiggy') || narration.includes('lunch') || narration.includes('breakfast') || narration.includes('snacks'))){
                categories.food += withdrawalAmount;
            } else if(narration.includes('swiggystores') || narration.includes('grocery') || narration.includes('dmart')){            
                categories.grocery += withdrawalAmount;
            } else if(narration.includes('rent')){
                categories.rent += withdrawalAmount;
            } else if(narration.includes('maid')){
                categories.maid += withdrawalAmount;
            } else if(narration.includes('nseclearinglimited')){
                categories.investments += withdrawalAmount;
            } else {
                categories.leisure += withdrawalAmount;
            }

        } else {
            categories.credits += transaction['Deposit Amt.'];
        }
    });
    
    console.log(categories);

    res.status(200).send({
        message: 'file uploaded successfully',
        categories: categories,
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});