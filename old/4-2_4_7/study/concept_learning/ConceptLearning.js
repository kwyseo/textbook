import {dispatchEvent} from "../common.js";

export default class ConceptLearning{

    root = null;
    clickBoxes = [];
    tabButtons = [];
    questionContainers = [];
    constructor(root) {
        this.root = root;
        this.clickBoxes = root.querySelectorAll(".click_box");
        this.clickBoxes.forEach((element, index)=>{
            element.onclick = (event)=>{
                event.preventDefault();
                this.onClickClickBox(element, index)
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
                if(input.classList.contains('chill_input')){
                    input.value = '';
                }
                input.focus();
            }
            input.onkeyup = (event)=> {
                this.popup(input);
            }
            input.onblur = (event)=>{
                if(input.classList.contains('active') && input.value.length < 1){
                    input.parentElement.querySelector('.pencil').classList.remove('hide');
                    input.parentElement.querySelector('.pencil').classList.add('active');
                }
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
        this.reset();
        root.querySelector(".reset_btn").onclick = (event)=>{
            event.preventDefault();
            let tabIndex = 0;
            this.root.querySelectorAll('.tab_btn').forEach((tab, tab_index)=>{
                if(tab.classList.contains('header_clicked')){
                    tabIndex = tab_index;
                }
            })
            this.activateQuestion(tabIndex);
        };

        root.querySelector('#left_area')?.addEventListener("callToParent", (event) => {
            event.stopImmediatePropagation();
            if (event.detail.message.type === "initValue") {
                root.querySelector('.numerator_value').innerHTML = event.detail.message.numerator;
                root.querySelector('.denominator_value').innerHTML = event.detail.message.denominator;
                this.reset();
            }else if (event.detail.message.type === "dragComplete"){
            }
        });
        root.reset = ()=>{
            this.reset();
        }
        root.quertyClicked = (value, index)=>{
            const box = root.querySelectorAll('.answer_input')[index];
            if(box){
                const possibleLength = index===0? 1: 2;
                if(box.value.length >= possibleLength && value!=="del"){
                    return;
                }
                box.click();
                if(value==="del"){
                    if(box.value.length > 0)
                        box.value = box.value.substring(0, box.value.length-1);
                    else
                        box.value = "";
                }else{
                    //box.value += value;
                    box.value = box.value + value;
                }
                // 만일 입력이 다 된 거면 결과를 보여준다.
                const result = this.popup(box);
                if(result){
                    dispatchEvent(this.root, {type: "close_keyboard"});
                }
            }
        }
        if(root.querySelector('.problem_btn')){
            root.querySelector(".problem_btn").onclick = (event) => {
                event.preventDefault();
                dispatchEvent(root, {type:"problem"});
            };
        }
        this.tabButtons = root.querySelectorAll(".tab_btn");
        this.tabButtons.forEach((element, index)=>{
            element.onclick = (event)=>{
                event.preventDefault();
                this.onClickTabButton(element, index)
            }
        });
        this.questionContainers = root.querySelectorAll(".question_container");
        // 서머리도 있으니까 조건을 붙여야 한다.
        if(this.tabButtons.length > 0)
            this.activateQuestionContainer(0);

    }

    popup(input){
        // 먼저 어떤 탭인지 알아야 겠지.
        let tabIndex = 0;
        this.root.querySelectorAll('.tab_btn').forEach((tab, tab_index)=>{
            if(tab.classList.contains('header_clicked')){
                tabIndex = tab_index;
            }
        })
        // 첫번째는 팝업을 띄우지 말란다.
        if(tabIndex===0) {
            const answer = input.dataset.answer;
            if(answer.length === input.value.length && answer!==input.value){
                //깜박이고 지운다.
                input.disabled = true;
                input.classList.add("blinking-text-first");
                setTimeout(()=>{
                    input.classList.remove("blinking-text-first");
                    input.classList.add("blinking-text");
                    setTimeout(()=>{
                        input.value = "";
                        input.classList.remove("blinking-text");
                        input.classList.remove("check_input");
                        input.disabled = false;
                        input.focus();
                    }, 2000);
                }, 500);
            }
            return;
        }
        const ancestor = input.parentElement.parentElement.parentElement.parentElement;
        let isComplete = true;
        ancestor.querySelectorAll('.answer_input').forEach((input, inputIndex)=>{
            if(inputIndex===0){
                if(input.value.length < 1){
                    isComplete = false;
                }
            }else{
                if(input.value.length < 2){
                    isComplete = false;
                }
            }
        })
        if(isComplete) {
            input.blur();
            dispatchEvent(this.root, {type: "popup", target: tabIndex + 1});
            return true;
        }
        return false;
    }

    activateQuestion(containerIndex){
        /* 테스트 용
        containerIndex = 0;
        this.questionContainers.forEach((element, index)=>{
            if(index === containerIndex)
                element.classList.remove("hide");
            else
                element.classList.add("hide");
        })
        //*/
        //////////////////////////////
        // 일단 문제들을 다 초기하 한다.
        this.reset(true);
        // shadow dom 활성화
        const embed = this.root.querySelector("remote-html-embed");
        embed.classList.remove("hide");
        if(embed.shadowRoot.autoScale)
            embed.shadowRoot.autoScale();
        if(embed.shadowRoot.reset){
            if(containerIndex === 0)
                embed.shadowRoot.reset(1, 0);
            else {
                embed.shadowRoot.reset(2, 14);
            }
        }
        const container = this.questionContainers[containerIndex];

        /*
        let selectedQuestion = 0;
        const questionList = container.querySelectorAll('.question');
        questionList.forEach((question, questionIndex)=>{
            if(!question.classList.contains("hide"))
                selectedQuestion = questionIndex;
        })
        const questionNumber = this.getRandomNumberExcluding(0, questionList.length-1, selectedQuestion);
        for(let i = 0; i < questionList.length; i++){
            const target = questionList[i].classList;
            if(i === questionNumber)
                target.remove("hide");
            else
                target.add("hide");
        }
         */
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
    }
    activateQuestionContainer(containerIndex){
        this.tabButtons.forEach((element)=>{
            element.classList.remove("header_clicked");
        });
        this.tabButtons[containerIndex].classList.add("header_clicked");

        // 질문 컨테이너 활성화
        this.questionContainers.forEach((element, index)=>{
            if(index === containerIndex)
                element.classList.remove("hide");
            else
                element.classList.add("hide");
        })
        // 질문 활성화
        this.activateQuestion(containerIndex);
    }

    onClickTabButton(button, index){
        if(button.classList.contains("header_clicked"))
            return;

        this.activateQuestionContainer(index);
    }

    onClickClickBox(element, index){
        if(!element.querySelector(".click_box_answer").classList.contains('hide'))
            return;
        element.querySelector(".click_box_img").classList.add("hide");
        element.querySelector(".click_box_img_gray").classList.add("hide");
        element.querySelector(".click_box_answer").classList.remove("hide");
        if(index < this.clickBoxes.length -1 ){
            this.clickBoxes[index+ 1].classList.remove('gray');
            this.clickBoxes[index+ 1].querySelector(".click_box_img").classList.remove("hide");
            this.clickBoxes[index+ 1].querySelector(".click_box_img_gray").classList.add("hide");
            this.clickBoxes[index+ 1].querySelector(".click_box_answer").classList.add("hide");
        }
        if(this.tabButtons.length > 0){
            const parentQuestion = element.parentElement.parentElement.parentElement;
            let isComplete = true;
            parentQuestion.querySelectorAll('.click_box_answer').forEach((answer)=>{
                if(answer.classList.contains('hide'))
                    isComplete = false;
            })
            if(isComplete){
                parentQuestion.querySelectorAll(".answer_input").forEach((input)=>{
                    input.classList.add('active');
                    input.disabled = false;
                })
                this.root.querySelectorAll('.pencil').forEach((pencil)=>{
                    pencil.classList.add('active');
                    pencil.classList.remove('hide');
                })
            }
        }
    }

    resetContainerClickBox(){
        this.questionContainers.forEach((container)=>{
            container.querySelectorAll('.click_box').forEach((element, index)=>{
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
        })
    }


    reset(fromContainer = false){
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
        this.resetContainerClickBox();
        this.answerBox.forEach((element, elementIndex)=>{
            element.querySelector("input").classList.remove("active");
            element.querySelector("input").value = "";
            element.querySelector("input").disabled = true;
            element.querySelector(".pencil").classList.remove("active");
            element.querySelector(".pencil").classList.add("hide");
            // 세번째 인풋은 활성화 해야 한다.
            if(elementIndex === 2){
                element.querySelector("input").disabled = false;
                element.querySelector("input").classList.add("active");
                element.querySelector(".pencil").classList.add("active");
                element.querySelector(".pencil").classList.remove("hide");
            }
        })
        if(this.root.querySelector('.check_btn'))
            this.root.querySelector('.check_btn').classList.add('hide');
        // summary 때문에 #left_arear로 먼저 쿼리하면 안된다.
        this.root.querySelectorAll("remote-html-embed").forEach((element, index) => {
            if (!element.classList.contains("hide") && element.shadowRoot.autoScale)
                element.shadowRoot.autoScale();
            if (element.shadowRoot.reset) {
                element.shadowRoot.reset(1, 0);
            }
        })
        if(this.tabButtons.length > 0 && !fromContainer)
            this.activateQuestionContainer(0)
    }
}