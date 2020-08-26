import React, { useContext, useEffect } from 'react';
import { DeckList } from '../pages/DeckList/DeckList';
import { CurrentUserContext } from '../context/currentUser';
import { LOGOUT } from '../context/types';

export const Logout = () => {

    const [, dispatch] = useContext(CurrentUserContext);

    useEffect(() => {
        const timeLogout = 
            new Date(localStorage.getItem('expirationDate')).getTime() - new Date().getTime();

        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('expirationDate');
            localStorage.removeItem('email');
            dispatch({
                type: LOGOUT
            })
        }, timeLogout);
    }, [dispatch])

    return <DeckList />
    
}