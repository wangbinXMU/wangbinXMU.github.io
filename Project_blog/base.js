
//前台调用
var $ = function (args) {
	return new Base(args);
}
//基础库
function Base(args) {
	//创建一个数组，来保存获取的节点和节点数组
	this.elements = [];
	if (typeof args == 'string') {
		//css模拟 如$('#box .span')
		if (args.indexOf(' ') != -1) {//如果args有空格说明是CSS模拟
			var elements = args.split(' ');			//从空格处把节点拆开成数组形式返回，保存到elements数组里
			var childElements = [];					//存放临时节点对象的数组，解决被覆盖的问题
			var node = [];								//用来存放父节点用的
			for (var i = 0; i < elements.length; i ++) {
				if (node.length == 0) node.push(document);		//如果默认没有父节点，就把document放入
				switch (elements[i].charAt(0)) {
					case '#' :
						childElements = [];				//清理掉临时节点，以便父节点失效，子节点有效
						childElements.push(this.getId(elements[i].substring(1)));
						node = childElements;		//保存父节点，因为childElements要清理，所以需要创建node数组
						break;
					case '.' : 
						childElements = [];
						for (var j = 0; j < node.length; j ++) {
							var temps = this.getClass(elements[i].substring(1), node[j]);
							for (var k = 0; k < temps.length; k ++) {
								childElements.push(temps[k]);
							}
						}
						node = childElements;
						break;
					default : 
						childElements = [];//如$(#box p .a)
						for (var j = 0; j < node.length; j ++) {
							var temps = this.getTagName(elements[i], node[j]);//getTagName返回是数组
							for (var k = 0; k < temps.length; k ++) {
								childElements.push(temps[k]);
							}
						}
						node = childElements;
				}
			}
			this.elements = childElements;
		} else {
	//find模拟, 如$('#box')
			switch (args.charAt(0)) {
				case '#' :
				//将标签对象传入数组
					this.elements.push(this.getId(args.substring(1)));
					break;
				case '.' : 
					this.elements = this.getClass(args.substring(1));
					break;
				default : 
					this.elements = this.getTagName(args);
			}
		}
	}else if (typeof args == 'object'){
		if (args != undefined) {    //这里的undefine区别与typeof返回的带单引号的'undefined'
			this.elements[0] = args;
		}
	}else if(typeof args=='function'){
		//如果传入的是对象则调用下面的方法取代传统的window.onload方法
		addDomLoaded(args);

	}
}
//addDomLoaded方法既可以放在$中,也可以独立做成属性
Base.prototype.ready=function(fn){
	addDomLoaded(fn);

}
//获取ID节点
Base.prototype.getId = function (id) {
	return document.getElementById(id)
};

//获取元素节点数组
Base.prototype.getTagName = function (tag, parentNode) {
	var node = null;
	var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}
	var tags = node.getElementsByTagName(tag);
	for (var i = 0; i < tags.length; i ++) {
		temps.push(tags[i]);
	}
	return temps;
};

//获取CLASS节点数组
Base.prototype.getClass = function (className, parentNode) {
	var node = null;
	var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}
	var all = node.getElementsByTagName('*');
	for (var i = 0; i < all.length; i ++) {
		if (all[i].className == className) {
			temps.push(all[i]);
		}
	}
	return temps;
}

//设置CSS选择器子节点
Base.prototype.find = function (str) {
	var childElements = [];
	for (var i = 0; i < this.elements.length; i ++) {
		switch (str.charAt(0)) {
			case '#' :
				childElements.push(this.getId(str.substring(1)));
				break;
			case '.' : 
				var temps = this.getClass(str.substring(1), this.elements[i]);
				for (var j = 0; j < temps.length; j ++) {
					childElements.push(temps[j]);
				}
				break;
			default : 
				var temps = this.getTagName(str, this.elements[i]);
				for (var j = 0; j < temps.length; j ++) {
					childElements.push(temps[j]);
				}
		}
	}
	this.elements = childElements;
	return this;
}

//获取节点数组中的某一个节点，并返回这个节点对象
Base.prototype.ge = function (num) {	
	return this.elements[num];
};
//获取首个节点，并返回这个节点对象
Base.prototype.first=function(){
	return this.elements[0];	
};
//获取末个节点，并返回这个节点对象
Base.prototype.last=function(){
	return this.elements[this.elements.length-1];	
};
//获取某组节点数组的长度
Base.prototype.length=function(){
	return this.elements.length;
};
//获取某一节点的属性
Base.prototype.attr=function(attr){
	return this.elements[0][attr];	//调用此属性时先调用eq属性，因为 eq会把你找的节点放入this.elements[0]
};
//获取某个节点在节点组中是第几个索引
Base.prototype.index=function(){
	//这个只适用于此时的elements中均包含同一种节点，如：已经获取了ul下的多个li节点，这是才能直接用elements[0]
    var children=this.elements[0].parentNode.children;
    for(var i=0;i<children.length;i++){
    	if(this.elements[0]==children[i]) return i;
    }
};




//获取某一个节点，并且返回Base对象
Base.prototype.eq = function (num) {
	var element = this.elements[num];
	this.elements = [];
	this.elements[0] = element;
	return this;
}

//获取当前节点的下一个元素节点（元素节点 属性节点  文本节点）
Base.prototype.next=function(){
	for(var i=0;i<this.elements.length;i++){
		//将当前元素节点的下一个元素节点替换掉当前节点
		this.elements[i]=this.elements[i].nextSibling;
		//当下一个节点不存在时。
		if(this.elements[i]==null) throw new Error('找不到下一个同级元素节点！');
		//也就是获取到的下一个节点不是元素节点而是文本节点，这主要针对部分低版本浏览器
	    if(this.elements[i].nodeType==3) this.next();
	}
	return this;
};
//获取当前节点的下一个元素节点（元素节点 属性节点  文本节点）
Base.prototype.prev=function(){
	for(var i=0;i<this.elements.length;i++){
		//将当前元素节点的下一个元素节点替换掉当前节点
		this.elements[i]=this.elements[i].previousSibling;
		//也就是获取到的下一个节点不是元素节点而是文本节点，这主要针对部分低版本浏览器
		if(this.elements[i]==null) throw new Error('找不到上一个同级元素节点！');
	    if(this.elements[i].nodeType==3) this.prev();
	}
	return this;
};
//设置CSS
Base.prototype.css = function (attr, value) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 1) {//如果只传入属性值，则表示获取该属性
			return getStyle(this.elements[i], attr);
		}//如果传入两个参数表示修改该属性
		this.elements[i].style[attr] = value;
	}
	return this;
}

//添加Class
Base.prototype.addClass = function (className) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (!hasClass(this.elements[i], className)) {
			this.elements[i].className += ' ' + className;
		}
	}
	return this;
}

//移除Class
Base.prototype.removeClass = function (className) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (hasClass(this.elements[i], className)) {
			this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' +className +'(\\s|$)'), ' ');
		}
	}
	return this;
}

//添加link或style的CSS规则
Base.prototype.addRule = function (num, selectorText, cssText, position) {
	var sheet = document.styleSheets[num];
	insertRule(sheet, selectorText, cssText, position);
	return this;
}

//移除link或style的CSS规则
Base.prototype.removeRule = function (num, index) {
	var sheet = document.styleSheets[num];
	deleteRule(sheet, index);
	return this;
}

//设置(替换)innerHTML,也就是制定节点的内容
Base.prototype.html = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML = str;
	}
	return this;
}

//设置鼠标移入移出方法--over和out是mouseover和mouseout事件要执行的函数
Base.prototype.hover = function (over, out) {
	for (var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i], 'mouseover', over);
		addEvent(this.elements[i], 'mouseout', out);
	}
	return this;
};
//设置点击切换皮肤方法
Base.prototype.toggle=function(){
	for (var i = 0; i < this.elements.length; i++){
		//做成自我执行函数更加简洁
        (function(element,args){
        	var count=0;
			addEvent(element,'click',function(){
		
			args[count++%args.length].call(this);
	})
        })(this.elements[i],arguments);


       /* args[count]();
        count++;
    	if(count>=args.length) count=0;*/  //count大于等于传入的参数的个数时，再让它还原为0,这样就可以是效果循环的显示
        //以上的三行代码可以通过小算法简化为：
	} 

		return this;

};
//用来解决点击第一个h2，再直接点击第二个h2需要两次才能执行隐藏功能，这是因为两个show，hide方法使用了同一个定时器

//设置显示
Base.prototype.show = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.display = 'block';
	}
	return this;
};

//设置隐藏
Base.prototype.hide = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.display = 'none';
	}
	return this;
};

//设置物体居中
Base.prototype.center = function (width, height) {
	var top = (getInner().height - width) / 2;
	var left = (getInner().width - height) / 2;
	for (var i = 0; i < this.elements.length; i ++) {
		//说明采用$('box')获取的对象并不是元素标签对象而是Base对象
		this.elements[i].style.top = top + 'px';
		this.elements[i].style.left = left + 'px';
	}
	return this;
};

//锁屏功能
Base.prototype.lock = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.width = getInner().width + 'px';
		this.elements[i].style.height = getInner().height + 'px';
		this.elements[i].style.display = 'block';
		document.documentElement.style.overflow = 'hidden';
		addEvent(window, 'scroll', scrollTop);
	}
	return this;
};

Base.prototype.unlock = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.display = 'none';
		document.documentElement.style.overflow = 'auto';
		removeEvent(window, 'scroll', scrollTop);
	}
	return this;
};

//触发点击事件                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
Base.prototype.click = function (fn) {
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].onclick = fn;
	}
	return this;
};

//触发浏览器窗口事件
Base.prototype.resize = function (fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		var element = this.elements[i];
		addEvent(window, 'resize', function () {
			fn();
			if (element.offsetLeft > getInner().width - element.offsetWidth) {
				element.style.left = getInner().width - element.offsetWidth + 'px';
			}
			if (element.offsetTop > getInner().height - element.offsetHeight) {
				element.style.top = getInner().height - element.offsetHeight + 'px';
			}
		});
	}
	return this;
};

//插件入口
Base.prototype.extend = function (name, fn) {
	Base.prototype[name] = fn;
};

//--------------------动画的封装区----------------------
//运动动画
var timer=null;
Base.prototype.animate=function(obj){
    for(var i=0;i<this.elements.length;i++){
    var element=this.elements[i];
     //针对不同输入参数对应不同的属性,在没有对象参数输入的情况下设置默认值
    var attr=obj['attr']=='x'?'left':obj['attr']=='y'?'top':
        obj['attr']=='w'?'width':obj['attr']=='h'?'height':
        obj['attr']=='o'?'opacity':obj['attr']!=undefined?obj['attr']:'left';
    var start=obj['start']!=undefined?obj['start']: 
        //将两种不同的透明度CSS形式成统一的整数形式,根据CSS中的参数统一成start的值
        //默认的是获取的目前的CSS样式
        attr==obj['attr']=='opacity'?parseFloat(getStyle(element,attr))*100:parseInt(getStyle(element,attr));
    
    var alter=obj['alter'];//必填项
    var step=obj['step']!=undefined?obj['step']:30;
    var t=obj['t']!=undefined?obj['t']:50;
    //缓冲运动
    
    var target=obj['target'];
    var mul=obj['mul'];
    var speed=obj['speed']!=undefined?obj['speed']:6;
    var type=obj['type']==0?'constant':obj['type']==1?'buffer':'buffer';
    //增量和目标量两个值共同输入，并优先目标量target,都不输入则抛出错误
    if(alter!=undefined&&target==undefined){
    	target=alter+start;
    }else if(alter==undefined&&target==undefined&&mul==undefined){
    	throw new Error('alter与target两个参量至少传一个！');
    }
///
    if(start>target) step=-step;
    //设置CSS样式只能用style属性		
		if (attr == 'opacity') {
			element.style.opacity = parseInt(start) / 100;
			element.style.filter = 'alpha(opacity=' + parseInt(start) +')';
		} else {
			//element.style[attr] = start + 'px';
		}
    //如果没有设置mul,即单个动画的执行,则将单个动画的属性和属性值加到一个新建的mul中，然后执行for循环
    if(mul==undefined){
    	mul={};
    	mul[attr]=target;
    }
    clearInterval(element.timer);//清除定时器
    element.timer=setInterval(function(){
    	/*问题一：多个动画执行多个列队动画，我们要求不管数量只执行一个列队动画
    	问题二：多个动画数值差别较大，导致动画某个属性无法执行到目标值，原因是定时器提前清理掉了
        解决1：不管多少个动画，值提供一次列队动画的机会
        解决2,：多个动画按最后一个分动画执行完毕后再清理定时器
    	*/
    	//创建一个布尔值，用来表示多个动画是否都执行完毕
    	var flag=true;//为true表示都执行完了
   for(var i in mul){
    		attr=i=='x'?'left':i=='y'?'top':i=='w'?'width':i=='h'?'height':i=='o'?'opacity':i!=undefined?i:'left';
    		target=mul[i];
    	

        //缓冲设置
    if(type=='buffer'){
            //注意：必须将前面的减法括起来再除speed
        	temp=(attr=='opacity')?(((target-parseFloat(getStyle(element,attr))*100)/speed)):
        	(target-parseInt(getStyle(element,attr)))/speed;
        	//根据step正负来对最后计算为正负小数的temp进行不同的取整处理
        	step=step>0?Math.ceil(temp):Math.floor(temp);
    }
//透明度动画
    if(attr=='opacity'){
    	//element.style.opacity=parseInt(xx)/100;//避免输入的透明度为带小数的值
   		
   		//对最后一帧突兀的处理
   		if(step==0){
            setOpacity();//step=0直接到达target
        }else if(step>0&&Math.abs(parseFloat(getStyle(element,attr))*100-target)<=step){//此处得到的step为正或负时，从target的前一个值直接到target
            setOpacity();//*100是因为我们通过opacity属性来获取透明度的值，是小数，但在操作过程中统一成filter整数
        }else if(step<0&&(parseFloat(getStyle(element,attr))*100-target)<=Math.abs(step)){
            setOpacity();
        }else{
   			var temp=parseFloat(getStyle(element,attr))*100;
   			element.style.opacity=parseInt(temp+step)/100;
   			element.style.filter='alpha(opacity='+(parseInt(temp+step))+')';
        }

        if (parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) flag = false;
    }else {
//运动动画
    	//对最后一帧突兀的处理
       
        if(step==0){
             setTarget();//step=0直接到达target
        }else if(step>0&&Math.abs(parseInt(getStyle(element,attr))-target)<=step){//此处得到的step为正或负时，从target的前一个值直接到target
            setTarget();
        }else if(step<0&&(parseInt(getStyle(element,attr))-target)<=Math.abs(step)){
            setTarget();
        }else{
        	//放在else这里，就不会和停止运动同时执行，就不会出现超出target立即减到target值得问题
        	//但是由于不同时，超出后再减到target值还是会有变化上的突兀
        	//所以我们应该使getStyle(element,attr)的值在到达target前一个值时，下一个值直接到target
        	  element.style[attr]=parseInt(getStyle(element,attr))+step+'px';
        }
           //如果该属性值没有到达目标值，则flag为flase表示多个动画并未执行完
           if(target!=parseInt(getStyle(element,attr))) flag=false;
       }
     }//这里是出了for循环
     //也就是等动画结束后再执行清除定时器及obj的方法fn
	        if(flag){
	        	clearInterval(element.timer);	
	        	if(obj.fn !=undefined) obj.fn();
      }

    },t);
	        function setTarget(){//直接设置为target的小函数
	    		element.style[attr]=target+'px';   	        	
	    }
            function setOpacity(){//直接设置为target的小函数
             	element.style.opacity=parseInt(target)/100;
             	element.style.filter='alpha(opacity='+parseInt(target)+')';
             	/*clearInterval(element.timer);
             	//也就是等动画结束后再执行一个方法fn
             	if(obj.fn !=undefined) obj.fn();*/
	        		
	    }
	  }
return this; 

  };















