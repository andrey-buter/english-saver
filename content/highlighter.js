class Highlighter {
	// ! manipulate of nodes not text

	constructor(selection) {
		this.selectionBeginsOffset = selection.anchorOffset; //* start of selection
		this.selectionEndsOffset = selection.focusOffset; //* end of selection
		this.selectionBeginsNode = selection.anchorNode;
		this.selectionEndsNode = selection.focusNode;

		// Logic OnSelect
		// use https://www.w3schools.com/xml/met_text_replacedata.asp to replace textNode
		// to get node Name use prop nodeName

		// My logic for simple selection in one node:
		// 0) clone current node - cloneNode()
		// 1) replace text in origin textNode
		// 2) create new selection html
		// 3) insertAfter() new html node after origin
		// 4) insertAfter() cloned node with replaced text

		// Selection in several nodes
		// 1) 

		// Login on Load saved words
	}
}