import {useEffect, useState} from "react";
import {Service} from "./Service";
import {Dictionary} from "./Dictionary";

export function Logger(log: Dictionary<string>[]>) {
    fetch(process.env.REACT_APP_SEND_LOG_ENDPOINT, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
    }).then(r => true);
}


export function useLogService()  {
    const [result, setResult] = useState<Service<Dictionary<string>[]>>({
        status: 'loading'
    });

    useEffect(() => {
        fetch(process.env.REACT_APP_RETRIEVE_LOGS_ENDPOINT)
            .then(response => response.json())
            .then(response => setResult({ status: 'loaded', payload: response }))
            .catch(error => setResult({ status: 'error', error }));
    }, []);

    return result;
}

export default {Logger, useLogService};

