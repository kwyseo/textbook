import {dispatchEvent, initDefault} from "../common.js";

const metaUrl = import.meta.url;
let root;
let tabButtons = [];
let questionContainers = [];

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
    // shadow dom 활성화
    const embed = root.querySelectorAll("remote-html-embed");
    for(let i = 0; i < embed.length; i++){
        if(containerIndex===i) {
            embed[i].classList.remove("hide");
            embed[i].shadowRoot.autoScale();
            embed[i].shadowRoot.reset();
        }
        else
            embed[i].classList.add("hide");
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
    containerIndex = 0;
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
    let questionNumber = 0;
    const questions = container.querySelectorAll('.question');
    for(let i = 0; i < questions.length; i++){
        const target = questions[i].classList;
        if(i === questionNumber)
            target.remove("hide");
        else
            target.add("hide");
    }
}

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const resetAllAnswer = ()=>{
    root.querySelectorAll(".red_box").forEach((box)=>{
        box.value = "";
        box.classList.remove("correct");
        box.disabled = false;
    });
    root.querySelectorAll(".pencil").forEach((pencil)=>{
        pencil.classList.remove("hide");
    });
    // 두번째 문제는 안보이게 한다.
    root.querySelectorAll(".paragraph").forEach((paragraph, index)=>{
        if(index%2===1){
            paragraph.classList.add("hide");
            const value = index === 1 ? getRandomNumber(11, 99): getRandomNumber(101, 999);
            const result = index === 1 ? value / 100: value / 1000;
            paragraph.querySelector('.start_value').innerHTML = value;
            const red_boxes = paragraph.querySelectorAll('input.red_box');
            red_boxes[0].dataset.answer = value + "";
            red_boxes[2].dataset.answer = result + "";
        }
    });
}

// 이것은 reset 과 달리 문제를 바꾸는 것이다.
const refresh = ()=>{
    // 먼저 선택된 것을 찾는다.
    questionContainers.forEach((element, index)=>{
        if(!element.classList.contains("hide")){
            activateQuestion(index);
        }
    })
}
const reset = ()=>{
    activateQuestionContainer(0);
    resetAllAnswer();
    root.querySelector('#left_area').querySelectorAll("remote-html-embed")
        .forEach((embed)=>{
            if(!embed.classList.contains("hide"))
                embed.shadowRoot.autoScale();
            embed.shadowRoot.reset();
        })
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
        box.classList.add("blinking-text-first2");
        setTimeout(()=>{
            box.classList.remove("blinking-text-first2");
            box.classList.add("blinking-text2");
            setTimeout(()=>{
                box.value = "";
                box.classList.remove("blinking-text2");
                /*
                root.querySelectorAll(".red_box").forEach((element, index)=>{
                    if(element === box){
                        dispatchEvent(root, {type:"keyboard", target: index});
                    }
                });
                */
                box.focus();
                box.classList.remove("check_input");
                const isKeyboardActive = !document.querySelector('.keyboard').classList.contains('hide');
                if(checkPhone() && !isKeyboardActive){
                    // 폰의 경우에는 연필모양을 다시 넣자.
                    box.parentElement.querySelector('.pencil').classList.remove('hide');
                }
            }, 2000);
        }, 500);
        return false;
    }else{
        box.classList.add("correct");
        dispatchEvent(root, {type:"close_keyboard"});
        box.classList.remove("check_input");
        box.disabled = true;
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
        if(isComplete && paragraphs[1].classList.contains("hide"))
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
const checkPhone = () => {
    let agent = navigator.userAgent;
    //모바일 체크
    const isMobile = /iphone|ipod|android|blackberry|windows phone|opera mini|iemobile|mobile|samsungbrowser/i.test(agent);

    // iPad IOS 13버전 이후로는 웹 형식으로 나와서 별도 비교 로직 추가
    const isIpad = /iPad|Macintosh/.test(agent) && 'ontouchend' in document;
    return isMobile || isIpad;
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
    root.quertyClicked = (value, index)=>{
        const box = root.querySelectorAll('.red_box')[index];
        if(box){
            box.focus();
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
    /*
    if(checkPhone()) {
        root.querySelectorAll('input').forEach((input) => {
            input.setAttribute('readonly', true);
        })
    }
     */
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
        }
    }
})