/*global app.qs, app.qsa, $on, $parent, $delegate */

(function (window) {
	'use strict';

	function View() {


		this.$productList = app.qs('.product-list');
		this.$console = app.qs('.console');
		this.$totalMoney = app.qs('.totalMoney');
		this.$indicator = app.qs('.amount-indicator');
		this.$moneyList = app.qs('.money-list');
		this.$buttonList = app.qs('.button-list');
		this.$amountList = app.qsa('.amount');
	}

	View.prototype.bind = function (event, handler) {
		if (event === 'withdrawMoney') {
			app.$delegate(this.$moneyList, '.money .button', 'click', function () {
				handler(this.parentNode.nextElementSibling, this.textContent);
			});

		} else if (event === 'inputProductId') {
			app.$delegate(this.$buttonList, '.button-list .button', 'click', function () {
				handler(this.textContent);
			});
		}
	};

	View.prototype.render = function (viewCmd, parameter) {
		const viewCommands = {
			showProducts: () => {
				this.$productList.innerHTML = this._showProductTemplate(parameter);
			},
			renderWallet: () => {
				this._renderWallet(parameter);
			},
			writeLog: () => {
				this._writeLog(parameter);
			},
			renderPurchasableProducts: () => {
				this._renderPurchasableProducts(parameter);
			},
			renderWithdrawMoney: () => {
				this._renderWithdrawMoney(parameter);
			},
			renderIndicatorMoney: () => {
				this._renderIndicatorMoney(parameter);
			}
		};

		viewCommands[viewCmd]();
	};

	View.prototype._showProductTemplate = function (products) {
		let i, l;
		let view = '';
		const defaultTemplate = '<li class="col-3">' +
			'<div class="product-name">{{name}}</div>' +
			'<div class="product-info">' +
			'<span class="product-id">{{id}}.</span> ' +
			'<span class="product-price">{{price}}</span>' +
			'</div>' +
			'</li>';

		for (i = 0, l = products.length; i < l; i++) {
			let template = defaultTemplate;

			template = template.replace('{{name}}', products[i].name);
			template = template.replace('{{id}}', products[i].id);
			template = template.replace('{{price}}', products[i].price);

			view = view + template;
		}

		return view;
	}

	View.prototype._writeLog = function (text) {
		const line = document.createElement('p');
		line.innerHTML = text;
		this.$console.appendChild(line);
		this.$console.scrollTop = this.$console.offsetHeight;
	};

	View.prototype._renderWallet = function ({
		wallet,
		totalMoney,
		indicatorMoney
	}) {
		Array.from(this.$amountList).forEach(($amount) => {
			const moneyType = $amount.getAttribute('data-money');
			this._renderMoneyAmount($amount, wallet[moneyType]);
		});
		this._renderIndicatorMoney(indicatorMoney);
		this._renderTotalMoney(totalMoney);
	};

	View.prototype._renderWithdrawMoney = function ({
		$amount,
		moneyAmount,
		indicatorMoney,
		totalMoney
	}) {
		this._renderMoneyAmount($amount, moneyAmount);
		this._renderIndicatorMoney(indicatorMoney);
		this._renderTotalMoney(totalMoney);
	};


	View.prototype._renderMoneyAmount = function ($amount, moneyAmount) {
		$amount.textContent = moneyAmount + '개';
	}

	View.prototype._renderTotalMoney = function (totalMoney) {
		this.$totalMoney.textContent = totalMoney + '원';
	}

	View.prototype._renderIndicatorMoney = function (indicatorMoney) {
		this.$indicator.textContent = indicatorMoney + '원';
	}

	View.prototype._renderPurchasableProducts = function (indicatorMoney) {
		const $productPrice = app.qsa('.product-price');
		Array.from($productPrice).forEach(function (el) {
			if (el.textContent <= indicatorMoney) {
				el.parentNode.previousSibling.style.backgroundColor = "yellow";
			} else {
				el.parentNode.previousSibling.style.backgroundColor = "lightblue";
			}
		});
	};

	// Export to window
	window.app = window.app || {};
	window.app.View = View;
}(window));