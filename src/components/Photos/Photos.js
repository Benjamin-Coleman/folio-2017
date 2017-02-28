import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from "react-redux"
import * as actions from "../../actions/photosActions.js"
import styles from './Photos.module.css';
import GlobalStore from '../../base/globalStore';
import data from './Photos.json';
// import LazyLoad from 'react-lazyload';
// import { forceCheck } from 'react-lazyload';
import LazyImage from './LazyImage'


class Photos extends Component {

    static propTypes = {
	    actions: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
        this.props.actions.fetchPhotosData(data);
        this.state = {
            backgroundColor: "#fff"
        }
	}

	componentDidMount() {

		this.bindEvents();

	}


	bindEvents(){

		GlobalStore.on('change:viewport', () => this.resize());

	}

    onContentVisible(){
        console.log('--------------------- onContentVisible');

    }

    onLoaded() {

        console.log('onLOADEd');

    }

    renderPhoto() {

        const currentPhoto = (this.props.photos) ? this.props.photos[this.props.currentIndex] : null;
        console.log('currentPhoto', currentPhoto);

        if(!currentPhoto){
            return <i>Nothing here</i>;
        }

         return currentPhoto.sections.map((element, index) => {
            const colStyles = element.colStyles;
            const colClass = element.colClass;

            if(element.type === 'text'){

                const styles = element.styles;

                // i didn't find any way to handle dynamic event so here we are with a loop....
                if(element.indexClick){
                    return (
                        <div key={index} className={colClass} style={colStyles} onClick={() => this.props.actions.setIndexPhoto(element.indexClick)}>
                            <p style={styles} dangerouslySetInnerHTML={{__html: element.value}}></p>
                        </div>
                    )
                }

                return (
                    <div key={index} className={colClass} style={colStyles}>
                        <p style={styles} dangerouslySetInnerHTML={{__html: element.value}}></p>
                    </div>
                );
            }

            if(element.type === 'image'){

                return (
                    <div key={index} className={colClass} style={colStyles}>
                        <LazyImage src={element.src} onLoaded={this.onLoaded} width={element.width} height={element.height}/>
                    </div>
                );

            }

             if(element.type === 'background'){

                // const styles = element.styles;

                return (
                    <div key={index} className={colClass} style={colStyles}>
                        <LazyImage src={element.src} onLoaded={this.onLoaded}/>
                    </div>
                );

            }

         });

    }

	render() {

		const classNameGrid = styles.photos__wrapper + " grid";

        const content = this.renderPhoto();
        const background = (this.props.photos && this.props.photos[this.props.currentIndex] && this.props.photos[this.props.currentIndex].background) ? this.props.photos[this.props.currentIndex].background : '#fff';
        const style = {
            "backgroundColor": background
        }

        return (
			<section className={styles.section} ref="el">
                <div className={classNameGrid}>
                    {content}
                </div>
                <span style={style} className={styles.background} onClick={this.props.actions.incrementIndexPhoto}></span>
			</section>
		);
	}


    resize(){

		console.log('Photo resize');

    }

}

const mapStateToProps = state => ({
	photos: state.photos.photos,
    currentIndex: state.photos.currentIndex
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch)
})

// export default Works;
export default connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{ withRef: true }
)(Photos)