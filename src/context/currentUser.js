import React, { createContext, useReducer } from "react";
import { LOADING, SET_AUTORIZED, SET_UNAUTORIZED, LOGOUT, SET_DATA } from "./types";

const initialState = {
    isLoading: false,
    isLoggedIn: null,
    currentUser: null,
    data: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case LOADING: 
            return {...state, isLoading: true}
        case SET_AUTORIZED:
            return {...state, isLoading: false, isLoggedIn: true, currentUser: action.payload}
        case SET_UNAUTORIZED:
            return {...state, isLoggedIn: false}
        case LOGOUT:
            return {...initialState, isLoggedIn: false}
        case SET_DATA:
            return {...state, data: action.payload}
        default:
            return {...state}
    }
}

export const CurrentUserContext = createContext()


export const CurrentUserProvider = ({children}) => {
    

    const value = useReducer(reducer, initialState);

    return (
        <CurrentUserContext.Provider value={value}>
            {children}
        </CurrentUserContext.Provider>
    )
}