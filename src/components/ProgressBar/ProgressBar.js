import React, { Component } from 'react';
import Degas from './Degas';
import './ProgressBar.css';
import Matter from 'matter-js';
import GlobalStore from '../../base/globalStore';

class ProgressBar extends Component {
	constructor(props) {
	
    	super(props);

        this.c = null;
        this.d = null;

        this.pPoints = [];

        this.balles = [];
        this.maxSphere = 18;
        this.mainCircleRadius = 100;
        this.mainCircleCenter = { 'x': window.innerWidth/2, 'y': window.innerHeight/2 };
        this.engine = null;
        this.mouse = null;
        this.mousePos = { 'x': 0, 'y': 0 } ;
        this.mainAnchor = null;

        // Matter.js module aliases
        this.World = Matter.World;
        this.Body = Matter.Body;
        // this.Bodies = Matter.Bodies;
        this.Composites = Matter.Composites;
        this.Composite = Matter.Composite;
        // this.Constraint = Matter.Constraint;

        this.width = 400;
        this.height = 600;

	}

    componentDidMount() {
        this.init();
    }
    
    init() {

        this.refs.wrapper.addEventListener('mousemove', (e) => {

            this.box = this.refs.wrapper.getBoundingClientRect();
            this.mousePos.x = e.pageX - this.box.left;
            this.mousePos.y = e.pageY - window.pageYOffset - this.box.top;

        });

        window.addEventListener('resize' , () => {
            this.resize();
            // this.d.resize();
        });

        const Engine = Matter.Engine;

        this.engine = Engine.create(this.refs.wrapper, { render: { options:
            { 
                wireframes: true,
                showDebug: true,
            }
        }});
        
        this.runner = Matter.Runner.create();

        this.engine.world.gravity.y = 0;
        // resize( window.innerWidth, window.innerHeight );

        this.mouse = Matter.Bodies.circle(this.width/2, this.height/2-150, 30);
        // mouse.groupId = 5;

        this.mainAnchor = Matter.Bodies.circle(this.width/2, this.height/2, 0);
        // mainAnchor.isStatic = true;
        // mainAnchor.groupId = 8;

        this.createLane();
        
        Matter.World.add( this.engine.world, [ this.mouse ] );

        this.c = this.refs.canvas; 
        this.c.width = this.width;
        this.c.height = this.height;

        this.d = new Degas( this.c );
        const baseColor = "#ffffff";
        this.path = new Degas.Path( this.pPoints );
        this.path.stroke = baseColor;
        this.path.strokeWidth = 2;
        this.path.fill = '';
        //this.path.fill = baseColor;
        this.path.smoothPointsNumber = 0;
        //this.path.closed = true;
        this.path.smooth();
    
        // this.path.opacity = 0;
        this.d.addChild( this.path );

        this.engine.render.canvas.style.opacity = 0;
        
        // $(window).resize(function(){
        //     resize( window.innerWidth, window.innerHeight );
        //     d.resize();
        // });
        this.bindEvents();
        this.resize();

    }

    bindEvents(){

        this.update = (e) => this.rafUpdate(e);
        GlobalStore.get('rafCallStack').push(this.update);

    }


    createConstrainteObjObj( ba, bb, stiffness ){ 
        return Matter.Constraint.create({ bodyA: ba, bodyB: bb, stiffness: stiffness||0.1 }) 
    }

    createConstrainteObjPts( ba, pa, stiffness ){ 
        return Matter.Constraint.create({ bodyA: ba, pointB: pa, stiffness: stiffness|| 0.01 }) 
    }

    rafUpdate(){
        
        if(this.props.playing){
            
            //run our own runner to be able to stop it properly
            Matter.Runner.tick(this.runner, this.engine, 1000/60);
            Matter.Body.translate( this.mouse, { x: this.mousePos.x - this.mouse.positionPrev.x,  y: this.mousePos.y - this.mouse.positionPrev.y} );

            for( var i = 0; i < this.balles.length; i++ ){
                this.path.points[i].x = this.balles[i].position.x;
                this.path.points[i].y = this.balles[i].position.y
            }
            this.d.render();
        }

    }


    createLane(){
        for( var i = 0; i < this.maxSphere; i++ ){
            var x = this.width/2;
            var y = 60 * i;
            var b = Matter.Bodies.circle( x, y, 1 );
            this.balles.push( b ) 
            Matter.World.add( this.engine.world, [ b ] );
            if(i === 0 || i === this.maxSphere-1){
                Matter.World.add( this.engine.world, [this.createConstrainteObjPts( b, { x: x, y: y}, 1) ] );
            }else{
                Matter.World.add( this.engine.world, [this.createConstrainteObjPts( b, { x: x, y: y} ) ] );
            }
            this.pPoints.push( new Degas.Point( x, y ) );
        }
    }

    resize(){
        
        // console.log('width', width);
		this.engine.world.bounds.max = { x: this.width, y: this.height };
		this.engine.render.canvas.width = this.width;
		this.engine.render.canvas.height = this.height;
		this.engine.render.canvas.style.width = this.width + 'px';
		this.engine.render.canvas.style.height = this.height + 'px';
        
	}

	render() {

        const {
            progress,
            parentWidth
        } = this.props;
        
        const progressNumber = progress * parentWidth - 200;

        const style = {
            transform: 'translateX(' + progressNumber + 'px) translateY(-100px)',
        };

		return (
            <div ref="wrapper" className="progress__wrapper" style={style} >
                <canvas id="drawing-canvas" ref="canvas"></canvas>
            </div>
        );
        
	}
}

export default ProgressBar;
