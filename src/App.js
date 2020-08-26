import React from 'react';
import { Routes } from './routes';
import { CurrentUserProvider } from './context/currentUser';
import { DecksProvider } from './context/decks';

import { BrowserRouter } from 'react-router-dom';
import { RedirectToNeededPage } from './components/RedirectToNeededPage';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';



function App() {

    const device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const backend = device ? TouchBackend : HTML5Backend;

    return (
        <CurrentUserProvider>
            <DecksProvider>
                <DndProvider 
                backend={backend}
                >
                    <BrowserRouter basename={'/trolo-react/'} >
                        <Routes />
                        <RedirectToNeededPage />
                    </BrowserRouter>
                </DndProvider>
            </DecksProvider>
        </CurrentUserProvider>
        
    );
}

export default App;
