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
    // shadow dom 활성화
    const embed = root.querySelectorAll("remote-html-embed");
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
    // 문제가 1개 밖에 없어서 항상 0 이다.
    let questionNumber = 0;
    const questions = container.querySelectorAll('.question');
    for(let i = 0; i < questions.length; i++){
        const target = questions[i].classList;
        if(i === questionNumber)
            target.remove("hide");
        else
            target.add("hide");
    }
    //
    const aniEmbed = root.querySelector('#left_area').querySelectorAll("remote-html-embed")[0];
    if(aniEmbed.shadowRoot.autoScale)
        aniEmbed.shadowRoot.autoScale();
    if(containerIndex === 0 || containerIndex===1){
        if(aniEmbed.shadowRoot.showStepTwoWithIntro)
            aniEmbed.shadowRoot.showStepTwoWithIntro(containerIndex!==0);
    }else{
        if(aniEmbed.shadowRoot.showStepTwo)
            aniEmbed.shadowRoot.showStepTwo(containerIndex!==2);
    }
}

const resetAllAnswer = ()=>{
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
            activateQuestionContainer(index);
        }
    })
    //

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
        if(element !== box && element.value.length===0 && !element.classList.contains('gray'))
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
    if(box.value.length < 1 && !isKeyboardActive && !box.classList.contains('gray')){
        box.value = ""; // 도트만 있는 경우 length 가 0 임으로 도트를 지워준다.
        box.parentElement.querySelector('.pencil').classList.remove('hide');
        return true;
    }
    return false;
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
            const possibleLength = index === 0? 2:
                index===1?1:
                    index===2?2:
                        index===3?2:
                            index===4?1:
                                index===5?2:
                                    index===6?1:
                                        index===7?2:
                                            index===8?2:1;
            if(box.value.length >= possibleLength && value!=="del"){
                return;
            }
            if(value==="del" && box.value.length > 0){
                box.value = box.value.substring(0, box.value.length-1);
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
            const numerator = event.detail.message.numerator;
            const denominator = event.detail.message.denominator;
            root.querySelectorAll('.numerator_value').forEach((numerator_value)=>{
                numerator_value.innerHTML = numerator;
            })
            root.querySelectorAll('.denominator_value').forEach((denominator_value)=>{
                denominator_value.innerHTML = denominator;
            })
            root.querySelectorAll('.numerator_input').forEach((input)=>{
                input.dataset.answer = numerator;
            })
            root.querySelectorAll('.denominator_input').forEach((input)=>{
                input.dataset.answer = denominator;
            })
            root.querySelectorAll('.quotient_input').forEach((input)=>{
                input.dataset.answer = Math.floor(numerator/denominator);
            })
            root.querySelectorAll('.remainder_input').forEach((input)=>{
                input.dataset.answer = numerator % denominator;
            })
            // 을, 를 변환
            const m = numerator % 10;
            const particleAlphabet = (m===2 || m===4 || m===5 || m===9)?'를':"을";
            root.querySelectorAll('.numerator_particle').forEach((particle)=>{
                particle.innerHTML = particleAlphabet;
            })
        }
        else if (event.detail.message.type === "dragComplete"){
            // 박스를 활성화
            root.querySelectorAll('.red_box').forEach((box)=>{
                box.classList.remove('gray');
                const pencil = box.parentElement.querySelector('.pencil');
                pencil.classList.add('active');
                if(box.value.length < 1){
                    pencil.classList.remove('hide');
                }
            });
        }
        else if (event.detail.message.type === "valueComplete"){
            // 이때는 나눠지는 수와 나누는 수만 활성화...
            root.querySelectorAll('.numerator_input').forEach((box)=>{
                box.classList.remove('gray');
                const pencil = box.parentElement.querySelector('.pencil');
                pencil.classList.add('active');
                pencil.classList.remove('hide');
            });
            root.querySelectorAll('.denominator_input').forEach((box)=>{
                box.classList.remove('gray');
                const pencil = box.parentElement.querySelector('.pencil');
                pencil.classList.add('active');
                pencil.classList.remove('hide');
            });
        }
    });
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