import './style.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { EngWordElement } from './app/modules/eng-word.customElement';

document.addEventListener("DOMContentLoaded", () => {
	const div = document.createElement('div');
	div.id = 'root';
	document.body.appendChild(div);
	ReactDOM.render(<App />, div);
});

customElements.define('eng-word', EngWordElement);
