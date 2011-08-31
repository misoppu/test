/*
 * SingularTouch "Mosaic Demo" Application v1.0.1
 * 
 * http://singulartouch.com
 * support@singulartouch.com
 * 
 * Copyright 2011 - All rights reserved
 * 
 * 
 * DON'T FORGET TO CONTACT WITH US IF YOU NEED HELP WITH YOUR DEVELOPMENT!! 
 * AND, IN ORDER TO ENHANCE OUR COMPONENTS & APPLICATIONS, PLEASE: COMMENT, RATE AND FOLLOW US.
 * 
 * ;-)
 * 
 */

Ti.UI.setBackgroundColor('#000');
Titanium.UI.orientation = Titanium.UI.LANDSCAPE_LEFT;
var tabGroup = Titanium.UI.createTabGroup();

var winDemoMosaic = Titanium.UI.createWindow({  
    url: 'SingularTouch/demo/main.js'		// Read this file to learn how to use Mosaic Component!! ;-)
});

var tabDemoMosaic = Titanium.UI.createTab({
    icon:'SingularTouch/demo/images/mosaic_icon.png',
    title:'パンダ合わせ',
    window:winDemoMosaic
});

tabGroup.addTab(tabDemoMosaic);
tabGroup.hide=true;
tabGroup.open({
	transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
});
