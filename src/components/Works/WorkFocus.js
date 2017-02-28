import React, { Component } from 'react';
import './Works.css';

import {TimelineMax} from 'gsap';
import {TweenMax} from 'gsap';

class WorkFocus extends Component {

	constructor(props){
		super(props);
		this.state = {
			isProjectHovered: false
        };
	}

	componentWillMount() {
		// this.props.fetchWorksData(data);
	}

	componentDidMount(){
		
		// DOM elements
		this.elFocus = this.refs.el;
		this.elFocusTitle = this.elFocus.querySelectorAll('.title');
		this.elFocusDesc = this.elFocus.querySelectorAll('.focus-desc-wrapper');
		this.elFocusRole = this.elFocus.querySelectorAll('.focus-role-wrapper');		
		this.elFocusRole = this.elFocus.querySelectorAll('.focus-role-wrapper');		

		this.setupDom();

	}

	componentDidUpdate(prevProps){

		if(prevProps.hover.current_hovered_project !== this.props.hover.current_hovered_project){
			console.log('hover changed');
			// this.setState({isProjectHovered: true});
			if(this.props.hover.current_hovered_project !== null){
				this.onProjectHovered(this.props.hover.current_hovered_project);
			} else {
				this.onProjectLeave(this.props.hover.current_hovered_project);
			}
			this.setState((prevState) => ({
				isProjectHovered: !prevState.isProjectHovered
			}));
		}
	}

	onProjectHovered(projectId) {

		//this.refs.workFocus.style.top = window.pageYOffset + 'px';
		this.showProjectFocus();

	}

	onProjectLeave() {
		this.hideProjectFocus();
	}

	// ANIMATION AND DOM PARTS

	setupDom(){

		TweenMax.set(this.elFocusTitle, {opacity: 0, y:50});
		TweenMax.set(this.elFocusDesc, {opacity: 0, y:50});
		TweenMax.set(this.elFocusRole, {opacity: 0,  y:50});

		this.tlShowFocus = new TimelineMax({
			paused: true
		});

		this.tlShowFocus
			.to(this.elFocusTitle, .5, {opacity: 1, y:0}, 0)
			.to(this.elFocusDesc, .5, {opacity: 1, y:0}, 0)
			.to(this.elFocusRole, .5, {opacity: 1, y:0}, 0);

	}

	showProjectFocus() {

		console.log('TimelineMax', TimelineMax);
		
		this.tlShowFocus.play();
	}

	hideProjectFocus() {

		this.tlShowFocus.tweenTo(0);

	}


	render() {

		return (
			<div ref="el" className="work-focus">
                <h2 className="title left">Inside <br />Discover weekly</h2>	
                <h2 className="title right">Inside <br />Discover weekly</h2>	
                <div className="focus-desc-wrapper">
                    <p className="desc">
                        Discovery weelky see trought the eye of pitcfork editor and featured artist!
                    </p>
                </div>
                <div className="focus-role-wrapper">
                    <ul>
                        <li>
                            <h5>For</h5>
                            <p>Alexandre rochet</p>
                        </li>
                        <li>
                            <h5>With</h5>
                            <p>Freelance</p>
                        </li>
                        <li>
                            <h5>Doing</h5>
                            <p>Interaction Designer</p>
                            <p>Creative Developer</p>
                        </li>
                    </ul>
                </div>
            </div>
		);
	}
}

export default WorkFocus;
