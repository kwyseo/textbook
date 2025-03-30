import anime from "./anime.js";

const metaUrl = import.meta.url;
let root;
let scale = 1;  // 화면 스케일링 값
let dragObject = null;
let animation;

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen || document.msRequestFullscreen;
        requestFullScreen.call(root.firstElementChild);
    }else{
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        cancelFullScreen.call(document);
    }
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

const handGuideAnimation = () => {
    const guideHand = root.querySelector('.hand-guide');
    guideHand.addEventListener('mouseover', function() {
        //guideHand.style.display = 'none';
    });
    window.addEventListener('click', function() {
        guideHand.style.display = 'none';
    });
    animation = anime.timeline();
    animation.add({
            targets: guideHand,
            opacity: [0, 1,1,0],
            duration: 2000,
            easing:"linear"
        }
    ).add({
            targets: guideHand,
            opacity: [0, 1,1,0],
            duration: 2000,
            easing:"linear"
        }
    ).add({
            targets: guideHand,
            opacity: [0, 0,1],
            duration: 1000,
            easing:"linear"
        }
    );
}

const onClickArrow = (event, direction) => {
    if(event.target.classList.contains('off'))
        return;
    const content = root.querySelector('div.popup-content > div');
    const currentNumber = Number(content.dataset.value);
    // 앞에서 체크했으니까 범위 넘어가는 것은 걱정안해도 된다.
    const nextNumber = direction==="left" ? currentNumber -1: currentNumber + 1;
    if(nextNumber===2 || nextNumber ===3)
        event.target.classList.add('off');
    const reverse = root.querySelector(`.arrow-${direction==="left"?"right":"left"}`);
    reverse.classList.remove('off');
    content.classList.remove('content-'+currentNumber);
    content.classList.add('content-'+nextNumber);
    content.dataset.value = String(nextNumber);
}

const onClickButtonX = (event) => {
    const popup = root.querySelector('.popup');
    const classList = event.target.classList;
    if(classList.contains('off')){
        popup.style.display = 'flex';
        classList.remove('off');
    }else{
        classList.add('off');
        popup.style.display = 'none';
    }
}

const onClickButtonReset = (event) =>{
    event.stopPropagation();
    root.querySelectorAll('path.drop').forEach((zone)=>{
        zone.classList.remove('complete');
        zone.dragObject = null;
    })
    root.querySelectorAll('.drag-zone').forEach((zone, index)=>{
        setTransform(zone, 0, 0, 0);
        if(index ===0)
            zone.style.display = 'block';
        else
            zone.style.display = 'none';
        zone.style.opacity = 1;
        zone.querySelector('.btn-rotate').style.display='none';
    })
    // 밑의 팝업도 처음으로 되돌린다.
    root.querySelector('.popup').style.display = 'flex';
    root.querySelector('.btn-x').classList.remove('off');
    root.querySelector('.arrow-left').classList.add('off');
    root.querySelector('.arrow-right').classList.remove('off');
    const content = root.querySelector('div.popup-content > div');
    const currentNumber = Number(content.dataset.value);
    content.classList.remove('content-'+currentNumber);
    content.classList.add('content-2');
    content.dataset.value = String(2);
    // 손가락 움직임을 넣는다.
    const handGuide = root.querySelector('.hand-guide');
    handGuide.style.opacity=0;
    handGuide.style.display='block';
    animation.restart();
}

const getTransform = (element) => {
    const style = window.getComputedStyle(element);
    const tr = style.getPropertyValue("-webkit-transform") ||
        style.getPropertyValue("-moz-transform") ||
        style.getPropertyValue("-ms-transform") ||
        style.getPropertyValue("-o-transform") ||
        style.getPropertyValue("transform");
    let angle = 0;
    if(tr!=='none') {
        let values = tr.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
        const a = values[0];
        const b = values[1];
        angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    }
    let matrix = new WebKitCSSMatrix(style.transform);
    const translateX =  matrix.m41;
    const translateY =  matrix.m42;
    return [translateX, translateY, angle];
}

const setTransform = (element, x, y, angle) => {
    element.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
}

const checkDragPosition = (dragObject) => {
    const rec = dragObject.getBoundingClientRect();
    const centerX = (rec.left + rec.right)/2;
    const centerY = (rec.top + rec.bottom)/2;
    const parent = dragObject.parentElement.parentElement;
    const parentTransform = getTransform(parent);
    const dropZones = root.querySelectorAll('path.drop')
    for(let i = 0; i < dropZones.length; i++){
        const drop = dropZones[i];
        if(drop.dragObject)
            continue;
        // 화면 크기가 변하면 위치 값이 변함으로 매번 해야 한다.
        const rec = drop.getBoundingClientRect();
        const dropCenterX = (rec.left + rec.right)/2;
        const dropCenterY = (rec.top + rec.bottom)/2;
        const dropDegree = drop.classList.contains('reverse')?180:0;
        const xDiff = dropCenterX - centerX;
        const yDiff = dropCenterY - centerY;
        const degreeDiff = dropDegree - parentTransform[2];
        if(Math.abs(xDiff) < 15 && Math.abs(yDiff) < 15 && (Math.abs(degreeDiff) < 10 || Math.abs(degreeDiff) >350)){
            const x = xDiff / (scale / 100) + parentTransform[0];
            const y = yDiff / (scale / 100) + parentTransform[1];
            drop.dragObject = dragObject;
            drop.classList.add('complete');
            setTransform(parent, x, y, dropDegree);
            parent.style.opacity = 0;
            // drag 중에 display가 none 인 것을 찾아서 하나 활성한다.
            let dragZones = root.querySelectorAll('.drag-zone');
            for(let i = 0; i < dragZones.length; i++){
                if(dragZones[i].style.display === "none"){
                    dragZones[i].style.display = "block";
                    break;
                }
            }
            return true;
        }
    }
    // 여기까지 왔으면 원래 위치로 돌린다.
    root.querySelectorAll(".drag-zone").forEach((zone)=>{
        if(zone.style.display !== 'none' && zone.style.opacity!=="0" && zone !== parent)
            zone.style.display = 'none';
    });
    setTransform(parent, 0, 0, 0);
    return false;
}
const setDragAndDrop = () => {
    const rightBox = root.querySelector(".right-box");
    const dragZone = rightBox.querySelector(".drag-zone");
    for(let i = 0; i < 5; i++){
        const clone = dragZone.cloneNode(true);
        clone.style.display = "none";
        rightBox.appendChild(clone);
    }
    rightBox.querySelectorAll("svg > path").forEach((polygon) => {
        const _onMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation(); // 깔려있는 다른 폴리곤에 영향을 미치지 않도록
            let draggedIn = false;  // 드래그해서 회색 영격에 들어갔는지 표시
            if(dragObject)
                return;
            else
                dragObject = polygon;
            const parent = polygon.parentElement.parentElement;
            parent.style.opacity = 1;
            // drop zone 에서 이것을 가진 것이 있으면 분리한다.
            root.querySelectorAll('path.drop').forEach((drop) => {
                if(drop.dragObject === polygon){
                    drop.classList.remove('complete');
                    drop.dragObject = null;
                }
            });
            // 손 움직을 안보이게 한다.
            const handGuide = root.querySelector('.hand-guide');
            handGuide.style.opacity=0;
            handGuide.style.display='none';
            root.querySelectorAll(".drag-zone").forEach((zone)=>{
                zone.style.zIndex = 99;
            });
            parent.style.zIndex = 999;
            parent.querySelector('.btn-rotate').style.display='none';
            const transform = getTransform(parent);
            parent.dataset.translateX =  transform[0];
            parent.dataset.translateY =  transform[1];
            parent.dataset.rotateAngle = transform[2];
            parent.dataset.x = event.clientX?event.clientX:event.touches[0].clientX;
            parent.dataset.y = event.clientY?event.clientY:event.touches[0].clientY;
            const removeDragListener = () => {
                root.removeEventListener('mousemove', onMouseMove);
                root.removeEventListener('touchmove', onMouseMove);
                root.removeEventListener('mouseup', onDragEnd);
                root.removeEventListener('touchend', onDragEnd);
                //document.removeEventListener('mouseleave', onDragEnd);
            }
            const onMouseMove = (event) => {
                if(dragObject !== polygon)
                    return;
                const clientX = event.clientX?event.clientX:event.touches[0].clientX;
                const x = (clientX - parent.dataset.x) / (scale / 100) + 1 * parent.dataset.translateX;
                const clientY = event.clientY?event.clientY:event.touches[0].clientY;
                const y = (clientY - parent.dataset.y) / (scale / 100) + 1 * parent.dataset.translateY;
                const underElements = root.elementsFromPoint(clientX, clientY);
                const filterResult = underElements.filter((value) => value.classList.contains('drop'));
                if(filterResult.length > 0){
                    draggedIn = true;
                }
                // 다시 밖으로 나가면 튕겨낸다.
                if(draggedIn && filterResult.length < 1){
                    draggedIn = false;
                    dragObject = null;
                    removeDragListener();
                    root.querySelectorAll(".drag-zone").forEach((zone)=>{
                        if(zone.style.display !== 'none' && zone.style.opacity!=="0" && zone !== parent)
                            zone.style.display = 'none';
                    });
                    setTransform(parent, 0, 0, 0);
                    return;
                }
                // 도형을 움직인다.
                setTransform(parent, x, y, parent.dataset.rotateAngle);
            }
            root.addEventListener('mousemove', onMouseMove);
            root.addEventListener('touchmove', onMouseMove);
            const onDragEnd = (event, isDocumentLeave = false) => {
                removeDragListener();
                parent.querySelector('.btn-rotate').style.display='block';
                if(isDocumentLeave){
                    dragObject = null;
                }
                if(polygon === dragObject) {
                    dragObject = null;
                    const clientX = event.clientX ? event.clientX : event.changedTouches[0].clientX;
                    const clientY = event.clientY ? event.clientY : event.changedTouches[0].clientY;
                    const x = (clientX - parent.dataset.x) / (scale / 100) + 1 * parent.dataset.translateX;
                    const y = (clientY - parent.dataset.y) / (scale / 100) + 1 * parent.dataset.translateY;
                    setTransform(parent, x, y, parent.dataset.rotateAngle);
                    checkDragPosition(polygon);
                }
            }
            root.addEventListener('mouseup', onDragEnd);
            root.addEventListener('touchend', onDragEnd);
            //document.addEventListener('mouseleave', (event) => onDragEnd(event, true))
        }
        polygon.onmousedown = (event) => { _onMouseDown(event)}
        polygon.ontouchstart = (event) => { _onMouseDown(event)}
    })
}

const setRotate = () => {
    const _getAngle = (centerX, centerY, mouseX, mouseY) => {
        const rad = Math.atan2(mouseY - centerY, mouseX - centerX);
        return (rad*180)/Math.PI ;
    }
    const box = root.querySelector('.right-box');
    box.querySelectorAll('.drag-zone').forEach((dragZone)=>{
        const rotateButton = dragZone.querySelector('.btn-rotate');
        const _onMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const clientX = event.clientX?event.clientX:event.touches[0].clientX;
            const clientY = event.clientY?event.clientY:event.touches[0].clientY;
            const rec = dragZone.querySelector('svg > path').getBoundingClientRect();
            const left = (rec.right + rec.left) / 2;
            const top = (rec.bottom + rec.top) / 2;
            const startAngle = _getAngle(left, top, clientX, clientY);
            const dragTargetTransform = getTransform(dragZone);
            const onMouseMove = (event) => {
                const clientX = event.clientX?event.clientX:event.touches[0].clientX;
                const clientY = event.clientY?event.clientY:event.touches[0].clientY;
                const moveAngle = _getAngle(left, top, clientX, clientY) - startAngle;
                // 도형을 움직여 준다.
                setTransform(dragZone, dragTargetTransform[0], dragTargetTransform[1], dragTargetTransform[2] + moveAngle);
            }
            root.addEventListener('mousemove', onMouseMove);
            root.addEventListener('touchmove', onMouseMove);
            const onDragEnd = (event) => {
                root.removeEventListener('mousemove', onMouseMove);
                root.removeEventListener('touchmove', onMouseMove);
                root.removeEventListener('mouseup', onDragEnd);
                //root.removeEventListener('mouseleave', onDragEnd);
                root.removeEventListener('touchend', onDragEnd);
                /* 특별히 할 일이 없다
                const clientX = event.clientX ? event.clientX : event.changedTouches[0].clientX;
                const clientY = event.clientY ? event.clientY : event.changedTouches[0].clientY;
                const angle = _getAngle(left, rec, clientX, clientY);
                 */
            }
            root.addEventListener('mouseup', onDragEnd);
            //root.addEventListener('mouseleave', onDragEnd);
            root.addEventListener('touchend', onDragEnd);
        }
        rotateButton.onmousedown = (event) => { _onMouseDown(event)}
        rotateButton.ontouchstart = (event) => { _onMouseDown(event)}
    })
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
            btn.classList.remove('shrink');
        }else{
            const btn = root.querySelector(".btn-fullscreen");
            btn.classList.add('shrink');
        }
    };
    window.addEventListener("resize", _autoScale);
    _autoScale();
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
    // 뷰어가 input을 뺏어가는 것때문에 넣는다.
    root.querySelectorAll("input").forEach((element)=>{
        element.addEventListener('keydown', (event)=>{
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
    });
    checkIpad();
    handGuideAnimation();
    setDragAndDrop();
    setRotate();
    root.querySelector('.btn-fullscreen').addEventListener('click', toggleFullScreen);
    root.querySelector('.arrow-left').addEventListener('click',(event)=> onClickArrow(event, 'left'));
    root.querySelector('.arrow-right').addEventListener('click',(event)=> onClickArrow(event, 'right'));
    root.querySelector('.btn-x').addEventListener('click', onClickButtonX);
    root.querySelector('.btn-reset').addEventListener('click', onClickButtonReset);
    root.addEventListener('mousedown', ()=>{
        root.querySelectorAll('.btn-rotate').forEach((element)=>{
            element.style.display = 'none';
        })
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








