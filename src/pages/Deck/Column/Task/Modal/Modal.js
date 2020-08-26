import React, { useState } from 'react';
import classes from './Modal.module.sass';

export const Modal = ({item, onModalCloseHandler, deleleItemHandler}) => {

    const [taskName, setTaskName] = useState(item.task);
    
    const onOverlayClick = (e) => {
        if (e.target.className.indexOf('Modal_overlay') !== -1) {
            onModalCloseHandler({...item, task: taskName})
        }
    }

    return (
        <div 
        className={classes.Modal_overlay}
        onClick={(e) => onOverlayClick(e)}>
            <div className={classes.Modal_content}>
                <label htmlFor='modal' className='text-primary'>Изменить название:</label>
                <input id='modal' value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                <button 
                className='btn btn-outline-danger'
                onClick={deleleItemHandler}>Удалить</button>
            </div>
        </div>
    )
}