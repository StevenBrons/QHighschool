import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose as reduxCompose } from 'redux';
import thunk from 'redux-thunk';

import reducer from './store/reducer';
import GlobalProvider from './GlobalProvider';
import "./layout.css";
import 'typeface-roboto'

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose;
const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
  ),
);

ReactDOM.render(
	<GlobalProvider store={store} />,
	document.getElementById('root'));
