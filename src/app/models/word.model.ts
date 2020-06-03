export interface Word {
	id?: string;
	originWord: string;
	wordInContext: string;
	translation: string;
	context: {
		context: string;
		offset: number;
		rawContext: string;
		rawOffset: number;
	};
	contextOffset: string;
	contextSelector: string;
	uri: string;
}
