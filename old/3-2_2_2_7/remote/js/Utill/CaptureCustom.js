
/** 캡쳐 시작시 스타일 변경 */
export function ChangeCaptureStyle() {
    //공통
    DocBoxShadow.Change();
    changeProblemInput();
    changeConceptInput();
}

/** 캡쳐 종료시 스타일 복구 */
export function RollBackCaptureStyle() {
    //공통
    DocBoxShadow.RollBack();
    rollbackProblemInput();
    rollbackConceptInput();
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
let problemCanvas = null
const changeProblemInput = () => {
    const problemSolving = document.querySelector('#problem_solving');
    if(problemSolving.classList.contains("hide"))
        return
    const shadowRoot = problemSolving.querySelector('remote-html-embed').shadowRoot;
    Array.from(shadowRoot.querySelectorAll("input")).forEach((e) => {
        changeInput(e, "problem");
    })
    shadowRoot.querySelectorAll('remote-html-embed').forEach((subEmbed)=>{
        if(!subEmbed.classList.contains("hide")){
            const subShadowRoot = subEmbed.shadowRoot;
            Array.from(subShadowRoot.querySelectorAll("input")).forEach((input)=>{
                changeInput(input, "problem");
            });
            problemCanvas = subShadowRoot.querySelector("#st1_2_box2");
            if(problemCanvas)
                problemCanvas.style.position = "absolute"
        }
    })
}

const rollbackProblemInput = () => {
    ProblemInputElementStorage.forEach((element, index) => {
        element.el.style.display = element.display
    })

    ProblemTempDivElementStorage.forEach((element, index) => {
        element.remove()
    })

    ProblemInputElementStorage = []
    ProblemTempDivElementStorage = []
    if(problemCanvas){
        problemCanvas.style.position = "static"
        problemCanvas = null;
    }
}

let ConceptInputElementStorage = []
let ConceptTempDivElementStorage = []
let changeCanvas = null;
const changeInput = (e, type)=>{
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
    if(type==="concept") {
        ConceptInputElementStorage.push({el: e, display: computedStyle.display})
        e.style.display = "none"
        ConceptTempDivElementStorage.push(tempDiv)
    }else{
        ProblemInputElementStorage.push({el: e, display: computedStyle.display})
        e.style.display = "none"
        ProblemTempDivElementStorage.push(tempDiv)
    }
}
const changeConceptInput = () => {
    const conceptLearning = document.querySelector('#concept_learning');
    if(conceptLearning.classList.contains("hide"))
        return
    const embed = conceptLearning.querySelectorAll('remote-html-embed');
    for(let i = 0; i < embed.length; i++){
        const target = embed[i];
        if(target.classList.contains("hide"))
            continue;
        const shadowRoot = target.shadowRoot;
        Array.from(shadowRoot.querySelectorAll("input")).forEach((e) => {
            changeInput(e, "concept");
        })
        shadowRoot.querySelectorAll('remote-html-embed').forEach((subEmbed)=>{
            if(!subEmbed.classList.contains("hide")){
                const subShadowRoot = subEmbed.shadowRoot;
                Array.from(subShadowRoot.querySelectorAll("input")).forEach((input)=>{
                    changeInput(input, "concept");
                });
                changeCanvas = subShadowRoot.querySelector("#st1_2_box2");
                if(changeCanvas)
                    changeCanvas.style.position = "absolute"
            }
        })
    }
}

const rollbackConceptInput = () => {
    ConceptInputElementStorage.forEach((element, index) => {
        element.el.style.display = element.display
    })

    ConceptTempDivElementStorage.forEach((element, index) => {
        element.remove()
    })

    ConceptInputElementStorage = []
    ConceptTempDivElementStorage = []
    if(changeCanvas){
        changeCanvas.style.position = "static";
        changeCanvas = null;
    }
}



