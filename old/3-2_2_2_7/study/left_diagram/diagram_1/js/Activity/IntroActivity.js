import { HideAlert, ShowOneSecond } from "../Utill/AlertController.js";
import { AnimationHeler } from "../Utill/AnimationHelper.js";
import { RemoveListener } from "../Utill/EventListenerHelper.js";
import { EventEmitter, KeyBoard, KeyBoardBtnCallBack, KeyBoardOff, KeyBoardType2, SetKeyBoardBtnCallBack, SetKeyBoardBtnLengthDiffCallBack } from "../Utill/KeyBoardController.js";

export default class IntroActivity {
    constructor(main) {
        this.main = main

        //입력 받는 칸
        this.input1 = this.main.shadow.querySelector("#input-1")
        this.input2 = this.main.shadow.querySelector("#input-2")

        this.btnDone = this.main.shadow.querySelector("#btnDone");
        this.btnReset = this.main.shadow.querySelector("#btnReset");

        this.step1_btn = this.main.shadow.querySelector("#step1_btn")
        this.step2_btn = this.main.shadow.querySelector("#step2_btn")

        this.isDone = false
    }

    Init() {
        this.calcType = ""

        this.SetClickEvent()
        this.SetKeyBoard()

        this.SetInputAlert()   

        this.main.Intro.addEventListener("click", (event) => {
            event.stopPropagation();
            KeyBoardOff(this.main)
            HideAlert(this.main)
        })

        this.input1.textContent = 0
        this.input2.textContent = 0
        this.btnDone.style.display = "block"
        this.btnReset.style.display = "none"
    }

    SetKeyBoard() {
        const overEvent = (element) => {
            if (element == this.input1) {
                ShowOneSecond(this.main, `나누어지는 수는&nbsp <span style="font-family: 'Bbatang'; padding-top: 5px; font-size:48px">10~99</span>만 입력 가능해요.`, 8000)
                this.input1.textContent = 0
            }
            if (element == this.input2) {
                ShowOneSecond(this.main, `나누는 수는&nbsp <span style="font-family: 'Bbatang'; padding-top: 5px; font-size:48px">2~9</span>만 입력 가능해요.`, 8000)
                this.input2.textContent = 0
            }
            KeyBoardOff(this.main)
        }

        this.eventEmitter = new EventEmitter()

        if(!this.inputKey1) {
            this.inputKey1 = new KeyBoardType2(this.input1, this.eventEmitter, this.main)
            this.inputKey1.maxLength = 2
            this.inputKey1.useCheckAnswer = false
            this.inputKey1.CKOverEvent = () => {
                overEvent(this.input1)
            }
            this.inputKey1.Init()
        }
        if(!this.inputKey2) {
            this.inputKey2 = new KeyBoardType2(this.input2, this.eventEmitter, this.main)
            this.inputKey2.maxLength = 1
            this.inputKey2.useCheckAnswer = false
            this.inputKey2.CKOverEvent = () => {
                overEvent(this.input2)
            }
            this.inputKey2.Init()
        }

    }

    SetClickEvent() {
        //인트로 배경 클릭 이벤트
        this.main.Intro.addEventListener("click", (event) => {
            if (this.isDone) return
            event.stopPropagation();
            KeyBoardOff(this.main)
            HideAlert(this.main)

            if (this.input1.textContent == "") {
                this.input1.textContent = "0"
            }

            if (this.input2.textContent == "") {
                this.input2.textContent = "0"
            }
        })
        if(!this.btnDone.hasClickListener) {
            this.btnDone.hasClickListener = true;
            this.btnDone.addEventListener("click", (event) => {
                event.stopPropagation();

                AnimationHeler.BtnClick(this.btnDone)
                KeyBoardOff(this.main)

                if (this.input1.textContent == "0" && this.input2.textContent == "0") {
                    ShowOneSecond(this.main, `(두 자리 수)<span style="font-family: 'Bbatang'; padding-top: 5px; font-size: 48px">÷</span>(한 자리 수)를 만들어 주세요.`, 8000)
                    return
                }

                if (this.input1.textContent < 10 || this.input1.textContent > 99) {
                    ShowOneSecond(this.main, `나누어지는 수는&nbsp <span style="font-family: 'Bbatang'; padding-top: 5px; font-size:48px">10~99</span>만 입력 가능해요.`, 8000)
                } else if (this.input2.textContent < 2 || this.input2.textContent > 9) {
                    ShowOneSecond(this.main, `나누는 수는&nbsp <span style="font-family: 'Bbatang'; padding-top: 5px; font-size:48px">2~9</span>만 입력 가능해요.`, 8000)
                } else if (this.input1.textContent != this.main.value1 || this.input2.textContent != this.main.value2) {
                    ShowOneSecond(this.main, `알맞은 (두 자리 수)<span style="font-family: 'Bbatang'; padding-top: 5px; font-size: 48px">÷</span>(한 자리 수)를 입력해 주세요!`, 8000)
                    this.input1.textContent = 0
                    this.input2.textContent = 0
                } else {
                    // todo: 장마다 activity 를 바꾸어 주어야 한다.
                    this.main.showStartMessage = true;
                    this.main.step = this.main.Step.ACTIVITY_1
                    this.main.SetStep();
                    // input 을 활성화 해야 함으로 알린다.
                    const args = {
                        'root': this.main.shadow,
                        'type': 'valueComplete',
                    };
                    const myEvent = new CustomEvent('callToParent',
                        {
                            detail: {message: args},
                            bubbles: true,
                            composed: true
                        }
                    );
                    this.main.shadow.dispatchEvent(myEvent);
                }
            })
        }

        this.btnReset.addEventListener("click", (event) => {
            event.stopPropagation();
            AnimationHeler.BtnClick(this.btnReset)

            this.btnDone.style.display = "block"
            this.btnReset.style.display = "none"

            this.Clear()
            this.Init()
        })

        this.step1_btn.addEventListener("click", () => {
            if (!this.isDone) return

            this.main.step = this.main.Step.ACTIVITY_1
            this.main.SetStep()
        })

        this.step2_btn.addEventListener("click", () => {
            if (!this.isDone) return

            this.main.step = this.main.Step.ACTIVITY_2
            this.main.SetStep()
        })
    }

    SetInputAlert() {
        this.input1.addEventListener("click", () => {
            if (this.input1First) {
                this.input1First = false
                return
            }

            if (this.input2.textContent == "")
                this.input2.textContent = 0


        })

        this.input2.addEventListener("click", () => {
            if (this.input1First) {
                this.input1First = false
                return
            }

            if (this.input1.textContent == "")
                this.input1.textContent = 0
            

            // if ((this.input1.textContent < 10 || this.input1.textContent > 99)) {
            //     KeyBoardOff(this.main)
            //     ShowOneSecond(this.main, `나누어지는 수는&nbsp <span style="font-family: 'Bbatang'; padding-top: 5px;">10~99</span>만 입력 가능해요.`, 8000)
            // }
        })
    }

    Clear() {
        this.input1.textContent = 0
        this.input2.textContent = 0

        this.main.value1 = ""
        this.main.value2 = ""

        this.input1.disabled = false
        this.input2.disabled = false

        this.input1First = true

        this.multi = this.main.shadow.querySelector("#multi")
        this.divide = this.main.shadow.querySelector("#divide")

        this.step1_btn.src = this.main.ImgPath + "activity/Intro_button_1_off.png"
        this.step2_btn.src = this.main.ImgPath + "activity/Intro_button_2_off.png"

        this.btnDone = RemoveListener(this.btnDone)
        this.btnReset = RemoveListener(this.btnReset)

        this.btnDone.style.display = "block"
        this.btnReset.style.display = "none"
        
        this.step1_btn = RemoveListener(this.step1_btn)
        this.step2_btn = RemoveListener(this.step2_btn)

        this.isDone = false

        this.input1 = RemoveListener(this.input1)
        this.input2 = RemoveListener(this.input2)
    }

    BackClear() {
        this.isDone = true

        this.step1_btn = RemoveListener(this.step1_btn)
        this.step2_btn = RemoveListener(this.step2_btn)
    }
}