import {dispatchEvent} from "../common.js";

export default class ConceptLearning{

    root = null;
    clickBoxes = [];

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
                input.focus();
            }
            input.onkeyup = (event)=> {
                this.checkInputLength(input);
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
            this.reset();
        };
        if(root.querySelector(".check_btn")) {
            root.querySelector(".check_btn").onclick = (event) => {
                event.preventDefault();
                // 여기서 임베디드가 완료 되었는지 확인한다.
                const shadowRoot = this.root.querySelector('remote-html-embed').shadowRoot;
                if(shadowRoot.checkDrag) {
                    const answer = shadowRoot.checkDrag();
                    if(!answer) {
                        // 팝업은 checkDrag() 함수에서 띄움으로 특별히 할 것이 없다.
                    }
                    else{
                        const index = this.root.querySelector(".view-wrap")?.dataset.index;
                        dispatchEvent(this.root, {type: "popup", target: parseInt(index) + 1});
                    }
                }
            };
        }
        root.querySelector('#left_area')?.addEventListener("callToParent", (event) => {
            event.stopImmediatePropagation();
            if (event.detail.message.type === "initValue") {
                root.querySelector('.numerator_value').innerHTML = event.detail.message.numerator;
                root.querySelector('.denominator_value').innerHTML = event.detail.message.denominator;
                if(root.querySelector('.denominator_text'))
                    root.querySelector('.denominator_text').innerHTML = event.detail.message.denominator;
                this.reset(false);
            }else if (event.detail.message.type === "dragComplete"){
                this.setConfirmButton();
            }else if (event.detail.message.type === "onlyActivity"){
                this.root.querySelector('.check_btn').classList.add('hide');
            }
        });
        root.reset = ()=>{
            this.reset();
        }
        root.quertyClicked = (value, index)=>{
            const box = root.querySelectorAll('.answer_input')[index];
            if(box){
                box.focus();
                const possibleLength = index === 0? 2:1;
                if(box.value.length >= possibleLength && value!=="del"){
                    return;
                }
                if(value==="del" && box.value.length > 0){
                    box.value = box.value.substring(0, box.value.length-1);
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
    }

    setAnswerBoxVisible(){
        let isComplete = true;
        this.clickBoxes.forEach((box)=>{
            if(box.querySelector(".click_box_answer").classList.contains("hide")){
                isComplete = false;
            }
        });
        // 묶음을 다 만들었는지 확인한다.
        /* 체크 안한단다
        const answer = this.root.querySelector('remote-html-embed').shadowRoot
            .checkDrag();

         */
        // 입력할 수 있도록 만들어 준다.
        if(isComplete){
            this.root.querySelectorAll('.answer_input').forEach((input)=>{
                input.classList.add('active');
                input.disabled = false;
            })
            this.root.querySelectorAll('.pencil').forEach((pencil)=>{
                pencil.classList.add('active');
                pencil.classList.remove('hide');
            })
        }
    }
    setConfirmButton(){
        let isComplete = true;
        this.root.querySelectorAll('.answer_input').forEach((element)=>{
            if(element.value.length < 1)
                isComplete = false;
        })
        // 묶음을 다 만들었는지 확인한다.
        /*
        const answer = this.root.querySelector('remote-html-embed').shadowRoot
            .checkDrag();
         */
        // 입력할 수 있도록 만들어 준다. 임베드 활성화 상관없이 활성화
        if(isComplete){
            if(isComplete && this.root.querySelector('.check_btn'))
                this.root.querySelector('.check_btn').classList.remove('hide');
        }
    }
    checkInputLength(){
        this.setConfirmButton();
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
        this.setAnswerBoxVisible();
    }

    reset(toEmbed = true){
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
        this.answerBox.forEach((element)=>{
            element.querySelector("input").classList.remove("active");
            element.querySelector("input").value = "";
            element.querySelector("input").disabled = true;
            element.querySelector(".pencil").classList.remove("active");
            element.querySelector(".pencil").classList.add("hide");
        })
        if(this.root.querySelector('.check_btn'))
            this.root.querySelector('.check_btn').classList.add('hide');
        // summary 때문에 #left_arear로 먼저 쿼리하면 안된다.
        if(toEmbed) {
            this.root.querySelectorAll("remote-html-embed").forEach((element, index) => {
                if (!element.classList.contains("hide") && element.shadowRoot.autoScale)
                    element.shadowRoot.autoScale();
                if (element.shadowRoot.showStepTwo) {
                    // 첫번째 문제는 나주어지는 숫자만을 구해야 한다.
                    const aidIndex = this.root.querySelector('#view-wrap').dataset.index;
                    element.shadowRoot.showStepTwo(aidIndex!=="0");
                }
            })
        }
    }
}