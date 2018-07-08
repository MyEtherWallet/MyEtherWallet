$( document ).ready(function() {

//	$(".pmd-textfield .select2-selection").after('<span class="pmd-textfield-focused"></span>');

	var $eventSelect = $(".pmd-select2");
	$eventSelect.on("select2:opening", function () { 
		$(this).closest('.pmd-textfield').addClass("pmd-textfield-floating-label-active pmd-textfield-floating-label-completed");
	});
	
	$eventSelect.on("select2:close", function () {
		$(".pmd-textfield").removeClass("pmd-textfield-floating-label-active"); 
		var selected_value = $(this).val();
   		if (selected_value==0 || selected_value=='' || selected_value==undefined) {
			$(this).closest('.pmd-textfield').removeClass("pmd-textfield-floating-label-completed");
   		} else {
			$(this).closest('.pmd-textfield').addClass("pmd-textfield-floating-label-completed");
		}
	});
	$eventSelect.each(function(){
		var selected_value = $(this).val();
   		if (selected_value==0 || selected_value=='' || selected_value==undefined) {
			$(this).closest('.pmd-textfield').removeClass("pmd-textfield-floating-label-completed");
   		} else {
			$(this).closest('.pmd-textfield').addClass("pmd-textfield-floating-label-completed");
		}
	});
	
	var $eventSelectTag = $(".pmd-select2-tags");
	$eventSelectTag.on("select2:opening", function () { 
		$(this).closest('.pmd-textfield').addClass("pmd-textfield-floating-label-active pmd-textfield-floating-label-completed");
	});
	
	$eventSelectTag.on("select2:close", function () {
		$(".pmd-textfield").removeClass("pmd-textfield-floating-label-active");
		var selected_tag = $(this).closest('.pmd-textfield').find('.select2-selection__choice').hasClass('select2-selection__choice');
		if (selected_tag) {
			$(this).closest('.pmd-textfield').addClass("pmd-textfield-floating-label-completed");
		} else {
			$(this).closest('.pmd-textfield').removeClass("pmd-textfield-floating-label-completed");
		}
	});
	
	$eventSelectTag.on("change", function(){
		if ($('.select2-selection__rendered li').hasClass('select2-selection__choice')) {
			$(this).closest('.pmd-textfield').addClass("pmd-textfield-floating-label-completed");
		} else {
			$(this).closest('.pmd-textfield').removeClass("pmd-textfield-floating-label-completed");
		}
	});
	
	$eventSelectTag.each(function(){
		var selected_tag = $(this).find('option').attr('selected')
		if (selected_tag) {
			$(this).closest('.pmd-textfield').addClass("pmd-textfield-floating-label-completed");
		} else {
			$(this).closest('.pmd-textfield').removeClass("pmd-textfield-floating-label-completed");
		}
	});
	
});