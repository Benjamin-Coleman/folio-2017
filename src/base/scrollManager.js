
import GlobalStore from './globalStore';

class ScrollManager {

	constructor(obj) {
		
        // super(obj);

		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		GlobalStore.set('scroll', {
			targetY: scrollTop,
			currentY: scrollTop
		}, true);

        // we add all sections that we wanna monitor to know when they are on vieport or not
        this.sections = [];

        this.bindEvents();
	}

	bindEvents() {
		this.bindStoreEvents();
	}

	rafUpdate() {
	
		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		// console.log('scrollTop', scrollTop);
		
        GlobalStore.set('scroll', {
            targetY: scrollTop,
            currentY: scrollTop
        });
		
	}

	bindStoreEvents() {
		GlobalStore.get('rafCallStack').push( () => this.rafUpdate() );
	}

}

export default ScrollManager;