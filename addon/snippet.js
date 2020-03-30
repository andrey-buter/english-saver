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

var log2 = (funcName, ...args) => {
    if ( !window.engDebug ) {
        return;
    }
    console.group();
    console.log(funcName);
    console.log(...args);
    console.groupEnd();
}

var assert = ( ...args ) => {
    if ( !window.angTest ) {
        return;
    }
    console.assert( ...args );
}

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

        log2( '_setWord', this.cache );
    }
}

var saver = new DataSaver();

// class SelectionContext {
//     // enableTest = true;
//     exceptions = [ 'Mr.', 'Mrs.' ];
//     contexts = [];
//     logContexts = [];
//     expandSelectionCharacters = 10;
//     expandedSelection;
//     sentenceDeviderMarks = [ '.', '!', '?' ];
//     punctuationMarks = [ '.', '!', '?', ',', ':', ';', '"', "'" ];
//     punctuationMarksRegExp = '[.,\/#!$%\^&\*;:{}=\-_`~()]';

//     constructor( selection ) {
//         log( selection )
//         this.focusOffset = selection.focusOffset;
//         this.baseOffset = selection.baseOffset;
//         this.focusNode = selection.focusNode;
//         this.selection = this._formatSelection( selection.toString() );
//         this.expandedSelection = this.selection;
//         this.url = selection.baseNode.baseURI;

//         // this._tests();
//     }

//     toString() {
//         return this.selection;
//     }

//     // if selection = 'panel. ' - format it
//     // if 'panel. Something' - return input value
//     _formatSelection( word ) {
//         let selection = this.__formatText( word );
//         const regExp = new RegExp( this.punctuationMarksRegExp + '$', 'g' );

//         if ( !regExp.test( selection ) ) {
//             return word;
//         }

//         return selection.replace( regExp, '' );
//     }

//     __logContext( context ) {
//         this.logContexts.push( context );
//     }

//     _tests() {
//         // assert(true === this.__isSelectionInSingleNode())
//     }


//     __isSelectionInSingleNode( selection, context ) {
//         return -1 !== context.indexOf( selection );
//     }

//     // if context has two equals selection words
//     // we will search it by expanded selection 
//     // = {+10 characters before}{selection}{+10 characters after}
//     _setExpandedSelection( selection, offset, context ) {
//         const length = this.expandSelectionCharacters;
//         // I cut sentense because I want to know expanded selection in focused sentense only
//         const { context: cutContext, offset: cutOffset } = this.__cutSentence( selection, offset, context );

//         const beforeIndex = cutOffset > length ? cutOffset - length - 1 : 0
//         const afterIndex = cutOffset + selection.length + length

//         this.expandedSelection = cutContext.context.slice( beforeIndex, afterIndex );
//     }

//     __defineContext() {
//         return !this.node ? this.___setContextWithSelection() : this.__setParentContext();
//     }

//     ___setContextWithSelection() {
//         const selection = this.selection;
//         let context = this.focusNode.nodeValue;
//         let offset;

//         this.__logContext( context );

//         if ( this.__isSelectionInSingleNode( selection, context ) ) {
//             offset = this.baseOffset;
//         } else {
//             offset = this.focusOffset;

//             // if selection places in several nodes
//             // we know only offset in the latest node
//             // so we need to find all nodes which contan whole selection
//             const newContext = this.__expandContextWithSiblingsBefore(
//                 this.selection,
//                 offset,
//                 this.focusNode,
//                 context
//             )

//             context = newContext.context;
//             this.__logContext( context );
//             offset = newContext.offset;
//         }

//         if ( !this.__findSentenceDeviderMarkAfter( context ) ) {
//             context = this.__expandContextWithSiblingsAfter( this.focusNode, context );
//             this.__logContext( context );
//         }

//         const formattedContext = this.__getFormatFocusedContext( offset, context );

//         this.node = this.focusNode;
//         this.prevContext = this.selection;
//         this.__setContext( formattedContext.context, formattedContext.offset );
//     }

//     // format first focused context and recalc base offset
//     // beacuse left part can have  extra symbols \t, \s, \n, \r 
//     // - for example, ' they have \t\t access' for selection 'access'
//     // - also skip trim() for left = 'Source '
//     __getFormatFocusedContext( offset, text ) {
//         const formattedText = this.__formatText( text, false );

//         if ( text === formattedText ) {
//             return {
//                 context,
//                 offset
//             }
//         }

//         const left = text.slice( 0, offset );
//         const formattedLeft = this.__formatText( left, false );

//         if ( left === formattedLeft ) {
//             return {
//                 context: formattedText,
//                 offset: offset
//             }
//         }

//         log2( '__getFormatFocusedContext', [ formattedText, formattedLeft.length ] )

//         return {
//             context: formattedText,
//             offset: formattedLeft.length - 1
//         };
//     }

//     __setParentContext() {
//         this.node = this.node.parentElement;
//         const context = this.node.innerText;
//         // get lates array item
//         const prevContext = this.__getLastContext();
//         const offset = this._getWordOffset( prevContext.offset, prevContext.context, context );
//         this.__setContext( context, offset );
//     }

//     __setContext( rawContext, rawOffset ) {
//         const { context, offset } = this.__cutSentence( this.selection, rawOffset, rawContext );

//         log2( '__setContext', [ context, offset ] );

//         this.contexts.push( {
//             context,
//             offset,
//             rawContext,
//             rawOffset
//         } );
//     }

//     _getWordOffset( oldOffset, oldContext, newContext ) {
//         log2( '_getWordOffset', arguments );
//         const index = newContext.indexOf( oldContext );

//         log2( '_getWordOffset', [ index, oldOffset + index ] );

//         return oldOffset + index;
//     }

//     __expandContextWithSiblingsAfter( node, context ) {
//         const nextSibling = node.nextSibling;

//         if ( !nextSibling ) {
//             return context;
//         }

//         context = context + this.__formatText( nextSibling.nodeValue || nextSibling.innerText, false );
//         this.__logContext( context );

//         if ( !this.__findSentenceDeviderMarkAfter( context ) ) {
//             return this.__expandContextWithSiblingsAfter( nextSibling, context );
//         }

//         return context;
//     }

//     // if selection phrase consists of several nodes
//     // we need to find all nodes and full context
//     __expandContextWithSiblingsBefore( selection, offset, focusNode, context ) {
//         log2( '__expandContextWithSiblingsBefore', arguments )
//         //         debugger
//         const siblingEl = focusNode.previousSibling;
//         const siblingContext = this.__formatText( siblingEl.nodeValue || siblingEl.innerText, false );
//         const siblingSelection = selection.slice( 0, offset );
//         const siblingOffset = siblingContext.lastIndexOf( siblingSelection );
//         const expandedContext = siblingContext + context;
//         this.__logContext( expandedContext );

//         if ( -1 !== siblingOffset ) {
//             return {
//                 context: expandedContext,
//                 offset: siblingOffset
//             }
//         }

//         return this.__expandContextWithSiblingsBefore(
//             siblingSelection,
//             siblingOffset,
//             siblingEl,
//             expandedContext
//         );
//     }

//     __getLastContext() {
//         return this.contexts.slice( -1 ).pop();
//     }

//     getPreviousContext() {
//         return this.contexts.slice( -2, -1 ).pop();
//     }

//     getSentence() {
//         this.__defineContext();

//         const context = this.__getLastContext();

//         if ( this.outputSentence === context.context ) {
//             return context.context;
//         }

//         if ( [ 'p', 'div' ].includes( this.node?.tagName?.toLowerCase() ) ) {
//             return context.context;
//         }


//         this.outputSentence = context.context;
//         this.outputIteration++;

//         log2( 'getSentence', [ this.outputIteration, context.context, this.node ] );

//         return this.getSentence();
//     }

//     __cutSentence( word, index, text ) {
//         log2( '__cutSentence', arguments );
//         const left = this.__cutBeforeSelection( text.slice( 0, index ) );
//         const right = this.__cutAfterSelection( text.slice( index + word.length ) );

//         text = `${left}${word}${right}`;

//         text = this.__formatText( text );

//         log2( '__cutSentence', [ left, right, text ] );

//         return {
//             context: text,
//             offset: left.length
//         };
//     }

//     __formatText( text, useTrim = true ) {
//         if ( useTrim ) {
//             text = text.trim();
//         }
//         return text
//             // remove new lines
//             .replace( /(\r\n|\n|\r)/gm, " " )
//             // remove tabs
//             .replace( "\t", ' ' )
//             // remove double+ spaces
//             .replace( /\s\s+/g, ' ' );
//     }

//     __findSentenceDeviderMarkAfter( context ) {
//         return this.sentenceDeviderMarks.some( ( mark ) => this.__isMarkAfterDevider( context, mark ) );
//     }

//     __isMarkAfterDevider( context, mark ) {
//         const index = context.lastIndexOf( mark );

//         if ( -1 === index ) {
//             return false;
//         }

//         const hasException = this.exceptions.some( ( exception ) => {
//             const testStr = context.slice( index + 1 - exception.length, index + 1 );

//             return testStr === exception;
//         } );

//         if ( hasException ) {
//             return false;
//         }

//         return true;
//     }

//     __cutBeforeSelection( text ) {
//         this.sentenceDeviderMarks.forEach( ( mark ) => {
//             const index = text.lastIndexOf( mark );

//             if ( -1 === index ) {
//                 return;
//             }

//             // TODO: think about how to detect exception in case 
//             // if the first letter is, forx ex., '.'
//             // somehow I have to know expanded context on max exception word length
//             // '. Andrew...' - I don't know this is 'Mr. Adrew...' or
//             // '.' means end of previous sentense
//             log2( '__cutBeforeSelection', [ text, index, text.slice( index + 1 ) ] );

//             text = text.slice( index + 1 );
//         } );

//         return text;
//     }

//     __cutAfterSelection( context ) {
//         return this.sentenceDeviderMarks.reduce( ( text, mark ) => {
//             if ( !this.__isMarkAfterDevider( text, mark ) ) {
//                 return text;
//             }

//             const index = text.indexOf( mark );

//             return text.slice( 0, index + 1 );

//         }, context );
//     }

//     getSelectionObject() {
//         return {
//             word: this.selection,
//             url: this.url,
//             selector: '',
//             context: this.__getLastContext()
//         }
//     }

// }

// window.selectionContext = SelectionContext;

function getSelectionContext() {
    return window.selectionContext;
}

window['setSelectionContext'] = function(val) {
    window.selectionContext = val;
}

console.log(window);


document.addEventListener( 'DOMNodeInserted', ( event ) => {
    const id = event.target.id;

    if ( 'gtx-host' !== id ) {
        return;
    }

    if ( !getSelectionContext()) {
        console.warning('SelectionContext hasn\'t defined yet');
        return;
    }

    const selection = window.getSelection();

    if ( selection.toString() !== engSelection?.toString() ) {
        engSelection = new getSelectionContext()( selection );
    }
} );

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

    if ( !getSelectionContext() ) {
        console.log( getSelectionContext())
        console.warning( 'SelectionContext hasn\'t defined yet' );
        return;
    }

    const selection = window.getSelection();

    myTimeout = setTimeout( () => {
        engSelection = new getSelectionContext()( selection );
        const sentence = engSelection.getSentence();
        const word = engSelection.getSelectionObject();

        saver.addWord( word.word, {
            context: word.context,
            url: word.url,
            selector: word.selector
        } );
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