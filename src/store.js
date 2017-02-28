import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers'
import createLogger from 'redux-logger';

const logger = createLogger();

let store = createStore(reducers, applyMiddleware(logger));

export default store;