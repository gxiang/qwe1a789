/*
*	speedSlider v1.0
*	Authored by Kang Guang Xiang
*	version 1.0
*/

(function($){
	$.fn.slider = function( options ){
		var setting = $.extend({
			wrap_WIDTH		: '600px',
			wrap_HEIGHT		: '56px',
			wrap_OVERFLOW_X	: 'hidden',
			wrap_OVERFLOW_Y	: 'hidden',
			wrap_MARGIN		: '0 auto',

			wrap_ID			: 'slider_track_wrapper',
			wrap_CLASS		: 'slider',
			wrap_ELEMENT	: 'div',

			obj_NUMBER		: 8,
			obj_HIGHLIGHT_CLASS : 'activeSlide',
			obj_NAV_PREV	: '.prev',
			obj_NAV_NEXT	: '.next',

			detect			: true
		},options);

		var wrap_STYLE =	{	'overflow-x': setting.wrap_OVERFLOW_X,
								'overflow-y': setting.wrap_OVERFLOW_Y,
								'width'		: setting.wrap_WIDTH,
								'height'	: setting.wrap_HEIGHT,
								'margin'	: setting.wrap_MARGIN
							};
		var nav = {
			PREV : setting.obj_NAV_PREV,
			NEXT : setting.obj_NAV_NEXT
		};

		if(this.length > 0){
			// Initial Setup
			var el = $(this);
			var obj = {
				total_WIDTH : $(this).outerWidth()
			};
			obj.child_TOTAL_WIDTH = 0;

			if( el.children().length > setting.obj_NUMBER ){
				$.each( el.children(), function(){
					obj.child_TOTAL_WIDTH += el.outerWidth();
				});

				wrap_HTML = '<'+ setting.wrap_ELEMENT +' class="'+ setting.wrap_CLASS +'" id="'+ setting.wrap_ID  +'" />';

				$(this).wrap( wrap_HTML );
				$(this).css({ 'width': obj.total_WIDTH , 'position' : 'relative' });
				var wrapper = $('#'+setting.wrap_ID);

				wrapper.css( wrap_STYLE );

				// Nav Listener			
				$( nav.NEXT ).on('click', function(){
					highlightPosition(el, 'next');
				});

				$( nav.PREV ).on('click', function(){
					highlightPosition(el, 'prev');
				});
			}else{
				$( '.hall-of-fame-wrapper .nav.prev, .hall-of-fame-wrapper .nav.next' ).hide();
			}



		}else{
//			console.log('[Slider] - Object length not enough.');
		}

		// HIGHLIGHT 

		function highlightPosition( el , nav ){
			var obj;
			var highlighted = {
				idx			: -1,
				pos			: null,
				left		: null,
				right		: null,
				scoll_POS	: 0
			};

			var child = el.children();
			var _index;
			$.each( child, function(idx){
				if( $(this).hasClass( setting.obj_HIGHLIGHT_CLASS ) ){
					highlighted.idx = idx;
					obj = child.eq( idx );
					return false;
				}

			});

			highlighted.pos = obj.position();
			highlighted.left = highlighted.pos.left;
			highlighted.right = highlighted.left + obj.outerWidth();
			scrollLeft_pos = highlighted.right - obj.outerWidth()/2;

			el_margin = parseInt( el.css('margin-left'), 10 );
			// var scroll_X = highlighted.pos.left*highlighted.idx;	

			if( highlighted.idx === 0 ){
				el.animate({ 'margin-left' : 0 });
			}else if( highlighted.idx == child.length-1 ){
				margin_left = el.outerWidth() - parseInt( setting.wrap_WIDTH , 10 ) ;
				el.animate({ 'margin-left' : '-' + margin_left + 'px' });
			}else if( highlighted.right > parseInt( setting.wrap_WIDTH , 10 ) && nav == 'next'){
				el_margin -= obj.outerWidth();
				margin_left = el_margin + 'px';
				el.animate({ 'margin-left' : margin_left });
			}else if( highlighted.right > parseInt( setting.wrap_WIDTH , 10 ) && nav == 'prev' ){
				el_margin += obj.outerWidth();
				margin_left = el_margin + 'px';

				if( (obj.outerWidth() - el_margin ) < obj.outerWidth() ){
					el_margin += obj.outerWidth();
					margin_left = el_margin + 'px';
				}
				el.animate({ 'margin-left' : margin_left });
			}

		}
	};
})(jQuery);
