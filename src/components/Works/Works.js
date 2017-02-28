/*global Power2 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './Works.css';
import Smooth from '../../vendors/smooth';
import data from './projects.json';
import GlobalStore from '../../base/globalStore';
import { getPositionStart, getPositionEnd } from '../../helpers/offset.js';

import WorkItem from '../WorkItem/WorkItem';
import { TimelineMax } from 'gsap';
import { TweenMax } from 'gsap';


//Redux
import { setProjectActive } from '../../actions';

class Works extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isProjectHovered: false,
			active: false
		};

		this.data = data;
		this.edge = 0;

	}

	componentWillMount() {
		// this.props.fetchWorksData(data);
	}

	componentDidMount() {

		this.bindEvents();
		this.resize();

		this.smooth = new Smooth({ smoothContainer: false });
		// this.smoothElements = [];
		this.smooth.init();

		const sidebar = this.refs.sidebar.querySelector('.sidebar_wrapper');
		const padding = 80;
		let element = {
			el: sidebar,
			animations: [{
				transform: [

					{
						start: this.top,
						end: this.bottom,
						initialValue: 0,
						finalValue: GlobalStore.get('viewport').height - 72 - padding,
						transformType: 'translate3d',
						axis: 'y',
						ease: 0.05
					}
				]

			}]
		};

		this.smooth.addElement(element);
		this.smooth.start();

		console.log('this.props', this.props);

		// this.smooth = new Smooth({smoothContainer: false});
		// this.smoothElements = [];
		// this.smooth.init();

		// let element = {
		// 	el : this.refs.work09.refs.workItem,
		// 	animations : [
		// 		{
		// 			transform : [

		// 				{
		// 					start : 'in-viewport',
		// 					end : 'out-viewport',
		// 					initialValue : 0,
		// 					finalValue : 600,
		// 					transformType : 'translate3d',
		// 					axis : 'y',
		// 					ease : 0.1
		// 				}
		// 			]

		// 		}
		// 	]
		// };

		// var body = document.body,
		// html = document.documentElement;

		// const height = Math.max( body.scrollHeight, body.offsetHeight, 
		// 	html.clientHeight, html.scrollHeight, html.offsetHeight );

		// let elementFocus = {
		// 	el : this.refs.workFocus,
		// 	animations : [
		// 		{
		// 			transform : [

		// 				{
		// 					start : 0,
		// 					end : height,
		// 					initialValue : 0,
		// 					finalValue : height,
		// 					transformType : 'translate3d',
		// 					axis : 'y',
		// 					ease : 0.05
		// 				}
		// 			]

		// 		}
		// 	]
		// };

		// this.smooth.addElement(element);
		// this.smooth.addElement(elementFocus);
		// this.smooth.start();

		this.setupDom();

	}

	bindEvents() {
		console.log('this.elVideo', this.elVideo);

		GlobalStore.on('change:viewport', () => this.resize());
		GlobalStore.on('change:scroll', () => this.scrollUpdate());

		// this.elVideo.addEventListener("progress", (e) => this.onProgress(e));
	}

	scrollUpdate() {

		const scrollY = GlobalStore.get('scroll').currentY;
		const before = scrollY < this.top;
		const after = scrollY > this.bottom;

		// If we are before/after the first/`last frame, set the styles according first/last value.
		// if(before || after) {

		if (before || after) {

			// we are at firt or last and allready setStyle to reach initial/final Value
			if ((before && this.edge === -1) || (after && this.edge === 1)) {
				// continue;
			} else {

				this.edge = before ? -1 : 1;
				this.setState({ active: false });
				this.refs.sidebar.style.position = 'absolute';
				this.refs.sidebar.style.top = (this.edge === -1) ? '0px' : this.refs.el.offsetHeight - GlobalStore.get('viewport').height + 'px';
				this.refs.sidebar.style.right = '11px';

			}

		} else {

			if (!this.state.active) {

				this.edge = 0;
				this.setState({ active: true });
				this.refs.sidebar.style.position = 'fixed';
				this.refs.sidebar.style.top = '0px';
				console.log('GlobalStore.get().width', GlobalStore.get('viewport').width);
				
				let right = 0;
				if(GlobalStore.get('viewport').width >= 1366){
					right = GlobalStore.get('viewport').width - this.refs.wrapper.getBoundingClientRect().right;
				} else {
					right = 0;
				}

				this.refs.sidebar.style.right = 11 + right + 'px';
				
			}
		}

	}


	componentDidUpdate(prevProps) {
		console.log(' this.props', this.props);

		if (prevProps.current_active_project !== this.props.current_active_project) {
			console.log('active changed', this.props.current_active_project);
			console.log('this.props.current_active_project', parseFloat(this.props.current_active_project));

			let index = parseFloat(this.props.current_active_project) + 1;
			const sidebar_height = 36;

			TweenMax.killTweensOf(this.refs.sidebar.querySelector('.digit'));
			TweenMax.killTweensOf(this.refs.sidebar.querySelector('.single'));

			TweenMax.to(this.refs.sidebar.querySelector('.digit'), 1, { y: -index * sidebar_height, ease: Power2.easeOut })
			TweenMax.to(this.refs.sidebar.querySelector('.single'), 1, { y: -index * sidebar_height, ease: Power2.easeOut, delay: .1 })

			// if(this.props.work.current_active_project !== null){
			// 	this.onProjectHovered(this.props.work.current_active_project);
			// } else {
			// 	this.onProjectLeave(this.props.work.current_active_project);
			// }

			// this.setState((prevState) => ({
			// 	isProjectHovered: !prevState.isProjectHovered
			// }));
		}
	}


	onProjectHovered(projectId) {

		//this.refs.workFocus.style.top = window.pageYOffset + 'px';
		// this.showProjectFocus();

	}

	onProjectLeave() {
		// this.hideProjectFocus();
	}

	// ANIMATION AND DOM PARTS

	setupDom() {

		// TweenMax.set(this.elFocusTitle, {opacity: 0, y:50});
		// TweenMax.set(this.elFocusDesc, {opacity: 0, y:50});
		// TweenMax.set(this.elFocusRole, {opacity: 0,  y:50});

		// this.tlShowFocus = new TimelineMax({
		// 	paused: true
		// });

		// this.tlShowFocus
		// 	.to(this.elFocusTitle, .5, {opacity: 1, y:0}, 0)
		// 	.to(this.elFocusDesc, .5, {opacity: 1, y:0}, 0)
		// 	.to(this.elFocusRole, .5, {opacity: 1, y:0}, 0);

	}

	renderWorkItems() {

		let projects;
		const percentGrid = Math.round(100 / 12 * 100) / 100;

		if (this.data.projects) {
			projects = this.data.projects.map((work, index) => {

				/*return <WorkItem setProjectActive = { this.props.setProjectActive }
				ref = { 'work' + work.id }
				key = { work.id }
				actions = { this.props.actions }
				data = { work }
				/>*/

				if(work.container === true){

					let children = [];

					for (let index = 0; index < work.children.length; index++) {
						let element = work.children[index];						
						
						if (element.quote) {
							children.push(
								<div key={element.id} className="quote">
									<h3>{element.quoteContent}</h3>
								</div>
							)
						} else if (element.image) {

							const style = {
								marginRight: element.offsetRight * percentGrid + '%',
								marginLeft: element.offsetLeft * percentGrid + '%'
							};
							const className = "image grid__col-" + element.col;

							children.push(
								<div style={style} key={element.id} className={className}>
									<img src={element.imageSource} role="presentation"/>
								</div>
							)
						}
						 else {
							children.push(<WorkItem ref={'work' + element.id} key={element.id} actions={this.props.actions} setProjectActive={this.props.setProjectActive} data={element}/> );	
						}
						
					}

					return (
						<div key={work.id} className="project-container grid__col-12">
							{children}
						</div>
					);

				} else {
					return <WorkItem setProjectActive={this.props.setProjectActive} ref={'work' + work.id} key={work.id} actions={this.props.actions} data={work} />
				}
			});
		}

		return projects;
	}

	resize() {

		console.log('resize Video');
		this.top = getPositionStart(this.refs.el, GlobalStore.get('viewport').height) + GlobalStore.get('viewport').height;
		this.bottom = getPositionEnd(this.refs.el, GlobalStore.get('viewport').height) - GlobalStore.get('viewport').height;

	}

	render() {
		console.log('render');
		const WorkItems = this.renderWorkItems();
		const classNameSectionBackground = "section-background" + (this.state.isProjectHovered ? ' isProjectHovered' : '');
		const classNameBackground = "background" + (this.state.isProjectHovered ? ' isProjectHovered' : '');

		return ( 
		<section ref = "el"
			className = "works-section" >
			<div className="works-wrapper" ref="wrapper" >
				<div className = "grid" > 
					{ WorkItems } 
				</div> 
			</div> 
			<sidebar ref = "sidebar" >
				<div className = "sidebar_wrapper" >
					<div className = "sidebar_mask" >
						<div className = "digit decimal" >
							<span> 0 </span>
							<span> 0 </span>
							<span> 0 </span>
							<span> 0 </span>
							<span> 0 </span>
							<span> 0 </span>
							<span> 0 </span>
							<span> 0 </span>
							<span> 0 </span>
							<span> 0 </span>
							<span> 1 </span>
						</div> 
						<div className = "digit single" >
							<span> 0 </span>
							<span> 1 </span>
							<span> 2 </span>
							<span> 3 </span>
							<span> 4 </span>
							<span> 5 </span>
							<span> 6 </span>
							<span> 7 </span>
							<span> 8 </span>
							<span> 9 </span>
							
							<span> 0 </span>
						</div> 
					</div> 
					<span className = "divider" > /10</span >
				</div> 
			</sidebar>

		</section>
		);
	}
}


const mapStateToProps = state => ({
	current_active_project: state.work.current_active_project
})

const mapDispatchToProps = dispatch => ({
	setProjectActive: bindActionCreators(setProjectActive, dispatch)
})

// export default Works;
export default connect(
	mapStateToProps,
	mapDispatchToProps,
	null, { withRef: true }
)(Works)