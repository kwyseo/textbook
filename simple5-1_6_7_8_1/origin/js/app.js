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
    const section = button.parentElement.parentElement;
    //root.querySelector('.menu .intro').classList.remove('hide');
    section.querySelectorAll('.triangle').forEach((triangle)=>{
        if(index===0)
            addBlueLineCss(triangle)
        else
            addPinkLineCss(triangle);
        triangle.querySelectorAll('.click-line').forEach((line, index)=>{
            line.classList.remove('clicked');
            const isFirstTriangle = (index % 6) < 3;
            const lineIndex = index % 3;
            let ariaLabel = isFirstTriangle?'첫번째 삼각형의 ':'두번째 삼각형의 ';
            ariaLabel += lineIndex===0?'첫번째 ':lineIndex===1?'두번째 ':'세번째 ';
            ariaLabel += '변';
            setAriaLabel(line, ariaLabel);
        })
        triangle.style.transform = null;
    })
    stopScaffolding();
    //onFocusLine();
}

const stopScaffolding = (event) => {
    if(event && event.target.classList.contains("btn-refresh")){
        return;
    }
    const scaffolding = root.querySelector(".scaffolding");
    scaffolding.classList.add('hide');
}

// 처음 시작할 때 나오는 안내 문구
const startScaffolding = (options) => {
    const scaffolding = root.querySelector(".scaffolding");
    scaffolding.classList.remove('hide'); // parallelogram-box
    const content = scaffolding.querySelector('.scaffolding-content');
    content.focus();
    if(options){
        if(options.dismissTime)
            setTimeout(()=>{
                if(options.focusElement){
                    if (root.activeElement === content) {
                        options.focusElement.focus()
                    }
                }
                stopScaffolding();
            }, options.dismissTime)
    }
}

const animate = (target, distanceX, degree, distanceY = 0, moveFocus = null) => {
    // Anime.js 애니메이션 코드
    target.style.zIndex = '1';
    anime({
        targets: target,
        translateX: distanceX,
        translateY: distanceY,
        rotate: degree,
        duration: 2000,
        easing: 'easeInOutQuad',
        complete: ()=>{
            target.style.zIndex = '0';
            if(moveFocus)
                moveFocus.focus();
        }
    });
}
const addBlueLineCss = (target, className = '') =>{
    if(className)
        target.classList.add(className);
    const blueClassNames = ['triangle-blue2','triangle-blue3','triangle-blue4','triangle-blue5','triangle-blue6']
    blueClassNames.forEach((name)=>{
        if(name!==className)
            target.classList.remove(name);
    })
}

const addPinkLineCss = (target, className = '') =>{
    if(className)
        target.classList.add(className);
    const blueClassNames = ['triangle-pink2','triangle-pink3','triangle-pink4','triangle-pink5','triangle-pink6']
    blueClassNames.forEach((name)=>{
        if(name!==className)
            target.classList.remove(name);
    })
}

const moveTriangles = (isBlueLine, lineIndex) => {
    const className = isBlueLine?'triangle-blue':'triangle-pink';
    const triangles = root.querySelectorAll(`.${className}`);
    const focusElement = isBlueLine?root.querySelector('.complete-box_1'):root.querySelector('.complete-box_2');
    if(isBlueLine){
        if(lineIndex === 0){
            addBlueLineCss(triangles[0]);
            addBlueLineCss(triangles[1], 'triangle-blue2');
            animate(triangles[0], 274, 180);
            animate(triangles[1], -273, 0, 3, focusElement);
        }
        else if(lineIndex === 1){
            addBlueLineCss(triangles[0], 'triangle-blue3');
            addBlueLineCss(triangles[1], 'triangle-blue4');
            animate(triangles[0], 191, 0);
            animate(triangles[1], -190, 180, 0, focusElement);
        }
        else if(lineIndex === 2){
            addBlueLineCss(triangles[0], 'triangle-blue5');
            addBlueLineCss(triangles[1], 'triangle-blue6');
            animate(triangles[0], 335, -149, 110);
            animate(triangles[1], -337, 31, -105, focusElement);
        }
    }else{
        if(lineIndex === 0){
            addPinkLineCss(triangles[0]);
            addPinkLineCss(triangles[1], 'triangle-pink2');
            animate(triangles[0], 376, 180, -3);
            animate(triangles[1], -376, 0, 0, focusElement);
        }
        else if(lineIndex === 1){
            addPinkLineCss(triangles[0], 'triangle-pink3');
            addPinkLineCss(triangles[1], 'triangle-pink4');
            animate(triangles[0], 209, 0);
            animate(triangles[1], -210, 180, 1, focusElement);
        }
        else if(lineIndex === 2){
            addPinkLineCss(triangles[0], 'triangle-pink4');
            addPinkLineCss(triangles[1], 'triangle-pink5');
            animate(triangles[0], 203, -135, 2);
            animate(triangles[1], -203, 45, 0, focusElement);
        }
    }
}

const onClickLine = (event, lineElement, lineIndex) => {
    const isBlueLine = lineIndex < 6;
    const clickIndex = lineIndex % 6;
    const symmetryIndex = clickIndex < 3 ? clickIndex + 3: clickIndex -3;
    const drawBox = lineElement.parentElement.parentElement;
    // 이미 2개가 클릭되어 있으면 반응하지 않는다.
    const isSymmetryClicked = drawBox.querySelectorAll('.click-line')[symmetryIndex].classList.contains('clicked');
    if(isSymmetryClicked && lineElement.classList.contains('clicked'))
        return;
    // 클릭한 것을 똑 클릭하면 지운다.
    if(lineElement.classList.contains('clicked')){
        lineElement.classList.remove('clicked');
        let ariaLabel = lineElement.parentElement.classList.contains('first')?'첫번째 삼각형의 ':'두번째 삼각형의 ';
        ariaLabel += clickIndex%3===0?'첫번째 ':clickIndex%3===1?'두번째 ':'세번째 ';
        ariaLabel += '변';
        setAriaLabel(lineElement, ariaLabel);
        return;
    }
    // 이미 다른 변을 선택했으면 반응하지 않는다.
    const lines = lineElement.parentElement.querySelectorAll('.click-line');
    for(let i = 0; i < lines.length; i++){
        if(lines[i].classList.contains('clicked'))
            return;
    }
    // 먼저 클릭한 것이 있고, 있다면 그것과 일치하는지 확인한다.
    const testLines = [...drawBox.querySelectorAll(`.${clickIndex < 3 ? 'second':'first'} .click-line`)];
    let correctSelect = false;
    for(let i = 0; i < testLines.length; i++){
        if(testLines[i].classList.contains('clicked')){
            if(i!==clickIndex && i!==symmetryIndex){
                // 잘못 누른 경우
                const content = root.querySelector('.scaffolding-content');
                content.classList.remove('explain');
                content.classList.add('error');
                content.setAttribute('aria-label', '변의 길이가 달라요. 다시 생각해 보세요')
                content.innerHTML
                    = '<div aria-hidden="true">변의 길이가 달라요. 다시 생각해 보세요.</div>';
                lineElement.style.opacity = '.0';
                lineElement.classList.add('clicked');
                anime({
                    targets: lineElement,
                    opacity:[0, 1, 1, 1, 0, 0, 0],
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    loop: 2,
                    complete: ()=>{
                        lineElement.classList.remove('clicked');
                        lineElement.style.opacity = '1';
                        startScaffolding({
                            dismissTime: 2000,
                            focusElement: root.querySelector('.alt-box')
                        });
                    }
                });
                return;
            }else{
                correctSelect = true;
            }
        }
    }
    lineElement.classList.add('clicked');
    // aria-label 을 바꾸어 준다.
    //첫번째 삼각형의 첫번째 변
    let ariaLabel = lineElement.parentElement.classList.contains('first')?'첫번째 삼각형의 ':'두번째 삼각형의 ';
    ariaLabel += clickIndex%3===0?'첫번째 ':clickIndex%3===1?'두번째 ':'세번째 ';
    ariaLabel += '변이 선택되었습니다';
    setAriaLabel(lineElement, ariaLabel);
    if(correctSelect){
        root.querySelector('.menu .intro').classList.add('hide');
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

const onFocusLine = (event) => {
    const content = root.querySelector('.scaffolding-content');
    content.classList.remove('error');
    content.classList.add('explain');
    content.setAttribute('aria-label', '똑같은 삼각형 두개에서 길이가 같은 변을 클릭하세요')
    content.innerHTML
        = '<div aria-hidden="true">똑같은 삼각형</div>\n' +
        '                    <div aria-hidden="true" style="font-family:\'Batang\', Serif; font-size:46px;margin-left: 20px">2</div>\n' +
        '                    <div aria-hidden="true">개에서 길이가 같은 변을 클릭하세요.</div>';
    startScaffolding();
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
    // 삼성 브라우져 때문에 넣는다.
    setTimeout(()=>{
        _autoScale();
    }, 1);
    // 자판 만들기, 이거 활성화하면 checkbox 와 충돌한다. 피할려면 click 이벤트에서 window 로 이벤트 안가게 잡아준다.
    //qwerty.init(root, '.modal_qwerty');

    root.querySelector(".btn-fullscreen").addEventListener('click', toggleFullScreen);
    root.querySelectorAll(".btn-refresh").forEach((button, index)=>{
        button.addEventListener('click', (event)=>{onClickRefresh(event, button, index)});
    });
    document.addEventListener('click', stopScaffolding);
    const startDim = root.querySelector('.start-dim');
    startDim.addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('hide');
        setFocusToFullButton();
    })
    startDim.addEventListener('keydown', (event)=>{
        // Enter 는 nvda+space 를 눌러서 포커스모드로 바꿔야 한다.
        if (event.key === 'Tab' || event.key === 'Enter') {
            if(!root.querySelector('.start-dim').classList.contains('hide')) {
                event.preventDefault();
                event.stopPropagation();
                root.querySelector('.start-dim').classList.add('hide');
                setFocusToFullButton();
            }
        }
    })
    root.querySelectorAll('.click-line').forEach((line, index)=>{
        line.addEventListener('mousedown', (event)=>{
            event.preventDefault();
            onClickLine(event, line, index);
        });
        /*
        line.addEventListener('click', (event)=>{
            onClickLine(event, line, index);
        });
        line.addEventListener('mouseover', (event)=>{
            onFocusLine(event);
        });
        line.addEventListener('focus', (event)=>{
            onFocusLine(event);
        })
         */
    })
    root.querySelector('.scaffolding-content').addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();
    })
}

window.addEventListener("script-loaded",(env)=>{
    if(root) return;
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');
    if(param && param !== env.detail.unique) return;
    root = env.detail.root;
    checkIpad(root);
    createTabRule(root); // 주의: init 보다 앞에 있어야 한다.
    init(env);
    root.querySelector('.start-dim').focus();
});
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화 끝
//______________________________________________________________________________________________________________________








