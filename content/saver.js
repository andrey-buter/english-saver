class DataSaver {
	constructor(localDb, remoteDb) {
		this.localDb = localDb;
		this.remoteDb = remoteDb;

		remoteDb.init()
			.then((remoteData) => {
				this.localDb.saveInitData(remoteData);

				return remoteData;
			});
	}

	onLoad() {

	}

	findRemoteAndLocalDiffs(localData, remoteData) {
		const remoteValues = getObjectValues(remoteData);
		const localValues = getObjectValues(localData);

		const remoteDiff = [...remoteValues];
		const localDiff = localValues.filter((local) => {
			const key = remoteDiff.indexOf(local);

			if (-1 === key) {
				return true;
			}

			remoteDiff.splice(key, 1);
			
			return false;
		});

		return {remoteDiff, localDiff};
	}

	hasWord(word) {
		return this.localDb.hasWord(word);
	}

	async addItem({
		originWord,
		wordInContext,
		translation,
		context,
		contextOffset,
		contextSelector,
		uri
	}) {
		const word = await this.remoteDb.addItem({
			originWord,
			wordInContext,
			translation,
			context,
			contextOffset,
			contextSelector,
			uri
		});

		this.localDb.addItem(word.key, {
			originWord,
			wordInContext,
			translation,
			context,
			contextOffset,
			contextSelector,
			uri
		});
	}

	getWords() {
		const data = this.localDb._getData();

		return getObjectValues(data);
	}
}
