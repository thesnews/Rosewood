if( !window['Rose'] ) {
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
	
})();