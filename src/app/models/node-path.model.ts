import { NodeNumberInParent } from "./node-number-in-parent.model";

export interface NodePath {
	pathInParent: NodeNumberInParent[];
	cssParentSelector: string;
	offset?: number;
}
