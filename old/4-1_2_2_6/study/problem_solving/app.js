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
    tabButtons[1].classList.remove("border_left");
    tabButtons[1].classList.remove("border_right");
    tabButtons[containerIndex].classList.add("header_clicked");
    if(containerIndex===0)
        tabButtons[1].classList.add("border_right");
    else if(containerIndex === 2)
        tabButtons[1].classList.add("border_left");
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
    initSelectBox();
    hideAllSelectList();
    resetAllAnswer();
    const container = questionContainers[containerIndex];
    let selectedQuestion = 0;
    const questions = container.querySelectorAll('.question');
    for(let i = 0; i < questions.length; i++){
        if(!questions[i].classList.contains("hide")){
            selectedQuestion = i;
        }
    }
    const questionNumber = getRandomNumberExcluding(0, questions.length-1, selectedQuestion);
    // 테스트 용
    //const questionNumber = 2;
    for(let i = 0; i < questions.length; i++){
        const target = questions[i].classList;
        if(i === questionNumber)
            target.remove("hide");
        else
            target.add("hide");
    }
}

const hideAllSelectList = ()=>{
    root.querySelectorAll('.select_big_list').forEach((target)=>{
        target.classList.add("hide");
    })
}

const resetAllAnswer = ()=>{
    root.querySelectorAll('.select_box_answer').forEach((target)=>{
        target.classList.add("hide");
    });
    root.querySelectorAll('.button').forEach((target)=>{
        target.classList.remove("answer");
    });
    root.querySelectorAll('.table').forEach((table)=>{
        table.querySelectorAll(".red_box").forEach((box)=>{
            box.value = "";
            box.classList.remove("correct");
        });
        table.querySelectorAll(".pencil").forEach((pencil)=>{
            pencil.classList.remove("hide");
        });
    })
}
const onClickSelectBox = (box) =>{
    if(!box.classList.contains("blue"))
        return;
    // 모든 리스트를 지운다.
    hideAllSelectList();
    box.querySelector(".select_big_list").classList.remove("hide");
}
const onClickSelectListBox = (listBox, index, parentIndex)=>{
    listBox.parentElement.classList.add("hide");
    listBox.parentElement.querySelectorAll('.select_list_box')
        .forEach((box)=>box.classList.remove("select_gray"));
    // 선택한 것 회색 표시 않토록 해 달란다.
    //listBox.classList.add("select_gray");
    const answerBox = listBox.parentElement.parentElement.querySelector(".select_box_answer");
    const userAnswer = index===0? "가": index===1? "나": "다";
    answerBox.innerHTML = userAnswer;
    const correctAnswer = answerBox.dataset.answer;
    if(correctAnswer!==userAnswer){
        answerBox.classList.add("blinking_select")
        answerBox.classList.remove("hide");
        setTimeout(()=>{
            answerBox.classList.add("hide");
            answerBox.classList.remove("blinking_select")
        }, 2000);
    }else {
        answerBox.classList.remove("hide");
        const group = listBox.parentElement.parentElement.parentElement;
        const selectBoxes = group.querySelectorAll(".select_box");
        for (let i = 0; i < selectBoxes.length; i++) {
            const answer = selectBoxes[i].querySelector(".select_box_answer");
            if (!answer || answer.classList.contains("hide")) {
                setBlueSelectBox(selectBoxes[i]);
                break;
            }
        }
    }
}

const onClickButton = (button, index)=>{
    const parent = button.parentElement.parentElement;
    const answer = parseInt(parent.dataset.answer);
    const answerButton =  parent.querySelectorAll(".button")[answer];
    // 일단 둘레를 지운다.
    answerButton.classList.remove("answer");
    button.opacity = 0;
    if(index !== answer){
        button.classList.add("blinking_button");
        setTimeout(()=>{
            button.classList.remove("blinking_button");
            //answerButton.classList.add("answer");
        }, 2000);
    }else{
        answerButton.classList.add("answer");
    }
}

const getRandomNumberExcluding = (min, max, exclude) => {
    let randomNumber;
    do { randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; }
    while (exclude===randomNumber);
    return randomNumber;
}

const setGraySelectBox = (box)=>{
    box.classList.remove("blue");
    box.classList.add("gray")
}
const setBlueSelectBox = (box)=>{
    box.classList.remove("gray");
    box.classList.add("blue")
}
const initSelectBox = ()=>{
    root.querySelectorAll(".select_box_group").forEach((group)=>{
        group.querySelectorAll('.select_box').forEach((box, index)=>{
            if(index === 0)
                setBlueSelectBox(box);
            else
                setGraySelectBox(box);
        })
    })
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
    initSelectBox();
    hideAllSelectList();
    resetAllAnswer();
    root.querySelector('#left_area').querySelectorAll("remote-html-embed")
        .forEach((embed)=>{
            if(!embed.classList.contains("hide"))
                embed.shadowRoot.autoScale();
            embed.shadowRoot.reset();
        })
}
const checkInputValue = (box) => {
    //box.parentElement.querySelector('.pencil').classList.add('hide');
    box.classList.remove("correct");
    const answer = box.dataset.answer;
    if(box.value !== answer){
        box.classList.add("caret_white");
        box.classList.add("blinking-text");
        setTimeout(()=>{
            box.value = "";
            box.classList.remove("blinking-text");
            box.classList.remove("caret_white");
            root.querySelectorAll(".red_box").forEach((element, index)=>{
                if(element === box){
                    dispatchEvent(root, {type:"keyboard", target: index});
                }
            });
            box.focus();
        }, 2000);
        return false;
    }else{
        box.blur();
        box.classList.add("correct");
        dispatchEvent(root, {type:"close_keyboard"});
        return true;
    }
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
    root.querySelectorAll(".select_box").forEach((selectBox, index)=>{
        selectBox.onclick = (event)=>{
            event.preventDefault();
            event.stopPropagation();
            onClickSelectBox(selectBox, index)
        }
        selectBox.querySelector(".select_big_list")?.querySelectorAll('.select_list_box')
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
                    onClickSelectListBox(box, boxIndex, index)
                }
            })
    });
    root.querySelectorAll(".button").forEach((button, index)=>{
        button.onclick = (event)=>{
            event.preventDefault();
            event.stopPropagation();
            onClickButton(button, index % 2)
        }
    });
    const checkBlur = (box) =>{
        const keyboard = document.querySelector('.keyboard');
        if(box.value.length < 1 && keyboard.classList.contains('hide')){
            box.parentElement.querySelector('.pencil').classList.remove('hide');
            return true;
        }
        return false;
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
            if(box.value.length > 0){
                const checkResult = checkInputValue(box);
            }
        }

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
    initSelectBox();
    hideAllSelectList();
    resetAllAnswer();
    activateQuestion(0)
    root.reset = ()=>{ reset()}
    root.querySelector("#problem_content").onclick = (event) => {
        event.preventDefault();
        hideAllSelectList();
    };
    root.quertyClicked = (value, index)=>{
        const box = root.querySelectorAll('.red_box')[index];
        if(box){
            box.focus();
            if(value==="del"){
                box.value = "";
            }else{
                box.value = value;
            }
            checkInputValue(box);
        }
    }
    /*
    if(checkPhone()) {
        root.querySelectorAll('input').forEach((input) => {
            input.setAttribute('readonly', true);
        })
    }*/
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