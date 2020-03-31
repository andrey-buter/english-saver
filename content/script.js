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

var log2 = (funcName, object, ...args) => {
    if ( !window.engDebug ) {
        return;
    }
    console.group(funcName);
    console.table(object);
    if ( args?.length ) {
        console.log(...args);
    }
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

        log2( 'SetWord', this.cache );
    }
}

var saver = new DataSaver();

document.addEventListener( 'DOMNodeInserted', ( event ) => {
    const id = event.target.id;

    if ( 'gtx-host' !== id ) {
        return;
    }

    const selection = window.getSelection();

    if ( selection.toString() !== engSelection?.toString() ) {
        engSelection = new SelectionContext( selection );
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

    const selection = window.getSelection();

    myTimeout = setTimeout( () => {
        engSelection = new SelectionContext( selection );
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