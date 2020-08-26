import React, { useRef, useState } from 'react';
import classes from './Task.module.sass';
import { useDrag, useDrop } from 'react-dnd';
import { CARD } from '../../../../context/types';
import finishedIcon from '../../../../icons/finishIcon.svg';
import finishedIconFilled from '../../../../icons/finishIconFilled.svg';
import importantIcon from '../../../../icons/importantIcon.svg';
import importantIconFilled from '../../../../icons/importantIconFilled.svg';
import { Modal } from './Modal/Modal';


export const Task = ({item, index, moveItem, qualityChangeHandler, taskChangeHandler}) => {

    const [isModal, setIsModal] = useState(false);

    const ref = useRef(null);

    const [, dropTask] = useDrop({
        accept: CARD,
        hover(item, monitor) {
            if (!ref.current) {
                return
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return
            }

            const hoveredRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
            const mousePosition = monitor.getClientOffset();
            const hoverClientY = mousePosition.y - hoveredRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            
            moveItem(dragIndex, hoverIndex, item.status);
            item.index = hoverIndex;
        }
    });

    const [{
        isDragging
    }, dragTask] = useDrag({
        item: {
            type: CARD,
            ...item,
            index
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    dragTask(dropTask(ref));

    const opacity = isDragging ? 0.5 : 1;

    const classList = ` ${item.important ? classes.important : ''} ${item.finished ? classes.finished : ''} `;

    const taskClickHandler = (e) => {
        if (e.target.tagName === 'DIV' || e.target.tagName === 'P')
        setIsModal(true);
        document.body.style.overflow = 'hidden';
    }

    const onModalCloseHandler = (item) => {
        setIsModal(false);
        document.body.style.overflow = '';
        taskChangeHandler(item)
    }

    const deleleItemHandler = () => {
        setIsModal(false);
        document.body.style.overflow = '';
        taskChangeHandler(null)
    }

    return (
        <>
            {isModal && <Modal 
                        item={item} 
                        onModalCloseHandler={(item) => onModalCloseHandler(item)}
                        deleleItemHandler={deleleItemHandler} /> }
            <div 
            className={classes.Task + classList} 
            ref={ref}
            style={{opacity}}
            onClick={(e) => taskClickHandler(e)}>
                <p>{item.task}</p>
                <div className='buttons'>
                    <button onClick = {() => qualityChangeHandler('important')}>
                        <img src={item.important ? importantIconFilled : importantIcon} alt="important icon" />
                    </button>
                    <button onClick={() => qualityChangeHandler('finished') }>
                        <img src={item.finished ? finishedIconFilled : finishedIcon} alt="finished icon" />
                    </button>
                </div>
            </div>
        </>
    )
}