import { Client } from 'pg';
import { Expense } from '../interfaces/Expense';

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
    }

    insertExpense(expense: Expense){

    }

    deleteExpense(expense_id: number){

    }

    getExpense(expense_id: number){

    }

    updateExpense(expense_id: number, expense: Expense){
        
    }

}