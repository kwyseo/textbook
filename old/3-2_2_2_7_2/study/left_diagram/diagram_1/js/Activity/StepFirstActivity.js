import anime from "../Library/anime.js"
import { HideAlert, ShowOneSecond } from "../Utill/AlertController.js";
import { AnimationHeler } from "../Utill/AnimationHelper.js";
import { NumToArray } from "../Utill/ArrayUtill.js";
import { RemoveListener } from "../Utill/EventListenerHelper.js";

export default class StepFirstActivity {
    constructor(main) {
        this.main = main
        this.st1_value1 = this.main.shadow.querySelector("#st1_value1")
        this.st1_value2 = this.main.shadow.querySelector("#st1_value2")

        this.st1_hammer = this.main.shadow.querySelector("#st1_hammer")

        this.st1_parent2 = this.main.shadow.querySelector("#st1_parent2")

        this.st1_2_1 = this.main.shadow.querySelector("#st1_2_1")

        this.st1_2_box1 = this.main.shadow.querySelector("#st1_2_box1")
        this.st1_2_box2 = this.main.shadow.querySelector("#st1_2_box2")

        this.st1_1_2_textZone = this.main.shadow.querySelector("#st1_1_2_textZone")

        this.st1_1_2_value1 = this.main.shadow.querySelector("#st1_1_2_value1")
        this.st1_1_2_value2 = this.main.shadow.querySelector("#st1_1_2_value2")

        this.st1_1_2_value3 = this.main.shadow.querySelector("#st1_1_2_value3")
        this.st1_1_2_value4 = this.main.shadow.querySelector("#st1_1_2_value4")

        this.drawBoard = this.main.shadow.querySelector("#drawBoard")
        this.ctx = this.drawBoard.getContext("2d");

        this.s1_reset = this.main.shadow.querySelector("#s1_reset")
        this.s1_back = this.main.shadow.querySelector("#s1_back")
    }

    async Init() {        

        //몫
        this.main.answer1 = Math.floor( this.main.value1 / this.main.value2 )
        //나머지
        this.main.answer2 = this.main.value1 % this.main.value2

        this.st1_value1.value = this.main.value1
        this.st1_value2.value = this.main.value2

        this.step = 0;
        this.answerCnt = 0;

        this.SetBtnEvent()
        this.SetStep()
    }    

    Step1() {
        /*
        setTimeout(() => {
            ShowOneSecond(this.main, `십 카드를 일 카드&nbsp<span style="font-family: 'Bbatang'; padding-top: 5px; font-size:48px">10</span>개로 쪼갤 수 있어요.`, 10000)
        })
        */
        this.HammerGuide()
        
        let value1Arr = NumToArray(this.main.value1)
        /*
        this.ctx.clearRect(0, 0, this.drawBoard.width, this.drawBoard.height)
        while (this.st1_2_box1.firstChild) {
            this.st1_2_box1.removeChild(this.st1_2_box1.firstChild);
        }
         */

        this.CreateBlockType("ten", value1Arr[0], this.st1_2_box1, "0px 5px")
        this.CreateBlockType("one", value1Arr[1], this.st1_2_box1, "0px 5px")

        this.st1_hammer.style.display = "block"
        this.st1_2_box1.style.display = "flex"
        this.st1_2_box2.style.display = "none"

        this.st1_1_2_textZone.style.display = "none"


        this.boxIsFirstClick = true
        this.st1_hammer.addEventListener("click", () => {
            if (!this.boxIsFirstClick) return;
            
            HideAlert(this.main)
            this.hammerAni.pause()
            this.hammerAni.seek(0)

            this.HammerClick()
            this.boxIsFirstClick = false

        })
    }

    Step2() {
        this.st1_1_2_value1.value = this.main.value1
        this.st1_1_2_value2.value = this.main.value2

        this.st1_1_2_value3.value = 0
        this.st1_1_2_value4.value = this.main.value1
        /*
        this.ctx.clearRect(0, 0, this.drawBoard.width, this.drawBoard.height)
        while (this.st1_2_box2.firstChild) {
            this.st1_2_box2.removeChild(this.st1_2_box2.firstChild);
        }

         */

        this.oneBlockList = this.CreateBlockType("one", this.main.value1, this.st1_2_box2, "5px 7px")
        this.SetOneButtonEvent(this.oneBlockList.childNodes)
    }

    SetOneButtonEvent(list) {
        list.forEach((element, index) => {
            element.addEventListener("mousedown", (e) => {
                if (element.classList.contains("done")) return

                this.canClickPosList = this.CheckSuccessDragArea(index, 10, list.length)

                this.checkArray = []
                this.checkArray.push({element: element, index: index})
                element.classList.add('check');

                this.lineStartObj = element

                this.lineArray = []
                const onMouseMove = (e) => {
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;


                    this.hoverObj = this.CheckMouseInAreaList(this.canClickPosList, mouseX, mouseY)


                    if (this.hoverObj !== undefined && this.checkArray.length < this.main.value2) {
                        if (this.hoverObj.element.classList.contains("done") || this.hoverObj.element.classList.contains("check")) {
                            return
                        } else {
                            this.lineEndObj = this.hoverObj.element

                            this.DrawLine(this.lineStartObj, this.lineEndObj)
                            this.lineStartObj = this.hoverObj.element

                            if (!this.checkArray.includes(this.hoverObj)) {
                                this.canClickPosList = this.CheckSuccessDragArea(this.hoverObj.index, 10, list.length)
                                this.checkArray.push(this.hoverObj);
                            }

                            this.hoverObj.element.classList.add('check');
                        }
                    }
                    
                };

                this.main.viewWrap.addEventListener('mousemove', onMouseMove);

                this.main.viewWrap.addEventListener('mouseup', () => {
                    this.main.viewWrap.removeEventListener('mousemove', onMouseMove);

                    let isDone = false

                    this.checkArray.forEach((hoverObj, index) => {
                        hoverObj.element.classList.remove("check")
                        if (this.checkArray.length == this.main.value2)  {
                            hoverObj.element.classList.add('done');
                            isDone = true
                        } else {
                        }
                    })

                    if (isDone) {
                        this.answerCnt++;
                        this.CheckAnswer()
                    } else {
                        this.ClearLine()
                    }

                }, { once: true });
            })

            element.addEventListener("touchstart", (e) => {
                e.stopPropagation()
                e.preventDefault()
                if (element.classList.contains("done")) return

                this.canClickPosList = this.CheckSuccessDragArea(index, 10, list.length)

                this.checkArray = []
                this.checkArray.push({element: element, index: index})
                element.classList.add('check');

                this.lineStartObj = element

                this.lineArray = []
                const onMouseMove = (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    const mouseX = e.touches[0].clientX;
                    const mouseY = e.touches[0].clientY;


                    this.hoverObj = this.CheckMouseInAreaList(this.canClickPosList, mouseX, mouseY)

                    if (this.hoverObj !== undefined && this.checkArray.length < this.main.value2) {
                        if (this.hoverObj.element.classList.contains("done") || this.hoverObj.element.classList.contains("check")) {
                            return
                        } else {
                            this.lineEndObj = this.hoverObj.element

                            this.DrawLine(this.lineStartObj, this.lineEndObj)
                            this.lineStartObj = this.hoverObj.element

                            if (!this.checkArray.includes(this.hoverObj)) {
                                this.canClickPosList = this.CheckSuccessDragArea(this.hoverObj.index, 10, list.length)
                                this.checkArray.push(this.hoverObj);
                            }

                            this.hoverObj.element.classList.add('check');
                        }
                    }
                    
                };

                this.main.viewWrap.addEventListener('touchmove', onMouseMove);

                this.main.viewWrap.addEventListener('touchend', (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    this.main.viewWrap.removeEventListener('touchmove', onMouseMove);

                    let isDone = false

                    this.checkArray.forEach((hoverObj, index) => {
                        hoverObj.element.classList.remove("check")
                        if (this.checkArray.length == this.main.value2)  {
                            hoverObj.element.classList.add('done');
                            isDone = true
                        } else {
                        }
                    })

                    if (isDone) {
                        this.answerCnt++;
                        this.CheckAnswer()
                    } else {
                        this.ClearLine()
                    }

                }, { once: true });
            })
        });
    }

    /** 지정한 배열 길이로부터 상하좌우대각선 좌표 인덱스 리턴 */
    CheckSuccessDragArea(clickLength , horizontalLength, maxLength) {
        clickLength += 1

        let upPos = clickLength - horizontalLength
        let downPos = clickLength + horizontalLength

        let upPosLeft = this.CheckIsAreaOut(upPos, horizontalLength, maxLength, "del")
        let upPosMiddle = this.CheckIsAreaOut(upPos, horizontalLength, maxLength, "orig")
        let upPosRight = this.CheckIsAreaOut(upPos, horizontalLength, maxLength, "add")

        let middleLeft = this.CheckIsAreaOut(clickLength, horizontalLength, maxLength, "del")
        let middleRight = this.CheckIsAreaOut(clickLength, horizontalLength, maxLength, "add")

        let downPosLeft = this.CheckIsAreaOut(downPos, horizontalLength, maxLength, "del")
        let downMiddle = this.CheckIsAreaOut(downPos, horizontalLength, maxLength, "orig")
        let downPosRight = this.CheckIsAreaOut(downPos, horizontalLength, maxLength, "add")
        

        return [upPosLeft, upPosMiddle, upPosRight, middleLeft, middleRight, downPosLeft, downMiddle, downPosRight]
    }

    CheckIsAreaOut(calc, horizontalLength, maxLength, type) {
        if (calc == 0) return ""

        if (type == "del") calc -= 1
        else if (type == "add") {
            calc += 1
            if (calc == 0) return ""
        }

        if (calc < 0 || calc > maxLength) return ""

    
        if (type == "add") {
            if (calc % (horizontalLength) == 1) return ""
        }

        if (type == "del")
            if (calc % (horizontalLength) == 0) return ""

        return calc - 1
    }

    CheckMouseInAreaList(list, mouseX, mouseY) {
        for (let i in list) {
            if (list[i] !== "") {
                let bnd = this.oneBlockList.childNodes[list[i]].getBoundingClientRect()
                if (mouseX >= bnd.left && mouseX <= bnd.right && mouseY >= bnd.top && mouseY <= bnd.bottom) {
                    return {
                        element: this.oneBlockList.childNodes[list[i]],
                        index: list[i]
                    }
                }
            }
        }
    }

    DrawLine(startEl, endEl) {

        const startCenterX = (startEl.offsetLeft + (startEl.offsetWidth/2));
        const startCenterY = (startEl.offsetTop + (startEl.offsetHeight/2));

        const endCenterX = (endEl.offsetLeft + (endEl.offsetWidth/2));
        const endCenterY = (endEl.offsetTop + (endEl.offsetHeight/2));
        
        this.ctx.beginPath();

        this.ctx.moveTo(startCenterX, startCenterY);
        this.ctx.lineTo(endCenterX, endCenterY);
        this.ctx.strokeStyle = "rgba(149, 149, 149, 0.5)"
        this.ctx.lineCap = "round";

        this.ctx.lineWidth = 50;
        this.ctx.stroke();

        this.lineArray.push({ startX: startCenterX, startY: startCenterY, endX: endCenterX, endY: endCenterY });
    }

    ClearLine() {
        this.lineArray.forEach(line => {
            this.ctx.beginPath();
            this.ctx.moveTo(line.startX, line.startY);
            this.ctx.lineTo(line.endX, line.endY);
            this.ctx.strokeStyle = "white"
            this.ctx.lineWidth = 52;
            this.ctx.stroke();
        });
    }
    
    CheckAnswer() {
        this.st1_1_2_value3.value = this.answerCnt
        this.st1_1_2_value4.value = this.main.value1 - (this.answerCnt * this.main.value2)
        if (this.answerCnt == this.main.answer1) {
            const args = {
                'root': this.main.shadow,
                'type': 'dragComplete',
            };

            const event = new CustomEvent('callToParent',
                {
                    detail: {message: args},
                    bubbles: true,
                    composed: true
                }
            );
            this.main.shadow.dispatchEvent(event);
        }
    }


    CreateBlockType(type, cnt, parent, imgMargin) {
        let imgParent = document.createElement("div")

        for (let i = 0; i < cnt; i++) {
            let img = document.createElement("img")
    
            if (type == "ten") {
                img.src = this.main.ImgPath + "activity/ten.png"
            } else if (type == "one") {
                img.src = this.main.ImgPath + "activity/one.png"
            }
    
            img.style.margin = imgMargin
            img.style.webkitUserDrag = 'none';
            img.style.cursor = "pointer"

            //imgParent.style.margin = "5px 0px"
            imgParent.style.zIndex = 2
            imgParent.appendChild(img)

        }

        parent.appendChild(imgParent)

        return imgParent
    }

    HammerGuide() {
        this.hammerAni = anime({
            targets: this.st1_hammer,
            rotate: [
                { value: 10, duration: 400, easing: 'easeInOutSine' },
                { value: 0, duration: 400, easing: 'easeInOutSine' },
                { value: 10, duration: 400, easing: 'easeInOutSine' },
                { value: 0, duration: 400, easing: 'easeInOutSine' },
            ],
            loop: true,
            delay: function(el, i, l) {
                return i === l - 1 ? 1000 : 0;
            }
        });
    }

    HammerClick() {
        this.hammerAni2 = anime({
            targets: this.st1_hammer,
            rotate: [
                { value: -40, duration: 500, easing: 'easeInOutSine' },
                { value: 10, duration: 200, easing: 'easeInOutSine' },
            ],
            delay: function(el, i, l) {
                return i === l - 1 ? 1000 : 0;
            },
            complete: () => {
                this.st1_hammer.style.transform = "rotate(0)"
                this.st1_hammer.style.display = "none"
                this.st1_2_box1.style.display = "none"
                this.st1_2_box2.style.display = "flex"
    
                this.st1_1_2_textZone.style.display = "block"
    
                this.step++;
    
                this.SetStep()
            }
        });
    }

    SetStep() {
        switch(this.step){
            case 0:
                this.Step1()
                break;
            case 1:
                this.Step2()
                break;
        }
    }

    SetBtnEvent() {
        this.s1_reset.addEventListener("click", (event) => {
            AnimationHeler.BtnClick(this.s1_reset, () => {
                this.Clear();
                this.Init();
                const args = {
                    'root': this.main.shadow,
                    'type': 'onlyActivity',
                    'numerator': this.main.value1,
                    'denominator': this.main.value2
                };

                const event = new CustomEvent('callToParent',
                    {
                        detail: {message: args},
                        bubbles: true,
                        composed: true
                    }
                );
                this.main.shadow.dispatchEvent(event);
            })
        })

        this.s1_back.addEventListener("click", () => {
            AnimationHeler.BtnClick(this.s1_back, () => {
                this.Clear()
                HideAlert(this.main)
                this.main.intro.Clear()
                this.main.step = this.main.Step.INTRO
                this.main.SetStep()
            })
        })
    }

    Clear() {
        this.s1_reset = RemoveListener(this.s1_reset)
        this.s1_back = RemoveListener(this.s1_back)

        this.st1_2_box1.style.display = "flex"
        this.st1_2_box2.style.display = "none"

        this.st1_1_2_textZone.style.display = "none"

        this.st1_hammer.style.display = "block"
        this.st1_hammer.style.transform = "rotate(0)"

        this.hammerAni.restart()
        this.hammerAni.pause()

        if (this.hammerAni2) {
            this.hammerAni2.restart()
            this.hammerAni2.pause()
        }
        
        this.st1_2_box1.innerHTML = ""
        this.st1_2_box2.innerHTML = ""

        this.ctx.clearRect(0, 0, this.drawBoard.width, this.drawBoard.height)
    }

  

    
}