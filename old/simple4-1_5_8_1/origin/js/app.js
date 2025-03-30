import anime from "./anime.js";
//import qwerty from "./qwerty.js";

const metaUrl = import.meta.url;
let root;
let scale = 1;  // 화면 스케일링 값
let methodPage = 1;
let dragObject = null;

const toggleFullScreen = (event) => {
    event.stopPropagation();
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
    root.querySelectorAll(".input").forEach((element)=> {
        element.value = "";
        element.style.display = "none";
    });
    methodPage = 1;
    // 바 초기화
    root.querySelectorAll('.drag .drag_bar').forEach((drag)=>{
        drag.querySelector('.bar').style.display = "none";
        drag.style.transform = `translate(0px, 0px)`;
        drag.dataset.x = "";
        drag.dataset.y = "";
    });
    startScaffolding();
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
    let input = root.querySelector(".title .input");
    /*
    qwerty.activate(input, 'title', (text, isEnter = false)=>{
        if(isEnter){ // 엔터를 누르거나 창이 닫히는 경우
        }
    });
     */
    // 쿼티를 사용하지 않아서 추가
    activateTextInput(input);
}

const checkModal = () => {
    return window.getComputedStyle(root.querySelector(".modal_graph")).getPropertyValue("display") !== "none"
        || window.getComputedStyle(root.querySelector(".modal_method")).getPropertyValue("display") !== "none"
        || window.getComputedStyle(root.querySelector(".modal_qwerty")).getPropertyValue("display") !== "none";

}

const onClickDrag = (event) =>{
    if(checkModal())
        return;
    const classes = event.target.classList;
    if(classes.contains("bar") || classes.contains("drag_bar"))
        return;
    // 여기까지 왔으면 바를 그려준다. 그럴려면 drag 를 찾아야 한다.
    const dragBars = root.querySelectorAll(".bar_div .drag_bar");
    const clientX = event.clientX ? event.clientX : event.changedTouches[0].clientX;
    for(let i = 0; i < dragBars.length; i++){
        const drag = dragBars[i];
        const dragRect = drag.getBoundingClientRect();
        if(clientX > dragRect.left && clientX < dragRect.right){
            const clientY = event.clientY ? event.clientY : event.changedTouches[0].clientY;
            const divRect = root.querySelector(".bar_div").getBoundingClientRect();
            const yDefault = (clientY - divRect.top)/(scale / 100);
            setBar(drag, yDefault);
            break;
        }
    }
}

const setBar = (drag, yDefault) => {
    const divHeight = root.querySelector('.bar_div').offsetHeight;
    const heightCount = 100;
    let height = divHeight / heightCount;
    if (yDefault < 0){
        yDefault = 0;
    }
    if(yDefault >= height*heightCount - height / 2){
        drag.querySelector('.bar').style.display = "none";
        drag.style.transform = `translate(0px, 0px)`;
        drag.dataset.x = "";
        drag.dataset.y = "";
        return
    }
    for (let i = 0; i < heightCount; i++) {
        const min = i * height - height / 2;
        const max = i * height + height / 2;
        if (yDefault >= min && yDefault <= max) {
            let targetY = i * height;
            drag.style.transform = `translate(${drag.dataset.translateX}px, ${targetY}px)`;
            drag.querySelector(".bar").style.height = (divHeight - targetY)+"px";
            break;
        }
    }
}

const setDragAndDrop = () => {
    const dragBars = root.querySelectorAll(".drag .drag_bar");
    for(let i = 0; i < dragBars.length; i++){
        const drag = dragBars[i];
        drag.dataset.startTranslateX = 0;
        drag.dataset.startTranslateY = 0;
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
            bar.style.height = "100%";
            // 왼쪽이나 오른쪽에 회색 표시
            const leftDiv = root.querySelector('.bar_div').getBoundingClientRect().left;
            // 정보를 얻을 바를 얻는다.
            const targetDrag = drag.classList.contains('drag_22') ?
                drag.parentElement.querySelector('.drag_23')
                :drag.parentElement.querySelector('.drag_22');
            const left = targetDrag.getBoundingClientRect().left;
            const cover = root.querySelector('.bar_cover');
            cover.style.left = (left - leftDiv)/(scale/100)+ "px";
            cover.style.width = drag.offsetWidth + "px";
            cover.style.display = 'flex';
            if(!drag.dataset.y){
                // 처음이면 마우스 윗쪽으로 바를 만들어 준다.
                const dragRect = drag.getBoundingClientRect();
                const mouseYPoint = event.clientY?event.clientY:event.touches[0].clientY;
                const moveDistance = mouseYPoint - dragRect.top - 2;
                drag.style.transform = `translate(0px, ${moveDistance / (scale / 100)}px)`;
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
                const clientY = event.clientY?event.clientY:event.touches[0].clientY;
                const y = (clientY - drag.dataset.y) / (scale / 100) + 1 * drag.dataset.translateY;
                //x 축으로는 움직이지 않는다.
                drag.style.transform = `translate(${drag.dataset.translateX}px, ${y}px)`;
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
                    const clientY = event.clientY ? event.clientY : event.changedTouches[0].clientY;
                    let yDefault = (clientY - drag.dataset.y) / (scale / 100) + 1 * drag.dataset.translateY;
                    // 드래그를 하지 않는 경우
                    if (Math.abs(clientY - drag.dataset.y) < 1) {
                        if(drag.dataset.init === "true"){
                            yDefault += 2;
                        }else{
                            const divRect = root.querySelector(".bar_div").getBoundingClientRect();
                            yDefault = (clientY - divRect.top)/(scale / 100);
                        }
                    }
                    setBar(drag, yDefault);
                    drag.dataset.init = "false";
                    root.querySelector('.bar_cover').style.display = "none";
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
    stopScaffolding();
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

const stopScaffolding = (event) => {
    if(event && event.target.classList.contains("btn-refresh")){
        return;
    }
    const scaffolding = root.querySelector(".scaffolding");
    scaffolding.style.display = "none";
    anime.remove(scaffolding);
}

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
    startScaffolding();
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

    setDragAndDrop();

    root.querySelector(".btn-fullscreen").addEventListener('click', (event) => toggleFullScreen(event));
    root.querySelector(".btn-refresh").addEventListener('click', onClickRefresh);
    root.querySelector(".btn-method").addEventListener('click', onClickMethod);
    root.querySelector(".modal_method .left").addEventListener('click', ()=>onClickMethodWipe(-1));
    root.querySelector(".modal_method .right").addEventListener('click', ()=>onClickMethodWipe(1));
    root.querySelector(".modal_method .close").addEventListener('click', onClickMethod);
    root.querySelector(".btn-graph").addEventListener('click', onClickGraph);
    root.querySelector(".modal_graph .close").addEventListener('click', onClickGraph);
    root.querySelector(".container.title .title").addEventListener('click', onClickTitle);
    root.querySelector(".title .input").addEventListener('click', onClickTitle);
    root.querySelectorAll("input").forEach((element)=>{
        element.addEventListener('keydown', (event)=>{
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
    });
    root.querySelectorAll(".bar_div .drag").forEach((element)=>{
        element.addEventListener('mouseup', (event)=>onClickDrag(event));
    });
    root.addEventListener('click', stopScaffolding);
    root.querySelectorAll("div.title input").forEach((element)=>{
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








