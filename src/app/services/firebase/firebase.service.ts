import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/analytics';
import { RawWordsDatabase } from '../../models/words-database.model';
import { Word, RawWord } from '../../models/word.model';

export class FirebaseService {
	readonly #options = {
		apiKey: "AIzaSyCQ_4yQHE9RQsrtreYRNazDVEeXbTjplzg",
		authDomain: "english-words-367a1.firebaseapp.com",
		databaseURL: "https://english-words-367a1.firebaseio.com",
		projectId: "english-words-367a1",
		storageBucket: "english-words-367a1.appspot.com",
		messagingSenderId: "738119441981",
		appId: "1:738119441981:web:ffcc08f756a04a1de89454",
		measurementId: "G-XGM265DLSR"
	};

	user: firebase.User | undefined | null;
	// onAuthCallBack;

	async init() {
	// init(onAuthCallBack) {
		// this.onAuthCallBack = onAuthCallBack;

		console.log(firebase.initializeApp(this.#options));
		console.log(firebase.analytics());

		return await this.onAuth();
	}

	async registerUser(email: string, password: string): Promise<string> {
		try {
			const user = await firebase.auth().createUserWithEmailAndPassword(email, password);

			if (!user.user?.uid) {
				throw new Error("[FirebaseService.registerUser] user.user.uid doesn't exist");
			}

			return user.user.uid;
		} catch (error) {
			console.log(error);

			return error;
		}
	}

	async signInUser(email: string, password: string): Promise<firebase.User> {
		try {
			const user = await firebase.auth().signInWithEmailAndPassword(email, password);

			if (!user.user?.uid) {
				throw new Error('[FirebaseService.signInUser] user.user.uid doesn\'t exist');
			}

			return user.user;
		} catch (error) {
			return error;
		}
	}

	private onAuth(): Promise<RawWordsDatabase> {
		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged(async (user) => {
				if (!user) {
					user = await this.signInUser('admin@admin.com', 'admin123');
				}
				// user is logged in https://youtu.be/DlXSA3_lSX4?t=2366

				this.user = user;

				const data = await this.loadAll();

				// debugger

				resolve(data);

				// await this.load(); // https://youtu.be/DlXSA3_lSX4?t=3478
			})
		})
	}

	// async getItemById(id: string) {
	// 	return await firebase.database().ref('/words/' + id).once('value').val();
	// }

	async logOut() {
		try {
			firebase.auth().signOut();
		} catch (error) {
			throw error;
		}
	}

	async addItem(item: RawWord): Promise<string> {
		if (!this.user?.uid) {
			throw new Error('[FirebaseService.addItem] user.uid is undefined');
		}
		try {
			const response = await firebase.database().ref('words').push({
				userId: this.user.uid,
				...item
			});

			if (!response.key) {
				throw new Error('[FirebaseService.addItem] response.key is undefined');
			}

			return response.key;
		} catch (error) {
			throw error;
		}
	}

	async editItem(id: string, item: Word) {
		if (!this.user?.uid) {
			throw new Error('[FirebaseService] user.uid is undefined');
		}
		try {
			await firebase.database().ref('words').child(id).update({
				userId: this.user.uid,
				...item
			});
			return true;
		} catch (error) {
			throw error;
		}
	}

	async removeItem(id: string) {
		try {
			await firebase.database().ref('words').child(id).remove();

			return true;
		} catch (error) {
			throw error;
		}
	}

	private async loadAll(): Promise<RawWordsDatabase> {
		try {
			let data = await firebase.database().ref('words').once('value');
			data = data.val();

			return new Promise(async (resolve) => {
				await firebase.database()
					.ref('words')
					.orderByChild('uri')
					.equalTo(window.location.href)
					.once('value', function (dataSnapshot) {
						resolve(dataSnapshot.val() || {});
					});
			});

			// let data2 = await firebase.database()
			// 	.ref('words')
			// 	.orderByChild('uri')
			// 	.equalTo(window.location.href)
			// 	.once('value', function (dataSnapshot) {
			// 		dataSnapshot.val()
			// 	});
			// debugger
			// return data.val()
		} catch (error) {
			throw error;
		}
	}
}
