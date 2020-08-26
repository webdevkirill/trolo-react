import React, { useContext, useState, useEffect } from 'react';
import classes from './Deck.module.sass'
import { NavBar } from '../../components/NavBar/NavBar';
import { DecksContext } from '../../context/decks';
import { Column } from './Column/Column';
import { useDrop } from 'react-dnd';
import { COLUMN, SET_DECK } from '../../context/types';
import update from 'immutability-helper';
import { DropWrapper } from './Column/DropWrapper';
import { Task } from './Column/Task/Task';
import { Scrolling } from './Scrolling/Scrolling';
import { CreateColumn } from './Column/CreateColumn/CreateColumn';

export const Deck = ({match}) => {

    const deckId = match.params.slug;
    const {decks, dispatch, setTasksHandler} = useContext(DecksContext);
    
    const deck = decks.filter(item => item.id === deckId)[0];

    const deckIndex = decks.indexOf(deck);

    const [columns, setColumns] = useState(deck.columns);

    const tasksContext = deck.tasks;
    const [tasks, setTasks] = useState(tasksContext);

    const [prevStateTasks, setPrevStateTasks] = useState(tasks);


    const onDrop = (item, monitor, status) => {
        setTasks(prevState => {
            
            let newTask = {status, id: item.id, task: item.task, important: item.important, finished: item.finished};
            let flag = false;

            const newItems = prevState
                .filter(i => i.id !== item.id)

            const changedArr = [...newItems];

            changedArr.forEach((i, index) => {
                if (status === i.status && !flag) {
                    flag = true;
                    newItems.splice(index + item.index, 0, newTask)
                }
            })

            if (!flag) {
                newItems.push(newTask)
            }
            
            return [...newItems]
            
        });

    }

    const moveItem = (dragIndex, hoverIndex, item) => {
        const status = item.status;
        setTasks(prevState => {
            const newItems = prevState.filter(i => i !== item);
            const changedArr = [...newItems];

            let counter = 0;

            changedArr.forEach((i, idx) => {
                if (i.status === status) {
                    if (counter === dragIndex) {
                        newItems.splice(hoverIndex + idx, 0, item);
                    } else {
                        counter++
                    }
                    
                }
            })
            return [...newItems];
        });
    };


    const moveColumn = (id, atIndex) => {
        const { column, index } = findColumn(id);
        setColumns(
            update(columns, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, column],
                ],
            }),
        )
    }

    const findColumn = (id) => {
        const column = columns.filter((c) => c.id === id)[0]
        return {
            column,
            index: columns.indexOf(column),
        }
    }

    const [, drop] = useDrop({ accept: COLUMN })

    const dropColumnHandler = () => {
        deck.columns = columns;
        const changedDecks = [...decks];
        changedDecks[deckIndex] = deck;
        dispatch({
            type: SET_DECK,
            payload: changedDecks
        })
        localStorage.setItem('trolo_state', JSON.stringify(changedDecks));
    }

    const qualityChangeHandler = (quality, item) => {
        const changedTasks = [...tasks];
        changedTasks.forEach((i, idx) => {
            if (i.task === item.task && i.status === item.status) {
                i[quality] = !i[quality];
            }
        });

        setTasks(changedTasks);
        setTasksHandler(deckIndex, changedTasks);
    }

    const taskChangeHandler = (newTask, item) => {
        const changedTasks = [...tasks];
        changedTasks.forEach((i, idx) => {
            if (i.task === item.task && i.status === item.status) {
                if (newTask !== null) {
                    changedTasks[idx] = newTask;
                } else {
                    changedTasks.splice(idx, 1);
                }
                
            }
        });
        setTasks(changedTasks);
        setTasksHandler(deckIndex, changedTasks);
    }

    useEffect(() => {

        if (prevStateTasks === tasks) {
            return
        }
        setPrevStateTasks(tasks)
        setTimeout(() => {
            setTasksHandler(deckIndex, tasks);
        }, 100);

    }, [tasks, deckIndex, setPrevStateTasks, setTasksHandler, prevStateTasks])

    const createColumnHandler = (status) => {

        const newCol = {
            status,
            id: deck.columns.length + 1
        }
        deck.columns = [...deck.columns, newCol];
        setColumns(deck.columns)

        const changedDecks = [...decks];

        changedDecks[deckIndex] = deck;
        dispatch({
            type: SET_DECK,
            payload: changedDecks
        })
        localStorage.setItem('trolo_state', JSON.stringify(changedDecks));
    }

    const createTaskHandler = (task) => {
        const changedTasks = [...tasks, {...task, id: tasks.length + 1}];
        setTasks(changedTasks);
        setTasksHandler(deckIndex, changedTasks);
    }

    const onDeleteColumnHandler = (status) => {
        const changedColumns = columns.filter(i => i.status !== status);
        const changedTasks = tasks.filter(i => i.status !== status);
        deck.tasks = changedTasks;
        deck.columns = changedColumns;

        setColumns(changedColumns);
        setTasks(changedTasks);

        const changedDecks = [...decks];
        changedDecks[deckIndex] = deck;
        dispatch({
            type: SET_DECK,
            payload: changedDecks
        })
        
        localStorage.setItem('trolo_state', JSON.stringify(changedDecks));
    }
    

    return (
        <div className={classes.Deck}>
            <Scrolling quality='left' />
            <Scrolling quality='right' />

            <NavBar />
            <div className='mt-3'>
                <h1 className='text-center mb-3'>{deck.name}</h1>
                <h5 className='text-center text-secondary mb-4'>{deck.descr}</h5>
                <div className={`d-flex flex-nowrap p-2 withscroll align-items-start`} style={{overflow: 'auto'}} ref={drop}>
                    
                    {columns.map((item) => {
                        return(
                            <Column
                            key={item.id}
                            id={item.id}
                            moveColumn={moveColumn}
                            findColumn={findColumn}
                            dropColumnHandler={dropColumnHandler}
                            item={item}
                            createTaskHandler={(task) => createTaskHandler(task)}
                            onDeleteColumnHandler={() => onDeleteColumnHandler(item.status)}
                            >
                                
                                
                                <DropWrapper 
                                onDrop={onDrop} 
                                status={item.status} >
                                    <>
                                        {
                                            tasks
                                            .filter(i => {
                                                return i.status === item.status
                                            })
                                            .map(((i, idx) => {
                                                return (
                                                    <Task 
                                                    key={idx} 
                                                    item={i} 
                                                    index={idx} 
                                                    moveItem={moveItem} 
                                                    taskChangeHandler={(item) => taskChangeHandler(item, i)}
                                                    qualityChangeHandler={(quality) => qualityChangeHandler(quality, i)} />
                                            )}))
                                        }
                                    </>
                                    
                                </DropWrapper>
                                
                            </Column>
                        )
                        
                        
                    })}
                    <CreateColumn createColumnHandler={(name) => createColumnHandler(name)} />
                </div>
            </div>
        </div>
    )
}