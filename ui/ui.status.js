/**
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
 *  - none
 *
 * Events:
 *  - none
 *
 * Usage:
 * <code>
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
		
		initialize: function() {
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
				'styles': {
					'position': 'fixed',
					'top': 0,
					'left': (winCoords.width/2 - 100),
					'width': 200,
					'height': 25,
					'text-align': 'center',
					'font-weight': 'bold',
					'border-width': 1,
					'border-style': 'solid',
					'border-color': '#000',
					'opacity': 0
				},
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

			$(document.body).adopt( this._container );
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
})();