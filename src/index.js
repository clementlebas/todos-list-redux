import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Component } from 'react';

import { createStore, combineReducers } from 'redux';
import './App.css';

const todo = (state, action) => {
  console.log('state todo', state);
  console.log('action todo', action);
  switch (action.type) {
    case 'ADD_TODO':
    return {
      id: action.id,
      text: action.text,
      completed: false
    };
    case 'TOGGLE_TODO': 
    if (state.id !== action.id) {
      return state;
    }
    return {
      ...state,
      completed: !state.completed
    };
    default:
    return state;
  }
};

const todos = (state = [], action) => {
  console.log('state todos', state);
  console.log('action todos', action);
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t =>
        todo(t, action)
      );
    default:
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
  
    default:
    return state;
  }
}

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

const FilterLink = ({
  filter,
  currentFilter,
  children
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a href='#'
       onClick={e => {
         e.preventDefault();
         store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
         })
       }}
    >
      {children}
    </a>
  );
};

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
    default: return;
  }
}

let nextTodoId = 0;
class App extends Component {
  render() {
    const { todos, visibilityFilter } = this.props;
    const visibleTodos = getVisibleTodos(
      todos,
      visibilityFilter
    )
    return (
      <div style={{textAlign: 'center', marginTop: '50px'}}>
        <h1>TODO APP</h1>
        <input
        ref={node => {
          this.input = node;
        }}
        />
        <button onClick={ () => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = '';
        }}
        >
        Add Todo
        </button>
        <ul>
          {visibleTodos.map(todo =>
          <li
            key={todo.id}
            onClick={ () => {
              store.dispatch({
                type: 'TOGGLE_TODO',
                id: todo.id
              });
            }}
            style={{
              textDecoration:
                todo.completed ?
                  'line-through' :
                  'none'
            }}
          >
            {todo.text}
          </li>
          )}
      </ul>
      <p>
        Show:
        {' '}
        <FilterLink
          filter='SHOW_ALL'
          currentFilter={visibilityFilter}
        >
          ALL
        </FilterLink>
        {' '}
        <FilterLink
          filter='SHOW_ACTIVE'
          currentFilter={visibilityFilter}
        >
          Active
        </FilterLink>
        {' '}
        <FilterLink
          filter='SHOW_COMPLETED'
          currentFilter={visibilityFilter}
        >
          Completed
        </FilterLink>
      </p>
      </div>
    );
  }
}

const myRender = () => {
  ReactDOM.render(
    <App
      {...store.getState()}
    />,
    document.getElementById('root')
  );
};

store.subscribe(myRender);
myRender();

export default App;
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
