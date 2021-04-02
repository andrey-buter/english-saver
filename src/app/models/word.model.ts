import { NodePath } from "./node-path.model";

export interface RawWord {
	selection: string;
	originWord: string;
	context: string;
	startRange: NodePath;
	endRange: NodePath;
	translation: string;
	uri: string;
	addedTimestamp: number;
}

export interface Word extends RawWord {
	id: string;
}
