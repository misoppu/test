
var win = Ti.UI.currentWindow;
Titanium.UI.orientation = Titanium.UI.LANDSCAPE_LEFT;
// こちらはシンプルなボタンです。
var button2 = Titanium.UI.createButton({
  title:'パンダ合わせ',
  font:{fontSize:30,fontFamily:'Marker Felt', fontWeight:'bold'},
  color:'#ff0000',
  height:50,
  width:200,
  top:100
});

win.add(button2);

button2.addEventListener('click', function(e){
	var win = Titanium.UI.createWindow({  
	    url: 'MosaicDemo.js'
	});
	Titanium.UI.currentTab.open(win,{animated:true});
});
