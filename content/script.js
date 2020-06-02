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
const highlighter = new TextHighlighter(document.body);

window.engDebug = true;

const remoteDb = new FireBase();
const localDb = new LocalDb();
const saver = new DataSaver(localDb, remoteDb);

const list = new DomList();



saver.init()
    .then((words) => {
        if (saver.getWords().length) {
            saver.getWords().forEach((item) => {
                list.addItem(item.wordInContext);
            });
        }
    });


let myTimeout;

const showParentButton = createButton( 'Show parent text', ( event ) => {
    toast.context( engSelection.getParentContext() );
} );

const showPrevButton = createButton( 'Show parent text', ( event ) => {
    toast.context( engSelection.getParentContext() );
} );

const saveButton = createButton( 'Save and Close', ( event ) => {
    const word = engSelection.getSelectionObject().word;

    const wordObj = engSelection.getSelectionObject();

    if (!saver.hasWord(word)) {
        list.addItem(word);
    } else {
        highlighter.doHighlight();
    }


    saver.addItem({
        originWord: null,
        wordInContext: wordObj.word,
        translation: wordObj.translation,
        context: wordObj.context,
        contextOffset: wordObj.offset,
        contextSelector: wordObj.selector,
        uri: wordObj.url 
    });

    toast.hide();
} );

const toast = createToast(showParentButton, showPrevButton, saveButton);

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
        handleSelection(selection);
    }, 1000 );
} );

function handleSelection(selection) {
    engSelection = new SelectionContext( selection );
    // highlighter = new Highlighter( selection );

    // highlighter.doHighlight();
    
    const sentence = engSelection.getSentence();
    const word = engSelection.getSelectionObject().word;

    if ( saver.hasWord( word ) ) {
        list.highlightItem( word );
    }
    
    toast.context( sentence );
    toast.show();
}
