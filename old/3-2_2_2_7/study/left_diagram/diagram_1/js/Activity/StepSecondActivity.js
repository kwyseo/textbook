import { HideAlert, ShowOneSecond } from "../Utill/AlertController.js";
import { AnimationHeler } from "../Utill/AnimationHelper.js";
import { FillBlankArray, NumToArray } from "../Utill/ArrayUtill.js";
import { DragOffset } from "../Utill/DragUtill.js";
import { FindIndexOfChild, GetChildList, RemoveChildList } from "../Utill/ElementUtil.js";
import { RemoveListener } from "../Utill/EventListenerHelper.js";

export default class StepSecondActivity {
    constructor(main) {
        this.main = main
        this.st2_tenZone = this.main.shadow.querySelector("#st2_tenZone")
        this.st2_oneZone = this.main.shadow.querySelector("#st2_oneZone")

        this.left_img_container = this.main.shadow.querySelector("#left_img_container")
        this.left_cnt_container = this.main.shadow.querySelector("#left_cnt_container")

        this.st2_3_1 = this.main.shadow.querySelector("#st2_3_1")

        this.s2_hammer = this.main.shadow.querySelector("#s2_hammer")
        this.s2_wrench = this.main.shadow.querySelector("#s2_wrench")

        this.hammer_icon = this.main.shadow.querySelector("#hammer_icon")
        this.wrench_icon = this.main.shadow.querySelector("#wrench_icon")

        this.s2_reset = this.main.shadow.querySelector("#s2_reset")
        this.s2_back = this.main.shadow.querySelector("#s2_back")

        this.isHammerFirstClick = false
        this.isWrenchFirstClick = false
    }

    Init() {

        this.value1Arr = NumToArray(this.main.value1)
        this.value2Arr = NumToArray(this.main.value2)


        let tenDefault = {x: 560, y: 87, upVal: 90}
        let oneDefault = {x: 560, y: 163, upVal: 90}

        this.SetTopBlock(this.value1Arr[0], this.st2_tenZone, "activity/ten.png", tenDefault, "ten")
        this.SetTopBlock(this.value1Arr[1], this.st2_oneZone, "activity/one.png", oneDefault, "one")

        this.SetBottomArea(this.main.value2)

        this.dragArea = Array.from(this.main.shadow.querySelectorAll(".scrollZone"))
        this.dragNumArea = Array.from(this.main.shadow.querySelectorAll(".divide_number_container"))

        this.dragAreaNumList = []
        this.dragAreaNumList = FillBlankArray(this.dragAreaNumList, this.main.value2)

        this.dragTenCompleteList = []
        this.dragOneCompleteList = []

        this.isHammer = false
        this.isWrench = false
        this.SetBtnEvent()

        this.main.Activity2.addEventListener("mousemove", this.FollowMouse.bind(this))
        this.main.Activity2.addEventListener("touchmove", this.FollowMouse.bind(this))

        this.SetTopEvent()
        this.SetOneEvent()

        this.SetDragAreaEvent()
    }

    SetTopBlock(num, parentEl, imgPath, defaultVal, type) {
        let createDom

        for (let i = 0; i < 9; i++) {
            if (i < num) {
                createDom = document.createElement("div")
                createDom.style.backgroundImage = `url('${this.main.ImgPath + imgPath}')`
    
                createDom.style.position = "absolute"

                createDom.style.left = defaultVal.x + (i*defaultVal.upVal) + "px"
                createDom.style.top = defaultVal.y + "px"

                createDom.style.cursor = "pointer"

                createDom.style.touchAction = "manipulation"
                createDom.style.userSelect = "none"

                createDom.classList.add("dragBlock")
                parentEl.appendChild(createDom)
                parentEl.children[i].style.display = "block"
            } else {
                parentEl.children[i].style.display = "none"
            }
        }
    }

    SetMiddleBlock(cnt) {
        for (let i = 0; i < cnt; i++) {
            let createDom = document.createElement("div")

            createDom.style.backgroundImage = `url('${this.main.ImgPath}activity/one.png')`

            createDom.style.width = "68px"
            createDom.style.height = "68px"
            createDom.style.margin = "0px 7px"
            createDom.style.display = "inline-block"
            createDom.style.cursor = "pointer"
    
            this.left_img_container.appendChild(createDom)
        }

        this.CheckMiddleChildLength()
        this.SetLeftAreaEvent()
        this.SetMiddleNumber()
    }

    SetBottomArea(num) {
        for (let i = 0; i < num; i++) {
            let container = document.createElement("div")
            container.classList.add("divide_container")
    
            let divide_white_container = document.createElement("div")
            divide_white_container.classList.add("divide_white_container")

            let scrollContainer = document.createElement("div")
            scrollContainer.style.padding = "0px"
            scrollContainer.classList.add("scrollZone")
            divide_white_container.appendChild(scrollContainer)

            let scrollBar = document.createElement("div")
            scrollBar.classList.add("scrollBar", "scrollDeActivity")
            console.log(scrollBar)

            let scroll_thumb = document.createElement("div")
            scroll_thumb.classList.add("scrollThumb")

            scrollBar.appendChild(scroll_thumb)
            divide_white_container.appendChild(scrollBar)


    
            let divide_number_container = document.createElement("div")
            divide_number_container.classList.add("divide_number_container")
    
            container.appendChild(divide_white_container)
            container.appendChild(divide_number_container)
    
            this.st2_3_1.appendChild(container)
        }
    }

    SetTopEvent() {
        this.tenDragBlock = GetChildList(this.st2_tenZone, ".dragBlock")
        this.tenStandBlock = GetChildList(this.st2_tenZone, ".standBlock")

        this.tenDragBlock.forEach((element, index) => {
            element.addEventListener("mousedown", (e) => {
                this.DragStart(e, element, index, "ten")
            });

            element.addEventListener("touchstart", (e) => {
                this.DragStart(e, element, index, "ten")
            });

            element.addEventListener("click", (e) => {
                if (this.isHammer) {
                    HideAlert(this.main)
                    this.HammerEvent(element, index, "ten")
                }
            })
        })
    }

    SetOneEvent() {
        this.oneDragBlock = GetChildList(this.st2_oneZone, ".dragBlock")
        this.oneStandBlock = GetChildList(this.st2_oneZone, ".standBlock")

        this.oneDragBlock.forEach((element, index) => {
            element.addEventListener("mousedown", (e) => {
                this.DragStart(e, element, index, "one")
            });

            element.addEventListener("touchstart", (e) => {
                this.DragStart(e, element, index, "one")
            });
        })
    }

    SetBtnEvent() {
        this.s2_hammer.addEventListener("click", () => {
            AnimationHeler.BtnClick(this.s2_hammer)
            HideAlert(this.main)

            if (this.isHammer) {
                this.s2_hammer.src = this.main.ImgPath + "activity/hammer_btn.png"
                this.hammer_icon.style.display = "none"
            } else {
                if (!this.isHammerFirstClick) {
                    this.isHammerFirstClick = true
                    ShowOneSecond(this.main, `십 카드가 일 카드&nbsp<span style="font-family: 'Bbatang'; padding-top: 5px; font-size:48px">10</span>개로 쪼개지고 자동으로 나누어져요.`, 10000)
                }
                this.s2_hammer.src = this.main.ImgPath + "activity/hammer_btn_off.png"
                this.hammer_icon.style.display = "block"
            }

            this.isWrench = false
            this.s2_wrench.src = this.main.ImgPath + "activity/wrench_btn.png"
            this.wrench_icon.style.display = "none"

            this.isHammer = !this.isHammer
        })

        this.s2_wrench.addEventListener("click", () => {
            AnimationHeler.BtnClick(this.s2_wrench)
            HideAlert(this.main)
            
            if (this.isWrench) {
                this.s2_wrench.src = this.main.ImgPath + "activity/wrench_btn.png"
                this.wrench_icon.style.display = "none"
            } else {
                if (!this.isWrenchFirstClick) {
                    this.isWrenchFirstClick = true
                    ShowOneSecond(this.main, `나눈 일 카드&nbsp<span style="font-family: 'Bbatang'; padding-top: 5px; font-size:48px">10</span>개를 십 카드로 바꿀 수 있어요.`, 10000)
                }
                this.s2_wrench.src = this.main.ImgPath + "activity/wrench_btn_off.png"
                this.wrench_icon.style.display = "block"
            }

            this.isHammer = false
            this.s2_hammer.src = this.main.ImgPath + "activity/hammer_btn.png"
            this.hammer_icon.style.display = "none"

            this.isWrench = !this.isWrench
        })

        this.s2_reset.addEventListener("click", () => {
            AnimationHeler.BtnClick(this.s2_reset, () => {
                this.Clear()
                this.Init()
            })
        })

        this.s2_back.addEventListener("click", () => {
            AnimationHeler.BtnClick(this.s2_back)
            this.Clear()
            HideAlert(this.main)
            this.main.intro.Clear()
            this.main.step = this.main.Step.INTRO
            this.main.SetStep()
        })
    }

    FollowMouse(e) {
        let dragOffset = DragOffset(e, this.main.Activity2)
        this.hammer_icon.style.left = dragOffset.x - this.hammer_icon.width/2 + "px";
        this.hammer_icon.style.top = dragOffset.y - this.hammer_icon.height/2 + "px";

        this.wrench_icon.style.left = dragOffset.x - this.wrench_icon.width/2 + "px";
        this.wrench_icon.style.top = dragOffset.y - this.wrench_icon.height/2 + "px";
    }

    /**
     * type
     * 
     * (ten, one) => 드레그 하기 전 최초상태. 상단에 있는 10, 1
     * (dragArea_ten, dragArea_one) => 최초상태에서 영역에 한 번이라도 도달하면 변경됨.
     * (dragArea_left) => 남은카드 영역에 있는 요소
     */
    DragStart(e, element, index, type) {
        if (this.isHammer || this.isWrench) return

        this.isClick = true
        
        if (type == "ten") {
            this.tenStandBlock[index].style.opacity = 0.5
        } else if (type == "one") {
            this.oneStandBlock[index].style.opacity = 0.5
        }


        let computedStyle = window.getComputedStyle(element);

        this.originPos = {x: computedStyle.left, y: computedStyle.top}

        let dragOffset = DragOffset(e, this.main.Activity2)

        //터치 예외
        // if (typeof (e.touches) != "undefined" && type == "dragArea_left") {
        //     const imageRect = element.getBoundingClientRect();
            
        //     if (dragOffset.x - 20 >= imageRect.x * (element.offsetWidth / imageRect.width) &&
        //         dragOffset.x + 20 <= (imageRect.x + imageRect.width) * (element.offsetWidth / imageRect.width)) {
                    
        //     } else {
        //         return
        //     }
        // }

        element.style.position = "absolute"

        e.target.style.zIndex = 3
        e.target.style.left = dragOffset.x - element.offsetWidth/2+ "px"
        e.target.style.top = dragOffset.y - element.offsetHeight/2 + "px"

        const onDragMove = (e) => this.DragMove(e, element, index, type);
        const onDragEnd = (e) => {
            this.main.viewWrap.removeEventListener("mousemove", onDragMove);
            this.main.viewWrap.removeEventListener("mouseup", onDragEnd);

            this.main.viewWrap.removeEventListener("touchmove", onDragMove, { passive: false });
            this.main.viewWrap.removeEventListener("touchend", onDragEnd);

            this.main.viewWrap.removeEventListener("wheel", onDragMove)
            this.DragEnd(e, element, index, type);
        }

        this.main.viewWrap.addEventListener("mousemove", onDragMove);
        this.main.viewWrap.addEventListener("mouseup", onDragEnd);

        this.main.viewWrap.addEventListener("touchmove", onDragMove, { passive: false });
        this.main.viewWrap.addEventListener("touchend", onDragEnd);

        this.main.viewWrap.addEventListener("wheel", onDragMove);


    }

    DragMove(e, element, index, type) {
        if (this.isHammer || this.isWrench) return
        if (!this.isClick) return
        e.preventDefault();
        
        let dragOffset = DragOffset(e, this.main.Activity2)

        element.style.left = dragOffset.x - element.offsetWidth/2 + "px"
        element.style.top =  dragOffset.y - element.offsetHeight/2 + "px"
        
    }

    DragEnd(e, element, index, type) {
        if (this.isHammer || this.isWrench) return

        this.isClick = false
        element.style.zIndex = 0

        for (let i in this.dragArea) {
            let dragArea = this.dragArea[i]

            let dragAreaBnd = dragArea.getBoundingClientRect()
            let dragBnd = element.getBoundingClientRect()

            let elementWidth = dragBnd.width;
            let elementHeight = dragBnd.height;

            let overlapLeft = Math.max(0, dragAreaBnd.right - dragBnd.x);
            let overlapRight = Math.max(0, dragBnd.right - dragAreaBnd.left);
            let overlapTop = Math.max(0, dragAreaBnd.bottom - dragBnd.y);
            let overlapBottom = Math.max(0, dragBnd.bottom - dragAreaBnd.top);

            let overlapWidth = Math.min(overlapLeft, elementWidth) + Math.min(overlapRight, elementWidth) - elementWidth;
            let overlapHeight = Math.min(overlapTop, elementHeight) + Math.min(overlapBottom, elementHeight) - elementHeight;

            let overlapArea = Math.max(0, overlapWidth) * Math.max(0, overlapHeight);

            let elementArea = elementWidth * elementHeight;

            //드레그 영역 들어왔을때
            if (overlapArea > elementArea / 2) {
                element.style.left = this.originPos.x
                element.style.top = this.originPos.y
                element.style.display = "none"

                if (type == "ten") {
                    //this.dragTenCompleteList.push(element)
                } else if (type == "one") {
                    //this.dragOneCompleteList.push(element)
                } else if (type == "dragArea_left"){
                    this.CalcBeforeNumber(type)
                    type = "left"
                    element.remove()
                } else if (type == "left") {
                    element.remove()
                    this.CheckMiddleChildLength()
                    this.SetMiddleNumber()
                } else {
                    element.remove()
                }

                this.SetDragAreaBlock(dragArea, i, type)
                return;
            } else {
                if (this.dragArea.length - 1 == i) {
                    element.style.left = this.originPos.x
                    element.style.top = this.originPos.y
    
                    if (type == "ten") {
                        this.tenStandBlock[index].style.opacity = 1
                    } else if (type == "one") {
                        // this.oneStandBlock[index].style.opacity = 1
                        let leftChild = GetChildList(this.left_img_container)
                        if (leftChild.length < 9) {
                            element.style.display = "none"
                            this.SetMiddleBlock(1)
                        }
                        

                    } else if (type == "dragArea_ten") {
                        this.CalcBeforeNumber(type)
                        this.CheckDragAreaOverFlow()
                        element.remove()

                        let numberContainer = this.beforeArea.parentElement.querySelector(".scrollZone")
                        let numberListIdx = FindIndexOfChild(this.st2_3_1, this.beforeArea.parentElement)
                        this.dragAreaNumList[numberListIdx] += 10
                        this.SetDragAreaBlock(numberContainer, numberListIdx, type)

                        //this.SetMiddleBlock(1)
                        // this.dragTenCompleteList[0].style.display = "inline-block"
                        // this.dragTenCompleteList.shift()
                    } else if (type == "dragArea_one") {
                        let leftChild = GetChildList(this.left_img_container)

                        if (leftChild.length < 9) {
                            this.CalcBeforeNumber(type)
                            this.CheckDragAreaOverFlow()
                            element.remove()
    
                            this.SetMiddleBlock(1)
                        } else {
                            element.style.position = ""
                        }
                        
                        // this.dragOneCompleteList[0].style.display = "inline-block"
                        // this.dragOneCompleteList.shift()
                    } else if (type == "dragArea_left") {
                        let leftChild = GetChildList(this.left_img_container)
                        if (leftChild.length < 9) {
                            this.CalcBeforeNumber(type)
                            this.CheckDragAreaOverFlow()
                            element.remove()
                            this.SetMiddleBlock(1)
                        } else {
                            element.style.position = ""
                        }
                    } else if (type == "left") {
                        element.style.position = "static"
                    }
                }
            }
        }
    }
    
    SetDragAreaBlock(dragArea, index, type) {
        if (this.dragAreaNumList[index] == "") 
            this.dragAreaNumList[index] = 0

        let createDom = document.createElement("div")
        createDom.style.cursor = "pointer"
        createDom.style.display = "inline-block"

        createDom.style.width = "68px"
        createDom.style.height = "68px"
        createDom.style.margin = "0px 7px"


        if (type == "ten" || type == "dragArea_ten") {
            createDom.style.backgroundImage = `url('${this.main.ImgPath + "activity/ten.png"}')`
            this.dragAreaNumList[index] += 10
        } else if (type == "one" || type == "dragArea_one" || type == "left") {
            createDom.style.backgroundImage = `url('${this.main.ImgPath + "activity/one.png"}')`
            this.dragAreaNumList[index] += 1
        }

        this.CalcBeforeNumber(type)

        this.dragNumArea[index].innerText = this.dragAreaNumList[index]

        dragArea.appendChild(createDom)

        this.CheckDragAreaOverFlow()

        if (type == "dragArea_ten") type = "ten"
        if (type == "dragArea_one") type = "one"

        createDom.setAttribute("type", type)

        this.SetAreaDragEvent(dragArea, index, type)
    }

    /** DragArea의 블록에 드레그 이벤트 생성 */
    SetAreaDragEvent(dragArea, index, type) {
        dragArea = RemoveListener(dragArea)
        this.DragAreaClickEvent(dragArea, index)

        let blocks = GetChildList(dragArea)
        this.dragArea = Array.from(this.main.shadow.querySelectorAll(".scrollZone"))

        let dragAreaIdx = Array.prototype.indexOf.call(this.main.shadow.querySelectorAll(".scrollZone"), dragArea);

        this.answerDragBlock = GetChildList(dragArea, "div")

        this.answerDragBlock.sort((a, b) => {
            if (a.getAttribute('type') === 'ten' && b.getAttribute('type') !== 'ten') {
                return -1;
            } else if (a.getAttribute('type') !== 'ten' && b.getAttribute('type') === 'ten') {
                return 1;
            } else {
                return 0;
            }
        });
          
        this.answerDragBlock.forEach(child => dragArea.appendChild(child));

        this.answerDragBlock.forEach((element, index) => {
            element.addEventListener("mousedown", (e) => {
                if (this.isHammer || this.isWrench) return
                this.beforeArea = element.parentElement.parentElement

                this.DragStart(e, element, index, "dragArea_" + element.getAttribute("type"))
            });

            element.addEventListener("touchstart", (e) => {
                if (this.isHammer || this.isWrench) return
                this.beforeArea = element.parentElement.parentElement

                this.DragStart(e, element, index, "dragArea_" + element.getAttribute("type"))
            });

            //타입이 ten쪽일 경우 망치 이벤트 생성
            let type = element.getAttribute("type")
            if (type == "ten" || type == "dragArea_ten") {
                element.addEventListener("click", (e) => {
                    if (this.isHammer) {
                        HideAlert(this.main)

                        let leftChild = GetChildList(this.left_img_container)
                        let mod = 10 % this.main.value2
        
                        if (leftChild.length + mod <= 9) {
                            let numberContainer = this.main.shadow.querySelectorAll(".divide_number_container")[dragAreaIdx]
                            this.dragAreaNumList[dragAreaIdx] -= 10
                            let context = Number(numberContainer.innerText) - 10
                            numberContainer.innerText = context
                        }

                        this.HammerEvent(element, -1, "ten")
                    }
                })
            }
        })
    }

    /** DragArea 수가 12개보다 많으면 스크롤 생기게, 그 이하면 안생기게 */
    CheckDragAreaOverFlow() {
        this.dragArea.forEach((element, index) => {
            let child = GetChildList(element)
            let scrollLength = 12

            //모바일, 뷰어 대응
            let userAgent = navigator.userAgent
            let isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
            
            if (document.querySelector('kve-editor') || isMobileUserAgent) {
                scrollLength = 10
            }

            const scrollEvent = (e) => {
                this.isScrolling = true;
                clearTimeout(this.isScrolling);
                this.isScrolling = setTimeout(() => {
                    this.isScrolling = false;
                }, 100);
            }

            if (child.length > scrollLength) {
                // element.parentElement.children[1].classList.remove("scrollDeActivity")
                element.children[1].classList.remove("scrollDeActivity")
                element.style.overflowY = "scroll"
                // element.parentElement.style.paddingLeft = "0px"
                child.forEach((element) => {
                    element.style.margin = "0px 5px"
                })

                element.addEventListener('scroll', scrollEvent)
            } else {
                // element.parentElement.children[1].classList.add("scrollDeActivity")
                element.style.overflowY = "hidden"
                element.scrollTop = 0;
                // element.parentElement.style.paddingLeft = "8px"
                child.forEach((element) => {
                    element.style.margin = "0px 7px"
                })
                element.removeEventListener('scroll', scrollEvent)
            }
        })
    }

    /** 남은 카드 드레그 이벤트 */
    SetLeftAreaEvent() {
        this.left_img_container = RemoveListener(this.left_img_container)
        
        let blocks = GetChildList(this.left_img_container)

        blocks.forEach((element, index) => {
            element.addEventListener("mousedown", (e) => {
                if (this.isHammer || this.isWrench) return
                this.beforeArea = element.parentElement

                this.DragStart(e, element, index, "left")
            });

            element.addEventListener("touchstart", (e) => {
                if (this.isHammer || this.isWrench) return
                this.beforeArea = element.parentElement

                this.DragStart(e, element, index, "left")
            });
        })
    }

    /** dragArea 간의 이동일 경우 dragArea 숫자 변경 */
    CalcBeforeNumber(type) {
        if (type == "dragArea_ten") {
            let numberContainer = this.beforeArea.parentElement.querySelector(".divide_number_container")
            let numberListIdx = FindIndexOfChild(this.st2_3_1, this.beforeArea.parentElement)
            this.dragAreaNumList[numberListIdx] -= 10

            let context = Number(numberContainer.innerText) - 10
            numberContainer.innerText = context
        } else if (type == "dragArea_one" || type == "dragArea_left") {
            let numberContainer = this.beforeArea.parentElement.querySelector(".divide_number_container")
            let numberListIdx = FindIndexOfChild(this.st2_3_1, this.beforeArea.parentElement)
            this.dragAreaNumList[numberListIdx] -= 1

            let context = Number(numberContainer.innerText) - 1
            numberContainer.innerText = context
        }
    }

    HammerEvent(element, index, type) {
        let leftChild = GetChildList(this.left_img_container)
        
        if (type == "ten" && element.style.display != "none") {
            if (index != -1)
                this.tenStandBlock[index].style.opacity = 0.5

            this.dragTenCompleteList.push(element)

            let quot = Math.floor(10 / this.main.value2)
            let mod = 10 % this.main.value2

            if (leftChild.length + mod > 9) {
                AnimationHeler.Wrong(element)
                return
            }

            element.style.display = "none"

            for (let i = 0; i < quot; i++) {
                this.dragArea.forEach((element, index) => {
                    this.SetDragAreaBlock(element, index, "left")
                })
            }
            
            this.SetMiddleBlock(mod)
        }
    }

    WrenchEvent(dragArea, index) {
        let child = GetChildList(dragArea)

        let oneList = []
        child.forEach((element) => {
            let type = element.getAttribute("type")

            if (type == "one" || type == "left") {
                oneList.push(element)
            }
        })

        //10보다 작으면 리턴
        if (oneList.length < 10) return

        oneList.forEach((element, index) => {
            if (index < 10) {
                element.remove()
                // element.style.display = "none"
            }
        })

        this.beforeArea = dragArea.parentElement
        this.CalcBeforeNumber("dragArea_ten")

        this.SetDragAreaBlock(dragArea, index, "ten")
        this.CheckDragAreaOverFlow()
    }

    SetDragAreaEvent() {
        this.dragArea.forEach((element, index) => {
            this.DragAreaClickEvent(element, index)
        })
    }
    

    DragAreaClickEvent(element, index) {
        element.addEventListener("click", (e) => {
            if (!this.isWrench) return
            HideAlert(this.main)
            this.WrenchEvent(element, index)
        })
    }

    /** 남은 카드 숫자 세팅 */
    SetMiddleNumber() {
        let child = GetChildList(this.left_img_container)

        this.left_cnt_container.innerText = child.length
    }

    /** 9개 이상이면 스크롤 생기게, 없으면 제거 */
    CheckMiddleChildLength() {
        let middleArr = GetChildList(this.left_img_container)

        if (middleArr.length > 9) {
            this.left_img_container.style.overflow = "auto"
        } else {
            this.left_img_container.style.overflow = "visible"
        }
    }
   
    Clear() {
        this.st2_3_1.innerHTML = ""

        RemoveChildList(this.st2_tenZone, ".dragBlock")
        RemoveChildList(this.st2_oneZone, ".dragBlock")

        this.left_img_container.innerHTML = ""

        this.left_cnt_container.innerText = ""

        this.s2_reset = RemoveListener(this.s2_reset)

        this.wrench_icon.style.display = "none"
        this.hammer_icon.style.display = "none"

        this.s2_hammer.src = this.main.ImgPath + "activity/hammer_btn.png"
        this.s2_wrench.src = this.main.ImgPath + "activity/wrench_btn.png"

        this.s2_wrench = RemoveListener(this.s2_wrench)
        this.s2_hammer = RemoveListener(this.s2_hammer)
    }
}
