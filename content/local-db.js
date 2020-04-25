class LocalDb {
	storageKey = 'english:words';

	savedWords = [];

	constructor() {
	}

	getInitData() {
		const data = this._getData();

		getObjectValues(data).forEach((word) => {
			this.savedWords.push(word.wordInContext);
		});

		return data;
	}

	saveInitData(data) {
		getObjectValues(data).forEach((word) => {
			if (this.savedWords.includes(word)) {
				return;
			}

			this.savedWords.push(word.wordInContext);
		});

		this._saveData(data);
	}

	addItem(id, {
		originWord,
		wordInContext,
		translation,
		context,
		contextOffset,
		contextSelector,
		uri
	}) {
		const data = this._getData();

		data[id] = {
			originWord,
			wordInContext,
			translation,
			context,
			contextOffset,
			contextSelector,
			uri
		};

		this._saveData(data);
	}

	

	_saveData(data) {
		this.savedWords.push(data.wordInContext);

		localStorage.setItem(this.storageKey, JSON.stringify(data));
	}

	_getData() {
		const data = JSON.parse(localStorage.getItem(this.storageKey));

		return data || {};
	}

	hasWord(word) {
		return this.savedWords.includes(word);
	}

	// addWord(word, {context, offset, url, selector}, isLoaded = false) {
	// 	let data = this.getWord(word);

	// 	if (!data)
	// 	{
	// 		data = {
	// 			word,
	// 			contexts: [],
	// 			isLoaded
	// 		}
	// 	}

	// 	data.contexts.push({
	// 		context,
	// 		offset,
	// 		url,
	// 		selector,
	// 	})

	// 	this._setWord(word, data);
	// }

	// updateWordStatus( word, isLoaded ) {
	// 	const data = this.getWord( word );

	// 	data.isLoaded = isLoaded;

	// 	this._setWord( word, data );
	// }

	// hasWord(word) {
	// 	return this.cache.has(word);
	// }

	// getWords() {
	// 	return this.cache;
	// }

	// getWord( word ) {
	// 	return this.cache.get( word );
	// }

	// _setWord( word, data ) {
	// 	this.cache.set( word, data );
	// 	this._saveStorage();

	// 	log2( 'SetWord', this.cache );
	// }

	// _saveStorage() {
	// 	const object = Object.fromEntries(this.cache.entries());

	// 	localStorage.setItem('english:words', JSON.stringify(object));
	// }

	// _loadCache() {
	// 	const data = JSON.parse(localStorage.getItem('english:words'));

	// 	if (!data) {
	// 		return new Map();
	// 	}

	// 	let array = [];

	// 	for (const key in data) {
	// 		if (data.hasOwnProperty(key)) {
	// 			array.push([key, data[key]]);
	// 		}
	// 	}

	// 	return new Map(array);
	// }
}
