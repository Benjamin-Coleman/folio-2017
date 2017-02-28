import React, { Component } from 'react';
import Face from './Face';
import styles from './About.module.css';
import GlobalStore from '../../base/globalStore';
import {getPositionStart} from '../../helpers/offset.js';
import {getPositionEnd} from '../../helpers/offset.js';

class About extends Component {
	constructor(props) {
		super(props);

        this.state = {
			active: false
		};

		this.edge = 0;

	}

	componentDidMount() {
		  
		this.bindEvents();

	}


	bindEvents(){
	
		GlobalStore.on('change:viewport', () => this.resize());
		GlobalStore.on('change:scroll', () => this.scrollUpdate());

	}

	scrollUpdate() {

		const scrollY = GlobalStore.get('scroll').currentY;
		const before = scrollY < this.top;
		const after = scrollY > this.bottom;

		// If we are before/after the first/`last frame, set the styles according first/last value.
		// if(before || after) {
        
        if(before || after) {

            // we are at firt or last and allready setStyle to reach initial/final Value
            if( (before && this.edge === -1) || (after && this.edge === 1)){
                // continue;
            } else {
                this.edge = before ? -1 : 1;
				this.setState({active: false});
                // DEFAULT STATE HERE
                console.log('before or after');
            }

		} else {

			if (!this.state.active) {
				this.edge = 0;
				this.setState({active: true});
			}
		}

	}

	render() {

		const classNameGrid = styles.section + " grid";
		const classNameContentWrapper = styles.content__wrapper + " grid__col-5";
		const classNameFaceWrapper = styles.face__wrapper + " grid__col-6";

		return (
			<section className={classNameGrid} ref="el">
				<div className={classNameFaceWrapper}>
					<Face active={this.state.active}/>
				</div>
				<div className={classNameContentWrapper}>
					<h2 className={styles.title}>Purpose & Form</h2>

					<div  className={styles.about__wrapper}>
						<h3 className={styles.about__dt}>About</h3>
						<p className={styles.about__dl}>Hi there, I am a creative developer and designer, I enjoy building beautiful and thoughtful experiences. I like to mix code surprising visuals and pleasing interactions. I take my work seriously but not myself.</p>
					</div>
					<div  className={styles.about__wrapper}>
						<h3 className={styles.about__dt}>Job</h3>
						<p className={styles.about__dl}>Currently working with good people and pushing pixels at <a href="https://www.stinkstudios.com" target="_blank">Stink Studios.</a></p>
					</div>
					<div  className={styles.about__wrapper}>
						<h3 className={styles.about__dt}>Education</h3>
						<p className={styles.about__dl}>Master degree in CS (Design, HCI, Engineering) from HETIC</p>
					</div>
					<div  className={styles.about__wrapper}>
						<h3 className={styles.about__dt}>Location</h3>
						<p className={styles.about__dl}>Currently based in Brooklyn USA originally from France.</p>
					</div>
					<div  className={styles.about__wrapper}>
						<h3 className={styles.about__dt}>Skills</h3>
						<p className={styles.about__dl}>Strong knowledge of HTML/CSS/JS, graceful degradation and progressive enhancement <br/>
						Creative coding : physics, 2D, 3D, motion<br/>
						Working within multidisciplinary teams with visual designers, motion designers and developers<br/>
						Producing neat, tested, readable and well documented code<br/>
						Building prototype concepts to demonstrate and test ideas</p>
					</div>
					<ul className={styles.links__list}>
						<li>
							<a className={styles.link} href="#">→  Email</a>
							<a className={styles.link} href="#">→  Github</a>
							<a className={styles.link} href="#">→  Twitter</a>
							<a className={styles.link} href="#">→  Dribbble</a>
							<a className={styles.link} href="#">→  Behance</a>
							<a className={styles.link} href="#">→  Instagram</a>
						</li>
					</ul>

					<img className={styles.image__background} src="/assets/images/about_moon.png" alt=""/>
				</div>
			</section>
		);
	}


    resize(){

		console.log('about resize');
		
        this.top = getPositionStart(this.refs.el, GlobalStore.get('viewport').height);
        this.bottom = getPositionEnd(this.refs.el, GlobalStore.get('viewport').height);
        
    }

}

export default About;
