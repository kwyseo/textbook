import anime from "./anime.js";
//import qwerty from "./qwerty.js";
import numberPad from "./NumberPad.js";


const metaUrl = import.meta.url;
let root;
let scale = 1;  // 화면 스케일링 값
let methodPage = 1;
let dragObject = null;

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen || document.msRequestFullscreen;
        requestFullScreen.call(root.firstElementChild);
    }else{
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        cancelFullScreen.call(document);
    }
}

const hideAllModal = (button) => {
    const buttonList = [".btn-graph", ".btn-method"];
    const modalList = [".modal_graph", ".modal_method"];
    buttonList.forEach(btn => {
        if(btn!==button)
            root.querySelector(btn).classList.remove("off");
    });
    modalList.forEach(modal => root.querySelector(modal).style.display = "none");
}

const toggleButton = (button, modal) => {
    hideAllModal(button);
    const btn = root.querySelector(button);
    if (btn.classList.contains('off')) {
        btn.classList.remove('off');
    }
    else {
        btn.classList.add('off');
        if(modal)
            root.querySelector(modal).style.display = "block";
    }
}


const onClickRefresh = () => {
    hideAllModal("");
    if(!root.querySelector(".btn-order").classList.contains("off")){
        onClickOrder();
    }
    root.querySelectorAll(".input").forEach((element)=> {
        element.value = "";
        element.style.display = "none";
    });
    methodPage = 1;
    // 바를 초기화 해주어 한다.
    for(let i = 1; i < 6; i++){
        const drag = root.querySelector(`.bar_div .drag${i}`);
        drag.querySelector('.bar').style.display = "none";
        drag.style.transform = `translate(0px, 0px)`;
        drag.dataset.x = "";
        drag.dataset.y = "";
    }
    // 볼륨 초기화
    root.querySelectorAll('.volume .input').forEach(element => {
        element.removeAttribute("readonly");
    });
}

const onClickOrder = () => {
    const name = ".btn-order";
    toggleButton(".btn-order");
    const btn = root.querySelector(name);
    if(btn.classList.contains('off')){
        // 보여주고 있는 상황
        root.querySelectorAll(".sticker").forEach((element) => element.style.display = "none");
        root.querySelectorAll(".sticker_01").forEach((element) => element.style.display = "none");
        root.querySelectorAll(".sticker_02").forEach((element) => element.style.display = "none");
    }else{
        root.querySelectorAll(".sticker").forEach((element) => element.style.display = "block");
        root.querySelectorAll(".sticker_01").forEach((element) => element.style.display = "block");
        root.querySelectorAll(".sticker_02").forEach((element) => element.style.display = "block");
    }
}

const onClickMethod = () => {
    toggleButton(".btn-method", ".modal_method");
}

const onClickMethodWipe = (number) => {
    if(methodPage === 1 && number < 0){
        return;
    }else if(methodPage === 5 && number > 0){
        return;
    }
    const methodClass = `method_0${methodPage}`;
    const page = methodPage + number;
    methodPage = page < 1 ? 5: page > 5 ? 1: page;
    const left = root.querySelector(".modal_method .left");
    const right = root.querySelector(".modal_method .right")
    left.classList.remove("off");
    right.classList.remove("off");
    if(methodPage === 1){
        left.classList.add("off");
    }else if(methodPage === 5){
        right.classList.add("off");
    }
    const modal = root.querySelector(".modal_method");
    modal.classList.remove(methodClass);
    modal.classList.add(`method_0${methodPage}`);
}

const onClickGraph = () => {
    toggleButton(".btn-graph", ".modal_graph");
}

const checkInput = (input, wantedValue) => {
    if(input.value !== wantedValue){
        input.readOnly = true;
        anime({
            targets: input,
            easing: 'easeInOutSine',
            loop: 2,
            duration: 1000,
            color: ['rgba(255,0,0,0)', 'rgba(255,0,0,1)'],
            complete:()=>{
                input.removeAttribute("readonly");
                input.value = "";
                input.style.color = 'black';
                input.style.display = "none";
            }
        });
        return false;
    }
    return true;
}

const activateTextInput = (input) => {
    input.style.display = "block";
    input.focus();
}
const deactivateTextInput = (input) =>{
    if(input.value.length < 1)
        input.style.display = "none";
}

// 타이틀을 넣을 수 있도록 자판을 띄운다.
const onClickTitle = (event) => {
    event.preventDefault();
    stopPropagation(event);
    hideAllModal("");
    numberPad.remove();
    let input = root.querySelector(".title .input");
    /*
    qwerty.activate(input, 'title', (text, isEnter = false)=>{
        if(isEnter){ // 엔터를 누르거나 창이 닫히는 경우
            //checkInput(input, '자기 이해 유형별 학생 수');
        }
    });
     */
    // 쿼티를 사용하지 않아서 추가
    activateTextInput(input);
}

const onClickName = (event, selector) => {
    const answers = {
        "name1": "멋쟁이",
        "name2": "성실이",
        "name3": "씩씩이",
        "name4": "친절이",
        "name5": "탐험이"
    }
    event.preventDefault();
    stopPropagation(event);
    hideAllModal("");
    numberPad.remove();
    const modal = root.querySelector('.modal_qwerty');
    const input = root.querySelector(`.content .${selector} .input`);
    /*
    qwerty.activate(input, selector, (text, isEnter = false)=>{
        if(isEnter) {
            //const checkResult = checkInput(input, answers[selector]);
        }
    }, 0, 550);
     */
    // 쿼티를 사용하지 않아서 추가
    activateTextInput(input);
}

const onClickVolume = (event, selector) => {
    const answers = {
        "volume1": "5",
        "volume2": "10"
    }
    event.preventDefault();
    stopPropagation(event);
    hideAllModal("");
    //qwerty.remove();
    const input = root.querySelector(`.content .${selector} .input`);
    if(input.readOnly)
        return;
    numberPad.activate(input, selector, (text)=>{
        const checkResult = checkInput(input, answers[selector]);
        if(checkResult)
            input.readOnly = true;
    });
}

const checkModal = () => {
    return window.getComputedStyle(root.querySelector(".modal_graph")).getPropertyValue("display") !== "none"
        || window.getComputedStyle(root.querySelector(".modal_unit")).getPropertyValue("display") !== "none"
        || window.getComputedStyle(root.querySelector(".modal_method")).getPropertyValue("display") !== "none"
        || window.getComputedStyle(root.querySelector(".modal_qwerty")).getPropertyValue("display") !== "none"
        || window.getComputedStyle(root.querySelector(".modal_number_pad")).getPropertyValue("display") !== "none";

}

const onClickBarDiv = (event) =>{
    if(checkModal())
        return;
    const classes = event.target.classList;
    if(classes.contains("bar") || classes.contains("drag"))
        return;
    // 여기까지 왔으면 바를 그려준다. 그럴려면 drag 를 찾아야 한다.
    const dragBars = root.querySelectorAll(".bar_div .drag");
    const clientY = event.clientY ? event.clientY : event.changedTouches[0].clientY;
    for(let i = 0; i < dragBars.length; i++){
        const drag = dragBars[i];
        const dragRect = drag.getBoundingClientRect();
        if(clientY < dragRect.bottom && clientY > dragRect.top){
            const clientX = event.clientX ? event.clientX : event.changedTouches[0].clientX;
            const divRect = root.querySelector(".bar_div").getBoundingClientRect();
            const xDefault = (clientX - divRect.right)/(scale / 100);
            setBar(drag, xDefault);
            break;
        }
    }
}

const setBar = (drag, xDefault) => {
    const divWidth = root.querySelector('.bar_div').offsetWidth;
    const widthCount = 12; // 칸의 갯수는 12개다
    let width = divWidth / widthCount;
    // 0보다 크면 오른쪽으로 넘어간 것
    if(xDefault > 0)
        xDefault = 0;

    if(xDefault < -width*widthCount + width / 2){
        drag.querySelector('.bar').style.display = "none";
        drag.style.transform = `translate(0px, 0px)`;
        drag.dataset.x = "";
        drag.dataset.y = "";
        return;
    }
    for (let i = 0; i < widthCount; i++) {
        const min = -i * width - width / 2;
        const max = -i * width + width / 2;
        if (xDefault >= min && xDefault <= max) {
            let targetX = -i * width;
            if(i < 1)
                targetX += 3;
            else if (i < 2)
                targetX += 6;
            else if (i < 6)
                targetX += 5;
            else if( i < 9)
                targetX += 4;
            else
                targetX += 3;
            drag.style.transform = `translate(${targetX}px, ${drag.dataset.translateY}px)`;
            drag.querySelector(".bar").style.width = (divWidth + targetX - 2)+"px";
            break;
        }
    }
}

const setDragAndDrop = () => {
    const dragBars = root.querySelectorAll(".bar_div .drag");
    for(let i = 0; i < dragBars.length; i++){
        const drag = dragBars[i];
        drag.dataset.left = drag.getBoundingClientRect().left;
        drag.ondragstart = () => false;
        const _onMouseDown = (event) => {
            event.preventDefault();
            stopPropagation(event);
            // 모달이 떠 있는지 확인한다.
            if(checkModal())
                return;
            if(dragObject)
                return;
            else
                dragObject = drag;
            const bar = drag.querySelector('.bar');
            bar.style.display = "block";
            bar.style.width = "100%";
            if(!drag.dataset.x){
                // 처음이면 마우스 오른쪽으로 바를 만들어 준다.
                const dragRect = drag.getBoundingClientRect();
                const mouseXPoint = event.clientX?event.clientX:event.touches[0].clientX;
                const moveDistance = dragRect.right - mouseXPoint - 2;
                drag.style.transform = `translate(${-moveDistance / (scale / 100)}px, 0px)`;
                drag.dataset.init = "true";
            }
            const style = window.getComputedStyle(drag);
            const matrix = new WebKitCSSMatrix(style.transform);
            drag.dataset.translateX =  matrix.m41;
            drag.dataset.translateY =  matrix.m42;
            drag.dataset.x = event.clientX?event.clientX:event.touches[0].clientX;
            drag.dataset.y = event.clientY?event.clientY:event.touches[0].clientY;
            const onMouseMove = (event) => {
                if(dragObject !== drag)
                    return;
                const clientX = event.clientX?event.clientX:event.touches[0].clientX;
                const x = (clientX - drag.dataset.x) / (scale / 100) + 1 * drag.dataset.translateX;
                // y 축으로는 움직이지 않는다.
                drag.style.transform = `translate(${x}px, ${drag.dataset.translateY}px)`;
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', onMouseMove);
            const onDragEnd = (event) => {
                if(dragObject) {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('touchmove', onMouseMove);
                    document.removeEventListener('mouseup', onDragEnd);
                    document.removeEventListener('touchend', onDragEnd);
                    dragObject = null;
                    const clientX = event.clientX ? event.clientX : event.changedTouches[0].clientX;
                    let xDefault = (clientX - drag.dataset.x) / (scale / 100) + 1 * drag.dataset.translateX;
                    // 움직이지 않은 경우
                    if (Math.abs(clientX - drag.dataset.x) < 1) {
                        if(drag.dataset.init === "true"){
                            xDefault += 2;
                        }else{
                            const divRect = root.querySelector(".bar_div").getBoundingClientRect();
                            xDefault = (clientX - divRect.right)/(scale / 100);
                        }
                    }
                    setBar(drag, xDefault);
                    drag.dataset.init = "false";
                }
            }
            document.addEventListener('mouseup', onDragEnd);
            document.addEventListener('touchend', onDragEnd);
        }
        drag.onmousedown = (event) => { _onMouseDown(event)}
        drag.ontouchstart = (event) => { _onMouseDown(event)}
    }
}

const stopPropagation = (event) => {
    event.stopPropagation();
    const guideHand = root.querySelector('.guide_hand');
    guideHand.style.display = 'none';
}
const handGuideAnimation = () => {
    const guideHand = root.querySelector('.guide_hand');
    guideHand.addEventListener('mouseover', function() {
        guideHand.style.display = 'none';
    });
    window.addEventListener('click', function() {
        guideHand.style.display = 'none';
    });
    const animation = anime.timeline({loop:2, complete:()=>{
            if(guideHand.style.display!=="none") {
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
const checkIpad = () => {
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
        root.querySelector('.btn-fullscreen').style.display = 'none';
    }
}
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화
//_____________________________________________________________________________________________________________________
const init = (env) => {
    const _autoScale = () => {
        const viewWarp = root.querySelector('.view-wrap');
        const wrap = root.querySelector('.wrap');
        const targetWidth = 1920;
        const targetHeight = 1020;
        viewWarp.style.maxHeight = root.innerHeight;
        wrap.style.minWidth = targetWidth + "px";
        wrap.style.minHeight = targetHeight + "px";
        const calculatedScaleWidth = viewWarp.offsetWidth / targetWidth * 100;
        const calculatedScaleHeight = viewWarp.offsetHeight / targetHeight * 100;
        scale = calculatedScaleWidth < calculatedScaleHeight ? calculatedScaleWidth: calculatedScaleHeight;
        wrap.style.transform = "scale(" + scale + "%)";
        // 뷰어 때문에 이짓을 한다.
        const rec = wrap.getBoundingClientRect();
        scale = rec.height / wrap.offsetHeight * 100;
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
    handGuideAnimation();
    // 새도우돔은 font-face 가 작동하지 않아서 넣는다.
    const sheets = root.styleSheets;
    const style = sheets[sheets.length -1];
    let href = style.href;
    href = href.substring(0, href.indexOf('/css'));
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
    checkIpad();
    // 자판 만들기
    //qwerty.init(root, '.modal_qwerty');
    numberPad.init(root, '.modal_number_pad');

    setDragAndDrop();

    root.querySelector(".btn-fullscreen").addEventListener('click', toggleFullScreen);
    root.querySelector(".btn-refresh").addEventListener('click', onClickRefresh);
    root.querySelector(".btn-order").addEventListener('click', onClickOrder);
    root.querySelector(".btn-method").addEventListener('click', onClickMethod);
    root.querySelector(".modal_method .left").addEventListener('click', ()=>onClickMethodWipe(-1));
    root.querySelector(".modal_method .right").addEventListener('click', ()=>onClickMethodWipe(1));
    root.querySelector(".modal_method .close").addEventListener('click', onClickMethod);
    root.querySelector(".btn-graph").addEventListener('click', onClickGraph);
    root.querySelector(".modal_graph .close").addEventListener('click', onClickGraph);
    root.querySelector(".container.title .title").addEventListener('click', onClickTitle);
    root.querySelector(".title .input").addEventListener('click', onClickTitle);
    root.querySelector(".content .name1").addEventListener('click', (event)=>onClickName(event, 'name1'));
    root.querySelector(".content .name2").addEventListener('click', (event)=>onClickName(event, 'name2'));
    root.querySelector(".content .name3").addEventListener('click', (event)=>onClickName(event, 'name3'));
    root.querySelector(".content .name4").addEventListener('click', (event)=>onClickName(event, 'name4'));
    root.querySelector(".content .name5").addEventListener('click', (event)=>onClickName(event, 'name5'));
    root.querySelector(".content .volume1").addEventListener('click', (event)=>onClickVolume(event, 'volume1'));
    root.querySelector(".content .volume2").addEventListener('click', (event)=>onClickVolume(event, 'volume2'));
    root.querySelector(".bar_div").addEventListener('mouseup', (event)=>onClickBarDiv(event));
    root.querySelectorAll("input").forEach((element)=>{
        element.addEventListener('keydown', (event)=>{
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
    });
    root.querySelectorAll('.volume .input').forEach(element=>{
        element.addEventListener('keyup', (event)=>{
            event.target.value = event.target.value.replace(/[^\d]/,'');
        });
    });
    root.querySelectorAll("div.title input, .content .name input").forEach((element)=>{
        element.addEventListener('keypress', (event)=>{
            if(event.key === 'Enter')
                element.blur();
        });
        element.addEventListener('blur', (event)=>{
            deactivateTextInput(event.target);
        });
    });
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








