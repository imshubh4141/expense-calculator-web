"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import multer from 'multer';
const multer = require('multer');
const upload = multer({ dest: '../uploads' });
const app = (0, express_1.default)();
const port = 3000;
app.get('/checkAlive', (req, res) => {
    res.send(`<h1>Alive on port ${port}</h1>`);
});
app.post('/upload', upload.single('uploaded_file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ message: 'file uploaded successfully' });
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
