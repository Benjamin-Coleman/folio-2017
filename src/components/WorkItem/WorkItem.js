/*global Power1 Power2 Power3 Power4*/

import React, { Component } from 'react';
import './WorkItem.css';
import ProgressBar from '../ProgressBar/ProgressBar'
import {TweenMax} from 'gsap';
import {TimelineMax} from 'gsap';
import ReactPlayer from 'react-player'
import GlobalStore from '../../base/globalStore';
import {getPositionStart, getPositionEnd} from '../../helpers/offset.js';

class WorkItem extends Component {

	constructor(props) {
		super(props);

        this.timer = null;

        this.state = {
			isHovered: false,
            url: null,
            videoCanPlay: false,
            hover: false,
            loop: false,
            progressPercent: 0,
            active: false,
            preActive: false
        };

        this.infoDisplayed = false;
        this.infoDisplayedCompleted = false;
        this.edge = 0;

	}

    componentDidMount(){

        // this.props.setProjectActive(this.props.data.id);

        this.el = this.refs.workItem;
        this.item = this.el.querySelector('.work-asset_wrapper');
        this.elDesc = this.el.querySelector('.desc-wrapper');
        this.elDescTitle = this.elDesc.querySelector('h2');
        this.elDescP = this.elDesc.querySelector('p');

        this.elSeason = this.el.querySelectorAll('.season');
        this.elVideo = this.el.querySelectorAll('video')[0];

        this.elBackground = this.el.querySelector('.work-background');
        this.elTitle = this.el.querySelector('.work-title');
        this.elTitleBack = this.el.querySelector('.title-back');
        this.elPLayer = this.el.querySelector('.video-player');
        this.elLinks = this.el.querySelector('.link-wrapper ul');

        // const url = "/assets/videos/loop.mp4";
        // this.setState({
        //     url
        // });

        this.setupDom();
        this.bindEvents();
    }

    bindEvents() {

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

        if(before || after) {

            // we are at firt or last and allready setStyle to reach initial/final Value
            if( (before && this.edge === -1) || (after && this.edge === 1)){
                // continue;
            } else {
                this.edge = before ? -1 : 1;
				this.setState({preActive: false});
				// this.setState({playing: false});
                this.onUnactive();
				console.log('STOP');
            }

		} else {

			if (!this.state.preActive) {
				this.edge = 0;
				this.setState({preActive: true});
				// this.setState({playing: true});
                this.onActive();
				console.log('PLAY');
                this.props.setProjectActive(this.props.data.id);
			}
		}

	}


    //here only Timeline stuu because we trigger this on resize.
    setupDom(){

        // this.resize();
        const halfHeight = this.item.offsetHeight / 2;

        // TweenMax.set(this.el, {scaleX: 0.9, scaleY: 0.9});
        TweenMax.set(this.refs.maskLeft, {x:'-100%'});
        TweenMax.set(this.refs.maskRight, {x:'100%'});
        TweenMax.set(this.refs.maskTop, {y:'-100%'});
        TweenMax.set(this.refs.maskBottom, {y:'100%'});
        TweenMax.set(this.elPLayer, {y:'50%'});
        TweenMax.set(this.elLinks, {y: -50 });

        // this.tlShowFocus = new TimelineMax({
        //     paused: true
        // });

        // this.tlShowFocus
		// 	.to(this.el, 1, {scaleX: 1, scaleY: 1, ease: Power2.easeInOut, transformOrigin:'100% 50%'}, 0)
		// 	.to(this.elDesc, .5, {y:-100}, 0)
		// 	.to(this.elSeason, .5, {y:0, force3D: 'auto', autoAlpha: 1, ease: Power3.easeOut}, .5)

        this.tlDisplayVideo = new TimelineMax({
            paused: true,
            onComplete: () => this.playVideo()
        });

        const distance = - halfHeight - 40;

        this.tlDisplayVideo
			.to(this.elBackground, 1.2, {y: '-100%', ease: Power2.easeInOut}, 0)
			.to(this.elPLayer, 1.2, {y: '0%', ease: Power2.easeInOut}, 0)
			.to(this.elTitle, 1, {y: distance, ease: Power2.easeInOut}, .2)
			.to(this.elTitleBack, 1, {y: distance, ease: Power2.easeInOut}, .2)
			.to(this.elLinks, 1, {y:0, ease: Power2.easeInOut}, .2);

    }

    disPlayInfo(e){

        e.preventDefault();

        if(!this.infoDisplayed){

            this.refs.infos.style.display = 'flex';
            this.refs.infos.style.opacity = 1;

            let infosStaggerEl = this.refs.infos.querySelectorAll('.stagger');

            TweenMax.set(this.refs.maskLeft, {x:'-100%'});
            TweenMax.set(this.refs.maskRight, {x:'100%'});
            TweenMax.set(this.refs.maskTop, {y:'-100%'});
            TweenMax.set(this.refs.maskBottom, {y:'100%'});
            TweenMax.set(infosStaggerEl, {x:40, autoAlpha:0});

            this.tlDisPlayInfo = new TimelineMax({
                paused: true,
                onComplete: () => { this.infoDisplayedCompleted = true}
            });

            const distance = this.item.offsetWidth * 0.375;
            const distanceTitle = this.item.offsetWidth * 0.0625;

            if(GlobalStore.config.isMobile){

                const distanceTitle = this.el.querySelector('.work-infos_wrapper').offsetHeight / 2 + 40;

                this.tlDisPlayInfo.to(this.refs.maskLeft, .8, {x:'0%', ease: Power2.easeInOut},0)
                    .to(this.refs.wrapper, 1, {x:-this.item.offsetWidth , ease: Power2.easeInOut},0)
                    .to(this.elTitleBack, 1, {y:-distanceTitle, ease: Power2.easeOut},.2)
                    .to(this.elDescTitle, 1, {x:-this.item.offsetWidth, ease: Power2.easeOut},.2)
                    .to(this.elDescP, 1, {x: -this.item.offsetWidth, ease: Power2.easeOut},.3)
                    .staggerTo(infosStaggerEl, 1 , {x:0, autoAlpha:1,ease: Power2.easeOut},.1 ,.3);

            } else {
                 this.tlDisPlayInfo.to(this.refs.maskLeft, .8, {x:'0%', ease: Power2.easeInOut},0)
                    .to(this.refs.maskRight, .8, {x:'0%', ease: Power2.easeInOut},0)
                    .to(this.refs.maskBottom, .8, {y:'0%', ease: Power2.easeInOut},0)
                    .to(this.refs.maskTop, .8, {y:'0%', ease: Power2.easeInOut},0)
                    .to(this.refs.wrapper, 1, {x:-distance , ease: Power2.easeInOut},0)
                    .to(this.elDescTitle, 1, {x:-distanceTitle, ease: Power2.easeOut},.2)
                    .to(this.elDescP, 1, {x:-distanceTitle, ease: Power2.easeOut},.3)
                    .to(this.elSeason, 1, {x:-40, autoAlpha:0, ease: Power2.easeIn}, 0)
                    .staggerTo(infosStaggerEl, 1 , {x:0, autoAlpha:1,ease: Power2.easeOut},.1 ,.475);
            }

            this.tlDisPlayInfo.play(0);

            this.infoDisplayed = true;

            // this.setState('infoDisplayed', true);

        } else {
            this.hideInfos();
        }

    }

    hideInfos(){

        if(this.infoDisplayed){
            this.tlDisPlayInfo.reverse();
            this.infoDisplayed = false;
            this.infoDisplayedCompleted = false;
        }

    }

    onActive(e) {

        if(this.timer){
            this.timer.kill();
            this.timer = null;
        } else {

            this.timer = TweenMax.delayedCall( .75, () => this.triggerActive());

        }

	}

    triggerActive(){
        console.log('triggerActive');
        this.timer.kill();
        this.timer = null;

        this.setState({active: true});
        this.tlDisplayVideo.play();
        // this.playVideo();

    }

    onUnactive() {

        if(this.timer){
            this.timer.kill();
            this.timer = null;
        } else {

            this.timer = TweenMax.delayedCall( .5, () => this.triggerUnactive());

        }

	}

    triggerUnactive() {

        this.timer.kill();
        this.timer = null;
        this.setState({active: false});
        this.tlDisplayVideo.tweenTo(0);
        this.hideInfos();
        this.pauseVideo();
    }

    // onMouseEnterHandler(e) {

    //     if(this.timer){
    //         this.timer.kill();
    //         this.timer = null;
    //     } else {

    //         //this.timer = TweenMax.delayedCall( .3, () => this.triggerMouseEnter());

    //     }

	// }

    // triggerMouseEnter(){

    //     this.timer.kill();
    //     this.timer = null;

    //     this.setState((prevState) => ({
    //         isHovered: !prevState.isHovered
    //     }));
	// 	this.props.actions.projectHovered('project01');

    //     this.tlShowFocus.play();

    //     this.playVideo();

    // }

	// onMouseLeaveHandler() {

    //     if(this.timer){
    //         this.timer.kill();
    //         this.timer = null;
    //     } else {

    //         //this.timer = TweenMax.delayedCall( .3, () => this.triggerMouseLeave());

    //     }

	// }

    // triggerMouseLeave() {

    //     this.timer.kill();
    //     this.timer = null;

    //     this.setState((prevState) => ({
    //         isHovered: !prevState.isHovered
    //     }));
    //     this.props.actions.projectOut();
    //     this.tlShowFocus.tweenTo(0);

    //     this.pauseVideo();
    // }


    playVideo(){

        const elVideo = this.player.player.player;
        if (elVideo) {
			this.setState({hover: true});
			if (!this.state.videoCanPlay) {
				// elVideo.addEventListener('canplay', () => {
				// 	this.onVideoCanPlay();
				// });
				// elVideo.load();
                this.setState({playing: true});
			} else {
				elVideo.play();
			}

		}

    }


    onVideoCanPlay(){

        console.log('onVideoCanPlay');
        // this.setState({videoCanPlay: true});
        // if (this.state.hover) this.setState({playing: true});

    }
    pauseVideo(){

        console.log('pauseVideo');
        this.setState({playing: false});

    }

    onProgress(e) {

        // console.log('e', e.played);
        // console.log('this.progressPercent', this.progressPercent);
        if(e.played) this.setState({progressPercent: e.played});

    }

    resize(){

		console.log('resize Video', this.halfHeight);
        // this.setupDom();

        const factorIn = .75;

        this.workAssetwidth = this.refs.workAsset.offsetWidth;
        this.workAssetHeight = this.refs.workAsset.offsetHeight;

        this.top = getPositionStart(this.item, GlobalStore.get('viewport').height) + this.workAssetHeight * factorIn;
        this.bottom = getPositionEnd(this.item, GlobalStore.get('viewport').height) - this.workAssetHeight * factorIn;


    }

    onVideoEnter() {

        if(this.infoDisplayedCompleted){
            TweenMax.to(this.refs.maskLeft, .8, {x:'-15%', ease: Power1.easeInOut},0)
            TweenMax.to(this.refs.maskRight, .8, {x:'15%', ease: Power1.easeInOut},0)
            TweenMax.to(this.refs.maskBottom, .8, {y:'20%', ease: Power1.easeInOut},0)
            TweenMax.to(this.refs.maskTop, .8, {y:'-20%', ease: Power1.easeInOut},0)
        }

    }

    onVideoLeave() {

        if(this.infoDisplayedCompleted){
            TweenMax.to(this.refs.maskLeft, .8, {x:'0%', ease: Power1.easeInOut},0)
            TweenMax.to(this.refs.maskRight, .8, {x:'0%', ease: Power1.easeInOut},0)
            TweenMax.to(this.refs.maskBottom, .8, {y:'0%', ease: Power1.easeInOut},0)
            TweenMax.to(this.refs.maskTop, .8, {y:'0%', ease: Power1.easeInOut},0)
        }
    }

    createMarkup() {
        const description = (this.props.data) ? this.props.data.description : '';
        return {__html: description};
    }

	render() {

        const {data} = this.props;
        const {
            playing, preload, loop, progressPercent
        } = this.state;

        const {
            isMobile
        } = GlobalStore.config;

        const percentGrid = Math.round(100 / 12 * 100) / 100;

        const justifyContent = data.align ? (data.align === 'top' ? 'flex-start' : 'flex-end') : 'center';
        const padding = data.align && (data.align === 'top' ? '5% 0 0 0' : '0 0 5% 0');

        let style = {
            marginRight: data.offsetRight * percentGrid + '%',
            marginLeft: data.offsetLeft * percentGrid + '%',
            justifyContent: justifyContent,
            padding: data.align ? padding : null
        };

        if(isMobile){
            style = {
                marginLeft: 0 + '%',
                marginRight: 2 + '%',
                justifyContent: 'center',
                padding: null
            };
        }

        const colNumber = isMobile ? 10 : data.col;
        let className = "work-item grid__col-" + colNumber +" "+ (data.smallTitle ? "small-title" : '');

        isMobile && (className += " grid__col--bleed");

		return (
            <div ref="workItem" className={className} style={style}>

                <div className="work-item_wrapper">

                    <p className="season">{data.season}</p>
                    <div ref="workAsset" className="work-asset">

                        <div className="title-back"><h2>{data.symbol}</h2></div>
                        <div ref="wrapper" className="work-asset_wrapper" onClick={() => this.hideInfos()}>

                            {!GlobalStore.config.isMobile &&
                                <ProgressBar parentWidth={this.workAssetwidth} parentHeight={this.workAssetHeight} playing={playing} progress={progressPercent}/>
                            }

                            <ReactPlayer
                                ref={(player => { this.player = player })}
                                className='video-player'
                                url={data.videoSourceMP4}
                                playing={playing}
                                preload={preload}
                                loop={true}
                                muted={true}
                                onProgress={(e) => this.onProgress(e)}
                            />
                            {/*<div className="title-wrapper"><h3>{data.symbol}</h3></div>*/}
                            <div className="work-title"><h2>{data.symbol}</h2></div>
                            <div className="work-background"></div>
                            <div ref="maskLeft" className="work-mask left"></div>
                            <div ref="maskRight" className="work-mask right"></div>
                            <div ref="maskTop" className="work-mask top"></div>
                            <div ref="maskBottom" className="work-mask bottom"></div>
                            <div ref="maskClickArea" className="work-mask_click"
                                onMouseEnter={() => this.onVideoEnter() }
                                onMouseLeave={() => this.onVideoLeave() }
                            ></div>
                        </div>
                        <div ref="infos" className="work-infos grid__col-6">
                            <div className="work-infos_wrapper">
                                <p className="infos-description stagger" dangerouslySetInnerHTML={this.createMarkup()}></p>
                                <ul>
                                    {data.agency &&
                                        <li className="stagger">
                                            <p className="info-title">Agency ¬</p>
                                            <p>{data.agency}</p>
                                        </li>
                                    }
                                    {data.dev &&
                                        <li className="stagger">
                                            <p className="info-title">Dev stack ¬</p>
                                            <p>{data.dev}</p>
                                        </li>
                                    }
                                    {data.awards &&
                                        <li className="stagger">
                                            <p className="info-title">Awards ¬</p>
                                            <p>{data.awards}</p>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="link-wrapper">
                            <ul>
                                <li><a href="#" onClick={(e) => this.disPlayInfo(e)}>Infos ¬</a></li>
                                {data.link &&
                                    <li><a href={data.link.url} target="_blank">{data.link.label}</a></li>
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="work-desc">
                        <div className="desc-wrapper">
                            <h2>{data.brand}</h2>
                            <p>{data.role}</p>
                        </div>
                        {/*<h4>{data.id}</h4>*/}
                    </div>
                </div>
            </div>
		);
	}
}

export default WorkItem;
