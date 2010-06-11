if( !window['Rose'] ) {
	Rose = {};
}
(function() {

	/**
	 * Rose.basePath (string)
	 *
	 * Contains the absolute base URL for the site (i.e. http://statenews.com/)
	 * NOTE: this path contains a trailing slash, unlike every other path
	 * in Gryphon. This is done for cross-browser compatability reasons.
	 *
	 * ({{{
	 */
	var base = window.location.toString();
	if( base.indexOf( 'index.php' ) != -1 ) {
		base = base.substr( 0,	base.indexOf( 'index.php' ) );
	}
	
	Rose.basePath = base;
	/**
	 * }}})
	 */
	
	String.implement({
		unencode: function() {
			return decodeURIComponent(unescape(this));
		},
		encode: function() {
			return escape(encodeURIComponent(this));
		}
	});

	Element.implement({
		noSelect: function() {
			this.onselectstart = this.ondragstart = $lambda( false );
			this.addEvent( 'mousedown', $lambda( false ) );
			this.setStyle( '-moz-user-select', 'none' );		
		},
		// overriding the dispose
		dispose: function() {
			if( this.retrieve ) {
				var watchers = this.retrieve('disposeWatchers', []);
				watchers.each(function(el) { el.dispose(); });
			}
			return (this.parentNode) ? this.parentNode.removeChild(this) : this;
		},
		
		disposeWith: function(e) {
			var watchers = $(e).retrieve('disposeWatchers', []);
			watchers.push(this);
			$(e).store('disposeWatchers', watchers);
		}

	});

})();/**
 * Rose.ui.statusMessage
 *
 * Display a status message at the top of the page (overlays the ticker element)
 * There are 3 status message types:
 *  - success
 *  - notice (default)
 *  - warning
 *
 * The container will be assigned a class the same name as the status (i.e. a
 * success status will have class="success").
 *
 * Options:
 *  - container (string|DOMNode) the container element for the message
 *      default: document.body
 *  - id (string) the id for the 
 *      default: 'rose_statusMessage'
 *
 * Events:
 *  - none
 *
 * Usage:
 * <code>
 *  Rose.statusMessage.setOptions({'id': 'foo_bar'});
 *	Rose.statusMessage.display( 'This is a message!', 'warning' );
 * </code>
 * 
 *
 * @author Mike Joseph <josephm5@msu.edu>
 * @package Package
 * @subpackage SubPackage
 * @copyright Copyright &copy; 2010, The State News
 * @license http://opensource.org/licenses/gpl-2.0.php GNU GPL 2.0
 */

if( !window['Rose'] ) {
	Rose = {};
}
(function() {

	var StatusMessage = new Class({
		
		_container: false,
		_message: false,
		_type: false,
		
		_defaultOptions: $H({
			container: $(document.body),
			id: 'rose_statusMessage'
		}),
		
		_options: $H({}),
		
		initialize: function() {
			this.setOptions({});
		},
		
		setOptions: function(opts) {
			this._options = $H(opts);
			this._options.combine( this._defaultOptions );
		},
		
		display: function( message ) {
			this._initContainer();
		
			// default to  anotice message
			var type = 'notice';
			if( arguments[1] ) {
				type = arguments[1];
			}
			
			this._setMessage( message );
			this._setType( type );
			
			this._show();
			
			// display for 5 seconds then fade out
			setTimeout(function() {
				this._hide();
			}.bind(this), 5000);
		},
		
		_initContainer: function() {
			if( this._container ) {
				return;
			}
			
			var winCoords = $(window).getCoordinates();

			this._container = new Element( 'div', {
				'id': this._options.get('id'),
				'tween': {
					'duration': 250
				}
			});

			var ticker = $('ticker');
			if( ticker ) {
				// if no ticker element, just stick it up at the top of the page
				// in the center
				var coords = ticker.getCoordinates();
				this._container.setStyles({
					'left': coords.left,
					'width': coords.width,
					'height': coords.height
				});
			}

			$(this._options.get('container')).adopt( this._container );
		},
		
		_show: function() {
			this._container.tween( 'opacity', 1 );
		},
		
		_hide: function() {
			this._container.tween( 'opacity', 0 );
		},	

		_setMessage: function( msg ) {
			var msgContainer = new Element( 'div', {
				'styles': {
					'margin-top': '5px'
				},
				'html': msg
			});
		
			this._container.empty();
			this._container.adopt( msgContainer );
		},
		
		_setType: function( type ) {
			if( this._type ) {
				this._container.removeClass( this._type );
			}
			
			this._container.addClass( type );
			this._type = type;
		}
		
	});
	
	// singleton yo, stick it into the global namespace
	if( !Rose.ui ) {
		Rose.ui = {};
	}
	Rose.ui.statusMessage = new StatusMessage;
})();if( !window['Rose'] ) {
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
		
})();/**
 * Rose.ui.throbber
 *

 * @author Mike Joseph <josephm5@msu.edu>
 * @package Package
 * @subpackage SubPackage
 * @copyright Copyright &copy; 2010, The State News
 * @license http://opensource.org/licenses/gpl-2.0.php GNU GPL 2.0
 */

if( !window['Rose'] ) {
	Rose = {};
}
(function() {

	var Throbber = new Class({
		
		_defaultOptions: $H({
			stroke: '#999',
			fill: 'r(0.25, 0.25)#fff-#ccc',
			shadowFill: 'r(0.5, 0.5)#000-#fff',
			radius: 12,
			duration: 500,
			
			mask: true,
			maskFill: '#333',
			maskOpacity: 0.75,
			textColor: '#fff',
			text: 'Working...'
		}),
		
		_options: $H({}),

		_container: false,
		
		_paper: false,
		_circle: false,
		_shadow: false,
		_mask: false,
		
		_shadowOffset: false,
		
		_timer: false,
		
		initialize: function(el) {
			this._container = $(el);

			if( arguments[1] ) {
				this._options = $H(arguments[1]);
			}

			this._options.combine( this._defaultOptions );
			
			var size = this._options.get('radius')*8;
			var offsetTop = this._options.get('radius')*3;
			var offsetLeft = this._options.get('radius')*4;
			
			this._shadowOffset = this._options.get('radius')/2;
			
			this._paper = new Raphael(this._container, size, size);
			
			this._circle = this._paper.circle(offsetLeft, offsetTop, 
				this._options.get('radius'));
			this._shadow = this._paper.circle(offsetLeft, offsetTop, 
				this._options.get('radius'));

			this._shadow.toBack();

			this._circle.attr({
				'fill': this._options.get('fill'),
				'stroke': this._options.get('stroke'),
				'fill-opacity': 1
			});
			this._shadow.attr({
				'stroke': false,
				'fill': this._options.get('shadowFill'),
				'fill-opacity': 0.25
			});

			if( this._options.get('mask') ) {
				this._shadow.attr({
					'fill': 'r(0.5, 0.5)#333-#666',
					'fill-opacity': 0.2
				});
				this._mask = this._paper.rect(0, 0, size-2, size-2, 4);
				this._mask.attr({
					'fill': this._options.get('maskFill'),
					'opacity': this._options.get('maskOpacity'),
					'stroke': false
				});
				this._mask.toBack();
				
				var text = this._paper.text(size/2, size-20, 
					this._options.get('text'));
				text.attr({
					'fill': this._options.get('textColor')
				});
			}

			this._container.fade('hide');
			this._container.set('tween', {'duration':150});

		},
		
		show: function() {
			this._container.fade('in');
			this._animateUp();
			this._timer = setInterval(this._animateUp.bind(this),
				(this._options.get('duration')*2)+250);
		},
		
		hide: function() {
			this._container.fade('out');
			setTimeout(function() {
				if( this._timer ) {
					clearInterval(this._timer);
				}
			}.bind(this), 500);
		},
		
		_animateUp: function() {
			this._circle.animate({
					'r': this._options.get('radius')*1.25
				},
				this._options.get('duration'), this._animateDown.bind(this));

			this._shadow.animateWith(this._circle, {
					'r': (this._options.get('radius')+this._shadowOffset)*1.25,
					'cy': this._options.get('radius')*3.5
				}, this._options.get('duration'));

		},
		
		_animateDown: function() {
			this._circle.animate({
					'r': this._options.get('radius')
				},
				this._options.get('duration'));

			this._shadow.animateWith(this._circle, {
					'r': this._options.get('radius'),
					'cy': this._options.get('radius')*3
				}, this._options.get('duration'));

		}
		
	});
	
	if( !Rose.ui ) {
		Rose.ui = {};
	}
	Rose.ui.throbber = Throbber;
})();if( !window['Rose'] ) {
	Rose = {};
}
(function() {

	var TabBox = new Class({
		
		container: false,
		children: false,
		linkContainer: false,

		_defaultOptions: $H({
			linkContainerClass: 'tab-box-header',
			linkActiveClass: 'tab-header-active'
		}),
		
		_options: $H({}),
		
		initialize: function(el) {
		
			if( arguments[1] ) {
				this._options = $H(arguments[1]);
			}
			this._options.combine( this._defaultOptions );

			this.container = el;
			this.children = this.container.getChildren();
			
			this.linkContainer = new Element('div', {
				'class': this._options.get('linkContainerClass'),
				'styles': {
					margin: 0,
					padding: 0
				}
			});	
			
			this.linkContainer.injectBefore(this.container);
			
			var totalLinks = this.children.length;
			var childWidth = this.container.getSize().x / totalLinks;
			var maxHeight = 0;
			
			var activeCls = this._options.get('linkActiveClass');
			
			this.children.each(function(list, idx) {
				var link = list.getFirst();
				
				this.linkContainer.grab(link);
				link.setStyles({
					display: 'block',
					'float': 'left',
					width: childWidth+'px',
					'text-align': 'center'
				});
				
				link.addEvent('click', function(e) {
					e.stop();
					this.linkContainer.getChildren().removeClass(activeCls);
					link.addClass(activeCls);
					this.children.setStyle('display', 'none');
					list.setStyle('display', '');
				}.bind(this));
				
				if( list.getSize().y > maxHeight ) {
					maxHeight = list.getSize().y;
					this.container.setStyle('height', maxHeight+10);
				}
				
				if( idx > 0 ) {
					list.setStyle('display', 'none');
				} else {
					link.addClass(activeCls);
				}
				
			}.bind(this));
		}
		
	});
	
	Element.implement({
		'tabBox': function() {
			new TabBox(this, arguments[0]);
			return this;
		}
	});
	
	if( !Rose.ui ) {
		Rose.ui = {};
	}

	Rose.ui.tabBox = TabBox;
	
})();/**
 * Rose.ui.modal
 *
 * Create an interactive modal window.
 *
 * Relevant CSS classes:
 *  - rose_modal_container: The container for the whole shebang
 *  - rose_modal_container: The container for the whole shebang
 *  - rose_modal_title: The title bar
 *  - rose_modal_content: The content area
 *  - rose_modal_contentIndeterminate: The content area for indeterminate mode
 *  - rose_modal_buttonBar: The button bar area
 *  - rose_modal_closeButton: The close button
 *
 * The box would look roughly like this:
 *
 * ------------------------.rose_modal_container-----------------------------
 * |________________________________________________________________________|
 * |                                               _________________________|
 * |                  .rose_modal_title            |.rose_modal_closeButton |
 * |_______________________________________________|________________________|
 * |                                                                        |
 * |                       .rose_modal_contents                             |
 * |                                                                        |
 * |                                                                        |
 * |________________________________________________________________________|
 * |                                                                        |
 * |                       .rose_modal_buttonBar                            |
 * |                                                                        |
 * |________________________________________________________________________|
 *
 *
 *
 * Options:
 *  - title (string): The title of the modal
 *  - content (string|DOMElement): The content of the modal window
 *  - submit (string): The label for the submit button. Set to 'false' to disable
 *  - cancel (string|bool): The label for the cancel button. Set to 'false' to disable
 *  - loadingIndicator (bool): If true, a canvas based indicator is used.
 *  - mask (bool): Whether to use a page mask or not
 *  - destroyOnClose (bool): If true, modal will be destroyed when closed. Defaults to false.
 *  - width (int): Width of the content area
 *  - height (int): Height of the content area
 *  - mode (string): Either  'determinate' or 'indeterminate'. Defaults to determinate. An indeterminate modal is just for simple status messages like 'loading' or 'saving'.
 * Events:
 *  - onSubmit: Fired when submit button is clicked
 *  - onCancel: Fired when cancel button is clicked
 *  - onOpen: Fired when modal is opened
 *  - onClose: Fired when modal is closed
 *
 * Public Methods:
 *  - Modal display(void)
 *    Position and display the modal window
 *
 *  - Modal close([bool destroy])
 *    Close the modal. Pass the optional 'destroy' flag to destroy the modal
 *    and remove it from the DOM tree. You'll have to create a new modal to
 *    re-open it.
 *
 *  - Modal set( string key, mixed value )
 *    Set any option after object has been initialized
 *
 *  - Modal loading( bool )
 *    Set to true to display loadingIndicator, if set. False to hide.
 *
 * Usage:
 * <code>
 *  var modal =	new Rose.modal({
 *      title: 'Foo Modal!',
 *      content: new Element( 'p', {
 *        'text': 'This is a modal with an element for the content!' }),
 *      cancel: 'Done',
 *      submit: false,
 *      onCancel: function() {
 *          console.log( this );
 *      }
 * }).display();
 * </code>
 * 
 *
 * @author Mike Joseph <josephm5@msu.edu>
 * @package Package
 * @subpackage SubPackage
 * @copyright Copyright &copy; 2010, The State News
 * @license http://opensource.org/licenses/gpl-2.0.php GNU GPL 2.0
 */
 
if( !window['Rose'] ) {
	Rose = {};
}
(function() {
	var Modal = new Class({

		_mask: false,

		_container: false,
		
		_titleContainer: false,
		_contentContainer: false,
		_buttonContainer: false,
		
		_loadingIndicator: false,

		_defaultOptions: $H({
			mode: 'determinate',
			title: false,
			content: false,
			submit: 'Save',
			cancel: 'Cancel',
			
			destroyOnClose: false,
			
			loadingIndicator: true,
			
			mask: true,
			
			height: 150,
			width: 300,
			
			onSubmit: $empty,
			onCancel: $empty,
			onOpen: $empty,
			onClose: $empty
		}),
		
		_options: $H({}),
		
		initialize: function() {
			
			if( arguments[0] ) {
				this._options = $H(arguments[0]);
			}

			this._options.combine( this._defaultOptions );
		
			this._titleContainer = new Element( 'div', {
				'class': 'rose_modal_title',
				'html': this._options.get( 'title' )
			});
			
			if( this._options.get( 'mode' ) == 'determinate' ) {
				// clicking the close button will destroy the modal
				this._titleContainer.adopt( new Element( 'a', {
					'href': '#',
					'class': 'rose_modal_closeLink',
					'events': {
						'click': this._destroy.bind( this )
					},
					'styles': {
						'position': 'absolute',
						'right': 10,
						'top': 2
					}
				}).adopt( new Element( 'span', {
					'text': 'Close'
				})));
			}
			
			this._contentContainer = new Element( 'div', {
				'class': 'rose_modal_content',
				'styles': {
					'width': this._options.get( 'width' ),
					'height': this._options.get( 'height' )
				}
			});
			
			this._buttonContainer = new Element( 'div', {
				'class':	'rose_modal_buttonBar',
				'styles': {
					'position': 'absolute',
					'bottom': 0,
					'left': 0
				}
			});

			// defaults to the top of the window
			this._container = new Element( 'div', {
				'class':	'rose_modal_container',
				'styles': {
					'position': 'fixed',
					'opacity': 0,
					'top': 0,
					'left': 0
				},
				'tween': {
					'duration': 250
				},
				'morph': {
					'duration': 250
				}
			}).adopt(
				this._titleContainer, this._contentContainer,
				this._buttonContainer 
			);

			if( Browser.Engine.trident ) {
				this._container.setStyle( 'border-width', 1 );
			}
			
			this._updateContent();
			
			if( this._options.get( 'mode' ) == 'determinate' ) {
				this._updateButtons();
			}

			// make sure all of the events remain within the context of 
			// this object
			this._options.set( 'onOpen',
				this._options.get( 'onOpen' ).bind( this ) );
			this._options.set( 'onClose',
				this._options.get( 'onClose' ).bind( this ) );
			this._options.set( 'onCancel',
				this._options.get( 'onCancel' ).bind( this ) );
			this._options.set( 'onSubmit',
				this._options.get( 'onSubmit' ).bind( this ) );
			
			$(document.body).adopt( this._container );
			
		},
		
		display: function() {
			this._show();

			return this;
		},
		
		close: function() {
			// if 'true' is passed, close will destroy the modal
			if( arguments[0] || this._options.get( 'destroyOnClose' ) ) {
				return this._destroy();
			}
			
			this._hide();

			return this;
		},
		
		set: function( k, v ) {
			if( this._options.has( k ) ) {
				this._options.set( k, v );
			}
			
			switch( k ) {
				case 'content':
					this._updateContent();
					break;
				case 'submit':
				case 'cancel':
				case 'mode':
					this._updateButtons();
					break;
			}

			return this;
		},
		
		loading: function( flag ) {
			if( !this._loadingIndicator ) {
				return;
			}
			
			if( flag ) {
				this._loadingIndicator.show();
				
				return this;
			}
			
			this._loadingIndicator.hide();
			
			return this;
		},
		
		_show: function() {
			
			var windowCoords = $(window).getCoordinates();
			var containerCoords = this._container.getCoordinates();
			
			var leftOffset = windowCoords.width/2 - containerCoords.width/2;
			var topOffset = windowCoords.height/2 - containerCoords.height/2;
			
			if( this._options.get( 'mask' ) ) {
				this._mask = new Element( 'div', {
					'styles': {
						'background': '#333',
						'position': 'fixed',
						'top': 0,
						'left': 0,
						'width': windowCoords.width,
						'height': windowCoords.height,
						'opacity': 0
					},
					'events': {
						'click': this._destroy.bind( this )
					},
					'tween': {
						'duration': 250
					}
				});
				
				this._mask.inject( this._container, 'before' );
				
			}
			
			this._container.setStyles({
				left: leftOffset,
				top: (topOffset-50)
			});
			
			// sets the callback to be called when the morph transition
			// completes
			var callback = $empty;
			if( arguments[0] ) {
				callback = arguments[0];
			}
			
			this._container.set( 'morph', {
				'onComplete': callback.bind( this ),
				'duration': 250
			});
			
			this._container.morph({
				'opacity': 1,
				'top': topOffset
			});
			
			if( this._mask ) {
				this._mask.tween( 'opacity', 0.25 );
			}
			
			this._buttonContainer.getChildren('a').canvasButton();
			
			this._options.get( 'onOpen' ).bind(this).run([]);
		},
		
		_hide: function() {

			// sets the callback to be called when the morph transition
			// completes
			var callback = $empty;
			if( arguments[0] ) {
				callback = arguments[0];
			}
			
			this._container.set( 'morph', {
				'onComplete': callback.bind( this ),
				'duration': 250
			});
			
			this._container.morph({
				'opacity': 0,
				'top': (this._container.getCoordinates().top + 50)
			});
			
			if( this._mask ) {
				this._mask.tween( 'opacity', 0 );
			}
			this._options.get( 'onClose' ).bind(this).run([]);
		},
		
		_destroy: function() {
			if( arguments[0] ) {
				arguments[0].stop();
			}
			
			// single point of failure, yo
			this._hide(function() {
				this._container.destroy();
				if( this._mask ) {
					this._mask.destroy();
				}
			});
		},
		
		_handleSubmit: function(e) {
			e.stop();
			this._options.get( 'onSubmit' ).bind(this).run([]);	
		},
		
		_handleCancel: function(e) {
			e.stop();
			this._options.get( 'onCancel' ).bind(this).run([]);
		
			this._destroy();
		},

		_updateContent: function() {
		
			this._contentContainer.empty();
		
			if( typeof( this._options.get( 'content' ) ) == 'object' ) {
				this._contentContainer.adopt( this._options.get( 'content' ) );
			} else {
				this._contentContainer.set( 'html',
					this._options.get( 'content' ) );
			}
			
			if( this._options.get( 'mode' ) == 'determinate' ) {
				this._contentContainer.addClass( 'rose_modal_content' );
				this._contentContainer.removeClass(
					'rose_modal_contentIndeterminate' );
			} else {
				this._contentContainer.addClass(
					'rose_modal_contentIndeterminate' );
				this._contentContainer.removeClass( 'rose_modal_content' );
			}
		},
		
		_updateButtons: function() {
			var buttons = [];
			
			this._buttonContainer.empty();
			this._buttonContainer.setStyle( 'display', 'none' );
			
			// you can set 'submit' and 'cancel' to FALSE to hide them
			if( this._options.get( 'submit' ) ) {
				buttons.push( new Element( 'a', {
					'href': '#',
					'class': 'active-button submit',
					'text': this._options.get( 'submit' ),
					'events': {
						'click': this._handleSubmit.bind( this )
					}
				}));
			}
			
			if( this._options.get( 'cancel' ) ) {
				buttons.push( new Element( 'a', {
					'href': '#',
					'class': 'active-button cancel',
					'text': this._options.get( 'cancel' ),
					'events': {
						'click': this._handleCancel.bind( this )
					}
				}));
			}

			if( this._options.get( 'loadingIndicator' ) ) {
//				this._loadingIndicator = new Element( 'img', {
//					'src': this._options.get( 'loadingIndicator' )
//				}).fade( 'hide' );
				
				var cont = new Element('div', {
					'styles': {
						'float': 'left',
						'width': '24px',
						'height': '24px',
						'position': 'relative',
						'top': '-3px'
					}
				});
				
				this._loadingIndicator = new Rose.ui.throbber(cont, {
					'radius': 4,
					'mask': false
				});
				
				buttons.push( cont );
			}

			if( !buttons.length ) {
				return;
			}

			this._buttonContainer.setStyle( 'display', '' );
			this._buttonContainer.adopt( buttons );
		
		}
	});
	
	// stick it into the global namespace
	if( !Rose.ui ) {
		Rose.ui = {};
	}
	Rose.ui.modal = Modal;

})();if( !window['Rose'] ) {
	Rose = {};
}
(function() {

	var PopupModal = new Class({
		_defaultOptions: $H({
			content: false,
			submit: 'Save',
			cancel: 'Cancel',
			
			destroyOnClose: false,
			
			loadingIndicator: true,
			
			mask: true,
			
			onSubmit: $empty,
			onCancel: $empty,
			onOpen: $empty,
			onClose: $empty
		}),
		
		_options: $H({}),


		_container: false,
		_contentContainer: false,
		_topContainer: false,
		_bottomContainer: false,
		_buttonContainer: false,

		_loadingIndicator: false,
		
		_target: false,
		
		_boundClickObserver: false,
		
		initialize: function(el) {
			if( arguments[1] ) {
				this._options = $H(arguments[1]);
			}

			this._target = $(el);

			this._options.combine( this._defaultOptions );

			this._topContainer = new Element('div', {
				'class': 'rose_popupModal_top'
			});
			this._bottomContainer = new Element('div', {
				'class': 'rose_popupModal_bottom'
			});
			var content = new Element('div', {
				'class': 'rose_popupModal_content'
			});
			
			this._buttonContainer = new Element('div', {
				'class': 'rose_popupModal_buttonBar'
			});
			
			this._container = new Element('div', {
				'class': 'rose_popupModal_container',
				'styles': {
					'position': 'absolute'
				}
			}).adopt( this._topContainer, content, this._buttonContainer,
				this._bottomContainer );
				
			this._contentContainer = new Element('div', {
				'styles': {
					'padding': '0 15px'
				}
			});
			
			content.adopt(this._contentContainer);
			
			this._updateContent();
			this._updateButtons();
			
			this._container.fade('hide');
			this._container.set('tween', {
				'duration': 100
			});
			
			$(document.body).adopt(this._container);
			
			this._boundClickObserver = function(e) {
				this.hide(true);
			}.bind(this);
		},

		show: function() {
			var coords = this._target.getCoordinates();
			var topOffset = coords.top - this._container.getSize().y;
			var leftOffset = (coords.left + (coords.width/2)) -
				(this._container.getSize().x/2);
				
			this._container.setStyles({
				'top': topOffset,
				'left': leftOffset
			});
			this._container.fade('in');

			$(document.body).addEvent('click', this._boundClickObserver);

			this._container.addEvents({
				'mouseenter': function(e) {
					$(document.body).removeEvent('click',
						this._boundClickObserver);
				}.bind(this),
				'mouseleave': function(e) {
					$(document.body).addEvent('click',
						this._boundClickObserver);
				}.bind(this)
			});

			this._buttonContainer.getChildren('a').canvasButton();

			this._options.get('onOpen').bind(this).run([]);
			
			return this;
		},
		
		hide: function() {
			$(document.body).removeEvent('click', this._boundClickObserver);
			this._container.fade('out');
			if( arguments[0] && arguments[0] === true ) {
				this._destroy();
			}
			
			this._options.get('onClose').bind(this).run([]);

			return this;
		},
		
		loading: function( flag ) {
			if( !this._loadingIndicator ) {
				return;
			}
			
			if( flag ) {
				this._loadingIndicator.show();
				
				return this;
			}
			
			this._loadingIndicator.hide();
			
			return this;
		},

		getContents: function() {
			return this._contentContainer.getFirst();
		},
		
		getTarget: function() {
			return this._target;
		},

		_destroy: function() {
			this.hide();
			setTimeout(function() {
				this._container.destroy();
			}.bind(this), 150);
		},

		_updateContent: function() {
		
			this._contentContainer.empty();
		
			if( typeof( this._options.get( 'content' ) ) == 'object' ) {
				this._contentContainer.adopt( this._options.get( 'content' ) );
			} else {
				this._contentContainer.set( 'html',
					this._options.get( 'content' ) );
			}

		},
		
		_handleSubmit: function(e) {
			e.stop();
			this._options.get('onSubmit').bind(this).run([]);	
		},
		
		_handleCancel: function(e) {
			e.stop();
			this._options.get('onCancel').bind(this).run([]);
		
			this.hide(true);
		},

		_updateButtons: function() {
			var buttons = [];
			
			this._buttonContainer.empty();
			this._buttonContainer.setStyle( 'display', 'none' );
			
			// you can set 'submit' and 'cancel' to FALSE to hide them
			if( this._options.get( 'submit' ) ) {
				buttons.push( new Element( 'a', {
					'href': '#',
					'class': 'active-button submit',
					'text': this._options.get( 'submit' ),
					'events': {
						'click': this._handleSubmit.bind( this )
					}
				}));
			}
			
			if( this._options.get( 'cancel' ) ) {
				buttons.push( new Element( 'a', {
					'href': '#',
					'class': 'active-button cancel',
					'text': this._options.get( 'cancel' ),
					'events': {
						'click': this._handleCancel.bind( this )
					}
				}));
			}

			if( this._options.get( 'loadingIndicator' ) ) {
				var cont = new Element('div', {
					'styles': {
						'width': '24px',
						'height': '24px',
						'float': 'left'
					}
				});
				
				this._loadingIndicator = new Rose.ui.throbber(cont, {
					'radius': 4,
					'mask': false
				});
				
				buttons.push( cont );
			}

			if( !buttons.length ) {
				return;
			}

			this._buttonContainer.setStyle( 'display', '' );
			this._buttonContainer.adopt( buttons );
		
		}		
	});

	if( !Rose.ui ) {
		Rose.ui = {};
	}
	Rose.ui.popupModal = PopupModal;

})();/**
 * Rose.ui.multiBox
 *
 * Create and manage a multi-image/description slider box
 *
 * Options:
 *	- autoPlay (BOOL): automatically start animation
 *	- loop (BOOL|int): if TRUE, loops forever; if INT loops INT times; FALSE disables
 *	- slideSelector (string): class applied to the slides
 *	- controlSelector (string): the class applied to the individual controls
 *	- controlContainerSelector (string): class applied to container of above
 *	- descriptionSelector (string): class applied to descriptions
 *
 * Events:
 *	- onStart: fired when autoplay is started
 *	- onStop: fired when autoplay is stopped
 *	- onNext: fired when slide advances forward
 *	- onPrevious: fired when slide movees backward
 *	- onTick: fired when slide moves in either direction
 *
 * HTML:
 * A multiBox should always take the following form:
 * <code>
 *	<ul>
 *		<li>
 *			[first element is the slide]
 *			[subsequent elements make up description]
 *		</li>
 *	</ul>
 * </code>
 *
 *
 * Signature:
 *	instance = new Rose.ui.multiBox( string id|dom object[, options] )
 *
 * Usage:
 * <code>
 *	new Rose.ui.multiBox( 'foo' );
 *	$('foo').multiBox();
 * </code>
*/
if( !window['Rose'] ) {
	Rose = {};
}
(function() {

	if( !Rose.ui ) {
		Rose.ui = {};
	}

	var MultiBox = new Class({
	
		_options: $H({}),
		
		_defaults: $H({
			slideSelector: 'slide',
			controlSelector: 'control',
			controlContainerSelector: 'controls',
			descriptionSelector: 'description',
			onStart: $empty,
			onStop: $empty,
			onNext: $empty,
			onPrevious: $empty,
			onTick: $empty
		}),
		
		_container: false,
		
		initialize: function( el ) {
			this._container = el;
			
			if( arguments[1] ) {
				this._options = $H(arguments[1]);
			}

			this._options.combine( this._defaults );
		}
	
	});
	
	Element.implement({
		multiBox: function() {
			new MultiBox( this );
			
			return this;
		}
	});

	Rose.ui.multiBox = MultiBox;
})();