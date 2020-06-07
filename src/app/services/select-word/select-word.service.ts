export class SelectWord {
	range: Range;

	constructor(selection: Selection) {
		this.range = selection.getRangeAt(0);
	}


}
