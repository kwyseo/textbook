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
let isTrapezoidMoved = false;

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
    isTrapezoidMoved = false;
    root.querySelectorAll('.click-line').forEach((line)=>{
        line.classList.remove('clicked');
    })
    const drawBoxes = root.querySelectorAll('.draw-box');
    drawBoxes[0].style.transform = null;
    drawBoxes[1].style.transform = null;
    const boxAttributes = ['trapezoid-left-line-left','trapezoid-right-line-left',
        'trapezoid-left-line-right','trapezoid-right-line-right','trapezoid-left-line-bottom','trapezoid-right-line-bottom'];
    boxAttributes.forEach((attribute)=>{
        drawBoxes[0].classList.remove(attribute);
        drawBoxes[1].classList.remove(attribute);
    })
    root.querySelector('.retry').classList.add('hide');
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
        :type===2? '<div aria-hidden="true">평행사변형이 되도록 다시 활동해 보세요.</div>'
        :type===3? `<div aria-hidden="true">두 사다리꼴을 이어 붙여 평행사변형을 만들어요.</div>`
        :type===4? '<div aria-hidden="true" style="display: flex">사다리꼴&nbsp;<div class="batang">2</div>개로 만든 평행사변형의 넓이를 구해 보세요.'
        :'<div aria-hidden="true">변의 길이가 달라요. 다시 생각해 보세요.</div>';
    const ariaLabel = type === 1
        ? '똑같은 사다리꼴 두개에서 길이가 같은 변을 클릭하세요'
        :type===2? '평행사변형이 되도록 다시 활동해 보세요' // 잘못된 도형을 보여주고 써주는 것
        :type===3?`두 사다리꼴을 이어 붙여 평행사변형을 만들어요`
        :type===4?'사다리꼴 2개로 만든 평행사변형의 넓이를 구해 보세요'
        :'변의 길이가 달라요. 다시 생각해 보세요';
    const contentDiv = root.querySelector('.scaffolding-content');
    contentDiv.innerHTML = text;
    const attributes = ['aa', 'explain', 'invitation', 'ok-1', 'ok-2', 'false'];
    attributes.forEach((attribute, index)=>{
        if(index === type)
            contentDiv.classList.add(attribute);
        else
            contentDiv.classList.remove(attribute);
    })
    setAriaLabel(contentDiv, ariaLabel);
    if (setFocus) {
        setTimeout(() => {
            contentDiv.focus();
        }, 10)
    }
}

const isShowing = (element) => {
    if (typeof element === 'string') {
        element = root.querySelector(element);
    }
    return !element.classList.contains('hide');
}

const unselectAllClicked = (boxIndex)=>{
    const drawBoxes = root.querySelectorAll('.draw-box');
    drawBoxes[boxIndex].querySelectorAll('.click-line').forEach((line, index)=>{
        line.classList.remove('clicked');
    })
}

const moveTrapezoid  = (leftX, leftY, leftRotate, rightX, rightY, rightRotate, scaffoldingNumber)=>{
    const drawBoxes = root.querySelectorAll('.draw-box');
    anime({
        targets: drawBoxes[0],
        translateX: leftX,
        translateY: leftY,
        rotate: leftRotate,
        duration: 1500,
        easing: 'easeInOutQuad',
        complete: ()=>{
            setTimeout(()=>{
                unselectAllClicked(0)
            }, 100)
        }
    });
    anime({
        targets: drawBoxes[1],
        translateX: rightX,
        translateY: rightY,
        rotate: rightRotate,
        duration: 1500,
        easing: 'easeInOutQuad',
        complete: ()=>{
            setTimeout(()=>{
                unselectAllClicked(1);
                if(scaffoldingNumber === 2)
                    root.querySelector('.retry').classList.remove('hide');
            }, 100)
            setScaffoldingText(scaffoldingNumber);
        }
    });
}

const onClickLine = (event, clickedLine, clickedIndex) => {
    if(isTrapezoidMoved)
        return;
    if(clickedLine.classList.contains('clicked')){
        clickedLine.classList.remove('clicked');
        return;
    }
    // 선택을 하고 다른 것을 선택했을 때...
    const sameDiagramLines = clickedLine.parentElement.querySelectorAll('.click-line');
    sameDiagramLines.forEach((line)=>{
        if(clickedLine!==line)
            line.classList.remove('clicked');
        else
            line.classList.add('clicked');
    })
    const opponentDrawBox = root.querySelectorAll('.draw-box')[clickedIndex < 4? 1:0];
    let opponentIndex = -1;
    opponentDrawBox.querySelectorAll('.click-line').forEach((line, index)=>{
        if(line.classList.contains('clicked'))
            opponentIndex = index;
    })
    // 상대편 선택이 없으면 그냥 나간다.
    if(opponentIndex < 0)
        return;
    const isLeftDiagramClick = clickedIndex < 4;
    const leftIndex = isLeftDiagramClick ? clickedIndex: opponentIndex;
    const rightIndex = isLeftDiagramClick ? opponentIndex : clickedIndex % 4;
    if(leftIndex === rightIndex
        || (leftIndex===0 && rightIndex===2)
        || (leftIndex===2 && rightIndex===0)){
        root.querySelector('.intro').style.visibility='hidden';
        isTrapezoidMoved = true;
        const drawBoxes = root.querySelectorAll('.draw-box');
        if(leftIndex===0 && rightIndex===2){
            moveTrapezoid(572, -100, -26.5, -572, -100, 26.5, 2);
        }else if(leftIndex===2 && rightIndex===0){
            moveTrapezoid(213, -100, 26.5, -213, -100, -26.5, 2);
        }else if(leftIndex===0){
            setScaffoldingText(3);
            drawBoxes[0].classList.add('trapezoid-left-line-left');
            drawBoxes[1].classList.add('trapezoid-right-line-left');
            moveTrapezoid(192, 0, 180, -192, 0, 0, 4);
        }else if(leftIndex===1){
            moveTrapezoid(192, -80, 90, -192, -80, -90, 2);
        }else if(leftIndex===2){
            setScaffoldingText(3);
            drawBoxes[0].classList.add('trapezoid-left-line-right');
            drawBoxes[1].classList.add('trapezoid-right-line-right');
            moveTrapezoid(192, 0, 0, -192, 0, -180, 4);
        }else if(leftIndex===3){
            drawBoxes[0].classList.add('trapezoid-left-line-bottom');
            drawBoxes[1].classList.add('trapezoid-right-line-bottom');
            moveTrapezoid(192, -80, -90, -192, -80, 90, 2);
        }
    }else{
        // 서로 다른 길이를 선택한 경우
        setScaffoldingText(5);
        clickedLine.style.opacity = '.0';
        anime({
            targets: clickedLine,
            opacity:[0, 1, 1, 1, 0, 0, 0],
            duration: 1000,
            easing: 'easeInOutQuad',
            loop: 2,
            complete: ()=>{
                clickedLine.classList.remove('clicked');
                clickedLine.style.opacity = '1';
            }
        });
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
    root.querySelector('.retry').addEventListener('click', onClickRefresh);
    root.querySelectorAll('.click-line').forEach((line, index)=>{
        // 변 클릭시 포커스가 가지 않도록 하기 위해 click 대신 사용한다.
        line.addEventListener('mousedown', (event)=>{
            event.preventDefault();
            onClickLine(event, line, index);
        });
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








