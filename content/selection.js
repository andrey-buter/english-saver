const tests = [
	{
		html: `<div>Students compile a collection of their texts in a variety of genres over time and choose two pieces to present for
	summative Mr. Andrew assessment. In the majority of cases, the work in the student’s <a href="#">collection</a> will arise from normal classwork,
	as the examples below illustrate.</div>`,
		selectionTexts: [
			'student’s collection will',
			'student’s',
			'collection', //* in <a>
			'will',
			'student’s collection',
			'collection will'
		]
	},
	{
		html: `<ul><li>They are not to be used for any other purpose. More examples will be added over time.</li></ul>`,
		selectionTexts: [
			'More'
		]
	}
];

'student’s collection will',
'collection will arise from normal classwork, as the examples below illustrate'

class SelectionContext {
	// enableTest = true;
	exceptions = [ 'Mr.', 'Mrs.' ];
	contexts = [];
	logContexts = [];
	expandSelectionCharacters = 10;
	expandedSelection;
	sentenceDividerMarks = [ '.', '!', '?' ];
	punctuationMarks = [ '.', '!', '?', ',', ':', ';', '"', "'" ];
	punctuationMarksRegExp = '[.,\/#!$%\^&\*;:{}=\-_`~()]';
	wrapperTags = [ 'p', 'div', 'li' ];

	constructor( selection ) {
		console.log( selection )
		this.selectionBeginsOffset = selection.anchorOffset; //* start of selection
		this.selectionEndsOffset = selection.focusOffset; //* end of selection
		this.selectionBeginsNode = selection.anchorNode;
		this.selectionEndsNode = selection.focusNode;
		this.selection = this._formatRawSelection( selection.toString() );
		this.expandedSelection = this.selection;
		this.url = selection.baseNode.baseURI;

		// this._tests();
	}

	toString() {
		return this.selection;
	}

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

	__logContext( context ) {
		this.logContexts.push( context );
	}

	_tests() {

		// assert(true === this.__isSelectionInSingleNode())
	}


	__isSelectionInSingleNode( selection, context ) {
		return -1 !== context.indexOf( selection );
	}

	//* if context has two equals selection words
	//* we will search it by expanded selection 
	//* = {+10 characters before}{selection}{+10 characters after}
	_setExpandedSelection( selection, offset, context ) {
		const length = this.expandSelectionCharacters;
		// I cut sentense because I want to know expanded selection in focused sentense only
		const { context: cutContext, offset: cutOffset } = this.__cutSentence( selection, offset, context );

		const beforeIndex = cutOffset > length ? cutOffset - length - 1 : 0
		const afterIndex = cutOffset + selection.length + length

		this.expandedSelection = cutContext.context.slice( beforeIndex, afterIndex );
	}

	__defineContext() {
		return !this.node ? this.___setFirstContext() : this.__setParentContext();
	}

	___setFirstContext() {
		const selection = this.selection;
		let context = this.selectionBeginsNode.nodeValue;
		let offset;

		group.start('SetFirstContext');

		this.__logContext( context );

		if ( this.__isSelectionInSingleNode( selection, context ) ) {
			//* user can select from left-to-right and from right-to-left
			offset = this.selectionBeginsOffset > this.selectionEndsOffset ? this.selectionEndsOffset : this.selectionBeginsOffset;
			this.node = this.selectionEndsNode;
		} else {
			offset = 0;;
			//* I always get last node in selection
			const node = this._getLastNodeInSelection();
			context = node.nodeValue;

			//* if selection places in several nodes
			//* we know only offset in the latest node
			//* so we need to find all nodes which contain whole selection
			const newContext = this.__expandContextWithSiblingsBefore(
				this.selection,
				offset,
				node,
				context
			)

			context = newContext.context;
			this.__logContext( context );
			offset = newContext.offset;
			this.node = node;
		}

		if ( !this.__findSentenceDividerMarkAfter( context ) ) {
			context = this.__expandContextWithSiblingsAfter( this.selectionEndsNode, context );
			this.__logContext( context );
		}

		const formattedContext = this.__getFormatFocusedContext( offset, context );

		this.__setContext( formattedContext.context, formattedContext.offset );

		group.end();
	}

	_getLastNodeInSelection() {
		const partOfSelection = this.selectionBeginsNode.nodeValue.slice(this.selectionBeginsOffset);

		return (-1 !== this.selection.indexOf(partOfSelection)) ? this.selectionEndsNode : this.selectionBeginsNode;
	}

	__setParentContext() {
		group.start( 'SetParentContext' );

		const prevContext = this.__getLastContext();
		let prevContextText = prevContext.context;


		if ( !this.__findSentenceDividerMarkAfter( prevContextText ) ) {
			prevContextText = this.__expandContextWithSiblingsAfter( this.node, prevContextText );
			this.__logContext( prevContextText );
		}

		//* if selection consists of several nodes we find diff and add it to context
		const diff = 0 === prevContext.offset ? this.__findDiff(this.selection, prevContextText) : '';

		this.node = this.node.parentElement;
		const context = this.node.innerText;
		const offset = this.__getSelectionOffsetInParent( prevContext.offset, diff + prevContextText, context );
		this.__setContext( context, offset );

		group.end();
	}

	//* format first focused context and re-calc base offset
	//* because left part can have  extra symbols \t, \s, \n, \r 
	//* - for example, ' they have \t\t access' for selection 'access'
	//* - also skip trim() for left = 'Source '
	__getFormatFocusedContext( offset, context ) {
		const formattedText = this.__formatText( context, false );

		log2( '__getFormatFocusedContext input', { context, offset }, context );

		if ( context === formattedText ) {
			log2( '__getFormatFocusedContext output', { context: formattedText } );

			return {
				context,
				offset
			}
		}

		const left = context.slice( 0, offset );
		const formattedLeft = this.__formatText( left, false );

		if ( left === formattedLeft ) {
			log2( '__getFormatFocusedContext output', { context: formattedText, offset: formattedLeft.length } )
			return {
				context: formattedText,
				offset: offset
			}
		}

		log2( '__getFormatFocusedContext output', { context: formattedText, offset: formattedLeft.length } )

		return {
			context: formattedText,
			// offset: formattedLeft.length - 1 /// ???
			offset: formattedLeft.length /// ???
		};
	}

	__setContext( rawContext, rawOffset ) {
		const { context, offset } = this.__cutSentence( this.selection, rawOffset, rawContext );

		log2( '__setContext', { context, offset } );

		this.contexts.push( {
			context,
			offset,
			rawContext,
			rawOffset
		} );
	}

	__getSelectionOffsetInParent( selectionOffset, selectionContext, parentContext ) {
		log2( '__getSelectionOffsetInParent input', { selectionOffset, selectionContext, parentContext} );
		const index = parentContext.indexOf( selectionContext );

		if (-1 === index) {
			return selectionOffset;
		}

		log2( '__getSelectionOffsetInParent output', { 
			'offset in parent': index, 
			'selection offset in parent': selectionOffset + index
		} );

		return selectionOffset + index;
	}

	__findDiff(selection, context) {
		for (const key in selection.split( '' )) {
			const selectionPart = selection.slice(key);

			if (0 !== context.indexOf(selectionPart)) {
				continue;
			}

			log2( '__findDiff', { output: selection.slice( 0, key ) });

			return selection.slice(0, key);
		}
	}



	// __findIntersection(selection, context) {
	// 	if (context.includes(selection)) {
	// 		return selection;
	// 	}

	// 	const length = selection.length;
	// 	const half = Math.ceil(length/2);

	// 	return this.__findIntersection( selection.slice( -half), context);
	// }

	__expandContextWithSiblingsAfter( node, context ) {
		const nextSibling = node.nextSibling;

		log2( '__expandContextWithSiblingsAfter input', { context, nextSibling: nextSibling?.type }, node );

		if ( !nextSibling ) {
			return context;
		}

		context = context + this.__formatText( nextSibling.nodeValue || nextSibling.innerText, false );
		this.__logContext( context );

		if ( !this.__findSentenceDividerMarkAfter( context ) ) {
			return this.__expandContextWithSiblingsAfter( nextSibling, context );
		}

		return context;
	}

	//* if selection phrase consists of several nodes
	//* we need to find all nodes and full context
	__expandContextWithSiblingsBefore( selection, offset, focusNode, context ) {
		log2( '__expandContextWithSiblingsBefore', { selection, offset, context }, focusNode );

		const siblingEl = focusNode.previousSibling;

		if ( !siblingEl) {
			return {
				context,
				offset
			}
		}

		const siblingContext = this.__formatText( siblingEl.nodeValue || siblingEl.innerText, false );
		const siblingSelection = selection.slice( 0, offset );
		const siblingOffset = siblingSelection.length ? siblingContext.lastIndexOf( siblingSelection ) : 0;
		const expandedContext = siblingContext + context;
		this.__logContext( expandedContext );

		if ( -1 !== siblingOffset ) {
			return {
				context: expandedContext,
				offset: siblingOffset
			}
		}

		return this.__expandContextWithSiblingsBefore(
			siblingSelection,
			siblingOffset,
			siblingEl,
			expandedContext
		);
	}

	__getLastContext() {
		return this.contexts.slice( -1 ).pop();
	}

	getPreviousContext() {
		return this.contexts.slice( -2, -1 ).pop();
	}

	getSentence() {
		this.__defineContext();

		const context = this.__getLastContext();
		const prevContext = this.getPreviousContext();

		//* condition with rawContext exists for case <a><strong>Selection</strong></a>
		if ( prevContext && prevContext.context === context.context && prevContext.rawContext !== context.rawContext ) {
			log2( 'GetSentence', { 
				context: context.context,
				parent: context.rawContext
			}, this.node );

			return context.context;
		}

		if ( this.wrapperTags.includes( this.node?.tagName?.toLowerCase() ) ) {
			log2( 'GetSentence', { 
				context: context.context, 
				tagName: this.node.tagName,
				parent: context.rawContext
			}, this.node );

			return context.context;
		}

		log2( 'GetSentence', { 
			context: context.context,
			parent: context.rawContext
		}, this.node );

		return this.getSentence();
	}

	__cutSentence( selection, offset, context ) {
		group.start('cutSentence');
		log2( '__cutSentence input', { selection, offset, context}, context );

		//* if selection in several nodes
		if ( selection !== context.slice( offset, offset + selection.length)) {
			log2( '__cutSentence output', { 
				'output offset': offset, 
				'output context': context, 
				sliced: context.slice( offset, offset + selection.length ),
				'selection is not in context': true
			} );
			group.end();

			return {
				offset, 
				context
			}
		}

		const left = this.__cutBeforeSelection( context.slice( 0, offset ) );
		const right = this.__cutAfterSelection( context.slice( offset + selection.length ) );

		context = `${left}${selection}${right}`;

		context = this.__formatText( context, false );

		log2( '__cutSentence output', { 
			'context before': left, 
			'context after': right, 
			'output context': context, 
			'output offset': left.length 
		} );
		group.end();

		return {
			context,
			offset: left.length
		};
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

	__findSentenceDividerMarkAfter( context ) {
		return this.sentenceDividerMarks.some( ( mark ) => this.__isMarkAfterDivider( context, mark ) );
	}

	__isMarkAfterDivider( context, mark ) {
		const index = context.lastIndexOf( mark );

		if ( -1 === index ) {
			return false;
		}

		const hasException = this.exceptions.some( ( exception ) => {
			const testStr = context.slice( index + 1 - exception.length, index + 1 );

			return testStr === exception;
		} );

		if ( hasException ) {
			return false;
		}

		return true;
	}

	__cutBeforeSelection( context ) {
		return  this.sentenceDividerMarks.reduce( ( text, mark ) => {
			const index = text.lastIndexOf( mark );

			if ( -1 === index ) {
				return text;
			}

			// TODO: think about how to detect exception in case 
			//! if the first letter is, for ex., '.'
			//! somehow I have to know expanded context on max exception word length
			//! '. Andrew...' - I don't know this is 'Mr. Andrew...' or
			//! '.' means end of previous sentence

			//* I increase index + 1 because lastIndexOf() returns symbol index from start
			//* For example, ' . Test'.lastIndexOf('.') === 1
			//* And I want to get text after the symbol, e.i. ' Test'
			//* So we need to increase index
			text = text.slice( index + 1 );
			const formatted = text.trimStart();

			log2( '__cutBeforeSelection', { context, index: index + 1, text, output: formatted } );

			return formatted;
		}, context );
	}

	__isMarkBeforeDivider(text, mark) {

	}

	__cutAfterSelection( context ) {
		return this.sentenceDividerMarks.reduce( ( text, mark ) => {
			if ( !this.__isMarkAfterDivider( text, mark ) ) {
				return text;
			}

			const index = text.indexOf( mark );

			log2( '__cutAfterSelection', { 
				'input context': context, 
				mark,
				'mark index': index + 1, 
				'output context': text.slice( 0, index + 1 ) 
			} );

			return text.slice( 0, index + 1 );

		}, context );
	}

	getSelectionObject() {
		return {
			word: this.selection,
			url: this.url,
			selector: '',
			context: this.__getLastContext(),
			offset: null,
			translation: null
		}
	}

}