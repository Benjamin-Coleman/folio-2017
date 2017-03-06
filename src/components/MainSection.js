import React, { Component, PropTypes } from 'react'
import Intro from './Intro/Intro.js'
import IntroMotion from './IntroMotion/IntroMotion.js'
import FeaturedProjects from './FeaturedProjects/FeaturedProjects.js'
import Works from './Works/Works.js'
// import WorkFocus from './Works/WorkFocus.js'
import About from './About/About.js'
// import Photos from './Photos/Photos.js'

import Smooth from '../vendors/smooth';
import GlobalStore from '../base/globalStore';
import {TweenMax} from 'gsap';
import FishVideo from './FishVideo/FishVideo.js';
import ScrollManager from '../base/scrollManager.js';

class MainSection extends Component {

	static propTypes = {
		viewport: PropTypes.object,
		actions: PropTypes.object.isRequired
	}

	// constructor(props){
	// 	super(props);
	// }

	componentDidMount () {

		this.onResize();
		this.scrollManager = new ScrollManager();

		TweenMax.ticker.addEventListener("tick", (e) => this.raf());

		//this.smooth = new Smooth({smoothContainer: true, smoothSection:this.refs.el});
		this.smooth = new Smooth({smoothContainer: false});
		this.smoothElements = [];
		this.smooth.init();

		const worksRef = this.refs.works.getWrappedInstance().refs;
		let element = {
			el : worksRef.work09.refs.workItem,
			animations : [
				{
					transform : [

						{
							start : 'in-viewport',
							end : 'out-viewport',
							initialValue : 0,
							finalValue : 600,
							transformType : 'translate3d',
							axis : 'y',
							ease : 0.1
						}
					]

				}
			]
		};

		// var body = document.body,
    	// html = document.documentElement;

		// const height = Math.max( body.scrollHeight, body.offsetHeight,
		// 	html.clientHeight, html.scrollHeight, html.offsetHeight );

		// let elementFocus = {
		// 	el : this.refs.worksFocus.refs.el,
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
		// 					ease : 0.1
		// 				}
		// 			]

		// 		}
		// 	]
		// };

		this.smooth.addElement(element);
		// this.smooth.addElement(elementFocus);
		// this.smooth.start();

		window.addEventListener('resize', () => this.onResize());
	}

	onResize() {
		console.log('onResize MainSection -----');

		const width = this.getWidth();
		const height = this.getHeight();

		// this.props.actions.screenResize({ width : width , height : height});
		GlobalStore.set('viewport', {
			width: width,
			height: height,
		});

	}

	getHeight() {
		return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	}

	getWidth() {
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	}

	raf() {
		// update run through the RAF call stack:
		for( var c = 0; c < GlobalStore.get('rafCallStack').length; c++) {
			GlobalStore.get('rafCallStack')[c]();
		}

	}

	render() {
		return <div className="page-wrapper" ref="el">
			<IntroMotion />
			<Intro />
			<FeaturedProjects viewport={this.props.viewport} />
			<Works ref="works" actions={this.props.actions}/>
			{/*<WorkFocus ref="worksFocus" />*/}
			<About />
			{/*<Photos /> */}
			<FishVideo />
		</div>;
	}
}

export default MainSection;
