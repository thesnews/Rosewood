if( !window['Rose'] ) {
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

})();