import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import IntroContainer from './containers/IntroContainer';
import React, { Component } from 'react';

import { connect } from 'react-redux'
import { screenResize } from './actions'

class App extends Component {
	render() {
		return (
			<div className="App">
				<IntroContainer />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		viewport: state.viewport
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onResize: (viewport) => {
			dispatch(SCREEN_RESIZE(viewport))
		}
	}
}

const App = connect(
	mapStateToProps,
	mapDispatchToProps
)(IntroContainer)

export default App;
