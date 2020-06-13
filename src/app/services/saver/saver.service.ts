import { FirebaseService } from "../firebase/firebase.service";
import { LocalDatabaseService } from "../local-db/local-db.service";
import { Word } from "../../models/word.model";

export class DataSaverService {
	constructor(private localDb: LocalDatabaseService, private remoteDb: FirebaseService) {}

	public async init(): Promise<Word[]> {
		const words = await this.remoteDb.init();

		this.localDb.saveInitData(words);

		// TODO join local and remote db

		return Object.keys(words).map((id) => {
			return {
				id,
				...words[id],
			};
		});
	}

	// findRemoteAndLocalDiffs(localData, remoteData) {
	// 	const remoteValues = Object.values(remoteData);
	// 	const localValues = Object.values(localData);

	// 	const remoteDiff = [...remoteValues];
	// 	const localDiff = localValues.filter((local) => {
	// 		const key = remoteDiff.indexOf(local);

	// 		if (-1 === key) {
	// 			return true;
	// 		}

	// 		remoteDiff.splice(key, 1);

	// 		return false;
	// 	});

	// 	return { remoteDiff, localDiff };
	// }

	public hasWord(word: string) {
		return this.localDb.hasWord(word);
	}

	async addItem(word: Word) {
		const id = await this.remoteDb.addItem(word);

		this.localDb.addItem(id, word);

		return id;
	}

	getWords() {
		const data = this.localDb.getData();

		return Object.values(data);
	}
}
