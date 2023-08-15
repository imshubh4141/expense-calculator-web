import React, { ChangeEvent, useState } from 'react';
import '../App.css';

function FileUploader() {

    const [file, setFile] = useState<File | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]//safe way to access arrays
        setFile(selectedFile || null);
    }

    return (
        <div className='File-uploader'>
            <form action="GET">
                <h4>Upload excel file</h4>
                <input type="file" onChange={handleChange}/>
                <button type='submit'>Calculate my expenses</button>
            </form>
        </div>
    );
}

export default FileUploader;

