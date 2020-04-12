class DomList {
	list;
	highlighted;

	addItem(text) {
		if (!this.list) {
			this.createList();
		}

		this._unHighlightItem();

		const li = document.createElement('li');
		li.id = this._getId(text);
		li.innerText = text;
		li.setAttribute('style', `
			box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
			border: 1px solid rgb(187, 187, 187);
			padding: 5px;
			margin-bottom: 5px;
		`);
		this.list.appendChild(li);
	}

	_unHighlightItem() {
		if (!this.highlighted) {
			return;
		}

		this.highlighted.style.borderColor = 'rgb(187, 187, 187)';
		this.highlighted = null;
	}

	highlightItem(text) {
		if (!this.list) {
			return;
		}
		const id = this._getId(text);
		this.highlighted = this.list.querySelector(`#${id}`);
		if (this.highlighted) {
			this.highlighted.style.borderColor = 'red';
		}
	}

	createList() {
		this.list = document.createElement('ul');
		this.list.setAttribute('style', `
			position: fixed;
			bottom: 100px;
			right: 10px;
			z-index: 1202;
			font-size: 12px;
			max-width: 300px;
		`);

		document.body.appendChild( this.list );
	}

	_getId(text) {
		return text
			.trim()
			.replace(/&.+?;/g, '')
			.replace('.', '-')
			// .replace( /[^%a-z0-9 _-]/g, '')
			.replace( /\s+/g, '-')

	}
}

/***
 // Kill entities.
 $title = preg_replace( '/&.+?;/', '', $title );
 $title = str_replace( '.', '-', $title );
 
 $title = preg_replace( '/[^%a-z0-9 _-]/', '', $title );
 $title = preg_replace( '/\s+/', '-', $title );
 $title = preg_replace( '|-+|', '-', $title );
 $title = trim( $title, '-' );
 */