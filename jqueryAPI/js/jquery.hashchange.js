window.addEventListener('hashchange', function(e) {
		 var query=location.hash.substring(1);
		console.log(e.oldURL);
		console.log(e.newURL);
		if (query == "")
		{
			$("#content_main").load("index.htm .content_warp",function(){
				$("title").text("jQuery API 中文文档(适用jQuery 1.0 - jQuery 3.0)");
			});
		}else{
			$("#content_main").load(query,function(){
				$("title").text($("#content_box title").text());
			});
		}
}, false);

