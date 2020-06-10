import { NodePath } from "./node-path.model";

export interface WordData {
	selection: string;
	context: string;
	startRange: NodePath;
	endRange: NodePath;
	translation: string;
	uri: string;
}
