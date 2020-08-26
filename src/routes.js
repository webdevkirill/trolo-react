import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Auth } from './pages/Auth/Auth';
import { CurrentUserContext } from './context/currentUser';
import { Deck } from './pages/Deck/Deck';
import { Logout } from './components/Logout';

export const Routes = ({children}) => {

    const [{isLoggedIn}] = useContext(CurrentUserContext);

    return (
        <Switch>
            {
                isLoggedIn ? 
                <>
                    <Route path='/' exact component={Logout} />
                    <Route path='/deck/:slug' component={Deck} />
                </> :
                <>
                    <Route path='/auth' component={Auth} />
                    <Route path='/register' component={Auth} />
                </>
                
            }
        </Switch>
        
    )
}