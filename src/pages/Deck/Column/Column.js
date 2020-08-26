import React, { useState } from 'react';
import classes from './Column.module.sass';
import { useDrag, useDrop } from 'react-dnd'
import { COLUMN } from '../../../context/types';

export const Column = ({
        id,
        moveColumn,
        findColumn,
        dropColumnHandler,
        children,
        item,
        createTaskHandler,
        onDeleteColumnHandler
    }) => {

    const originalIndex = findColumn(id).index
    const [{
        isDragging
    }, drag] = useDrag({
        item: {
            type: COLUMN,
            id,
            originalIndex
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (dropResult, monitor) => {
            const {
                id: droppedId,
                originalIndex
            } = monitor.getItem()
            
            const didDrop = monitor.didDrop()
            if (!didDrop) {
                moveColumn(droppedId, originalIndex)
            } else {
                dropColumnHandler()
            }
        },
    })
    const [, dropColumn] = useDrop({
        accept: COLUMN,
        canDrop: () => false,
        hover({
            id: draggedId
        }) {
            if (draggedId !== id) {
                const {
                    index: overIndex
                } = findColumn(id)
                moveColumn(draggedId, overIndex)
            }
        },
    })

    const opacity = isDragging ? 0.5 : 1;

    const [newTaskName, setNewTaskName] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if (newTaskName !== '') {
            createTaskHandler({
                status: item.status,
                task: newTaskName,
                finished: false,
                important: false
            })
            setNewTaskName('');
        }
    }

    

    return (
        <div 
        className={`d-flex flex-column ${classes.wrapper}`}
        ref={(node) => drag(dropColumn(node))} >
            <div className='d-flex justify-content-around mb-3 align-items-center'>
                <h5 className='text-center text-primary'>{item.status}</h5>
                <button 
                className='btn btn-outline-danger'
                onClick={onDeleteColumnHandler}>Удалить</button>
            </div>
            

            <div 
            className={`${classes.Column}`}
            
            style={{opacity}}
            >
                {
                    children
                }
            </div>
            <div className = {classes.createNewCard}>
                <form onSubmit={(e) => onSubmitHandler(e)}>
                    <div className="form-group">
                        <label className='d-block text-primary text-center' htmlFor={`createNewCard-${id}`}>
                            <p>Создать новую задачу</p>
                        </label>
                        <input 
                        type="text" 
                        className="form-control" 
                        id={`createNewCard-${id}`}
                        placeholder="Название задачи"
                        value={newTaskName}
                        onChange={(e) => {setNewTaskName(e.target.value)}} />
                        </div>
                        <button className='btn btn-outline-primary'>Создать</button>
                </form>
            </div>
        </div>
    )
}