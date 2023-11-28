import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

interface ApiResponse{
    message: string
    port: number
}

const ApiCheckAlive = () => {
    const [response, setResponse] = useState<ApiResponse>();

    useEffect(() => {
        let ignore = false;
        const fetchAPIData = async () => {
            const res: any = await axios.get('/checkAlive');
            if(!ignore){
                setResponse(res.data);
            }
        }

        fetchAPIData();

        return () => {
            ignore = true;
        }
    },[]);

    return (
        <>
            {response !== null && (
                <h4>{JSON.stringify(response)}</h4>
            )}
        </>
    )
}

export default ApiCheckAlive;