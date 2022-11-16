import {useState, FC, useEffect} from 'react';
import './App.scss';
import TodoList from "../../components/TodoList/TodoList";
import { useAppDispatch, useAppSelector } from '../../hooks/StoreHook';
import {addTodo, getTodosAsync} from '../../store/slices/todoSlice';
import {ITodoItem} from "../../entities/TodoItem";


const App: FC = () => {
    const [inputText, setInputText] = useState('');
    const todos: ITodoItem[] = useAppSelector((state) => state.todoReducer.todos);
    const completedTodos = todos.filter(x => x.completed);

    const dispatch = useAppDispatch();

    const handleInputChange = (e: any) => {
        setInputText(e.target.value);
    };

    const addTodoItem = () => {
        if (inputText.length === 0) return;

        dispatch(addTodo({title: inputText}));
        setInputText('');
    };

    useEffect(() => {
        dispatch(getTodosAsync());
    }, [dispatch])

    return (
        <div className="App">
            <header className="header">
                <div className="header__item">
                    <h1>Павлів Todo List ({completedTodos.length}/{todos.length})</h1>
                </div>
            </header>

            <div style={{marginBottom: '1rem'}}>
                <input value={inputText} onChange={handleInputChange} type="text" placeholder="Todo Here" className="todo-input"/>
                <button onClick={addTodoItem} className="todo-save-btn">save</button>
            </div>

            <TodoList/>
        </div>
    );
}

export default App;
