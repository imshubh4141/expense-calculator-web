import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

interface ApiResponse {
    message: string
    port: number
}

const ApiCheckAlive = () => {
    const [response, setResponse] = useState<ApiResponse>();

    useEffect(() => {
        let ignore = false;

        const fetchAPIData = async () => {
            const res: ApiResponse = await axios.get('/checkAlive');
            if(!ignore){
                setResponse(res);
                console.log(res);
                
                console.log(response);
            }
        }

        fetchAPIData();

        return () => {
            ignore = true;
        }
    },[]);

    return (
        <>
            <h2>checkAlive</h2>
        </>
    )
}

export default ApiCheckAlive;