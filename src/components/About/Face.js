import React, { Component } from 'react';
import GlobalStore from '../../base/globalStore';
import {TweenMax} from 'gsap';
import * as PIXI from 'pixi.js';


// var customFilters = {
//     DotFilter: require('./Filter/dot/DotFilter')
// };
// Object.assign(PIXI.filters, customFilters);

class Face extends Component {
	constructor(props) {
		super(props);

        this.backgroundContainer = null;
        this.destinationX = 0;
        this.destinationY = 0;

        this.speed = 0.1;
        this.leave = true;

        this.width= GlobalStore.config.isMobile ? 250 : 500;
        this.height= GlobalStore.config.isMobile ? 300 : 600;

        this.mouseX = this.width /2;
        this.mouseY = this.height /2;

        this.timerBG = null;

    }

    componentDidMount() {

        console.log('PIXI', PIXI);

        //Create the renderer
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height,{
            backgroundColor: 0x160000
        });

        //Add the canvas to the HTML document
        this.refs.el.appendChild(this.renderer.view);

        //Create a container object called the `stage`
        this.stage = new PIXI.Container();
        this.stage.interactive = true;

        //Tell the `renderer` to `render` the `stage`
        this.renderer.render(this.stage);
        this.wrapper = new PIXI.Container();

        this.stage.addChild(this.wrapper);

        let loader = PIXI.loader;
        loader.add('/assets/images/portrait_face.png');
        loader.add('/assets/images/portrait.jpg');
        loader.once('complete',() => this.setupScene());

        loader.load();
    }

    setupScene() {

        const depthLayer = 17;
        const maskSize = 15;
        let texture = PIXI.loader.resources['/assets/images/portrait_face.png'].texture;
        this.faceSpriteArray = [];

        for (let i = 0; i < depthLayer; i++) {
            let container = this.createSpriteLayer(i,maskSize, texture, depthLayer);
            this.faceSpriteArray.push(container);
        }

        for (let i = this.faceSpriteArray.length - 1; i >= 0; i--)
        {
            this.wrapper.addChild(this.faceSpriteArray[i]);
            // count is only evaluated once and then the comparison is always on 0.
        }

        //bg
        let texturePortrait = PIXI.loader.resources['/assets/images/portrait.jpg'].texture;
        this.portrait = new PIXI.Sprite(texturePortrait);

        const scale = GlobalStore.config.isMobile ? .5 : 1;
        this.portrait.scale.x = scale;
        this.portrait.scale.y = scale;

        this.stage.addChildAt(this.portrait, 0);

        this.portrait.anchor.y = 1;
        this.portrait.position.y = this.height;

        //background now
        this.createBackground();
        this.bindEvent();

        this.renderer.render(this.stage);

    }

    bindEvent() {

        console.log('bindEvent');

        this.update = (e) => this.rafUpdate(e);
		GlobalStore.get('rafCallStack').push(this.update);

        //Bind PIXI EVENTS
        this.handlers = {};
        this.handlers.mouseMoveHandler = (event) => this.onMouseMove(event);
        this.handlers.mouseEnterHandler = (event) => this.onMouseEnter(event);
        this.handlers.mouseLeaveHandler = (event) => this.onMouseLeave(event);

		this.stage.on('mousemove', this.handlers.mouseMoveHandler);
		this.stage.on('mouseover', this.handlers.mouseEnterHandler);
		this.stage.on('mouseout', this.handlers.mouseLeaveHandler);

		this.stage.on('touchmove', this.handlers.mouseMoveHandler);
        this.stage.on('touchstart', this.handlers.mouseEnterHandler);
		this.stage.on('touchend', this.handlers.mouseLeaveHandler);

    }

    createSpriteLayer(index, maskSize, texture, length) {

        var container = new PIXI.Container();
        var sprite = new PIXI.Sprite(texture);

        const scale = GlobalStore.config.isMobile ? .5 : 1;
        sprite.scale.x = scale;
        sprite.scale.y = scale;

        sprite.position.x = this.width / 2 - sprite.width / 2 - 5;
        sprite.position.y = this.height / 2 - sprite.height / 2 + 10;

        const maskWidth = (index + 1) * maskSize;
        const maskHeight = (index + 1) * maskSize;
        const speed = 2 + .5 * index;

        this.mask  = new PIXI.Graphics();
        this.mask.isMask = true;
        this.mask.interactive = false;
        this.mask.hitArea = new PIXI.Rectangle(0,0,0,0);
        container.addChild(this.mask);
        this.mask.position.x = this.width / 2 - maskWidth / 2;
        this.mask.position.y = this.height / 2 - maskHeight / 2;
        this.mask.width = maskWidth;
        this.mask.height = maskHeight;
        this.mask.lineStyle(0);
        this.mask.beginFill(0x000000, 1);
        this.mask.drawRect(0, 0, maskWidth, maskHeight);
        sprite.mask = this.mask;

        container.speed = speed;
        container.addChild(sprite);
        return container;

    }

    createBackground() {

        this.backgroundContainer = new PIXI.Container();

        // var sprite = new PIXI.Sprite();
        const bgLength = 20;

        for (var index = 0; index < bgLength; index++) {

            const range = (index + 1) / (bgLength - 1);
            console.log('range', range);

            var rectangle = new PIXI.Graphics();
            const color = this.colorLuminance('e20403', -0.05 * index);
            const colorCode = '0x'+ color.split("#").pop();

            rectangle.beginFill(colorCode);
            rectangle.drawRect(0, 0, this.width, this.height);
            rectangle.endFill();

            var texture = rectangle.generateCanvasTexture();
            var sprite = new PIXI.Sprite(texture);
            sprite.anchor.x = .5;
            sprite.anchor.y = .5;
            sprite.position.x = this.width / 2;
            sprite.position.y = this.height / 2;
            sprite.distance = 150 * ( 1 - range);
            sprite.range = range;

            const skewMax = 25 * (Math.PI / 180);
            sprite.distanceSkew = skewMax * ( 1 - range);

            // sprite.addChild(rectangle);
            this.backgroundContainer.addChildAt(sprite, 0);

            // TweenMax.to(sprite.scale, 1, {x: range, y: range, delay: 2});
            // TweenMax.to(sprite.position, 1, {y: sprite.distance, delay: 2});
            // TweenMax.to(sprite.skew, 5, {x: skewRad, y: skewRad, delay: 2 - 0.2 * index});
        }

        this.stage.addChildAt(this.backgroundContainer, 0);

    }


    //animate background fake 3d tunnel
    showBackground() {

        if(this.backgroundContainer && this.backgroundContainer.children && this.backgroundContainer.children.length > 0){

            for (let index = 0; index < this.backgroundContainer.children.length; index++) {
                let element = this.backgroundContainer.children[index];
                TweenMax.to(element.scale, 1, {x: element.range, y: element.range});
            }

        }


    }

    hideBackground(){

        if(this.backgroundContainer && this.backgroundContainer.children && this.backgroundContainer.children.length > 0){

            for (let index = 0; index < this.backgroundContainer.children.length; index++) {
                let element = this.backgroundContainer.children[index];
                TweenMax.to(element.scale, 1, {x: 1, y: 1});

            }

        }


    }

    colorLuminance(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }

        return rgb;
    }


    onMouseMove(event) {

        //fist pass
        if(!this.leave && this.props.active){
            console.log('onMouseMove');
            this.mouseX = event.data.getLocalPosition(this.stage).x;
            this.mouseY = event.data.getLocalPosition(this.stage).y;
        }

    }

    onMouseEnter(event) {
        this.leave = false;
        this.portrait.alpha = 0;

        this.timerBG && this.timerBG.kill();
        this.showBackground();
        console.log('onMouseEnter');
    }

    onMouseLeave(event) {

        this.mouseX = this.width /2;
        this.mouseY = this.height /2;
        this.leave = true;

        this.hideBackground();
        this.timerBG = TweenMax.delayedCall(1, () => {this.portrait.alpha = 1;});


    }

    rafUpdate() {

        if(this.props.active){

            const half_width = this.width /2;
            const half_height = this.height /2;

            this.destinationX = this.mouseX - half_width;
            this.destinationY = this.mouseY - half_height;

            if(this.faceSpriteArray){
                for (let i = 0; i < this.faceSpriteArray.length ; i++) {
                    let element = this.faceSpriteArray[i];
                    element.position.x += (-element.position.x + this.destinationX) / element.speed;
                    element.position.y += (-element.position.y + this.destinationY) / element.speed;
                }
            }

            //background
            if(this.backgroundContainer && this.backgroundContainer.children && this.backgroundContainer.children.length > 0){

                for (let index = 0; index < this.backgroundContainer.children.length; index++) {
                    let element = this.backgroundContainer.children[index];

                    const distanceX = half_width + (this.destinationX/ half_width * element.distance);
                    const distanceY = half_height + (this.destinationY/ half_height * element.distance);

                    const distanceXSkew = (this.destinationX / half_width)  * element.distanceSkew;
                    const distanceYSkew = (this.destinationY/ half_height) * element.distanceSkew;

                    element.position.x += (-element.position.x + distanceX) * 0.1;
                    element.position.y += (-element.position.y + distanceY) * 0.1;
                    element.skew.x += (-element.skew.x + distanceXSkew) * 0.1;
                    element.skew.y += (-element.skew.y + distanceYSkew) * 0.1;

                }
            }

            this.renderer.render(this.stage);

        }

        // if(this.props.active){

        //     this.destinationX = this.mouseX - 300;
        //     this.destinationY = this.mouseY - 300;

        //     if(this.faceSpriteArray){
        //         for (let i = 0; i < this.faceSpriteArray.length ; i++) {
        //             let element = this.faceSpriteArray[i];
        //             element.position.x += (-element.position.x + this.destinationX) / element.speed;
        //             element.position.y += (-element.position.y + this.destinationY) / element.speed;
        //         }
        //     }

        //     //background
        //     if(this.backgroundContainer && this.backgroundContainer.children && this.backgroundContainer.children.length > 0){

        //         for (let index = 0; index < this.backgroundContainer.children.length; index++) {
        //             let element = this.backgroundContainer.children[index];

        //             const distanceX = 300 + (this.destinationX/ 300 * element.distance);
        //             const distanceY = 300 + (this.destinationY/ 300 * element.distance);

        //             const distanceXSkew = 300 + (this.destinationX/ 300 * element.distanceSkew);
        //             const distanceYSkew = 300 + (this.destinationY/ 300 * element.distanceSkew);

        //             element.position.x += (-element.position.x + distanceX) * 0.1;
        //             element.position.y += (-element.position.y + distanceY) * 0.1;
        //             element.skew.x += (-element.skew.x + distanceXSkew) * 0.1;
        //             element.skew.y += (-element.skew.y + distanceYSkew) * 0.1;

        //         }
        //     }

        //     this.renderer.render(this.stage);

        // }

    }

	render() {

		return (
			<div ref="el">

            </div>
		);
	}
}

export default Face;
