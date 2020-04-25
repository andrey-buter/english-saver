class FireBase {
	user;
	onAuthCallBack;

	constructor(onAuthCallBack) {
	}

	init(onAuthCallBack) {
		this.onAuthCallBack = onAuthCallBack;

		// Your web app's Firebase configuration
		var firebaseConfig = {
			apiKey: "AIzaSyCQ_4yQHE9RQsrtreYRNazDVEeXbTjplzg",
			authDomain: "english-words-367a1.firebaseapp.com",
			databaseURL: "https://english-words-367a1.firebaseio.com",
			projectId: "english-words-367a1",
			storageBucket: "english-words-367a1.appspot.com",
			messagingSenderId: "738119441981",
			appId: "1:738119441981:web:ffcc08f756a04a1de89454",
			measurementId: "G-XGM265DLSR"
		};
		// Initialize Firebase
		firebase.initializeApp(firebaseConfig);
		firebase.analytics();

		return this.onAuth();
	}
	async registerUser(email, password) {
		try {
			const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
			return user.user.uid;
		} catch (error) {
			console.log(error);
			
			return error;
		}
	}
	
	async signInUser(email, password) {
		try {
			const user = await firebase.auth().signInWithEmailAndPassword(email, password)
			return user.user.uid;
		} catch(error) {
			return error;
		}
	}

	onAuth() {
		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged(async (user) => {
				if (!user) {
					await this.signInUser('admin@admin.com', 'admin123');
					return;
				}
				// user is logged in https://youtu.be/DlXSA3_lSX4?t=2366
	
				this.user = user;
	
				const data = await db.loadAll();

				resolve(data);
	
				// await this.load(); // https://youtu.be/DlXSA3_lSX4?t=3478
			})
		})
	}

	async getItemById(id) {
		return await firebase.database().ref('/words/' + id).once('value').val();
	}

	async logOut() {
		try {
			firebase.auth().signOut();
		} catch (error) {
			throw error;
		}
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
		try {
			return await firebase.database().ref('words').push({
				userId: this.user.uid,
				originWord,
				wordInContext,
				translation,
				context,
				contextOffset,
				contextSelector,
				uri
			});
		} catch (error) {
			throw error;
		}
	}

	async editItem(id, {
		originWord,
		wordInContext,
		translation,
		context,
		contextOffset,
		contextSelector,
		uri
	}) {
		try {
			await firebase.database().ref('words').child(id).update({
				userId: this.user.uid,
				originWord,
				wordInContext,
				translation,
				context,
				contextOffset,
				contextSelector,
				uri
			});
			return true;
		} catch (error) {
			throw error;
		}
	}

	async removeItem(id, data) {
		try {
			await firebase.database().ref('words').child(id).remove();

			return true;
		} catch (error) {
			throw error;
		}
	}

	async loadAll() {
		try {
			const data = await firebase.database().ref('words').once('value')
			return data.val()
		} catch (error) {
			throw error;
		}
	}
	
}



// db.registerUser('admin@admin.com', 'admin123');
// db.signInUser('admin@admin.com', 'admin123');
// db.addItem()