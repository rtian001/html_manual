var $scrollbar = false;
if (navigator.userAgent.match(/android|iphone|ipad/ig)) {
	$scrollbar = false;
	$('<style></style>').load('css/app-mobile.css').appendTo($('head'));
} else {
	$scrollbar = true;
	$('<style></style>').load('css/app.css').appendTo($('head'));
	$.getScript('js/jquery.tinyscrollbar.js');
	$.getScript('js/scrollbar.js');
}
$(function($) {
	$sidebar = $('#sidebar');
	$content = $('#content');
	$frame = $('#right');
	sidebar_file = 'sidebar.md';
	//侧边栏
	$.get(sidebar_file).then(data => {
		//获取目录文件，转换并放置
		$sidebar.html(marked(data));
		//初始化，第一条标题添加进度条
		$sidebar.prepend('<div class="progress"></div>');
		//标题点击事件，添加标题滚动条
		$menulist = [];
		$sidebar.index = 0;
		$sidebar.find('ol>li').map(function(i, li) {
			let file = $(li).find('a').attr('href').replace(/[#\/]/g, '-');
			$menulist.push(file);
			li.id = file;
			$(li).addClass('cata');
			$(li).on('click', function() {
				$sidebar.index = i;
				let url = $(li).find('a').attr('href');
				location.href = url;
				!$scrollbar && $sidebar.fadeOut();
			});
		});
		$('#pageup').on('click', function() {
			let n = $sidebar.index - 1;
			if (n >= 0) $('#' + $menulist[n]).click();
		});
		$('#pagedown').on('click', function() {
			let n = $sidebar.index + 1;
			if (n < $menulist.length) $('#' + $menulist[n]).click();
		});
		$('#menu').on('click', function() {
			$sidebar.fadeToggle();
		});
		//pagedown、pageup事件
		//更新内容后，同步更新滚动条
		$scrollbar && scrollbar_l.update();
	});
	//路由管理
	router();
	$(window).on('hashchange', router);
});

function router() { //路由器，根据hash信息处理请求
	var [file, section] = location.hash.slice(1).split('#');
	file = file || 'readme';
	$.get(file + '.md').then(data => {
		//获取指定文件，加载
		$content.html(marked(data)); //解析md文件，并放置内容
		$content.find('code').map(function() { //高亮代码处理
			Prism.highlightElement(this);
		});
		create_page_anchors(file); //生成页内目录
		//修改文档标题（浏览器标签）
		let title = $content.find('h1').text();
		$('title').html(title + ' - ECMAScript 6入门');
		$frame.scrollTop(0);
		let $sid = '-' + file.replaceAll('/', '-');
		$('.active').removeClass('active');
		$('#' + $sid).addClass('active');
		$('#' + $sid).append($('.progress'));
		if ($scrollbar) {
			//-------------- 更新滚动条
			scrollbar_r.update();
			setTimeout(() => scrollbar_r.update('relative'), 200);
			//-------------
			/**/
			var reading = $('.reading-progress');
			var progress = $('.progress');
			reading.css('width', 0);
			progress.css('width', 0);
			$(window).on('move', function() {
				let cont_h = $content.height();
				let viewport_h = $content.parent().height();
				let scroll_h = ~~(cont_h - viewport_h);
				window.requestAnimationFrame(function() {
					var perc = Math.max(0, Math.min(1, scrollbar_r.contentPosition / scroll_h));
					updateProgress(perc);
				});

				function updateProgress(perc) {
					progress.css({
						width: (perc * 110) + '%'
					});
					reading.css({
						width: perc * 100 + '%'
					});
				}
			});
			if (section) {
				$(window).trigger('move');
				goSection(decodeURI(section), 0);
			}
		}
		//-------------------
		//如果有章节信息，跳转到页内章节
	});
}

function create_page_anchors(doc) { //生成页面内二级标题目录
	if ($content.find('h2').length) {
		var ul_tag = $('<ol></ol>').insertAfter('#content h1').addClass('content-toc').attr('id', 'content-toc');
		$content.find('h2').map(function() {
			var content = $(this).text();
			var text = replace_symbols(content); //处理特殊字符
			this.id = text;
			this.className = text;
			var li_tag = $('<li></li>').html('<a href="#' + doc + '#' + text + '">' + content + '</a>');
			li_tag.attr('data-src', text);
			li_tag.attr('class', 'link');
			li_tag.click(function(e) {
				e.preventDefault();
				history.pushState(null, null, location.hash + '#' + text);
				goSection(text);
			});
			ul_tag.append(li_tag);
			//===============在原二级标题上添加附加章节和顶部锚点
			$(this).hover(function() {
				$(this).html(content + ' <a href="#' + doc + '#' + text + '" class="section-link">§</a> <a class="gotop" href="#">⇧</a>');
			}, function() {
				$(this).html(content);
			});
			$(this).on('click', 'a.section-link', function(event) {
				event.preventDefault();
				history.pushState(null, null, '#' + doc + '#' + text);
				goSection(text);
			});
			$(this).on('click', 'a.gotop', function(event) {
				$(window).trigger('move');
				event.preventDefault();
				history.pushState(null, null, '#' + doc);
				$frame.scrollTop(0);
				$scrollbar && scrollbar_r.update();
			});
			//-------------
		});
	}
}

function goSection(sectionId, speed = 200) {
	$(window).trigger('move');
	let top = ($('#' + sectionId).position().top) + 50;
	let content_h = $content.outerHeight();
	let viewport_h = $frame.outerHeight();
	if (content_h < viewport_h) return;
	let offset_h = Math.min(top, content_h - viewport_h);
	$frame.scrollTop(offset_h);
	// $content.animate({
	// 	top: -offset_h
	// }, speed);
	$scrollbar && scrollbar_r.update(offset_h);
	original_color = $('#' + sectionId).css('color');
	$('#' + sectionId).animate({
		color: '#ED1C24',
	}, 500, function() {
		$(this).animate({
			color: original_color
		}, 2500);
	});
}

function replace_symbols(text) {
	return text.replace(/[&\/\\#!,.+=$~%'":：，、*?<>（\ \]\[]+/g, '-').replace(/[()）{}]/g, '');
}