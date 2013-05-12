(function($){
	$.fn.expoSlider = function( options ){

		// Default Setting
		var setting = $.extend({
			debug		: false,			
			highlighter	: '.expoActive',					
			startFrom	: 0,
			displayChild: 3,

			sychSelector: null,

			// Navigator setting
			prev		: '.expoPrev',
			next		: '.expoNext',
			pagination	: false
		}, options );


		// Bind Console for shorten console.log
		// and enable turn on/off log immediately with setting		
		var log = setting.debug ? console.log.bind( console ) : $.noop;
		console.log( 'Debug mode now is ' + setting.debug );


		return this.each( function(){
			var hen = $(this);
			var chick =	hen.children();
			var chicken = {				
				len		: chick.length,
				width	: getTotalWidth(chick),
				highlightIndex	: initialHighlighter(chick),
				cleanHighlighter : setting.highlighter.substring(1)
			};
			log( "[EXPO] You have "+ chicken.len + " Chick");

			// Go Previous
			$( setting.prev ).on('click', function(){				
				updateHighlighter( chick, chicken , setting.prev );
			});
			// Go Next
			$(  setting.next ).on('click', function(){
				updateHighlighter( chick, chicken , setting.next );
			});
			// Click on Chick
			chick.on('click', function(){
				updateHighlighter( )
			});
		});

		function getTotalWidth( chick ){
			var totalWidth = 0;
			chick.each(function(){
				//log( "[EXPO] ", $(this).outerWidth() );
				totalWidth += $(this).outerWidth();
			});
			log( "[EXPO] Total Width ", totalWidth );
			return totalWidth;
		}

		function getTotalHeight( chick ){
			var totalHeight = 0;
			chick.each(function(){
				//log( "[EXPO] ", $(this).outerWidth() );
				totalHeight += $(this).outerHeight();
			});
			log( "[EXPO] Total Height ", totalHeight );
			return totalHeight;
		}

		function initialHighlighter( chick ){
			var currentHighlight = 0;

			log( "[EXPO] Number of Highlighter ", $(setting.highlighter).length );
			log( "[EXPO] Highlighter is " + setting.highlighter );
			if( $(setting.highlighter).length > 1 ){
				var cleanHighlighter = setting.highlighter.substring(1);			
				chick.removeClass( cleanHighlighter );
				chick.eq( setting.startFrom ).addClass( cleanHighlighter );
				return setting.startFrom;
			}else{
				chick.each(function(index){				
					if( $(this).hasClass(setting.highlighter) ){
						currentHighlight = index;
						return index;
					}
				});
			}
		}

		function updateHighlighter( chick, current , index ){
			if( !setting.pagination ){
				switch( index ){
					case setting.prev : 
						log( "[EXPO] Current Highlighter ", current.highlightIndex );
						if( current.highlightIndex > 0 
							&& current.highlightIndex < current.len 
							&& current.highlightIndex != 0 ){
							chick.eq(current.highlightIndex).removeClass(current.cleanHighlighter);							
								current.highlightIndex--;
							chick.eq(current.highlightIndex).addClass(current.cleanHighlighter);
						}else{
							log( "[EXPO] Reach first" );
						}
						log( "[EXPO] is Prev" );
						break;

					case setting.next : 
						log( "[EXPO] Current Highlighter ", current.highlightIndex );
						if( ( current.highlightIndex + 1 ) < current.len ){
							chick.eq(current.highlightIndex).removeClass(current.cleanHighlighter);							
								current.highlightIndex++;
							chick.eq(current.highlightIndex).addClass(current.cleanHighlighter);
						}else{
							log( "[EXPO] Reach lasr" );
						}
						log( "[EXPO] is Next" );
						break;
				}
			}
		}		
	}
})(jQuery);


$(document).ready(function(){


	$('.list-wrapper').slider();

	$('.list-wrapper').expoSlider({ 
		debug: true , 
		highlighter: '.activeSlide',
		prev: '.prev',
		next: '.next'
	});
});