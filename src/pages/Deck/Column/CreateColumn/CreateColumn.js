import React, { useState } from 'react';
import classes from './CreateColumn.module.sass';

export const CreateColumn = ({createColumnHandler}) => {

    const [newColumnName, setNewColumnName] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (newColumnName !== '') {
            createColumnHandler(newColumnName);
            setNewColumnName('');
        }
    }

    return (
        <div className={classes.CreateColumn}>
            <form onSubmit={(e) => onSubmitHandler(e)}>
                <div className="form-group">
                    <label className='d-block text-primary text-center' htmlFor="exampleFormControlInput1">
                        <h5>Создать новую колонку</h5>
                    </label>
                    <input 
                    type="text" 
                    className="form-control" 
                    id="exampleFormControlInput1" 
                    placeholder="Название колонки"
                    value={newColumnName}
                    onChange={(e) => {setNewColumnName(e.target.value)}} />
                    </div>
                    <button className='btn btn-outline-primary'>Создать</button>
            </form>
            
        </div>
    )
    
}