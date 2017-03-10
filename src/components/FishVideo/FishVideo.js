/*global TimelineLite Power1 Power2 TweenLite Power3 Power4 */

import React, { Component } from 'react';
import {TweenMax} from 'gsap';
import styles from './FishVideo.module.css';

import Stats from '@jordandelcros/stats-js';
import GlobalStore from '../../base/globalStore';
import {getPositionStart} from '../../helpers/offset.js';
import {getPositionEnd} from '../../helpers/offset.js';
// import Smooth from '../../vendors/smooth';

import * as PIXI from 'pixi.js';
// import filters from 'pixi-filters';

// var filters = {
//     DistortFilter: require('./Filter/crosshatch/CrossHatchFilter'),
//     BloomFilter: require('./Filter/bloom/BloomFilter')
// }

var customFilters = {
    DotFilter: require('./Filter/dot/DotFilter'),
    DistortFilter: require('./Filter/distort/DistortFilter'),
    ShockwaveFilter: require('./Filter/shockwave/ShockwaveFilter')
};

Object.assign(PIXI.filters, customFilters);

class FishVideo extends Component {

    constructor(props){

        super(props);

        this.edge = 0;
        this.active = false;

        this.easedScroll = 0;
		this.scroll = 0;
		this.scrollY = 0;
		this.animatedElmts = [];

		this.documentHeight = -1;
        this.windowHeight = 0;
    }

	componentDidMount(){

        this.setupScene();
        this.resize();
        this.setTimeLines();

        // this.smooth = new Smooth({ smoothContainer: false });
		// // this.smoothElements = [];
		// this.smooth.init();

        // const heightRation = GlobalStore.get('viewport').height;
        // const thirdRatio = heightRation / 3;

		// let element = {
		// 	el: this.refs.thanks01,
		// 	animations: [{
		// 		transform: [

		// 			{
		// 				start: this.top,
		// 				end: this.top + thirdRatio,
		// 				initialValue: 300,
		// 				finalValue: 0,
		// 				transformType: 'translate3d',
		// 				axis: 'y',
		// 				ease: 0.1
		// 			}
		// 		]

		// 	},
        //     {
        //         start: this.top + thirdRatio * 5,
		// 		end: this.top + thirdRatio * 6,
        //         initialValue : 1,
        //         finalValue : 0.05,
        //         property : 'opacity',
        //         ease : 0.1
        //     },
        //     {
        //         start: this.top,
		// 		end: this.top + thirdRatio,
        //         initialValue : 0,
        //         finalValue : 1,
        //         property : 'opacity',
        //         ease : 0.1
        //     }
        //     ]
		// };

		// let element02 = {
		// 	el: this.refs.thanks02,
		// 	animations: [{
		// 		transform: [

		// 			{
		// 				start: this.top + thirdRatio,
		// 				end: this.top + thirdRatio * 2,
		// 				initialValue: 300,
		// 				finalValue: 0,
		// 				transformType: 'translate3d',
		// 				axis: 'y',
		// 				ease: 0.1
		// 			}
		// 		]

		// 	},
        //     {
        //         start: this.top + thirdRatio * 5,
		// 		end: this.top + thirdRatio * 6,
        //         initialValue : 1,
        //         finalValue : 0.05,
        //         property : 'opacity',
        //         ease : 0.1
        //     },
        //     {
        //         start: this.top + thirdRatio,
		// 		end: this.top + thirdRatio * 2,
        //         initialValue : 0,
        //         finalValue : 1,
        //         property : 'opacity',
        //         ease : 0.1
        //     }
        //     ]
		// };

		// let element03 = {
		// 	el: this.refs.thanks03,
		// 	animations: [{
		// 		transform: [

		// 			{
		// 				start: this.top + thirdRatio,
		// 				end: this.top + thirdRatio * 3,
		// 				initialValue: 300,
		// 				finalValue: 0,
		// 				transformType: 'translate3d',
		// 				axis: 'y',
		// 				ease: 0.1
		// 			}
		// 		]
		// 	},
        //     {
        //         start: this.top + thirdRatio * 5,
		// 		end: this.top + thirdRatio * 6,
        //         initialValue : 1,
        //         finalValue : 0.05,
        //         property : 'opacity',
        //         ease : 0.1
        //     },
        //     {
        //         start: this.top + thirdRatio,
		// 		end: this.top + thirdRatio * 3,
        //         initialValue : 0,
        //         finalValue : 1,
        //         property : 'opacity',
        //         ease : 0.1
        //     }
        //     ]
		// };

        // let elementLuck = {
		// 	el: this.refs.luck,
		// 	animations: [
        //         {
		// 		transform: [

		// 			{
		// 				start: this.top + heightRation + thirdRatio,
		// 				end: this.top + heightRation + thirdRatio * 2,
		// 				initialValue: 300,
		// 				finalValue: 0,
		// 				transformType: 'translate3d',
		// 				axis: 'x',
		// 				ease: 0.1
		// 			},
        //             {
		// 				start: this.top + heightRation + thirdRatio  * 6,
		// 				end: this.top + heightRation + thirdRatio  * 9,
		// 				initialValue: 0,
		// 				finalValue: -600,
		// 				transformType: 'translate3d',
		// 				axis: 'y',
		// 				ease: 0.1
		// 			},
        //             {
		// 				start: this.top + heightRation + thirdRatio  * 6,
		// 				end: this.top + heightRation + thirdRatio  * 12,
		// 				initialValue: 0,
		// 				finalValue: 720,
		// 				transformType: 'rotate3d',
        //                 axis: 'both',
		// 				ease: 0.1
		// 			}
		// 		]

		// 	},
        //     {
        //         start: this.top + heightRation + thirdRatio,
		// 		end: this.top + heightRation + thirdRatio * 2,
        //         initialValue : 0,
        //         finalValue : 1,
        //         property : 'opacity',
        //         ease : 0.1
        //     }
        //     ]
		// };
        // let elementCanvas = {
		// 	el: this.refs.canvasContainer,
		// 	animations: [

        //         {
        //             start: this.top + heightRation * 2,
        //             end: this.top + heightRation * 2 + thirdRatio,
        //             initialValue : 0,
        //             finalValue : 1,
        //             property : 'opacity',
        //             ease : 0.1
        //         }
        //     ]
		// };

		// this.smooth.addElement(element);
		// this.smooth.addElement(element02);
		// this.smooth.addElement(element03);
		// this.smooth.addElement(elementLuck);
		// this.smooth.addElement(elementCanvas);
		// this.smooth.start();



	}

    setTimeLines() {

		this.mainTL && delete this.mainTL;

		// this.animatedElmts = [this.$bg[0]];
		this.mainTL = new TimelineLite();
		this.mainTL.stop();

		var timeline = new TimelineLite();

		var thanks01 = this.refs.thanks01;
		var thanks02 = this.refs.thanks02;
		var thanks03 = this.refs.thanks03;

		var luck = this.refs.luck;
        var canvasContainer = this.refs.canvasContainer;

		const delayBallon = 1.7;
		const durationLetters = 6;
		const delayLetters = 4.5;

        const halfHeight = this.windowHeight / 2;

		timeline

		.from(thanks01, 1, {
			y: halfHeight,
            opacity:0,
			ease: Power4.easeOut
		}, 0)

		.from(thanks02, 1, {
			y: halfHeight,
            opacity:0,
			ease: Power4.easeOut
		}, .1)

        .from(thanks03, 1, {
			y: halfHeight,
            opacity:0,
			ease: Power4.easeOut
		}, .2)

        .from(luck, 1, {
			x: 300,
            opacity:0,
			ease: Power4.easeOut
		}, 1)

        .to(thanks01, 1, {
			opacity: 0.05,
			ease: Power1.easeInOut
		}, 1)

		.to(thanks02, 1, {
			opacity: 0.05,
			ease: Power1.easeInOut
		}, 1)

        .to(thanks03, 1, {
			opacity: 0.05,
			ease: Power1.easeInOut
		}, 1)

        .from(canvasContainer, 1, {
			opacity: 0,
			ease: Power1.easeInOut
		}, 1)
        .to(this.distortFilter,2,{
            amplitude: 9.0,
			ease: Power3.easeInOut
        })

		this.mainTL.add(timeline, 0);
		// this.animatedElmts.push(a, m, g, _, y);

	}

    setupScene(){

        // this.stats = new Stats(false);
        // document.body.appendChild(this.stats.domElement);

        //Create the renderer
        this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight,{
            transparent: true
        });

        //Add the canvas to the HTML document
        this.refs.canvasContainer.appendChild(this.renderer.view);

        //Create a container object called the `stage`
        this.stage = new PIXI.Container();

        //Tell the `renderer` to `render` the `stage`
        this.renderer.render(this.stage);

        this.container = new PIXI.Container();

        this.catSetup();
        //this.videoSetup();
    }

    catSetup(){

        var texture = PIXI.Texture.fromImage('../assets/images/maneki.jpg');
        texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        texture.baseTexture.mipmap=false;

        // create a new Sprite using the video texture (yes it's that easy)
        var catSprite = new PIXI.Sprite(texture);

        catSprite.position.set(window.innerWidth / 2, window.innerHeight / 2);
        catSprite.anchor.set(0.5);
        catSprite.scale.set(.5, .5);

        // this.ShockwaveFilter = new filtersTest.ShockwaveFilter();

        this.DotFilter = new customFilters.DotFilter();
        this.distortFilter = new customFilters.DistortFilter();

        this.distortFilter.time = 0.0;
        this.distortFilter.amplitude = 50;
        this.distortFilter.res = { x: window.innerWidth, y: window.innerHeight};
        this.distortFilter.noiseTexture = PIXI.Texture.fromImage('../assets/images/noise.png');

        // this.distortFilter.resolutionX = window.innerWidth;
        // this.distortFilter.resolutionY = window.innerHeight;

        this.container.filters = [this.distortFilter];

        this.container.addChild(catSprite);
        this.stage.addChild(this.container);


        this.bindEvents();

    }

    videoSetup(){


        this.displacementSprite = PIXI.Sprite.fromImage('../assets/images/map.jpg');
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

        this.displacementSpriteVideo = PIXI.Sprite.fromImage('../assets/images/displacement_map_blurred.png');
        this.displacementFilterVideo = new PIXI.filters.DisplacementFilter(this.displacementSpriteVideo);
        this.displacementSpriteVideo.scale.set(5);
        this.displacementSpriteVideo.position.set(window.innerWidth / 2, window.innerHeight / 2);

        this.displacementFilterVideo.scale.x = 10000;
        this.displacementFilterVideo.scale.y = 10000;
        this.displacementSpriteVideo.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
        this.displacementSpriteVideo.anchor.set(0.5);

        TweenMax.to(this.displacementFilterVideo.scale, 1, { x: 0, y: 0, delay:2, ease: Power2.easeOut});

        this.displacementFilter.scale.x = 100;
        this.displacementFilter.scale.y = 100;

        this.displacementSprite.position.x = 0;
        this.displacementSprite.position.y = 0;
        // TweenMax.to(this.displacementSprite.position , 10, { x: 800, y: 400});

        this.stage.addChild(this.container);
        this.stage.addChild(this.displacementSprite);
        this.stage.addChild(this.displacementSpriteVideo);

        // this.loop = 10000;
        this.loop = 0;

        // this.BloomFilter = new filters.BloomFilter();
        // this.container.filters = [this.BloomFilter];

        // this.TiltShiftFilter = new filters.TiltShiftFilter();

        // this.BloomFilter = new filters.BloomFilter();
        // this.BloomFilter.blur = 1;

        // this.TwistFilter = new filters.TwistFilter();
        this.TwistFilter.radius = 300;
        this.TwistFilter.angle = 5;
        this.TwistFilter.offset = new PIXI.Point(window.innerWidth / 2, window.innerHeight / 2);
        // this.container.filters = [this.TiltShiftFilter];
        // TweenMax.to(this.TwistFilter, 3, { angle: 1.2, radius: 300, delay:5, ease: Power2.easeOut});

        TweenMax.to(this.TwistFilter.offset, 10, {yoyo: -1, x: 800, y: 400});

        // this.ShockwaveFilter = new filters.ShockwaveFilter();
        this.ShockwaveFilter.time = 0;
        this.ShockwaveFilter.center = [0.5,0.5];

        this.distortFilter = new customFilters.DistortFilter();

        this.distortFilter.time = 0;
        this.distortFilter.res = { x: window.innerWidth, y: window.innerHeight};

        // this.container.filters = [this.distortFilter];

        // this.container.filters = [this.TwistFilter];

        this.bindEvents();
        this.playVideo();

    }

    bindEvents(){
        console.log('bindEvents');

        this.update = (e) => this.rafUpdate(e);
        GlobalStore.get('rafCallStack').push(this.update);
        GlobalStore.on('change:viewport', () => this.resize());
        GlobalStore.on('change:scroll', () => this.scrollUpdate());

    }

    scrollUpdate() {


		const scrollY = GlobalStore.get('scroll').currentY;
		const before = scrollY < this.top;
		// const after = scrollY > this.bottom;

        if(scrollY <= this.bottom && scrollY >= this.top) {

			if (scrollY !== this.scrollY) {

				this.scroll = (scrollY - this.top) / this.height;
                console.log('this.scroll', this.scroll);

				this.scrollTween = new TweenLite(this, 1, {
					easedScroll: this.scroll,
					ease: Power3.easeOut,
					onUpdate: () => this.updateScroll()
				});

				this.scrollY = scrollY;
			}

		}


		// If we are before/after the first/`last frame, set the styles according first/last value.
		// if(before || after) {
        if(before) {

            // we are at firt or last and allready setStyle to reach initial/final Value
            if( (before && this.edge === -1)){
                // continue;
            } else {
                this.edge = before ? -1 : 1;
                this.active = false;
                // DEFAULT STATE HERE
                console.log('before or after');
                this.refs.wrapper.style.position = 'absolute';
                this.refs.wrapper.style.top = (this.edge === -1) ? '0px' : this.refs.el.offsetHeight - GlobalStore.get('viewport').height + 'px';
            }

		} else {

			if (!this.active) {
				this.edge = 0;
				this.active = true;
				// SHOW HERE
				console.log('active !!!');
                this.refs.wrapper.style.position = 'fixed';
				this.refs.wrapper.style.top = '0px';
			}
		}

	}

    updateScroll() {

		this.mainTL.progress(this.easedScroll);

	}

    playVideo(){
        PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;

        // create a video texture from a path
        var texture = PIXI.Texture.fromVideo('../assets/videos/fish_trim.mp4');
        texture.baseTexture.wrapMode=PIXI.WRAP_MODES.REPEAT;
        texture.baseTexture.mipmap = false;

        // create a new Sprite using the video texture (yes it's that easy)
        var videoSprite = new PIXI.Sprite(texture);
        // Stetch the fullscreen
        // videoSprite.width = this.renderer.width;
        // videoSprite.height = this.renderer.height;
        videoSprite.position.set(window.innerWidth / 2, window.innerHeight / 2);
        videoSprite.anchor.set(0.5);
        videoSprite.scale.set(.6, .6);

        // videoSprite.filters=[ this.displacementFilterVideo];

        this.container.addChild(videoSprite);

    }

    rafUpdate(){

        // this.stats.begin();

        if(this.active){
            this.loop +=1;

            // this.displacementFilter.scale.x = Math.cos(this.loop) * 3000;
            // this.displacementFilter.scale.y = Math.cos(this.loop) * 3000;
            // this.displacementSprite.y = this.loop;
            this.renderer.render(this.stage);

            if(this.displacementSpriteVideo ){

                // this.displacementSpriteVideo.x += this.loop/100;
                this.displacementSpriteVideo.y += this.loop/100;

            }

             if (this.ShockwaveFilter) {
                this.ShockwaveFilter.time += 0.01;
                if (this.ShockwaveFilter.time >= 1) {
                    this.ShockwaveFilter.time = 0;
                }
            }

            if (this.distortFilter) {
                this.distortFilter.time += 0.01;
            }

        }

        // this.stats.end();

    }

    resize(){

        this.documentHeight = this.refs.el.offsetHeight;

        this.top = getPositionStart(this.refs.el, GlobalStore.get('viewport').height) + GlobalStore.get('viewport').height;;
        this.bottom = getPositionEnd(this.refs.el, GlobalStore.get('viewport').height);

        // it's more the distance to scroll
		this.height = this.documentHeight - GlobalStore.get('viewport').height;

        console.log('this.top', this.top);
        console.log('this.height', this.height);
        console.log('this.documentHeight', this.documentHeight);


        this.windowHeight = window.innerHeight;

    }

	render() {
		return (
            <div ref="el" className={styles.section}>
                <div ref="wrapper" className={styles.thanks_wrapper}>
                    <div className={styles.thank_wrapper01}>
                        <h3 ref="thanks01" className={styles.thanks +' '+ styles.thanks01}>Thanks you</h3>
                    </div>
                    <div className={styles.thank_wrapper02}>
                        <h3 ref="thanks02" className={styles.thanks}>for</h3>
                    </div>
                    <div className={styles.thank_wrapper03}>
                        <h3 ref="thanks03" className={styles.thanks}>your time!</h3>
                    </div>
                    <div className={styles.luck_wrapper}>
                        <h4 ref="luck" className={styles.luck}>I wish you a pleasant and lucky day.</h4>
                    </div>
                    <div ref="canvasContainer" className={styles.canvasContainer}></div>
                </div>
			</div>
		);
	}
}

export default FishVideo;
