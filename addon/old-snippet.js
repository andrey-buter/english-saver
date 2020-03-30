
class EnglishSelection {
    node;
    _offset;
    _context;
    prevContext;
    outputSentence;
    outputIteration = 0;

    get offset() {
        return this._offset;
    }

    set offset( val ) {
        log( 'set offset', [ val ] )
        this._offset = val;
    }

    get context() {
        return this._context;
    }

    set context( val ) {
        log( 'set context', [ val ] )
        this._context = val;
    }

    sentenceDeviderMarks = [ '.', '!', '?' ];
    punctuationMarks = [ '.', '!', '?', ',', ':', ';', '"', "'" ];
    punctuationMarksRegExp = '[.,\/#!$%\^&\*;:{}=\-_`~()]';

    constructor( selection ) {
        log( selection )
        this.focusOffset = selection.focusOffset;
        this.baseOffset = selection.baseOffset;
        this.focusNode = selection.focusNode;
        this.selection = this._formatSelection( selection.toString() );
        this.url = selection.baseNode.baseURI;
    }

    toString() {
        return this.selection;
    }

    // if selection = 'panel. ' - format it
    // if 'panel. Something' - return input value
    _formatSelection( word ) {
        let selection = this.__formatText( word );
        const regExp = new RegExp( this.punctuationMarksRegExp + '$', 'g' );

        if ( !regExp.test( selection ) ) {
            return word;
        }

        return selection.replace( regExp, '' );
    }

    // selection word can contain several nodes
    // but focuseNode value contain only latest
    // so we need to verify this and then find all nodes with selection 
    _verifySelectionInContext( word, offset, context ) {
        return context.indexOf( word ) === offset;
    }

    // if selection phrase consists of several nodes
    // we need to find all nodes and full context
    __expandDefaultContext( selection, offset, focusNode, context ) {
        log( arguments )
        //         debugger
        const siblingEl = focusNode.previousSibling;
        const siblingContext = this.__formatText( siblingEl.nodeValue || siblingEl.innerText, false );
        const siblingSelection = selection.slice( 0, offset );
        const siblingOffset = siblingContext.lastIndexOf( siblingSelection );
        const expandedContext = siblingContext + context;

        if ( -1 !== siblingOffset ) {
            return {
                context: expandedContext,
                offset: siblingOffset
            }
        }

        return this.__expandDefaultContext(
            siblingSelection,
            siblingOffset,
            siblingEl,
            expandedContext
        );
    }

    __isSelectionInSingleNode() {
        const context = this.focusNode.nodeValue;
        const offset = this.baseOffset;
        const selection = this.selection;

        return this._verifySelectionInContext( selection, offset, context );
    }

    __setNode() {
        if ( !this.node ) {
            let defaultContext = this.focusNode.nodeValue;
            let offset;

            if ( this.__isSelectionInSingleNode() ) {
                offset = this.baseOffset;
            } else {
                offset = this.focusOffset;

                const newContext = this.__expandDefaultContext(
                    this.selection,
                    offset,
                    this.focusNode,
                    defaultContext
                )

                defaultContext = newContext.context;
                offset = newContext.offset;

                //                 debugger
            }

            const formattedContext = this.__getFormatFocusedContext( offset, defaultContext );

            this.node = this.focusNode;
            this.prevContext = this.selection;
            this.context = formattedContext.text;
            this.offset = formattedContext.offset;
            //             debugger
        } else {
            this.node = this.node.parentElement;
            this.prevContext = this.context;
            this.context = this.node.innerText;
            // this._setOffset();

            // //             debugger
        }
    }

    // format first focused context and recalc base offset
    // beacuse left part can have  extra symbols \t, \s, \n, \r 
    // - for example, ' they have \t\t access' for selection 'access'
    // - also skip trim() for left = 'Source '
    __getFormatFocusedContext( offset, text ) {
        const formattedText = this.__formatText( text, false );

        if ( text === formattedText ) {
            return {
                text,
                offset
            }
        }

        const left = text.slice( 0, offset );
        const formattedLeft = this.__formatText( left, false );

        if ( left === formattedLeft ) {
            return {
                text: formattedText,
                offset: offset
            }
        }

        log( '__getFormatFocusedContext', [ formattedText, formattedLeft.length ] )

        return {
            text: formattedText,
            offset: formattedLeft.length - 1
        };
    }

    //     getNode() {
    //          return this.node;
    //     }

    _getContext() {
        this.context = this.__cutFocusedSentence( this.offset, this.selection, this.context );

        return this.context;
    }

    getParentContext() {
        this._setNode();

        return this._getContext();
    }

    // getPreviousContext() {
    //     return this.prevContext;
    // }

    getWord() {
        return {
            word: this.selection,
            contexts: {
                context: this.context,
                offset: this.offset,
                url: this.url,
                // https://github.com/ericclemmons/unique-selector
                selector: ''
            }
        }
    }

    getSentence() {
        const context = this.getParentContext();

        if ( this.outputSentence === context ) {
            return context;
        }

        if ( [ 'p', 'div' ].includes( this.node?.tagName?.toLowerCase() ) ) {
            return context;
        }


        this.outputSentence = context;
        this.outputIteration++;

        log( 'getSentence', [ this.outputIteration, context, this.node ] );

        return this.getSentence();
    }

    // _setOffset() {
    //     this.offset = this._getWordOffset( this.offset, this.prevContext, this.context );
    // }

    // _getWordOffset( oldOffset, oldContext, newContext ) {
    //     log( '_getWordOffset', arguments );
    //     const index = newContext.indexOf( oldContext );

    //     log( '_getWordOffset', [ index, oldOffset + index ] );

    //     return oldOffset + index;
    // }

    __cutFocusedSentence( index, word, text ) {
        log( '__cutFocusedSentence', arguments );
        const left = this.__cutLeft( text.slice( 0, index ) );
        const right = this.__cutRight( text.slice( index + word.length ) );

        text = `${left}${word}${right}`;

        text = this.__formatText( text );

        log( '__cutFocusedSentence', [ left, right, text ] );

        return text;
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

    __cutLeft( text ) {
        this.sentenceDeviderMarks.forEach( ( mark ) => {
            const index = text.lastIndexOf( mark );

            if ( -1 === index ) {
                return;
            }

            log( '__cutLeft', [ text, index, text.slice( index + 1 ) ] );

            text = text.slice( index + 1 );
        } );

        return text;
    }

    __cutRight( text ) {
        this.sentenceDeviderMarks.forEach( ( mark ) => {
            const index = text.indexOf( mark );

            if ( -1 === index ) {
                return;
            }

            log( '__cutRight', [ text, index, text.slice( 0, index + 1 ) ] );

            text = text.slice( 0, index + 1 );
        } );

        return text;
    }
}
