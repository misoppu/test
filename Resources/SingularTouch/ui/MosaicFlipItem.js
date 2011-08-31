/*
 * SingularTouch "Mosaic Flip Item" Component v1.0
 *
 * http://singulartouch.com
 * support@singulartouch.com
 * 
 * Copyright 2011 - All rights reserved
 */
var _cardCount =0;
var _item1 = null;
var _index1 = 0;
var tokuten = 0;

SingularTouch.UI.createMosaicFlipItem = function (_args)
{
	if (!_args)
	{
		_args = {};
	}
	
	if (!_args.data)
	{
		_args.data = {};
	}
	
	// Basic view
	var item = Ti.UI.createView({
		borderRadius:_args.borderRadius || 0
	});

	// Data of the item (necessary to sorting)
	item.data = _args.data;

	// Front View
	var front = Ti.UI.createView({
		backgroundImage: _args.data.image || '',
		backgroundColor:"#FFF",
		borderWidth:3,
		borderColor:'#FFF',
		top:0,
		bottom:0,
		left:0,
		right:0,
		zIndex:1,
		borderRadius:_args.borderRadius || 0
	});

	var titleBar = Ti.UI.createView({
		backgroundImage: '../demo/images/white_trans_50.png',
		borderWidth:0,
		bottom:10,
		left:0,
		right:0,
		height:'auto',
		layout:'vertical'
	});

	var lblTitle = Titanium.UI.createLabel({
		color:'#000',
		text: _args.data.title || "Title",
		font: {
			fontSize:15,
			fontFamily:'Helvetica Neue',
			fontWeight:'bold'
		},
		textAlign:'center',
		height:'auto',
		width:'auto',
		shadowColor:"#FFF",
		shadowOffset: {
			x:0,
			y:1
		}
	});

	var lblSubtitle = Titanium.UI.createLabel({
		color:'#333',
		text: _args.data.subtitle || "Subtitle",
		font: {
			fontSize:12,
			fontFamily:'Helvetica Neue',
			fontWeight:'bold'
		},
		textAlign:'center',
		height:'auto',
		width:'auto',
		shadowColor:"#FFF",
		shadowOffset: {
			x:0,
			y:1
		},
		bottom:0
	});

	//front.add(btnMore);
//	titleBar.add(lblTitle);
//	titleBar.add(lblSubtitle);
//	front.add(titleBar);
	item.add(front);

	// Back View
	var back = Ti.UI.createView({
		backgroundColor:"#FFF",
		borderWidth:0,
		top:0,
		bottom:0,
		left:0,
		right:0,
		zIndex:0,
		borderRadius:_args.borderRadius || 0
	});

	var btnClose = Titanium.UI.createButton({
		backgroundImage: _args.closeButtonImage || '../demo/images/close.png',
		top:2,
		right:2,
		width:28,
		height:28,
		zIndex:9999,
		visible: _args.closeButtonVisible || true
	});

	var lblDescription = Titanium.UI.createLabel({
		color:'#999',
		text: _args.data.description || '',
		font: {
			fontSize:12,
			fontFamily:'Helvetica Neue',
			fontWeight:'bold'
		},
		textAlign:'center',
		height:'auto',
		left:10,
		right:10
	});

	back.add(lblDescription);
//	back.add(btnClose);
	item.add(back);

	/*
	 * EVENTS
	 */
	var clickFlag = false;
	front.addEventListener("click", function (ev) {

		if(clickFlag){return;}

		clickFlag=true;
		back.touchEnabled = false;

		item.fireEvent("flipBack");

		_cardCount++;
		if(_cardCount==1){
			_item1=item;
			_index1 = ev.index;
			clickFlag = false;
			//ev.row
			//ev.col
		}

		else if(_cardCount==2){
			if(_item1.data.description == item.data.description){
				tokuten++;
				if(tokuten==6){
					var win = Ti.UI.currentWindow;
					//clearInterval(_args.timmer);
					Titanium.App.Properties.setString("time_flag","1");
					alert(win.title + "クリア！");
					win.title = "パンダ合わせ";
					win.close();
					
					_cardCount =0;
					_item1 = null;
					_index1 = 0;
					tokuten = 0;
					clickFlag = false;

					return;
				}
				//alert("１パンダ獲得！")
				var img = Titanium.UI.createLabel({
				   borderRadius:40,
				   backgroundColor:'#aaa',
				   width:"200",
				   height:"100",
				   text:"１ぱんだ獲得",
				   textAlign:"center"
				   ,left:"400"
				   ,top:"300"
				});

				setTimeout(function(){
					// 新たに作られた myView をWindowに追加する
					Titanium.UI.currentWindow.add(img);
				}, 100);
				setTimeout(function(){
					// 新たに作られた myView をWindowに追加する
					//img.animate({center: "0", opacity: 0, duration: 500}, function (){
	  		            Titanium.UI.currentWindow.remove(img);
					//});
				}, 2000);

				clickFlag = false;
				back.touchEnabled = true;
				//item.data.image = '../demo/images/texture.png';
				//_item1.data.image = '../demo/images/texture.png';
				//Ti.App.fireEvent('removeitem', {index:ev.index});
				//Ti.App.fireEvent('removeitem', {index:index1});
			} else {
				setTimeout(function(){
					_item1.fireEvent("flipFront");
					item.fireEvent("flipFront");
					clickFlag = false;
				}, 500);
				//tokuten--;
			}

			_cardCount=0;
		}
		
	});
	
	item.addEventListener("flipBack", function (ev) {
		back.touchEnabled = false;
		front.animate({
			view:back,
			transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
		}, function () {
			back.touchEnabled = true;
			item.fireEvent("atBack", {
				data: item.data
			});
		});
		item.fireEvent("goingBack");
	});

/*	
	btnClose.addEventListener('click', function(ev) {
		item.fireEvent("flipFront");
	});
*/	
	item.addEventListener("flipFront", function (ev) {
		front.touchEnabled = false;
		back.animate({
			view:front,
			transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		}, function () {
			front.touchEnabled = true;
			item.fireEvent("atFront");
		});
		item.fireEvent("goingFront");
	});
	
	return item;
};