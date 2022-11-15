import './TodoList.scss';
import React, {FC} from 'react';
import TodoItem from "../TodoItem/TodoItem";
import {ITodoItem} from "../../entities/TodoItem";
import { useAppSelector } from "../../hooks/StoreHook";

const TodoList: FC = () => {
    const todos: ITodoItem[] = useAppSelector((state) => state.todoReducer.todos);

    return (
        <div className="todo-container">
            <ul className="todo-list">
                {todos.map((todo) =>
                    <li key={todo.id} className="todo-list__item">
                        <TodoItem todo={todo}/>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default TodoList;