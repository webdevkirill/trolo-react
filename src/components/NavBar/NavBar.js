import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CurrentUserContext } from '../../context/currentUser';
import { LOGOUT } from '../../context/types';

export const NavBar = () => {

    const [, dispatch] = useContext(CurrentUserContext);

    const onSubmit = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('email');
        dispatch({
            type: LOGOUT
        })
    }

    return (
        <nav className={`navbar navbar-light bg-light`}>
            <Link to='/' className="navbar-brand text-primary">Ваши доски</Link>
            <form className="form-inline" onSubmit={onSubmit}>
                <button className="btn btn-outline-danger my-2 my-sm-0" type="submit">Выход</button>
            </form>
        </nav>
    )
}