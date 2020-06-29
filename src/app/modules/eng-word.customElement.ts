import { LocalDatabaseService } from "../services/local-db/local-db.service";

export class EngWordElement extends HTMLElement {
	private translation: HTMLSpanElement | undefined;

	private showTranslation = (event: MouseEvent) => {
		this.removeTranslation();

		const db = new LocalDatabaseService();

		const word = db.getWordById(this.id);

		if (!word) {
			alert('There is not word in DB');
			return;
		}

		const span = document.createElement('span');
		span.textContent = word.translation;
		span.classList.add('eng-word__tooltip-translation');

		this.translation = span;

		this.appendChild(span);
	}

	private removeTranslation = () => {
		// this.translation && this.removeChild(this.translation);
		this.translation?.remove();
	}

	render() { // (1)
		const span = document.createElement('span');
		span.style.backgroundColor = '#ff9632';
		span.innerHTML = this.innerHTML;
		this.innerHTML = '';

		this.appendChild(span);

		this.addEventListener('mouseover', this.showTranslation);
		this.addEventListener('mouseleave', this.removeTranslation);
	}

	disconnectedCallback() {
		this.removeEventListener('mouseover', this.showTranslation);
		this.removeEventListener('mouseleave', this.removeTranslation);
	}

	connectedCallback() { // (2)
		// debugger
		// if (!this.rendered) {
		this.render();
		// 	this.rendered = true;
		// }
	}

	// static get observedAttributes() { // (3)
	// 	return ['uid'];
	// }

	// attributeChangedCallback(name, oldValue, newValue) { // (4)
	// 	this.render();
	// }
}
