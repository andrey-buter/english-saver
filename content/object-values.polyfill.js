// if (!Object.prototype.values) {
// 	Object.prototype.values = function() {
// 		return getObjectValues(this);
// 	}
// }

// firebase throw error on add Objsec.values polyfill
function getObjectValues(object) {
	let output = [];

	for (const key in object) {
		if (object.hasOwnProperty(key)) {
			output.push(object[key]);
		}
	}

	return output;
}