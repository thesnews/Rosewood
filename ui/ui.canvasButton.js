if( !window['Rose'] ) {
	Rose = {};
}
(function() {

	var CanvasButton = new Class({

		_element: false,

		_defaultOptions: $H({
			buttonClass: 'rose_canvasButton',
			borderRadius: 3,
			style: false,
			defaultStyle: false,
			disabledStyle: false
		}),
		
		_styles: $H({
			'default': {
				fill: '270-#f1f1f1-#e1e1e1:90-#999',
				stroke: '#c0c0c0',
				color: '#333',
				shadow: '#fff'
			},
			'blue': {
				fill: '270-#4e6bb4-#405893:90-#999',
				stroke: '#369',
				color: '#fff',
				shadow: '#999'
			},
			'gray': {
				fill: '270-#898989-#636363:90-#999',
				stroke: '#999',
				color: '#fff',
				shadow: '#333'
			}
		}),
		
		_options: $H({}),
		
		_disabled: false,
		
		_paper: false,
		
		_dimensions: {
			height: 0,
			width: 0,
			innerHeight: 0,
			innerWidth: 0
		},
		
		_button: false,
		_text: false,
		_textShadow: false,
		
		_primaryIcon: false,
		_secondaryIcon: false,
		
		_context: 'single',
		
		container: false,
		
		initialize: function(el) {
			if( arguments[1] ) {
				this._options = $H(arguments[1]);
			}

			this._options.combine(this._defaultOptions);
			this._element = $(el);
			
			var coords = this._element.getCoordinates();
			
			var text = this.getText();

			this._dimensions.height = 23;
			this._dimensions.innerHeight = 22;
			this._dimensions.width = coords.width + 10;
			this._dimensions.innerWidth = this._dimensions.width-1;
			
			this.container = new Element('div', {
				'styles': {
					'margin': 0,
					'padding': 0,
					'width': this._dimensions.innerWidth,
					'float': 'left'
			}
			});
			
			if( this._options.get('buttonClass') ) {
				this.container.addClass(this._options.get('buttonClass'));
			}
			
			if( parseInt(this._element.getStyle('width')) ) {
				this._dimensions.width = parseInt(
					this._element.getStyle('width'))+10;
				this._dimensions.innerWidth = this._dimensions.width-1;
			}
			if( parseInt(this._element.getStyle('height')) ) {
				this._dimensions.height = parseInt(
					this._element.getStyle('height'));
				this._dimensions.innerHeight = this._dimensions.height-1;
			}

			this.container.inject(this._element, 'after');

			$(document.body).adopt(this._element);
			
			this._paper = Raphael(this.container,
				this._dimensions.width, this._dimensions.height);

			this._button = this._paper.rect(0, 0, this._dimensions.innerWidth,
				this._dimensions.innerHeight,
				this._options.get('borderRadius'));
				

			this.setText(text);
			
			this.setPrimaryIcon();
			this.setSecondaryIcon();
			
			if( !this._options.get('defaultStyle') ) {
				this._options.set('defaultStyle', this._styles.get('default'));
			}
			
			if( this._options.get('style') ) {
				this._options.set('defaultStyle', this._options.get('style'));
			}
			
			if( !this._options.get('disabledStyle') ) {
				this._options.set('disabledStyle', this._options.get(
					'defaultStyle'));
			}
			
			if( this._element.get('class').length ) {
			var classes = this._element.get('class').split(' ');
			classes.each(function(val) {
				if( this._styles.get(val) ) {
					style = val;
					return;
				}
			}.bind(this));
			}
			
			this.setStyle(this._options.get('defaultStyle'));
			this._registerEvents();
			
			this.registerClickTarget();
			// we hide the element at first so subsequent buttons aren't 
			// accidentally covered by this button's click target
			this._element.setStyle('display', 'none');			
			this._element.disposeWith(this.container);

			if( this._element.get('disable') ) {
				this.setDisabled(true);
			}
		},

		registerClickTarget: function() {
			this._element.setStyle('display', '');
			this._element.setStyles({
				'position': 'absolute',
				'top': this.container.getCoordinates().top,
				'left': this.container.getCoordinates().left,
				'width': this._button.attr('width'),
				'height': this._button.attr('height'),
				'display': 'block',
				'background': '#000',
				'opacity': 0.01
			});
			if( this._disabled ) {
				this._element.setStyle('display', 'none');
			}
		},
		
		setText: function(str) {
			this._text = this._paper.text(this._dimensions.width/2,
				this._dimensions.height/2, str);
			this._textShadow = this._paper.text(this._paper.width/2,
				(this._paper.height/2)-1, str);


			this._textShadow.insertBefore(this._text);
			
			this._text.attr({
				'font-size': '10px',
				'font-weight': 'bold',
				'fill': '#333'
			});
			this._textShadow.attr({
				'font-size': '10px',
				'font-weight': 'bold',
				'fill': '#fff'
			});
		},

		getText: function() {
			if( this._element.get('label') ) {
				return this._element.get('label');
			}
			switch(this._element.get('tag')) {
				case 'input':
					return this._element.get('value');
					break;
				case 'a':
				case 'span':
					return this._element.get('text');
					break;
			}
		},
		
		setStyle: function(style) {
			this._button.attr({
				'fill': style.fill,
				'stroke': style.stroke
			});
			this._text.attr({
				'fill': style.color
			});
			this._textShadow.attr({
				'fill': style.shadow
			});
		},
		
		setPrimaryIcon: function() {
			var path = this._element.get('icon');
			if( !path ) {
				return false;
			}
			
			// move everything over
			this._dimensions.width += 26;
			this._dimensions.innerWidth += 24;
	
			this._paper.setSize(this._dimensions.width,
				this._dimensions.height);
			this._button.attr({
				'x': 0,
				'width': this._dimensions.innerWidth
			});
			this.container.setStyles({
				'width': this._dimensions.innerWidth
			});
			this._text.attr({
				'x': (this._dimensions.width/2)+10
			});
			this._textShadow.attr({
				'x': (this._dimensions.width/2)+10
			});
		
			/* Ryan cleared up icons, moved them left a smidge
			
			this._primaryIcon = this._paper.image(path, 10,
				(this._dimensions.height/2)-8, 16, 16);
			*/
			var heightOffset = this._dimensions.height;
			
			if( heightOffset%2 != 0 ) {
				heightOffset--;
			}
			
			this._primaryIcon = this._paper.image(path, 7,
				(heightOffset/2)-8, 16, 16);
		},
				
		setSecondaryIcon: function() {
			var path = this._element.get('secondary-icon');
			if( !path ) {
				return false;
			}
			
			this._dimensions.width += 10;
			this._dimensions.innerWidth += 8;

			this._paper.setSize(this._dimensions.width,
				this._dimensions.height);
			this._button.attr({
				'x': 0,
				'width': this._dimensions.innerWidth
			});
			this.container.setStyles({
				'width': this._dimensions.innerWidth
			});
		
		
			/* Ryan cleared up icons
			this._secondaryIcon = this._paper.image(path, 
				this._dimensions.width-16,	(this._dimensions.height/2)-2, 6, 4);
			*/
			
			var heightOffset = this._dimensions.height;
			
			if( heightOffset%2 != 0 ) {
				heightOffset--;
			}
			
			this._secondaryIcon = this._paper.image(path, 
				this._dimensions.width-16,	(heightOffset/2)-2, 6, 4);
		},

		setDisabled: function(flag) {
			this._disabled = flag;
			if( flag ) {
				this._element.setStyle('display', 'none');
				this.setStyle(this._options.get('disabledStyle'));
				if( this._primaryIcon ) {
					this._primaryIcon.attr({
						'opacity': 0.5
					});
				}
				if( this._secondaryIcon ) {
					this._secondaryIcon.attr({
						'opacity': 0.5
					});
				}
			} else {
				this._element.setStyle('display', '');
				this.setStyle(this._options.get('defaultStyle'));
				if( this._primaryIcon ) {
					this._primaryIcon.attr({
						'opacity': 1
					});
				}
				if( this._secondaryIcon ) {
					this._secondaryIcon.attr({
						'opacity': 1
					});
				}
			}
		},
		
		setContext: function(context) {
		
		},
		
		getNode: function() {
			return this._button.node;
		},
		
		_registerEvents: function() {
			this._button.node.onmouseover = function() {
				this.registerClickTarget();
			}.bind(this);
		
			this._element.addEvents({
				'mousedown': function(e) {
					if( this._disabled ) {
						e.stop();
						return;
					}
					this._button.rotate(180, true);
				}.bind(this),
				'mouseup':  function(e) {
					if( this._disabled ) {
						e.stop();
						return;
					}
					this._button.rotate(0, true);
					if( this._element.get('tag') == 'input' &&
						this._element.get('type') == 'submit' &&
						$(this._button.node).getParents('form').length ) {
						$(this._button.node).getParents('form')[0].submit();
					}
				}.bind(this)
			});
			
		}

	});
	
	Element.implement({
		canvasButton: function() {
			if( this.retrieve('canvasButton') ) {
				return this.retrieve('canvasButton');
			}
			
			var obj = new CanvasButton(this, arguments[0]);

			this.store('canvasButton', obj);

			return this;
		},
		canvasButtonGroup: function() {
			var args = arguments[0];
			
			var total = this.getChildren().length;
			
			this.getChildren().each(function(el, idx) {
				var obj = new CanvasButton(el, args);
				el.store('canvasButton', obj);

				var offset = obj._options.get('borderRadius');
				
				// first, we deal with all the buttons after the first one
				if( idx >= 1 ) {
					// special case, the buttons between the first and the last
					// need to be widened a bit more
					if( idx < total-1 ) {
						offset = offset * 2;
					}

					// we move the button SVG over as much as the border radius
					// this moves it out of the visible area, then we increase
					// the width by just as much. This clips the edge of the
					// button off
					obj._button.attr({
						'x': '-'+obj._options.get('borderRadius'),
						'width': obj._button.attr('width')+offset
					});
					
					// then we add a path along the edge to look like a stroke
					// this gives the impression of straight corners for all
					// of the inside buttons
					var pth = obj._paper.path('M0 0L0 100');
					pth.attr({'stroke': obj._button.attr('stroke')});
				} else {
					// the first button we just increase the size to hide
					// the right side border
					obj._button.attr({
						'width': obj._button.attr('width')+offset
					});
				}
				
			});

			return this;
		}
	});
		
})();