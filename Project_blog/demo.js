$(function(){
	$('#button').toggle(function(){
		$('#box').css('background','blue');


	},function(){
		$('#box').css('background','green');


	},function(){
		$('#box').css('background','red')
	});
	$('#button2').toggle(function(){
		$('#pox').css('background','blue');


	},function(){
		$('#pox').css('background','green');


	},function(){
		$('#pox').css('background','red')
	});



});