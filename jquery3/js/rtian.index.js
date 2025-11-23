var path = window.location.pathname.substring(1);
	path = path.substring(path.lastIndexOf("/")+1);
if (path != "index.html")	{
	window.location.href="index.html#" + path;
}

		var $main_menu=$('aside .grid-item'),
		$sub_menus=$('aside .grid .grid-item > ul'),
		$sub_menu=$('aside .grid .grid-item > ul ul li');

$('#article_content a[href^="#"]').click(function(){
	var q=$(this).attr("href").substring(1);
	if (q == "index.html" ){		
	window.location.href="index.html";
	}
	else{
		$("#article_content").load(q);
		var $a=$sub_menu.find('a[href="#' + q + '"]').parent();//列表项li
			$a = $a.is('li')?$a:$a.parent();
		var	$b=$a.parent().parent().parent(),//列表区ul：折叠
			$c=$b.parent();//分类名称h2
		if ($c.hasClass('active') == false){
			$sub_menus.slideUp("fast"), 
			$main_menu.removeClass("active"),
			$c.addClass("active"),
			$b.slideDown(function(){
				$("aside").mCustomScrollbar("scrollTo",$a)
			});
		}
		$sub_menu.removeClass();
		$a.addClass('active');


	}
	
});
