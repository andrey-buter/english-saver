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


let engSelection;

window.engDebug = true;

const saveButton = createButton( 'Save and Close', ( event ) => {
    const word = engSelection.getSelectionObject().word;

    const wordObj = engSelection.getSelectionObject();

    if (!saver.hasWord(word)) {
        list.addItem(word);
    }

    saver.addWord( wordObj.word, {
        context: wordObj.context,
        url: wordObj.url,
        selector: wordObj.selector
    } );

    toast.hide();
} );

const showParentButton = createButton( 'Show parent text', ( event ) => {
    toast.context( engSelection.getParentContext() );
} );

const showPrevButton = createButton( 'Show parent text', ( event ) => {
    toast.context( engSelection.getParentContext() );
} );

const toast = createToast( showParentButton, showPrevButton, saveButton );

const saver = new DataSaver();
const list = new DomList();

if (saver.getWords().size) {
    saver.getWords().forEach((item) => {
        list.addItem(item.word);
    });
}

let myTimeout;

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
        const word = engSelection.getSelectionObject().word;

        if ( saver.hasWord( word ) ) {
            list.highlightItem( word );
        }
        
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
