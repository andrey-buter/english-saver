import { ChildNodePath } from "./node-number-in-parent.model";

export interface NodePath {
	childrenNodesPaths: ChildNodePath[];
	cssParentSelector: string;
	offset?: number;
}
