export const log = (...data: any[]) => {
	// @ts-ignore
	if (window['engLog']) {
		console.log(...data);
	}
}
