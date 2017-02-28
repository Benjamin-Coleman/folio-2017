import React, { Component } from 'react';
import styles from './FeaturedProjects.module.css';
// import TweenMax from 'gsap';

class FeaturedProjects extends Component {

	componentDidMount(){

		// TweenMax.set(this.refs.mainTitle,{autoAlpha:0, y : 100});
		// TweenMax.to(this.refs.mainTitle,1, {autoAlpha:1, y : 0, delay: 0.5});
		
	}

	shouldComponentUpdate(){

		return true;	
	}

	componentWillUpdate() {
		console.log('componentWillUpdate');
		
	}
	
	componentDidUpdate(prevProps) {

		if(prevProps.hover.current_hovered_project !== this.props.hover.current_hovered_project){
			console.log('hover changed');
		}
	}

	render() {

		const classNameGrid = styles.featured_projects + " grid";
		const classNameImg = styles.featured_image + " grid__col-3";

		return (
			<div className={classNameGrid}>
                <header className="grid__col-3">
                    <h2>Featured <br /> Projects</h2>
                    {/*<h3>/014 - 017</h3>
                    <span className={styles.underline}></span>*/}
                </header>

				<div className={classNameImg}>
					<img src="/assets/images/featured_moon.jpg" role="presentation"/>
				</div>
			
				<blockquote className="grid__col-6">
					<p>
						Life is filigree work. <br />
						What is written clearly is not worth much, <br /><br /><br />

						it's the transparency <br /><br /><br /><br />


						that c  o <br />
									u n  ts<br />
												.
					</p>
				</blockquote>

			</div>
		);
	}
}

export default FeaturedProjects;
