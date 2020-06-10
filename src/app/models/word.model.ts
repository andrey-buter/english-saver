import { NodePath } from "./node-path.model";

export interface Word {
	id?: string;
	selection: string;
	originWord: string;
	context: string;
	startRange: NodePath;
	endRange: NodePath;
	translation: string;
	uri: string;
}
