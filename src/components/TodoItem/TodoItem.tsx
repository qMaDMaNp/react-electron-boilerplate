import './TodoItem.scss';
import React, {FC} from 'react';
import {ITodoItem} from "../../entities/TodoItem";
import { useAppDispatch } from '../../hooks/StoreHook';
import { completeTodo, removeTodo } from '../../store/slices/todoSlice';

interface ITodoItemProps {
    todo: ITodoItem
}

const TodoItem: FC<ITodoItemProps> = ({todo}) => {
    const dispatch = useAppDispatch();

    const completeHandler = () => {
        dispatch(completeTodo(todo));
    };

    const removeHandler = () => {
        dispatch(removeTodo(todo));
    };

    return (
        <div className={`todo ${todo.completed ? 'done' : ''}`}>
            <div className="todo__inner">
                <div className="todo__title">{todo.title}</div>
            </div>

            <button onClick={completeHandler} className="check-btn" style={{marginRight: '0.5rem'}}>
                <i className={todo.completed ? 'fas fa-times' : 'fas fa-check'}></i>
            </button>

            <button onClick={removeHandler} className="trash-btn">
                <i className="fas fa-trash"></i>
            </button>
        </div>
    );
}

export default TodoItem;