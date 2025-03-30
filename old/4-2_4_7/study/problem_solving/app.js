import {dispatchEvent, initDefault} from "../common.js";

const metaUrl = import.meta.url;
let root;
let tabButtons = [];
let questionContainers = [];
let imageIndex = -1;
let isScrollDrag = false;
const onClickTabButton = (button, index)=>{
    if(button.classList.contains("header_clicked"))
        return;
    // 메인에 탭 변경을 알린다.
    dispatchEvent(root, {type:"tapChange", tab: index});
    activateQuestionContainer(index);
}
const getRandomNumberExcluding = (min, max) =>{
    let randomNumber;
    do { randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; }
    while (imageIndex===randomNumber);
    imageIndex = randomNumber;
    return randomNumber;
}
const activateQuestionContainer = (containerIndex) =>{
    tabButtons.forEach((element)=>{
        element.classList.remove("header_clicked");
    });
    tabButtons[containerIndex].classList.add("header_clicked");
    // 선을 그려주어야 한다.
    const tabs = root.querySelectorAll('.tab_btn');
    tabs.forEach((tab)=>{
        tab.classList.remove("border_left");
        tab.classList.remove("border_right");
    })
    if(containerIndex===0){
        tabs[1].classList.add("border_right");
    }
    else if(containerIndex===1){
    }
    else if(containerIndex===2){
        tabs[0].classList.add("border_right");
    }
    // 질문 활성화
    activateQuestion(containerIndex);
}
const activateQuestion = (containerIndex)=>{
    /* 테스트 용
    containerIndex = 1;
    questionContainers.forEach((element, index)=>{
        if(index === containerIndex)
            element.classList.remove("hide");
        else
            element.classList.add("hide");
    })
    */
    //////////////////////////////
    // 일단 문제들을 다 초기하 한다.
    resetAllAnswer();
    const additionalQuestion = root.querySelector('.additional_question');
    if(containerIndex===1)
        additionalQuestion.classList.remove('hide');
    else
        additionalQuestion.classList.add('hide');
    root.querySelectorAll('.introduction').forEach((intro, introIndex)=>{
        if(introIndex === containerIndex)
            intro.classList.remove('hide');
        else
            intro.classList.add('hide');
    });
    const aniEmbed = root.querySelector('#left_area').querySelector("remote-html-embed");
    if(aniEmbed.shadowRoot.autoScale) {
        aniEmbed.shadowRoot.autoScale();
    }
    if(aniEmbed.shadowRoot.reset) {
        const imageArray = containerIndex===0? [1, 2, 3, 4, 5, 6, 7, 8]
            :containerIndex===1?[9, 10, 11, 12, 13]:[15, 16, 17, 18, 19, 20, 21, 22];
        let targetIndex = getRandomNumberExcluding(0, imageArray.length -1);
        //targetIndex = 0;
        if(containerIndex===2){
            aniEmbed.shadowRoot.reset(2, imageArray[targetIndex]);
        }else{
            aniEmbed.shadowRoot.reset(1, imageArray[targetIndex]);
        }
    }
}

const resetAllAnswer = ()=>{
    const captureDiv = root.querySelector('.capture_div');
    captureDiv.querySelector('.explain').classList.remove('hide');
    captureDiv.style.backgroundImage = "none";
    const selectBox = root.querySelector('.select_box');
    selectBox.classList.add('gray');
    selectBox.querySelector('.answer').innerHTML = "";
    selectBox.querySelector('.select_group').classList.add('hide');
    root.querySelector('.red_box').classList.add('gray');
    root.querySelector('.red_box').value = '';
    root.querySelector('.pencil').classList.add('hide');
}
const refresh = ()=>{
    // 먼저 선택된 것을 찾는다.
    root.querySelectorAll('.introduction').forEach((element, index)=>{
        if(!element.classList.contains("hide")){
            activateQuestion(index);
        }
    })
}
const reset = ()=>{
    activateQuestionContainer(0);
}

const captureImage = (event)=>{
    const captureDiv = root.querySelector('.capture_div');
    let shadowRoot = root.querySelector('#left_area').querySelector("remote-html-embed").shadowRoot;
    const content = shadowRoot.querySelector('.ukp__box_content');
    let wrap = document.querySelector(".wrap");
    const originalTransform = wrap.style.transform;

    // 캡쳐할 때 일시적으로 변경시킬 CSS -------------------------
    wrap.style.transform = `scale(1)`;
    //--------------------------------------------------

    document.querySelector("#loading").style.display = "block"

    // 캡쳐
    html2canvas(content, {
        useCORS: true,
        //logging: false,
        //width: 1220,
        //height: 649,
        ignoreElements: function(element) {
            return element.classList.contains('ukp__hide')
                || element.classList.contains('ukp__disabled')
                || element.classList.contains('ukp__svg')
                || element.classList.contains('hide');
        }
    }).then(function(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "middle"
        const imgData = canvas.toDataURL('image/png');
        captureDiv.querySelector('.explain').classList.add('hide');
        captureDiv.style.backgroundImage = "url('" + imgData + "')";
        document.querySelector("#loading").style.display = "none"
        document.querySelector("#loading").style.display = "none"
    }).catch(function(error) {
        document.querySelector("#loading").style.display = "none"
    });
    // 캡쳐할 때 일시적으로 변경시킨 CSS 복구-------------------
    wrap.style.transform = originalTransform;
    root.querySelector('.select_box').classList.remove('gray');
}
const onClickSelectBox = (element) =>{
    element.querySelector('.select_group').classList.remove('hide');
    const scrollDiv = root.querySelector('.scroll_div');
    scrollDiv.scrollTop = 0;
}

const popUp = ()=>{
    const index = root.querySelector(".view-wrap")?.dataset.index;
    //dispatchEvent(root, {type: "close_keyboard"});
    dispatchEvent(root, {type: "popup", target: 1});
}
const setDragAndDrop = () => {
    const drag = root.querySelector(".scrollbar-track");
    let offsetY;
    let scale = 1;
    const _onMouseMove = (event)=>{
        const top = (event.clientY - offsetY)/scale;
        if(top >= 11 && top <= 95 ) {
            drag.style.top = top + 'px';
            const scrollDiv = root.querySelector('.scroll_div');
            // const top = 11 + (scrollDiv.scrollTop * 84 / 187.52); // 기본 top 이 11px;
            const scrollTop = (top - 11)/84*187.52;
            scrollDiv.scrollTop = scrollTop;
        }
    }
    const _onMouseUp = (event)=>{
        event.preventDefault();
        event.stopPropagation();
        isScrollDrag = false;
        document.removeEventListener('mousemove', _onMouseMove);
        document.removeEventListener('mouseup', _onMouseUp);
        drag.style.cursor = 'grab';
    }
    const _onMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
        isScrollDrag = true;
        const wrap = document.querySelector('.wrap');
        const style = window.getComputedStyle(wrap);
        const transform = style.transform || style.webkitTransform || style.mozTransform;

        if (transform && transform !== 'none') {
            const matrix = transform.match(/^matrix\((.+)\)$/);
            if (matrix) {
                const values = matrix[1].split(', ');
                const scaleX = parseFloat(values[0]);
                const scaleY = parseFloat(values[3]);
                scale = scaleX;
            } else {
                scale = 1;
                console.log('지원되지 않는 변환 형식: ' + transform);
            }
        } else {
            scale = 1;
        }
        offsetY = event.clientY - drag.offsetTop;
        drag.style.cursor = 'grabbing';
        document.addEventListener('mousemove', _onMouseMove);
        document.addEventListener('mouseup', _onMouseUp);
    };

    drag.onmousedown = (event) => { _onMouseDown(event)}
    drag.ontouchstart = (event) => { _onMouseDown(event)}
    drag.onclick = (event)=>{
        event.preventDefault();
        event.stopPropagation();
    }
}
const init = (env) => {
    tabButtons = root.querySelectorAll(".tab_btn");
    tabButtons.forEach((element, index)=>{
        element.onclick = (event)=>{
            event.preventDefault();
            onClickTabButton(element, index)
        }
    });
    questionContainers = root.querySelectorAll(".question_container");
    const refreshButton = root.querySelector(".reset_btn");
    refreshButton.onclick = (event)=>{
        event.preventDefault();
        refresh();
    }

    // 초기에 reset 을 실행하면 문제 발생
    // 내 생각에는 remote-html-embed 를 hide 시키는데,
    // 그 다음에 다어어그램의 autoScale 이 실행되는 것 같다.
    //reset();
    resetAllAnswer();
    activateQuestion(0)
    root.reset = ()=>{
        reset();
    }
    root.quertyEnd = ()=>{
        popUp();
    }
    root.querySelector('.capture_div').querySelector('.button').onclick = captureImage;
    root.querySelector('#left_area')?.addEventListener("callToParent", (event) => {
        event.stopImmediatePropagation();
        if (event.detail.message.type === "initValue") {

        }
        else if (event.detail.message.type === "dragComplete"){

        }
        else if (event.detail.message.type === "valueComplete"){

        }
    });
    const selectBoxes = root.querySelectorAll(".select_box");
    selectBoxes.forEach((element, index)=>{
        element.onclick = (event)=>{
            event.preventDefault();
            event.stopPropagation();
            onClickSelectBox(element, index)
        }
        element.querySelectorAll('.answer_select')
            .forEach((box, boxIndex)=>{
                box.onmouseenter = ()=>{
                    box.classList.add("gray");
                }
                box.onmouseleave = ()=>{
                    box.classList.remove("gray");
                }
                box.onclick = (event)=>{
                    event.preventDefault();
                    event.stopPropagation();
                    element.querySelector('.answer').innerHTML = box.dataset.answer;
                    element.querySelector('.select_group').classList.add('hide');
                    root.querySelector('.red_box').classList.remove('gray');
                    root.querySelector('.red_box').value = '';
                    root.querySelector('.pencil').classList.remove('hide');
                }
            })
    });
    root.querySelector('.pencil').onclick = (event)=>{
        event.preventDefault();
        event.stopPropagation();
        root.querySelector('.red_box').click();
    }
    const redBox = root.querySelector('.red_box');
    redBox.onclick = (event)=>{
        event.preventDefault();
        event.stopPropagation();
        root.querySelector('.select_group').classList.add('hide');
        root.querySelector('.pencil').classList.add('hide');
        if(document.querySelector('.keyboard').classList.contains('hide')){
            redBox.value = '';
        }
        const pageIndex = root.querySelector('#view-wrap').dataset.index;
        dispatchEvent(root, {type:"keyboard", target: 0, page: pageIndex});
        redBox.focus();
    }
    redBox.onkeyup = ()=>{
        /*
        if(redBox.value.length > 0) {
            redBox.blur();
            popUp();
        }
         */
    }
    redBox.onblur = (event)=>{
        const keyboard = document.querySelector('.keyboard');
        if(redBox.value.length < 1) {
            root.querySelector('.pencil').classList.remove('hide');
        }
        else if (keyboard.classList.contains('hide')){
            popUp();
        }
    }
    root.quertyClicked = (value, index)=>{
        const box = root.querySelector('.red_box');
        if(box){
            const possibleLength = 2;
            if(box.value.length >= possibleLength && value!=="del"){
                return;
            }
            if(value==="del"){
                if(box.value.length > 0)
                    box.value = box.value.substring(0, box.value.length-1);
                else
                    box.value = "";
            }else{
                //box.value += value;
                box.value = box.value + value;
            }
            box.click();
        }
    }
    const scrollDiv = root.querySelector('.scroll_div');
    scrollDiv.addEventListener('scroll', function(event) {
        if(!isScrollDrag) {
            const scrollTrack = root.querySelector('.scrollbar-track');
            const top = 11 + (scrollDiv.scrollTop * 84 / 187.52); // 기본 top 이 11px;
            scrollTrack.style.top = top + "px";
        }
    });
    setDragAndDrop();
}

window.addEventListener('script-loaded', async function (ev) {
    if (root)
        return;
    root = initDefault(ev);
    init(ev);
    // 이상하게 keydown 이벤트가 붙지 않아서 편법을 사용
    window.problemNumberKeyDown = (event)=>{
        const key = event.key;
        // Allow only digits, backspace, arrow keys, delete
        if (!/[0-9]/.test(key) && key !== '.'&& key !== 'Backspace'
            && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Delete') {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    const problemNumberKeyDown = (event)=>{
        const key = event.key;
        // Allow only digits, backspace, arrow keys, delete
        if (!/[0-9]/.test(key) && key !== '.'&& key !== 'Backspace'
            && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Delete') {
            event.preventDefault();
        }
    }
    const checkKeyDownLength = (event, length)=>{
        const key = event.key;
        if(event.currentTarget.value.length > length - 1 && key !== 'Backspace'
            && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Delete'
        ){
            event.preventDefault();
            return false;
        }
        return true;
    }
    window.problemNominatorKeyDown = (event)=>{
        if(!checkKeyDownLength(event, 2))
            return;
        problemNumberKeyDown(event);
    }
    window.problemDenominatorKeyDown = (event)=>{
        if(!checkKeyDownLength(event, 1))
            return;
        problemNumberKeyDown(event);
    }
    window.onclick = (event)=>{
        root.querySelector('.select_group').classList.add('hide');
    }
})