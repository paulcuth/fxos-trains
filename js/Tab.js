

function Tab (code, name, type) {
	var args;

	if (arguments.length == 1) {
		args = arguments[0].split(':');
		code = args[0];
		name = args[1];
		type = args[2];
	}

	this._code = code;
	this._name = name;
	this._type = type;
	this._content = this._createContent();
	this.navItem = this._createNavItem();

	if (type == 'n') {
		this._url = 'http://traintimes.org.uk/n/' + code;
	} else {
		this._url = 'http://traintimes.org.uk/live/' + code;
	}

	this._add();
}




Tab.prototype._createContent = function () {
	var iframe = document.createElement('iframe');
	return iframe;
};




Tab.prototype._createNavItem = function () {
	var li = document.createElement('li'),
		a = document.createElement('a'),
		abbr = document.createElement('abbr');

	li.className = this._getClassName();
	a.href = '#';
	abbr.title = this._name;
	abbr.innerHTML = this._code.toUpperCase();

 	li.appendChild(a);
 	a.appendChild(abbr);

 	return li;
};




Tab.prototype._add = function () {
	document.querySelector('main').appendChild(this._content);
};




Tab.prototype.remove = function () {
	document.querySelector('main').removeChild(this._content);
	document.querySelector('nav ul').removeChild(this.navItem);
};




Tab.prototype._getClassName = function () {
	return 'user ' + (this._type == 'd'? 'departures' : 'next-train');
};




Tab.prototype.toString = function () {
	return this._code + ':' + this._name + ':' + this._type
};




Tab.prototype.toEnglish = function () {
	return (this._type == 'n'? 'Next trains to ' : 'Departure board at ') + this._name;
};




Tab.prototype.show = function () {
	if (!this._content.src) {
		this._content.addEventListener('load', function () { document.body.className = ''; });
		this._content.addEventListener('error', function () { alert('error'); });
		this.refresh();
	}

	this._content.className = 'selected';
	this.navItem.className += ' selected';
};




Tab.prototype.hide = function () {
	this._content.className = '';
	this.navItem.className = this._getClassName();
};




Tab.prototype.refresh = function () {
	document.body.className = 'loading';
	this._content.src = '';
	this._content.src = this._url;
};



