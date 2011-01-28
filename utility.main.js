if( !window['rose'] ) {
	rose = {};
}
(function($) {

	/**
	 * rose.basePath (string)
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
	
	rose.basePath = base;
	/**
	 * }}})
	 */
	 
	rose.version = '2.0a';
	
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
			this.onselectstart = this.ondragstart = Function.from(false);
			this.addEvent( 'mousedown', Function.from(false) );
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

})(document.id);