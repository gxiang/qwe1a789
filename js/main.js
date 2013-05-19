(function($){
	$.fn.expoSlider = function( options ){

		// Default Setting
		var setting = $.extend({
			debug		: false,			
			highlighter	: '.expoActive',
			wrapper		: '.expoWrapper',
			startFrom	: 0,
			displayChild: 3,

			sychSelector: null,

			// Navigator setting
			prev		: '.expoPrev',
			next		: '.expoNext',
			pagination	: false,

			// Slider setting
			nonMobileAnimate: true,
			mobileAnimate	: false,
			horizontalSpeed	: 600,
			verticalSpeed : 600,
			// Slide animating
			animateAction	: false,

			// Mobile Detection
			mobile : mobileCheck(),			
		}, options );

		var child;
		var childInfo = {	
				len		: -1,
				width	: null,
				highlightIndex	: null,
				cleanHighlighter : null				
			};
		var childPos = [];

		// Bind Console for shorten console.log
		// and enable turn on/off log immediately with setting		
		var log = setting.debug ? console.log.bind( console ) : $.noop;
		console.log( 'Debug mode now is ' + setting.debug );
	
		return this.each( function(){					
			hen = $(this);
			child =	hen.children();				
				childInfo.len	= child.length,
				childInfo.width = getTotalWidth(child),
				childInfo.highlightIndex = initialHighlighter(child, hen),
				childInfo.cleanHighlighter = analyseSelector( setting.highlighter );			

			log( "\t[EXPO] You have "+ childInfo.len + " child");			

			// Go Previous
			$( setting.prev ).on('click', function(){				
				updateHighlighter( setting.prev );
			});
			// Go Next
			$(  setting.next ).on('click', function(){
				updateHighlighter( setting.next );
			});
			// Click on child
			child.on('click', function(){
				//updateHighlighter();
			});
		});		

		function initialHighlighter( child, hen ){		
			var currentHighlight = 0;
			var cleanWrapper = setting.wrapper.substring(1);
			var cleanHighlighter = setting.highlighter.substring(1);

			log( "\t[EXPO] Number of Found Highlighter ", $(setting.highlighter).length );
			log( "\t[EXPO] Highlighter is " + setting.highlighter );

			//Create a wrapper for track
			setTrack(child, hen);			
			
			child.removeClass( cleanHighlighter );
			child.eq( setting.startFrom ).addClass( cleanHighlighter );			

			child.each(function(index){					
				childPos.push( $(this).position().left );
			});
			
			console.log(childPos, childPos[0], childPos[2]);

			return setting.startFrom;			
		}
		
		function updateHighlighter( direction ){
			console.log( setting.animateAction );
			if( !setting.pagination  ){
				switch( direction ){
					case setting.prev : 
						log( "[EXPO] Current Highlighter ", childInfo.highlightIndex );
						if( childInfo.highlightIndex > 0 
							&& childInfo.highlightIndex < childInfo.len 
							&& childInfo.highlightIndex != 0 ){

							child.eq(childInfo.highlightIndex).removeClass(childInfo.cleanHighlighter);							
								childInfo.highlightIndex--;								
							child.eq(childInfo.highlightIndex).addClass(childInfo.cleanHighlighter);							
						}else{
							log( "[EXPO] Reach first" );							
						}
						log( "[EXPO] Moving Prevous" );
						break;

					case setting.next : 
						log( "[EXPO] childInfo Highlighter ", childInfo.highlightIndex );
						if( ( childInfo.highlightIndex + 1 ) < childInfo.len ){
							child.eq(childInfo.highlightIndex).removeClass(childInfo.cleanHighlighter);							
								childInfo.highlightIndex++;
							child.eq(childInfo.highlightIndex).addClass(childInfo.cleanHighlighter);							
						}else{
							log( "[EXPO] Reach last" );							
						}
						log( "[EXPO] Moving Next" );
						break;
				}
				
				console.log( $(setting.wrapper).position() );
				var wrapperPosLeft = getPosition( $(setting.wrapper) , 0);
				
				var targetPos = childPos[ childInfo.highlightIndex ] - wrapperPosLeft;
				log( "[EXPO] Highlighter Pos ", childPos[ childInfo.highlightIndex ] , wrapperPosLeft );
				
				log( "[EXPO] Target Pos ", targetPos );
				var mobile = setting.mobile;			
				var goAnimate = (( setting.nonMobileAnimate && !mobile ) || ( setting.mobileAnimate && mobile )) ? true : false;

				if( goAnimate ){
					setting.animateAction = true;
					$(setting.wrapper).animate({
					scrollLeft: targetPos }, setting.horizontalSpeed , function(){
						setting.animateAction = false;
					});
				}else{
					$(setting.wrapper).scrollLeft( targetPos );
				}				
			}
		}	

		function getPosition( selector , times){
			console.log( 'Times  ', times);
			var selectorLeft = selector.position().left;
			if( selectorLeft != 0 ){
				console.log( 'IF 0.5 ', selectorLeft );
				//console.log( selector.parent().position().left );
				return getPosition( selector.parent() , times+1 );
			}else if( selectorLeft == 0 ){
				selectorLeft = parseInt( selector.css('margin-left'), 10);
				console.log( 'IF 0 ', selectorLeft );
				console.log( 'IF 0 ', selector.css('margin') );
				return selectorLeft;
			}else{
				return selectorLeft;
			}
		}

		function mobileCheck(){
			// Simple Mobile Detection
			if( navigator.userAgent.match(/Android/i)
			 || navigator.userAgent.match(/webOS/i)
			 || navigator.userAgent.match(/iPhone/i)
			 || navigator.userAgent.match(/iPad/i)
			 || navigator.userAgent.match(/iPod/i)
			 || navigator.userAgent.match(/BlackBerry/i)
			 || navigator.userAgent.match(/Windows Phone/i)
			 ){
				return true;
			} else {
				return false;
			}
		}
		function getTotalWidth( child ){
			var totalWidth = 0;
			child.each(function(){
				//log( "[EXPO] ", $(this).outerWidth() );				
				marginLeft = parseInt($(this).css('margin-left'), 10);
				marginRight = parseInt($(this).css('margin-right'), 10);
				
				totalWidth += $(this).outerWidth() + marginLeft + marginRight;
			});
			log( "\t[EXPO] Total Width ", totalWidth );
			return totalWidth;
		}

		function getTotalHeight( child ){
			var totalHeight = 0;
			child.each(function(){
				//log( "[EXPO] ", $(this).outerWidth() );
				totalHeight += $(this).outerHeight();
			});
			log( "\t[EXPO] Total Height ", totalHeight );
			return totalHeight;
		}

		function getHighestChild( child ){
			log( "[EXPO Func] getHighestChild called." );
			var highest = -1;
			var highest_index;
			child.each( function( index ){
				if( $(this).outerHeight() > highest ){
					highest = $(this).outerHeight();				
					highest_index = index;
					log( "\t[EXPO] highest found child is ", highest_index, highest );
					return highest;		
				}				
			});		
		}

		function setTrack( child, hen ){
			log( "[EXPO Func] setTrack called." );
			//var cleanWrapper = analyseSelector( setting.wrapper );
			hen.wrap('<div class="'+ analyseSelector( setting.wrapper ) +'" />');
			$(setting.wrapper).css({
				'height' : getHighestChild( child ),
				'overflow' : 'hidden',
				'width' :  hen.css('width'),
				'max-width' : hen.css('max-width')
			});
			hen.css({
				'width'	: getTotalWidth(child),
				'max-width'	: getTotalWidth(child)
			});
		}

		function analyseSelector( selector ){
			log( "[EXPO Func] analyseSelector called." );
			var sel = $.trim(selector);
			var identifyType = sel.substring(0,1);
			var identifyName = sel.substring(1);

			return identifyName;			
		}
	}
})(jQuery);


$(document).ready(function(){


//	$('.list-wrapper').slider();

	$('.list-wrapper').expoSlider({ 
		debug: true , 
		highlighter: '.activeSlide',
		prev: '.prev',
		next: '.next'
	});
});