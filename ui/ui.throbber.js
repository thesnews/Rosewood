/**
 * Rose.ui.throbber
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

	var Throbber = new Class({
		
		_defaultOptions: $H({
			strokeColor: '#ccc',
			fill: 'r(0.25, 0.65)#f1f1f1-#dddddd',
			shadowFill: 'r(0.5, 0.25)#000000-#333333',
			radius: 12,
			duration: 500,
			
			mask: true,
			maskFill: '#333',
			maskOpacity: 0.75,
			textColor: '#fff',
			text: 'Working...'
		}),
		
		_options: $H({}),

		_container: false,
		
		_paper: false,
		_circle: false,
		_shadow: false,
		_mask: false,
		
		_timer: false,
		
		initialize: function(el) {
			this._container = $(el);

			if( arguments[1] ) {
				this._options = $H(arguments[1]);
			}

			this._options.combine( this._defaultOptions );
			
			var size = this._options.get('radius')*8;
			var offsetTop = this._options.get('radius')*3;
			var offsetLeft = this._options.get('radius')*4;
			
			this._paper = new Raphael(this._container, size, size);
			
			this._circle = this._paper.circle(offsetLeft, offsetTop, 
				this._options.get('radius'));
			this._shadow = this._paper.circle(offsetLeft, offsetTop, 
				this._options.get('radius')+2);

			this._shadow.toBack();

			this._circle.attr({
				'fill': this._options.get('fill'),
				'stroke': this._options.get('stroke'),
				'fill-opacity': 1
			});
			this._shadow.attr({
				'x': this._options.get('radius')+10,
				'y': this._options.get('radius')+10,
				'stroke': false,
				'fill': this._options.get('shadowFill'),
				'fill-opacity': '0.25'
			});

			if( this._options.get('mask') ) {
				this._mask = this._paper.rect(0, 0, size-2, size-2, 4);
				this._mask.attr({
					'fill': this._options.get('maskFill'),
					'opacity': this._options.get('maskOpacity'),
					'stroke': false
				});
				this._mask.toBack();
				
				var text = this._paper.text(size/2, size-20, 
					this._options.get('text'));
				text.attr({
					'fill': this._options.get('textColor')
				});
			}

			this._container.fade('hide');
			this._container.set('tween', {'duration':150});

		},
		
		show: function() {
			this._container.fade('in');
			this._animateUp();
			this._timer = setInterval(this._animateUp.bind(this),
				(this._options.get('duration')*2)+25);
		},
		
		hide: function() {
			this._container.fade('out');
			setTimeout(function() {
				if( this._timer ) {
					clearInterval(this._timer);
				}
			}.bind(this), 500);
		},
		
		_animateUp: function() {
			this._circle.animate({
					'r': this._options.get('radius')*2
				},
				this._options.get('duration'), this._animateDown.bind(this));

			this._shadow.animateWith(this._circle, {
					'r': (this._options.get('radius')+2)*1.5,
					'cy': this._options.get('radius')*4
				}, this._options.get('duration'));

		},
		
		_animateDown: function() {
			this._circle.animate({
					'r': this._options.get('radius')
				},
				this._options.get('duration'));

			this._shadow.animateWith(this._circle, {
					'r': this._options.get('radius')+2,
					'cy': this._options.get('radius')*3
				}, this._options.get('duration'));

		}
		
	});
	
	if( !Rose.ui ) {
		Rose.ui = {};
	}
	Rose.ui.throbber = Throbber;
})();