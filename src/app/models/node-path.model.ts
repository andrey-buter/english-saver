import { NodeNumberInParent, ChildNodePath } from "./node-number-in-parent.model";

export interface NodePath {
	pathInParent: NodeNumberInParent[];
	cssParentSelector: string;
	offset?: number;
}

export interface NodePath2 {
	childrenNodesPaths: ChildNodePath[];
	cssParentSelector: string;
	offset?: number;
}
