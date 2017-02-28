/**
 * @fileOverview <p>LazyLoad images, videos, iframes...</p>
 *
 * @author Arnaud Tanielian
 * @author Mathias Van Impe
 * @author Tim Roussilhe
 * @author Jp Gary
 *
 * @version 1.0.0
 *
 * @copyright   2013-2016 Stinkdigital
 *
 * @license
 *
 * <p>lazyload.js is licensed under the MIT License <a href="http://www.opensource.org/licenses/mit-license.php">http://www.opensource.org/licenses/mit-license.php</a></p>
 *
 *
 * <p>The MIT License</p>
 *
 * <p>Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 *
 * <p>The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.</p>
 *
 * <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.</p>
 *
 *
*/

var CustomEvent = require('custom-event');

/**
 * @namespace
 */
(function(window, document, undefined) {

	'use strict';

	/**
	 * @class LazyLoad
   * @desc <p>Create a LazyLoad instance.</p>
   * @param {object} options - options for the LazyLoad
   * @param {HTMLElement} options.elements - Elements to lazy load
   * @param {HTMLElement} [options.el] - Main container
   * @param {boolean} [options.isMobile] - If you want the lazy load to load the source provided in data-src-m
   */
	function LazyLoad(options) {


		var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		/**
		 * @name el
	   * @desc Main element used to distpach events from
	   * @public
	   * @instance
	   * @memberof LazyLoad
	   * @type {HTMLElement}
	   */
		this.el =	opts.el === undefined || opts.el === null ? document.createElement('div') : opts.elements;

		// Not documented on purpose because will be empty after init
		this.elements =	opts.elements === undefined || opts.elements === null ? [] : opts.elements;

		/**
		 * @name aElements
	   * @desc Array of elements representing a LazyLoad load item
	   * @access public
	   * @instance
	   * @memberof LazyLoad
	   * @type {Array.<Object>}
	   */
		this.aElements	=	[];

		/**
		 * @name debug
	   * @desc Display the console.log
	   * @access public
	   * @instance
	   * @memberof LazyLoad
	   * @type {Boolean}
	   */
		this.debug	=	opts.debug === undefined || opts.debug === null ? false : opts.debug;

		/**
		 * @name setupListeners
	   * @desc associative array describing if we have to setup these listeners
	   * @access public
	   * @instance
	   * @memberof LazyLoad
	   * @type {Object}
	   */
		this.setupListeners	=	{
			resize: opts.setupListeners !== undefined && opts.setupListeners.resize !== undefined ? opts.setupListeners.resize : true,
			scroll: opts.setupListeners !== undefined && opts.setupListeners.scroll !== undefined ? opts.setupListeners.scroll : true,
			update: opts.setupListeners !== undefined && opts.setupListeners.update !== undefined ? opts.setupListeners.update : true
		};

		/**
		 * @name isMobile
	   * @desc If you want the lazy load to load the source provided in data-src-m
	   * @access public
	   * @instance
	   * @memberof LazyLoad
	   * @type {boolean}
	   */
		this.isMobile =	opts.isMobile === undefined || opts.isMobile === null ? false : opts.isMobile;

		/**
		 * @name aType
	   * @desc <p>Array of different types allowed with their extensions</p>
	   * <p>Types allowed:</p>
	   * <p><ul>
	   * <li>image (.gif, .png, .jpg, .svg, .webp)</li>
	   * <li>video (.mp4)</li>
	   * <li>iframe</li>
	   * </ul></p>
	   * @access public
	   * @instance
	   * @memberof LazyLoad
	   * @type {Object}
	   */
		this.aType = {
			image: ['gif', 'jpg', 'webp', 'png', 'svg'],
			video: ['mp4'],
			iframe: []
		};

		/**
		 * @name viewport
	   * @desc Viewport object representing the current width/height of the browser
	   * @access public
	   * @instance
	   * @memberof LazyLoad
	   * @type {Object}
	   */
		this.viewport = {
			height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
			width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
		};

		/**
		 * @name allLoaded
	   * @desc Are all the elements loaded?
	   * @access public
	   * @instance
	   * @memberof LazyLoad
	   * @type {boolean}
	   */
		this.allLoaded = false;

		/**
	   * Ticket to access the scrollY on RAF
	   * @access public
	   * @memberof LazyLoad
	   * @instance
	   * @type {boolean}
	   */
		this.ticketScroll = true;

		/**
	   * Current raf time
	   * @access public
	   * @memberof LazyLoad
	   * @instance
	   * @type {int}
	   */
		this.raf = null;

		/**
	   * Are the events binded?
	   * @access public
	   * @memberof LazyLoad
	   * @instance
	   * @type {boolean}
	   */
		this.isBinded = false;

		/**
	   * Current scrollY value
	   * @access public
	   * @memberof LazyLoad
	   * @instance
	   * @type {int}
	   */
		this.scrollY =  window.scrollY || window.pageYOffset;

		/**
	   * Contains all the handler references
	   * @access public
	   * @memberof LazyLoad
	   * @instance
	   * @type {Object}
	   */
		this.handlers = {
			onImageLoaded: _onImageLoaded.bind(this),
			onImageError: _errorImageLoad.bind(this),
			onScroll: this.onScroll.bind(this),
			onResize: this.onResize.bind(this),
			onUpdate: this.onUpdate.bind(this)
		};

	}


	/**
	 * @name EVENT
   * @desc List of events available to listen/trigger
   * <p><ul>
   * <li>ELEMENT_LOADED: Once an element is loaded.</li>
   * <li>COMPLETE: Once all the elements are loaded</li>
   * <ul></p>
   * @access public
   * @memberof LazyLoad
   * @static
   * @type {Object}
   */
	LazyLoad.EVENT = {
		ELEMENT_LOADED: 'onElementLoaded',
		ELEMENT_ERROR: 'onElementError',
		COMPLETE: 'onLazyLoadLoaded'
	};


	/**
	 * @name init
   * @desc Init the lazy load, starts the loading by binding the events scroll/raf
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.init = function() {

		this.scrollY = window.scrollY || document.documentElement.scrollTop;

		// fix IE
		if (!window.location.origin) {
			window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
		}

		// Init the elements + remove if errors. Previously used _.map but useless to load an entiere lib just for map...
		for (var i = this.elements.length - 1; i >= 0; i--) {

			var element = _createElements.call(this, this.elements[i], i, this.elements);

			if (element.error) {
				console.info('Lazyload error', element.errorMessage, this.elements[i]);
			} else {
				this.aElements.push(element);
			}

		}

		// remove references
		this.elements = null;

		this.bindEvents();

		// first pass
		this.load();

		return this;
	};

	/**
	 * @name bindEvents
   * @desc Bind the events
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.bindEvents = function() {

		if (this.isBinded) return this;

		if (this.debug) console.info('bindEvents', this);

		this.isBinded = true;

		if (this.setupListeners.scroll) window.addEventListener('scroll', this.handlers.onScroll);
		if (this.setupListeners.resize) window.addEventListener('resize', this.handlers.onResize);
		if (this.setupListeners.update) this.raf = window.requestAnimationFrame(this.handlers.onUpdate);

		return this;
	};


	/**
	 * @name unbindEvents
   * @desc Unbind the events
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.unbindEvents = function() {

		if (!this.isBinded) return this;

		this.isBinded = false;

		if (this.debug) console.info('unbindEvents', this);

		if (this.setupListeners.scroll) window.removeEventListener('scroll', this.handlers.onScroll);
		if (this.setupListeners.resize) window.removeEventListener('resize', this.handlers.onResize);
		if (this.setupListeners.update) window.cancelAnimationFrame(this.raf);

		return this;
	};


	/**
	 * @name reflow
   * @desc <p>Recalculate the position of all the elements</p>
   * <p>It's an expensive operation (triggers reflow in the document), be careful!</p>
   * @param {HTMLElement} [el] - If provided, reflows only this element
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.reflow = function(el_){

		var el = el_ !== undefined ? el_ : null;
		this.scrollY = window.scrollY || document.documentElement.scrollTop;

		for (var i = this.aElements.length - 1; i >= 0; i--) {

			if (el !== null) {

				// reflow only this one
				if (this.aElements[i].el === el)
					_reflow.call(this, this.aElements[i], false);

			} else {
				_reflow.call(this, this.aElements[i], false);
			}

		}

		// allow a new pass
		this.ticketScroll = true;

		return this;

	};


	/**
	 * @name reset
   * @desc <p>Reset all the elements in their initial state. It also removes the loaded elements from the DOM</p>
   * @param {HTMLElement} [el] - If provided, reset only this element
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.reset = function(el_){

		var el = el_ !== undefined ? el_ : null;

		for (var i = this.aElements.length - 1; i >= 0; i--) {

			if (el !== null) {

				// reflow only this one
				if (this.aElements[i].el === el)
					_reset.call(this, this.aElements[i]);

			} else {
				_reset.call(this, this.aElements[i]);
			}

		}

		if (el === null)
			this.allLoaded = false;

		// restart
		this.bindEvents();

		// allow a new pass
		this.ticketScroll = true;

		return this;

	};


	/**
	 * @name load
   * @desc <p>Starts loading all the visible elements, if they are not currently loading or already loaded</p>
   * @access public
   * @param {Boolean} [force] - If provided, force to load the elements
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.load = function(force_) {

		var force = force_ !== undefined ? force_ : false;

		for (var i = this.aElements.length - 1; i >= 0; i--) {

			var element = this.aElements[i];
			var isVisible = force ? true : _isVisible.call(this, element);

			if (this.debug) console.info('LazyLoad.prototype.load: load ?', element, 'isVisible', isVisible, 'loaded', element.isLoaded, 'loading?', element.isLoading);

			if (!isVisible || element.isLoaded || element.isLoading) continue;

			if (this.debug) console.info('LazyLoad.prototype.load: loading!', element);

			var type = this.isMobile ? element.typeMobile : element.type;

			switch (type) {
				case 'image': _loadImage.call(this, element); break;
				case 'video': _loadVideo.call(this, element); break;
				case 'iframe': _loadIframe.call(this, element); break;
			}
		}

		return this;

	};


	/**
	 * @name dispose
   * @desc <p>Clean the current instance: Unbind events, remove elements from the DOM...</p>
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.dispose = function() {

		this.unbindEvents();

		for (var i = this.aElements.length - 1; i >= 0; i--) {
			_reset.call(this, this.aElements[i]);
		}

		this.aElements.length = 0;
		this.aElements = [];

		this.el = null;

		return this;

	};

	// Events

	/**
	 * @name onResize
   * @desc <p>Call on resize of the browser. Could be used as an external callback</p>
   * @param {Object} [viewport_] - If provided, use it as the current viewport
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.onResize = function(viewport_) {
		this.viewport = viewport_ !== undefined && viewport_.toString() !== '[object Event]' ? viewport_ : {
			height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
			width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
		};

		if (this.debug) console.info('LazyLoad.prototype.onResize', this.viewport, this);

		this.reflow();

		return this;
	};

	/**
	 * @name onScroll
   * @desc <p>Call on scroll. Could be used as an external callback</p>
   * @param {number} [scrollY_] - If provided, use it as the current scrollY
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.onScroll = function(scrollY_) {
		if (scrollY_ !== undefined && typeof (scrollY_) === 'number') this.scrollY =  scrollY_;
		else {
			this.ticketScroll = true;
			_requestTick.call(this);
		}

		if (this.debug) console.info('LazyLoad.prototype.onScroll', this.scrollY, this);

		return this;
	};



	/**
	 * @name onUpdate
   * @desc <p>Call on update. Could be used as an external callback</p>
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.onUpdate = function(check_) {

		// once everything is loaded, no need to check
		if (this.allLoaded) return;

		var checkScrollY = check_ !== undefined ? check_ : this.ticketScroll;

		if (this.debug) console.info('LazyLoad.prototype.onUpdate', this);

		if (checkScrollY) this.scrollY = window.scrollY || window.pageYOffset;

		this.load();

		return this;
	};

	/**
	 * @name isVisible
   * @desc <p>Output visibility of each element</p>
   * @access public
   * @memberof LazyLoad
   * @function
   * @instance
   * @returns {LazyLoad} LazyLoad Current instance
   * @type function
   */
	LazyLoad.prototype.isVisible = function() {
		for (var i = this.aElements.length - 1; i >= 0; i--) {
			var element = this.aElements[i];
			_isVisible.call(this, element, true);
		}
	};

	/* Private */

	// Init

	var _createElements = function(el_, idx_, list_) {

		var element = _createBasicElement.call(this, el_);

		// SRC
		if ((el_ instanceof HTMLElement && el_.getAttribute('data-src') === null) || (!el_ instanceof HTMLElement && el_.src === undefined)) {
			element.error = true;
			element.errorMessage = 'no src provided';
			element.isLoaded = true;
			return element;
		}

		element.src = el_ instanceof HTMLElement ? el_.getAttribute('data-src').replace(' ', '') : el_.src;
		element.src = element.src.substr(0, 4) !== 'http' && element.src.substr(0, 2) !== '//' ?
										element.src.substr(0, 1) === '/' ?
											window.location.origin + element.src :
											window.location.origin + window.location.pathname + element.src :
										element.src;
		element.src = encodeURI(element.src);

		if (el_ instanceof HTMLElement)
			element.srcMobile = el_.getAttribute('data-src-m') !== null ? el_.getAttribute('data-src-m').replace(' ', '') : element.src;
		else
			element.srcMobile = el_.srcMobile !== undefined ? el_.srcMobile : element.src;

		element.srcMobile = element.srcMobile.substr(0, 4) !== 'http' && element.srcMobile.substr(0, 2) !== '//' ?
													element.srcMobile.substr(0, 1) === '/' ?
														window.location.origin + element.srcMobile :
														window.location.origin + window.location.pathname + element.srcMobile :
													element.srcMobile;
		element.srcMobile = encodeURI(element.srcMobile);

		// misc
		if (el_ instanceof HTMLElement) element.height = el_.getAttribute('data-height') !== null ? parseInt(el_.getAttribute('data-height'), 0) : el_.clientHeight;
		if (el_ instanceof HTMLElement) element.heightMobile = el_.getAttribute('data-height-m') !== null ? parseInt(el_.getAttribute('data-height-m'), 0) : el_.clientHeight;
		if (el_ instanceof HTMLElement) element.width = el_.getAttribute('data-width') !== null ? parseInt(el_.getAttribute('data-width'), 0) : el_.clientWidth;
		if (el_ instanceof HTMLElement) element.widthMobile = el_.getAttribute('data-width-m') !== null ? parseInt(el_.getAttribute('data-width-m'), 0) : el_.clientWidth;
		if (el_ instanceof HTMLElement) element.top = el_.getBoundingClientRect().top + this.scrollY;
		if (el_ instanceof HTMLElement) element.useBackground =  el_.getAttribute('data-use-background') !== null ? el_.getAttribute('data-use-background') === 'true' : false;

		if (el_ instanceof HTMLElement)
			element.type = el_.getAttribute('data-type') !== null ? _validateType.call(this, el_.getAttribute('data-type')) : _getType.call(this, element.src);
		else
			element.type = el_.type !== undefined ? _validateType.call(this, el_.type) : _getType.call(this, element.src);

		if (el_ instanceof HTMLElement)
			element.typeMobile = el_.getAttribute('data-type-m') ? _validateType.call(this, el_.getAttribute('data-type-m')) : _getType.call(this, element.srcMobile);
		else
			element.typeMobile = el_.typeMobile !== undefined ? _validateType.call(this, el_.typeMobile) : _getType.call(this, element.srcMobile);

		if (element.typeMobile === null && element.src === element.srcMobile)
			element.typeMobile = element.type;

		if (element.type === null) {
			element.error = true;
			element.errorMessage = 'no type recognized';
			element.isLoaded = true;
			return element;
		}

		if (el_ instanceof HTMLElement && el_.getAttribute('data-selector-container') !== null) {
			var selector = el_.getAttribute('data-selector-container');
			if (el_.querySelector(selector) !== null) element.appendContainer = el_.querySelector(selector);
		}

		return element;

	};

	var _createBasicElement = function(el_) {

		return {
			container: el_ instanceof HTMLElement ? el_ : null,
			appendContainer: el_ instanceof HTMLElement ? el_ : null,
			src: null,
			error: false,
			errorMessage: '',
			srcMobile: null,
			isLoaded: false,
			isLoading: false,
			isShown: false,
			useBackground: false,
			height: 0,
			heightMobile: 0,
			width: 0,
			widthMobile: 0,
			top: 0,
			type: null,
			typeMobile: null,
			directLoad: !el_ instanceof HTMLElement
		};

	};

	var _getType = function(src_) {

		var extension = src_.split('.').pop();
		extension = extension.split('?')[0].toLowerCase();

		for (var type in this.aType) {

			var extensions = this.aType[type];

			for (var i = extensions.length - 1; i >= 0; i--) {
				if (extensions[i] === extension)
					return type;
			}

		}

		return null;

	};

	var _validateType = function(type_) {

		for (var type in this.aType) {
			if (type === type_.toLowerCase()) return type;
		}

		return null;
	};


	// Actions

	var _loadImage = function(element_) {

		element_.xhr = null;
		element_.isLoading = true;

		// create image
		var img = new Image();
		var src = this.isMobile ? element_.srcMobile : element_.src;
		element_.el = img;

		var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

		// Trigger the loading with a XHR request
		if ( !isSafari && window.URL && window.Blob && window.XMLHttpRequest) {

			var xhr = new XMLHttpRequest();
			xhr.open( 'GET', src, true );
			xhr.responseType = 'arraybuffer';

			element_.xhr = xhr;

			xhr.onerror = (function(e) {

				element_.xhr.abort();
				element_.xhr = null;

				// load old fashion way
				if (img.complete && img.height) {
					_onImageLoaded.call(this, img, element_);
				} else {
					img.addEventListener('load', this.handlers.onImageLoaded);
					img.addEventListener('onerror', this.handlers.onImageError);
					img.src = src;
				}

			}).bind(this);

			xhr.onload = (function(e) {

				if (xhr.readyState === 4) {

					if ( xhr.status === 200) {

						var extension = src.split('.').pop();
						extension = extension.split('?')[0].toLowerCase();

				    // Obtain a blob: URL for the image data.
						var arrayBufferView = new window.Uint8Array(xhr.response);
						var blob = new Blob( [ arrayBufferView ], {type: 'image/' + extension} );
						var imageUrl = URL.createObjectURL(blob);

				    // load from the cache as the blob is here already
						img.addEventListener('load', this.handlers.onImageLoaded);
						img.addEventListener('onerror', this.handlers.onImageError);
						img.src = imageUrl;

					} else {

						element_.xhr.abort();
						element_.xhr = null;

						 // something went wrong..
						img.addEventListener('load', this.handlers.onImageLoaded);
						img.addEventListener('onerror', this.handlers.onImageError);
						img.src = src;

					}

				}

			}).bind(this);

			xhr.send();

		} else {

			// load old fashion way
			if (img.complete) {
				_onImageLoaded.call(this, img, element_);
			} else {
				img.addEventListener('load', this.handlers.onImageLoaded);
				img.addEventListener('onerror', this.handlers.onImageError);
				img.src = src;
			}

		}

	};

	var _errorImageLoad = function(e) {

		var img_ = e instanceof HTMLElement ? e : e.target || e.path[0];

		// retrieve element
		var element_ = null;
		for (var i in this.aElements) {
			if (this.aElements[i].el === img_) {
				element_ = this.aElements[i];
				break;
			}
		}

		if (element_ === null) return;

		// remove listener otherwise it keeps triggering if no cache
		img_.removeEventListener('load', this.handlers.onImageLoaded);
		img_.removeEventListener('onerror', this.handlers.onImageError);

		element_.isLoaded = true;
		element_.isLoading = false;

		if (element_.xhr !== null) element_.xhr = null;

		var event = new CustomEvent(LazyLoad.EVENT.ELEMENT_ERROR, {detail: element_});
		this.el.dispatchEvent(event);

		_checkIfAllLoaded.call(this);

	};

	var _onImageLoaded = function(e) {

		var img_ = e instanceof HTMLElement ? e : e.target || e.path[0];

		// retrieve element
		var element_ = null;
		for (var i in this.aElements) {
			if (this.aElements[i].el === img_) {
				element_ = this.aElements[i];
				break;
			}
		}

		if (element_ === null) return;

		// remove listener otherwise it keeps triggering if no cache
		img_.removeEventListener('load', this.handlers.onImageLoaded);

		element_.isLoaded = true;
		element_.isLoading = false;

		var src = this.isMobile ? element_.srcMobile : element_.src;

		if (!element_.useBackground) {
			// Pinterest!
			var pinSrc = src.substr(0, 4) !== 'http' ?  window.location.protocol + src : src;

			element_.el.setAttribute('data-pin-media', pinSrc);
			element_.el.setAttribute('srcset', pinSrc);
			element_.el.setAttribute('data-pin-url', window.location.pathname);
		}

		// Clean URL
		if (window.URL && element_.xhr !== null) {
			window.URL.revokeObjectURL(img_.src);
		}

		if (element_.xhr !== null)
			element_.xhr = null;

		if (element_.appendContainer !== null)
			element_.useBackground ? element_.appendContainer.style.backgroundImage = "url('" + src + "')" : element_.appendContainer.appendChild(element_.el);

		_showElement.call(this, element_);

	};

	var _loadVideo = function(element_) {

		element_.isLoading = true;

		var vid = document.createElement('video');
		element_.el = vid;

		vid.autoplay 	= element_.container !== null && element_.container.getAttribute('data-autoplay') !== null ? element_.container.getAttribute('data-autoplay') : true;
		vid.muted 		= element_.container !== null && element_.container.getAttribute('data-muted') !== null ? element_.container.getAttribute('data-muted') : true;
		vid.loop 			= element_.container !== null && element_.container.getAttribute('data-loop') !== null ? element_.container.getAttribute('data-loop') : true;
		vid.controls 	= element_.container !== null && element_.container.getAttribute('data-controls') !== null ? element_.container.getAttribute('data-controls') : false;

		vid.src = this.isMobile ? element_.srcMobile : element_.src;

		vid.onloadedmetadata = function(){

			element_.isLoaded = true;
			element_.isLoading = false;

			vid.onloadedmetadata = null;

			if (element_.appendContainer !== null) element_.appendContainer.appendChild(vid);

			_showElement.call(this, element_);

		}.bind(this);

	};

	var _loadIframe = function(element_) {

		element_.isLoading = true;
		element_.xhr = null;

		if (XMLHttpRequest) {

			var xhr = new XMLHttpRequest();
			xhr.open('GET', element_.src, true);
			xhr.responseType = 'document';

			element_.xhr = xhr;

			xhr.onreadystatechange = (function(e) {

				if (xhr.readyState !== 4) return;

				// What about errors? 200 doesn't seem to ever come, probably a security stuff.
				// if (xhr.status !== 200) return;

				_iframeLoaded.call(this, element_);

			}).bind(this);

			xhr.send(null);

		} else {
			_iframeLoaded.call(this, element_);
		}

	};

	var _iframeLoaded = function(element_) {

		element_.isLoaded = true;
		element_.isLoading = false;

		if (element_.xhr !== null)
			element_.xhr = null;

		var iframe = document.createElement('iframe');
		iframe.src = element_.src;

		if (element_.appendContainer !== null) element_.appendContainer.appendChild(iframe);
		element_.el = iframe;

		_showElement.call(this, element_);

	};

	var _showElement = function(element_) {

		var event = new CustomEvent(LazyLoad.EVENT.ELEMENT_LOADED, {detail: element_});
		this.el.dispatchEvent(event);

		setTimeout((function(){

			if (element_.container !== null) {
				element_.container.classList.add('show');
				element_.container.classList.add('loaded');
			}

			element_.isShown = true;

		}).bind(this), 300);

		_checkIfAllLoaded.call(this);

	};

	var _checkIfAllLoaded = function() {

		var check = true;

		for (var i = this.aElements.length - 1; i >= 0; i--) {
			if (!this.aElements[i].isLoaded) check = false;
		}

		if (check) {

			var event = new CustomEvent(LazyLoad.EVENT.COMPLETE);
			this.el.dispatchEvent(event);

			this.allLoaded = true;
			this.unbindEvents();
		}
	};

	var _reflow = function(element_, refreshScroll_){
		// no need
		if (element_.isLoaded) return;

		// force to update the scrollY
		var refreshScroll = refreshScroll_ !== undefined ? refreshScroll_ : true;

		if (refreshScroll)
			this.scrollY = window.scrollY || window.pageYOffset;

		if (element_.container !== null) element_.top = element_.container.getBoundingClientRect().top + this.scrollY;
	};

	var _reset = function(element_) {

		if (element_.xhr !== undefined && element_.xhr !== null) {
			element_.xhr.abort();
			element_.xhr = null;
		}

		element_.isLoaded = false;
		element_.isLoading = false;

		if (element_.container !== null) {
			element_.container.classList.remove('show');
			element_.container.classList.remove('loaded');
		}

		if (element_.el !== undefined && element_.el.parentNode !== null)
			element_.el.parentNode.removeChild(element_.el);

	};

	var _isVisible = function(element_, output_){
		if (element_.directLoad) return true;

		var top = element_.top;
		var h = this.isMobile ? element_.heightMobile : element_.height;

		if (output_) {
			console.info('is visible ?', (top <= this.viewport.height + this.scrollY && top + h >= this.scrollY), element_, this);
		}

		return (top <= this.viewport.height + this.scrollY && top + h >= this.scrollY);
	};

	var _requestTick = function() {
		if (this.debug) console.info('_requestTick', this.ticketScroll, this);

		if (this.ticketScroll && this.setupListeners.update) {
			this.raf = window.requestAnimationFrame(this.handlers.onUpdate);
		}

		this.ticketScroll = false;
	};


	/* Expose */

	//Expose LazyLoad as either a global variable or a require.js module.
	if (typeof define === 'function' && define.amd) {
		define([], function() {
			return LazyLoad;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = LazyLoad;
	} else {
		window.LazyLoad = LazyLoad;
	}

}(window, document));