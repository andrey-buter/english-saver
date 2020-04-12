function createToast( showParentButton, showPrevButton, saveButton ) {
	var div = document.createElement( 'div' );

	div.setAttribute( 'style', `
        position: fixed;
        z-index: 1202;
        bottom: 10px;
        right: 10px;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
        border: 1px solid rgb(187, 187, 187);
        display: none;
        padding: 5px;
        font-size: 12px;
        max-width: 300px;
    `);

	var divContext = document.createElement( 'div' );

	div.appendChild( divContext );
	div.appendChild( showParentButton );
	//     div.appendChild(showPrevButton);
	div.appendChild( saveButton );

	document.body.appendChild( div );

	return {
		context: ( text ) => { divContext.innerText = text },
		show: () => { div.style.display = 'block' },
		hide: () => { div.style.display = 'none' }
	};
}

function createButton( name, callBack ) {
	var button = document.createElement( 'button' );
	button.textContent = name;
	button.setAttribute( 'type', 'button' );

	button.addEventListener( 'click', callBack );

	return button;
}