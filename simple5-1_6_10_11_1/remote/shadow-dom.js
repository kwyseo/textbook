class RemoteHTMLEmbed extends HTMLElement {
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
			const htmlUrl = new URL(this.getAttribute('html-url'), document.location.href).href;
			const dom = await (async () => {
				const res = await fetch(htmlUrl);
				const html = await res.text();
				const parser = new DOMParser();
				return parser.parseFromString(html, 'text/html');
			})();
			
			const content = dom.querySelector('template').content;
			const wrap = content.querySelector('div');
			this.shadowRoot?.appendChild(wrap);

			const imgs = wrap.querySelectorAll('img');
			imgs.forEach(img => {
				const href = new URL(img.getAttribute('src') ?? '', htmlUrl).href;
				img.setAttribute('src', href);
			});
			const videos = wrap.querySelectorAll('video');
			videos.forEach(video => {
				const href = new URL(video.getAttribute('src') ?? '', htmlUrl).href;
				video.setAttribute('src', href);
			});
			const audios = wrap.querySelectorAll('audio');
			audios.forEach(audio => {
				const href = new URL(audio.getAttribute('src') ?? '', htmlUrl).href;
				audio.setAttribute('src', href);
			});

			// 새로 추가되는 이미지, 오디오, 비디오 요소 src 속성 수정
			const observer = new MutationObserver((mutations) => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach((n, idx) => {
						if(
							n instanceof HTMLAudioElement || 
							n instanceof HTMLVideoElement || 
							n instanceof HTMLImageElement
						) {
							const href = new URL(n.getAttribute('src') ?? '', htmlUrl).href;
							n.setAttribute('src', href);							
						}
					});
				});
			});
			observer.observe(wrap, {
				childList: true,
				subtree: true,
			});	
	

			const links = content.querySelectorAll('link');
			const linkLen = links.length;
			for(let i = 0; i < linkLen; i++) {
				const link = links[i];
				link.href = new URL(link.getAttribute('href') ?? '', htmlUrl).href;
				this.shadowRoot?.appendChild(link);
			}

			/*
			links.forEach(link => {
				const href = new URL(link.getAttribute('href') ?? '', htmlUrl).href;
				link.setAttribute('href', href);
				this.shadowRoot?.appendChild(link);
			});
			*/

			const scripts = content.querySelectorAll('script');
			const scriptLen = scripts.length;
			for(let i = 0; i < scriptLen; i++) {
				await this.loadScript(scripts[i], htmlUrl);
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

			// console.log('dom.querySelector', window.document.querySelector('body'));
			
			// scriptEl.setAttribute('type', 'module');
			scriptEl.innerHTML = script.innerHTML;
			this.shadowRoot?.appendChild(scriptEl);
			if(scriptSrc) {
				scriptEl.addEventListener("load", () => resovle());
				scriptEl.addEventListener("error", () => reject());
			}else resovle();
		});
	}
}
customElements.define('remote-html-embed', RemoteHTMLEmbed);