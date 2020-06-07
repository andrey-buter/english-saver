import './style.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';

document.addEventListener("DOMContentLoaded", () => {
	const div = document.createElement('div');
	div.id = 'root';
	document.body.appendChild(div);
	ReactDOM.render(<App />, div);
});