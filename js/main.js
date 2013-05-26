$(document).ready(function(){


//	$('.list-wrapper').slider();

	$('.list-wrapper').expoSlider({ 
		debug: true , 
		highlighter: '.activeSlide',
		prev: '.prev',
		next: '.next',
		horizontalSpeed: 300
	});
});