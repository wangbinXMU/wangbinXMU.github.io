---
layout: post
title: "为select下拉菜单添加option的方法"
date: 2017-12-29
excerpt: "select"
tags: [select,option]
comments: true
---


#### 为select下拉菜单添加option的方法
如需动态的添加option有三种方式：DOM方法和Option构造函数法.

1.DOM
```
var option=document.createElement('option');
为option添加文本内容
option.appendChild(document.createTextNode('Beijing');
为option添加value 属性
option.setAttribute(value,'Beijing1');
添加到select中：city.appendChild(option);
```
2.采用new Option方法会比较简洁

```
var option=new Option('Beijing','Beijing1');
city.appendChild(option);
```
3. add()方法来添加


```
var option=new Option('Beijing','Beijing1');
city.add(option,undefined);
为了考虑兼容IE浏览器，add()的第二个参数设成undefined
```

