"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = require("fs");
const DatabaseManager_1 = require("./database/DatabaseManager");
function addXLSExtenstion(name) {
    const newName = name.split('.')[0] + '.xls';
    return newName;
}
function isDebit(transaction) {
    return transaction['Withdrawal Amt.'] !== undefined;
}
function validTransactionCheck(transaction) {
    let temp = (Object.keys(transaction).length === 6) && (transaction.Date !== undefined) && (transaction.Narration !== undefined) && (transaction['Chq./Ref.No.'] !== undefined) && (transaction['Value Dt'] !== undefined) && (transaction['Withdrawal Amt.'] !== undefined || transaction['Deposit Amt.'] !== undefined) && (transaction['Closing Balance'] !== undefined);
    //if not valid then print
    // if(!temp){
    //     console.log(transaction);
    // }
    return temp;
}
const storage = multer_1.default.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        const uniqueSuffix = file.originalname.split('.')[0] + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + '.xls';
        cb(null, fileName);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const app = (0, express_1.default)();
const port = 3001;
app.get('/checkAlive', (req, res) => {
    console.log('check Alive');
    return res.status(200).json({
        message: 'I am alive',
        port: port,
    });
});
app.post('/upload', upload.single('uploaded_file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('Recieved file: ' + req.file.filename);
    //parsing logic here
    const buf = (0, fs_1.readFileSync)(path_1.default.join(__dirname, 'uploads', req.file.filename));
    // const buf = readFileSync(`/Users/shubh/Desktop/repos/expense-calculator-web/backend/uploads/${req.file.filename}`);
    const workbook = xlsx_1.default.read(buf, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let transactions = xlsx_1.default.utils.sheet_to_json(worksheet);
    transactions = transactions.filter(transaction => validTransactionCheck(transaction));
    //delete the file from the server after storing txns in a buffer
    (0, fs_1.unlink)(path_1.default.join(__dirname, 'uploads', req.file.filename), (err) => {
        var _a;
        if (err)
            throw err;
        console.log('successfully deleted ' + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename));
    });
    let expense = {
        travel: 0,
        food: 0,
        grocery: 0,
        rent: 0,
        house_help: 0,
        electricity: 0,
        leisure: 0,
        investments: 0,
        credits: 0,
        month: '',
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
                expense.travel += withdrawalAmount;
            }
            else if (!narration.includes('swiggystores') && (narration.includes('swiggy') || narration.includes('lunch') || narration.includes('breakfast') || narration.includes('snacks'))) {
                expense.food += withdrawalAmount;
            }
            else if (narration.includes('swiggystores') || narration.includes('grocery') || narration.includes('dmart')) {
                expense.grocery += withdrawalAmount;
            }
            else if (narration.includes('rent')) {
                expense.rent += withdrawalAmount;
            }
            else if (narration.includes('maid')) {
                expense.house_help += withdrawalAmount;
            }
            else if (narration.includes('nseclearinglimited')) {
                expense.investments += withdrawalAmount;
            }
            else {
                expense.leisure += withdrawalAmount;
            }
        }
        else {
            expense.credits += transaction['Deposit Amt.'];
        }
    });
    console.log(expense);
    //save to db
    try {
        const dbManager = new DatabaseManager_1.DatabaseManager('postgres', 'localhost', 'expense', '4141', 5432);
        // await dbManager.insertExpense(expense);
        yield dbManager.deleteExpense('December', '2023');
    }
    catch (err) {
        console.error('save error: ' + err);
    }
    res.status(200).json({
        message: 'file uploaded successfully',
        expense: expense,
    });
}));
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
//     user: 'postgres',
//     host: 'localhost',
//     database: 'expense',
//     password: '4141',
//     port: 5432,
