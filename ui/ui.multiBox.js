/**
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
	
	Element.implements({
		multiBox: function() {
			new MultiBox( this );
			
			return this;
		}
	});

	Rose.ui.multiBox = MultiBox;
})();