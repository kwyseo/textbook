const importMetaUrl = import.meta.url;

class ShadowComponent extends HTMLElement {
	_uniq = '';
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open', });
	}

	handleScriptsLoaded() {
		window.dispatchEvent(new CustomEvent('script-loaded', {detail: {root: this.shadowRoot, unique: this._uniq}}));
	}

	connectedCallback() {		
		
		(async () => {
			this._uniq = Date.now() + '';
			const dom = document;
			const content = dom.querySelector('template').content;
			const wrap = content.querySelector('div');
			this.shadowRoot?.appendChild(wrap);

		
			const links = content.querySelectorAll('link');
			links.forEach(link => {
				this.shadowRoot?.appendChild(link);
			});

			const scripts = content.querySelectorAll('script');
			const scriptLen = scripts.length;
			for(let i = 0; i < scriptLen; i++) {
				await this.loadScript(scripts[i], document.location.href);
			}
			this.handleScriptsLoaded();
		})();
	}

	
	loadScript(script, htmlUrl) {
		return new Promise((resovle, reject) => {
			const isModule = script.type === 'module';
			const scriptEl = document.createElement("script");
			let scriptSrc;
			[...script.attributes].forEach(attr => {
				if(attr.name?.toLowerCase() === 'src') {
					scriptSrc = script.getAttribute('src');
					if(scriptSrc) {
						if(htmlUrl) {
							const url = new URL(scriptSrc, htmlUrl);
							if(isModule) url.searchParams.append('embed-unique', this._uniq);
							scriptSrc = url.href;
						}
						scriptEl.setAttribute('src', scriptSrc);
					}
				}else scriptEl.setAttribute(attr.name, attr.value);
			});
			scriptEl.innerHTML = script.innerHTML;
			this.shadowRoot?.appendChild(scriptEl);
			if(scriptSrc) {
				scriptEl.addEventListener("load", resovle);
				scriptEl.addEventListener("error", reject);
			}else resovle();
		});
	}
}
customElements.define("shadow-component", ShadowComponent);