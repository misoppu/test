/*
 * SingularTouch "Mosaic Component" v1.0.1
 * 
 * http://singulartouch.com
 * support@singulartouch.com
 * 
 * Copyright 2011 - All rights reserved
 */
SingularTouch.UI.createMosaic = function (_args)
{
	if (!_args)
	{
		_args = {};
	}
	
	/*
	 * Base Component
	 */
	var scrollView = Titanium.UI.createScrollView({
		top:_args.top || 0,
		bottom:_args.bottom || 0,
		left:0,
		right:0,
//		contentWidth:'auto',
//		contentHeight:'auto',
		contentWidth:'100%',
		contentHeight:'100%',
		showVerticalScrollIndicator: _args.showVerticalScrollIndicator || true,
		showHorizontalScrollIndicator: _args.showHorizontalScrollIndicator || true,
		borderWidth:0,
		layout:'vertical',
		//minZoomScale:_args.minZoomScale || 1.0,
		//maxZoomScale:_args.maxZoomScale || 1.0,
		minZoomScale:1.0,
		maxZoomScale:1.0,
		disableBounce:_args.disableBounce || false
	});

	var headerView = Ti.UI.createView({
		top:0,
		left:0,
		right:0,
		height:'auto',
		visible:true,
		opacity:1.0
	});
	scrollView.add(headerView);
	
	var itemsView = Ti.UI.createView({
		top:0,
		left:0,
		right:0,
		bottom:0,
//		height:'auto',
		height:'auto',
		visible:true,
		opacity:1.0
	});
	scrollView.add(itemsView);
	
	var footerView = Ti.UI.createView({
		top:0,
		left:0,
		right:0,
		height:'auto',
		visible:true,
		opacity:1.0
	});
	scrollView.add(footerView);

	/*
	 * Private properties
	 */
	var updating = false;
	var views = null;
	var internalHeader = null;
	var internalFooter = null;
	var	firstTime = true;
	var currentOrientation = Ti.UI.orientation;
	var order_last_field = '';
	var order_last_dir = 'asc';
	var totalWidth = 0;
	var itemWidth = 0;
	var itemAdded = -1;
	var itemRemoved = -1;

	var animationDuration = _args.animationDuration || 0;
	var itemHeight = _args.itemHeight || 192;
	var verticalMargin = _args.verticalMargin || 20;
	var horizontalMargin = _args.horizontalMargin || 20;
	var landscapeColumns = _args.landscapeColumns || 4;
	var portraitColumns = _args.portraitColumns || 3;
	
	/*
	 * Private Methods (Helpers)
	 */	
	/*
	var isLandscape = function (_orient) {
		_orient = _orient || Ti.UI.orientation;
		return _orient == Ti.UI.LANDSCAPE_LEFT || _orient == Ti.UI.LANDSCAPE_RIGHT;
	};
	 
	var isPortrait = function (_orient) {
		_orient = _orient || Ti.UI.orientation;
		return _orient == Ti.UI.PORTRAIT || _orient == Ti.UI.UPSIDE_PORTRAIT;
	};
*/	
	var createView = function (_index, _view)
	{
		var view = Ti.UI.createView({
			top:0,
			left:0,
			width:itemWidth,
			height:itemHeight,
			visible:true,
			opacity:0.0
		});

		view.isNew = true;
		view.index = _index;
		
		view.add(_view);
		
		view.data = null;
		if (_view.data)
		{
			view.data = _view.data;
		}
		
		view.addEventListener('click', function (ev) {
			scrollView.fireEvent('selected', {
				index: view.index,
				row: view.row,
				col: view.col,
				view: _view
			});			
		});
		
		return view;
	};

	/*
	 * Public Methods
	 */
	scrollView.itemWidth = function ()
	{
		return itemWidth;
	};
	
	scrollView.isUpdating = function ()
	{
		return updating;
	};
	
	scrollView.totalItems = function ()
	{
		if (views)
		{
			return views.length;
		}
		else
		{
			return 0;
		}
	};

	scrollView.orderField = function ()
	{
		return order_last_field;
	};
	
	scrollView.orderDir = function ()
	{
		return order_last_dir;
	};
	
	scrollView.animationDuration = function (_msec)
	{
		if (_msec == undefined)
		{
			return animationDuration;
		}
		else
		{
			animationDuration = _msec;
		}
	};

	scrollView.itemHeight = function (_height)
	{
		if (_height == undefined)
		{
			return itemHeight;
		}
		else
		{
			itemHeight = _height;
		}
	};

	scrollView.verticalMargin = function (_margin)
	{
		if (_margin == undefined)
		{
			return verticalMargin;
		}
		else
		{
			verticalMargin = _margin;
		}
	};
	
	scrollView.horizontalMargin = function (_margin)
	{
		if (_margin == undefined)
		{
			return horizontalMargin;
		}
		else
		{
			horizontalMargin = _margin;
		}
	};
	
	scrollView.landscapeColumns = function (_columns)
	{
		if (_columns == undefined)
		{
			return landscapeColumns;
		}
		else
		{
			landscapeColumns = _columns;
		}
	};
	
	scrollView.portraitColumns = function (_columns)
	{
		if (_columns == undefined)
		{
			return portraitColumns;
		}
		else
		{
			portraitColumns = _columns;
		}
	};
	
	scrollView.orderBy = function (_field, _dir)
	{
		if (!_field || _field == '')
		{
			return false;
		}
		
		if (!views || !views[0] || !views[0].data)
		{
			return false;
		}
		
		if (!views[0].data.hasOwnProperty(_field) || !(_field in views[0].data))
		{
			return false;
		}	
		
		var fieldType = typeof views[0].data[_field];
		
		if (!fieldType)
		{
			return false;
		}
				
		if (updating)
		{
			return false;
		}
		
		updating = true;
		//scrollView.touchEnabled = false;
		
		if (_dir == undefined || (_dir.toLowerCase() != 'asc' && _dir.toLowerCase() != 'desc'))
		{
			_dir = 'asc';
		}
		
		order_last_field = _field;
		order_last_dir = _dir;
		
		views.sort(function(a, b)
		{
			if (fieldType == 'number')
			{
				if (_dir == 'asc')
				{
					return a.data[_field] - b.data[_field];
				}
				else
				{
					return b.data[_field] - a.data[_field];
				}
			}
			else
			{
				var valueA = '';
				var valueB = '';
					
				if (fieldType == 'string')
				{
					valueA = a.data[_field].toLowerCase();
					valueB = b.data[_field].toLowerCase();
				}
				else
				{
					valueA = a.data[_field];
					valueB = b.data[_field];
				}
				
				if (_dir == 'asc')
				{
					if (valueA < valueB)
					{
						return -1;
					}
						 
					if (valueA > valueB)
					{
						return 1;
					}
				}
				else
				{
					if (valueA < valueB)
					{
						return 1;
					}
						 
					if (valueA > valueB)
					{
						return -1;
					}
				}
				
			 	return 0;
			}
			
			return 0;
		});
				
		updating = false;
		scrollView.refresh();
	};

	scrollView.refresh = function ()
	{
		
		if (updating)
		{
			return false;
		}
			
		updating = true;
		//scrollView.touchEnabled = false;
		
		if (!views || views.length <= 0)
		{
			firstTime = false;
			//scrollView.touchEnabled = true;
			updating = false;
			scrollView.fireEvent('refresh', {
				totalItems: 0,
				orderBy: order_last_field,
				orderDir: order_last_dir,
				itemAdded: itemAdded,
				itemRemoved: itemRemoved 
			});
			
			itemAdded = -1;
			itemRemoved = -1;	
			return true;
		}
		
		var maxCols = landscapeColumns;
//		if (isPortrait(currentOrientation))
//		{
//			maxCols = portraitColumns;
//		}
		
		totalWidth = Ti.UI.currentWindow.width;
		itemWidth = Math.round((totalWidth - horizontalMargin) / maxCols) - horizontalMargin;
		
		var row = 1;
		var col = 1;
		var newLeft = 0;
		var newTop = 0;				
		var totalAnimViews = views.length;
		
		function refresh_callback()
		{
			totalAnimViews--;
				
			if (totalAnimViews == 0)
			{
				firstTime = false;
				//scrollView.touchEnabled = true;
				updating = false;
				scrollView.fireEvent('refresh', {
					totalItems: views.length,
					orderBy: order_last_field,
					orderDir: order_last_dir,
					itemAdded: itemAdded,
					itemRemoved: itemRemoved 
				});
				
				itemAdded = -1;
				itemRemoved = -1;
			}
		}
		
		for (var i = 0, len = views.length; i < len; i++)
		{
			if (col > maxCols)
			{
				col = 1;
				row++;
			}
			
			views[i].index = i;
			views[i].row = row;
			views[i].col = col;
			
			newLeft = (col * horizontalMargin) + ((col - 1) * itemWidth);
			newTop = (row * verticalMargin) + ((row - 1) * itemHeight);
			
			if (animationDuration <= 0)
			{
				if (views[i].isNew)
				{
					itemAdded = i;
					views[i].isNew = false;
				}
				
				views[i].top = newTop;
				views[i].left = newLeft;
				views[i].width = itemWidth;
				views[i].height = itemHeight;
				views[i].opacity = 1.0;
			}
			else
			{
				if (views[i].isNew)
				{
					itemAdded = i;
					views[i].isNew = false;
					views[i].left = newLeft;
					views[i].top = newTop;
				}
				
				views[i].animate({
						top: newTop,
						left: newLeft,
						width: itemWidth,
						height: itemHeight,
						duration: animationDuration,
						curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
						opacity: 1.0
				}, refresh_callback);
			}
						
			col++;
		}
		
		footerView.top = verticalMargin;
		
		if (animationDuration <= 0)
		{
			firstTime = false;
			//scrollView.touchEnabled = true;
			updating = false;
			scrollView.fireEvent('refresh', {
				totalItems: views.length,
				orderBy: order_last_field,
				orderDir: order_last_dir,
				itemAdded: itemAdded,
				itemRemoved: itemRemoved 
			});
			
			itemAdded = -1;
			itemRemoved = -1;
		}
		
		return true;
	};
	
	scrollView.fadeIn = function (_index, _duration)
	{
		if (!views || views.length <= 0 || updating)
		{
			return false;
		}
		
		updating = true;
		//scrollView.touchEnabled = false;
		
		var first = 0;
		var len = views.length;
		var totalAnimViews = len;
		
		if (_index != undefined && _index >= 0)
		{
			if (_index + 1 > len)
			{
				scrollView.touchEnabled = true;
				updating = false;
				return false;
			}
			
			first = _index;
			len = _index + 1;
			totalAnimViews = 1;
		}
		else
		{
			_index = -1;
		}
		
		var duration = animationDuration;
		if (_duration && _duration > 0)
		{
			duration = _duration;
		}
		
		function fadein_callback()
		{
			totalAnimViews--;
			
			if (totalAnimViews == 0)
			{
				//scrollView.touchEnabled = true;
				updating = false;
				scrollView.fireEvent('fadeIn', {
					index: _index,
					duration: duration
				});
			}
		}
		
		for (var i = first; i < len; i++)
		{
			views[i].animate({
				opacity:1.0,
				duration: duration
			}, fadein_callback);
		}
		
		return true;
	};
	
	scrollView.fadeOut = function (_index, _duration)
	{
		if (!views || views.length <= 0 || updating)
		{
			return false;
		}
		
		updating = true;
		//scrollView.touchEnabled = false;
		
		var first = 0;
		var len = views.length;
		var totalAnimViews = len;
		
		if (_index != undefined && _index >= 0)
		{
			if (_index + 1 > len)
			{
				//scrollView.touchEnabled = true;
				updating = false;
				return false;
			}
			
			first = _index;
			len = _index + 1;
			totalAnimViews = 1;
		}
		else
		{
			_index = -1;
		}
		
		var duration = animationDuration;
		if (_duration && _duration > 0)
		{
			duration = _duration;
		}
		
		function fadeout_callback()
		{
			totalAnimViews--;
			
			if (totalAnimViews == 0)
			{
				//scrollView.touchEnabled = true;
				updating = false;
				scrollView.fireEvent('fadeOut', {
					index: _index,
					duration: duration
				});
			}
		}
		
		for (var i = first; i < len; i++)
		{
			views[i].animate({
				opacity:0.0,
				duration: duration
			}, fadeout_callback);
		}
		
		return true;
	};
	
	scrollView.removeItem = function (_index)
	{
		if (!views || views.length <= 0 || _index < 0 || _index + 1 > views.length || updating)
		{
			return false;
		}
		
		updating = true;
		//scrollView.touchEnabled = false;

		itemRemoved = _index;

		itemsView.remove(views[_index]);
		delete views[_index];
		views.splice(_index, 1);
		
		updating = false;
		scrollView.refresh();
		
		return true;
	};
	
	scrollView.addItem = function (_view, _sorted)
	{
		if (updating)
		{
			return false;
		}
		
		updating = true;
		//scrollView.touchEnabled = false;
		
		if (!_view)
		{
			updating = false;
			//scrollView.touchEnabled = true;
			return true;
		}
					
		if (!views)
		{
			views = [];
		}
		
		var i = views.length;
		
		views[i] = createView(i, _view);
		itemsView.add(views[i]);
		
		updating = false;
		
		if (_sorted)
		{
			if (!scrollView.orderBy(order_last_field, order_last_dir))
			{
				scrollView.refresh();
			}
		}
		else
		{
			scrollView.refresh();
		}
		
		return true;
	};
	
	scrollView.updateItems = function (_views)
	{
		if (updating)
		{
			return false;
		}
		
		updating = true;
		//scrollView.touchEnabled = false;
		
		var i = 0;
		var len = 0;
		
		// First, remove old items and free memory
		if (views)
		{
			for (i = 0, len = views.length; i < len; i++)
			{
				if (views[i])
				{
					itemsView.remove(views[i]);
					delete views[i];
				}
			}
			
			views = null;
		}
		
		views = [];
		
		if (!_views || !_views.length || _views.length <= 0)
		{
			updating = false;
			scrollView.refresh();
			return true;
		}
		
		var maxCols = landscapeColumns;
//		if (isPortrait(currentOrientation))
//		{
//			maxCols = portraitColumns;
//		}

		totalWidth = Ti.UI.currentWindow.width;	
		itemWidth = Math.round((totalWidth - horizontalMargin) / maxCols) - horizontalMargin;
		
		for (i = 0, len = _views.length; i < len; i++)
		{
			views[i] = createView(i, _views[i]);
			itemsView.add(views[i]);
			
			delete _views[i];
		}
		
		updating = false;

		scrollView.refresh();
	};
	
	scrollView.addHeader = function (_view)
	{
		if (_view)
		{
			scrollView.removeHeader();
			
			internalHeader = _view;
			headerView.add(_view);
			scrollView.headerVisible(true);
		}
	};
	
	scrollView.headerVisible = function (_visible)
	{
		if (_visible == undefined)
		{
			return headerView.visible;
		}
		else
		{
			if (_visible)
			{
				headerView.height = 'auto';
				headerView.show();
			}
			else
			{
				headerView.height = 0;
				headerView.hide();
			}
		}
	};
	
	scrollView.removeHeader = function ()
	{
		if (internalHeader)
		{
			headerView.remove(internalHeader);
			//delete internalHeader;
			internalHeader = null;
		}
	};
	
	scrollView.addFooter = function (_view)
	{
		if (_view)
		{
			scrollView.removeFooter();
			
			internalFooter = _view;
			footerView.add(internalFooter);
			scrollView.footerVisible(true);
		}
	};
	
	scrollView.removeFooter = function ()
	{
		if (internalFooter)
		{
			footerView.remove(internalFooter);
			//delete internalFooter;
			internalFooter = null;
		}
	};
	
	scrollView.footerVisible = function (_visible)
	{
		if (_visible == undefined)
		{
			return footerView.visible;
		}
		else
		{
			if (_visible)
			{
				footerView.height = 'auto';
				footerView.show();
			}
			else
			{
				footerView.height = 0;
				footerView.hide();
			}
		}
	};
	
	Titanium.Gesture.addEventListener('orientationchange', function (ev) {
		Titanium.UI.orientation = Titanium.UI.LANDSCAPE_LEFT;
		//if (!firstTime && !updating && ev.orientation != currentOrientation)
		//{
		//	Titanium.UI.orientation = Titanium.UI.LANDSCAPE_LEFT;
			//currentOrientation = ev.orientation;
			//scrollView.refresh();
		//}
		
	});

	/*
	 * Constructor (main initialization code)
	 */	
	if (_args.header)
	{
		scrollView.addHeader(_args.header);
	}
	
	if (_args.footer)
	{
		scrollView.addFooter(_args.footer);
	}
	
	if (_args.items && _args.items.length)
	{
		scrollView.updateItems(_args.items);
	}	
	else
	{
		scrollView.refresh();
	}

	return scrollView;
};
