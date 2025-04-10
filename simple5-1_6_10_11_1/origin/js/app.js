import anime from "./anime.js";
import {
    createTabRule,
    focus,
    setAriaLabel,
    defineTab,
    setFocusToFullButton
} from "./tab.js";

const metaUrl = import.meta.url;
let root;
let scale = 1;  // 화면 스케일링 값
let isAnimating = false;

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen || document.msRequestFullscreen;
        setAriaLabel('.btn-fullscreen', '전체 화면 켜져있는 상태입니다');
        requestFullScreen.call(root.firstElementChild);
    } else {
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        setAriaLabel('.btn-fullscreen', '전체 화면 꺼져있는 상태입니다');
        cancelFullScreen.call(document);
    }
}

const onClickRefresh = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setScaffoldingText(1);
}

export const checkIpad = (root) => {
    const result = [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    if (result) {
        root.querySelector('.btn-fullscreen').classList.add('hide');
        return true;
    }
    return false;
}

const setScaffoldingText = (type, setFocus = false) => {
    const text = type === 1
        ? '<div aria-hidden="true" style="display: flex">똑같은 사다리꼴&nbsp;<div class="batang">2</div>개에서 길이가 같은 변을 클릭하세요.'
        : '<div aria-hidden="true">마름모를 잘라 만든 직사각형의 넓이를 구해 보세요.</div>';
    const ariaLabel = type === 1
        ? '똑같은 사다리꼴 두개에서 길이가 같은 변을 클릭하세요'
        : '마름모를 잘라 만든 직사각형의 넓이를 구해 보세요';
    const contentDiv = root.querySelector('.scaffolding-content');
    contentDiv.innerHTML = text;
    if (type === 1) {
        contentDiv.classList.add('explain');
        contentDiv.classList.remove('complete');
    } else {
        contentDiv.classList.add('complete');
        contentDiv.classList.remove('explain');
    }
    setAriaLabel(contentDiv, ariaLabel);
    if (setFocus) {
        setTimeout(() => {
            contentDiv.focus();
        }, 10)
    }
}

//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화
//_____________________________________________________________________________________________________________________
const init = (env) => {
    // 새도우돔은 font-face 가 작동하지 않아서 넣는다.
    const sheets = root.styleSheets;
    const style = sheets[sheets.length - 1];
    let href = style.href;
    href = href.substring(0, href.indexOf('/css'));
    for (let i = 0; i < style.cssRules.length; i++) {
        const rule = style.cssRules[i];
        if (rule.cssText && rule.cssText.indexOf("@font-face") >= 0) {
            const cssText = rule.cssText.replace("..", href);
            const st = document.createElement('style');
            st.appendChild(document.createTextNode(cssText));
            document
                .getElementsByTagName('head')[0]
                .appendChild(st);
        }
    }
    const _autoScale = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        const viewWarp = root.querySelector('.view-wrap');
        const wrap = root.querySelector('.wrap');
        const targetWidth = 1920;
        const targetHeight = 1020;
        wrap.style.minWidth = targetWidth + "px";
        wrap.style.minHeight = targetHeight + "px";
        const calculatedScaleWidth = viewWarp.offsetWidth / targetWidth * 100;
        const calculatedScaleHeight = viewWarp.offsetHeight / targetHeight * 100;
        scale = calculatedScaleWidth < calculatedScaleHeight ? calculatedScaleWidth : calculatedScaleHeight;
        wrap.style.transform = "scale(" + scale + "%)";
        // fullscreen 에서 esc 누르는 것 때문에 사용한다.
        if (!document.fullscreenElement) {
            const btn = root.querySelector(".btn-fullscreen");
            btn.classList.remove('off');
        } else {
            const btn = root.querySelector(".btn-fullscreen");
            btn.classList.add('off');
        }
    };
    window.addEventListener("resize", _autoScale);
    _autoScale();
    // 삼성 브라우져 때문에 넣는다.
    setTimeout(() => {
        _autoScale();
    }, 1);
    // 자판 만들기, 이거 활성화하면 checkbox 와 충돌한다. 피할려면 click 이벤트에서 window 로 이벤트 안가게 잡아준다.
    //qwerty.init(root, '.modal_qwerty');

    root.querySelector(".btn-fullscreen").addEventListener('click', toggleFullScreen);
    root.querySelector(".btn-refresh").addEventListener('click', onClickRefresh);
    const startDim = root.querySelector('.start-dim');
    startDim.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('hide');
        setFocusToFullButton();
    })

    startDim.addEventListener('keydown', (event) => {
        // Enter 는 nvda+space 를 눌러서 포커스모드로 바꿔야 한다.
        if (event.key === 'Tab' || event.key === 'Enter') {
            if (!root.querySelector('.start-dim').classList.contains('hide')) {
                event.preventDefault();
                event.stopPropagation();
                root.querySelector('.start-dim').classList.add('hide');
                setFocusToFullButton();
            }
        }
    })

}

window.addEventListener("script-loaded", (env) => {
    if (root) return;
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');
    if (param && param !== env.detail.unique) return;
    root = env.detail.root;
    checkIpad(root);
    //createTabRule(root); // 주의: init 보다 앞에 있어야 한다.
    init(env);
    //root.querySelector('.start-dim').focus();
});
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화 끝
//______________________________________________________________________________________________________________________








