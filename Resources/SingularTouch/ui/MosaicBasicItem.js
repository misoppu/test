/*
 * SingularTouch "Mosaic Basic Item" Component v1.0
 * 
 * http://singulartouch.com
 * support@singulartouch.com
 * 
 * Copyright 2011 - All rights reserved
 */
SingularTouch.UI.createMosaicBasicItem = function (_data)
{
	// Basic view
	var item = Ti.UI.createView({
		backgroundImage:'../demo/images/shadow_box.png',
		borderWidth:0
	});
	
	// Data of the item (necessary to sorting)
	item.data = null;
	if (_data != undefined)
	{
		item.data = _data;
	}
	
	// Content of the view
	var lblTitle = Titanium.UI.createLabel({
		color:'#999',
		text: _data.title,
		font:{fontSize:15,fontFamily:'Helvetica Neue',fontWeight:'bold'},
		textAlign:'center',
		height:'auto',
		width:'auto'
	});
	
	item.add(lblTitle);
	
	return item;
};
