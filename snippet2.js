var log = ( ...args ) => {
    if ( !window.engDebug ) {
        return;
    }
    console.log( ...args )
};

class SelectionContext {
    excludes = ['Mr.', 'Mrs.'];
    constructor( selection ) {
        log( selection )
        this.focusOffset = selection.focusOffset;
        this.baseOffset = selection.baseOffset;
        this.focusNode = selection.focusNode;
        this.selection = this._formatSelection( selection.toString() );
        this.url = selection.baseNode.baseURI;
    }

    _inSingleNode() {

    }

    _hasRightNode() {

    }

    _hasLeftNode() {

    }

    _getLeftNode() {

    }

    _getRightNode() {

    }
}