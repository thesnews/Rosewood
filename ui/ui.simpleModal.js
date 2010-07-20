if( !window['Rose'] ) {
	Rose = {};
}
(function() {
	var Modal2 = new Class({
		
		Implements: Options,
		
		_mask: false,

		_container: false,
		
		_title: false,
		_content: false,
		_buttons: false,
		_close: false,
		
		_loadingIndicator: false,

		options: {
			destroyOnClose: false,
			
			modalClass: 'modal',
			
			id: false,
			
			mask: true,
			
			content: false,
			
			height: 150,
			width: 300,
			
			onSubmit: $empty,
			onCancel: $empty,
			onOpen: $empty,
			onClose: $empty
		},
		
		
		initialize: function() {
			
			this.setOptions(arguments[0]);

			this._container = new Element('div', {
				'class': this.options.modalClass,
				styles: {
					position: 'fixed',
					top: 0,
					left: 0,
					width: this.options.width,
//					height: this.options.height,
					opacity: 0
				},
				tween: {
					duration: 250
				},
				morph: {
					duration: 250
				}
			}).adopt(this.options.content);

			if( this.options.id ) {
				this._container.set('id', this.options.id);
			}

			this._title = this._container.getFirst();
			this._content = this._container.getFirst().getNext();
			
			if( this._container.getChildren().length > 2 ) {
				this._buttons = this._container.getLast();
			}
			
			if( this._title.getElements('a') ) {
				this._close = this._title.getElements('a').pop();
			}
			
			if( this._close ) {
				this._close.addEvent('click', this.close.bind(this));
			}
			
			if( this._buttons ) {
				this._buttons.getElements('a.cancel').addEvent('click',
					this.options.onCancel.bind(this));
				this._buttons.getElements('a.submit').addEvent('click',
					this.options.onSubmit.bind(this));
			}
			
			$(document.body).adopt(this._container);
			
			new Drag(this._container, {
				handle: this._title
			});
		},
		
		hide: function() {
			// sets the callback to be called when the morph transition
			// completes
			var callback = $empty;
			if( arguments[0] ) {
				callback = arguments[0];
			}
			
			this._container.set('morph', {
				'onComplete': callback.bind(this),
				'duration': 250
			});
			
			this._container.morph({
				'opacity': 0,
				'top': (this._container.getCoordinates().top + 50)
			});
			
			this.options.onClose.bind(this).run([]);		
		},
		
		close: function() {
			if( arguments[0] ) {
				arguments[0].stop();
			}
			
			// single point of failure, yo
			this.hide(function() {
				this._container.destroy();
			}.bind(this));
		},
		
		show: function() {
			
			var windowCoords = $(window).getCoordinates();
			var containerCoords = this._container.getCoordinates();
			
			var leftOffset = windowCoords.width/2 - containerCoords.width/2;
			var topOffset = windowCoords.height/2 - containerCoords.height/2;
			
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
			
			this._container.set('morph', {
				'onComplete': callback.bind(this),
				'duration': 250
			});
			
			this._container.morph({
				'opacity': 1,
				'top': topOffset
			});
			
			this.options.onOpen.bind(this).run([]);
			
			return this;
		}
	});
	
	// stick it into the global namespace
	if( !Rose.ui ) {
		Rose.ui = {};
	}
	Rose.ui.simpleModal = Modal2;

})();