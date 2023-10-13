"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = require("fs");
const upload = (0, multer_1.default)({ dest: '../uploads' });
console.log("Fantastic!!!");
const app = (0, express_1.default)();
const port = 3000;
app.get('/checkAlive', (req, res) => {
    res.send(`<h1>Alive on port ${port}</h1>`);
});
function addXLSExtenstion(name) {
    const newName = name.split('.')[0] + '.xls';
    return newName;
}
app.post('/upload', upload.single('uploaded_file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('Recieved file: ' + req.file.originalname);
    const fileName = addXLSExtenstion(req.file.originalname);
    //parsing logic here
    const buf = (0, fs_1.readFileSync)(`/Users/shubh/Desktop/repos/expense-calculator-web/backend/uploads/${fileName}`);
    const workbook = xlsx_1.default.read(buf, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // console.log(worksheet);
    let transactions = xlsx_1.default.utils.sheet_to_json(worksheet);
    // console.log(transactions);
    function validTransactionCheck(transaction) {
        let temp = (Object.keys(transaction).length === 6) && (transaction.Date !== undefined) && (transaction.Narration !== undefined) && (transaction['Chq./Ref.No.'] !== undefined) && (transaction['Value Dt'] !== undefined) && (transaction['Withdrawal Amt.'] !== undefined || transaction['Deposit Amt.'] !== undefined) && (transaction['Closing Balance'] !== undefined);
        if (!temp) {
            console.log(transaction);
        }
        return temp;
    }
    function isDebit(transaction) {
        return transaction['Withdrawal Amt.'] !== undefined;
    }
    transactions = transactions.filter(transaction => validTransactionCheck(transaction));
    let categories = {
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
        if (isDebit(transaction)) {
            const txnDate = transaction.Date;
            const narration = transaction.Narration.toLowerCase();
            const refNo = transaction['Chq./Ref.No.'];
            const valueDate = transaction['Value Dt'];
            const withdrawalAmount = transaction['Withdrawal Amt.'];
            const closingBalance = transaction['Closing Balance'];
            debits += withdrawalAmount;
            if (narration.includes('travel')) {
                categories.travel += withdrawalAmount;
            }
            else if (!narration.includes('swiggystores') && (narration.includes('swiggy') || narration.includes('lunch') || narration.includes('breakfast') || narration.includes('snacks'))) {
                categories.food += withdrawalAmount;
            }
            else if (narration.includes('swiggystores') || narration.includes('grocery') || narration.includes('dmart')) {
                categories.grocery += withdrawalAmount;
            }
            else if (narration.includes('rent')) {
                categories.rent += withdrawalAmount;
            }
            else if (narration.includes('maid')) {
                categories.maid += withdrawalAmount;
            }
            else if (narration.includes('nseclearinglimited')) {
                categories.investments += withdrawalAmount;
            }
            else {
                categories.leisure += withdrawalAmount;
            }
        }
        else {
            categories.credits += transaction['Deposit Amt.'];
        }
    });
    console.log(categories);
    res.status(200).json({ message: 'file uploaded successfully' });
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
