export function initDefault(ev){
    const metaUrl = import.meta.url;
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');
    if (param && param !== ev.detail.unique) return null;
    const root = ev.detail.root; // 커스텀 이벤트에 담겨진 shadowRoot 객체
    // 새도우돔은 font-face 가 작동하지 않아서 넣는다.
    const sheets = root.styleSheets;
    const style = sheets[sheets.length -1];
    let href = style.href;
    href = href.substring(0, href.indexOf('/study'));
    for(let i = 0; i < style.cssRules.length; i++){
        const rule = style.cssRules[i];
        if(rule.cssText && rule.cssText.indexOf("@font-face")>=0){
            const cssText = rule.cssText.replace("..", href);
            const st = document.createElement('style');
            st.appendChild(document.createTextNode(cssText));
            document
                .getElementsByTagName('head')[0]
                .appendChild(st);
        }
    }
    //실서버 뷰어 키보드 입력 막는 이슈 수정
    if (document.querySelector('kve-editor')) {
        let realRoot = document.querySelector('kve-editor').shadowRoot
        let secondRoot = realRoot.querySelector('kve-field').shadowRoot
        let realDiv = secondRoot.querySelectorAll("div.class-not-save")
        realDiv.forEach(div => div.remove());
    }
    // 드래그 스크롤 방지 -- 음... 정확히 뭔지 모르겠네
    document.querySelector("body").style.overflow = "hidden";
    document.querySelector("body").style.overscrollBehavior = "contain";
    // 전에 실서버 뷰어가 input 을 뺏어가서... 혹시나 해서 넣는다.
    root.querySelectorAll("input").forEach((element)=>{
        element.addEventListener('keydown', (event)=>{
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
    });
    return root;
}

export function dispatchEvent(root, args){
    args['root'] = root;
    const event = new CustomEvent('callToParent',
        {
            detail: {message: args},
            bubbles: true,
            composed: true // Allows the event to pass through shadow DOM boundaries
        }
    );
    root.dispatchEvent(event);
}