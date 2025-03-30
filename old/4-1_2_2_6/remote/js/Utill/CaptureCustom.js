
/** 캡쳐 시작시 스타일 변경 */
export function ChangeCaptureStyle() {
    //공통
    DocBoxShadow.Change();
    changeProblemInput();
}

/** 캡쳐 종료시 스타일 복구 */
export function RollBackCaptureStyle() {
    //공통
    DocBoxShadow.RollBack();
    rollbackProblemInput();
}

//#region 공통 box-shadow
let DocBoxShadow = {}
let boxShadowStyleStorage = new Map();
DocBoxShadow.Change = () => {
    Array.from(document.querySelectorAll("*")).forEach((e) => {
        const computedStyle = window.getComputedStyle(e);
    
        const boxShadow = computedStyle.boxShadow;
        //boxShadow를 가진 요소
        if (boxShadow) {
            boxShadowStyleStorage.set(e, boxShadow);
            e.style.boxShadow = "none";
        }
    });
} 

DocBoxShadow.RollBack = () => {
    boxShadowStyleStorage.forEach((boxShadow, element) => {
        element.style.boxShadow = boxShadow;
    });

    boxShadowStyleStorage = new Map();
}

let ProblemInputElementStorage = []
let ProblemTempDivElementStorage = []
const changeProblemInput = () => {
    const problemSolving = document.querySelector('#problem_solving');
    if(problemSolving.classList.contains("hide"))
        return
    const shadowRoot = problemSolving.querySelector('remote-html-embed').shadowRoot;
    Array.from(shadowRoot.querySelectorAll("input")).forEach((e) => {
        const computedStyle = window.getComputedStyle(e);

        const tempDiv = document.createElement('div');

        for (let style of computedStyle) {
            tempDiv.style[style] = computedStyle.getPropertyValue(style);
        }
        tempDiv.textContent = e.value;
        tempDiv.style.display = "flex"
        tempDiv.style.justifyContent = "center"
        tempDiv.style.alignItems = "center"

        e.parentNode.insertBefore(tempDiv, e.nextSibling);

        ProblemInputElementStorage.push({el: e, display: computedStyle.display})
        e.style.display = "none"

        ProblemTempDivElementStorage.push(tempDiv)
    })
}

const rollbackProblemInput = () => {
    const problemSolving = document.querySelector('#problem_solving');
    if(problemSolving.classList.contains("hide"))
        return
    ProblemInputElementStorage.forEach((element, index) => {
        element.el.style.display = element.display
    })

    ProblemTempDivElementStorage.forEach((element, index) => {
        element.remove()
    })

    ProblemInputElementStorage = []
    ProblemTempDivElementStorage = []
}



