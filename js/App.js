

function App () {
	this._tabs = [];

	this._init();
}




App.prototype._init = function () {
	this._loadTabs();

	document.querySelector('nav li.lookup').contentElement = document.getElementById('lookup');
	document.querySelector('nav li.settings').contentElement = document.getElementById('settings');

	document.getElementById('add-tab').addEventListener('click', this._handleAddClick.bind(this));
	document.getElementById('remove-tab').addEventListener('click', this._handleRemoveClick.bind(this));
	document.getElementById('move-tab-left').addEventListener('click', this._handleMoveClick.bind(this));
	document.getElementById('move-tab-right').addEventListener('click', this._handleMoveClick.bind(this));
	document.getElementById('refresh').addEventListener('click', this._handleRefreshClick.bind(this));

	document.querySelector('nav').addEventListener('click', this._handleNav.bind(this));


	window.navigator.geolocation.getCurrentPosition(function () {});

	if (this._tabs.length) {
		this._tabs[0].navItem.click();
	} else {
		document.querySelector('nav li.settings a').click();
	}

};




App.prototype._loadTabs = function () {
	var tabData = window.localStorage.getItem('tabs') || '[]',
		i, data;

	tabData = JSON.parse(tabData);

	for (i = 0; data = tabData[i]; i++) {
		this._tabs.push(new Tab(data));
	}

	this._updateTabs();
};




App.prototype._saveTabs = function () {
	var tabData = [],
		i, tab;

	for (i = 0; tab = this._tabs[i]; i++) {
		tabData.push(tab.toString());
	}

	window.localStorage.setItem('tabs', JSON.stringify(tabData));
};




App.prototype._updateTabs = function () {
	var ul = document.querySelector('nav ul'),
		select = document.getElementById('manage-tab'),
		tabs = ul.querySelectorAll('li.user'),
		i, l, tab, option;

	for (i = 0; tab = tabs[i]; i++) {
		ul.removeChild(tab);
	}

	select.textContent = '';

	for (i = this._tabs.length - 1; tab = this._tabs[i]; i--) {
		ul.insertBefore(tab.navItem, ul.firstChild);
		tab.navItem.index = i;

		option = document.createElement('option');
		option.textContent = tab.toEnglish();

		select.insertBefore(option, select.firstChild);
	}
};




App.prototype.addTab = function (code, name, type) {
	var needle = code + ':' + name + ':' + type,
		i, tab;

	for (i = 0; tab = this._tabs[i]; i++) {
		if (tab.toString() == needle) {
			alert('Tab already exists.');
			return;
		}
	}

	this._tabs.push(new Tab(code, name, type));
	this._updateTabs();
	this._saveTabs();
}



App.prototype.removeTab = function (tab) {
	var index = this._tabs.indexOf(tab);

	if (index < 0) return;

	tab.remove();
	this._tabs.splice(index, 1);
	this._updateTabs();
	this._saveTabs();
}




App.prototype._handleNav = function (e) {
	var refresh = document.getElementById('refresh'),
		target = e.target,
		content, navClass, contentClass,
		tab;

	e.preventDefault();

	if (target.tagName == 'UL') return;
	if (target.tagName == 'ABBR') target = target.parentNode;
	if (target.tagName == 'A') target = target.parentNode;


	if (this._currentTab) this._currentTab.hide();

	if (content = target.contentElement) {
		if (content.className.indexOf('selected') >= 0) return;
		contentClass = content.className;
		navClass = target.className;

		this._currentTab = {
			hide: function () { 
				content.className = contentClass; 
				target.className = navClass; 
			}
		};

		content.className += ' selected';
		target.className += ' selected';
		refresh.className = '';

		if (content.tagName == 'IFRAME' && !content.src) {
			content.addEventListener('load', function () { document.body.className = ''; });
			document.body.className = 'loading';

			content.src = content.getAttribute('data-src');
		}

		return;
	}

	refresh.className = 'visible';
	tab = this._tabs[target.index];
	tab.show();
	this._currentTab = tab;
}




App.prototype._handleAddClick = function () {
	var action = document.getElementById('add-action'),
		station = document.getElementById('add-station');

	this.addTab(station.value, station.options[station.selectedIndex].textContent, action.value);
};




App.prototype._handleRemoveClick = function (e) {
	e.preventDefault();

	var index = document.getElementById('manage-tab').selectedIndex;
	this.removeTab(this._tabs[index]);
};




App.prototype._handleMoveClick = function (e) {
	e.preventDefault();

	var select = document.getElementById('manage-tab'),
		index = select.selectedIndex,
		delta = e.target.id == 'move-tab-left'? -1 : 1,
		tab;

	if (index == 0 && delta < 0 || index == this._tabs.length - 1 && delta > 0) return;
	tab = this._tabs.splice(index, 1)[0];
	this._tabs.splice(index + delta, 0, tab);

	this._updateTabs();
	select.selectedIndex = index + delta;
	
	this._saveTabs();
};




App.prototype._handleRefreshClick = function (e) {
	e.preventDefault();

	var tab = this._currentTab;
	if (tab && tab.refresh) tab.refresh();
};