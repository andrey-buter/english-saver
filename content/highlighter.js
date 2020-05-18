class Highlighter {
	// ! manipulate of nodes not text

	punctuationMarksRegExp = '[.,\/#!$%\^&\*;:{}=\-_`~()]';

	constructor(selection) {
		this.selectionBeginsOffset = selection.anchorOffset; //* start of selection
		this.selectionEndsOffset = selection.focusOffset; //* end of selection
		this.selectionBeginsNode = selection.anchorNode;
		this.selectionEndsNode = selection.focusNode;

		// this.selectionString = this._formatRawSelection(selection.toString());
		this.selectionString = selection.toString();

		// Logic OnSelect
		// use https://www.w3schools.com/xml/met_text_replacedata.asp to replace textNode
		// to get node Name use prop nodeName

		// My logic for simple selection in one node:
		// 0) clone current node - cloneNode()
		// 1) replace text in origin textNode
		// 2) create new selection html
		// 3) insertAfter() (see insertBefore) new html node after origin
		// 4) insertAfter() cloned node with replaced text

		// Selection in several nodes
		// 1) 

		// Login on Load saved words


		// get css path https://stackoverflow.com/questions/3620116/get-css-path-from-dom-element
		
		// highlighter (number 9) https://www.sitepoint.com/10-jquery-text-highlighter-plugins/#9texthighlighter
		// http://mir3z.github.io/texthighlighter/
	}

	highlight() {
		this._highlightInSingleNode(this.selectionBeginsNode, this.selectionBeginsOffset);
	}

	_highlightInSingleNode(node, offset) {
		// TODO clone origin node
		const nodeClone = node.cloneNode();
		const selectionString = this.selectionString;


		if ('#text' === node.nodeName) {
			const end = offset + selectionString.length;
			const textBeforeSelection = node.nodeValue.slice(0, offset);
			const textAfterSelection = node.nodeValue.slice(end);

			node.replaceData(0, node.nodeValue.length, textBeforeSelection);
			const insertedNode = this._insertAfter(node, this._getHighlightedNode(selectionString));

			if (textAfterSelection.length) {
				nodeClone.replaceData(0, nodeClone.nodeValue.length, textAfterSelection);
				this._insertAfter(insertedNode, nodeClone);
			}
		}
	}

	_insertAfter(currentNode, nextNode) {
		return currentNode.parentNode.insertBefore(nextNode, currentNode.nextElementSibling);
	}

	_getHighlightedNode(text) {
		const mark = document.createElement('mark');
		mark.classList.add('eng-saver-mark');
		mark.innerText = text;

		return mark;
	}

	// Remove spaces and punctuations at the end
	//* if selection = 'panel. ' - format it
	//* if 'panel. Something' - return input value
	_formatRawSelection( word ) {
		let selection = this.__formatText( word );
		const regExp = new RegExp( this.punctuationMarksRegExp + '$', 'g' );

		if ( !regExp.test( selection ) ) {
			return word;
		}

		return selection.replace( regExp, '' );
	} 
	

	__formatText( text, useTrim = true ) {
		if ( useTrim ) {
			text = text.trim();
		}
		return text
			// remove new lines
			.replace( /(\r\n|\n|\r)/gm, " " )
			// remove tabs
			.replace( "\t", ' ' )
			// remove double+ spaces
			.replace( /\s\s+/g, ' ' );
	}
}