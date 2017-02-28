/* global Power2 TweenLite TimelineMax MorphSVGPlugin*/

import React, { Component } from 'react';
import styles from './Intro.module.css';
import { TweenMax, TweenLite } from 'gsap';
import Clipboard from 'clipboard';
import Matter from 'matter-js';
import GlobalStore from '../../base/globalStore';
import { getPositionStart } from '../../helpers/offset.js';
import { getPositionEnd } from '../../helpers/offset.js';
import MorphSVGPlugin from './MorphSVGPlugin';

class Intro extends Component {

    constructor(props) {
        super(props);

        this.state = {
            emailCopied: false,
            active: false
        };

        this.edge = 0;

    }

    componentDidMount() {

        this.bindEvents();

        // TweenMax.set(this.refs.mainTitle,{autoAlpha:0, y : 100});
        // TweenMax.to(this.refs.mainTitle,1, {autoAlpha:1, y : 0, delay: 0.5});

        var clipboard = new Clipboard(this.refs.contact_copy);

        clipboard.on('success', (e) => {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);

            this.setState({ emailCopied: true });

            e.clearSelection();
        });

        this.title = this.refs.mainTitle;
        const spannedText = this.createLetterSpan(this.title.textContent);
        this.title.innerHTML = spannedText;

        setTimeout(() => {
            this.setupLetterScene();
        }, 1000);

        MorphSVGPlugin.convertToPath('.shape');

        this.hoverLogo = new TimelineMax({ paused: true });
        this.hoverLogo
            .to('.t', 1, { morphSVG: '.eye01' }, 0)
            .to('.m', 1, { morphSVG: '.eye02' }, 0)
            .to('.i', 1, { morphSVG: '.mouth' }, 0)
            .to('.i', 1, { morphSVG: '.smile_up' }, 2)
            .to('.i', 1, { y: -12, morphSVG: { shape: ".smile_down", shapeIndex: 3 } }, 4);

        this.refs.el.querySelector('#logo').addEventListener('mouseenter', () => {
            console.log('mouseenter');
            this.hoverLogo.play();
        });

        this.refs.el.querySelector('#logo').addEventListener('mouseleave', () => {
            console.log('mouseleave');
            this.hoverLogo.tweenTo(0);
        });

        this.setupDom();

    }

    bindEvents() {

        GlobalStore.on('change:viewport', () => this.resize());
        GlobalStore.on('change:scroll', () => this.scrollUpdate());

    }

    setupDom() {

        TweenMax.set(this.refs.link_underline, { x: -120 });
        TweenMax.set(this.refs.contact_copy, { x: '100%' });
        TweenMax.set(this.refs.contact_or, { x: '100%' });
        TweenMax.set(this.refs.contact_link, { x: '100%' });

    }

    // componentWillUpdate(nextProps, nextState){

    // }

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
                // Matter.Render.stop(this.renderer);
                console.log('STOP');
            }

        } else {

            if (!this.state.active) {
                this.edge = 0;
                this.setState({ active: true });
                this.updatePosition();
                console.log('PLAY');
            }
        }

    }

    setupLetterScene() {

        this.initMatter();

    }

    initMatter() {

        this.w = this.refs.el.offsetWidth;
        this.h = this.refs.el.offsetHeight;

        this.letters = this.refs.mainTitle.querySelectorAll('.letter');
        this.blocks = [];
        this.borders = [];

        // this.bouncerClone;
        // this.bouncer = document.querySelector('.bouncer');
        // this.bouncerRadius = this.bouncer.clientWidth * 0.5;
        // this.bouncerClone;

        this.categories = {
            catMouse: 0x0002,
            catBody: 0x0004
        }

        // Matter.js module aliases
        // var Engine = Matter.Engine;
        // this.World = Matter.World;
        // this.Body = Matter.Body;
        // this.Bodies = Matter.Bodies;
        // this.Render = Matter.Render;
        // this.Constraint = Matter.Constraint;
        // this.Mouse = Matter.Mouse;
        // this.MouseConstraint = Matter.MouseConstraint;

        // ______________________________ canvas element to draw into
        this.canvas = document.createElement('canvas');
        let context = this.canvas.getContext('2d');

        // ______________________________ Matter engine
        this.engine = Matter.Engine.create({ enableSleeping: true });
        this.engine.world.wireframes = false;
        this.engine.world.gravity.x = 0;
        this.engine.world.gravity.y = 0;

        // ______________________________ Custom runner
        this.runner = Matter.Runner.create();


        var stage = this.refs.stage;

        this.renderer = Matter.Render.create({
            element: stage,
            canvas: this.canvas,
            context: context,
            engine: this.engine,
            background: '#ff00ff',
            wireframeBackground: '#222',
            options: {
                bounds: true,
                showBounds: true,
                background: "transparent",
                width: this.w,
                height: this.h,
                wireframes: true
            }
        });

        this.initLetterClones();

        //initBubbles();
        // this.initLetterClones();
        this.initMouse(this.blocks);
        // this.initBouncer();
        this.initEscapedBodiesRetrieval(this.blocks, { x: this.w * 0.5, y: this.h * 0.5 });
        this.fixLetters();

        this.initBorders();
        // Matter.Engine.run(this.engine);
        // Matter.Render.run(this.renderer);

    }

    explosion() {

        this.refs.link_label.textContent = 'Dammit !!!'

        var Body = Matter.Body;
        var bodyB = this.blocks[1];
        var bodyC = this.blocks[4];
        var bodyD = this.blocks[8];

        // Body.setVelocity(bodyB, { x: 0, y: -10 });
        // Body.setAngle(bodyB, -Math.PI * 0.26);
        // Body.setAngularVelocity(bodyB, 0.2);

        // Body.setVelocity(bodyC, { x: 10, y: 20 });
        // Body.setAngularVelocity(bodyC, 0.2);

        // Body.setVelocity(bodyD, { x: -4, y: 3 });
        // Body.setAngle(bodyD, -Math.PI * 0.1);
        // Body.setAngularVelocity(bodyD, -0.2);

        for (let i = 0; i < this.blocks.length; i++) {

            let element = this.blocks[i];

            var forceMagnitude = 0.10 * element.mass;
            Body.applyForce(element, element.position, {
                x: (forceMagnitude + Matter.Common.random() * forceMagnitude) * Matter.Common.choose([1, -1]),
                y: (forceMagnitude + Matter.Common.random() * forceMagnitude) * Matter.Common.choose([1, -1])
            });

            // Body.setVelocity(element, { x:  Matter.Common.random() * 10 * Matter.Common.choose([1, -1]), y: Matter.Common.random() * 10 * Matter.Common.choose([1, -1]) });
            // Body.setAngle(element, -Math.PI * 0.1);
            // Body.setAngularVelocity(element, -0.2);

        }

        TweenMax.to(this.engine.timing, 1, { timeScale: .01, ease: Power2.easeOut });
        TweenMax.to(this.engine.timing, 1, { timeScale: 1, ease: Power2.easeIn, delay: 1 });

    }

    fixLetters() {

        this.title.style.position = 'absolute';
        this.title.style.top = '0';
        this.title.style.left = '0';

        for (var i = 0; i < this.letters.length; i++) {
            this.letters[i].style.position = 'absolute';
            this.letters[i].style.top = '0';
            this.letters[i].style.left = '0';
        }

        this.updatePosition();
    };

    initLetterClones() {

        // console.log('this.letters.length', this.letters.length);

        for (var i = 0; i < this.letters.length; i++) {

            let letter = this.letters[i];
            this.blocks.push(
                Matter.Bodies.rectangle(
                    this.title.offsetLeft + letter.offsetLeft + letter.offsetWidth * 0.5,
                    this.title.offsetTop + letter.offsetHeight * 0.5,
                    letter.offsetWidth,
                    letter.offsetHeight, {
                        isSleeping: false,
                        density: 1,
                        restitution: 0.7,
                        frictionAir: 0.01,
                        // density: 0.1,
                        // restitution: 0.1,
                        // friction: 0.01,
                        // frictionAir: 0.01,
                        // collisionFilter: {
                        //     category: this.categories.catBody
                        // },
                        render: {
                            opacity: 1
                        }
                    })
            );

            Matter.World.add(this.engine.world, this.blocks[i]);

            letter.style.width = letter.offsetWidth + 'px';
            letter.style.height = letter.offsetHeight + 'px';
        }

    }

    // walls/borders
    initBorders() {

        var borderOptions = { isStatic: true, render: { opacity: 1 } };
        var offset = 5;
        this.borders.push(Matter.Bodies.rectangle(this.w * 0.5, offset, this.w, 2, borderOptions)); // top
        this.borders.push(Matter.Bodies.rectangle(this.w - offset, this.h * 0.5, 2, this.h, borderOptions));
        this.borders.push(Matter.Bodies.rectangle(this.w * 0.5, this.h - offset, this.w, 2, borderOptions)); // bottom
        this.borders.push(Matter.Bodies.rectangle(0 + offset, this.h * 0.5, 2, this.h, borderOptions));

        for (var i = 0; i < this.borders.length; i++) {
            Matter.World.add(this.engine.world, this.borders[i]);
        }

    };

    updateBorders() {
        for (var i = 0; i < this.borders.length; i++) {
            Matter.World.remove(this.engine.world, this.borders[i]);
        }
        this.borders = [];
        this.initBorders();
    }


    initMouse(array) {

        var mouse = Matter.Mouse.create(this.canvas);
        var mouseConstraint = Matter.MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.5,
                render: {
                    visible: true
                }
            }
        });

        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

        Matter.World.add(this.engine.world, mouseConstraint);
        Matter.Events.on(mouseConstraint, 'startdrag', () => {
            //removeInfo
            console.log('startdrag');
        });

        // catBody category objects should not be draggable with the mouse
        // mouseConstraint.collisionFilter.mask = 0x0002 | this.categories.catMouse;
    }

    createLetterSpan(text) {

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

                content += '<span class="letter">' + ch + '</span>';
                //word.append('<span class="letter">' + ch + '</span>')

            }

        }

        return content;
    }

    // initBouncer(){
    //     console.log('this.bouncer.offsetLeft', this.bouncer.offsetLeft);
    //     console.log('this.bouncer.offsetLeft', this.bouncerRadius);

    //     this.bouncerClone = Matter.Bodies.circle(
    //         this.bouncer.offsetLeft + this.bouncerRadius,
    //         this.bouncer.offsetTop + this.bouncerRadius,
    //         this.bouncerRadius, {
    //             isSleeping: false,
    //             density: 0.08,
    //             collisionFilter: {
    //                 category: this.categories.catMouse
    //             },
    //             render: {
    //                 opacity: 1
    //             }
    //     });

    //     Matter.World.add(this.engine.world, this.bouncerClone );
    //     Matter.Events.on(this.engine.world, "afterAdd", () => this.fixBouncer());
    // }

    // fixBouncer (){

    //     this.bouncer.style.position = 'absolute';
    //     this.bouncer.style.top = '0';
    //     this.bouncer.style.left = '0';
    //     this.bouncer.style.marginTop = '0';

    //     this.updatePosition();

    // }

    updatePosition() {

        if (this.state.active && this.engine) {

            console.log('updatePosition');

            //run our own runner to be able to stop it properly
            // Matter.Engine.update(this.engine, 1000 / 60, 1);
            Matter.Runner.tick(this.runner, this.engine, 1000 / 60);

            for (var i = 0; i < this.letters.length; i++) {
                TweenLite.set(this.letters[i], {
                    x: this.blocks[i].position.x - this.letters[i].offsetWidth * 0.5 + 'px',
                    y: this.blocks[i].position.y - this.letters[i].offsetHeight * 0.5 + 'px',
                    rotation: this.blocks[i].angle + 'rad'
                });
            }

            requestAnimationFrame(() => this.updatePosition());

        }
        // TweenLite.set( this.bouncer, {
        //     x: this.bouncerClone.position.x - this.bouncer.clientWidth*0.5 + 'px',
        //     y: this.bouncerClone.position.y - this.bouncer.clientHeight*0.5 + 'px',
        //     rotation: this.bouncerClone.angle + 'rad'
        // });
    }

    updateCanvas() {

        // var diffX = document.body.clientWidth - this.w;
        // var diffY = document.body.clientHeight - this.h;

        this.renderer.options.width = this.w;
        this.renderer.options.height = this.h;
        this.renderer.canvas.width = this.w;
        this.renderer.canvas.height = this.h;

        this.engine.world.bounds.max.x = window.width;
        this.engine.world.bounds.max.y = window.height;
    };


    // helpful function
    // src > http://stackoverflow.com/a/35093569
    initEscapedBodiesRetrieval(allBodies, startCoordinates) {

        var w = this.w;
        var h = this.h;

        function hasBodyEscaped(body) {
            var x = body.position.x;
            var y = body.position.y;

            return x < 0 || x > w || y < 0 || y > h;
        }

        setInterval(function() {
            var i, body;

            for (i = 0; i < allBodies.length; i++) {
                body = allBodies[i];
                if (hasBodyEscaped(body)) {

                    Matter.Body.setVelocity(body, {
                        x: -body.velocity.x,
                        y: -body.velocity.y
                    });

                    Matter.Body.translate(body, {
                        x: (startCoordinates.x - body.position.x),
                        y: (startCoordinates.y - body.position.y)
                    });
                }
            }
        }, 300);

    }

    onLinkEnter() {

        TweenMax.killTweensOf(this.refs.link_underline_bottom);
        TweenMax.killTweensOf(this.refs.link_underline);

        TweenMax.to(this.refs.link_label, .5, { x: 5 });
        TweenMax.to(this.refs.link_icon, .5, { x: -5 });
        TweenMax.to(this.refs.link_underline_bottom, .5, { x: 175 });

        TweenMax.set(this.refs.link_underline, { x: -130 });
        TweenMax.to(this.refs.link_underline, .5, { x: -60, delay: .3 });

    }

    onLinkLeave() {

        TweenMax.killTweensOf(this.refs.link_underline_bottom);
        TweenMax.killTweensOf(this.refs.link_underline);

        TweenMax.to(this.refs.link_label, .5, { x: 0 });
        TweenMax.to(this.refs.link_icon, .5, { x: 0 });

        TweenMax.set(this.refs.link_underline_bottom, { x: -100 });
        TweenMax.to(this.refs.link_underline_bottom, .5, { x: 0, delay: .3 });

        TweenMax.to(this.refs.link_underline, .5, { x: 175 });

    }

    onContactEnter() {
        console.log('onContactEnter');
        TweenMax.to(this.refs.contact_copy, .5, { x: '0%', ease: Power2.easeOut });
        TweenMax.to(this.refs.contact_or, .5, { x: '0%', ease: Power2.easeOut });
        TweenMax.to(this.refs.contact_link, .6, { x: '0%', ease: Power2.easeOut });

    }

    onContactLeave() {
        console.log('onContactLeave');
        TweenMax.to(this.refs.contact_copy, .6, { x: '100%', ease: Power2.easeIn });
        TweenMax.to(this.refs.contact_or, .6, { x: '100%', ease: Power2.easeIn });
        TweenMax.to(this.refs.contact_link, .5, { x: '100%', ease: Power2.easeIn });

    }

    resize() {

        console.log('resize');

        if (this.engine) {
            this.updateCanvas();
            this.updateBorders();
        }

        this.top = getPositionStart(this.refs.el, GlobalStore.get('viewport').height);
        this.bottom = getPositionEnd(this.refs.el, GlobalStore.get('viewport').height);

    }

    render() {

        const classNameGrid = styles.introduction;
        const classNavigation = styles.navigation;
        const classLinkWrapper = styles.link_wrapper;

        const {
            emailCopied
        } = this.state;

        const mailText = emailCopied ? 'Email copied! Can\'t to hear from you' : 'Contact';

        const backgroundSvg = styles.background_svg + " background_s";
        const letterSvgT = styles.letter_svg + " letter t shape";
        const letterSvgI = styles.letter_svg + " letter i shape";
        const letterSvgM = styles.letter_svg + " letter m shape";
        const letterSvgEye1 = styles.eyes_svg + " eyes eye01 shape";
        const letterSvgEye2 = styles.eyes_svg + " eyes eye02 shape";
        const letterSvgMouth = styles.mouth_svg + " mouth shape";
        const letterSvgMouthUp = styles.smile_svg + " smile_up shape";
        const letterSvgMouthDown = styles.smile_svg + " smile_down shape";

        return ( 
            <div className = { classNameGrid }ref = "el" >

                <div className = { styles.logo } >
                    <svg className = { styles.logo_svg }version = "1.1"
                        id = "logo"
                        x = "0px"
                        y = "0px"
                        viewBox = "0 0 102 102" >
                        <circle className = { backgroundSvg }
                        cx = "51"
                        cy = "51"
                        r = "48.5" / >
                        <polygon className = { letterSvgT }
                        points = "34.3,37 40.9,37 40.9,38.4 38.4,38.4 38.4,45.5 36.8,45.5 36.8,38.4 34.3,38.4 " />
                        <rect x = "52.4"
                        y = "68"
                        className = { letterSvgI }
                        width = "1.6"
                        height = "8.5" / >
                        <polygon className = { letterSvgM }
            points = "71.2,45.5 73.2,45.5 75.5,51.5 77.7,45.5 79.7,45.5 79.7,54 78.2,54 78.2,47.9 76,53.9 74.8,53.9
72.7, 47.9 72.7, 54 71.2, 54 "/> 
                        <circle className = { letterSvgEye1 }
                        cx = "27.7"
                        cy = "46.5"
                        r = "5.7" / >
                        <circle className = { letterSvgEye2 }
                        cx = "74.5"
                        cy = "46.5"
                        r = "5.7" / >
                        <rect x = "36.8"
                        y = "70.6"
                        className = { letterSvgMouth }
                        width = "28.7"
                        height = "9" / >
                        <path className = { letterSvgMouthUp }
                        d = "M50.4,82.8c-9.8,0-17.7-8-17.7-17.7h9c0,4.8,3.9,8.7,8.7,8.7s8.7-3.9,8.7-8.7h9C68.1,74.9,60.2,82.8,50.4,82.8z" />
                        <path className = { letterSvgMouthDown }
                        d = "M50.4,74c9.8,0,17.7,8,17.7,17.7h-9c0-4.8-3.9-8.7-8.7-8.7s-8.7,3.9-8.7,8.7h-9C32.7,81.9,40.6,74,50.4,74z" />
                    </svg> 
                </div>

            <nav className = { classNavigation }
            onMouseLeave = {
                () => this.onContactLeave() }
            role = "navigation" >
            <p ref = "contact_label"
            onMouseEnter = {() => this.onContactEnter() }
            className = { styles.navigation__p } > { mailText } </p>
                
                <a ref = "contact_copy"
                className = { styles.navigation__link }
                data-clipboard-action = "copy"
                data-clipboard-text = "timothee.roussilhe@gmail.com"
                target = "_blank" > Copy my email address </a> 

                <span ref = "contact_or"
                className = { styles.contact_or } > or </span>
                
                <a ref = "contact_link"
                className = { styles.navigation__link }
                href = "mailto:timothee.roussilhe@gmail.com"
                target = "_blank"> Open your email
                default app < br/> (you know the thing called "email") </a> 
            
            </nav>

            <div className = { styles.content__wrapper } >

                <h1 ref = "mainTitle" className = { styles.title } > Timothée Roussilhe </h1> 
                <h2 className = { styles.subtitle } > Creative Developer </h2> 
                <div ref = "stage" className = { styles.stage } > </div> 
            

                { /*<button ref="button" className={styles.explosion_button} ></button>*/ } {
                    /*<div className={classDescription__wrapper}>
                                            <h2 className={styles.description__title}>DESCRIPTION</h2>
                                            <ul className={styles.description__items}>
                                                <li className={styles.description__item}>0 — Human being</li>
                                                <li className={styles.description__item}>1 — Creative developer.</li>
                                                <li className={styles.description__item}>2 — Blend of creative and technical.</li>
                                                <li className={styles.description__item}>3 — No detail escapes me.</li>
                                                <li className={styles.description__item}>4 — An eye for interaction design and finishing touches</li>
                                                <li className={styles.description__item}>5 — Like to collaborate with designer to push thinks forwards</li>
                                            </ul>
                                        </div>*/
                }

            </div>

            <div ref = "link"
            onMouseEnter = {
                () => this.onLinkEnter() }
            onMouseLeave = {
                () => this.onLinkLeave() }
            className = { classLinkWrapper } >
                <span ref = "link_icon"
                className = { styles.link_icon } > ☠ </span> 
                <a className = { styles.link }
                onClick = {
                    () => this.explosion() } >
                    <span ref = "link_label"
                    className = { styles.link_label } > Do not press this! </span> 
                    <span ref = "link_underline_bottom"
                    className = { styles.link_underline_bottom } > </span>
                    <span ref = "link_underline"
                    className = { styles.link_underline } > </span>
                </a>
                </div>    
            </div>
        );
    }
}

export default Intro;