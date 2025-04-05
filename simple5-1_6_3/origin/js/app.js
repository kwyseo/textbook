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
const koreanNumber = ['영','첫','두','세','네','다섯','여섯','일곱','여덟','아홉',
    '열','열한','열두','열세','열네','열다섯','열여섯','열일곱','열여덟','열아홉','스무',
    '스물한','스물두','스물세','스물네','스물다섯'];
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

const onClickRefresh = (event) => {
    event.preventDefault();
    event.stopPropagation();
    stopHandGuidAnimation();
    startScaffolding();
    root.querySelectorAll('.checked').forEach((checked)=>{
        checked.classList.add('hide');
    })

    root.querySelector('#paste-all').checked = false;
    root.querySelector('#paste-all').style.backgroundColor='white';

    root.querySelectorAll('.draw-box').forEach((box)=>{
        box.innerHTML = "";
        box.classList.remove('click-able');
    })

    root.querySelectorAll('.shape').forEach((shape)=>{
        shape.classList.remove('deselected');
    })
    setShapeLabel(-1);
    setAriaLabel('#paste-all', '한 번에 붙이기 버튼');
    root.querySelector('.scaffolding-content').focus();
}

const handGuideAnimation = () => {
    const guideHand = root.querySelector('.guide_hand');
    //if(!guideHand.classList.contains('hide'))
    //    return;
    guideHand.style.opacity = '0.0';
    guideHand.classList.remove('hide');
    const animation = anime.timeline({loop:2, complete:()=>{
            if(!guideHand.classList.contains('hide')) {
                //setTimeout(animation.restart, 3000);
                anime({
                    targets: guideHand,
                    opacity: [0, 0, 0, 0, 1],
                    duration: 1500,
                    easing: 'linear',
                    loop: false
                });

            }
        }});
    animation.add({
            targets: guideHand,
            delay: 2000,
            opacity: [0,1,1],
            duration: 1500,
            easing:"linear"
        }
    ).add({
            targets: guideHand,
            opacity: [1,0],
            duration: 1000,
            easing:"linear"
        }
    );
}

const stopHandGuidAnimation = (event) =>{
    root.querySelector('.guide_hand').classList.add('hide');
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
    scaffolding.classList.remove('hide');
}

const _setFocusToFullButton = (event)=>{
    if (event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        setFocusToFullButton(true);
    }
}

const sleep = (ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms));
}

const drawShape = async (target)=>{
    // 먼저 그릴 형태를 찾는다.
    let shapeType = -1;
    root.querySelectorAll('.checked').forEach((checked, index)=>{
        if(!checked.classList.contains('hide'))
            shapeType = index;
    });
    if(shapeType < 0)
        return;
    // 다음은 전체 그리기인지 확인한다.
    let isPasteAll = root.querySelector('#paste-all').checked;

    // 그려진 도형 갯수
    const childrenCount = target.children.length;
    const isLeft = target.parentElement.parentElement.classList.contains('left');
    let maxNumber = 0;
    if(shapeType === 0 || shapeType === 1){
        maxNumber = isLeft ? 25 : 24;
    }else{
        maxNumber = isLeft ? 12 : 12;
    }
    if(childrenCount >= maxNumber){
        return;
    }
    const _draw = (index) => {
        let div = document.createElement("div");
        div.style.position = "absolute";
        const className = shapeType === 0 ? 'circle':shapeType === 1?'square':'rectangle';
        div.classList.add(className);
        if(shapeType === 0 || shapeType === 1){
            const width = shapeType === 0 ? 118: 117;
            const columnCount = isLeft ? 5:6;
            const left = (index %columnCount) * width;
            const top = Math.floor(index / columnCount) * width;
            div.style.left = `${left}px`;
            div.style.top = `${top}px`;
            const shapeName = shapeType === 0 ? '원': '정사각형';
            const ariaLabel = `${isLeft?"가":"나"} 종이를 채운 ${koreanNumber[index+1]}번째 ${shapeName}`;
            div.setAttribute('aria-label', ariaLabel);
            //div.style.cursor = "pointer";
        }else{
            // 직사각형의 경우
            const width = 234;
            const height = 117;
            if(isLeft){
                if(index < 10){
                    const columnCount = 2;
                    const left = (index % columnCount) * width;
                    const top = Math.floor(index / columnCount) * height;
                    div.style.left = `${left}px`;
                    div.style.top = `${top}px`;
                }else if(index === 10){
                    div.style.left = `${width*2}px`;
                    div.style.top = `0px`;
                    // transform 을 쓰면 겹치는 부분이 매끄럽지 않다.
                    div.classList.add('portrait');
                }else if(index === 11){
                    div.style.left = `${width*2}px`;
                    div.style.top = `${width}px`;
                    div.classList.add('portrait');
                }
            }else{
                const columnCount = 3;
                const left = (index % columnCount) * width;
                const top = Math.floor(index / columnCount) * height;
                div.style.left = `${left}px`;
                div.style.top = `${top}px`;
            }
            const ariaLabel = `${isLeft?"가":"나"} 종이를 채운 ${koreanNumber[index+1]}번째 직사각형`;
            div.setAttribute('aria-label', ariaLabel);
        }
        div.setAttribute('tabindex', '5');
        target.appendChild(div);
        // 맨 마지막 도형에서 풀버튼으로 도형 이동
        if(!isLeft){
            div.addEventListener('keydown', _setFocusToFullButton);
            if(index > 0) {
                div.previousElementSibling.removeEventListener('keydown', _setFocusToFullButton);
            }
        }
    }
    if(!root.querySelector('#paste-all').checked)
        root.querySelector('#paste-all').style.backgroundColor = '#D9D9D9'

    if(isPasteAll){
        for(let i = 0; i < maxNumber; i++){
            _draw(i);
            await sleep(50);
        }
    }else{
        _draw(childrenCount)
    }
}

const onClickDrawBox = async (event) =>{
    event.preventDefault();
    // drawShape 함수에서 event.currentTarget 를 변형시킴으로 먼저 이것을 처리해야 한다.
    if(event.currentTarget.parentElement.parentElement.classList.contains('left')) {
        stopHandGuidAnimation();
    }
    await drawShape(event.currentTarget);
}

const setShapeLabel = (targetIndex) =>{
    root.querySelectorAll('.shape').forEach((temp, tempIndex)=>{
        const shapeName = tempIndex === 0 ? "원": tempIndex === 1 ? "정사각형": "직사각형";
        if(targetIndex === tempIndex){
            setAriaLabel(temp, `${shapeName}이 선택되었습니다`)
        }else{
            setAriaLabel(temp, `${shapeName}`)
        }
    });
}

const onClickShape = (event, index) =>{
    event.preventDefault();
    event.stopPropagation();
    stopScaffolding();
    let isChangeAble = true;
    root.querySelectorAll('.draw-box').forEach((box)=>{
        if(box.hasChildNodes())
            isChangeAble = false;
    });
    if(!isChangeAble)
        return;
    root.querySelectorAll('.shape').forEach((temp)=>{
        temp.classList.add('deselected');
        temp.querySelector('.checked').classList.add('hide');
    });
    event.currentTarget.querySelector('.checked').classList.remove('hide');
    event.currentTarget.classList.remove('deselected');
    setShapeLabel(index);
    root.querySelectorAll('.draw-box').forEach((box)=>{
        box.classList.add('click-able');
    })
    // draw-box 크기를 도형의 크기에 맞추어 조절해 준다.
    root.querySelectorAll('.draw-box').forEach((box)=>{
        if(index === 0)
            box.classList.remove('square-draw-box');
        else
            box.classList.add('square-draw-box');
    })
    handGuideAnimation();
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
    //handGuideAnimation();
    startScaffolding();
    // 자판 만들기, 이거 활성화하면 checkbox 와 충돌한다. 피할려면 click 이벤트에서 window 로 이벤트 안가게 잡아준다.
    //qwerty.init(root, '.modal_qwerty');

    root.querySelector(".btn-fullscreen").addEventListener('click', toggleFullScreen);
    root.querySelector(".btn-refresh").addEventListener('click', onClickRefresh);

    // 모양 선택
    root.querySelectorAll('.shape').forEach((shape, index)=>{
        shape.addEventListener('click', (event)=>{
            onClickShape(event, index);
        })
    })
    root.querySelector('#paste-all').addEventListener('click', (event)=>{
        let isShapeDrawn = false;
        if(event.currentTarget.checked) {
            setAriaLabel(event.currentTarget, '한 번에 붙이기 기능이 활성화되었습니다');
        }
        else {
            setAriaLabel(event.currentTarget, '한 번에 붙이기 기능이 비활성화되었습니다');
        }
        root.querySelectorAll('.draw-box').forEach((box)=>{
            if(box.hasChildNodes())
                isShapeDrawn = true;
        });
        if(isShapeDrawn){
            event.preventDefault();
            event.stopPropagation();
        }
    })

    root.querySelectorAll('.draw-box').forEach((box)=>{
        box.addEventListener('click', async (event)=>{
            await onClickDrawBox(event);
        })
    })
    root.querySelectorAll('.draw-box-box').forEach((box)=>{
        box.addEventListener('click', (event)=>{
            box.parentElement.querySelector('.draw-box').click();
        })
    })
    document.addEventListener('click', stopScaffolding);
    root.querySelector('.start-dim').addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('hide');
        //root.querySelector('.scaffolding .scaffolding-content').focus();
        setFocusToFullButton();
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








