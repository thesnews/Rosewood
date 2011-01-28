if( !window['rose'] ) {
	rose = {};
}
(function($) {

	if( !rose.ui ) { rose.ui = {}; }

	var InlineGallery = new Class({
		Implements: Options,
		options: {
			pagerSelector: '.pagers',
			imageSelector: '.image',
			captionSelector: '.caption',
			authorSelector: '.byline',
			
			onLoad: Function.from,
			onChange: Function.from,
			onSelect: Function.from
		},
		
		container: false,
		
		initialize: function(el) {
			if( arguments[1] ) {
				this.setOptions(arguments[1]);
			} else {
				this.setOptions({});
			}
			
			this.container = $(el);
			
			$$(this.options.pagerSelector).addEvent('click',
				this.handlePagerClick.bind(this));
		},
		
		handlePagerClick: function(event) {
			event.stop();
			var el = event.target;
			
			var uri = el.get('href').toURI();
			uri.set('file', uri.get('file')+'.json');

			this.options.onSelect.run(el, this);
			
			new Request.JSON({
				url: uri.toString(),
				onComplete: this.loadNewImage.bind(this)
			}).send();
			
		},
		
		loadNewImage: function(data) {
			var currentImage = this.container.getElements(
				this.options.imageSelector).pop();
			var newImage = currentImage.clone();
			
			var tmp = new Image;
			
			var caption = this.container.getElements(
				this.options.captionSelector);
			if( caption.length ) {
				caption = caption.pop();
			}
			var authors = this.container.getElements(
				this.options.authorSelector);
			if( authors.length ) {
				authors = authors.pop();
			}
			
			var obj = this;
			
			tmp.onload = function() {
				currentImage.setStyle('position', 'relative');
				currentImage.set('morph', {
					onComplete: function() {
						newImage.replaces(currentImage);
						
						newImage.src = tmp.src;
						newImage.setStyles({
							position: 'relative',
							left: -50,
							opacity: 0,
							height: tmp.height
						});
						
						newImage.morph({
							left: 0,
							opacity: 1
						});

						obj.options.onChange.run(data, obj);
						
					}
				});

				currentImage.morph({
					left: -50,
					opacity: 0
				});
	
			};

			tmp.src = data[0].image.url.unencode();
			
			if( caption ) {
				caption.set('html', data[0].image.caption_formatted.unencode());
			}
			
			if( authors ) {
				var authorNames = [];
				data[0].image.authors.every(function(a) {
					authorNames.push(a.name.unencode());
				});
				authors.set('html', authorNames);
			}			
		}

	});

	rose.ui.inlineGallery = InlineGallery;
	
})(document.id);