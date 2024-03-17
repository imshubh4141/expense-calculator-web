import { Client } from 'pg';
import { Expense } from '../interfaces/Expense';
import exp from 'constants';

export class DatabaseManager {

    // const client = new Client({
    //     user: 'postgres',
    //     host: 'localhost',
    //     database: 'expense',
    //     password: '4141',
    //     port: 5432,
    // });

    private client : Client;
    private user: string;
    private host: string;
    private database: string;
    private password: string;
    private port: number;

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

        let values = [expense.month, expense.travel, expense.food, expense.grocery, expense.rent, expense.house_help, expense.electricity, expense.leisure, expense.investments, expense.credits];

        try{
            const res = await this.client.query(query, values);
            console.log('database entry: ' + JSON.stringify(res.rows, null, 2));
        } catch(err){
            console.error(err);
        }
    }

    deleteExpense(expense_id: number){

    }

    getExpense(expense_id: number){

    }

    updateExpense(expense_id: number, expense: Expense){

    }

}