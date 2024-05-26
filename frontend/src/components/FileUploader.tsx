import React, { ChangeEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Table } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import '../App.css';
import axios from 'axios';

interface ExpenseInterface {
    category: string
    amount: number
}

type expenseType = ExpenseInterface;

function FileUploader() {

    const [file, setFile] = useState<File | null>(null);
    const [expenses, setExpenses] = useState<expenseType | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]//safe way to access arrays
        setFile(selectedFile || null);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if(file === null){
            return;
        }

        const formData = new FormData();
        formData.append('uploaded_file', file);

        try {
            const response:any = await axios.post('https://expense-calculator-server.vercel.app/upload', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
            
            //TODO: validate response data structure

            setExpenses(response.data.expense);
            console.log(response.data.expense);

        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    }

    return (
        <div className='File-uploader'>
            <Container>
                <Row>
                    <Container className='border border-2 border-warning rounded bg-light px-2 py-2 mt-2'>
                        <form onSubmit={handleSubmit}>
                            <Row className="justify-content-center text-center mt-2 mb-2 ms-2 me-2 p-2 bg-secondary text-white rounded">
                                <h4>Upload excel file</h4>
                            </Row>
                            <Row className="justify-content-center text-center mx-2 my-2 p-2">
                                <input type="file" name="uploaded_file" onChange={handleChange} className="form-control" id="inputGroupFile02"/>
                            </Row>
                            <Row className="justify-content-center text-center mx-2 my-2 p-2">
                                <Button variant="primary" type="submit">Calculate my expenses</Button>
                            </Row>
                        </form>
                    </Container>
                </Row>
                <Row className="justify-content-center text-center mx-2 my-2 p-">
                    {expenses !== null && (
                        <div className='expense-response mt-4 mx-4 d-flex justify-content-center'>
                            <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(expenses).map(([category, amount]) => (
                                <tr key={category}>
                                    <td>{category}</td>
                                    <td>{amount}</td>
                                </tr>
                                ))}
                            </tbody>
                            </Table>
                        </div>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default FileUploader;

