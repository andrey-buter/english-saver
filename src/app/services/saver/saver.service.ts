import { FirebaseService } from "../firebase/firebase.service";
import { LocalDatabaseService } from "../local-db/local-db.service";
import { Word, RawWord } from "../../models/word.model";
import { Tag } from "../../models/tag.model";

export class DataSaverService {
	constructor(private localDb: LocalDatabaseService, private remoteDb: FirebaseService) {}

	public async init(): Promise<{ words: Word[], tags: Tag[] }> {
		const { words, tags } = await this.remoteDb.init();

		this.localDb.saveInitData(words);

		// TODO join local and remote db

		const wordsMapped =  Object.keys(words).map((id) => {
			return {
				id,
				...words[id],
			};
		});

		const tagsMapped = Object.keys(tags).map((id) => {
			const rawTag = tags[id];

			const tag = {
				id,
				text: rawTag.text,
			};

			return tag;
		});

		return {
			words: wordsMapped,
			tags: tagsMapped,
		}
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

	async addItem(rawWord: RawWord): Promise<Word> {
		const id = await this.remoteDb.addItem(rawWord);
		const word = { id, ...rawWord };

		this.localDb.addItem(id, word);

		return word;
	}

	async addTags(tags: string[]): Promise<string[]> {
		const ids: string[]= [];

		await tags.forEach(async (tag) => {
			const id: string = await this.remoteDb.addTag(tag);

			ids.push(id);
		});

		return ids;
	}

	// ? This is simple implementation
	// ? Need to remove highlighting
	// ? Need to update css paths if selections has the same parent and
	// ? selections locate in the same textNode in origin text
	async removeWord(wordId: string) {
		if (await this.remoteDb.removeItem(wordId)) {
			this.localDb.removeItem(wordId);
		}
	}

	getWords() {
		const data = this.localDb.getData();

		return Object.values(data);
	}
}
