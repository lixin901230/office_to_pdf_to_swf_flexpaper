// JavaScript Document
$(document).ready(function() {
var rows=$('table').find('tbody tr').length;
var no_rec_per_page=5;
var curr_page=1;
var no_pages= Math.ceil(rows/no_rec_per_page);
var $pagenumbers=$('<div id="pages"></div>');
for(i=0;i<no_pages;i++)
{
	 if(i==0)
	 	$('<span class="page curr_page">'+(i+1)+'</span>').appendTo($pagenumbers);
	 else
	 	$('<span class="page">'+(i+1)+'</span>').appendTo($pagenumbers);
}

$pagenumbers.insertAfter('table');
$('.page').hover(
function(){
$(this).addClass('hover');
},
function(){
$(this).removeClass('hover');
}
);
$('table').find('tbody tr').hide();
var tr=$('table tbody tr');
for(var i=0;i<=no_rec_per_page-1;i++)
{
$(tr[i]).show();
}
$('span').click(function(event){
	$('.curr_page').removeClass('curr_page');
	
	$(this).addClass('curr_page');	
	$('table').find('tbody tr').hide();
	curr_page = $(this).text();
	for(i=($(this).text()-1)*no_rec_per_page;i<=$(this).text()*no_rec_per_page-1;i++)
	{
	$(tr[i]).show();
	}
	});
});