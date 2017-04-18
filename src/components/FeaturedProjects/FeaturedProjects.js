/* global Power2 Power0 Power3 Power4 Power1 TweenLite TimelineMax MorphSVGPlugin*/

import React, { Component } from 'react';
import styles from './FeaturedProjects.module.css';
import {TimelineLite} from 'gsap';
import GlobalStore from '../../base/globalStore';
import {getPositionStart, getPositionEnd} from '../../helpers/offset.js';

class FeaturedProjects extends Component {

	constructor(props){

        super(props);

        this.edge = 0;
        this.active = false;

		this.easedScroll = 0;
		this.scroll = 0;
		this.scrollY = 0;
		this.animatedElmts = [];

		this.documentHeight = -1;

    }

	componentDidMount(){

		this.bindEvents();
		this.setTimeLines();
		setTimeout(() => {
			this.resize();
		}, 0);
	}

	// shouldComponentUpdate(){

	// 	return true;
	// }

	bindEvents(){
        this.update = (e) => this.rafUpdate(e);
        // GlobalStore.get('rafCallStack').push(this.update);
        GlobalStore.on('change:viewport', () => this.resize());
        GlobalStore.on('change:scroll', () => this.scrollUpdate());

    }

	componentWillUpdate() {
		console.log('componentWillUpdate');

	}

	componentDidUpdate(prevProps) {

		if(prevProps.hover.current_hovered_project !== this.props.hover.current_hovered_project){
			console.log('hover changed');
		}
	}

	setTimeLines() {

		this.mainTL && delete this.mainTL;

		// this.animatedElmts = [this.$bg[0]];
		this.mainTL = new TimelineLite();
		this.mainTL.stop();

		const timeline = new TimelineLite();

		const title01 = this.refs.title01;
		const title02 = this.refs.title02;

		const image01 = this.refs.image01;
		const image02 = this.refs.image02;
		const image03 = this.refs.image03;
		const image04 = this.refs.image04;

		const line00 = this.refs.line00;
		const line01 = this.refs.line01;
		const line02 = this.refs.line02;
		const line03 = this.refs.line03;
		const line04 = this.refs.line04;
		const line05 = this.refs.line05;

		const wrapper = this.refs.wrapper;

		const delayBallon = 1.7;
		const durationLetters = 5;
		const delayLetters = 4.5;

		timeline
		.from(title01, 8, {
			x: 50,
			skewX: 30,
			ease: Power4.easeOut
		}, 0.5)
		.from(title02, 8, {
			x: -50,
			skewX: -30,
			ease: Power4.easeOut
		}, 0.5)

		.from(line00, durationLetters, {
			y: 50,
			ease: Power2.easeOut
		}, delayLetters)
		.from(line01, durationLetters, {
			y: 125,
			ease: Power2.easeOut
		}, delayLetters)
		.from(line02, durationLetters, {
			y: 200,
			ease: Power2.easeOut
		}, delayLetters)
		.from(line03, durationLetters, {
			y: 275,
			ease: Power2.easeOut
		}, delayLetters)
		.from(line04, durationLetters, {
			y: 325,
			ease: Power2.easeOut
		}, delayLetters)
		.from(line05, durationLetters, {
			y: 400,
			ease: Power2.easeOut
		}, delayLetters)
		

		.fromTo(wrapper, 9, {
			y: -400,
			ease: Power2.easeOut
		},{
			y: 100,
			ease: Power2.easeOut
		}
		, 2)
		.to(image01, delayBallon, {
			clip: "rect(0px 375px 397px 0px)",
			ease: Power4.easeOut
		}, 3)
		.to(image02, delayBallon, {
			clip: "rect(0px 375px 397px 0px)",
			ease: Power4.easeOut
		}, 3 + delayBallon)
		.to(image03, delayBallon, {
			clip: "rect(0px 375px 397px 0px)",
			ease: Power4.easeOut
		}, 3 + delayBallon * 2)
		.to(image04, delayBallon, {
			clip: "rect(0px 375px 397px 0px)",
			ease: Power4.easeOut
		}, 3 + delayBallon * 3)


		this.mainTL.add(timeline, 0);
		// this.animatedElmts.push(a, m, g, _, y);

	}

    scrollUpdate() {

		const scrollY = GlobalStore.get('scroll').currentY;
		const before = scrollY < this.top;
		const after = scrollY > this.bottom;

		if(scrollY <= this.height && scrollY >= 100) {

			if (scrollY !== this.scrollY) {
				console.log('onscroll');

				this.scroll = scrollY / this.height;

				this.scrollTween = new TweenLite(this, 1, {
					easedScroll: this.scroll,
					ease: Power3.easeOut,
					onUpdate: () => this.updateScroll()
				});

				this.scrollY = scrollY;
			}

		}

		// // If we are before/after the first/`last frame, set the styles according first/last value.
		// if(before || after) {

        //     // we are at firt or last and allready setStyle to reach initial/final Value
        //      if( (before && this.edge === -1) || (after && this.edge === 1)){
        //         // continue;
        //     } else {
        //         this.edge = before ? -1 : 1;
        //         this.active = false;
        //         // DEFAULT STATE HERE
        //         this.refs.wrapper.style.position = 'absolute';
        //         this.refs.wrapper.style.top = (this.edge === -1) ? '0px' : this.refs.el.offsetHeight - GlobalStore.get('viewport').height + 'px';
        //     }

		// } else {

		// 	if (!this.active) {
		// 		this.edge = 0;
		// 		this.active = true;
		// 		// SHOW HERE
		// 		console.log('active !!!');
        //         this.refs.wrapper.style.position = 'fixed';
		// 		this.refs.wrapper.style.top = '0px';
		// 	}
		// }

	}

	updateScroll() {

		this.mainTL.progress(this.easedScroll);

	}

	resize(){

		this.documentHeight = this.refs.el.offsetHeight;

        this.top = getPositionStart(this.refs.el, GlobalStore.get('viewport').height) + GlobalStore.get('viewport').height;
		this.bottom = getPositionEnd(this.refs.el, GlobalStore.get('viewport').height) - GlobalStore.get('viewport').height;		

		// it's more the distance to scroll
		this.height = this.top + this.documentHeight - (window.innerHeight / 2);

    }

	render() {

		const classNameGrid = styles.featured_projects + " grid";
		const classNameImg = styles.featured_image + " grid__col-3";

		return (
			<div ref="el" className={classNameGrid}>
				<header className="grid__col-9">
					<h2 ref="title01">Here is a selection of my work</h2>
					<h2 ref="title02">realized during 2014 - 2017</h2>
				</header>

				<blockquote className="grid__col-6">
					<p>
						<span ref="line00">Life is filigree work. <br /></span>
						<span ref="line01">What is written clearly is not worth much, <br /><br /></span>

						<span className={styles.line02} ref="line02">it's the transpa  rency <br /><br /></span>

						<span className={styles.line03} ref="line03">that c&nbsp;&nbsp;o <br /></span>
									<span className={styles.line04} ref="line04">u &nbsp;&nbsp; n &nbsp;ts<br /></span>
													<span className={styles.line05} ref="line05">.</span>
					</p>
				</blockquote>
				<div ref="wrapper" className={styles.wrapper}>

					<div className={classNameImg}>
						<img ref="image01" src="/assets/images/ballon01.jpg" role="presentation"/>
						<img ref="image02" src="/assets/images/ballon02.jpg" role="presentation"/>
						<img ref="image03" src="/assets/images/ballon03.jpg" role="presentation"/>
						<img ref="image04" src="/assets/images/ballon04.jpg" role="presentation"/>
					</div>

				</div>
			</div>

		);
	}
}

export default FeaturedProjects;
