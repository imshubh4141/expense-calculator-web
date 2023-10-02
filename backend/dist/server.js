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
app.post('/upload', upload.single('uploaded_file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('Recieved file: ' + req.file.filename);
    //parsing logic here
    res.status(200).json({ message: 'file uploaded successfully' });
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    const buf = (0, fs_1.readFileSync)('/Users/shubh/Desktop/repos/expense-calculator-web/backend/uploads/september_expense.xls');
    const workbook = xlsx_1.default.read(buf, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // console.log(worksheet);
    const transactions = xlsx_1.default.utils.sheet_to_json(worksheet);
    let categories = {};
    transactions.map(transaction => {
        console.log(transaction.Date, transaction['Closing Balance']);
        // console.log(transaction.Date, transaction.WithdrawalAmount);
    });
    // console.log(jsonData);
    // var aoa = xlsx.utils.sheet_to_json(worksheet, {header: 1});
    // console.log(aoa);
});
