import React, { ChangeEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../App.css';
import axios from 'axios';

function FileUploader() {

    const [file, setFile] = useState<File | null>(null);
    const [expenses, setExpenses] = useState<any>(null);

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
            const response:any = await axios.post('/upload', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
            setExpenses(response.data.categories);
            console.log(response.data.categories);

        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    }

    return (
        <div className='File-uploader'>
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
            {expenses !== null && (
                <div className='expense-response'>
                    {JSON.stringify(expenses)}
                </div>
            )}
        </div>
    );
}

export default FileUploader;

