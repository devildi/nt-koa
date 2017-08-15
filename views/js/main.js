$(function(){
	var sidebar = $('.sidebar')
	$('.wel_top1_right').on('click', function(e){
		e.preventDefault()
		e.stopPropagation()
		sidebar.css('right',0)
	})
	$('.top-left').on('click', function(e){
		e.preventDefault()
		e.stopPropagation()
		sidebar.css('right',-250)
	})
	$('.wel_top1').on('click', function(e){
		e.preventDefault()
		e.stopPropagation()
		sidebar.css('right',-250)
	})
})