const NUMBER_TO_WORD = ['','one','two','three','four','five','six','seven','eight','nine'];

export class NavBar {


	/**
	* creates instance of Nav bar 
	* @param [uiAppInstance] App Instance
	* @param [menuItems] App navigation items
	* @param [container] Container to render nav bar
	*/
	constructor(uiAppInstance, menuItems, container = document.querySelector('.nav-bar')) {

		this.uiInstance = uiAppInstance;
		this.menuItems = menuItems;
		this.container = container;

		this.renderMenus();
	}

	/**
	*	Renders menu
	*/
	renderMenus() {
		let menuWrapper = document.createElement('div');
		menuWrapper.classList.add('ui', 'item', 'menu', NUMBER_TO_WORD[this.menuItems.length]);
		for (var i = 0; i < this.menuItems.length; i++) {
			let menuItem = this.menuItems[i];
			let menuEl = this.createMenu(menuItem);

			menuWrapper.appendChild(menuEl);
		};

		this.container.appendChild(menuWrapper);
	}

	/**
	*	Create each menu item
	*/
	createMenu(menuItem, i) {
		let menuEl = document.createElement('a');

		menuEl.innerHTML = menuItem.label;

		menuEl.classList.add('item', (i === 0) ? 'active': null, menuItem.enabled ? null : 'disabled');

		menuEl.addEventListener('click', (function(self, _item) {
			return self.uiInstance[_item.action] ? self.uiInstance[_item.action].bind(self.uiInstance) : function() {};
		})(this, menuItem), false);

		return menuEl;
	}
}