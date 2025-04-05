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

const onClickRefresh = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if(isScissorsMoving)
        return;
    root.querySelectorAll('.button').forEach((button)=>{
        button.classList.remove('hide');
    })
    root.querySelector('.pink-box').classList.remove('hide');
    root.querySelector('.parallelogram').classList.remove('hide');
    root.querySelectorAll('.parallelogram_piece').forEach((piece)=>{
        piece.classList.add('hide');
        piece.style.transform = 'translateX(0)';
    })
    root.querySelector('.scissors-box').classList.remove('hide');
    setScissors(1);
    stopScaffolding();
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

// 인수값은 1, 2, 3, 4
const setScissors = (targetNumber) => {
    const imageNames = ['select_1', 'select_2', 'select_3', 'select_4'];
    imageNames.forEach((className, index)=>{
        const target = root.querySelector('.parallelogram');
        if(index === targetNumber - 1){
            target.classList.add(className)
        }else{
            target.classList.remove(className)
        }
    });

    root.querySelectorAll('.parallelogram path').forEach((path, index)=>{
        if(index === targetNumber + 2){
            path.setAttribute('stroke', '#E4007F')
        }else{
            if(index !== 0 && index!== 8)
                path.setAttribute('stroke', '#00A1E9')
        }
    });
    const classNames = ['first', 'second', 'third', 'fourth'];
    const scissorsBox = root.querySelector('.scissors-box');
    classNames.forEach((className)=>{
        scissorsBox.classList.remove(className);
    });
    scissorsBox.classList.add(classNames[targetNumber -1]);
    const leftButton = root.querySelector('.button.left');
    if(targetNumber === 1){
        leftButton.classList.add('hide');
    }else{
        leftButton.classList.remove('hide');
    }
    const rightButton = root.querySelector('.button.right');
    if(targetNumber ===4){
        rightButton.classList.add('hide');
    }else{
        rightButton.classList.remove('hide');
    }
    scissorsPosition = targetNumber;
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
const onClickScissors = (event) =>{
    event.preventDefault();
    root.querySelectorAll('.button').forEach((button)=>{
        button.classList.add('hide');
    })
    root.querySelector('.pink-box').classList.add('hide');
    if(!isScissorsMoving){
        // 가위를 위로 움직인다.
        const scissorsBox = root.querySelector('.scissors-box');
        isScissorsMoving = true;
        const topPosition = scissorsBox.offsetTop;
        let tempPosition = topPosition;
        const _smoothMove = () =>{
            tempPosition += -2;
            scissorsBox.style.top = `${tempPosition}px`;
            if(tempPosition > topPosition - 315){
                requestAnimationFrame(_smoothMove);
            }else{
                anime({
                    targets: scissorsBox,
                    opacity: [1,0],
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    complete: ()=>{
                        scissorsBox.classList.add('hide');
                        scissorsBox.style.opacity = '1.0';
                        scissorsBox.style.top = `${topPosition}px`;
                    }
                });
                // 이제 판을 움직여 주자.
                const left = root.querySelector(`.select_${scissorsPosition}_left`);
                const right = root.querySelector(`.select_${scissorsPosition}_right`);
                left.classList.remove('hide');
                right.classList.remove('hide');
                if(scissorsPosition === 1){
                    moveBackDiagram(left, 326, right, -83);
                }else if(scissorsPosition === 2){
                    moveBackDiagram(left, 247, right, -158);
                }else if(scissorsPosition === 3){
                    moveBackDiagram(left, 163, right, -243);
                }else if(scissorsPosition === 4){
                    moveBackDiagram(left, 81, right, -328);
                }
                const parallelogram = root.querySelector('.parallelogram');
                parallelogram.classList.add('hide');
            }
        }
        _smoothMove();
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
        const targetWidth = 640;
        const targetHeight = 720;
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
    root.querySelector(".menu .btn-refresh").addEventListener('click', onClickRefresh);
    document.addEventListener('click', stopScaffolding);
    root.querySelector('.start-dim').addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('hide');
        setFocusToFullButton();
    })
    root.querySelectorAll('.button').forEach((button, index)=>{
        button.addEventListener('click', (event)=>{
            event.preventDefault();
            const targetNumber = scissorsPosition + (index===0? -1:1);
            if(targetNumber < 1 || targetNumber > 4)
                return;
            setScissors(targetNumber);
        })
    })
    root.querySelector('.trapezoid').addEventListener('click', onClickScissors)
    setScissors(1);
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








