import {dispatchEvent, initDefault} from "../common.js";

const metaUrl = import.meta.url;
let root;
let tabButtons = [];
let questionContainers = [];
let selectedIndex = -1;
const container2Answers = [
    [1, 0, 2],
    [2, 3, 1],
    [2, 1, 2],
    [6, 2, 2],
    [0, 1, 6],
    [5, 1, 1]
]
const container3Answers = [
    ["true", "true", "false", "true", "false"],
    ["true", "true", "false", "true", "false"],
    ["true", "true", "false", "false", "false"],
    ["true", "false", "false", "true", "false"],
    ["true", "true", "false", "true", "false"]
]
const container4Answers = ['오각형', '칠각형', '팔각형', '구각형']

const onClickTabButton = (button, index)=>{
    if(button.classList.contains("header_clicked"))
        return;
    // 메인에 탭 변경을 알린다.
    dispatchEvent(root, {type:"tapChange", tab: index});
    activateQuestionContainer(index);
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
        tabs[2].classList.add("border_right");
    }
    else if(containerIndex===1){
        tabs[2].classList.add("border_right");
    }
    else if(containerIndex===2){
        tabs[0].classList.add("border_right");
    }
    else {
        tabs[0].classList.add("border_right");
        tabs[1].classList.add("border_right");
    }
    // 질문 컨테이너 활성화
    questionContainers.forEach((element, index)=>{
        if(index === containerIndex)
            element.classList.remove("hide");
        else
            element.classList.add("hide");
    })
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
    const container = questionContainers[containerIndex];

    const embed = root.querySelector('#left_area').querySelector("remote-html-embed");
    if(embed.shadowRoot.autoScale)
        embed.shadowRoot.autoScale();
    if(embed.shadowRoot.reset) {
        if(containerIndex === 0) {
            embed.shadowRoot.reset(0);
            const questions = container.querySelectorAll('.question');
            let showIndex = getRandomNumberExcluding(0, questions.length -1);
            //showIndex = 1;
            questions.forEach((question, questionIndex)=>{
                if(questionIndex===showIndex)
                    question.classList.remove('hide');
                else
                    question.classList.add('hide');
            })
        }
        else if(containerIndex === 1){
            let showIndex = getRandomNumberExcluding(0, container2Answers.length -1);
            //showIndex = 0;
            //selectedIndex = showIndex;
            embed.shadowRoot.reset(1, showIndex);
            container.querySelectorAll('.red_box').forEach((input, inputIndex)=>{
                input.dataset.answer = container2Answers[showIndex][inputIndex];
            })
            // 이건 질문이 하나밖에 없다.
            container.querySelector('.question').classList.remove('hide');

        }
        else if(containerIndex === 2){
            // 이것 이미지는 6부터 시작
            let tempIndex = getRandomNumberExcluding(0, container3Answers.length -1);
            let showIndex = tempIndex + 6;
            //showIndex = 10;
            //tempIndex = showIndex - 6;
            //selectedIndex = showIndex - 6;
            embed.shadowRoot.reset(1, showIndex);
            container.querySelectorAll('.polygon_check_box').forEach((checkBox, checkBoxIndex)=>{
                checkBox.dataset.answer = container3Answers[tempIndex][checkBoxIndex];
            })
            // 이건 질문이 하나밖에 없다.
            container.querySelector('.question').classList.remove('hide');
        }
        else if(containerIndex === 3){
            embed.shadowRoot.reset(0);
            let tempIndex = getRandomNumberExcluding(0, container4Answers.length - 1);
            root.querySelector('.polygon_name').innerHTML = container4Answers[tempIndex];
            // 이건 질문이 하나밖에 없다.
            container.querySelector('.question').classList.remove('hide');
        }
    }
}


const getRandomNumberExcluding = (min, max) =>{
    let randomNumber;
    do { randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; }
    while (selectedIndex===randomNumber);
    selectedIndex = randomNumber;
    return randomNumber;
}

const resetAllAnswer = ()=>{
    root.querySelectorAll('.capture_div').forEach((captureDiv)=>{
        captureDiv.querySelector('.explain').classList.remove('hide');
        captureDiv.style.backgroundImage = "none";
    });
    root.querySelectorAll('.polygon_check_box').forEach((checkBox)=>{
        checkBox.classList.remove('active');
        checkBox.classList.remove('disabled');
        checkBox.querySelector('.red_check').classList.add('hide');
        checkBox.querySelector('.red_check').classList.remove('blinking_select');
    });
    root.querySelectorAll(".red_box").forEach((box)=>{
        box.value = "";
        box.classList.remove("correct");
        box.classList.add("gray");
        box.disabled = false;
    });
    root.querySelectorAll(".pencil").forEach((pencil)=>{
        pencil.classList.add("hide");
        pencil.classList.remove("active");
    });
}
const refresh = ()=>{
    // 먼저 선택된 것을 찾는다.
    questionContainers.forEach((element, index)=>{
        if(!element.classList.contains("hide")){
            activateQuestion(index);
        }
    })
}
const reset = (toEmbed = true)=>{
    activateQuestionContainer(0);
}

const checkInputLength = (box) =>{
    const answer = box.dataset.answer;
    if(box.value.length < answer.length){
        // 계속 입력을 받는다.
        return false;
    }
    box.classList.add("check_input");
    // 커서를 안보이게 하기 위하여 넣음
    //box.blur();
    checkInputValue(box);
}

// 로직을 바꿔서 이 함수는 blur 가 실행될 때만 호출된다.
const checkInputValue = (box) => {
    box.blur();
    box.classList.remove("correct");
    const answer = box.dataset.answer;
    // 만일 쿼티 키보드가 있는 경우
    if(box.value !== answer){
        box.classList.add("blinking-text-first");
        setTimeout(()=>{
            box.classList.remove("blinking-text-first");
            box.classList.add("blinking-text");
            setTimeout(()=>{
                box.value = "";
                box.classList.remove("blinking-text");
                root.querySelectorAll(".red_box").forEach((element, index)=>{
                    if(element === box){
                        dispatchEvent(root, {type:"keyboard", target: index});
                    }
                });
                box.focus();
                box.classList.remove("check_input");
            }, 2000);
        }, 500);
        return false;
    }else{
        box.classList.add("correct");
        box.disabled = true;
        dispatchEvent(root, {type:"close_keyboard"});
        box.classList.remove("check_input");
        // 다음 문제를 보여줄지 확인한다.
        let ancestor = box.parentElement;
        while(true){
            ancestor = ancestor.parentElement;
            if(ancestor.classList.contains("question")) {
                break;
            }
        }
        // 다음을 첫번째 질문에 모두 답했는지 확인한다.
        const paragraphs = ancestor.querySelectorAll('.paragraph');
        let isComplete = true;
        paragraphs[0].querySelectorAll('.red_box').forEach((element)=>{
            if(!element.classList.contains('correct'))
                isComplete = false;
        })
        // 모두 답했으면 2번째 문제를 보여준다.
        if(isComplete && paragraphs[1] && paragraphs[1].classList.contains("hide"))
            paragraphs[1].classList.remove("hide");
        return true;
    }
}
const checkFocus = (box) => {
    const boxes = root.querySelectorAll('.red_box');
    for(let i = 0; i < boxes.length; i++){
        const element = boxes[i];
        if(element !== box && element.value.length!==0 && element.value.length < element.dataset.answer.length){
            box.blur();
            if(box.value.length < 1){
                box.parentElement.querySelector('.pencil').classList.remove('hide');
            }
            checkInputValue(element);
            const pageIndex = root.querySelector('#view-wrap').dataset.index;
            dispatchEvent(root, {type:"keyboard", target: i, page: pageIndex});
            break;
        }
        if(element !== box && element.value.length===0)
            element.parentElement.querySelector('.pencil').classList.remove('hide');
    }
}
const checkBlur = (box) =>{
    const isKeyboardActive = !document.querySelector('.keyboard').classList.contains('hide');
    const isInputCheck = box.classList.contains("check_input");
    // blur 가 됬을 때 값 체크를 하지 않는 경우는
    // 1. check_input 클래스가 있는 경우
    // 2. 쿼티 키보드가 있는 경우
    // 3. 입력을 완료하기 않고 다른 input 을 눌렀을 때에는 쿼티 자판이 살아있다.
    if(box.value.length > 0 && !isInputCheck && !isKeyboardActive){
        // 쿼티 자판으로 입력되는 것은 걱정하지 않아도 되는 것이
        // 쿼티로 입력하면 이것이 먼저 실행되고 클릭 이벤트가 실행됨으로 아래 체크는 기존 것만으로 하는 것이다.
        checkInputValue(box);
    }
    if(box.value.length < 1 && !isKeyboardActive){
        box.value = ""; // 도트만 있는 경우 length 가 0 임으로 도트를 지워준다.
        box.parentElement.querySelector('.pencil').classList.remove('hide');
        return true;
    }
    return false;
}

const captureImage = (event, captureDiv, containerIndex)=>{
    let shadowRoot = root.querySelector('#left_area').querySelector("remote-html-embed").shadowRoot;
    const content = shadowRoot.querySelector('.ukp__box_content');
    //const content = shadowRoot.querySelector('.ukp__js_wrap_box');
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
        // 이제 dim 을 씌워야 한다.
        if(containerIndex!==3) {
            const container = root.querySelectorAll('.question_container')[containerIndex];
            const questions = container.querySelectorAll('.question');
            if (containerIndex === 0) {
                for (let i = 0; i < questions.length; i++) {
                    const question = questions[i];
                    if (!question.classList.contains('hide')) {
                        dispatchEvent(root, {type: "popup", container: containerIndex, target: i});
                        break;
                    }
                }
            } else if (containerIndex === 1) {
                dispatchEvent(root, {type: "popup", container: containerIndex, target: selectedIndex});
            }
        }
    }).catch(function(error) {
        document.querySelector("#loading").style.display = "none"
    });
    // 캡쳐할 때 일시적으로 변경시킨 CSS 복구-------------------
    wrap.style.transform = originalTransform;

}

const isCheckComplete = ()=>{
    const boxes = root.querySelectorAll('.polygon_check_box');
    for(let i = 0; i < boxes.length; i++) {
        const answer = boxes[i].dataset.answer;
        const check = !boxes[i].querySelector('.red_check').classList.contains('hide');
        if (answer === "true" && !check) {
            return false;
        }
    }
    return true;
}

const checkBoxAnswer = ()=>{
    let isAllCorrect = true;
    const boxes = root.querySelectorAll('.polygon_check_box');
    boxes.forEach((checkBox)=>{
        const answer = checkBox.dataset.answer;
        const check = !checkBox.querySelector('.red_check').classList.contains('hide');
        if((answer==="true" && !check) || (answer==="false" && check)){
            isAllCorrect = false;
        }
    });
    boxes.forEach((checkBox)=>{
        if(isAllCorrect){
            if(checkBox.dataset.answer === "true"){
                checkBox.classList.add('active');
            }else{
                checkBox.classList.remove('active');
            }
            checkBox.classList.add('disabled');
        }else{
            checkBox.classList.remove('active');
            checkBox.classList.remove('disabled');
        }
    });
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

    root.querySelectorAll(".red_box").forEach((box, index)=>{
        box.onclick = (event)=>{
            event.preventDefault();
            event.stopPropagation();
            box.parentElement.querySelector(".pencil").classList.add("hide");
            dispatchEvent(root, {type:"keyboard", target: index});
            box.focus();
        }
        box.onkeyup = (event)=> {
            checkInputLength(box);
        }
        /* 이게 붙지 않아서 window 에 붙이는 편법을 사용했다.
        box.onkeydown = (event)=> {
            alert("ddd")
            event.preventDefault();
        }
         */
        box.addEventListener('focus', function(event) {
            checkFocus(box);
        });
        box.addEventListener('blur', function(event) {
            const result = checkBlur(box);
            if(!result){
                setTimeout(()=>{checkBlur(box)}, 300);
            }
        });
    })
    root.querySelectorAll(".pencil").forEach((pencil)=>{
        pencil.onclick = (event)=>{
            event.preventDefault();
            event.stopPropagation();
            pencil.parentElement.querySelector('.red_box').click();
        }
    })
    // 초기에 reset 을 실행하면 문제 발생
    // 내 생각에는 remote-html-embed 를 hide 시키는데,
    // 그 다음에 다어어그램의 autoScale 이 실행되는 것 같다.
    //reset();
    resetAllAnswer();
    activateQuestion(0)
    root.reset = ()=>{ reset()}
    root.clear = ()=>{
        resetAllAnswer();
        let containerIndex = 0;
        questionContainers.forEach((element, index)=>{
            if(!element.classList.contains("hide")){
                containerIndex = index;
            }
        });
        const embed = root.querySelector('#left_area').querySelector("remote-html-embed");
        if(containerIndex === 0) {
            embed.shadowRoot.reset(0);
        }else if(containerIndex===1){
            embed.shadowRoot.reset(1, selectedIndex);
        }
    }
    root.clickOK = ()=>{
        root.querySelectorAll('.red_box').forEach((box)=>{
            box.classList.remove('gray');
        });
        root.querySelectorAll('.pencil').forEach((pencil)=>{
            pencil.classList.add('active');
            pencil.classList.remove('hide');
        });
    }
    root.quertyClicked = (value, index)=>{
        const box = root.querySelectorAll('.red_box')[index];
        if(box){
            box.focus();
            // 한자리만 가능하다.
            const possibleLength = 1;
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
            checkInputLength(box);
        }
    }
    root.querySelector('#left_area')?.addEventListener("callToParent", (event) => {
        event.stopImmediatePropagation();
        if (event.detail.message.type === "initValue") {

        }
        else if (event.detail.message.type === "dragComplete"){

        }
        else if (event.detail.message.type === "valueComplete"){

        }
    });
    root.querySelectorAll('.capture_div').forEach((captureDiv)=>{
        const button = captureDiv.querySelector('.button');
        button.onclick = (event)=>{
            const containerIndex = parseInt(button.dataset.container);
            captureImage(event, captureDiv, containerIndex);
        };
    })
    root.querySelectorAll('.polygon_check_box').forEach((checkBox)=>{
        checkBox.onclick = (event)=>{
            const check = checkBox.querySelector('.red_check');
            if(check.classList.contains('hide')) {
                const answer = checkBox.dataset.answer;
                if(answer === "true") {
                    check.classList.remove('hide');
                    checkBoxAnswer();
                }else{
                    check.classList.add('blinking_select');
                    check.classList.remove('hide');
                    setTimeout(() => {
                        check.classList.remove('blinking_select');
                        check.classList.add('hide');
                        check.style.opacity = 1;
                        checkBoxAnswer();
                    }, 2000);
                }
            }
            else {
                check.classList.add('hide');
                // 체크를 해제함으로서 정답이 될 수도 있다.
                checkBoxAnswer();
            }
        };
    })
}

window.addEventListener('script-loaded', async function (ev) {
    if (root)
        return;
    root = initDefault(ev);
    init(ev);
    // 이상하게 keydown 이벤트가 붙지 않아서 편법을 사용
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
    window.problemQuotientKeyDown = (event)=>{
        if(!checkKeyDownLength(event, 2))
            return;
        problemNumberKeyDown(event);
    }
    window.problemRemainderKeyDown = (event)=>{
        if(!checkKeyDownLength(event, 1))
            return;
        problemNumberKeyDown(event);
    }
})