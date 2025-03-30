import {dispatchEvent} from "../common.js";

export default class ConceptLearning{

    root = null;
    clickBoxes = [];
    selectBoxes = [];

    constructor(root) {
        this.root = root;
        this.clickBoxes = root.querySelectorAll(".click_box");
        this.clickBoxes.forEach((element, index)=>{
            element.onclick = (event)=>{
                event.preventDefault();
                this.onClickClickBox(element, index)
            }
        });
        this.fractionBox = root.querySelectorAll(".fraction_box");
        this.fractionBox.forEach((element, index)=>{
            element.onclick = (event)=>{
                event.preventDefault();
                this.onClickFractionBox(element, index)
            }
        });
        this.answerBox = root.querySelectorAll(".answer_box");
        this.answerBox.forEach((element, index)=>{
            const input = element.querySelector(".answer_input");
            input.onclick = (event)=>{
                event.preventDefault();
                event.stopPropagation();
                input.parentElement.querySelector(".pencil").classList.add("hide");
                const pageIndex = this.root.querySelector('#view-wrap').dataset.index;
                dispatchEvent(root, {type:"keyboard", target: index, page: pageIndex});
                input.focus();
            }
            input.onkeyup = (event)=> {
                this.checkInputLength(input);
            }
            input.onblur = (event) =>{
                const result = this.checkBlur(input);
                if(!result){
                    setTimeout(()=>{this.checkBlur(input)}, 300);
                }
            }
            input.onfocus = (event) =>{
                this.checkFocus(input);
            }
        });
        root.querySelectorAll(".pencil").forEach((pencil)=>{
            pencil.onclick = (event)=>{
                event.preventDefault();
                event.stopPropagation();
                const input = pencil.parentElement.querySelector('input');
                if(input.classList.contains("active")) {
                    input.click();
                }
            }
        })
        this.selectBoxes = root.querySelectorAll(".select_box");
        this.selectBoxes.forEach((element, index)=>{
            element.onclick = (event)=>{
                event.preventDefault();
                event.stopPropagation();
                this.onClickSelectBox(element, index)
            }
            element.querySelector(".select_list").querySelectorAll('.select_list_box')
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
                        this.onClickSelectListBox(box, boxIndex, index)
                    }
                })
        });
        this.reset();
        root.querySelector(".reset_btn").onclick = (event)=>{
            event.preventDefault();
            this.reset();
        };
        if(root.querySelector("#chapter_content")) {
            root.querySelector("#chapter_content").onclick = (event) => {
                event.preventDefault();
                this.selectBoxes.forEach((element) => {
                    element.querySelector(".select_list").classList.add("hide");
                })
            };
        }
        root.reset = ()=>{ this.reset()}
        root.quertyClicked = (value, index)=>{
            const box = root.querySelectorAll('.answer_input')[index];
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
                this.checkInputLength(box);
            }
        }
        if(root.querySelector('.problem_btn')){
            root.querySelector(".problem_btn").onclick = (event) => {
                event.preventDefault();
                dispatchEvent(root, {type:"problem"});
            };
        }
        /*
        if(this.checkPhone()) {
            root.querySelectorAll('input').forEach((input) => {
                input.setAttribute('readonly', true);
            })
        }
         */
    }
    checkPhone() {
        let agent = navigator.userAgent;
        //모바일 체크
        const isMobile = /iphone|ipod|android|blackberry|windows phone|opera mini|iemobile|mobile|samsungbrowser/i.test(agent);

        // iPad IOS 13버전 이후로는 웹 형식으로 나와서 별도 비교 로직 추가
        const isIpad = /iPad|Macintosh/.test(agent) && 'ontouchend' in document;
        return isMobile || isIpad;
    }
    checkInputLength(box){
        const answer = box.dataset.answer;
        if(box.value.length < answer.length){
            // 계속 입력을 받는다.
            return false;
        }
        box.classList.add("check_input");
        // 커서를 안보이게 하기 위하여 넣음
        //box.blur();
        this.checkInputValue(box);
    }

    // 로직을 바꿔서 이 함수는 blur 가 실행될 때만 호출된다.
    checkInputValue(box){
        box.blur();
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
                    box.focus();
                    box.classList.remove("check_input");
                    const isKeyboardActive = !document.querySelector('.keyboard').classList.contains('hide');
                    if(this.checkPhone() && !isKeyboardActive){
                        // 폰의 경우에는 연필모양을 다시 넣자.
                        box.parentElement.querySelector('.pencil').classList.remove('hide');
                    }
                }, 2000);
            }, 500);
            return false;
        }else{
            dispatchEvent(this.root, {type:"close_keyboard"});
            box.classList.remove("check_input");
            box.disabled = true;
            // 두번 호출될 수 있네....
            const fractionBox = box.parentElement.parentElement.querySelector('.fraction_box');
            let targetIndex = -1;
            for(let i = 0; i < this.fractionBox.length; i++){
                if(this.fractionBox[i] === fractionBox){
                    targetIndex = i+ 1;
                    continue;
                }
                if(i === targetIndex && this.fractionBox[i].classList.contains('gray')){
                    this.fractionBox[i].classList.remove('gray');
                    this.fractionBox[i].querySelector('.fraction_box_img').classList.remove('hide');
                    this.fractionBox[i].querySelector('.fraction_box_img_gray').classList.add('hide');
                    break;
                }
            }
            return true;
        }
    }
    checkFocus(box){
        const boxes = this.root.querySelectorAll('.answer_input');
        for(let i = 0; i < boxes.length; i++){
            const element = boxes[i];
            if(element !== box && element.value.length!==0
                && element.value.length < element.dataset.answer.length
                && element.classList.contains("active")){
                box.blur();
                if(box.value.length < 1){
                    box.parentElement.querySelector('.pencil').classList.remove('hide');
                }
                this.checkInputValue(element);
                const pageIndex = this.root.querySelector('#view-wrap').dataset.index;
                dispatchEvent(this.root, {type:"keyboard", target: i, page: pageIndex});
                break;
            }
            if(element !== box && element.value.length===0 && element.classList.contains("active"))
                element.parentElement.querySelector('.pencil').classList.remove('hide');
        }
    }
    checkBlur(box){
        const isKeyboardActive = !document.querySelector('.keyboard').classList.contains('hide');
        const isInputCheck = box.classList.contains("check_input");
        // blur 가 됬을 때 값 체크를 하지 않는 경우는
        // 1. check_input 클래스가 있는 경우
        // 2. 쿼티 키보드가 있는 경우
        if(box.value.length > 0 && !isInputCheck && !isKeyboardActive){
            // 쿼티 자판으로 입력되는 것은 걱정하지 않아도 되는 것이
            // 쿼티로 입력하면 이것이 먼저 실행되고 클릭 이벤트가 실행됨으로 아래 체크는 기존 것만으로 하는 것이다.
            this.checkInputValue(box);
        }
        if(box.value.length < 1 && !isKeyboardActive){
            box.value = ""; // 도트만 있는 경우 length 가 0 임으로 도트를 지워준다.
            box.parentElement.querySelector('.pencil').classList.remove('hide');
            return true;
        }
        return false;
    }

    onClickClickBox(element, index){
        if(!element.querySelector(".click_box_answer").classList.contains('hide'))
            return;
        element.querySelector(".click_box_img").classList.add("hide");
        element.querySelector(".click_box_img_gray").classList.add("hide");
        element.querySelector(".click_box_answer").classList.remove("hide");
        if (index < this.clickBoxes.length - 1) {
            this.clickBoxes[index + 1].classList.remove('gray');
            this.clickBoxes[index + 1].querySelector(".click_box_img").classList.remove("hide");
            this.clickBoxes[index + 1].querySelector(".click_box_img_gray").classList.add("hide");
            this.clickBoxes[index + 1].querySelector(".click_box_answer").classList.add("hide");
        } else {
            this.selectBoxes.forEach((element) => {
                element.classList.remove("gray");
                element.classList.add("blue");
                element.classList.add("cursor");
            })
        }
        let isComplete = true;
        this.clickBoxes.forEach((box)=>{
            if(box.querySelector(".click_box_answer").classList.contains("hide")){
                isComplete = false;
            }
        });
        if(isComplete){
            this.selectBoxes.forEach((element)=>{
                element.classList.remove("gray");
                element.classList.add("blue");
                element.classList.add("cursor");
            })
        }
    }
    onClickFractionBox(element, index){
        element.querySelector(".fraction_box_img").classList.add("hide");
        element.querySelector(".fraction_box_img_gray").classList.add("hide");
        element.querySelector(".fraction_box_answer").classList.remove("hide");
        // 옆의 입력창을 활성화 시킨다.
        const input = element.parentElement.querySelector('.answer_input');
        input.classList.add("active");
        const pencil = element.parentElement.querySelector('.pencil');
        pencil.classList.add("active");
    }

    onClickSelectBox(element){
        if(!element.classList.contains("cursor"))
            return;
        this.root.querySelectorAll(".select_list").forEach((list)=>{
            list.classList.add("hide");
        })
        element.querySelector(".select_list").classList.remove("hide");
    }

    onClickSelectListBox(element, index, parentIndex){
        element.parentElement.classList.add("hide");
        element.parentElement.querySelectorAll('.select_list_box')
            .forEach((box)=>box.classList.remove("select_gray"));
        element.classList.add("select_gray");
        const answerBox = element.parentElement.parentElement.querySelector(".select_box_answer");
        answerBox.innerHTML = index===0? "가": index===1? "나": "다";
        answerBox.classList.remove("hide");
        let isComplete = true;
        this.selectBoxes.forEach((selectBox)=>{
            const answer = selectBox.querySelector(".select_box_answer");
            if(answer.classList.contains("hide"))
                isComplete = false;
        });
        if(isComplete){
            //const index = this.root.querySelector(".view-wrap")?.dataset.index;
            //dispatchEvent(this.root, {type:"popup", target: parseInt(index) + 1});
        }
    }

    reset(){
        this.clickBoxes.forEach((element, index)=>{
            element.classList.add('gray');
            element.querySelector(".click_box_img").classList.add("hide");
            element.querySelector(".click_box_img_gray").classList.remove("hide");
            element.querySelector(".click_box_answer").classList.add("hide");
            if(index===0){
                element.classList.remove('gray');
                element.querySelector(".click_box_img").classList.remove("hide");
                element.querySelector(".click_box_img_gray").classList.add("hide");
            }
        });
        this.fractionBox.forEach((element, index)=>{
            element.classList.add('gray');
            element.querySelector(".fraction_box_img").classList.add("hide");
            element.querySelector(".fraction_box_img_gray").classList.remove("hide");
            element.querySelector(".fraction_box_answer").classList.add("hide");
            if(index===0) {
                element.classList.remove('gray');
                element.querySelector(".fraction_box_img").classList.remove("hide");
                element.querySelector(".fraction_box_img_gray").classList.add("hide");
            }
        });
        this.answerBox.forEach((element)=>{
            element.querySelector("input").classList.remove("active");
            element.querySelector("input").value = "";
            element.querySelector("input").disabled = false;
            element.querySelector(".pencil").classList.remove("active");
            element.querySelector(".pencil").classList.remove("hide");
        })
        this.selectBoxes.forEach((element)=>{
            element.classList.remove("cursor");
            element.classList.remove("blue");
            element.classList.add("gray");
            const selectList = element.querySelector(".select_list");
            selectList.classList.add("hide");
            selectList.querySelectorAll(".select_list_box").forEach((box)=>box.classList.remove("select_gray"))
            element.querySelector(".select_box_answer").classList.add("hide");
        })
        // summary 때문에 #left_arear로 먼저 쿼리하면 안된다.
        this.root.querySelectorAll("remote-html-embed").forEach((element, index)=>{
            if(!element.classList.contains("hide") && element.shadowRoot.autoScale)
                element.shadowRoot.autoScale();
            if(element.shadowRoot.reset) {
                element.shadowRoot.reset();
            }
        })
    }
}