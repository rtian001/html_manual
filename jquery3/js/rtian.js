  (function(){
	  //----克隆列表项到内容区
	  //$('#article_content').load('add.txt');
		$('#article_content').html($('aside .grid').clone());
		//-----aside、article设置滚动条
		$("aside").mCustomScrollbar({theme:"minimal"});
		$("article").mCustomScrollbar({theme:"minimal-dark"});
		//-----内容区瀑布流布局
		minigrid('#article_content .grid', '#article_content .grid-item',6,animate);
		window.addEventListener('resize', function(){
			  minigrid('#article_content .grid', '#article_content .grid-item',6,animate),
			$("article").mCustomScrollbar("scrollTo","top",{scrollInertia:0})
		});
		//-------------------------------
		var $main_menu=$('aside .grid-item'),
		$sub_menus=$('aside .grid .grid-item > ul'),
		$sub_menu=$('aside .grid .grid-item > ul ul li'),
		$sub_menu2=$('#article_content .grid .grid-item > ul ul li');

 var query=location.hash.substring(1);
 if (query != "" && query != "index.html")
 {
	$("#article_content").load(query);
		var $a=$sub_menu.find('a[href="#' + query + '"]').parent();//列表项li
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

	$main_menu.find('h2').click(function(){
		//*****分类项按钮**********
		var a = $(this).parent();
		a.hasClass("active") ? (a.children('ul').slideUp("fast"), a.removeClass("active")) : ($sub_menus.slideUp("fast"), $main_menu.removeClass("active"), a.children('ul').slideDown("fast"), a.addClass("active"));
	});
	$('aside .grid-index h2').click(function(){
		//*****首页按钮**********
		window.location.href="index.html";
	});
	$sub_menu.click(function(){
		//*****列表项链接**********
		window.location.href=$(this).find("a").attr("href");
		$sub_menu.removeClass(),
		$(this).addClass('active');
		$('#article_content').load($(this).find("a").attr("href").substring(1));
	});
	$sub_menu2.find('a').click(function(){
		//*****速查表区链接**********
		var q = $(this).attr('href').substring(1);
		var $b=$sub_menu.find('a[href="#' + q + '"]').parent();
		$b.addClass('active');
		var a=$b.parentsUntil('.grid-item');
		a.parent().addClass("active"),
		a.slideDown(function(){
				$("aside").mCustomScrollbar("scrollTo",a)
			}),
		$('#article_content').load(q);

	});

/**********************************************/
$("#autoquery").autocomplete({
    width: 202,
    lookup: data,
    autoSelectFirst: !0,
  onSelect: function(a) {
        window.location.href = "#" + a.data + ".html";
		var q = a.data + ".html";
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
		$("#autoquery").val('');
		$('#article_content').load(q);
    }
});


  })();



	 function animate(item, x, y, index) {
	//----使用dynamic.js---设置动态效果
	   dynamics.animate(item, {
		 translateX: x,
		 translateY: y,
		 opacity: 1
		}, {
		  type: dynamics.spring,
		  duration: 800,
		  frequency: 120,
		  delay: 100 + index * 30
		});
	 }

