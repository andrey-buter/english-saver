import React, { Component } from "react";

import './SelectionToast.scss';

export class SelectionToast extends Component<{ toast: string | null, saveCloseToast: () => void, cancel: () => void}> {
	render() {
		const { toast, saveCloseToast, cancel } = this.props;

		return (
			<div className="eng-saver__toast">
				<div className="eng-saver__context">
					{toast}
				</div>
				<button type="button" onClick={saveCloseToast}>
					Save & Close
				</button>
				<button type="button" onClick={cancel}>
					Cancel
				</button>
			</div>
		);
	}
}
