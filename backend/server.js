"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
// const multer = require('multer');
var upload = (0, multer_1.default)({ dest: '../uploads' });
console.log("Fantastic!!!");
var app = (0, express_1.default)();
var port = 3000;
app.get('/checkAlive', function (req, res) {
    res.send("<h1>Alive on port ".concat(port, "</h1>"));
});
app.post('/upload', upload.single('uploaded_file'), function (req, res) {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ message: 'file uploaded successfully' });
});
app.listen(port, function () {
    console.log("Listening on port ".concat(port));
});
