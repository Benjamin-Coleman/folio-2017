/* global Power2 TweenLite TimelineMax Expo*/

import React, { Component } from 'react';
import styles from './IntroMotion.module.css';
import { TweenMax } from 'gsap';
// import Typist from 'react-typist';
import GlobalStore from '../../base/globalStore';
import {Lethargy} from 'lethargy';
import MorphSVGPlugin from './../Intro/MorphSVGPlugin';

class Intro extends Component {

    constructor(props) {
        super(props);

        this.state = {
            introShown: false
        };
        this.handlers = {};
        this.edge = 0;

    }

    componentDidMount() {

        //Global block scroll
        document.body.style.position = "fixed";
        document.body.style.overflowY = "scroll";
        document.body.style.width = "100%";

        //Event to catch scroll and skip intro
        console.log('Lethargy', Lethargy);

        this.lethargy = new Lethargy();

        this.handlers.onMouseWeel = (e) => {this.onMouseWeel(e)};


        this.bindEvents();

        //create rotating text

        const spannedText = this.createLetterSpan(this.refs.circleText.textContent, 'circle-letter');
        this.refs.circleText.innerHTML = spannedText;
        this.setTextRotation();

        this.title = this.refs.mainTitle;
        const spannedTitleText = this.createLetterSpan(this.title.textContent, 'letter');
        this.title.innerHTML = spannedTitleText;

        this.setupDom();
        // SVG morph
        MorphSVGPlugin.convertToPath(this.refs.el.querySelectorAll('.shape_face'));
        MorphSVGPlugin.convertToPath(this.refs.el.querySelectorAll('.letter_svg'));
        setTimeout(() => {
            this.initTL();
            this.tlIntro.play(0);
        }, 0);
        
        // this.onIntroHidden();

    }

    bindEvents() {

        GlobalStore.on('change:viewport', () => this.resize());
        // GlobalStore.on('change:scroll', () => this.scrollUpdate());

        document.body.addEventListener('mousewheel', this.handlers.onMouseWeel);
        document.body.addEventListener('DOMMouseScroll', this.handlers.onMouseWeel);
        document.body.addEventListener('wheel', this.handlers.onMouseWeel);
        document.body.addEventListener('MozMousePixelScroll', this.handlers.onMouseWeel);

    }

    onMouseWeel(e) {
        console.log('e', e);

        e.preventDefault()
        e.stopPropagation();
        if(this.lethargy.check(e) !== false) {
            // Do something with the scroll event
            console.log('USER SCROLL');
            this.onIntroHidden();
        }

    }

    unBindLethargyEvents() {

        document.body.removeEventListener('mousewheel', this.handlers.onMouseWeel);
        document.body.removeEventListener('DOMMouseScroll', this.handlers.onMouseWeel);
        document.body.removeEventListener('wheel', this.handlers.onMouseWeel);
        document.body.removeEventListener('MozMousePixelScroll', this.handlers.onMouseWeel);

    }

    setupDom() {

        // TweenMax.set(this.refs.link_underline, { x: -120 });
        // TweenMax.set(this.refs.contact_copy, { x: '100%' });
        // TweenMax.set(this.refs.contact_or, { x: '100%' });
        // TweenMax.set(this.refs.contact_link, { x: '100%' });

    }

    initTL() {

        this.tlIntro = new TimelineMax({
			paused: true,
			onComplete: () => {
                this.onIntroHidden();
			}
		});


        // get random letters from title

        let letters = this.refs.mainTitle.childNodes;

        /**
         * Randomize array element order in-place.
         * Using Durstenfeld shuffle algorithm.
         */
        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }

            return array;
        }

        let randomLetters = shuffleArray([].slice.call(letters));
        const length = Math.floor(randomLetters.length / 3);

        let randomLettersThirdOne = randomLetters.splice(0, length + 1);
        let randomLettersThirdTwo = randomLetters.splice(0, length);
        let randomLettersThirdThree = randomLetters.splice(0, length);

        console.log('randomLettersThirdOne', randomLettersThirdOne);
        console.log('randomLettersThirdTwo', randomLettersThirdTwo);
        console.log('randomLettersThirdThree', randomLettersThirdThree);

        let faceElements = this.refs.mainSvg.querySelectorAll('.shape_face');

        const initialDelay = .5;

        let t = this.refs.el.querySelectorAll('.t');
        let i = this.refs.el.querySelectorAll('.i');
        let m = this.refs.el.querySelectorAll('.m');

		this.tlIntro
            .set(this.refs.wrapper, 
				{autoAlpha: 1})
            .fromTo(t, 1,
				{y: 100, skewY: 50, autoAlpha: 0},
				{y: 0, skewY: 0, autoAlpha: 1, ease: Power2.easeOut}, initialDelay)
            .fromTo(i, 1,
				{y: -100, skewY: 50, autoAlpha: 0},
				{y: 0, skewY: 0, autoAlpha: 1, ease: Power2.easeOut}, initialDelay)
            .fromTo(m, 1,
				{y: 100, skewY: 50, autoAlpha: 0},
				{y: 0, skewY: 0, autoAlpha: 1, ease: Power2.easeOut}, initialDelay)
            
			.to(this.refs.circle, 1,
				{strokeDashoffset: 0 , ease: Power2.easeInOut}, initialDelay + 0.75 )


            //FACE
            .to(this.refs.el.querySelector('.t'), .5, { morphSVG: this.refs.el.querySelector('.eye01'), ease: Power2.easeOut }, initialDelay + 1.5)
            .to(this.refs.el.querySelector('.m'), .3, { morphSVG: this.refs.el.querySelector('.eye02'), ease: Power2.easeOut }, initialDelay + 1.5)
            .to(this.refs.el.querySelector('.i'), .5, { morphSVG: this.refs.el.querySelector('.mouth'), ease: Power2.easeOut }, initialDelay + 1.5)
            .to(this.refs.el.querySelector('.i'), .5, { morphSVG: this.refs.el.querySelector('.smile_up'), ease: Power2.easeOut }, initialDelay + 2.5)

            .to(this.refs.circle, .1,
				{opacity: 0}, initialDelay + 2.7)

            .fromTo(this.refs.circleText, .1,
				{opacity: 0},
				{opacity: 1, ease: Expo.easeOut}, initialDelay + 2.8)

            
            // .to(this.refs.type, .1,
			// 	{opacity: 0}, initialDelay + 3)

            .to(this.refs.circleText, .1,
				{opacity: 0, ease: Expo.easeOut}, initialDelay + 3.15)
            .to(this.refs.circleText, .1,
				{opacity: 1, ease: Expo.easeOut}, initialDelay + 3.3)

            .to(this.refs.circleText, 2,
				{rotation: -40, transformOrigin: '70px 70px', force3D:true}, initialDelay + 3)

            // .to(this.refs.circleText, .1,
			// 	{opacity: 0}, initialDelay + 6)

            // //FACE
            // .fromTo(faceElements, .2,
            //     {opacity: 0},
            //     {opacity: 1, ease: Expo.easeOut}, initialDelay + 6.1)

            // .to(this.refs.circleText, .1,
			// 	{opacity: 1}, initialDelay + 6.5)

            .fromTo(randomLettersThirdOne, .8,
				{y: 100, skewY: 50, opacity: 0},
				{y: 0, skewY: 0, opacity: 1, ease: Power2.easeOut}, initialDelay + 4)
            .fromTo(randomLettersThirdTwo, .8,
				{y: -100, skewY: -50, opacity: 0},
				{y: 0, skewY: 0, opacity: 1, ease: Power2.easeOut}, initialDelay + 4.1)
            .fromTo(randomLettersThirdThree, .8,
				{y: 100, skewY: 50, opacity: 0},
				{y: 0, skewY: 0, opacity: 1, ease: Power2.easeOut}, initialDelay + 4.2)

    }

    onIntroHidden() {

        this.unBindLethargyEvents();
        this.setState({ introShown: true });

        TweenLite.to(this.refs.el, .75, { ease: Power2.easeOut, clip:"rect(" + GlobalStore.get('viewport').height + " "+ GlobalStore.get('viewport').width +" " + GlobalStore.get('viewport').height + " 0px)"
            , onComplete: () => {
                // put scroll back on
                document.body.style.position = "static";
                document.body.style.overflowY = "auto";
            }
        });

    }

    setTextRotation(){

        let letters = this.refs.circleText.childNodes;

        const startRotation = -90;
        const rotation =  360 / letters.length;

        for (var index = 0; index < letters.length; index++) {
            var element = letters[index];
            TweenMax.set(element,{rotation: startRotation + rotation * index });
        }

    }

     createLetterSpan(text, classParam) {

        var characters = text.split('<br>').join('£').split('&amp;').join('±').split('');

        //var spans = [];
        //var word = $('<span class="word"/>');
        //spans.push(word);

        var content = '';
        for (var i = 0; i < characters.length; i++) {

            if (characters[i] === " " || characters[i] === "£") {

                if (characters[i] === "£") content += '<span class="return"/>'; //spans.push($('<span class="return"/>'));
                else content += '<span class="space">' + characters[i] + '</span>'; //spans.push($('<span class="space">' + characters[i] + '</span>'));
                //word = $('<span class="word"/>');
                //spans.push(word);


            } else {

                var ch = characters[i];
                if (ch === "±") ch = "&amp;";

                content += '<span class="'+ classParam +'">' + ch + '</span>';
                //word.append('<span class="letter">' + ch + '</span>')

            }

        }

        return content;
    }

    resize() {

        if (!this.state.introShown) {
            TweenLite.set(this.refs.el, {clip:"rect(0px "+ GlobalStore.get('viewport').width +" "+ GlobalStore.get('viewport').height + "px "+  +" 0px)", paused:true});
        }

    }

    render() {

        const backgroundSvg = styles.background_svg + " background_s";
        const letterSvgT = styles.letter_svg + " letter_svg t ";
        const letterSvgI = styles.letter_svg + " letter_svg i ";
        const letterSvgM = styles.letter_svg + " letter_svg m ";
        const letterSvgEye1 = styles.eyes_svg + " eyes eye01 shape_face";
        const letterSvgEye2 = styles.eyes_svg + " eyes eye02 shape_face";
        const letterSvgMouth = styles.mouth_svg + " mouth shape_face";
        const letterSvgMouthUp = styles.smile_svg + " smile_up";
        const letterSvgMouthDown = styles.smile_svg + " smile_down";

        const title = GlobalStore.config.isMobile ? 'Tim Roussilhe' : 'Timothée Roussilhe'

        return (

            <div className={ styles.introduction__motion } ref="el">

                <div className={ styles.introduction__motion__wrapper } ref="wrapper">

                    <h1 ref="mainTitle" className={ styles.title } >{title}</h1>
                    {/*<h2 className={ styles.subtitle } >Creative Developer </h2>*/}

                    <div className={ styles.circle_wrapper } ref="circle_wrapper">

                        {/*<span ref="type" className={ styles.type_wrapper }>
                            <Typist  startDelay={2000} avgTypingDelay={30}>
                                Dear Visitors,
                            </Typist>
                        </span>*/}

                        <h2 className={styles.circleText} ref="circleText" >Oh my!  Portfolio 2017  </h2>

                        {/*<svg ref="mainSvg" className={ styles.logo_svg }version="1.1" id="logo"x="0px"y="0px" viewBox="0 0 150 150" >
                            <circle ref="circle" className={ backgroundSvg } cx="75" cy="75" r="70" / >
                            <polygon ref="t" className={ letterSvgT } points="34.3,37 40.9,37 40.9,38.4 38.4,38.4 38.4,45.5 36.8,45.5 36.8,38.4 34.3,38.4 " />
                            <rect ref="i" x="52.4" y="68" className={ letterSvgI } width="1.6"  height="8.5" / >
                            <polygon ref="m" className={ letterSvgM } points="71.2,45.5 73.2,45.5 75.5,51.5 77.7,45.5 79.7,45.5 79.7,54 78.2,54 78.2,47.9 76,53.9 74.8,53.9
    72.7, 47.9 72.7, 54 71.2, 54 "/>
                            <circle className={ letterSvgEye1 } cx="52.7" cy="66.5" r="5.7" / >
                            <circle className={ letterSvgEye2 } cx="99.5" cy="66.5" r="5.7" / >
                            <rect x="61.8" y="90.6" className={ letterSvgMouth } width="28.7" height="9" / >
                            <path className={ letterSvgMouthUp } d="M50.4,82.8c-9.8,0-17.7-8-17.7-17.7h9c0,4.8,3.9,8.7,8.7,8.7s8.7-3.9,8.7-8.7h9C68.1,74.9,60.2,82.8,50.4,82.8z" />
                            <path className={ letterSvgMouthDown } d="M50.4,74c9.8,0,17.7,8,17.7,17.7h-9c0-4.8-3.9-8.7-8.7-8.7s-8.7,3.9-8.7,8.7h-9C32.7,81.9,40.6,74,50.4,74z" />
                        </svg>*/}

                        <svg ref="mainSvg" className={ styles.logo_svg }version="1.1" id="logo_motion"x="0px"y="0px" viewBox="0 0 102 102" >
                            <circle ref="circle" className={ backgroundSvg } cx="51" cy="51" r="48.5" / >
                            <polygon ref="t" className={ letterSvgT } points="34.3,37 40.9,37 40.9,38.4 38.4,38.4 38.4,45.5 36.8,45.5 36.8,38.4 34.3,38.4 " />
                            <rect ref="i" x="52.4" y="68" className={ letterSvgI } width="1.6"  height="8.5" / >
                            <polygon ref="m" className={ letterSvgM } points="71.2,45.5 73.2,45.5 75.5,51.5 77.7,45.5 79.7,45.5 79.7,54 78.2,54 78.2,47.9 76,53.9 74.8,53.9
    72.7, 47.9 72.7, 54 71.2, 54 "/>
                            <circle className={ letterSvgEye1 } cx="27.7" cy="46.5" r="5.7" / >
                            <circle className={ letterSvgEye2 } cx="74.5" cy="46.5" r="5.7" / >
                            <rect x="36.8" y="70.6" className={ letterSvgMouth } width="28.7" height="9" / >
                            <path className={ letterSvgMouthUp } d="M50.4,82.8c-9.8,0-17.7-8-17.7-17.7h9c0,4.8,3.9,8.7,8.7,8.7s8.7-3.9,8.7-8.7h9C68.1,74.9,60.2,82.8,50.4,82.8z" />
                            <path className={ letterSvgMouthDown } d="M50.4,74c9.8,0,17.7,8,17.7,17.7h-9c0-4.8-3.9-8.7-8.7-8.7s-8.7,3.9-8.7,8.7h-9C32.7,81.9,40.6,74,50.4,74z" />
                        </svg>

                    </div>

                </div>

            </div>
        );
    }
}

export default Intro;