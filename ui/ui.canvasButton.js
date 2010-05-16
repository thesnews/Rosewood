if( !window['Rose'] ) {
	Rose = {};
}
(function() {

	var CanvasButton = new Class({

		_element: false,

		_defaultOptions: $H({
			buttonClass: 'rose_canvasButton',
			borderRadius: 5
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
					'margin-right': '1em',
					'float': 'left'
			}
			});
			
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
			
			var style = 'default';
			var classes = this._element.get('class').split(' ');
			classes.each(function(val) {
				if( this._styles.get(val) ) {
					style = val;
					return;
				}
			}.bind(this));
			
			this.setStyle(this._styles.get(style));
			this._registerEvents();
			
			this.registerClickTarget();

			this._element.disposeWith(this.container);
		},

		registerClickTarget: function() {
			this._element.setStyles({
				'position': 'absolute',
				'top': this.container.getCoordinates().top,
				'left': this.container.getCoordinates().left,
				'width': this._dimensions.width,
				'height': this._dimensions.height,
				'display': 'block',
				'background': '#000',
				'opacity': 0.01
			});
		},
		
		setText: function(str) {
			this._text = this._paper.text(this._dimensions.width/2,
				this._dimensions.height/2, str);
			this._textShadow = this._paper.text(this._paper.width/2,
				(this._paper.height/2)-1, str);


			this._textShadow.insertBefore(this._text);
			
			this._text.attr({
				'font-size': '12px',
				'fill': '#333'
			});
			this._textShadow.attr({
				'font-size': '12px',
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
				'width': this._dimensions.innerWidth
			});
			this._text.attr({
				'x': (this._dimensions.width/2)+12
			});
			this._textShadow.attr({
				'x': (this._dimensions.width/2)+12
			});
		
			this._primaryIcon = this._paper.image(path, 10,
				(this._dimensions.height/2)-8, 16, 16);
		},
				
		setSecondaryIcon: function() {
			var path = this._element.get('secondary-icon');
			if( !path ) {
				return false;
			}
			
			this._paper.setSize(this._dimensions.width+26,
				this._dimensions.height);
			this._button.attr({
				'width': this._dimensions.innerWidth+24
			});
			
			this._secondaryIcon = this._paper.image(path, 
				this._dimensions.width,	(this._dimensions.height/2)-8, 16, 16);
		},

		setDisabled: function(flag) {
		
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
					this._button.rotate(180, true);
				}.bind(this),
				'mouseup':  function(e) {
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
			
			var obj = new CanvasButton(this);
			this.store('canvasButton', obj);
			return this;
		}
	});
		
})();