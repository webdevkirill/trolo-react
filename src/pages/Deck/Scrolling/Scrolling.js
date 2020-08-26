import React, { useRef } from 'react';
import classes from './Scrolling.module.sass';
import { useDrop } from 'react-dnd';
import { COLUMN, CARD } from '../../../context/types';

export const Scrolling = ({quality}) => {

    let ref = useRef(null);


    let [, drop] = useDrop({
        accept: [COLUMN, CARD],
        hover(item, monitor) {
            if (monitor.isOver()) {
                document.querySelector('.withscroll').scrollLeft += quality === 'left' ? -2 : 2
            }
        }
    })

    drop(ref);

    // const doScroll = useCallback(() => {
    //     setIsHovered(true)
    // }, [isHovered])

    // useEffect(() => {
    //     let isDestroied = false;
        
    //     if (!isHovered && !isDestroied) {
    //         return
    //     } else  {
    //         setTimeout(() => {
    //             document.querySelector('.withscroll').scrollLeft += quality === 'left' ? -2 : 2
    //             setIsHovered(false)
    //         }, 5);
            
    //     }
    //     return () => {
    //         isDestroied = true
    //     }
    // }, [isHovered, quality])

    return (
        <>
            <div className={`${classes.Scrolling} ${classes[`Scrolling_${quality}`]}`}
            ref={ref} ></div>
        </>
    )
}