/**
 * rose.ui.statusMessage
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
 *  rose.statusMessage.setOptions({'id': 'foo_bar'});
 *	rose.statusMessage.display( 'This is a message!', 'warning' );
 * </code>
 * 
 *
 * @author Mike Joseph <josephm5@msu.edu>
 * @package Package
 * @subpackage SubPackage
 * @copyright Copyright &copy; 2010, The State News
 * @license http://opensource.org/licenses/gpl-2.0.php GNU GPL 2.0
 */

if( !window['rose'] ) {
	rose = {};
}
(function($) {

	var StatusMessage = new Class({
		
		Implements: [Options],
		
		_container: false,
		_message: false,
		_type: false,
		
		options: {
			container: $(document.body),
			id: 'rose_statusMessage'
		},
		
		initialize: function() {
		},
		
		setOptions: function(opts) {
			this.setOptions(opts);
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
				'id': this.options.id,
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

			$(this.options.container).adopt( this._container );
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
	if( !rose.ui ) {
		rose.ui = {};
	}
	rose.ui.statusMessage = new StatusMessage;
})(document.id);