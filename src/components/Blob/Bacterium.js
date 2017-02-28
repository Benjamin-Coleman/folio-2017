/*global paper */
// adjustable variables
const mouseForce = 0.2;

class Bacterium {

	constructor(el, color) {

		console.log('Bacterium');

		this.color = color;

		let blob = new paper.PaperScope();
		blob.setup(el);

		this.view = blob.view;
		this.Point = blob.Point;
		this.Path = blob.Path;
		this.Group = blob.Group;

		this.radius = Math.min( this.view.size.width, this.view.size.height) / 2 * 0.25;
		this.size = this.view.bounds.center;

		// other variables
		this.mousePoint = new this.Point(-1000, -1000);

		this.build(this.view.bounds.center, this.radius, this.color );

		this.view.onFrame = (event) => {this.animate(event);}

		/*$.support.touch = 'ontouchstart' in window;

		if( !$.support.touch ) {
			// this should only run if on a non-touch device, but it keeps running everywhere
		}*/

		var tool = new blob.Tool();
		tool.onMouseMove = function(event) {
			this.mousePoint = event.lastPoint;
		}.bind(this);

	}

	build(center, radius, color) {

		var padding = Math.min(this.view.size.width, this.view.size.height) * 0.1;
		var timeScale = 0.5;
		var maxWidth = this.view.size.width - padding * 2;
		var maxHeight = this.view.size.height - padding * 2;
		var w = maxWidth * timeScale;
		var h = maxHeight * timeScale;

		this.fitRect = new this.Path.Rectangle({
			point: [this.view.size.width / 2 - w / 2, this.view.size.height / 2 - h / 2],
			size: [w, h]
		});

		this.circlePath = new this.Path.Circle(center, radius);

		this.group = new this.Group([this.circlePath]);
		//this.group.strokeColor = "black";
		this.group.position = this.view.center;

		this.circlePath.fillColor = color;
		this.circlePath.fullySelected = false;

		// Mausdistanz
		this.threshold = radius * 1.4;
		this.center = center;
		// Elemente hinzufügen
		this.circlePath.flatten(radius * 1.5);
		// wieder zum Kreis machen
		this.circlePath.smooth();
		// einpassen in das fitRect
		this.circlePath.fitBounds( this.fitRect.bounds );

		// control circle erstellen, auf den die einzelnen Punkte später zurückgreifen können
		this.controlCircle = this.circlePath.clone();
		this.controlCircle.fullySelected = false;
		this.controlCircle.visible = false;

		var rotationMultiplicator = radius / 200;

		// Settings pro segment
		this.settings = [];
		for( var i = 0; i < this.circlePath.segments.length; i++ ) {
			var segment = this.circlePath.segments[i];
			this.settings[i] = {
				relativeX: segment.point.x - this.center.x,
				relativeY: segment.point.y - this.center.y,
				offsetX: rotationMultiplicator,
				offsetY: rotationMultiplicator,
				momentum: new this.Point(0,0)
			};
		}
	}

	clear() {
		this.circlePath.remove();
		this.fitRect.remove();
	}

	animate(event) {

		this.group.rotate(-0.2, this.view.center);

		for( var i = 0; i < this.circlePath.segments.length; i++ ) {
			var segment = this.circlePath.segments[i];

			var settings = this.settings[i];
			var controlPoint = new this.Point(
				//settings.relativeX + this.center.x,
				//settings.relativeY + this.center.y
			);
			controlPoint = this.controlCircle.segments[i].point;

			// Avoid the mouse
			var mouseOffset = this.mousePoint.subtract(controlPoint);
			var mouseDistance = this.mousePoint.getDistance( controlPoint );
			var newDistance = 0;

			if( mouseDistance < this.threshold ) {
				newDistance = (mouseDistance - this.threshold) * mouseForce;
			}

			var newOffset = new this.Point(0, 0);
			if(mouseDistance !== 0){
				newOffset = new this.Point(mouseOffset.x / mouseDistance * newDistance, mouseOffset.y / mouseDistance * newDistance);
			}
			var newPosition = controlPoint.add( newOffset );

			var distanceToNewPosition = segment.point.subtract( newPosition );

			settings.momentum = settings.momentum.subtract( distanceToNewPosition.divide( 6 ) );
			settings.momentum = settings.momentum.multiply( 0.6 );

			// Add automatic rotation
			var amountX = settings.offsetX;
			var amountY = settings.offsetY;
			var sinus = Math.sin(event.time + i*2);
			var cos =  Math.cos(event.time + i*2);
			settings.momentum = settings.momentum.add( new this.Point(cos * -amountX, sinus * -amountY) );

			// go to the point, now!
			segment.point = segment.point.add( settings.momentum );

		}
	}

}

export default Bacterium;
