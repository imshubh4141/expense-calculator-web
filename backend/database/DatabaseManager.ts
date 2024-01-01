import { Client } from 'pg';
import { Expense } from '../interfaces/Expense';
import exp from 'constants';

export class DatabaseManager {

    private client : Client;
    private user: string;
    private host: string;
    private database: string;
    private password: string;
    private port: number;
    
    constructor(user: string, host: string, database: string, password: string, port: number){
        this.user = user;
        this.host = host;
        this.database = database;
        this.password = password;
        this.port = port;
        
        this.client = new Client({
            user: this.user,
            host: this.host,
            database: this.database,
            password: this.password,
            port: this.port,
        });

        this.connect();
    }

    private async connect() {
        try{
            await this.client.connect();
            console.log('connected to db');
        } catch(err) {
            console.error('Error connecting to db: ', err);
        }
    }

    async insertExpense(expense: Expense){
        const query = 'INSERT INTO CATEGORY_WISE_EXPENSE(expense_month, travel, food, grocery, rent, house_help, electricity, leisure, investments,credits) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';

        const values = [expense.month, expense.travel, expense.food, expense.grocery, expense.rent, expense.house_help, expense.electricity, expense.leisure, expense.investments, expense.credits];

        try{
            const res = await this.client.query(query, values);
            console.log(JSON.stringify(res.rows, null, 2));
        } catch(err){
            console.error(err);
        }
    }

    async getExpense(month: string, year: string){
        const query = 'SELECT * FROM CATEGORY_WISE_EXPENSE WHERE EXPENSE_MONTH = $1 AND EXPENSE_YEAR = $2';
        const values = [month, year];

        try{
            const res = await this.client.query(query, values);
            console.log('expense fetched.');
            return res;
        } catch(err){
            console.error(err);
        }
    }

    async deleteExpense(month: string, year: string){
        const query = 'DELETE FROM CATEGORY_WISE_EXPENSE WHERE EXPENSE_MONTH = $1 AND EXPENSE_YEAR = $2';
        const values = [month, year];

        try{
            const res = await this.client.query(query, values);
            console.log('expense deleted: ' + res);
        } catch(err){
            console.error(err);
        }
    }

    async updateExpense(expense_id: number, expense: Expense){
        
    }

}