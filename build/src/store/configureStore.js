import { createStore, applyMiddleware, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import dataReducers from './data_reducers';
import viewReducers from './view_reducers';

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  //loggerMiddleware
)(createStore);

const rootReducer = combineReducers({ view: viewReducers, data: dataReducers, routing: routerReducer });

function configureStore (initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}

export default configureStore;
