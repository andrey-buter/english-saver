class DataSaver {
	constructor() {
		this.cache = this._loadCache();
	}

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

	hasWord(word) {
		return this.cache.has(word);
	}

	getWords() {
		return this.cache;
	}

	getWord( word ) {
		return this.cache.get( word );
	}

	_setWord( word, data ) {
		this.cache.set( word, data );
		this._saveStorage();

		log2( 'SetWord', this.cache );
	}

	_saveStorage() {
		const object = Object.fromEntries(this.cache.entries());

		localStorage.setItem('english:words', JSON.stringify(object));
	}

	_loadCache() {
		const data = JSON.parse(localStorage.getItem('english:words'));

		if (!data) {
			return new Map();
		}

		let array = [];

		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				array.push([key, data[key]]);
			}
		}

		return new Map(array);
	}
}
