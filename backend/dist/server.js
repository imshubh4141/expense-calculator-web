"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const multer = require('multer');
const path = require('path');
const app = (0, express_1.default)();
const port = 3000;
app.get('/checkAlive', (req, res) => {
    console.log("alive");
    res.send(`<h1>Alive on port ${port}</h1>`);
});
app.post('/upload', (req, res) => {
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
