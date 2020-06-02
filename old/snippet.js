/*
Pages
- words list 
- show suggested context
- options: (need to save them)
    - trigger stick left/right 
    - set custom size (maybe on words list side)

- options:
    - if not to highlight - on double select word - highlight it on words list
    - if highlight - need to think

Incorrect tests
Page - https://developers.google.com/web/tools/chrome-devtools/javascript/snippets
https://s.mail.ru/GboG/FchGE6Dnw
https://s.mail.ru/A89w/exZxmNCWF
https://s.mail.ru/gjKa/eWQ9eqrXM
*/




var saveButton = createButton( 'Save and Close', ( event ) => {
    toast.hide();
} );

var showParentButton = createButton( 'Show parent text', ( event ) => {
    toast.context( engSelection.getParentContext() );
} );

var showPrevButton = createButton( 'Show parent text', ( event ) => {
    toast.context( engSelection.getParentContext() );
} );

var toast = createToast( showParentButton, showPrevButton, saveButton );

var engSelection;
var parentEngElement;

window.engDebug = true;

var log = ( ...args ) => {
    if ( !window.engDebug ) {
        return;
    }
    console.log( ...args )
};

document.addEventListener( 'DOMNodeInserted', ( event ) => {
    const id = event.target.id;

    if ( 'gtx-host' !== id ) {
        return;
    }

    const selection = window.getSelection();

    if ( selection.toString() !== engSelection?.toString() ) {
        engSelection = new EnglishSelection( selection );
    }
} );

class DataSaver {
    cache = new Map();

    addWord( word, { context, offset, url, selector }, isLoaded = false ) {
        let data = this.getWord( word );

        if ( !data ) {
            data = {
                word,
                contexts: [],
                isLoaded
            }
        }

        data.contexts.push( {
            context,
            offset,
            url,
            selector,
        } )

        this._setWord( word, data );
    }

    updateWordStatus( word, isLoaded ) {
        const data = this.getWord( word );

        data.isLoaded = isLoaded;

        this._setWord( word, data );
    }

    getWords() {
        return this.cache;
    }

    getWord( word ) {
        return this.cache.get( word );
    }

    _setWord( word, data ) {
        this.cache.set( word, data );

        log( '_setWord', this.cache );
    }
}

var saver = new DataSaver();

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
        let selection = this._formatText( word );
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
    _expandDefaultContext( selection, offset, focusNode, context ) {
        log( arguments )
        //         debugger
        const siblingEl = focusNode.previousSibling;
        const siblingContext = this._formatText( siblingEl.nodeValue || siblingEl.innerText, false );
        const siblingSelection = selection.slice( 0, offset );
        const siblingOffset = siblingContext.lastIndexOf( siblingSelection );
        const expandedContext = siblingContext + context;

        if ( -1 !== siblingOffset ) {
            return {
                context: expandedContext,
                offset: siblingOffset
            }
        }

        return this._expandDefaultContext(
            siblingSelection,
            siblingOffset,
            siblingEl,
            expandedContext
        );
    }

    _isSelectionInSingleNode() {
        const context = this.focusNode.nodeValue;
        const offset = this.baseOffset;
        const selection = this.selection;

        return this._verifySelectionInContext( selection, offset, context );
    }

    _setNode() {
        if ( !this.node ) {
            let defaultContext = this.focusNode.nodeValue;
            let offset;

            if ( this._isSelectionInSingleNode() ) {
                offset = this.baseOffset;
            } else {
                offset = this.focusOffset;

                const newContext = this._expandDefaultContext(
                    this.selection,
                    offset,
                    this.focusNode,
                    defaultContext
                )

                defaultContext = newContext.context;
                offset = newContext.offset;

                //                 debugger
            }

            const formattedContext = this._getFormatFocusedContext( offset, defaultContext );

            this.node = this.focusNode;
            this.prevContext = this.selection;
            this.context = formattedContext.text;
            this.offset = formattedContext.offset;
            //             debugger
        } else {
            this.node = this.node.parentElement;
            this.prevContext = this.context;
            this.context = this.node.innerText;
            this._setOffset();

            //             debugger
        }
    }

    // format first focused context and recalc base offset
    // beacuse left part can have  extra symbols \t, \s, \n, \r 
    // - for example, ' they have \t\t access' for selection 'access'
    // - also skip trim() for left = 'Source '
    _getFormatFocusedContext( offset, text ) {
        const formattedText = this._formatText( text, false );

        if ( text === formattedText ) {
            return {
                text,
                offset
            }
        }

        const left = text.slice( 0, offset );
        const formattedLeft = this._formatText( left, false );

        if ( left === formattedLeft ) {
            return {
                text: formattedText,
                offset: offset
            }
        }

        log( '_getFormatFocusedContext', [ formattedText, formattedLeft.length ] )

        return {
            text: formattedText,
            offset: formattedLeft.length - 1
        };
    }

    //     getNode() {
    //          return this.node;
    //     }

    _getContext() {
        this.context = this._cutFocusedSentence( this.offset, this.selection, this.context );

        return this.context;
    }

    getParentContext() {
        this._setNode();

        return this._getContext();
    }

    getPreviousContext() {
        return this.prevContext;
    }

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

    _setOffset() {
        this.offset = this._getWordOffset( this.offset, this.prevContext, this.context );
    }

    _getWordOffset( oldOffset, oldContext, newContext ) {
        log( '_getWordOffset', arguments );
        const index = newContext.indexOf( oldContext );

        log( '_getWordOffset', [ index, oldOffset + index ] );

        return oldOffset + index;
    }

    _cutFocusedSentence( index, word, text ) {
        log( '_cutFocusedSentence', arguments );
        const left = this._cutLeft( text.slice( 0, index ) );
        const right = this._cutRight( text.slice( index + word.length ) );

        text = `${left}${word}${right}`;

        text = this._formatText( text );

        log( '_cutFocusedSentence', [ left, right, text ] );

        return text;
    }

    _formatText( text, useTrim = true ) {
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

    _cutLeft( text ) {
        this.sentenceDeviderMarks.forEach( ( mark ) => {
            const index = text.lastIndexOf( mark );

            if ( -1 === index ) {
                return;
            }

            log( '_cutLeft', [ text, index, text.slice( index + 1 ) ] );

            text = text.slice( index + 1 );
        } );

        return text;
    }

    _cutRight( text ) {
        this.sentenceDeviderMarks.forEach( ( mark ) => {
            const index = text.indexOf( mark );

            if ( -1 === index ) {
                return;
            }

            log( '_cutRight', [ text, index, text.slice( 0, index + 1 ) ] );

            text = text.slice( 0, index + 1 );
        } );

        return text;
    }
}


var myTimeout;

document.addEventListener( 'selectionchange', ( event ) => {
    const cls = window.getSelection().focusNode?.className;

    if ( 'Range' !== window.getSelection().type ) {
        return;
    }

    //     if ('jfk-bubble-content-id' !== cls) {
    //         return;
    //     }

    if ( myTimeout ) {
        clearTimeout( myTimeout );
    }

    const selection = window.getSelection();

    myTimeout = setTimeout( () => {
        engSelection = new EnglishSelection( selection );
        const sentence = engSelection.getSentence();
        const word = engSelection.getWord();

        saver.addWord( word.word, word.contexts );
        toast.context( sentence );
        toast.show();
    }, 1000 );
} );

// function proxySaver(saver) {
//     saver.addWord = new Proxy(saver.addWord, {
//         apply(target, thisArg, args) {

//             target.apply(thisArg, args);
//         }
//     });

//     return saver;
// }


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
        font-size: 10px;
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