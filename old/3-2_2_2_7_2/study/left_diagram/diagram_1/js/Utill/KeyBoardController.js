import { AnimationHeler } from "./AnimationHelper.js"
import MainActivity from "../Activity/MainActivity.js";
import { HideAlert } from "./AlertController.js";
import { RemoveListener } from "./EventListenerHelper.js";

/** 키보드의 숫자 버튼 클릭 이벤트 */
export function SetKeyBoardClickEvent(main) {
    let btnList = main.shadow.querySelectorAll(".key-btn")

    btnList.forEach((element, index) => {
        element.addEventListener("click", (event) => {       
            event.stopPropagation();    

            AnimationHeler.BtnClick(element)

            KeyBoardOn(main)
            main.nowInputEl.value +=  element.getAttribute("data-num");

            let inputLength = !main.nowInputEl.value ? 0 : String(main.nowInputEl.value).length;

            if ( inputLength > main.nowInputEl.getAttribute("maxlength")) {
                KeyBoardBtnLengthDiffCallBack()
                let newValue = main.nowInputEl.value.slice(0, -1);
                main.nowInputEl.value = newValue;

                // KeyBoardOff()
                return
            }

            KeyBoardBtnCallBack()
            
        })
    })
}

/** 키보드 숫자 버튼 콜백 */
export let KeyBoardBtnCallBack = () => {}

/** 키보드 숫자 버튼 콜백 외부파일에서 세팅*/
export const SetKeyBoardBtnCallBack = (callback) => {
    KeyBoardBtnCallBack = callback;
};

/** 키보드 숫자 버튼 길이와 다를때 콜백 */
export let KeyBoardBtnLengthDiffCallBack = () => {}
export const SetKeyBoardBtnLengthDiffCallBack = (callback) => {
    KeyBoardBtnLengthDiffCallBack = callback;
};


/** 키보드 열기 */
export function KeyBoardOn(main) {
    HideAlert(main)
    const keyBoard = main.shadow.querySelector(".keyboard");
    keyBoard.style.display = "flex"
    main.isKeyBoard = true
}

/** 키보드 닫기 */
export function KeyBoardOff(main) {
    const keyBoard = main.shadow.querySelector(".keyboard");
    keyBoard.style.display = "none"
    main.isKeyBoard = false
}

/** 키보드 클래스 */
export class KeyBoard {
    constructor(element) {
        this.element = element

        this.SetInputClickEvent()

        this.useKeyBoard = true
        this.focusClear = true

        this.inputDiffLengthEvent = () => {}
        this.focusEvent = () => {}
        
        /** 생성시 키보드 버튼 콜백 초기화 */
        SetKeyBoardBtnCallBack(() => {})

    }

    answer = -1

    SetInputClickEvent() {
        this.element.addEventListener("click", (event) => {
            event.stopPropagation();
            event.target.value = "";

            MainActivity.inputAnswer = this.answer
            MainActivity.nowInputEl = this.element
            
            if (this.useKeyBoard) KeyBoardOn()
        })

        this.element.addEventListener("focus", (event) => {
            if (this.focusClear) {
                event.stopPropagation();
                event.target.value = "";
                MainActivity.nowInputEl = this.element
            }

            this.focusEvent()
            
        })

        this.element.addEventListener('input', (event) => {
            event.stopPropagation();
            const inputValue = event.target.value;
            event.target.value = inputValue.replace(/\D/g, '');

            let inputLength = !MainActivity.nowInputEl.value ? 0 : String(MainActivity.nowInputEl.value).length;
            if (inputLength == MainActivity.nowInputEl.getAttribute("maxlength")) {
                if (this.useKeyBoard) {
                    KeyBoardOff(this.main)
                }
            } else {
                this.inputDiffLengthEvent()
            }
                
            
        });
        
    }

    Clear() {
        this.element.value = "";
        MainActivity.nowInputEl = this.element
    }
}

//div로 만든 키보드
export class KeyBoardType2 {
    constructor(element, eventEmitter, main) {
        this.main = main
        this.element = element

        this.element.setAttribute('tabindex', 0);
        this.element.style.outline = "none"

        this.isUseKeyBoard = true
        this.useCustomKeyBoard = true

        this.answer = 123;
        this.maxLength = 3

        this.allowBlur = false
        this.eventEmitter = eventEmitter;

        this.FailEvent = null
        this.ClickEvent = () => {}
        this.SuccessEvent = () => {}

        //CK => CustomKeyBoard
        this.CKOverEvent = () => {}

        this.useCheckAnswer = true
        this.canKeyDown = true
    }

    Init() {
        this.SetKeyBoardEvent()
    }

    SetKeyBoardEvent() {        
        this.eventEmitter.on('customEvent', (data) => {
            this.allowBlur = true
        });

        this.element.addEventListener('click', (event) => {
            event.stopPropagation()
            if (!this.isUseKeyBoard) return

            this.allowBlur = false
            this.triggerEvent()

            this.StopAnimation()

            this.element.textContent = '';
            this.element.style.backgroundImage = `url()`
            this.element.focus();

            if (this.useCustomKeyBoard) {
                this.SetCustomKeyBoard()
                KeyBoardOn(this.main)
            }
        });

        this.main.viewWrap.addEventListener("click", (event) => {
            this.allowBlur = true
            this.element.blur()
        })

        this.element.addEventListener('blur', (event) => {
            if (!this.allowBlur) {
                event.target.focus();
            }
        })

        this.element.addEventListener('keydown', (event) => {
            if (!this.isUseKeyBoard) return;

            this.allowBlur = false
            if (!isNaN(event.key)) {
                //입력 제한수 보다 적을때만 입력
                if (this.element.textContent.length < this.maxLength) {

                    this.element.style.backgroundImage = `url()`
                    this.element.textContent += event.key;

                    //입력 글자 같으면 정답 비교
                    if (this.element.textContent.length == this.maxLength && this.useCheckAnswer) this.CheckAnswer()
                }
            } else if (event.key === 'Backspace') {
                this.element.textContent = this.element.textContent.slice(0, -1);
            }
            event.preventDefault();
        });
    }

    CheckAnswer() {
        this.isUseKeyBoard = false

        if (this.element.textContent == this.answer) {
            KeyBoardOff(this.main)
            this.SuccessEvent()
        } else {
            this.animation = AnimationHeler.Wrong(this.element, () => {
                this.isUseKeyBoard = true
                if (this.FailEvent) {
                    this.FailEvent()
                } else {
                    this.element.textContent = ""
                    this.element.style.backgroundImage = `url(${this.main.ImgPath}Subtract.png)`
                }
            })

            KeyBoardOff(this.main)
        }
    }

    SetCustomKeyBoard() {
        let btnList = this.main.shadow.querySelectorAll(".key-btn")
    
        btnList.forEach((element, index) => {
            element = RemoveListener(element)

            element.addEventListener("click", (event) => {       
                event.stopPropagation();    
    
                AnimationHeler.BtnClick(element)

                //입력 제한수와 같다면 (제한 수보다 더 긴 수를 입력하면)
                if (this.element.textContent.length === this.maxLength) {
                    this.CKOverEvent()
                }

                //입력 제한수 보다 적을때만 입력
                else if (this.element.textContent.length < this.maxLength) {
                    this.element.style.backgroundImage = `url()`
                    this.element.textContent +=  element.getAttribute("data-num");

                    //입력 글자 같으면 정답 비교
                    if (this.element.textContent.length == this.maxLength && this.useCheckAnswer) this.CheckAnswer()
                }
            })
        })
    }

    StopAnimation() {
        if (this.animation != undefined) {
            this.animation.restart()
            this.animation.pause()
        }
    }

    Reset() {
        this.StopAnimation()
        this.element.textContent = ""
        this.element.style.backgroundImage = `url(${this.main.ImgPath}Subtract.png)`

        this.isUseKeyBoard = true
    }

    SeyCustomKeyBoardTop(top) {
        const keyBoard = this.main.shadow.querySelector(".keyboard");
        keyBoard.style.top = top + "px" 
    }

    triggerEvent(data) {
        this.eventEmitter.emit('customEvent', data);
    }
}

//KeyBoardType2 옵저버 패턴 이벤트 감지 클래스
export class EventEmitter {
    constructor() {
      this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event, data) {
        if (this.events[event]) {
          this.events[event].forEach(listener => listener(data));
        }
    }
}