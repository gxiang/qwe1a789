$(document).ready(function(){


//	$('.list-wrapper').slider();

	$('.list-wrapper.one').expoSlider({ 
		debug: true , 
		highlighter: '.activeSlide',
		prev: '.less .prev',
		next: '.less .next',
		horizontalSpeed: 300,
		moveAnimate: true
	});

	$('.list-wrapper.two').expoSlider({ 
		debug: true , 
		highlighter: '.activeSlide',
		wrapper: '.expoWrapper-2',
		prev: '.more .prev',
		next: '.more .next',
		horizontalSpeed: 300,
		moveAnimate: true
	});
});