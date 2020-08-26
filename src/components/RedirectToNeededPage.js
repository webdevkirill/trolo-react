import React, { useContext } from 'react';
import { CurrentUserContext } from '../context/currentUser';
import { Redirect } from 'react-router-dom';

export const RedirectToNeededPage = (props) => {

    const [{isLoggedIn}] = useContext(CurrentUserContext)
    return isLoggedIn ? <Redirect to='/' /> : <Redirect to='/auth' />
}