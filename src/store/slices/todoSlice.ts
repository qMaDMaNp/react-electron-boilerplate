import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import {ITodoItem} from "../../entities/TodoItem";
import {uuidv4} from "../../lib/utils";

interface ITodoSliceState {
    todos: ITodoItem[]
}

const initialState: ITodoSliceState = {
    todos: []
};

export const getTodosAsync = createAsyncThunk<ITodoItem[]>(
    'todos/getTodosAsync',
    async () => {
        const response = await fetch(`http://localhost:7700/todos`);
        let todos: ITodoItem[] = [];

        if (response.ok) {
            todos = await response.json();
            return todos;
        }

        return todos;
    }
);

const todoSlice = createSlice({
    name: 'todoReducer',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<{['title']: string}>) => {
            const todo = {
                id: uuidv4(),
                title: action.payload.title,
                completed: false
            };

            state.todos.push(todo);
        },

        completeTodo: (state, action: PayloadAction<{['id']: string}>) => {
            const index = state.todos.findIndex(x => x.id === action.payload.id);
            if (index >= 0) state.todos[index].completed = !state.todos[index].completed;
        },

        removeTodo: (state, action: PayloadAction<{['id']: string}>) => {
            state.todos = state.todos.filter(x => x.id !== action.payload.id);
        }
    },
//https://www.youtube.com/watch?v=fiesH6WU63I&t=3014s&ab_channel=ChrisBlakely
    extraReducers: builder => {
        builder.addCase(getTodosAsync.fulfilled, (state, action) => {
            return {todos: action.payload};
        })
    }
});

export const {
    addTodo,
    completeTodo,
    removeTodo
} = todoSlice.actions;
// export const todos = (state: RootState) => state.todoReducer.todos; //does not work =(
export default todoSlice.reducer;