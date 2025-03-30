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
        if(root.querySelector('.problem_btn')){
            root.querySelector(".problem_btn").onclick = (event) => {
                event.preventDefault();
                dispatchEvent(root, {type:"problem"});
            };
        }
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
        }else{
            this.selectBoxes.forEach((element)=>{
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
            const index = this.root.querySelector(".view-wrap")?.dataset.index;
            if(parseInt(index) === 2){
                // 각도를 표시해 준다.
                this.root.querySelectorAll("remote-html-embed").forEach((em)=>{
                    if(!em.classList.contains("hide") && em.shadowRoot.showAngle)
                        em.shadowRoot.showAngle();
                })
            }
            dispatchEvent(this.root, {type:"popup", target: parseInt(index) + 1});
        }
    }

    reset(){
        this.clickBoxes.forEach((element, index)=>{
            element.classList.add("gray");
            element.querySelector(".click_box_img").classList.add("hide");
            element.querySelector(".click_box_img_gray").classList.remove("hide");
            element.querySelector(".click_box_answer").classList.add("hide");
            if(index===0){
                element.classList.remove("gray");
                element.querySelector(".click_box_img").classList.remove("hide");
                element.querySelector(".click_box_img_gray").classList.add("hide");
            }
        });
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