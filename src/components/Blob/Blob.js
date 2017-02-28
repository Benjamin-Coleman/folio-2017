import React, { Component } from 'react';
import './Blob.css';
import Bacterium from './Bacterium';

class Blob extends Component {

	initBlob(el){

		let bacterium = new Bacterium( el, "#DEDED4" );

		// function redrawBacterium() {
		//
		// 	// overwrite the global paper object with the local one
		// 	paper = blob;
		//
		// 	radius = Math.min( view.size.width, view.size.height ) / 2;
		// 	radius = Math.floor( radius * 0.7 );
		//
		// 	bacterium.clear();
		// 	bacterium = null;
		// 	bacterium = new Bacterium( view.bounds.center, radius, "black");
		// }
		//
		// view.onResize = function(event) {
		// 	redrawBacterium();
		// };
	}



	// function fitPaperWraps() {
	// 	blob.fit();
	// }

	componentDidMount(){

		let blob = document.getElementById('blob');
		console.log(blob);
		console.log(this.refs);
		this.initBlob(this.refs.blob);

	}

	render() {
		return (
			<canvas ref="blob" id="blob"></canvas>
		);
	}
}

export default Blob;
