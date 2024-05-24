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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const pg_1 = require("pg");
class DatabaseManager {
    // async function connectdb() {
    //     try{
    //         await client.connect();
    //         console.log('connected to db...');
    //     } catch(err){
    //         console.error(err);
    //     }
    // }
    // async function readfromdb(){
    //     try{
    //         // const res = await client.query('select now()');
    //         const res = await client.query('select * from category_wise_expense');
    //         console.log('read query res: ' + JSON.stringify(res.rows, null, 2));
    //         await client.end();
    //     } catch(err) {
    //         console.error(err);
    //     }
    // }
    constructor(user, host, database, password, port) {
        this.user = user;
        this.host = host;
        this.database = database;
        this.password = password;
        this.port = port;
        this.client = new pg_1.Client({
            user: this.user,
            host: this.host,
            database: this.database,
            password: this.password,
            port: this.port,
        });
        this.connect();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
                console.log('connected to db');
            }
            catch (err) {
                console.error('Error connecting to db: ', err);
            }
        });
    }
    insertExpense(expense) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO CATEGORY_WISE_EXPENSE(expense_month, travel, food, grocery, rent, house_help, electricity, leisure, investments,credits) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
            let values = [expense.month, expense.travel, expense.food, expense.grocery, expense.rent, expense.house_help, expense.electricity, expense.leisure, expense.investments, expense.credits];
            try {
                const res = yield this.client.query(query, values);
                console.log('database entry: ' + JSON.stringify(res.rows, null, 2));
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    deleteExpense(expense_id) {
    }
    getExpense(expense_id) {
    }
    updateExpense(expense_id, expense) {
    }
}
exports.DatabaseManager = DatabaseManager;
