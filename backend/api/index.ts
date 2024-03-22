import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import xlsx from 'xlsx';
import { readFileSync, unlink } from "fs";
import { Expense } from '../interfaces/Expense';
import { Transaction } from '../interfaces/Transaction';
import { log } from 'console';
import { DatabaseManager } from '../database/DatabaseManager';

/*
Notes:

Need to deploy the app such that the frontend files are served by the server in PROD

Right now I'm able to do it in DEV, both running on the same port 3000

*/

function addXLSExtenstion(name : string) : string {
    const newName = name.split('.')[0] + '.xls';
    return newName;
}

function isDebit(transaction : Transaction): boolean {
    return transaction['Withdrawal Amt.'] !== undefined;
}

function validTransactionCheck(transaction : Transaction) : boolean{
    let temp : boolean = (Object.keys(transaction).length === 6) && (transaction.Date !== undefined) && (transaction.Narration !== undefined) && (transaction['Chq./Ref.No.'] !== undefined) && (transaction['Value Dt'] !== undefined) && (transaction['Withdrawal Amt.'] !== undefined || transaction['Deposit Amt.'] !== undefined) && (transaction['Closing Balance'] !== undefined);
    //if not valid then print
    if(!temp){
        console.log(transaction);
    }
    return temp;
}

const storage = multer.diskStorage({
    destination: 'upload/tmp/',//for dev ---> upload/tmp/, for prod --> /tmp/
    filename: (req,file,cb)=>{
        const uniqueSuffix = file.originalname.split('.')[0] + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + '.xls';
        cb(null, fileName);
    },
});

const upload = multer({storage: storage});
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const app = express();
const port = 3000;

app.use(express.static('/Users/shubh/Desktop/repos/expense-calculator-web/build'));

app.get('/', (req: Request, res: Response) => {
    console.log('check Alive');
    
    // return res.status(200).json({
    //     message: 'I am alive',
    //     port: port,
    // });
    // res.sendFile('/Users/shubh/Desktop/repos/expense-calculator-web/build/index.html');
    res.sendFile(__dirname + '../../../build/index.html');


    // __dirname -> backend/dist/api -->../../../build/index.html

    
});

app.post('/upload', upload.single('uploaded_file'), async (req: Request, res: Response) => {
    if(!req.file){
        return res.status(400).json({message: 'No file uploaded'});
    }

    console.log('Recieved file: ' + req.file.filename);

    //parsing logic here
    const buf = readFileSync(path.join(__dirname, '/tmp/', req.file.filename));

    const workbook = xlsx.read(buf, {type: "buffer"});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let transactions : Transaction[] = xlsx.utils.sheet_to_json(worksheet);

    transactions = transactions.filter(transaction => validTransactionCheck(transaction));

    //delete the file from the server after storing txns in a buffer
    unlink(path.join(__dirname, '/tmp/', req.file.filename), (err) => {
        if (err) throw err;
        console.log('successfully deleted ' + req.file?.filename);
    });

    let expense : Expense = {
        travel: 0,
        food: 0,
        grocery: 0,
        rent: 0,
        house_help: 0,
        electricity: 0,
        leisure: 0,
        investments: 0,
        credits: 0,
        month: month[(new Date().getMonth() - 1) == -1 ? 11 : (new Date().getMonth() - 1)],
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
                expense.travel += withdrawalAmount;
            } else if(!narration.includes('swiggystores') && (narration.includes('swiggy') || narration.includes('lunch') || narration.includes('breakfast') || narration.includes('snacks'))){
                expense.food += withdrawalAmount;
            } else if(narration.includes('swiggystores') || narration.includes('grocery') || narration.includes('dmart')){            
                expense.grocery += withdrawalAmount;
            } else if(narration.includes('rent')){
                expense.rent += withdrawalAmount;
            } else if(narration.includes('maid')){
                expense.house_help += withdrawalAmount;
            } else if(narration.includes('nseclearinglimited')){
                expense.investments += withdrawalAmount;
            } else {
                expense.leisure += withdrawalAmount;
            }

        } else {
            expense.credits += transaction['Deposit Amt.'];
        }
    });
    
    console.log(expense);

    //save to db
    try{
        const dbManager: DatabaseManager = new DatabaseManager('postgres', 'localhost', 'expense', '4141', 5432);
        await dbManager.insertExpense(expense);
    } catch(err) {
        console.error('save error: ' + err);
    }
    
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.status(200).json({
        message: 'file uploaded successfully',
        expense: expense,
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;



    //     user: 'postgres',
    //     host: 'localhost',
    //     database: 'expense',
    //     password: '4141',
    //     port: 5432,