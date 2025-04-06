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
let scissorsPosition = 0;
let isScissorsMoving = false;
const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen || document.msRequestFullscreen;
        setAriaLabel('.btn-fullscreen', '전체 화면 켜져있는 상태입니다');
        requestFullScreen.call(root.firstElementChild);
    }else{
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        setAriaLabel('.btn-fullscreen', '전체 화면 꺼져있는 상태입니다');
        cancelFullScreen.call(document);
    }
}

const onClickRefresh = (event, button, index) => {
    event.preventDefault();
    event.stopPropagation();

    stopScaffolding();
}

const stopScaffolding = (event) => {
    if(event && event.target.classList.contains("btn-refresh")){
        return;
    }
    const scaffolding = root.querySelector(".scaffolding");
    scaffolding.classList.add('hide');
}

// 처음 시작할 때 나오는 안내 문구
const startScaffolding = () => {
    const scaffolding = root.querySelector(".scaffolding");
    scaffolding.classList.remove('hide'); // parallelogram-box
}


const moveBackDiagram = (left, moveLeft, right, moveRight) => {
    const animation = anime.timeline({complete:()=>{

        }});
    animation.add({
            targets: left,
            translateX: -10,
            duration: 1000,
            easing:"easeInOutQuad"
        }
    ).add({
            targets: left,
            translateX: moveLeft,
            duration: 2000,
            easing:"easeInOutQuad"
        }
    );
    const animation2 = anime.timeline({complete:()=>{

        }});
    animation2.add({
            targets: right,
            translateX: 10,
            duration: 1000,
            easing:"easeInOutQuad"
        }
    ).add({
            targets: right,
            translateX: moveRight,
            duration: 2000,
            easing:"easeInOutQuad",
            complete:()=>{
                startScaffolding();
                isScissorsMoving = false;
            }
        }
    );
}

const animate = (target, distanceX, degree, distanceY = 0) => {
    // Anime.js 애니메이션 코드
    anime({
        targets: target,
        translateX: distanceX,
        translateY: distanceY,
        rotate: degree,
        duration: 2000,
        easing: 'easeInOutQuad'
    });
}

const moveTriangles = (isBlueLine, lineIndex) => {
    const className = isBlueLine?'triangle-blue':'triangle-pink';
    const triangles = root.querySelectorAll(`.${className}`);
    if(isBlueLine){
        if(lineIndex === 0){
            animate(triangles[0], 270, 180);
            animate(triangles[1], -270, 0);
        }
        else if(lineIndex === 1){
            animate(triangles[0], 189, 0);
            animate(triangles[1], -189, 180);
        }
        else if(lineIndex === 2){
            animate(triangles[0], 335, -149, 110);
            animate(triangles[1], -335, 31, -105);
        }
    }else{
        if(lineIndex === 0){
            animate(triangles[0], 378, 180, -5);
            animate(triangles[1], -378, 0);
        }
        else if(lineIndex === 1){
            animate(triangles[0], 209, 0);
            animate(triangles[1], -209, 180);
        }
        else if(lineIndex === 2){
            animate(triangles[0], 213, -157, 66);
            animate(triangles[1], -213, 23, -66);
        }
    }
}

const onClickLine = (event, lineElement, lineIndex) => {
    const isBlueLine = lineIndex < 6;
    // 클릭한 것을 똑 클릭하면 지운다.
    if(lineElement.classList.contains('clicked')){
        lineElement.classList.remove('clicked');
        return;
    }
    const clickIndex = lineIndex % 6;
    const symmetryIndex = clickIndex < 3 ? clickIndex + 3: clickIndex -3;
    // 먼저 클릭한 것이 있고, 있다면 그것과 일치하는지 확인한다.
    const drawBox = lineElement.parentElement.parentElement;
    const testLines = [...drawBox.querySelectorAll(`.${clickIndex < 3 ? 'second':'first'} .click-line`)];
    let correctSelect = false;
    for(let i = 0; i < testLines.length; i++){
        if(testLines[i].classList.contains('clicked')){
            if(i!==clickIndex && i!==symmetryIndex){
                // todo: 일단 아무것도 안한다. 나중에 팝업을 해준다.
                return;
            }else{
                correctSelect = true;
            }
        }
    }
    lineElement.classList.add('clicked');
    if(correctSelect){
        moveTriangles(isBlueLine, clickIndex < symmetryIndex ? clickIndex: symmetryIndex);
    }
}



const sleep = (ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms));
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
    if(result) {
        root.querySelector('.btn-fullscreen').classList.add('hide');
        return true;
    }
    return false;
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
        const body = root.querySelector('body');
        const viewWarp = root.querySelector('.view-wrap');
        const wrap = root.querySelector('.wrap');
        const targetWidth = 1920;
        const targetHeight = 1020;
        wrap.style.minWidth = targetWidth + "px";
        wrap.style.minHeight = targetHeight + "px";
        const calculatedScaleWidth = viewWarp.offsetWidth / targetWidth * 100;
        const calculatedScaleHeight = viewWarp.offsetHeight / targetHeight * 100;
        scale = calculatedScaleWidth < calculatedScaleHeight ? calculatedScaleWidth: calculatedScaleHeight;
        wrap.style.transform = "scale(" + scale + "%)";
        // fullscreen 에서 esc 누르는 것 때문에 사용한다.
        if (!document.fullscreenElement) {
            const btn = root.querySelector(".btn-fullscreen");
            btn.classList.remove('off');
        }else{
            const btn = root.querySelector(".btn-fullscreen");
            btn.classList.add('off');
        }
    };
    window.addEventListener("resize", _autoScale);
    _autoScale();
    // 자판 만들기, 이거 활성화하면 checkbox 와 충돌한다. 피할려면 click 이벤트에서 window 로 이벤트 안가게 잡아준다.
    //qwerty.init(root, '.modal_qwerty');

    root.querySelector(".btn-fullscreen").addEventListener('click', toggleFullScreen);
    root.querySelectorAll(".btn-refresh").forEach((button, index)=>{
        button.addEventListener('click', (event)=>{onClickRefresh(event, button, index)});
    });
    //document.addEventListener('click', stopScaffolding);
    root.querySelector('.start-dim').addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('hide');
        setFocusToFullButton();
    })
    root.querySelectorAll('.click-line').forEach((line, index)=>{
        line.addEventListener('click', (event)=>{
            onClickLine(event, line, index);
        })
    })
}

window.addEventListener("script-loaded",(env)=>{
    if(root) return;
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');
    if(param && param !== env.detail.unique) return;
    root = env.detail.root;
    checkIpad(root);
    //createTabRule(root); // 주의: init 보다 앞에 있어야 한다.
    init(env);
    //root.querySelector('.start-dim').focus();
});
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화 끝
//______________________________________________________________________________________________________________________








