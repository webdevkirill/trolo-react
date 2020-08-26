import React, { useState, useEffect, useContext } from 'react';
import classes from './Auth.module.sass'
import { NavLink } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { CurrentUserContext } from '../../context/currentUser';
import { LOGOUT, SET_AUTORIZED } from '../../context/types';

const API_KEY = process.env.REACT_APP_API_KEY;

export const Auth = ({match}) => {

    const [,dispatch] = useContext(CurrentUserContext);

    const isWantLogin = match.path.includes('auth') ? true : false;
    const btnText = isWantLogin ? 'Войти' : 'Зарегистрироваться';

    const apiUrl = `https://identitytoolkit.googleapis.com/v1/accounts:${isWantLogin ? 'signInWithPassword?key=' : 'signUp?key='}${API_KEY}`;

    const [{response, error}, doFetch] = useFetch(apiUrl);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false)
    


    const submitHandler = (e) => {
        e.preventDefault();

        doFetch({
            method: 'post',
            data: {
                email, password,
                returnSecureToken: true
            }
        })
    }

    useEffect(() => {
        if (!response) {
            return
        }

        setIsError(false);

        const expirationDate = new Date(new Date().getTime() + response.expiresIn * 1000);

        localStorage.setItem('token', response.idToken)
        localStorage.setItem('expirationDate', expirationDate)
        localStorage.setItem('email', response.email)

        dispatch({
            type: SET_AUTORIZED,
            payload: {
                email: response.email, token: response.idToken
            }
        })
        
    }, [response, dispatch])

    useEffect(() => {   
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (expirationDate <= new Date()) {
            localStorage.removeItem('token');
            localStorage.removeItem('expirationDate');
            localStorage.removeItem('email');
            dispatch({
                type: LOGOUT
            })
        } else {
            dispatch({
                type: SET_AUTORIZED,
                payload: {
                    email: localStorage.getItem('email'),
                    token: localStorage.getItem('token')
                }
            })
        }

    }, [dispatch ])

    useEffect(() => {
        if (!error) {
            return
        }
        setIsError(true);
    }, [error])


    return (
        <div className={classes.Auth}>
            <div className='card'>
                <div className="card-header">
                    
                    <ul className="nav nav-pills card-header-pills">
                        <li className="nav-item">
                            <NavLink to='/auth' className="nav-link">Вход</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to='/register' className="nav-link">Регистрация</NavLink>
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    <h5 className='card-title text-danger'>{isError ? 'Введите корректные данные' : ''}</h5>
                    <form onSubmit={submitHandler}>
                        <div className="form-group ">
                            <div className="input-group mb-3" >
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Email</span>
                                </div>
                                <input 
                                type="email" 
                                className="form-control" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="input-group mb-3" >
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Пароль</span>
                                </div>
                                <input 
                                type="password" 
                                className="form-control" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">{btnText}</button>

                    </form>
                    
                </div>
                
            </div>
        </div>
    )
}