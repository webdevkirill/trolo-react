import React, { createContext, useReducer } from "react";
import { idGenerator } from "../utils";
import { DELETE_DECK, SET_DECK } from "./types";

const initialState = { decks: JSON.parse(localStorage.getItem('trolo_state')) || [] };

const reducer = (state, action) => {
    switch (action.type) {
        case DELETE_DECK:
            return {...state, decks: action.payload}
        case SET_DECK:
            return {...state, decks: action.payload}
        default:
            return {...state}
    }
}

export const DecksContext = createContext()

export const DecksProvider = ({children}) => {

    const value = useReducer(reducer, initialState);
    const [{decks}, dispatch] = value;

    const deleteDeckHandler = (e, id) => {
        e.preventDefault();
        const decksFiltered = [...decks].filter((item) => item.id !== id);

        dispatch({
            type: SET_DECK,
            payload: decksFiltered
        })

        localStorage.setItem('trolo_state', JSON.stringify(decksFiltered));
    }

    const createNewDeckHandler = (name) => {
        const newDeck = {
            name,
            id: idGenerator(),
            columns: [],
            tasks: []
        };

        const newDecks = [...decks, newDeck];

        dispatch({
            type: SET_DECK,
            payload: newDecks
        })

        localStorage.setItem('trolo_state', JSON.stringify(newDecks));
    }

    const setTasksHandler = (deckIndex, tasks) => {
        const state = [...decks];
        state[deckIndex].tasks = tasks;

        dispatch({
            type: SET_DECK,
            payload: state
        })
        localStorage.setItem('trolo_state', JSON.stringify(state));
    }

    return (
        <DecksContext.Provider 
        value={{decks, deleteDeckHandler, dispatch, setTasksHandler, createNewDeckHandler}}>
            {children}
        </DecksContext.Provider>
    )
}