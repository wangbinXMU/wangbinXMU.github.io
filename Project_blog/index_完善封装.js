//---------------完善封装------------------
//下拉菜单
$(function(){
   $('#header .member').hover(function(){
   // 这里的alert(this); 打印出this发现是div对象，故不能调用css方法，我们需要用Base对象调用css方法，故重新做一个对象$(this),
    //但是我们将this传入并最后将这个this放入this.elements中，用来让css方法进行遍历。
    $(this).css('background','gray url("down.png") no-repeat 155px 30px');
    $('#header .member_ul').show().animate({
        step:10,
        t:50,  
        mul:{   //展式释放下拉菜单
            o:100,
            h:230
        }
    });
},function(){
    $(this).css('background','black url("up.png") no-repeat 155px 30px');
    $('#header .member_ul').animate({
        //这里不用设置start的值，,默认获取上一步的target值
        step:5,
        mul:{   //展式收起下拉菜单
            o:0,
            h:0
        },
        fn:function(){//先执行渐变再消失
            $('#header .member_ul').hide()
        }
    });
        });


//登录框
   //登录窗(调用完善后的封装),但要注意父元素要加进去指定区块，避免与其他区块重名
    var login=$('#login');
     //窗口进行缩放时，锁屏画布也要同时缩放
    var screen=$('#screen');
    login.center(400,300).resize(function(){
        //login.center(400,300);
        if(login.css('display')=='block'){
        screen.lock();   
    }

});
     //弹出
    $('#header .login').click(function(){
        login.center(400,300);//移动后关闭，重新点登陆保证又居中
        login.css('display','block');
        screen.lock().animate({
            attr:'o',
            t:30,
            step:10,
            target:70
        });
    });
    //居中
    login.center(400,300).resize(function(){
        //login.center(400,300);
    });
    //点击右上角叉号关闭
    $('#login .close').click(function(){
        login.css('display','none');
        //先执行渐变动画，在执行unlock
        $('#screen').animate({
            attr:'o',
            step:10,
            t:50,
            target:0,
            fn:function(){
                $('#screen').unlock()
            }
        });
    });
    //原本传入时以数组的形式，进行修改后可用正常的参数传入形式，并且将之前的getElements[0]-->ge[0]-->first()
    //并且节点数组中的最后一个节点用last()方法封装(例如获取到的h2数组中的最后一个h2标签)
     //拖拽
     login.drag($('#login h2').first());

//百度分享栏初始化位置
$('#share').css('top',getScroll().top+(getInner().height-parseInt(getStyle($('#share').first(),'height')))/2
+ 'px');
//滚动条事件--- 并添加过渡动画解决滚动条滚动式，分享栏菜单居中的突变（一顿一顿）的问题
addEvent(window,'scroll',function(){
    $('#share').animate({
        attr:'y',
        target:getScroll().top+(getInner().height-parseInt(getStyle($('#share').first(),'height')))/2,
        'type':1,
        step:30,
        t:10
    })
});


//百度分享收缩效果
//其中hover中的第一个参数指的是mouseover事件好触发的函数。
//第二个参数指的是mouseout事件要触发的函数
$('#share').hover(function(){
    $(this).animate({
        'attr':'x',
        'target':0,
        'step':10,
        't':20
    })
},function(){
     $(this).animate({
        'attr':'x',
        'target':-215,
        'step':10,
        't':20,
        'type':1
})
 });
//列队动画---一个动画执行完，再立即执行一个动画的测试
/*$('#test').click(function(){
    $(test).animate({
        attr:'w',
        target:300,
        fn:function(){
            $(test).animate({
                attr:'h',
                target:300,
                fn:function(){
                    $(test).animate({
                        attr:'o',
                        target:20
                    })
                }
            })
        }
    })
})*/
    
//同时动画---多个动画效果一起执行，但是如果同时对一个事件直接添加多个动画效果是达不到同时执行的，
//后面的效果会把前面的效果覆盖掉
/*$('#test').click(function(){
    $(this).animate({
        //mul参数是一个对象，只有两种值，属性:属性值，非CSS属性及值直接放在mulw外即可,调用animate时，属性值会被同时作为两个target执行
        step:10,
       
       // 如果单项属性设置与mul设置的属性重合，则会忽略单项的属性
        mul:{
            width:101,
            height:300,
            o:30
        },
        fn:function(){
            alert('1');
        }
    });*/


//点击‘分享’后，整个分享栏弹到浏览器窗口的中间
// $('#share').click(function(){
//  //alert(this),当弄不清this的指代时，打印出来看看
//     this.style.left=(getInner().width-parseInt(getStyle(this,'height')))/2+'px';
//     this.style.top=(getInner().height-parseInt(getStyle(this,'height')))/2+'px';
// });

//滑动导航---鼠标的触发事件默认在最外层

$('#nav .black li').hover(function(){//this是元素对象，$(this)就得到了Base对象
    var target=$(this).first().offsetLeft;  //得到当前鼠标所在元素块的左部最外边界距离父元素左部内边界的距离
    $('#nav span').animate({
        attr:'x',
        target:target-20,
        step:10,
        type:1

    })
},function(){
    var target=$(this).first().offsetLeft;    //一定要讲li所在的层通过z-index调到最外层以便触发hover事件
    $('#nav span').animate({
        attr:'x',
        target:20,
        step:10,
        type:1

    })



})

//左侧菜单
  //方法一 ，代码较多

  /*$('#sidebar h2').eq(0).toggle(function(){
    $('#sidebar ul').eq(0).hide();
  },function(){
    $('#sidebar ul').eq(0).show();
  });
 $('#sidebar h2').eq(1).toggle(function(){
    $('#sidebar ul').eq(1).hide();
  },function(){
    $('#sidebar ul').eq(1).show();
  });
 $('#sidebar h2').eq(2).toggle(function(){
    $('#sidebar ul').eq(2).hide();
  },function(){
    $('#sidebar ul').eq(2).show();
  });*/
//方法二 ，在toggle方法中加入call进行对象冒充---展式，隐藏方式
  
 /*$('#sidebar h2').toggle(function(){
    $(this).next().hide();
  },function(){
    $(this).next().show();
  });

 */
//方法三 ，动画形式的显示和隐藏
  $('#sidebar h2').toggle(function(){
    $(this).next().animate({
        type:1,
        mul:{
            h:0,
            o:0
        }
    });
  },function(){
    $(this).next().animate({
       mul:{
        h:150,
        o:100
       }
    });
  });

//----轮播器-----
//初始化
    $('#banner img').css('display','none');
    $('#banner img').eq(0).css('display','block');
    $('#banner ul li').eq(0).css('color','#333');
    $('#banner strong').html($('#banner img').eq(0).attr('alt'))
//手动轮播器
$('#banner ul li').hover(function(){
    //静态的轮播器
    $('#banner img').css('display','none');
    //alert($(this).index())
    //将选中的图片展示出来
    $('#banner img').eq($(this).index()).css('display','block');
    //将选中的灰点加黑
    $('#banner ul li').css('color','#999');
    $('#banner ul li').eq($(this).index()).css('color','#333');
    $('#banner strong').html($('#banner img').eq($(this).index()).attr('alt'))
},function(){});


 }); 