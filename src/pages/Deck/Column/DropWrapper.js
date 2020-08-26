import React from 'react';
import { useDrop } from 'react-dnd';
import { CARD } from '../../../context/types';
import classes from './DropWrapper.module.sass';

export const DropWrapper = ({ onDrop, children, status}) => {
    const [{isOver}, drop] = useDrop({
        accept: CARD,
        drop: (item, monitor) => {
            onDrop(item, monitor, status);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    return (
        <div ref={drop} className={classes.DropWrapper} >
            {React.cloneElement(children, {isOver})}
        </div>
    )
}