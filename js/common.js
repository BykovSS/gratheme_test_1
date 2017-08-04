'use strict';

var QUERY = document.getElementsByClassName('header-search-search')[0].value;
var GENDER = "all";
var goodsfromfile = void 0;
var basket = [];

$.ajax({
	url: 'data.json',
	success: function success(data) {
		RenderGoods(data, QUERY, GENDER);
	}
});

if (!JSON.parse(localStorage.getItem("basket"))) {
	var lSbasket = JSON.stringify(basket);
	localStorage.setItem("basket", lSbasket);
}

[].forEach.call(document.getElementsByClassName('header-nav')[0].firstElementChild.getElementsByTagName('li'), function (item) {
	item.onclick = function () {
		QUERY = document.getElementsByClassName('header-search-search')[0].value;
		item.parentNode.getElementsByClassName('header-nav__active')[0].classList.remove('header-nav__active');
		item.classList.add('header-nav__active');
		if (item.classList.contains('header-nav-all') || !item.classList.contains('header-nav-mens') || !item.classList.contains('header-nav-womens')) GENDER = 'all';
		if (item.classList.contains('header-nav-mens')) GENDER = 'm';
		if (item.classList.contains('header-nav-womens')) GENDER = 'w';
		RenderGoods(goodsfromfile, QUERY, GENDER);
	};
});

document.getElementsByClassName('header-search-button')[0].onclick = function () {
	RenderGoods(goodsfromfile, this.nextElementSibling.value, GENDER);
	document.getElementsByClassName('header-search-search')[0].value = "";
};

document.getElementsByClassName('header-search-search')[0].onkeydown = function (event) {
	if (event.keyCode == 13) {
		RenderGoods(goodsfromfile, this.value, GENDER);
		document.getElementsByClassName('header-search-search')[0].value = "";
	}
};

document.getElementsByClassName('article-wrap-button')[0].onclick = function () {
	RenderBasket();
};

function RenderGoods(data, query, gender) {
	console.log(query);
	scrollTo(0, 0);
	if (!goodsfromfile) goodsfromfile = data;
	var goods = data;
	var goodselem = document.getElementsByClassName('goods')[0];
	while (goodselem.firstChild) {
		goodselem.removeChild(goodselem.firstChild);
	}
	var basketelem = document.getElementsByClassName('basket')[0];
	if (basketelem) basketelem.parentElement.removeChild(basketelem);
	var count = 0;
	goods.forEach(function (item) {
		if (item.name.toLowerCase().indexOf(query.toLowerCase()) != -1 || query.toLowerCase() == "") {
			if (gender == item.gender || gender == 'all') {
				var good = '<div class="good row" id="' + item.id + '">\n\t\t\t\t\t\t\t\t<div class="good-img" style="background-image: url(' + item.picture + ');"></div>\n\t\t\t\t\t\t\t\t<div class="good-description">\n\t\t\t\t\t\t\t\t\t<div class="good-title">\n\t\t\t\t\t\t\t\t\t\t<p>' + item.name + '</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="good-color">\n\t\t\t\t\t\t\t\t\t\t<p>(' + item.color + ')</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="good-size">\n\t\t\t\t\t\t\t\t\t\t<p>Size: </p>\n\t\t\t\t\t\t\t\t\t\t<span>' + item.size[0] + '</span>\n\t\t\t\t\t\t\t\t\t\t<a class="good-changesize">[Change]</a>\n\t\t\t\t\t\t\t\t\t\t<ul>' + ListOfSize(item.size) + '</ul>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="good-price clearfix">\n\t\t\t\t\t\t\t\t\t\t<p>&pound;' + AddPoint(item.price) + '</p>\n\t\t\t\t\t\t\t\t\t\t<a class="good-basket-button">add to basket</a>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>';
				goodselem.innerHTML = goodselem.innerHTML + good;
				count++;
			}
		}
	});
	if (count % 3 == 2) {
		goodselem.innerHTML = goodselem.innerHTML + '<div class="good"></div>';
	}
	[].forEach.call(document.getElementsByClassName("good-changesize"), function (change) {
		change.onclick = ChangeSize(change.nextElementSibling);
		change.parentElement.nextElementSibling.getElementsByTagName('a')[0].onclick = AddToBasket(change.parentElement.parentElement.parentElement);
		[].forEach.call(change.nextElementSibling.children, function (size) {
			size.onclick = NewSize(size);
		});
	});

	scrollTo(0, 0);
}

function AddPoint(number) {
	var point = String(number).indexOf(".");
	if (point == -1) return number + '.00';
	if (String(number).length - point == 2) return number + '0';
	if (String(number).length - point == 3) return number;
}

function ListOfSize(listofsize) {
	var list_of_size = void 0;
	[].forEach.call(listofsize, function (size) {
		!list_of_size ? list_of_size = '<li>' + size + '</li>' : list_of_size += '<li>' + size + '</li>';
	});
	return list_of_size;
}

function ChangeSize(elem) {
	return function () {
		elem.style.display != "inline-block" ? elem.style.display = "inline-block" : elem.style.display = "none";
	};
}

function NewSize(size) {
	return function () {
		size.parentElement.style.display = "none";
		size.parentElement.parentElement.getElementsByTagName('span')[0].innerHTML = size.innerHTML;
	};
}

function AddToBasket(good) {
	return function () {
		var sovpadenie = false;
		basket = JSON.parse(localStorage.getItem("basket"));
		basket.forEach(function (basgood) {
			if (basgood.id == good.id && basgood.size == good.getElementsByClassName('good-size')[0].getElementsByTagName('span')[0].innerHTML) {
				basgood.count++;
				sovpadenie = true;
			}
		});
		if (!sovpadenie) {
			var basket_good = {};
			basket_good.id = good.id;
			basket_good.size = good.getElementsByClassName('good-size')[0].getElementsByTagName('span')[0].innerHTML;
			basket_good.picture = good.getElementsByClassName('good-img')[0].style.backgroundImage.substring(5, good.getElementsByClassName('good-img')[0].style.backgroundImage.length - 2);
			basket_good.name = good.getElementsByClassName('good-title')[0].getElementsByTagName('p')[0].innerHTML + ' ' + good.getElementsByClassName('good-size')[0].getElementsByTagName('span')[0].innerHTML.toUpperCase() + ' ' + good.getElementsByClassName('good-color')[0].getElementsByTagName('p')[0].innerHTML.slice(1, good.getElementsByClassName('good-color')[0].getElementsByTagName('p')[0].innerHTML.length - 1);
			basket_good.price = Number(good.getElementsByClassName('good-price')[0].getElementsByTagName('p')[0].innerHTML.slice(1, good.getElementsByClassName('good-price')[0].getElementsByTagName('p')[0].innerHTML.length));
			basket_good.count = 1;
			basket.push(basket_good);
		}
		basket = JSON.stringify(basket);
		localStorage.setItem("basket", basket);
	};
}

function RenderBasket() {
	while (document.getElementsByClassName('goods')[0].firstChild) {
		document.getElementsByClassName('goods')[0].removeChild(document.getElementsByClassName('goods')[0].firstChild);
	}
	if (document.getElementsByClassName('basket')[0]) document.getElementsByClassName('basket')[0].parentElement.removeChild(document.getElementsByClassName('basket')[0]);
	basket = JSON.parse(localStorage.getItem("basket"));
	var basketelem = '<p class="basket-title">\n\t\t\t\t\t\t\tShopping Bag\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<ul>';
	var totalprice = 0;
	[].forEach.call(basket, function (good) {
		basketelem += '<li class="basket-good" id="bg' + good.id + '">\n\t\t\t\t\t\t<div class="basket-good-img" style="background-image: url(' + good.picture + ');"></div>\n\t\t\t\t\t\t<div class="basket-good-title">' + good.name + '</div>\n\t\t\t\t\t\t<a class="basket-good-remove">[Remove]</a>\n\t\t\t\t\t\t<div class="basket-good-price">\n\t\t\t\t\t\t\t<input value = "' + good.count + '">\n\t\t\t\t\t\t\t<span>&pound;</span>\n\t\t\t\t\t\t\t<p>' + AddPoint(good.price) + '</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</li>';
		totalprice += good.price * good.count;
	});
	basketelem += '</ul>\n\t\t\t\t\t<div class="basket-total clearfix">\n\t\t\t\t\t\t<span>Total: &pound;</span>\n\t\t\t\t\t\t<p>' + AddPoint(totalprice) + '</p>\n\t\t\t\t\t\t<a class="basket-total-button">checkout</a>\n\t\t\t\t\t</div>';
	var basdiv = document.createElement('div');
	basdiv.classList.add('row', 'basket');
	basdiv.innerHTML = basketelem;
	document.getElementsByTagName('footer')[0].parentElement.insertBefore(basdiv, document.getElementsByTagName('footer')[0]);
	if (basket.length == 0) RenderGoods(goodsfromfile, QUERY, GENDER);
	[].forEach.call(document.getElementsByClassName("basket-good"), function (remove) {
		remove.getElementsByTagName('a')[0].onclick = RemoveGood(remove.id);
		remove.getElementsByTagName('input')[0].onkeyup = ChangeCount(remove);
	});
	document.getElementsByClassName('basket-total-button')[0].onclick = function () {
		RenderGoods(goodsfromfile, QUERY, GENDER);
	};
}

function RemoveGood(goodid) {
	return function () {
		[].map.call(basket, function (good, i, arr) {
			if (goodid.substr(2) == good.id) {
				return arr.splice(i, 1);
			}
		});
		basket = JSON.stringify(basket);
		localStorage.setItem("basket", basket);
		RenderBasket();
	};
}

function ChangeCount(good) {
	return function (event) {
		var count = good.getElementsByTagName('input')[0].value == "" ? ["0"] : good.getElementsByTagName('input')[0].value.match(/[0-9]/g);
		var count_rez = "";
		if (event.keyCode == 13) {
			count.forEach(function (kolvo) {
				count_rez += kolvo;
			});
			[].map.call(basket, function (good_from_f, i, arr) {
				if (good_from_f.id == good.id.substr(2)) {
					if (count_rez == 0) {
						return arr.splice(i, 1);
					}
					good_from_f.count = Number(count_rez);
					return arr;
				}
			});
			basket = JSON.stringify(basket);
			localStorage.setItem("basket", basket);
			RenderBasket();
		}
	};
}