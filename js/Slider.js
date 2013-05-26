/*
*	expoSlider
*	Authored by Kang Guang Xiang
*	version 1.0
*/
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
		var childrenInfo = {
				len		: -1,
				width	: null,
				highlightIndex	: null,
				cleanHighlighter : null
			};
		var childInfo = [];
		var childPos = [];
		var wrapper = null;

		// Bind Console for shorten console.log
		// and enable turn on/off log immediately with setting		
		var log = setting.debug ? console.log.bind( console ) : $.noop;
		console.log( 'Debug mode now is ' + setting.debug );

		return this.each( function(){
			hen = $(this);
			child =	hen.children();
				childrenInfo.len	= child.length,
				childrenInfo.width = getTotalWidth(child),
				childrenInfo.highlightIndex = initialHighlighter(child, hen),
				childrenInfo.cleanHighlighter = analyseSelector( setting.highlighter );

			log( "\t[EXPO] You have "+ childrenInfo.len + " child");

			init();

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
				updateHighlighter();
			});
		});

		function init(){
			//Create a wrapper for track
			setTrack(child, hen);

			// child.each(function(index){
			// 	childPos.push( $(this).position().left );
			// });
			getPosition();
			console.log( childPos );
		}

		function getPosition(){

			var dist = 0;
			// child.each(function( index ){
			var thisInfo = [];
			// });
			console.log( childrenInfo.len );
			for (var i = 0 ; i < childrenInfo.len; i++) {
				thisChild = child.eq(i);
				thisChild_MarginLeft = parseInt( thisChild.css('margin-left'), 10 );
				thisChild_MarginRight = parseInt( thisChild.css('margin-right'), 10 );

				childPos.push( dist );
				dist += thisChild.outerWidth() + thisChild_MarginLeft + thisChild_MarginRight;

				childWidth = thisChild.outerWidth() + thisChild_MarginLeft + thisChild_MarginRight;


				// console.log( $(setting.wrapper).width(), childWidth );
				// console.log( $(setting.wrapper).width()/childWidth );
			}
			return dist;
		}

		function initialHighlighter( child, hen ){
			var currentHighlight = 0;
			var cleanWrapper = setting.wrapper.substring(1);
			var cleanHighlighter = setting.highlighter.substring(1);

			log( "\t[EXPO] Number of Found Highlighter ", $(setting.highlighter).length );
			log( "\t[EXPO] Highlighter is " + setting.highlighter );

			child.removeClass( cleanHighlighter );
			child.eq( setting.startFrom ).addClass( cleanHighlighter );

			return setting.startFrom;
		}

		function updateHighlighter( direction ){
			console.log( setting.animateAction );
			if( !setting.pagination  ){
				switch( direction ){
					// Move Previous
					case setting.prev :
						// log( "[EXPO] Current Highlighter ", childrenInfo.highlightIndex );
						if( childrenInfo.highlightIndex > 0
							&& childrenInfo.highlightIndex < childrenInfo.len
							&& childrenInfo.highlightIndex != 0 ){
							child.eq(childrenInfo.highlightIndex).removeClass(childrenInfo.cleanHighlighter);
								childrenInfo.highlightIndex--;
							child.eq(childrenInfo.highlightIndex).addClass(childrenInfo.cleanHighlighter);
						}else{
							// log( "[EXPO] Reach first" );
						}
						// log( "[EXPO] Moving Prevous" );
						break;
					// Move Next
					case setting.next :
						// log( "[EXPO] childrenInfo Highlighter ", childrenInfo.highlightIndex );
						if( ( childrenInfo.highlightIndex + 1 ) < childrenInfo.len ){
							child.eq(childrenInfo.highlightIndex).removeClass(childrenInfo.cleanHighlighter);
								childrenInfo.highlightIndex++;
							child.eq(childrenInfo.highlightIndex).addClass(childrenInfo.cleanHighlighter);
						}else{
							// log( "[EXPO] Reach last" );
						}
						// log( "[EXPO] Moving Next" );
						break;
				}

				var mobile = setting.mobile;
				var goAnimate = (( setting.nonMobileAnimate && !mobile ) || ( setting.mobileAnimate && mobile )) ? true : false;
				var wrapper = {
					width : $(setting.wrapper).width(),
					halveWidth : $(setting.wrapper).width()/2
				};

				if( goAnimate ){
					posToMove = childPos[ childrenInfo.highlightIndex ];

					console.log( 'check', posToMove % wrapper.width , wrapper.width );
					// $(setting.wrapper).animate({
					// 	scrollLeft: posToMove
					// }, setting.horizontalSpeed , function(){
					// 	setting.animateAction = false;
					// });

					if( posToMove > wrapper.width ){
						console.log('move ', posToMove);
						$(setting.wrapper).animate({
							scrollLeft: posToMove
						}, setting.horizontalSpeed , function(){
							setting.animateAction = false;
						});
					}else{
						//console.log()
						
					}
					//console.log( 'curr Pos ', childrenInfo.highlightIndex , childPos[ childrenInfo.highlightIndex ], 'halve', wrapper.halveWidth );

							
				}else{
					// $(setting.wrapper).scrollLeft( targetPos );
				}
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
