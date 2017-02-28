import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
//global CSS here
// post module is import from component 
import './index.css';

import { Provider } from 'react-redux'
import store from './store';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
