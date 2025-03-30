import { SetActive, SetActivityArray, SetDeActivityArray } from "../Utill/ActiveController.js";
import { FullScreenController } from "../Utill/FullScreenController.js";
import { GuideController } from "../Utill/GuideController.js";
import { SetKeyBoardClickEvent } from "../Utill/KeyBoardController.js";
import IntroActivity from "./IntroActivity.js";
import StepFirstActivity from "./StepFirstActivity.js";
import StepSecondActivity from "./StepSecondActivity.js";

export default class MainActivity {
    constructor() {
        // if (!MainActivity.instance) {
        //     MainActivity.instance = this;
        // }

        // return MainActivity.instance; 
    }

    /** 키보드 기능으로 입력중인 대상 */
    nowInputEl = null

    Init() {
        const url = new URL(this.metaUrl);

        // RootPath 설정 (필요시 변경)
        this.RootPath = url.origin + new URL(this.metaUrl).pathname.split('/').slice(0, -2).join('/');
        this.ImgPath = this.RootPath + "/img/"

        //뷰어에 띄우기
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Bbatang';
                src: url('${this.RootPath}/font/batang.ttf') format('truetype');
            }
    
            @font-face {
                font-family: 'Malgun';
                src: url('${this.RootPath}/font/malgun.ttf') format('truetype');
            }

            @font-face {
                font-family: 'Malgunbd';
                src: url('${this.RootPath}/font/malgunbd.ttf') format('truetype');
            }
        `
        document.body.appendChild(style)


        //각 활동별 영역
        this.Intro = this.shadow.querySelector("#intro_activity")
        this.Activity1 = this.shadow.querySelector("#step1_activity")
        this.Activity2 = this.shadow.querySelector("#step2_activity")

        this.Step = {
            INTRO: "intro",
            ACTIVITY_1: "activity1",
            ACTIVITY_2: "activity2"
        }

        this.step = this.Step.INTRO

        this.intro = new IntroActivity(this)
        this.activity1 = new StepFirstActivity(this)
        this.activity2 = new StepSecondActivity(this)

        this.guide = this.shadow.querySelector("#guide")
        this.guideController = new GuideController(this.guide)

        this.viewWrap = this.shadow.querySelector("#viewWrap")
        this.viewWrap.ondragstart = new Function("return false");Function("return false");
    }

    Start() {
        FullScreenController(this)
        SetKeyBoardClickEvent(this)

        this.SetStep()
    }

    SetStep() {
        switch(this.step) {
            case this.Step.INTRO:
                this.Intro_Step()

                SetActivityArray([this.Intro])
                SetDeActivityArray([this.Activity1, this.Activity2])
                break;
            case this.Step.ACTIVITY_1:
                this.Activity1_Step()

                SetActivityArray([this.Activity1])
                SetDeActivityArray([this.Intro, this.Activity2])
                break;
            case this.Step.ACTIVITY_2:
                this.Activity2_Step()

                SetActivityArray([this.Activity2])
                SetDeActivityArray([this.Intro, this.Activity1])
                break;
        }
    }

    Intro_Step() {
        this.intro.Init()

        this.Intro.style.display = "flex"
        this.Activity1.style.display = "none"
        this.Activity2.style.display = "none"
    }

    Activity1_Step() {
        this.activity1.Init();

        this.Activity1.style.display = "flex"
        this.Activity2.style.display = "none"
    }

    Activity2_Step() {
        this.activity2.Init();

        this.Activity1.style.display = "none"
        this.Activity2.style.display = "block"
    }
    
    
}

// const instance = new MainActivity();

// export default instance;