if( !window['rose'] ) {
	rose = {};
}
(function($) {

	if( !rose.ui ) { rose.ui = {}; }

	var FormatBar = new Class({
		Implements: [Options],
		
		options:	{
			buttons: {},
			containerClass: 'format-bar',
			onInject: false
		},

		_element:	false,
		
		_buttons: {
			'bold': {
				help: 'Bold',
				callback: function() {
					this.wrapSelection('*', '*');
				}
			},
			
			'italic': {
				help: 'Italic',
				callback: function() {
					this.wrapSelection('_', '_');
				}
			},
			
			'indent': {
				help: 'Blockquote',
				callback: function() {
					this.insertAtSelection("\n> \n> \n");
				}
			},
			
			'ul': {
				help: 'Unorderd list',
				callback: function() {
					this.insertAtSelection(
						"\n* Item One\n* Item Two\n* Item Three\n\n");
				}
			},
			
			'ol': {
				help: 'Ordered list',
				callback: function() {
					this.insertAtSelection( 
						"\n# Item One\n# Item Two\n# Item Three\n\n");
				}
			},
			
			'link': {
				help: 'Add link',
				callback: function() {
					var link = prompt("Please enter a URL:") || 'http://';
					this.wrapSelection('"', '":'+link);
				}
			},
			
			'h1': {
				help: 'Heading 1',
				callback: function() {
					this.wrapSelection("\nh1. ", "\n\n");
				}
			},
			
			'h2': {
				help: 'Heading 2',
				callback: function() {
					this.wrapSelection("\nh2. ", "\n\n");
				}
			},
			
			'h3': {
				help: 'Heading 3',
				callback: function() {
					this.wrapSelection("\nh3. ", "\n\n");
				}
			}
		},
	
		initialize: function(el) {
			
			this.setOptions(arguments[1]);
			
			this._element = $(el);
			
			if( this.options.buttons ) {
				this.options.buttons = this.options.buttons.merge(
					this._buttons);
			} else {
				this.options.buttons = this._buttons;
			}
			
			if( this.options.onInject ) {
				this.options.onInject.run(this.buildToolbar(), this);
			} else {
				this.buildToolbar().inject(this._element, 'before');
			}
			
		},
	
		insertAtSelection: function(text) {
			var start = this._element.selectionStart;
			
			var value = this._element.value;
			var oldTop = this._element.scrollTop;
			
			this._element.value = value.substring(0, start)+text+
				value.substring(start+1, value.length);
	
			this._element.scrollTop = oldTop;
	
		},
	
		wrapSelection: function(pre, post) {
			var start = this._element.selectionStart;
			var end = this._element.selectionEnd;
			
			var oldTop = this._element.scrollTop;
			
			var value = this._element.value
			var selection = value.substr(start, (end-start));
			
			this._element.value = value.substring(0, start)+pre+selection+post+
				value.substring( end, value.length );
				
			this._element.scrollTop = oldTop;
		},
		
		format: function(type) {
			if( this.options.buttons.get(type) ) {
				this.options.buttons.get(type).run()
			}
		},
		
		buildToolbar: function() {
			var container = new Element( 'div', {
				'class': this.options.containerClass
			});
		
			this.options.buttons.each(function(info, button) {
				var obj = this;
				var link = new Element( 'a', {
					href: '#',
					'class': button,
					text: info.help,
					events: {
						click: function(e) {
							e.stop();
							info.callback.bind(obj).run();
						}
					}
				});
				
				container.adopt(link);
			}.bind(this));

			return container;
		}
	});
	
	Element.implement({
		formatable: function() {
			new FormatBar(this, arguments[0]);
			return this;
		}
	});
	
	rose.ui.formatBar = FormatBar;
})(document.id);