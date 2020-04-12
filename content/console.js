var log = ( ...args ) => {
	if ( !window.engDebug ) {
		return;
	}
	console.log( ...args )
};

var log2 = ( funcName, object, ...args ) => {
	if ( !window.engDebug ) {
		return;
	}
	console.group( funcName );
	console.table( object );
	if ( args?.length ) {
		console.log( ...args );
	}
	console.groupEnd();
}

var assert = ( ...args ) => {
	if ( !window.angTest ) {
		return;
	}
	console.assert( ...args );
}

var group = {
	start: ( name ) => {
		if ( !window.engDebug ) {
			return;
		}
		console.group( name );
	},
	end: () => {
		if ( !window.engDebug ) {
			return;
		}
		console.groupEnd();
	}
}