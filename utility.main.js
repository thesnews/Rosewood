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
		base = ROSE_BASE_PATH.substr( 0,	base.indexOf( 'index.php' ) );
	}
	
	Rose.basePath = base;
	/**
	 * }}})
	 */
	


})();