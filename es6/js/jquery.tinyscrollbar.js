;
(function(factory) {
		if (typeof define === 'function' && define.amd) {
			define(['jquery'], factory);
		} else if (typeof exports === 'object') {
			module.exports = factory(require('jquery'));
		} else {
			factory(jQuery);
		}
	}
	(function($) {
		'use strict';
		var pluginName = 'tinyscrollbar',
			defaults = {
				// axis: 'y',
				wheel: true,
				wheelSpeed: 40,
				wheelLock: true,
				touchLock: true,
				trackSize: false,
				slideSize: false,
				slideSizeMin: 50
			};

		function Plugin($container, options) {
			/**
			 * The options of the carousel extend with the defaults.
			 *
			 * @property options
			 * @type Object
			 */
			this.options = $.extend({}, defaults, options);
			/**
			 * @property _defaults
			 * @type Object
			 * @private
			 * @default defaults
			 */
			this._defaults = defaults;
			/**
			 * @property _name
			 * @type String
			 * @private
			 * @final
			 * @default 'tinyscrollbar'
			 */
			this._name = pluginName;
			var self = this,
				// $viewport = $container,
				$overview = $container.find('.overview'),
				$scrollbar = $container.find('.scrollbar'),
				// $track = $scrollbar.find('.track'),
				$slide = $scrollbar.find('.slide'),
				hasTouchEvents = ('ontouchstart' in document.documentElement),
				wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
				document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
				'DOMMouseScroll' // let's assume that remaining browsers are older Firefox
				,
				mousePosition = 0;
			/**
			 * The position of the content relative to the viewport.
			 *
			 * @property contentPosition
			 * @type Number
			 */
			this.contentPosition = 0;
			/**
			 * The height or width of the viewport.
			 *
			 * @property viewportSize
			 * @type Number
			 */
			this.viewportSize = 0;
			/**
			 * The height or width of the content.
			 *
			 * @property contentSize
			 * @type Number
			 */
			this.contentSize = 0;
			/**
			 * The ratio of the content size relative to the viewport size.
			 *
			 * @property contentRatio
			 * @type Number
			 */
			this.contentRatio = 0;
			/**
			 * The height or width of the content.
			 *
			 * @property trackSize
			 * @type Number
			 */
			this.trackSize = 0;
			/**
			 * The size of the track relative to the size of the content.
			 *
			 * @property trackRatio
			 * @type Number
			 */
			this.trackRatio = 0;
			/**
			 * The height or width of the slide.
			 *
			 * @property slideSize
			 * @type Number
			 */
			this.slideSize = 0;
			/**
			 * The position of the slide relative to the track.
			 *
			 * @property slidePosition
			 * @type Number
			 */
			this.slidePosition = 0;
			/**
			 * Will be true if there is content to scroll.
			 *
			 * @property hasContentToSroll
			 * @type Boolean
			 */
			this.hasContentToSroll = false;
			/**
			 * @method _initialize
			 * @private
			 */
			function _initialize() {
				self.update();
				_setEvents();
				return self;
			}
			/**
			 * You can use the update method to adjust the scrollbar to new content or to move the scrollbar to a certain point.
			 *
			 * @method update
			 * @chainable
			 * @param {Number|String} [scrollTo] Number in pixels or the values "relative" or "bottom". If you dont specify a parameter it will default to top
			 */
			this.update = function(scrollTo) {
				this.viewportSize = $container.outerHeight();
				this.contentSize = $overview.outerHeight();
				this.contentRatio = this.viewportSize / this.contentSize;
				this.trackSize = this.options.trackSize || this.viewportSize;
				this.slideSize = Math.min(this.trackSize, Math.max(this.options.slideSizeMin, (this.options.slideSize || (this.trackSize * this.contentRatio))));
				this.trackRatio = (this.contentSize - this.viewportSize) / (this.trackSize - this.slideSize);
				this.hasContentToSroll = this.contentRatio < 1;
				$scrollbar.toggleClass('disable', !this.hasContentToSroll);
				switch (scrollTo) {
					case 'bottom':
						this.contentPosition = Math.max(this.contentSize - this.viewportSize, 0);
						break;
					case 'relative':
						this.contentPosition = Math.min(Math.max(this.contentSize - this.viewportSize, 0), Math.max(0, this.contentPosition));
						break;
					default:
						this.contentPosition = parseInt(scrollTo, 10) || 0;
				}
				this.slidePosition = this.contentPosition / this.trackRatio;
				_setCss();
				return self;
			};
			/**
			 * @method _setCss
			 * @private
			 */
			function _setCss() {
				$slide.css('top', self.slidePosition);
				$overview.css('top', -self.contentPosition);
				$scrollbar.css('height', self.trackSize);
				$slide.css('height', self.slideSize);
			}
			/**
			 * @method _setEvents
			 * @private
			 */
			function _setEvents() {
				if (hasTouchEvents) {
					$container[0].ontouchstart = function(event) {
						if (1 === event.touches.length) {
							event.stopPropagation();
							_start(event.touches[0]);
						}
					};
				}
				$slide.bind('mousedown', function(event) {
					event.stopPropagation();
					_start(event);
				});
				$scrollbar.bind('mousedown', function(event) {
					_start(event, true);
				});
				$(window).resize(function() {
					self.update('relative');
				});
				if (self.options.wheel && window.addEventListener) {
					$container[0].addEventListener(wheelEvent, _wheel, false);
				} else if (self.options.wheel) {
					$container[0].onmousewheel = _wheel;
				}
			}
			/**
			 * @method _isAtBegin
			 * @private
			 */
			function _isAtBegin() {
				return self.contentPosition > 0;
			}
			/**
			 * @method _isAtEnd
			 * @private
			 */
			function _isAtEnd() {
				return self.contentPosition <= (self.contentSize - self.viewportSize) - 5;
			}
			/**
			 * @method _start
			 * @private
			 */
			function _start(event, gotoMouse) {
				if (self.hasContentToSroll) {
					$('body').addClass('noSelect');
					mousePosition = gotoMouse ? $slide.offset()['top'] : event.pageY;
					if (hasTouchEvents) {
						document.ontouchmove = function(event) {
							if (self.options.touchLock || _isAtBegin() && _isAtEnd()) {
								event.preventDefault();
							}
							event.touches[0][pluginName + 'Touch'] = 1;
							_drag(event.touches[0]);
						};
						document.ontouchend = _end;
					}
					$(document).bind('mousemove', _drag);
					$(document).bind('mouseup', _end);
					$slide.bind('mouseup', _end);
					$scrollbar.bind('mouseup', _end);
					_drag(event);
				}
			}
			/**
			 * @method _wheel
			 * @private
			 */
			function _wheel(event) {
				if (event.ctrlKey) return;
				if (self.hasContentToSroll) {
					// Trying to make sense of all the different wheel event implementations..
					//
					var evntObj = event || window.event,
						wheelDelta = -(evntObj.deltaY || evntObj.detail || (-1 / 3 * evntObj.wheelDelta)) / 40,
						multiply = (evntObj.deltaMode === 1) ? self.options.wheelSpeed : 1;
					self.contentPosition -= wheelDelta * multiply * self.options.wheelSpeed;
					self.contentPosition = Math.min((self.contentSize - self.viewportSize), Math.max(0, self.contentPosition));
					self.slidePosition = self.contentPosition / self.trackRatio;
					/**
					 * The move event will trigger when the carousel slides to a new slide.
					 *
					 * @event move
					 */
					$container.trigger('move');
					$slide.css('top', self.slidePosition);
					$overview.css('top', -self.contentPosition);
					if (self.options.wheelLock || _isAtBegin() && _isAtEnd()) {
						evntObj = $.event.fix(evntObj);
						evntObj.preventDefault();
					}
				}
				event.stopPropagation();
			}
			/**
			 * @method _drag
			 * @private
			 */
			function _drag(event) {
				if (self.hasContentToSroll) {
					var mousePositionNew = event.pageY,
						slidePositionDelta = event[pluginName + 'Touch'] ? (mousePosition - mousePositionNew) : (mousePositionNew - mousePosition),
						slidePositionNew = Math.min((self.trackSize - self.slideSize), Math.max(0, self.slidePosition + slidePositionDelta));
					self.contentPosition = slidePositionNew * self.trackRatio;
					$container.trigger('move');
					$slide.css('top', slidePositionNew);
					$overview.css('top', -self.contentPosition);
				}
			}
			/**
			 * @method _end
			 * @private
			 */
			function _end() {
				self.slidePosition = parseInt($slide.css('top'), 10) || 0;
				$('body').removeClass('noSelect');
				$(document).unbind('mousemove', _drag);
				$(document).unbind('mouseup', _end);
				$slide.unbind('mouseup', _end);
				$scrollbar.unbind('mouseup', _end);
				document.ontouchmove = document.ontouchend = null;
			}
			return _initialize();
		}
		/**
		* @class tinyscrollbar
		* @constructor
		* @param {Object} options
		    @param {String} [options.axis='y'] Vertical or horizontal scroller? ( x || y ).
		    @param {Boolean} [options.wheel=true] Enable or disable the mousewheel.
		    @param {Boolean} [options.wheelSpeed=40] How many pixels must the mouswheel scroll at a time.
		    @param {Boolean} [options.wheelLock=true] Lock default window wheel scrolling when there is no more content to scroll.
		    @param {Number} [options.touchLock=true] Lock default window touch scrolling when there is no more content to scroll.
		    @param {Boolean|Number} [options.trackSize=false] Set the size of the scrollbar to auto(false) or a fixed number.
		    @param {Boolean|Number} [options.slideSize=false] Set the size of the slide to auto(false) or a fixed number
		    @param {Boolean} [options.slideSizeMin=20] Minimum slide size.
		*/
		$.fn[pluginName] = function(options = {}) {
			let obj = $(this).data('plugin_scrollbar');
			if (!obj) {
				let $frame = $(this).parent();
				if ($frame.find('.scrollbar').length == 0) {
					$frame.append('<div class="scrollbar"><div class="slide"></div></div>');
				}
				$(this).addClass('overview').wrap('<div class="viewport"></div>');
				// .css({
				// 	width: options.width || '100%'
				// });
				if ($('style.scrollbar').length == 0) {
					$('head').append('<style class="scrollbar">.overview{width:100%;height:auto;position:absolute;transition:all 0.2s ease}.viewport:hover~.scrollbar{opacity:0.9}.viewport{height:100%;overflow:hidden;position:relative}.scrollbar{opacity: 0.2;background: linear-gradient(#eee, #999 10% 90%, #eee);transition: all 2s ease;position:absolute;width:14px;right:0;top:0}.slide{transition: all 0.3s ease;box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8);background:#666;height:20px;width:10px;cursor:pointer;position:absolute;top:0;left:2px;border-radius:10px}.disable>.slide {display: none}.noSelect{user-select:none;-o-user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none}</style>');
				}
				obj = new Plugin($frame, options);
				$(this).data('plugin_scrollbar', obj);
				return obj;
			} else {
				obj.update();
			}
		};
	}));