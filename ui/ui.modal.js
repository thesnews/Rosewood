/**
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
 *  - loadingIndicator (string|bool): The path to a loading image. The image will load next to the buttons in the button bar. False to disable.
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
			
			loadingIndicator: false,
			
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
					'right': 0
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
				this._loadingIndicator.fade( 'show' );
				
				return this;
			}
			
			this._loadingIndicator.fade( 'hide' );
			
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
			
			this._options.get( 'onOpen' ).run([]);
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
			this._options.get( 'onClose' ).run([]);
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
			this._options.get( 'onSubmit' ).run([]);	
		},
		
		_handleCancel: function(e) {
			e.stop();
			this._options.get( 'onCancel' ).run([]);
		
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
			
			if( this._options.get( 'loadingIndicator' ) ) {
				this._loadingIndicator = new Element( 'img', {
					'src': this._options.get( 'loadingIndicator' )
				}).fade( 'hide' );
				
				buttons.push( this._loadingIndicator );
			}
			
			// you can set 'submit' and 'cancel' to FALSE to hide them
			if( this._options.get( 'submit' ) ) {
				buttons.push( new Element( 'a', {
					'href': '#',
					'class': 'active-button',
					'text': this._options.get( 'submit' ),
					'events': {
						'click': this._handleSubmit.bind( this )
					}
				}));
			}
			
			if( this._options.get( 'cancel' ) ) {
				buttons.push( new Element( 'a', {
					'href': '#',
					'class': 'active-button',
					'text': this._options.get( 'cancel' ),
					'events': {
						'click': this._handleCancel.bind( this )
					}
				}));
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

})();