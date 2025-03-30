import {StartCapture} from "../Utill/Capture.js";

export class MainEvent {
    constructor() {
        // 이것의 textContent 는 선택에 따라 개념학습, 문제 풀이로 바뀜
        this.topArea_type = document.querySelector("#topArea_type")
        // study 에 있는 아래 네비게이션
        this.bottom_nav = document.querySelector("#bottom_nav")
        // 캡쳐 버튼 요소
        this.capture = document.querySelector("#capture")
        // 홈 버튼 요소
        this.home = document.querySelector("#homeBtn")
        // study 안에 타이틀을 가지고 있는 요소
        this.top_container = document.querySelector("#top_container")
        // 개념 학습으로 가는 버튼
        this.step1Btn = document.querySelector("#step1Btn")
        // 문제 풀기로 가는 버튼
        this.step2Btn = document.querySelector("#step2Btn")

        this.Intro = document.querySelector("#intro_activity")
        this.Study = document.querySelector("#study_activity")
        this.concept_learning = document.querySelector("#concept_learning")
        this.problem_solving = document.querySelector("#problem_solving")
        // 개념 학습에서 교구를 선택하는 버튼
        this.concept_learning_buttons = document.querySelectorAll(".chapterBtn")
        // 팝업 관련
        this.popup = document.querySelector("#popup");
        this.keyboard = document.querySelector('.keyboard');
        this.keyboardTarget = -1; //
        this.keyboardRoot = null;
        if (!MainEvent.instance) {
            MainEvent.instance = this;
        }
        return MainEvent.instance;
    }

    Init() {
        this.metaUrl = import.meta.url
        const url = new URL(this.metaUrl);

        // RootPath 설정 (필요시 변경, 추가)
        this.RootPath = url.origin + new URL(this.metaUrl).pathname.split('/').slice(0, -3).join('/');
        this.ImgPath = this.RootPath + "/img/"

        this.Step = {
            INTRO: "intro",
            CONCEPT_LEARNING: "concept learning",
            PROBLEM_SOLVING: "problem solving"
        }

        this.step = ""

        //브라우저 기본 드래그 이벤트 사용 불가능하게
        document.body.ondragstart = new Function("return false");
        Function("return false");

        /** 페이지 인덱스 */
        this.pageIdx = 0

        /** 탭 인덱스 */
        this.tabIdx = 0

        // intro 에 있는 개념 학습 버튼에 이벤트 추가
        this.step1Btn.addEventListener("click", (e) => {
            this.SetStep(this.Step.CONCEPT_LEARNING);
        })
        // intro 에 있는 문제 풀기 버튼에 이벤트 추가
        this.step2Btn.addEventListener("click", (e) => {
            this.SetStep(this.Step.PROBLEM_SOLVING);
        })
        for (let i = 0; i < this.concept_learning_buttons.length; i++) {
            this.concept_learning_buttons[i].addEventListener("click", (e) => {
                this.OnClickConceptLearningButton(i);
            })
        }
        //`````````````````````````````````````````````````````````
        // shadow dom 의 콜 요청을 받는다
        //_________________________________________________________
        this.concept_learning.addEventListener("callToParent", (event) => {
            {
                event.stopImmediatePropagation();
                if (event.detail.message.type === "popup") {
                    this.popup.classList.remove("hide");
                    this.popup.querySelector("#popup_" + event.detail.message.target)
                        .classList.remove("hide");
                    this.popup.querySelector(".popup_" + event.detail.message.target)
                        .classList.remove("hide");
                } else if (event.detail.message.type === "problem") {
                    this.SetStep(this.Step.PROBLEM_SOLVING);
                } else if (event.detail.message.type === "keyboard") {
                    this.keyboardRoot = event.detail.message.root;
                    if (this.checkPhone()) {
                        const target = event.detail.message.target;
                        const index = parseInt(target);
                        const tail = this.keyboard.querySelector('.keyboard_tail');
                        if (index === 0) {
                            this.keyboard.style.top = "320px";
                            tail.style.top = "370px";
                        } else if (index === 1) {
                            this.keyboard.style.top = "320px";
                            tail.style.top = "470px";
                        }else if (index === 2) {
                            this.keyboard.style.top = "260px";
                            tail.style.top = "130px";
                        }
                        this.keyboard.classList.remove('hide');
                        this.keyboardTarget = target;
                    }
                } else if (event.detail.message.type === "close_keyboard") {
                    this.keyboard.classList.add('hide');
                }
            }
        })
        // 문제 풀기에서 날라오는 것
        this.problem_solving.addEventListener("callToParent", (event) => {
            {
                event.stopImmediatePropagation();
                if (event.detail.message.type === "popup") {
                    this.popup.classList.remove("hide");
                    // 오는 것이 하나뿐이라 이렇게 처리했지만... 나중에 늘어나면??
                    this.popup.querySelector("#popup_3")
                        .classList.remove("hide");
                    this.popup.querySelector(".popup_3")
                        .classList.remove("hide");
                } else if (event.detail.message.type === "keyboard") {
                    this.keyboardRoot = event.detail.message.root;
                    if (this.checkPhone()) {
                        const target = event.detail.message.target;
                        const index = parseInt(target);
                        const tail = this.keyboard.querySelector('.keyboard_tail');
                        this.keyboard.style.top = "320px";
                        tail.style.top = "382px";
                        this.keyboard.classList.remove('hide');
                        this.keyboardTarget = target;
                    }
                } else if (event.detail.message.type === "close_keyboard") {
                    this.keyboard.classList.add('hide');
                } else if (event.detail.message.type === "tapChange") {
                    this.tabIdx = event.detail.message.tab;
                }
            }
        })
        this.popup.querySelectorAll('.popup_close').forEach((close) => {
            close.addEventListener("click", (e) => {
                this.popup.classList.add("hide");
                this.popup.querySelector("#popup_1").classList.add("hide");
                this.popup.querySelector("#popup_2").classList.add("hide");
                this.popup.querySelector("#popup_3").classList.add("hide");
                this.popup.querySelectorAll(".popup_close").forEach((close) => {
                    close.classList.add('hide');
                })
            })
        });
        this.capture.addEventListener("click", (e) => {
            let fileName = '4학년_2학기_4단원_7차시_';
            if (!this.concept_learning.classList.contains('hide')) {
                fileName += "개념학습_" + (this.pageIdx + 1);
            } else {
                fileName += "문제풀이_" + (this.tabIdx + 1);
            }
            StartCapture(fileName)
        });
        this.home.addEventListener("click", (e) => {
            this.SetStep(this.Step.INTRO);
        });
        // 키버튼 리슨닝
        document.querySelectorAll('.key-btn').forEach((key) => {
            const keyValue = key.dataset.num;
            key.addEventListener("click", (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.OnClickQWERTY(keyValue);
            })
        });
        // window.addEventListener 로 하면 안된다.
        document.addEventListener("click", (e) => {
            if(!this.keyboard.classList.contains('hide')) {
                this.keyboard.classList.add('hide');
                if(!this.problem_solving.classList.contains("hide")) {
                    this.problem_solving.querySelector("remote-html-embed").shadowRoot.quertyEnd();
                }
            }
        })
    }

    Start() {
        // 시작 페이지를 보여준다.
        this.SetStep(this.Step.INTRO)
        //this.SetStep(this.Step.CONCEPT_LEARNING)
        //this.SetStep(this.Step.PROBLEM_SOLVING)
    }

    OnClickQWERTY(value) {
        if (this.keyboardRoot) {
            this.keyboardRoot.quertyClicked(value, this.keyboardTarget);
        }
    }

    SetStep(step) {
        if (this.step === step)
            return;
        switch (step) {
            case this.Step.INTRO:
                this.Intro.classList.remove("hide");
                this.Study.classList.add("hide");
                break;
            case this.Step.CONCEPT_LEARNING:
                this.Intro.classList.add("hide");
                this.Study.classList.remove("hide");
                this.concept_learning.classList.remove("hide");
                this.problem_solving.classList.add("hide");
                this.topArea_type.textContent = "개념 학습"
                this.topArea_type.style.color = "#004807"
                this.top_container.style.background = "#209E2C"
                this.bottom_nav.style.display = "flex";
                this.OnClickConceptLearningButton(0);
                break;
            case this.Step.PROBLEM_SOLVING:
                this.Intro.classList.add("hide");
                this.Study.classList.remove("hide");
                this.concept_learning.classList.add("hide");
                this.problem_solving.classList.remove("hide");
                this.topArea_type.textContent = "문제 풀이"
                this.topArea_type.style.color = "#003776"
                this.top_container.style.background = "#257ADB"
                this.bottom_nav.style.display = "none"
                // 초기화를 시켜준다.
                this.problem_solving.querySelector("remote-html-embed").shadowRoot.reset();
                break;
        }
    }

    /** 초기화 */
    Clear() {

    }

    OnClickConceptLearningButton(target_index) {
        this.pageIdx = target_index;
        this.concept_learning_buttons.forEach((element, index) => {
            if (target_index === index)
                element.classList.add('clicked');
            else
                element.classList.remove('clicked');
        });
        this.concept_learning.querySelectorAll("remote-html-embed").forEach((element, index) => {
            if (target_index === index) {
                element.classList.remove("hide");
                // 초기화를 실행해야 한다.
                element.shadowRoot.reset();
            } else {
                element.classList.add("hide");
            }
        })
    }

    checkPhone() {
        let agent = navigator.userAgent;
        //모바일 체크
        const isMobile = /iphone|ipod|android|blackberry|windows phone|opera mini|iemobile|mobile|samsungbrowser/i.test(agent);

        // iPad IOS 13버전 이후로는 웹 형식으로 나와서 별도 비교 로직 추가
        const isIpad = /iPad|Macintosh/.test(agent) && 'ontouchend' in document;
        return isMobile || isIpad;
    }
}

// 인스턴스를 생성하고 기본으로 내보냄
const instance = new MainEvent();

export default instance;