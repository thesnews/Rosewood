if( !window['Rose'] ) {
	Rose = {};
}
(function() {

	var SlideShow = new Class({

		_container: false,
		_slides: false,
		_pagerContainer: false,
		
		_defaultOptions: $H({
			autoStart: true,
			pauseOnHover: true,
			
			slideClass: 'slide',
			descriptionClass: 'description',
			pagerContainerClass: 'pagers',
			pagerActiveClass: 'active',
			
			showPagers: false,
			
			onStart: $empty,
			onStop: $empty,
			onNext: $empty,
			onPrevious: $empty
		}),
		
		_options: $H({}),
		
		_currentIndex: 0,
		
		_boundSlideEvent: false,
		_boundPauseEvent: false,
		_boundPlayEvent: false,
		
		_timer: false,
		
		initialize: function(el) {
			
			this._container = $(el);
			
			if( arguments[1] ) {
				this._options = $H(arguments[1]);
			}
			this._options.combine( this._defaultOptions );
			
			this._slides = el.getChildren();
			var minHeight = 10000;
			
			this._container.setStyles({
				'position': 'relative',
				'overflow': 'hidden'
			});
			
			this._pagerContainer = new Element('div');
			if( this._options.get('pagerContainerClass') ) {
				this._pagerContainer.addClass(this._options.get(
					'pagerContainerClass'));
			}
			
			this._pagerContainer.injectBefore(this._container);
			
			var width = this._container.getSize().x;
			
			this._slides.each(function(el, idx) {
				el.setStyles({
					'display': 'block',
					'position': 'absolute',
					'top': 0,
					'left': 0
				});
				
				if( this._options.get('slideClass') ) {
					el.addClass(this._options.get('slideClass'));
				}

				var desc = el.getLast();
				var offset = parseInt(desc.getStyle('margin'));
				if( !offset ) {
					offset = 10;
				}
				desc.setStyles({
					'display': 'block',
					'position': 'absolute',
					'bottom': (offset/2)+'px',
					'left': (offset/2)+'px',
					'margin': 'auto',
					'width': width-(offset*2)
				});
				
				if( this._options.get('descriptionClass') ) {
					desc.addClass(this._options.get('descriptionClass'));
				}
				
				if( idx > 0 ) {
					el.fade('hide');
				}
				
			}.bind(this));
			
			this._boundSlideEvent = this.next.bind(this);
			this._boundPlayEvent = this.start.bind(this);
			this._boundPauseEvent = this.pause.bind(this);
			
			this._buildPagers();
			
			this.start();
			this.goTo(0);
		},
		
		start: function() {
			this._timer = setInterval(this._boundSlideEvent, 5000);
			if( this._options.get('pauseOnHover') ) {
				this._container.addEvent('mouseenter', this._boundPauseEvent);
				this._container.addEvent('mouseleave', this._boundPlayEvent);
			}
		},
		
		pause: function() {
			clearInterval(this._timer);
		},
		
		stop: function() {
			clearInterval(this._timer);
			if( this._options.get('pauseOnHover') ) {
				this._container.removeEvent('mouseenter',
					this._boundPauseEvent);
				this._container.removeEvent('mouseleave', this._boundPlayEvent);
			}
		},
		
		next: function() {
			this.goTo((this._currentIndex+1));
		},
		
		previous: function() {
			this.goTo((this._currentIndex-1));
		},
		
		goTo: function(num) {
			if( num >= this._slides.length ) {
				num = 0;
			} else if(num < 0 ) {
				num = this._slides.length - 1;
			}
			
			var current = this._slides[this._currentIndex];
			var next = this._slides[num];
			
			current.fade('out');
			next.fade('in');
			
			this._currentIndex = num;
			
			var cls = false;
			
			if( (cls = this._options.get('pagerActiveClass')) ) {
				this._pagerContainer.getChildren().removeClass(cls);
				this._pagerContainer.getChildren('.pager'+num).addClass(cls);
			}
			
			
		},
		
		_buildPagers: function() {
			for(var i=0; i<this._slides.length; i++ ) {
				this._pagerContainer.adopt(new Element('a', {
					'href': '#',
					'text': (i+1),
					'rel': i,
					'class': 'pager'+i,
					'events': {
						'click': function(e) {
							e.stop();
							this.stop();
							
							this.goTo(e.target.get('rel'));
						}.bind(this)
					}
				}));
			}
		}
		
	});
	
	Element.implement({
		slideShow: function() {
			new SlideShow(this, arguments[0]);
			return this;
		}
	});

})();