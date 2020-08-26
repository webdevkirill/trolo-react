import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useLocalStorage } from "./useLocalStorage";

export const useFetch = (url) => {
    const baseUrl = 'https://cors-anywhere.herokuapp.com/';
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState({});
    const [token] = useLocalStorage('token');

    const doFetch = useCallback((options = {}) => {
        setOptions(options);
        setIsLoading(true);
    }, [])

    useEffect(() => {
        let skipGetResponseAfterDestroy = false;
        const requestOptions = {
            ...options,
        }
        if (!isLoading) {
            return
        }
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        
        axios(baseUrl + url, requestOptions).then(res => {
            if (!skipGetResponseAfterDestroy) {
                setResponse(res.data);
                setIsLoading(false);
            }
        }).catch(error => {
            if (!skipGetResponseAfterDestroy) {
                setError(error.response.data)
                setIsLoading(false);
            }
        })

        return () => {
            skipGetResponseAfterDestroy = true;
        }
    }, [isLoading, options, url, token])

    return [{
        isLoading, response, error
    }, doFetch]
} 