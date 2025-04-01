import anime from "./anime.js";
import qwerty from "./qwerty.js";


const metaUrl = import.meta.url;
let root;
let scale = 1;  // 화면 스케일링 값

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen || document.msRequestFullscreen;
        requestFullScreen.call(root.firstElementChild);
    }else{
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        cancelFullScreen.call(document);
    }
}

const onClickRefresh = () => {
    startScaffolding();
    root.querySelectorAll('.checked').forEach((checked)=>{
        checked.classList.add('hide');
    })
    root.querySelector('#paste-all').checked = false;
    root.querySelectorAll('.draw-box').forEach((box)=>{
        box.innerHTML = "";
    })
}

const checkInput = (input, wantedValue) => {
    if(input.value !== wantedValue){
        anime({
            targets: input,
            easing: 'easeInOutSine',
            loop: 2,
            duration: 1000,
            color: ['rgba(255,0,0,0)', 'rgba(255,0,0,1)'],
            complete:()=>{
                input.value = "";
                input.style.color = 'black';
                input.style.display = "none";
            }
        });
        return false;
    }
    return true;
}

// 타이틀을 넣을 수 있도록 자판을 띄운다.
// 나중에 예제를 쓸려고 지우지 않았다
/*
const onClickTitle = (event) => {
    event.preventDefault();
    stopPropagation(event);
    const event = new CustomEvent("qwerty-open", {detail:"title"});
    document.dispatchEvent(event);
    let input = root.querySelector(".title .input");
    qwerty.activate(input, 'title', (text, isEnter = false)=>{
        if(isEnter){ // 엔터를 누르거나 창이 닫히는 경우
            //checkInput(input, '생활 폐기물 종류별 재활용 폐기물량');
        }
    });
}
 */



const stopPropagation = (event) => {
    event.stopPropagation();
    const guideHand = root.querySelector('.guide_hand');
    guideHand.classList.add('hide');
    stopScaffolding();
}
const handGuideAnimation = () => {
    const guideHand = root.querySelector('.guide_hand');
    guideHand.addEventListener('mouseover', function() {
        guideHand.classList.add('hide');
    });
    window.addEventListener('click', function() {
        guideHand.classList.add('hide');
    });
    const animation = anime.timeline({loop:2, complete:()=>{
            if(!guideHand.classList.contains('hide')) {
                setTimeout(animation.restart, 3000);
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

const stopScaffolding = (event) => {
    if(event && event.target.classList.contains("btn-refresh")){
        return;
    }
    const scaffolding = root.querySelector(".scaffolding");
    scaffolding.classList.add('hide');
    anime.remove(scaffolding);
}

// 처음 시작할 때 나오는 안내 문구
const startScaffolding = () => {
    const scaffolding = root.querySelector(".scaffolding");
    scaffolding.style.display = "block";
    scaffolding.style.opacity = 1;
    anime({
        targets: scaffolding,
        easing: 'easeInOutSine',
        delay: 4300,
        duration: 1000,
        opacity: [1, 0 ],
        complete:()=>{
            stopScaffolding();
        }
    }).restart();
}

const drawShape = (target)=>{
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
    const isLeft = target.parentElement.classList.contains('left');
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
            const columnCount = isLeft ? 5:6;
            const left = (index %columnCount) * 114;
            const top = Math.floor(index / columnCount) * 114;
            div.style.left = `${left}px`;
            div.style.top = `${top}px`;
            //div.style.cursor = "pointer";
        }else{
            // 직사각형의 경우
            const width = 228;
            const height = 114;
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

        }
        target.appendChild(div);
    }
    if(isPasteAll){
        for(let i = 0; i < maxNumber; i++){
            _draw(i)
        }
    }else{
        _draw(childrenCount)
    }
}

const onClickDrawBox = (event) =>{
    event.preventDefault();
    drawShape(event.currentTarget);
}

//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화
//_____________________________________________________________________________________________________________________
const init = (env) => {
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
    //startScaffolding();
    // 자판 만들기, 이거 활성화하면 checkbox 와 충돌한다. 피할려면 click 이벤트에서 window 로 이벤트 안가게 잡아준다.
    //qwerty.init(root, '.modal_qwerty');

    root.querySelector(".btn-fullscreen").addEventListener('click', toggleFullScreen);
    root.querySelector(".btn-refresh").addEventListener('click', onClickRefresh);

    root.querySelectorAll('.shape').forEach((shape)=>{
        shape.addEventListener('click', (event)=>{
            root.querySelectorAll('.shape').forEach(temp=>{
                temp.querySelector('.checked').classList.add('hide');
            });
            shape.querySelector('.checked').classList.remove('hide');
        })
    })
    root.querySelector('#paste-all').addEventListener('click', (event)=>{
        let isShapeDrawn = false;
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
        box.addEventListener('click', (event)=>{
            onClickDrawBox(event);
        })
    })
    document.addEventListener('click', stopScaffolding);
}

window.addEventListener("script-loaded",(env)=>{
    if(root) return;
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');
    if(param && param !== env.detail.unique) return;
    root = env.detail.root;
    init(env);
});
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화 끝
//______________________________________________________________________________________________________________________








