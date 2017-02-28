import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import MainSection from '../components/MainSection'
import * as AppActions from '../actions'

const App = ({viewport, actions}) => (
	<div>
		<MainSection viewport={viewport} actions={actions} />
	</div>
)

App.propTypes = {
	viewport: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	viewport: state.viewport
})

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(AppActions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)
