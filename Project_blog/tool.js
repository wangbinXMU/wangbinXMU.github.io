

//跨浏览器添加事件绑定
function addEvent(obj, type, fn) {
	if (typeof obj.addEventListener != 'undefined') {
		obj.addEventListener(type, fn, false);
	} else {
		//创建一个存放事件的哈希表(散列表)，JS中对象属性的实现就是哈希表
		if (!obj.events) obj.events = {};
		//第一次执行时执行,判断哈希表中存放的类型属性
		if (!obj.events[type]) {	
			//创建一个存放事件处理函数的数组
			obj.events[type] = [];
			//把第一次的事件处理函数先储存到第一个位置上
			if (obj['on' + type]) obj.events[type][0] = fn;
		} else {
			//同一个注册函数进行屏蔽，不添加到计数器中
			if (addEvent.equal(obj.events[type], fn)) return false;
		}
		//从第二次开始我们用事件计数器来存储
		obj.events[type][addEvent.ID++] = fn;
		//执行事件处理函数
		obj['on' + type] = addEvent.exec;
	}
}

//为每个事件分配一个计数器
addEvent.ID = 1;

//执行事件处理函数
addEvent.exec = function (event) {
	var e = event || addEvent.fixEvent(window.event);
	var es = this.events[e.type];
	for (var i in es) {
		es[i].call(this, e);
	}
};

//同一个注册函数进行屏蔽
addEvent.equal = function (es, fn) {
	for (var i in es) {
		if (es[i] == fn) return true;
	}
	return false;
}

//把IE常用的Event对象配对到W3C中去
addEvent.fixEvent = function (event) {
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopPropagation = addEvent.fixEvent.stopPropagation;
	event.target = event.srcElement;
	return event;
};

//IE阻止默认行为
addEvent.fixEvent.preventDefault = function () {
	this.returnValue = false;
};

//IE取消冒泡
addEvent.fixEvent.stopPropagation = function () {
	this.cancelBubble = true;
};


//跨浏览器删除事件
function removeEvent(obj, type, fn) {
	if (typeof obj.removeEventListener != 'undefined') {
		obj.removeEventListener(type, fn, false);
	} else {
		if (obj.events) {
			for (var i in obj.events[type]) {
				if (obj.events[type][i] == fn) {
					delete obj.events[type][i];
				}
			}
		}
	}
}


//跨浏览器获取视口大小
function getInner() {
	if (typeof window.innerWidth != 'undefined') {
		return {
			width : window.innerWidth,
			height : window.innerHeight
		}
	} else {
		return {
			width : document.documentElement.clientWidth,
			height : document.documentElement.clientHeight
		}
	}
}
//跨浏览器获取滚动条移动后，窗口的总的位置
function getScroll(){
	return {
		top:document.documentElement.scrollTop||document.body.scrollTop,
		left:document.documentElement.scrollLeft||document.body.scrollLeft
	};
}
//跨浏览器获取Style
function getStyle(element, attr) {
	var value;
	//将获取到的如'100px'这样的字符串式的值转化成整型，同时也去掉了单位
	if (typeof window.getComputedStyle != 'undefined') {//W3C
		value= (window.getComputedStyle(element, null)[attr]);
	} else if (typeof element.currentStyle != 'undeinfed') {//IE
		value= (element.currentStyle[attr]);
	}
	return value;
}


//判断class是否存在
function hasClass(element, className) {
	return element.className.match(new RegExp('(\\s|^)' +className +'(\\s|$)'));
}


//跨浏览器添加link规则
function insertRule(sheet, selectorText, cssText, position) {
	if (typeof sheet.insertRule != 'undefined') {//W3C
		sheet.insertRule(selectorText + '{' + cssText + '}', position);
	} else if (typeof sheet.addRule != 'undefined') {//IE
		sheet.addRule(selectorText, cssText, position);
	}
}

//跨浏览器移出link规则
function deleteRule(sheet, index) {
	if (typeof sheet.deleteRule != 'undefined') {//W3C
		sheet.deleteRule(index);
	} else if (typeof sheet.removeRule != 'undefined') {//IE
		sheet.removeRule(index);
	}
}

//删除左后空格
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

//滚动条清零
function scrollTop() {
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
}
//浏览器检测
(function (){
window.sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/opr\/([\d.]+)/))?sys.opera=s[1]:0;
(s = ua.match(/version\/([\d.]+)/))?sys.safari=s[1]:0;
(s = ua.match(/msie ([\d.]+)/))?sys.ie=s[1]:0;
(s = ua.match(/firefox\/([\d.]+)/))?sys.firefox=s[1]:0;
(s = ua.match(/chrome\/([\d.]+)/))?sys.chrome=s[1]:0;

})();
//DOM加载的兼容方法，主要使DOM结构先加载，再加载图片之类的大文件
function addDomLoaded(fn){
	if(document.addEventListener){
		addEvent(document,'DOMContentLoaded',function(){
			fn();
			removeEvent(document,'DOMContentLoaded',arguments.callee);
		});
	}else{
		var timer=null;
		timer=setInterval(function(){
			try{
				document.documentElement.doScroll('left');
				fn();
			}catch(e){
				//
			}
		});
	}
}