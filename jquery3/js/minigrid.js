(function(exports){

  function minigrid(containerSelector, itemSelector, gutter, animate, done) {
    var forEach = Array.prototype.forEach;
    var containerEle = document.querySelector(containerSelector);
    var itemsNodeList = document.querySelectorAll(itemSelector);
    gutter = gutter || 6;
    containerEle.style.width = '';
    var containerWidth = containerEle.getBoundingClientRect().width;
    var firstChildWidth = itemsNodeList[0].getBoundingClientRect().width + gutter;
    var cols = Math.max(Math.floor((containerWidth - gutter) / firstChildWidth), 1);
    var count = 0;
    containerWidth = (firstChildWidth * cols + gutter) + 'px';
    containerEle.style.width = containerWidth;
    
    for (var itemsGutter = [], itemsPosX = [], g = 0; g < cols; g++) {
      itemsPosX.push(g * firstChildWidth + gutter);
      itemsGutter.push(gutter);
    }
    forEach.call(itemsNodeList, function(item){
	item.style.position = 'absolute' ;
	item.style.background = getColor_rgba(1,1,1,.4);
     var itemIndex = itemsGutter.slice(0).sort(function (a, b) {
        return a - b;
      }).shift();
      itemIndex = itemsGutter.indexOf(itemIndex);
      var posX = itemsPosX[itemIndex] - gutter;
      var posY = itemsGutter[itemIndex] - gutter;
      var transformProps = [
        'webkitTransform', 
        'MozTransform', 
        'msTransform',
        'OTransform', 
        'transform'
      ];
      var transitionProps = [
        'webkitTransition', 
        'MozTransition', 
        'msTransition',
        'OTransition', 
        'transition'
      ];
      if (!animate) {
        forEach.call(transformProps, function(transform){
          item.style[transform] = 'translate(' + posX + 'px,' + posY + 'px)';
        }),
        forEach.call(transitionProps, function(transition){
          item.style[transition] = '.3s ease-in-out';
        });  
      }
      itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutter;
      count = count + 1;
      if (animate) {
 		item.style['opacity'] = '0';
        return animate(item, posX, posY, count);
      }
    });

    var containerHeight = itemsGutter.slice(0).sort(function (a, b) {
      return a - b;
    }).pop();

    containerEle.style.height = containerHeight + 'px';

    if (typeof done === 'function'){
      done();
    }
  }

  if (typeof define === 'function' && define.amd) {
    define(function() { return minigrid; });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = minigrid;
  } else {
    exports.minigrid = minigrid;
  }

})(this);

	function getColor_rgba(r, g, b, a) {
		/*
		*************************
		*1.R.tian @2015.12
		*2.分系列显示随机颜色：如红色系（随机深浅颜色）。
		*3.格式：getColor_rgba(r, g, b, a)
		*4.其中r、g、b取值0和1，a取值0~1设置不透明度。
		*5.示例：getColor_rgba(1, 0, 0,0.8)  颜色为红色类别的随机颜色，不透明度0.8
		*6.网站：http://eduppp.cn
		*****************************
		*/
		var rgb = 155,
			c = Math.floor(Math.random() * (255 - rgb) + rgb);
		if (r * g * b == 1) {
			r = Math.floor(Math.random() * 255),
			g = Math.floor(Math.random() * 255),
			b = Math.floor(Math.random() * 255)
		} else if (r + g + b == 0) {
			var t = Math.floor(Math.random() * 255),
			r = t,
			g = t,
			b = t
		} else {
			r = r == 1 ? (Math.floor(Math.random() * (255 - rgb) + rgb)) : (Math.floor(Math.random() * (c / 2))),
			g = g == 1 ? Math.floor(Math.random() * (255 - rgb) + rgb) : Math.floor(Math.random() * (c / 2)),
			b = b == 1 ? Math.floor(Math.random() * (255 - rgb) + rgb) : Math.floor(Math.random() * (c / 2))
		}
		return "rgba(" + r + "," + g + "," + b + "," + a + ")"
	}
