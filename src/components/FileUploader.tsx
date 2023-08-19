import React, { ChangeEvent, useState } from 'react';
import '../App.css';
import axios from 'axios';

function FileUploader() {

    const [file, setFile] = useState<File | null>(null);

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
        formData.append('File', file);

        try {
            const response = await axios.post('/upload', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
            console.log(`Response from server: ${response.data}`);
            
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    }

    return (
        <div className='File-uploader'>
            <form onSubmit={handleSubmit}>
                <h4>Upload excel file</h4>
                <input type="file" onChange={handleChange}/>
                <button type='submit'>Calculate my expenses</button>
            </form>
        </div>
    );
}

export default FileUploader;

