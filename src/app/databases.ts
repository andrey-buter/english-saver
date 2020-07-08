import { DataSaverService } from "./services/saver/saver.service";
import { LocalDatabaseService } from "./services/local-db/local-db.service";
import { FirebaseService } from "./services/firebase/firebase.service";

const remoteDb = new FirebaseService();
const localDb = new LocalDatabaseService();
const saver = new DataSaverService(localDb, remoteDb);

export {
	saver
}
