import React, { useContext, useState } from 'react';
import { NavBar } from '../../components/NavBar/NavBar';
import classes from './DeckList.module.sass';
import { CurrentUserContext } from '../../context/currentUser';
import { DecksContext } from '../../context/decks';
import { Link, Redirect } from 'react-router-dom';


export const DeckList = (props) => {

    const [{isLoggedIn}] = useContext(CurrentUserContext);
    const {decks, deleteDeckHandler, createNewDeckHandler} = useContext(DecksContext);
    const [newDeckName, setNewDeckName] = useState('');

    if (isLoggedIn === false) {
        return <Redirect to='/auth' />
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (newDeckName !== '') {
            createNewDeckHandler(newDeckName)
            setNewDeckName('');
        }
        
    }
    
    return (
        <>
            <NavBar />
            <div className={`${classes.DeckList} pt-3`}>
                <div className='container'>
                    {decks.length === 0 && 
                        <h2 className='text-center'>Кажется, у вас нет досок</h2>}
                    <div className='row d-flex flex-wrap align-items-center'  >

                        {   

                            decks.map((deck) => {
                                return (
                                <Link to={`/deck/${deck.id}`}
                                className={`col-xs-12 col-sm-6 col-lg-3 text-center mb-3 ${classes.DeckList_deck}`} key={deck.id}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">{deck.name}</h5>
                                            <button 
                                            className="btn btn-outline-danger" 
                                            onClick={(e) => {deleteDeckHandler(e, deck.id)}}>Удалить</button>
                                        </div>
                                    </div>
                                </Link>
                            )})
                        }

                        <div className='col-xs-12 col-sm-6 col-lg-3 text-center'>
                            <div className='card'>
                                <div className='card-body'>
                                    <form onSubmit={(e) => onSubmitHandler(e)}>
                                        <div className="form-group">
                                            <label className='d-block text-primary text-center' htmlFor="createNewDeck">
                                                <h5>Создать новую доску</h5>
                                            </label>
                                            <input 
                                            type="text" 
                                            className="form-control" 
                                            id="createNewDeck" 
                                            placeholder="Название доски"
                                            value={newDeckName}
                                            onChange={(e) => {setNewDeckName(e.target.value)}} />
                                            </div>
                                            <button className='btn btn-outline-primary'>Создать</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                
            </div>
        </>
    )
}