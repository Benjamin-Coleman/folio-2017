import { combineReducers } from 'redux';
import viewport from './uiReducer';
import work from './workReducer';
import data from './dataReducer';
import photos from './photoReducer';

const reducers = combineReducers({
	viewport,
	work,
	data,
	photos
})

export default reducers
