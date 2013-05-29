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
			//wrapper		: 'expoWrapper',
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
		var childInfo = {
			movePosition: [],
			moveNext	: [],
			movePrev	: []
		};

		var childPos = [];
		var childMove = [];
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
				updateHighlighter( 'click' , $(this).index() );
			});
		});

		function init(){
			// Create a wrapper for track
			setTrack(child, hen);			
			getPosition();						
		}

		function getPosition(){

			var dist = 0;
			var moveNext = false;	// To decide whether slide shall move when reach the child
			var measureDist = 0;
			var givenWrapper = $(setting.wrapper);
			var movePrev = 0;

			for (var i = 0 ; i < childrenInfo.len; i++) {
				thisChild = child.eq(i);
				thisChild_MarginLeft = parseInt( thisChild.css('margin-left'), 10 );
				thisChild_MarginRight = parseInt( thisChild.css('margin-right'), 10 );

				childPos.push( dist );
				childInfo.movePosition.push( dist );

				currentChildWidth = thisChild.outerWidth() + thisChild_MarginLeft + thisChild_MarginRight;
				dist += currentChildWidth
				measureDist += currentChildWidth;
				
				if( measureDist >= givenWrapper.width() ){
					moveNext = true;
					measureDist = currentChildWidth;	// reset measureDist
					childInfo.movePrev[i-1] = movePrev;
					movePrev = i;
				}else{
					moveNext = false;
					childInfo.movePrev[i-1] = -1;
				}				
				childMove.push( moveNext );
				childInfo.moveNext.push( moveNext );
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

		function updateHighlighter( direction , selectIndex ){			
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
					// If click directly
					case 'click' :
						child.eq(childrenInfo.highlightIndex).removeClass(childrenInfo.cleanHighlighter);
								childrenInfo.highlightIndex = selectIndex;
						child.eq( childrenInfo.highlightIndex ).addClass(childrenInfo.cleanHighlighter);

						console.log( 'click Index', selectIndex );
						break;
				}

				var mobile = setting.mobile;
				var goAnimate = (( setting.nonMobileAnimate && !mobile ) || ( setting.mobileAnimate && mobile )) ? true : false;				
				var goAnimate = true;
				var wrapper = {
					width : $(setting.wrapper).width(),
					halveWidth : $(setting.wrapper).width()/2
				};

				makeMove = childInfo.moveNext[ childrenInfo.highlightIndex ];

				currentScrollPos = $(setting.wrapper).scrollLeft();				
				posToMove = childInfo.movePosition[ childrenInfo.highlightIndex ];	

				console.log( currentScrollPos-posToMove , $(setting.wrapper).width() );
				if( makeMove ){
					moveToPosition( posToMove, goAnimate );
				}else if( direction == setting.prev && childInfo.movePrev[ childrenInfo.highlightIndex ] != -1 ){
					posToMove = childInfo.movePosition[ childInfo.movePrev[ childrenInfo.highlightIndex ] ];
					moveToPosition( posToMove, goAnimate );
				}else if( currentScrollPos != posToMove ){
					// Try to check if the user has scrolled the slide him/herself
					// and are we going to detect where is scroll now and bring user back the highlight child 
					// when they click "prev" and "next" again.
					
					//moveToPosition( posToMove, goAnimate );
				}else{
					// Do Nothing ...
				}
			}
		}		

		function moveToPosition( posToMove, animate ){
			if( animate ){
				$(setting.wrapper).animate({
					scrollLeft: posToMove
				}, setting.horizontalSpeed , function(){
					setting.animateAction = false;
				});
			}else{
				$(setting.wrapper).scrollLeft( posToMove );
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
			var wrapper = document.createElement('div');
			wrapper.className = setting.wrapper;
			hen.wrap('<div class="'+ analyseSelector( setting.wrapper ) +'" />');
			//hen.wrap( wrapper );

			console.log( wrapper, wrapper.className );
			$( setting.wrapper ).css({
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
