import anime from "./anime.js";
import {setFullButton, autoScale, checkIpad, setStartDim, setSingleSetting} from "./base.js";
//import qwerty from "./qwerty.js";
import numberPad from "./NumberPad.js";
import {
    createTabRule,
    focus,
    setAriaLabel,
    defineTab,
    setLibSelectedMode,
    setFocusToFullButton,
    getDisplay
} from "./tab.js";


const metaUrl = import.meta.url;
let root;
let scale = 1;  // 화면 스케일링 값

let lessonNo = '5-2_1_2_4';
const lessons = ['5-2_1_2_4', '5-2_1_2', '5-2_1_3', '5-2_1_4_1', '5-2_1_4_2', '5-2_1_4_3', '5-2_1_8']

let selectedMode = null;
let isBlinking = false;

let canvasAreaEventPositions = [];
let canvasHistory1 = [];
let canvasHistory2 = [];
let quizComplete = [false, false];

const getPostPosition = (number) => {
    let temp = String(number).replace('.', '');
    const module = Number(temp) % 10;
    const list = [1, 3, 6, 7, 8, 0];
    if (list.indexOf(module) >= 0)
        return '이';
    else
        return '가';

}

const getAltFocusElement = () => {
    // simple 에서도 alt 로 이동해 달란다.
    /*
    if (lessonNo === lessons[0])
        return root.querySelector('.alt_box');
    else {
        const btnFull = root.querySelector('.btn-fullscreen');
        if (getDisplay(btnFull) !== 'none') {
            return btnFull;
        }
        const btnRefresh = root.querySelector('.btn-refresh');
        const content = root.querySelector('.content');
        if (getDisplay(content) !== 'none') {
            return btnRefresh;
        }
        const btnBack = root.querySelector('.btn-back');
        const sectionIntro = root.querySelector('.section-intro');
        if (getDisplay(btnBack) !== 'none' && sectionIntro.classList.contains('hide')) {
            return btnBack;
        }
    }
     */
    return root.querySelector('.alt_box');
}
const clearAllModalAndArrow = () => {
    const popup = root.querySelector('.popup');
    if (popup.responseClick) {
        popup.responseClick = false;
        popup.classList.add('hide');
        getAltFocusElement().focus();
    }else{
        popup.classList.add('hide');
    }
    const content = root.querySelector('.content');
    content.querySelectorAll('.circle-select').forEach((circle) => {
        circle.classList.add('hide');
    })
    content.querySelectorAll('.arrow-box').forEach((box) => {
        box.classList.add('hide');
    })
    content.querySelectorAll('.arrow-left').forEach((arrow) => {
        arrow.classList.add('hide');
    })
    content.querySelectorAll('.arrow-right').forEach((arrow) => {
        arrow.classList.add('hide');
    })
    content.querySelectorAll('.arrow-center').forEach((arrow) => {
        arrow.classList.add('hide');
    })
    root.querySelectorAll('.select_list').forEach((list) => {
        list.parentElement.querySelector('.select_list_aria').classList.add('hide');
        list.classList.add('hide');
    })

}
const onClickRefresh = (event) => {
    const content = root.querySelector('.content');
    content.querySelectorAll('.input').forEach((input) => {
        input.classList.remove('gray');
    })
    content.querySelectorAll('.number-select-box').forEach((input) => {
        input.classList.remove('gray');
    })
    content.querySelectorAll('.circle-select').forEach((circle) => {
        circle.classList.remove('checked');
    })
    content.querySelectorAll('.arrow-left').forEach((arrow) => {
        arrow.classList.remove('checked');
    })
    content.querySelectorAll('.arrow-right').forEach((arrow) => {
        arrow.classList.remove('checked');
    });
    content.querySelectorAll('.shadow-div').forEach((arrow) => {
        arrow.classList.add('hide');
        arrow.classList.remove('checked');
    })
    root.querySelectorAll('.ruler-number').forEach((number) => {
        number.classList.remove('text-shadow');
    })

    if (lessonNo === lessons[0] || lessonNo === lessons[5]) {
        if(lessonNo === lessons[0])
            root.querySelector('.canvas-area-2 .btn-copy').click();
        content.classList.remove('double');
        content.querySelectorAll('.input').forEach((input) => {
            input.value = '';
            input.parentElement.querySelector('.pencil').classList.remove('hide');
        });

        content.querySelectorAll('.content .select_list_aria').forEach((list) => {
            setAriaLabel(list, '수의 범위를 선택해 주세요');
        })

        content.querySelectorAll('.answer').forEach((answer) => {
            answer.innerHTML = '';
        })
    }

    quizComplete = [false, false];
    clearAllModalAndArrow();
    setSettingRuler(1, null);
    setSettingRuler(2, null);
}

//
const getPageState = () => {
    return !root.querySelector('.section-intro').classList.contains('hide') ? 0
        : !root.querySelector('.setting').classList.contains('hide') ? 1
            : !root.querySelector('.quiz-1').classList.contains('hide') ? 2
                : 3;

}

const getCanvas = (number) => {
    return number === 1 ? root.querySelector('#canvas-area-1') : root.querySelector('#canvas-area-2');
}

const announceAlert = (text) => {
    const liveRegion = root.querySelector('#live-region');
    if (liveRegion.innerText === text)
        text = text + ".";
    const message = document.createTextNode(text);
    if (liveRegion.firstChild)
        liveRegion.removeChild(liveRegion.firstChild)
    liveRegion.appendChild(message);
    liveRegion.classList.remove('hide');
}

const sleep = (ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms));
}

const showPopup = async (contentType, options) => {
    await sleep(10);
    let content = '';
    let narration = '';
    switch (contentType) {
        case 1:
            content = `숫자만 입력 가능합니다.`
            narration = `숫자만 입력 가능합니다`
            break
        case 2:
            content = `한 눈금의 크기가&nbsp;<div class="batang">1</div>일 때&nbsp;<div class="batang">0~990</div>만 입력 가능해요.`
            narration = `한 눈금의 크기가 일일 때 영부터 구백구십까지만 입력 가능해요`
            break
        case 3:
            content = `한 눈금의 크기가&nbsp;<div class="batang">5</div>일 때&nbsp;<div class="batang">0~950</div>만 입력 가능해요.`
            narration = `한 눈금의 크기가 오일 때 영부터 구백오십까지만 입력 가능해요`
            break
        case 4:
            content = `한 눈금의 크기가&nbsp;<div class="batang">10</div>일 때&nbsp;<div class="batang">0~900</div>만 입력 가능해요.`
            narration = `한 눈금의 크기가 십일 때 영부터 구백까지만 입력 가능해요`
            break
        case 5:
            content = `한 눈금의 크기가&nbsp;<div class="batang">100</div>일 때&nbsp;<div class="batang">0</div>만 입력 가능해요.`
            narration = `한 눈금의 크기가 백일 때 영만 입력 가능해요`
            break
        case 6:
            content = `수직선의 눈금 중에서 원하는 수를 입력하세요.`
            narration = `수직선의 눈금 중에서 원하는 수를 입력하세요`
            break
        case 7:
            content = `수직선의 눈금을 클릭한 후, 수의 범위를 나타내어 보세요.`
            narration = `수직선의 눈금을 클릭한 후, 수의 범위를 나타내어 보세요`
            break
        case 8:
            content = `화살표를 클릭해서 수의 범위를 나타내어 보세요.`
            narration = `화살표를 클릭해서 수의 범위를 나타내어 보세요`
            break
        case 9:
            content = `오른쪽 수보다 작은 수를 입력하세요.`
            narration = `오른쪽 수보다 작은 수를 입력하세요`
            break
        case 10:
            content = `왼쪽 수보다 큰 수를 입력하세요.`
            narration = `왼쪽 수보다 큰 수를 입력하세요`
            break
        case 11:
            content = `수직선의 눈금을 클릭한 후, 수의 범위를 나타내어 보세요.`
            narration = `수직선의 눈금을 클릭한 후, 수의 범위를 나타내어 보세요`
            break
        case 12:
            content = `시작하는 수를 입력하세요.`
            narration = `시작하는 수를 입력하세요`
            break
        case 13:
            content = `수와 범위를 선택하세요.`
            narration = `수와 범위를 선택하세요`
            break
        case 14:
            content = `활동을 선택하여 수의 범위를 알아보세요.`
            narration = `활동을 선택하여 수의 범위를 알아보세요`
            break
        case 15:
            content = `수의 범위를 수직선에 나타내기 위해, 수직선에서 눈금을 클릭하세요.`
            narration = `수의 범위를 수직선에 나타내기 위해, 수직선에서 눈금을 클릭하세요`
            break
        case 16:
            content = `수직선의 눈금을 클릭해 보세요.`
            narration = `수직선의 눈금을 클릭해 보세요.`
            break
        case 17:
            content = `수의 범위를 설정해 보세요.`
            narration = `수의 범위를 설정해 보세요.`
            break
        default:
            break
    }
    const numberPad = root.querySelector('.modal_number_pad');
    announceAlert(narration);
    const isKeypadDisplayed = !numberPad.classList.contains('hide');
    if (isKeypadDisplayed) {
        setTimeout(() => {
            numberPad.classList.add('hide')
        }, 1)
    }
    const popup = root.querySelector('.popup');
    const popupContent = popup.querySelector('.popup-content');
    popupContent.innerHTML = content;
    popup.style.opacity = 0;
    popup.classList.remove('hide');
    if (options && options.pin) {
        popup.style.opacity = 1;
        popup.responseClick = true;
    }else if (contentType===17) {
        root.querySelector('.character').focus();
        anime({
            targets: popup,
            opacity: [0, 1],
            duration: 500,
            easing: "linear"
        });
    } else {
        //isBlinking = true;
        //root.querySelector('.modal-overlay').classList.remove('hide');
        root.querySelector('.character').focus();
        // 팝업이 있는 동안에도 클릭을 받을 수 있도록 바꿨음으로 삭제할 것을 바로 삭제한다.
        if(options && options.deleteInput){
            options.deleteInput.value = '';
            options.deleteInput.blur();
            options.deleteInput.parentElement.querySelector('.pencil').classList.remove('hide');
        }
        const animation = anime.timeline({
            loop: 1, complete: () => {
                //isBlinking = false;
                //root.querySelector('.modal-overlay').classList.add('hide');
                popup.classList.add('hide');
                try {
                    if (options) {
                        if (options.focus) {
                            options.focus.focus();
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
        let delayTime = contentType===1?3000
            : ([2, 3, 4, 5].includes(contentType))? 5500
            : ([9, 10, 12, 13, 16].includes(contentType))? 4000:5000;
        if(options && options.delayTime)
            delayTime = options.delayTime;
        animation.add({
                targets: popup,
                opacity: [0, 1],
                duration: 500,
                easing: "linear"
            }
        ).add({
                targets: popup,
                opacity: [1],
                duration: delayTime,
                easing: "linear"
            }
        ).add({
                targets: popup,
                opacity: [1, 1, 1, 1, 0],
                duration: 700,
                easing: "linear"
            }
        );
    }
}

const showIntro = () => {
    root.querySelectorAll('.section').forEach((section, index) => {
        if (index === 0) {
            section.classList.remove('hide');
            setFocusToFullButton();
        } else {
            section.classList.add('hide');
        }
    })
}

const showSetting = (event, mode) => {
    event?.preventDefault();
    selectedMode = mode;
    setLibSelectedMode(mode);
    onClickRefresh(null)
    resetSetting();
    const altText = mode === 1 ? '수직선 범위 내 숫자를 입력한 후 해당 숫자의 이상, 이하, 초과, 미만의 값을 알아보는 활동입니다'
        : '수직선 범위 내 숫자를 입력하여 해당 숫자들에 속하는 수의 범위를 알아보는 활동입니다';
    setAriaLabel('.content .alt_box', altText)
    const sectionMain = root.querySelector('.section-main');
    sectionMain.querySelector('.setting').classList.remove('hide');
    sectionMain.querySelector('.content').classList.add('hide');
    root.querySelector('.section-intro').classList.add('hide');
    sectionMain.classList.remove('hide');
    root.querySelector('.canvas-area-1 .btn-copy').style.visibility = "hidden";
    root.querySelector('.canvas-area-2').classList.add('hide');
    root.querySelector('.canvas-area-1').classList.remove('quiz');
    root.querySelector('.canvas-area-1').classList.remove('double');
    root.querySelectorAll('.quiz-row-2').forEach((row) => {
        row.classList.add('hide');
    })
    root.querySelector('.btn-back').setAttribute('aria-label', '진입 화면으로 되돌아갑니다');
    root.querySelector('.setting .input-div').setAttribute('aria-label', '영부터 구백 구십 구까지 입력할 수 있습니다');
    root.querySelector('.setting .number-select-box').setAttribute('aria-label', '한 눈금의 크기는 일입니다');
    root.querySelector('.btn-fullscreen').focus();
}

const onClickSettingComplete = (event) => {
    event?.preventDefault();
    // 필요 입력이 완료되었는지 확인한다.
    const settingInput = root.querySelector('.setting-area .input');
    const ruleNumbers = root.querySelectorAll('.canvas-area-1 .ruler-number');
    if (settingInput.value.length < 1
        || (settingInput.value !== ruleNumbers[0].innerHTML)) {
        showPopup(12, {focus: event?.currentTarget});
        return;
    }
    root.querySelector('.canvas-area-1 .btn-copy').style.visibility = 'visible';
    if (selectedMode === 1) {
        root.querySelector('.quiz-1').classList.remove('hide');
        root.querySelector('.quiz-2').classList.add('hide');
    } else {
        root.querySelector('.quiz-1').classList.add('hide');
        root.querySelector('.quiz-2').classList.remove('hide');
    }
    root.querySelectorAll('.quiz .answer').forEach((answer) => {
        answer.innerHTML = '';
    })
    root.querySelector('.canvas-area-1').classList.add('quiz');
    root.querySelector('.setting').classList.add('hide');
    onClickRefresh();
    root.querySelector('.content').classList.remove('hide');
    setAriaLabel('.btn-back', `수직선 설정 팝업으로 되돌아갑니다`)
    if (selectedMode === 1) {
        const startValue = ruleNumbers[0].innerHTML;
        const endValue = ruleNumbers[ruleNumbers.length - 1].innerHTML;
        root.querySelectorAll('.quiz-1 .input-div').forEach((div) => {
            setAriaLabel(div, `${startValue}부터 ${endValue}까지 입력할 수 있습니다`)
        })
        setAriaLabel('.content .alt_box', `수직선 범위 내 숫자를 입력한 후 해당 숫자의 이상, 이하, 초과, 미만의 값을 알아보는 활동입니다`)
    } else {
        const startValue = ruleNumbers[0].innerHTML;
        const endValue = ruleNumbers[ruleNumbers.length - 1].innerHTML;
        root.querySelectorAll('.quiz-2 .input-div').forEach((div) => {
            setAriaLabel(div, `${startValue}부터 ${endValue}까지 입력할 수 있습니다`)
        })
        setAriaLabel('.content .alt_box', `수직선 범위 내 숫자를 입력하여 해당 숫자들에 속하는 수의 범위를 알아보는 활동입니다`)
    }
    showPopup(17);
    setFocusToFullButton();
}

const setCanvasLabel = (canvasNumber, label) =>{
    const canvas = getCanvas(canvasNumber);
    canvas.innerHTML = label;
    setAriaLabel(canvas.parentElement.querySelector('.canvas-back'), label);
}

const setCanvasInitLabel = () => {
    if (lessonNo === lessons[1] || lessonNo === lessons[2] || lessonNo === lessons[3]) {
        root.querySelectorAll('.quiz-1 .input').forEach((input, index) => {
            const inputValue = input.value;
            const selectValue = root.querySelectorAll('.quiz-1 .answer')[index].innerHTML;
            const canvasLabel = `${inputValue} ${selectValue}인 수를 확인할 수 있는 열 칸짜리 수직선입니다`;
            setCanvasLabel(index + 1, canvasLabel);
        })
    } else if(lessonNo === lessons[4] ){
        root.querySelectorAll('.quiz-2 .quiz-row').forEach((row, index) => {
            // row 안에 input 이 두개...
            if(index === 0) {
                //const firstInputValue = row.querySelector('.input.first').value;
                //const firstSelectedValue = row.querySelector('.answer.first').innerHTML;
                const canvasLabel = `수직선의 눈금을 클릭하여 팔 이상 십일 미만에 속하는 수의 범위를 알아보는 활동입니다`;
                setCanvasLabel(index + 1, canvasLabel);
            }
        })
    }
    else {
        const canvasLabel = '눈금과 눈금 사이를 나누지 않은 열 칸짜리 수직선입니다';
        setCanvasLabel(1, canvasLabel);
        setCanvasLabel(2, canvasLabel);
    }
}

const initRuler = (number, resetTabIndex = true) => {
    const canvas = number === 1 ? root.querySelector('#canvas-area-1') : root.querySelector('#canvas-area-2')
    setCanvasInitLabel();
    if (resetTabIndex)
        canvas.myTabIndex = -2;
    if (!canvas.getContext) {
        console.log('canvas not supported');
        return;
    }
    const ctx = canvas.getContext("2d");
    // 먼저 모든 도형을 지운다.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fullWidth = canvas.width;
    const realWidth = fullWidth - 64;
    const fullHeight = canvas.height;

    ctx.strokeStyle = 'black'; // Line color
    ctx.lineWidth = 5; // Line width

    // Draw a line
    ctx.beginPath();
    ctx.moveTo(0, fullHeight / 2); // Start point (x, y)
    ctx.lineTo(fullWidth, fullHeight / 2); // End point (x, y)
    ctx.stroke(); // Render the line
    const startX = (fullWidth - realWidth) / 2;
    const distance = realWidth / 10;
    const eventPositions = [];
    for (let i = 0; i < 11; i++) {
        const x = startX + distance * i;
        eventPositions.push([x - 6, x + 6]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, fullHeight);
        ctx.stroke();
    }
    if (number === 1)
        canvasAreaEventPositions = eventPositions;
    canvasHistory1 = [];
    canvasHistory2 = [];
}

// unit 은 5 아니면 10
const addMilliBar = (number, unit) => {
    const canvas = getCanvas(number);
    if (!canvas.getContext) {
        console.log('canvas not supported');
        return;
    }
    // 싱글페이지는 여기까지 않옴으로 신경쓸 필요 없다.
    const text = `한 눈금의 크기가 ${unit === "5" ? "오" : "십"}인 열 칸짜리 수직선입니다`;
    setCanvasLabel(number, text);
    const ctx = canvas.getContext("2d");
    const fullWidth = canvas.width;
    const realWidth = fullWidth - 64;
    const fullHeight = canvas.height;

    ctx.strokeStyle = 'black'; // Line color
    ctx.lineWidth = 3; // Line width
    const startX = (fullWidth - realWidth) / 2;
    const distance = realWidth / (unit * 10);
    const eventPositions = [];
    const spare = unit === 10 ? 4 : 6;
    for (let i = 0; i < unit * 10 + 1; i++) {
        const x = startX + distance * i;
        eventPositions.push([x - spare, x + spare]);
        ctx.beginPath();
        ctx.moveTo(x, 12);
        ctx.lineTo(x, fullHeight - 12);
        ctx.stroke();
    }
    if (number === 1)
        canvasAreaEventPositions = eventPositions;
    canvasHistory1 = [];
    canvasHistory2 = [];
}


const responseCanvasClick = (number, x, input, inputFirst, inputSecond, returnFocusIndex = '') => {
    const canvas = getCanvas(number);
    const positions = canvasAreaEventPositions;
    let barPosition = 0;
    const arrayLength = positions.length;
    let targetIndex = -1;
    const modalCorrector = (lessonNo === lessons[0]) ? 168 : 73;
    const leftArrowCorrector = (lessonNo === lessons[0]) ? 79 : 79;
    const rightArrowCorrector = (lessonNo === lessons[0]) ? 162 : 162;
    const centerArrowCorrector = (lessonNo === lessons[0]) ? 122 : 122;
    const centerMiddleArrowCorrector = (lessonNo === lessons[0]) ? -36 : -36;
    if (selectedMode === 1) {
        let position = null;
        for (let i = 0; i < arrayLength; i++) {
            if (x >= positions[i][0] && x <= positions[i][1] && Number(input.value) === positions[i][2]) {
                position = positions[i];
                barPosition = (positions[i][0] + positions[i][1]) / 2;
                targetIndex = i;
            }
        }
        if (position) {
            const modal = number === 1 ? root.querySelector('.circle-select_1')
                : root.querySelector('.circle-select_2');
            const arrowLeft = number === 1 ? root.querySelector('.arrow-left-1')
                : root.querySelector('.arrow-left-2');
            const arrowRight = number === 1 ? root.querySelector('.arrow-right-1')
                : root.querySelector('.arrow-right-2');
            if(modal.classList.contains('checked')){
                drawArrowButtons(number);
                return;
            }
            const centerPosition = barPosition + modalCorrector;
            modal.style.left = `${centerPosition}px`;
            modal.classList.remove('hide');
            modal.dataset.returnRulerNumber = returnFocusIndex;
            const buttons = modal.querySelectorAll('div');
            setAriaLabel(buttons[0], `범위 내 ${position[2]}${getPostPosition(position[2])} 포함됩니다`)
            setAriaLabel(buttons[1], `범위 내 ${position[2]}${getPostPosition(position[2])} 포함되지 않습니다`)
            // shadow 를 던져주어야 한다.
            let shadowComplete = false;
            canvas.parentElement.parentElement.querySelectorAll('.ruler-number').forEach((number) => {
                if (number.innerHTML === input.value) {
                    number.classList.add('text-shadow');
                    shadowComplete = true;
                }
            })
            if (!shadowComplete) {
                const shadowDiv = number === 1 ? root.querySelector('.shadow-div-1')
                    : root.querySelector('.shadow-div-2');
                shadowDiv.innerHTML = input.value;
                shadowDiv.style.left = `${centerPosition}px`;
                shadowDiv.classList.remove('hide');
                shadowDiv.classList.add('checked');
            }
            // 위의 화살표도 옴겨준다.
            arrowLeft.style.left = `${centerPosition + leftArrowCorrector}px`;
            arrowLeft.classList.add('checked');
            arrowRight.style.left = `${centerPosition + rightArrowCorrector}px`;
            arrowRight.classList.add('checked');
            modal.querySelector('div').focus();
        } else {
            getAltFocusElement().focus();
        }
    } else {
        let positionFirst = null;
        let positionSecond = null;
        for (let i = 0; i < arrayLength; i++) {
            if (x >= positions[i][0] && x <= positions[i][1] && Number(inputFirst.value) === positions[i][2]) {
                positionFirst = positions[i];
                barPosition = (positions[i][0] + positions[i][1]) / 2;
                targetIndex = i;
            }
            if (x >= positions[i][0] && x <= positions[i][1] && Number(inputSecond.value) === positions[i][2]) {
                positionSecond = positions[i];
                barPosition = (positions[i][0] + positions[i][1]) / 2;
                targetIndex = i;
            }
        }
        if (positionFirst || positionSecond) {
            const position = positionFirst ? positionFirst : positionSecond;
            // 보여줄 모달 선택
            let modal = number === 1 ? root.querySelector('.circle-select_1')
                : root.querySelector('.circle-select_2');
            if (positionSecond) {
                modal = number === 1 ? root.querySelector('.circle-select_3')
                    : root.querySelector('.circle-select_4');
            }
            let arrowLeft = number === 1 ? root.querySelector('.arrow-left-1')
                : root.querySelector('.arrow-left-2');
            let arrowRight = number === 1 ? root.querySelector('.arrow-right-1')
                : root.querySelector('.arrow-right-2');
            if(modal.classList.contains('checked')){
                drawArrowButtons(number, !!positionFirst, null);
                return;
            }
            // 모달 폭 반만큼 왼쪽으로 이동
            const centerPosition = barPosition + modalCorrector;
            modal.style.left = `${centerPosition}px`;
            modal.classList.remove('hide');
            modal.dataset.returnRulerNumber = returnFocusIndex;
            const buttons = modal.querySelectorAll('div');
            setAriaLabel(buttons[0], `범위 내 ${position[2]}${getPostPosition(position[2])} 포함됩니다`)
            setAriaLabel(buttons[1], `범위 내 ${position[2]}${getPostPosition(position[2])} 포함되지 않습니다`)
            // 하일라이트
            let shadowComplete = false;
            let inputValue = positionFirst ? inputFirst.value : inputSecond.value;
            canvas.parentElement.parentElement.querySelectorAll('.ruler-number').forEach((number) => {
                if (number.innerHTML === inputValue) {
                    number.classList.add('text-shadow');
                    shadowComplete = true;
                }
            })
            if (!shadowComplete) {
                let shadowDiv = null;
                if (number === 1) {
                    if (positionFirst)
                        shadowDiv = root.querySelector('.shadow-div-1');
                    else
                        shadowDiv = root.querySelector('.shadow-div-3');
                } else {
                    if (positionFirst)
                        shadowDiv = root.querySelector('.shadow-div-2');
                    else
                        shadowDiv = root.querySelector('.shadow-div-4');
                }
                shadowDiv.innerHTML = inputValue;
                shadowDiv.style.left = `${centerPosition}px`;
                // 그림을 모두 그렸을 때 보여준단다.
                shadowDiv.classList.remove('hide');
                shadowDiv.classList.add('checked');
            }
            // 위의 화살표도 옴겨준다.
            if (positionFirst) {
                arrowLeft.classList.add('checked');
                arrowLeft.style.left = `${centerPosition + centerArrowCorrector}px`;
            } else {
                arrowRight.classList.add('checked');
                arrowRight.style.left = `${centerPosition + centerArrowCorrector}px`;
            }
            // 가운데 버튼도 세팅한다.
            if (arrowLeft.classList.contains('checked') && arrowRight.classList.contains('checked')) {
                const middle = (Number(arrowLeft.style.left.replace('px', ''))
                    + Number(arrowRight.style.left.replace('px', ''))) / 2;
                const arrowCenter = number === 1 ? root.querySelector('.arrow-center-1')
                    : root.querySelector('.arrow-center-2');
                arrowCenter.style.left = `${middle + centerMiddleArrowCorrector}px`;
            }
            // 마지막으로 모달의 빨간 동그라미에 포커스를 준다.
            modal.querySelector('div').focus();
        } else {
            getAltFocusElement().focus();
        }
    }
}

const checkQuizInputComplete = (number) => {
    const answerArray = [];
    if (selectedMode === 1) {
        const input = number === 1 ? root.querySelector('.quiz-1 .quiz-row-1 .input')
            : root.querySelector('.quiz-1 .quiz-row-2 .input');
        const answer = number === 1 ? root.querySelector('.quiz-1 .quiz-row-1 .answer')
            : root.querySelector('.quiz-1 .quiz-row-2 .answer');
        if (input.value.length < 1 || !answer.innerHTML) {
            return false;
        } else {
            answerArray.push(input);
            answerArray.push(answer);
            answerArray.push(null);
            answerArray.push(null);
            answerArray.push(null);
            answerArray.push(null);
        }

    } else {
        const inputFirst = number === 1 ? root.querySelector('.quiz-2 .quiz-row-1 .input.first')
            : root.querySelector('.quiz-2 .quiz-row-2 .input.first');
        const inputSecond = number === 1 ? root.querySelector('.quiz-2 .quiz-row-1 .input.second')
            : root.querySelector('.quiz-2 .quiz-row-2 .input.second');
        const answerFirst = number === 1 ? root.querySelector('.quiz-2 .quiz-row-1 .answer.first')
            : root.querySelector('.quiz-2 .quiz-row-2 .answer.first');
        const answerSecond = number === 1 ? root.querySelector('.quiz-2 .quiz-row-1 .answer.second')
            : root.querySelector('.quiz-2 .quiz-row-2 .answer.second');
        if (inputFirst.value.length < 1 || inputSecond.value.length < 1 || !answerFirst.innerHTML || !answerSecond.innerHTML) {
            return false;
        } else {
            answerArray.push(null);
            answerArray.push(null);
            answerArray.push(inputFirst);
            answerArray.push(answerFirst);
            answerArray.push(inputSecond);
            answerArray.push(answerSecond);
        }
    }
    return answerArray;
}

const onClickCanvasArea = (event, number) => {
    if (getPageState() === 1)
        return;
    if (quizComplete[number - 1])
        return;
    clearAllModalAndArrow();
    const checkResult = checkQuizInputComplete(number);
    if (!checkResult)
        return;
    const input = checkResult[0];
    const inputFirst = checkResult[2];
    const inputSecond = checkResult[4];
    const canvas = getCanvas(number);
    const rect = canvas.getBoundingClientRect();
    const convertedScale = scale / 100;
    const x = (event.clientX - rect.left) / convertedScale;
    responseCanvasClick(number, x, input, inputFirst, inputSecond);
}
const onEnterCanvasArea = (number, x, rulerIndex = null) => {
    if (getPageState() === 1)
        return;
    const checkResult = checkQuizInputComplete(number);
    if (!checkResult)
        return;
    const input = checkResult[0];
    const inputFirst = checkResult[2];
    const inputSecond = checkResult[4];
    responseCanvasClick(number, x, input, inputFirst, inputSecond, rulerIndex);
}

const setSettingRuler = (target, focus, setTabIndex = true) => {
    initRuler(target, setTabIndex);
    const toggle = root.querySelector('.milli-toggle');
    const selectedNumber = Number(root.querySelector('.setting-area .answer').innerHTML);
    const isMillBarActive = toggle.classList.contains('active');
    const milliCount = selectedNumber === 5 ? 5 : 10;
    if (isMillBarActive) {
        addMilliBar(target, milliCount);
    }
    // input 에 값을 입력하였다면 시작값을 보여준다. input 값은 입력시 바로 체크함으로 여기서 체크할 필요가 없다.
    const input = root.querySelector('.setting-area .input');
    const startValue = Number(input.value);
    const targetArray = canvasAreaEventPositions;
    const factor = 1000000;
    const distance = !isMillBarActive ? selectedNumber : Math.round((selectedNumber * factor) / milliCount)/factor;
    if (input.value.length > 0) {
        let dotPlace = 0;
        root.querySelectorAll(`.canvas-area-${target} .ruler-number`).forEach((number_box, index) => {
            const value = (Math.round(startValue * factor) + Math.round((selectedNumber * factor) * index)) / factor;
            let sValue = String(value);
            const lastIndex = sValue.lastIndexOf('.');
            if(lastIndex > 0){
                const tempDotPlace = sValue.length - lastIndex - 1;
                if(tempDotPlace > dotPlace)
                    dotPlace = tempDotPlace;
            }
        })
        root.querySelectorAll(`.canvas-area-${target} .ruler-number`).forEach((number_box, index) => {
            const value = (Math.round(startValue * factor) + Math.round((selectedNumber * factor) * index)) / factor;
            let sValue = String(value);
            if(dotPlace > 0) {
                sValue = value.toFixed(dotPlace);
            }
            number_box.innerHTML = sValue;
        })
        targetArray.forEach((target, targetIndex) => {
            // 빅인티져 계산이 필요하다. 이건 꼼수
            target[2] = (Math.round(startValue * factor) + Math.round((distance * factor) * targetIndex)) / factor;
        })
    } else {
        root.querySelectorAll(`.canvas-area-${target} .ruler-number`).forEach((number_box, index) => {
            number_box.innerHTML = '';
        })
        targetArray.forEach((target, targetIndex) => {
            target[2] = 'aaa';
        })
    }
    if (focus)
        focus.focus();
}

const onClickSettingAreaSelectList = (event, select) => {
    select.parentElement.parentElement.querySelector('.answer').innerHTML
        = select.innerHTML;
    select.parentElement.parentElement.querySelector('.select_list_aria').classList.add('hide');
    select.parentElement.classList.add('hide');
    const selectedNumber = Number(select.innerHTML);
    const max = selectedNumber === 1 ? 990
        : selectedNumber === 5 ? 950
            : selectedNumber === 10 ? 900 : 0;
    const input = root.querySelector('.setting-area .input');
    if (input.value.length > 0 && Number(input.value) > max) {
        input.value = '';
        input.parentElement.querySelector('.pencil').classList.remove('hide');
    }
    if (selectedNumber === 100) {
        input.value = '0';
        input.parentElement.querySelector('.pencil').classList.add('hide');
        root.querySelector('.setting .input-div').setAttribute('aria-label', '0');
    }
    if (input.value === '') {
        root.querySelector('.setting .input-div').setAttribute('aria-label', '영부터 구백 구십 구까지 입력할 수 있습니다');
    }
    setAriaLabel('.setting .number-select-box', `한 눈금의 크기는 ${selectedNumber}입니다`);

    setSettingRuler(1, root.querySelector('.canvas-back-1'));
}

// 여기서 select 는 이상, 이하 가 들어있는 div 이다.
const onClickQuizSelectList = (event, select) => {
    select.parentElement.parentElement.classList.add('gray');
    select.parentElement.parentElement.querySelector('.answer').innerHTML
        = select.innerHTML;
    select.parentElement.parentElement.querySelector('.select_list_aria').classList.add('hide');
    select.parentElement.classList.add('hide');
    const row = select.parentElement.parentElement.parentElement;
    const input = row.querySelector('.input');

    if (selectedMode === 1) {
        const focusTarget = row.querySelector('.quiz-row-txt');
        focusTarget.focus();
        showQuizGuideModal(input, focusTarget);
    } else {
        if (select.parentElement.parentElement.classList.contains('first')) {
            const focusTarget = row.querySelector('.input-div.second');
            focusTarget.focus();
            showQuizGuideModal(input, focusTarget);
        } else {
            // 캠바스로 이동해야 한다.
            let focusTarget = row.classList.contains('quiz-row-1')
                ? getCanvas(1).parentElement.querySelector('.canvas-back')
                : getCanvas(2).parentElement.querySelector('.canvas-back');
            focusTarget.focus();
            showQuizGuideModal(input, focusTarget);
        }
    }
}

const onClickMilliToggle = (event) => {
    const input = root.querySelector('.setting .input');
    // 한 페이지 짜리는 event 가 안 온다.
    if(event) {
        if (input.value.length < 1) {
            showPopup(12, {focus: event.currentTarget});
            return;
        }
        if (event.currentTarget.classList.contains('active')) {
            setAriaLabel(event.currentTarget, '현재 꺼져있는 상태입니다');
            event.currentTarget.classList.remove('active');
        } else {
            setAriaLabel(event.currentTarget, '현재 켜져있는 상태입니다');
            event.currentTarget.classList.add('active');
        }
    }else{
        // 한 페이지 짜리
        root.querySelector('.milli-toggle').classList.add('active');
    }
    setSettingRuler(1, null);
}

const checkSettingAreaInput = () => {
    const input = root.querySelector('.setting-area .input');
    const number = Number(input.value);
    root.querySelector('.setting .input-div').setAttribute('aria-label', '영부터 구백 구십 구까지 입력할 수 있습니다');
    const focusTarget = root.querySelector('.setting-area-back')
    // 정수가 아니어도 상관없다.
    if (isNaN(number)) {
        showPopup(1, {deleteInput: input, focus: focusTarget});
        root.querySelectorAll('.setting-area .ruler-number').forEach((box) => {
            box.innerHTML = '';
        })
        return;
    }
    const unit = Number(root.querySelector('.setting-area .answer').innerText);
    const max = unit === 1 ? 990
        : unit === 5 ? 950
            : unit === 10 ? 900 : 0;

    if (number > max) {
        if (unit === 1)
            showPopup(2, {deleteInput: input, focus: focusTarget});
        else if (unit === 5)
            showPopup(3, {deleteInput: input, focus: focusTarget});
        else if (unit === 10)
            showPopup(4, {deleteInput: input, focus: focusTarget});
        else if (unit === 100)
            showPopup(5, {deleteInput: input, focus: focusTarget});
        root.querySelectorAll('.setting-area .ruler-number').forEach((box) => {
            box.innerHTML = '';
        })
        return;
    }
    // 여기까지 왔다면 성공한 것이다.
    root.querySelector('.setting .input-div').setAttribute('aria-label', input.value);
}

const checkInput = (input) => {
    const number = Number(input.value);
    if (isNaN(number)) {
        showPopup(1, {deleteInput: input, focus: getAltFocusElement()});
    }
}

const checkQuizInput = (input, inputNumber) => {
    let correctInput = false;
    const selectedValue = Number(input.value);
    canvasAreaEventPositions.forEach((position) => {
        if (position[2] === selectedValue)
            correctInput = true;
    })
    if (!correctInput) {
        showPopup(6, {deleteInput: input, focus: getAltFocusElement()});
        return;
    }
    if (selectedMode === 1) {
        const focusTarget = input.parentElement.parentElement.querySelector('.number-select-box');
        focusTarget.focus();
        showQuizGuideModal(input, focusTarget);
        input.classList.add('gray');
    } else {
        // inputNumber 는 3, 4, 5, 6 네개중에 하나다.
        // 좌우값을 비교해 봐야 한다.
        const isFirst = input.classList.contains('first');
        const restInput = isFirst ? input.parentElement.parentElement.querySelector('.input.second')
            : input.parentElement.parentElement.querySelector('.input.first');
        const firstInput = isFirst ? input : restInput;
        const secondInput = isFirst ? restInput : input;
        if (restInput.value.length > 0) {
            if (Number(firstInput.value) >= Number(secondInput.value)) {
                if (isFirst)
                    showPopup(9, {deleteInput: input, focus: getAltFocusElement()});
                else
                    showPopup(10, {deleteInput: input, focus: getAltFocusElement()});
            } else {
                //const ancestor = input.parentElement.parentElement;
                //const tag = input.classList.contains('first') ? '.first' : '.second';
                //const answer = ancestor.querySelector(`.answer${tag}`);
                const focusTarget = isFirst ? input.parentElement.parentElement.querySelector('.number-select-box.first')
                    : input.parentElement.parentElement.querySelector('.number-select-box.second');
                focusTarget.focus();
                showQuizGuideModal(input, focusTarget);
                input.classList.add('gray');
            }
        } else {
            const focusTarget = isFirst ? input.parentElement.parentElement.querySelector('.number-select-box.first')
                : input.parentElement.parentElement.querySelector('.number-select-box.second');
            focusTarget.focus();
            showQuizGuideModal(input, focusTarget);
            input.classList.add('gray');
        }
    }
}

const showQuizGuideModal = (input, focus) => {
    if (selectedMode === 1) {
        const ancestor = input.parentElement.parentElement;
        const select = ancestor.querySelector('.answer');
        if (select.innerHTML.length > 0 && input.value.length > 0) {
            // 수직선의 눈금을 클릭하라는 모달을 띄운다.
            showPopup(7, {focus: focus})
        }
    } else {
        // 이건 input 2개 select 2개를 확인해야 한다.
        let complete = true;
        const parent = input.parentElement.parentElement;
        const canvasNumber = parent.classList.contains('quiz-row-1')?1:2;
        const inputs = [];
        const selects = [];
        parent.querySelectorAll('.input').forEach((input) => {
            if (input.value.length < 1)
                complete = false;
            else
                inputs.push(input.value);
        })
        parent.querySelectorAll('.answer').forEach((answer) => {
            if (answer.innerHTML.length < 1)
                complete = false;
            else
                selects.push(answer.innerHTML);
        })
        if (complete) {
            if(lessonNo === lessons[5]){
                const text = `${inputs[0]} ${selects[0]} ${inputs[1]} ${selects[1]}인 수를 확인할 수 있는 열 칸짜리 수직선입니다`;
                setCanvasLabel(canvasNumber, text);
            }
            showPopup(11, {focus: focus});
        }
    }
}


const resetSetting = (event) => {
    event?.preventDefault();
    const input = root.querySelector('.setting-area .input');
    input.value = '';
    input.parentElement.querySelector('.pencil').classList.remove('hide');
    root.querySelector('.setting-area .answer').innerHTML = "1";
    const toggle = root.querySelector('.setting-area .milli-toggle');
    toggle.classList.remove('active');
    setAriaLabel(toggle, '현재 꺼져있는 상태입니다')
    root.querySelectorAll('.canvas-area-1 .ruler-number').forEach((box) => {
        box.innerHTML = '';
    })
    initRuler(1);
    initRuler(2);
}

const drawDot = (number, type, xPosition) => {
    const canvas = getCanvas(number);
    if (!canvas.getContext) {
        console.log('canvas not supported');
        return;
    }
    const ctx = canvas.getContext("2d");
    // Draw a red circle
    if (type === 1) {
        ctx.beginPath();
        ctx.arc(xPosition, 25, 8, 0, Math.PI * 2); // (x, y, radius, startAngle, endAngle)
        ctx.fillStyle = "#F2372B";
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(xPosition, 25, 8, 0, Math.PI * 2); // (x, y, radius, startAngle, endAngle)
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#F2372B';
        ctx.stroke();
    }
}

const drawArrowButtons = (canvasNum, isLeftModal = true, eventCurrentTarget = null) =>{
    if (selectedMode === 1){
        const arrowBox = root.querySelector(`.arrow-box-${canvasNum}`);
        setAriaLabel(arrowBox, '화살표의 좌측 버튼을 누르면 수직선이 왼쪽으로, 화살표의 우측 버튼을 누르면 수직선이 오른쪽으로 늘어납니다')
        const leftArrow = root.querySelector(`.arrow-left-${canvasNum}`);
        leftArrow.classList.remove('hide');
        root.querySelector(`.arrow-right-${canvasNum}`).classList.remove('hide');
        arrowBox.style.left = leftArrow.style.left;
        arrowBox.style.width = '145px';
        arrowBox.classList.remove('hide');
        showPopup(8, {focus: arrowBox})
    }else{
        // 2개다 선택했는지 어떻게 알 수 있을까????
        const row = root.querySelector(`.quiz-2 .quiz-row-${canvasNum}`);
        const firstModal = root.querySelector(`.circle-select_${canvasNum}`);
        const secondModal = root.querySelector(`.circle-select_${canvasNum + 2}`);
        if (firstModal.classList.contains('checked') && secondModal.classList.contains('checked')) {
            const arrowBox = root.querySelector(`.arrow-box-${canvasNum}`);
            // 입력한 값과 범위를 알아야 한다.
            const firstInput = row.querySelector('.input.first').value;
            const firstSelect = row.querySelector('.answer.first').innerHTML;
            const secondInput = row.querySelector('.input.second').value;
            const secondSelect = row.querySelector('.answer.second').innerHTML;
            const label = `주어진 버튼 세 개 중 ${firstInput} ${firstSelect} ${secondInput} ${secondSelect}인 수의 범위를 나타내는 버튼을 선택해 봅시다`;
            setAriaLabel(arrowBox, label);
            const arrowLeft = root.querySelector(`.arrow-left-${canvasNum}`);
            arrowLeft.classList.remove('hide');
            const arrowLight = root.querySelector(`.arrow-right-${canvasNum}`);
            arrowLight.classList.remove('hide');
            arrowBox.style.left = arrowLeft.style.left;
            const width = Number(arrowLight.style.left.replace('px', '')) - Number(arrowLeft.style.left.replace('px', '')) + 60;
            arrowBox.style.width = width + 'px';
            arrowBox.classList.remove('hide');
            root.querySelector(`.arrow-center-${canvasNum}`).classList.remove('hide');
            if(eventCurrentTarget)
                eventCurrentTarget.parentElement.dataset.returnRulerNumber = '';
            showPopup(8, {focus: arrowBox})
        } else {
            // 선택을 다 안했으면 포커스 줄곳을 찾아 포커스를 준다.
            const rulerNumberIndex = eventCurrentTarget?eventCurrentTarget.parentElement.dataset.returnRulerNumber:'';
            if (rulerNumberIndex) {
                root.querySelectorAll('.ruler-number')[Number(rulerNumberIndex)].focus();
            } else {
                // 선택을 다 안했으면 캠바스에 포커스를 준다.
                getCanvas(canvasNum).parentElement.querySelector('.canvas-back').focus();
            }
        }
    }
}
const onClickModal = (event, type, canvasNum, isLeftModal = true) => {
    if (selectedMode === 1) {
        const row = root.querySelector(`.quiz-1 .quiz-row-${canvasNum}`);
        const inputValue = Number(row.querySelector('.input').value);
        const selectValue = row.querySelector('.answer').innerHTML;
        // event.currentTarget.parent 는 circle-select
        event.currentTarget.parentElement.dataset.returnRulerNumber = '';
        if (((selectValue === '이하' || selectValue === '이상') && type === 1) || ((selectValue === '초과' || selectValue === '미만') && type === 2)) {
            // 일단 통과했으면 그림을 그려주어야 한다.
            let xPosition = 0;
            canvasAreaEventPositions.forEach((position) => {
                if (position[2] === inputValue)
                    xPosition = (position[0] + position[1]) / 2;
            })
            drawDot(canvasNum, type, xPosition);
            drawArrowButtons(canvasNum);
            root.querySelector(`.circle-select_${canvasNum}`).classList.add('hide');
            root.querySelector(`.circle-select_${canvasNum}`).classList.add('checked');
            const canvas = getCanvas(canvasNum);
            canvas.parentElement.parentElement.querySelectorAll('.ruler-number').forEach((number) => {
                if (Number(number.innerHTML) === inputValue) {
                    number.classList.add('text-shadow');
                }
            })
            /*
            const shadow = root.querySelector(`.shadow-div-${canvasNum}`);
            if (shadow.classList.contains('checked')) {
                shadow.classList.remove('hide');
            }
             */
        } else {
            blinkButton(event.currentTarget)
            if(lessonNo !== lessons[0]){
                // single 일때는 모달을 지우고 alt 로 이동
                setTimeout(()=>{
                    root.querySelector(`.circle-select_${canvasNum}`).classList.add('hide');
                    getAltFocusElement().focus();
                }, 1200)
            }
        }
    } else {
        const row = root.querySelector(`.quiz-2 .quiz-row-${canvasNum}`);
        const postFix = isLeftModal ? '.first' : '.second';
        const inputValue = Number(row.querySelector(`.input${postFix}`).value);
        const selectValue = row.querySelector(`.answer${postFix}`).innerHTML;
        if (((selectValue === '이하' || selectValue === '이상') && type === 1) || ((selectValue === '초과' || selectValue === '미만') && type === 2)) {
            // 일단 통과했으면 그림을 그려주어야 한다.
            let xPosition = 0;
            let positionIndex = -1;
            canvasAreaEventPositions.forEach((position, index) => {
                if (position[2] === inputValue) {
                    xPosition = (position[0] + position[1]) / 2;
                    positionIndex = index;
                }
            })
            drawDot(canvasNum, type, xPosition);
            const targetModalNumber = isLeftModal ? canvasNum : canvasNum + 2;
            root.querySelector(`.circle-select_${targetModalNumber}`).classList.add('hide');
            root.querySelector(`.circle-select_${targetModalNumber}`).classList.add('checked');
            // 기록을 남긴다.
            const color = (selectValue === '이하' || selectValue === '이상') ? 1 : 2;
            const history = [...canvasAreaEventPositions[positionIndex]];
            history[3] = color;
            if (canvasNum === 1) {
                canvasHistory1.push(history);
            } else {
                canvasHistory2.push(history);
            }
            const canvas = getCanvas(canvasNum);
            canvas.parentElement.parentElement.querySelectorAll('.ruler-number').forEach((number) => {
                if (Number(number.innerHTML) === inputValue) {
                    number.classList.add('text-shadow');
                }
            })
            drawArrowButtons(canvasNum, isLeftModal, event.currentTarget);
            /*
            const shadow = isLeftModal ?
                root.querySelector(`.shadow-div-${canvasNum}`)
                :root.querySelector(`.shadow-div-${canvasNum + 2}`);
            if (shadow.classList.contains('checked')) {
                shadow.classList.remove('hide');
            }
             */
        } else {
            blinkButton(event.currentTarget)
            if(lessonNo !== lessons[0]){
                // single 일때는 모달을 지우고 alt 로 이동
                setTimeout(()=>{
                    root.querySelector(`.circle-select_${canvasNum}`).classList.add('hide');
                    getAltFocusElement().focus();
                }, 1200)
            }
        }
    }
}

const drawAnswerLine = (number, type, xPosition, redraw) => {
    const canvas = getCanvas(number);
    if (!canvas.getContext) {
        console.log('canvas not supported');
        return;
    }
    const ctx = canvas.getContext("2d");
    const fullWidth = canvas.width;
    const fullHeight = canvas.height;

    ctx.strokeStyle = '#F2372B'; // Line color
    ctx.lineWidth = 7; // Line width
    // 미만의 경우 줄이 위로 올라옴으로 추가 작업이 필요하다.
    if (redraw) {
        ctx.beginPath();
        ctx.moveTo(xPosition, fullHeight / 2);
        const tempX = type === 1 ? xPosition -9: xPosition + 9;
        ctx.lineTo(tempX, fullHeight / 2);
        ctx.stroke();
        // 원의 반지름을 8px;
        drawDot(number, 2, xPosition);
        xPosition = type === 1 ? xPosition -8: xPosition + 8;
    }
    ctx.lineWidth = 7;
    const destination = type === 1 ? 0: fullWidth;
    const speed = type === 1 ? -7: 7;
    let tempPositionX = xPosition;
    const animate = () =>{
        ctx.beginPath();
        ctx.moveTo(xPosition, fullHeight / 2);
        tempPositionX = tempPositionX + speed;
        ctx.lineTo(tempPositionX, fullHeight / 2);
        ctx.stroke();
        if(type === 1 && tempPositionX > destination){
            requestAnimationFrame(animate);
        }else if(type === 2 && tempPositionX < destination){
            requestAnimationFrame(animate);
        }
    }
    animate();
}

const blinkButton = (button) => {
    anime({
        targets: button,
        opacity: [
            {value: 0.3, duration: 300},
            {value: 1, duration: 300}
        ],
        loop: 2,
        easing: 'easeInOutQuad'
    });
}

// type은 왼쪽에 있는 버튼일 경우 1, 오른쪽인 경우 2
const onClickArrow = (event, type, modalNum) => {
    if (selectedMode === 1) {
        const row = root.querySelector(`.quiz-1 .quiz-row-${modalNum}`);
        const inputValue = Number(row.querySelector('.input').value);
        const selectValue = row.querySelector('.answer').innerHTML;
        if ((type === 1 && (selectValue === "이하" || selectValue === "미만")) || (type === 2 && (selectValue === "이상" || selectValue === "초과"))) {
            // 그려준다.
            let xPosition = 0;
            const redraw = (selectValue === "초과" || selectValue === "미만");
            canvasAreaEventPositions.forEach((position) => {
                if (position[2] === inputValue)
                    xPosition = (position[0] + position[1]) / 2;
            })
            drawAnswerLine(modalNum, type, xPosition, redraw);
            // 버튼을 없애 주어야 한다.
            root.querySelector(`.arrow-left-${modalNum}`).classList.add('hide');
            root.querySelector(`.arrow-right-${modalNum}`).classList.add('hide');
            root.querySelector(`.arrow-box-${modalNum}`).classList.add('hide');
            const canvas = getCanvas(modalNum);
            if (modalNum === 1 && canvas.parentElement.querySelector('.btn-copy').style.visibility === 'hidden') {
                // 이건 항상 1번째 문제다.
                root.querySelector('.quiz-1 .quiz-row-2 .input-div').focus();
            } else {
                getAltFocusElement().focus();
            }
            // 첫번째 문제
            quizComplete[modalNum - 1] = true;
            const text = `${inputValue} ${selectValue}인 수에 대한 범위를 나타내고 있습니다`;
            setCanvasLabel(modalNum, text);
            /*
            const shadow = root.querySelector(`.shadow-div-${modalNum}`);
            if (shadow.classList.contains('checked')) {
                shadow.classList.remove('hide');
            }
             */
        } else {
            blinkButton(event.currentTarget);
            if(lessonNo !== lessons[0]){
                // single 일때는 모달을 지우고 alt 로 이동
                setTimeout(()=>{
                    root.querySelector(`.arrow-left-${modalNum}`).classList.add('hide');
                    root.querySelector(`.arrow-right-${modalNum}`).classList.add('hide');
                    root.querySelector(`.arrow-box-${modalNum}`).classList.add('hide');
                    getAltFocusElement().focus();
                }, 1200)
            }
        }
    } else {
        // 그냥 깜박여 주면 된다.
        blinkButton(event.currentTarget)
        if(lessonNo !== lessons[0]){
            // single 일때는 모달을 지우고 alt 로 이동
            setTimeout(()=>{
                root.querySelector(`.arrow-left-${modalNum}`).classList.add('hide');
                root.querySelector(`.arrow-right-${modalNum}`).classList.add('hide');
                root.querySelector(`.arrow-center-${modalNum}`).classList.add('hide');
                root.querySelector(`.arrow-box-${modalNum}`).classList.add('hide');
                getAltFocusElement().focus();
            }, 1200)
        }
    }
}
const onClickArrow1 = (event, type) => {
    onClickArrow(event, type, 1);
}
const onClickArrow2 = (event, type) => {
    onClickArrow(event, type, 2);
}

const onClickArrowCenter = (event, canvasNumber) => {
    const row = root.querySelector(`.quiz-2 .quiz-row-${canvasNumber}`);
    const firstInputValue = Number(row.querySelector('.input.first').value);
    const secondInputValue = Number(row.querySelector('.input.second').value);
    const firstSelectValue = row.querySelector('.answer.first').innerHTML;
    const secondSelectValue = row.querySelector('.answer.second').innerHTML;
    let startPosition = 0;
    let endPosition = 0;
    // 어차피 똑같은 거니까... 맞는 배열을 찾을 필요가 없다.
    canvasAreaEventPositions.forEach((position) => {
        if (position[2] === firstInputValue)
            startPosition = (position[0] + position[1]) / 2;
        if (position[2] === secondInputValue)
            endPosition = (position[0] + position[1]) / 2;
    })
    const canvas = getCanvas(canvasNumber);
    if (!canvas.getContext) {
        console.log('canvas not supported');
        return;
    }
    const centerPosition = (startPosition + endPosition) / 2;
    const speed = 3;
    let movedLeftXPosition = centerPosition;
    let movedRightXPosition = centerPosition;
    const ctx = canvas.getContext("2d");
    const fullHeight = canvas.height;
    ctx.strokeStyle = '#F2372B'; // Line color
    ctx.lineWidth = 7; // Line width
    const animate = () =>{
        ctx.beginPath();
        ctx.moveTo(centerPosition, fullHeight / 2);
        movedLeftXPosition = movedLeftXPosition - speed;
        ctx.lineTo(movedLeftXPosition, fullHeight / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerPosition, fullHeight / 2);
        movedRightXPosition = movedRightXPosition + speed;
        ctx.lineTo(movedRightXPosition, fullHeight / 2);
        ctx.stroke();
        if((movedLeftXPosition > startPosition) || (movedRightXPosition < endPosition))
            requestAnimationFrame(animate);
        else{
            // 미만의 경우 줄이 위로 올라옴으로 다시 그려주어야 한다.
            if (firstSelectValue === '초과') {
                drawDot(canvasNumber, 2, startPosition);
            }
            if (secondSelectValue === '미만') {
                drawDot(canvasNumber, 2, endPosition);
            }
        }
    }
    animate();

    // 이제 버튼을 지원준다.
    root.querySelector(`.arrow-left-${canvasNumber}`).classList.add('hide');
    root.querySelector(`.arrow-right-${canvasNumber}`).classList.add('hide');
    root.querySelector(`.arrow-center-${canvasNumber}`).classList.add('hide');
    root.querySelector(`.arrow-box-${canvasNumber}`).classList.add('hide');
    if (canvasNumber === 1 && canvas.parentElement.querySelector('.btn-copy').style.visibility === 'hidden') {
        // 이건 항상 2번째 문제다.
        root.querySelector('.quiz-2 .quiz-row-2 .input-div').focus();
    } else {
        getAltFocusElement().focus();
    }
    quizComplete[canvasNumber - 1] = true;
    const text = `${firstInputValue} ${firstSelectValue} ${secondInputValue} ${secondSelectValue}인 수에 대한 범위를 나타내고 있습니다`;
    setCanvasLabel(canvasNumber, text);
}

const drawCanvasLineFocus = (canvas, position = null) => {
    if (!canvas.getContext) {
        console.log('canvas not supported');
        return;
    }
    const ctx = canvas.getContext("2d");
    const fullWidth = canvas.width;
    const fullHeight = canvas.height; // 50
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'yellow';
    let xPosition = 20;
    let yPosition = 5;
    let width = fullWidth - 40;
    let height = fullHeight - 10;
    if (position) {
        xPosition = position[0] - 3;
        width = (position[1] - position[0]) + 6;
        // 음성으로 알려 주어야 한다.
        announceAlert(String(position[2]));
    }
    ctx.strokeRect(xPosition, yPosition, width, height);
}

const drawCanvasLineSmallFocus = (canvas, event) => {
    const number = canvas.id === "canvas-area-1" ? 1 : 2;
    const increment = (event.key === 'Tab' && event.shiftKey) ? -1 : 1;
    const tabIndex = canvas.myTabIndex + increment;
    if (tabIndex < 0 || tabIndex >= canvasAreaEventPositions.length) {
        setSettingRuler(number, null, true);
    } else if (tabIndex < canvasAreaEventPositions.length) {
        if (selectedMode === 1) {
            setSettingRuler(number, null, false);
        } else {
            const temp = number === 1 ? canvasHistory1 : canvasHistory2;
            setSettingRuler(number, null, false);
            if (number === 1) {
                canvasHistory1 = temp;
            } else {
                canvasHistory2 = temp;
            }
            for (let i = 0; i < temp.length; i++) {
                const target = temp[i];
                if (target[3]) {
                    drawDot(number, target[3], (target[0] + target[1]) / 2)
                }
            }
        }
        canvas.myTabIndex = tabIndex;
        const position = canvasAreaEventPositions[tabIndex];
        drawCanvasLineFocus(canvas, position);
    }
}

const onEnterCanvas = (event) => {
    if (getPageState() === 1)
        return;
    const number = event.currentTarget.classList.contains('canvas-back-1') ? 1 : 2;
    if (quizComplete[number - 1])
        return;
    const canvas = event.currentTarget.parentElement.querySelector('canvas');
    // 먼저 필요한 입력이 되었는지 확인해야 한다.
    const checkResult = checkQuizInputComplete(number);
    if (!checkResult) {
        showPopup(13, {focus: event.currentTarget});
        return
    }
    clearAllModalAndArrow();
    if (canvas.myTabIndex === -2) {
        canvas.myTabIndex = -1;
        drawCanvasLineFocus(canvas)
    } else if (canvas.myTabIndex > -1 && canvas.myTabIndex < canvasAreaEventPositions.length) {
        const number = canvas.id === "canvas-area-1" ? 1 : 2;
        const x = (canvasAreaEventPositions[canvas.myTabIndex][0] + canvasAreaEventPositions[canvas.myTabIndex][1]) / 2;
        onEnterCanvasArea(number, x);
    }
}

const clearCanvasLineFocus = (event) => {
    const canvas = event.currentTarget.parentElement.querySelector('canvas');
    if (canvas.myTabIndex !== -2) {
        canvas.myTabIndex = -2;
        const number = canvas.id === "canvas-area-1" ? 1 : 2;
        const temp = number === 1 ? canvasHistory1 : canvasHistory2;
        setSettingRuler(number, null);
        if (selectedMode === 2) {
            if (number === 1) {
                canvasHistory1 = temp;
            } else {
                canvasHistory2 = temp;
            }
            for (let i = 0; i < temp.length; i++) {
                const target = temp[i];
                if (target[3]) {
                    drawDot(number, target[3], (target[0] + target[1]) / 2)
                }
            }
        }
    }
}

const responseKeyPadEvent = (event) => {
    if (isBlinking)
        return;
    if (getPageState() === 1) {
        if (root.querySelector('.setting .input').value.length < 1) {
            root.querySelector('.setting .pencil').classList.remove('hide');
            root.querySelectorAll('.canvas-area-1 .ruler-number').forEach((div) => {
                div.innerHTML = '';
            });
            showPopup(1, {focus: root.querySelector('#canvas-area-1')})
        } else {
            const settingInput = root.querySelector('.setting .input');
            const inputValue = parseFloat(settingInput.value);
            if(!isNaN(inputValue))
                settingInput.value = String(inputValue);
            setSettingRuler(1, root.querySelector('.unit-text'));
        }
    } else {
        const inputNumber = event?.detail.name;
        const input = inputNumber === '1' ? root.querySelector('.quiz-1 .quiz-row-1 .input')
            : inputNumber === '2' ? root.querySelector('.quiz-1 .quiz-row-2 .input')
                : inputNumber === '3' ? root.querySelector('.quiz-2 .quiz-row-1 .input.first')
                    : inputNumber === '4' ? root.querySelector('.quiz-2 .quiz-row-1 .input.second')
                        : inputNumber === '5' ? root.querySelector('.quiz-2 .quiz-row-2 .input.first')
                            : root.querySelector('.quiz-2 .quiz-row-2 .input.second')
        if (input.value.length < 1) {
            input.parentElement.querySelector('.pencil').classList.remove('hide');
        } else {
            checkQuizInput(input, inputNumber);
        }
    }
}

const onEnterRulerNumber = (event, canvasNumber, rulerNumberIndex, index) => {
    event.preventDefault();
    event.stopPropagation();
    clearAllModalAndArrow();
    const interval = canvasAreaEventPositions.length > 70 ? 10
        : canvasAreaEventPositions.length > 20 ? 5 : 1;
    const target = canvasAreaEventPositions[rulerNumberIndex * interval];
    onEnterCanvasArea(canvasNumber, (target[0] + target[1]) / 2, index)
}
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화
//_____________________________________________________________________________________________________________________
const init = (env) => {
    // 새도우돔은 font-face 가 작동하지 않아서 넣는다.
    const sheets = root.styleSheets;
    const style = sheets[sheets.length - 1];
    let href = style.href;
    href = href.substring(0, href.indexOf('/css'));
    for (let i = 0; i < style.cssRules.length; i++) {
        const rule = style.cssRules[i];
        if (rule.cssText && rule.cssText.indexOf("@font-face") >= 0) {
            const cssText = rule.cssText.replace("..", href);
            const st = document.createElement('style');
            st.appendChild(document.createTextNode(cssText));
            document
                .getElementsByTagName('head')[0]
                .appendChild(st);
        }
    }
    // 자판 만들기
    //qwerty.init(root, '.modal_qwerty');
    numberPad.init(root, '.modal_number_pad');

    root.addEventListener('keyboardDismiss', (event) => {
        responseKeyPadEvent(event);
    })

    root.querySelector(".btn-refresh").addEventListener('click', onClickRefresh);

    root.querySelector('.intro-button-1').addEventListener('click', (event) => {
        showSetting(event, 1);
    })
    root.querySelector('.intro-button-2').addEventListener('click', (event) => {
        showSetting(event, 2);
    });
    root.querySelector('.btn-back').addEventListener('click', (event) => {
        if (getPageState() === 1) {
            // 처음 화면으로 이동
            showIntro();
        } else {
            // 세팅 화면으로 이동
            showSetting(null, selectedMode);
        }
    })
    root.querySelector('.btn-complete').addEventListener('click', (event) => {
        onClickSettingComplete(event)
    });
    root.querySelector('.btn-close').addEventListener('click', (event) => {
        resetSetting(event)
    });

    root.querySelector('#canvas-area-1').addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        clearAllModalAndArrow();
        onClickCanvasArea(event, 1)
    });
    root.querySelector('#canvas-area-2').addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        clearAllModalAndArrow();
        onClickCanvasArea(event, 2)
    });
    root.querySelectorAll('.select_list > div').forEach((select) => {
        select.addEventListener('mouseenter', (event) => {
            //select.style.backgroundColor = "#E6E9F0";
            select.focus();
        })
        select.addEventListener('mouseleave', (event) => {
            //select.style.backgroundColor = "white";
            select.parentElement.focus();
        })
    })
    root.querySelectorAll('.number-select-box').forEach((box) => {
        box.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if(box.classList.contains('gray')) {
                return;
            }
            if (lessonNo !== lessons[0] && lessonNo !== lessons[5])
                return;
            numberPad.remove();
            box.querySelector('.select_list_aria').classList.remove('hide');
            box.querySelector('.select_list').classList.remove('hide');
            const aria = box.querySelector('.select_list_aria');
            if (aria)
                aria.focus();
        })
    })

    root.querySelectorAll('.select_list > div').forEach((select) => {
        select.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (getPageState() === 1)
                onClickSettingAreaSelectList(event, select);
            else {
                onClickQuizSelectList(event, select);
            }
        })
    })

    root.querySelector('.milli-toggle').addEventListener('click', (event) => {
        event.preventDefault();
        onClickMilliToggle(event);
    })
    //```````````````````````````````````````````````````````````````
    // 복사 버튼을 누른 경우
    //__________________________________________________________________
    root.querySelector('.canvas-area-1 .btn-copy').addEventListener('click', (event) => {
        setSettingRuler(2, null);
        root.querySelector('.content').classList.add('double')
        root.querySelector('.canvas-area-1 .btn-copy').style.visibility = 'hidden';
        root.querySelector('.canvas-area-2').classList.remove('hide');
        root.querySelector('.canvas-area-1').classList.add('double');
        root.querySelectorAll('.quiz-row-2 .input').forEach((input) => {
            input.value = '';
            input.parentElement.querySelector('.pencil').classList.remove('hide');
        })
        root.querySelectorAll('.quiz-row-2 .answer').forEach((answer) => {
            answer.innerHTML = '';
        })
        root.querySelectorAll('.circle-select_2').forEach((row) => {
            row.classList.add('hide');
        })
        root.querySelectorAll('.arrow-left-2').forEach((row) => {
            row.classList.add('hide');
        })
        root.querySelectorAll('.arrow-right-2').forEach((row) => {
            row.classList.add('hide');
        })
        root.querySelectorAll('.quiz-row-2').forEach((row) => {
            row.classList.remove('hide');
        })
        // 모든 강조를 지워야 한다.
        root.querySelectorAll('.canvas-area-2 .ruler-number').forEach((number) => {
            number.classList.remove('text-shadow');
        })
        root.querySelectorAll('.shadow-div-2').forEach((number) => {
            number.classList.add('hide');
        })
        // 마지막으로 포커스를 바꿔준다.
        root.querySelector(`.quiz-${selectedMode} .quiz-row-2 .input-div`).focus();
        quizComplete[1] = false;
    });

    root.querySelector('.canvas-area-2 .btn-copy').addEventListener('click', (event) => {
        root.querySelector('.content').classList.remove('double')
        root.querySelector('.canvas-area-1 .btn-copy').style.visibility = 'visible';
        root.querySelector('.canvas-area-2').classList.add('hide');
        root.querySelector('.canvas-area-1').classList.remove('double');
        root.querySelectorAll('.quiz-row-2').forEach((row) => {
            row.classList.add('hide');
        })
        // 모든 강조를 지워야 한다.
        // 지울필요 없다....
    });

    root.querySelectorAll('.input').forEach((input, inputIndex) => {
        input.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if(input.classList.contains('gray')) {
                input.blur();
                return;
            }
            clearAllModalAndArrow();
            if (lessonNo !== lessons[0] && lessonNo !== lessons[5])
                return;
            numberPad.activate(input, String(inputIndex), (text) => {

            })
            const pencil = input.parentElement.querySelector('.pencil');
            pencil?.classList.add('hide');
        });
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                root.querySelector('.modal_number_pad').firstChild.focus();
            }
        });
        input.oninput = (event) => {
            if (event.target.value.length < 1)
                return;
            if(input.value.length === 2 && input.value[0]==='0' && input.value[1]!=='.'){
                input.value = input.value[0];
                return;
            }
            if (getPageState() === 1)
                checkSettingAreaInput();
            else {
                // 문제에서는 여러 자리가 들어감으로 한꺼번에 검색해야 한다.
                checkInput(input);
            }
        }
    });
    const settingInput = root.querySelector('.setting .input');
    settingInput.addEventListener('click', (event) => {
        settingInput.value = '';
    });

    root.querySelectorAll('.circle-select div').forEach((div, index) => {
        div.addEventListener('click', (event) => {
            // 0, 1, 2, 3, 4, 5, 6, 7 index
            // 첫번째 인수: 왼쪽 빨간색 클릭인지, 오른쪽 흰 원인지 구별
            const selectedCircleType = index % 2 + 1;
            const parentClassList = event.currentTarget.parentElement.classList;
            const canvasNum = (parentClassList.contains('circle-select_1') || parentClassList.contains('circle-select_3')) ? 1 : 2;
            const isLeftModal = (parentClassList.contains('circle-select_1') || parentClassList.contains('circle-select_2'))
            onClickModal(event, selectedCircleType, canvasNum, isLeftModal);
        })
    })

    root.querySelector('.arrow-left-1').addEventListener('click', (event) => {
        onClickArrow1(event, 1);
    })
    root.querySelector('.arrow-right-1').addEventListener('click', (event) => {
        onClickArrow1(event, 2);
    })
    root.querySelector('.arrow-left-2').addEventListener('click', (event) => {
        onClickArrow2(event, 1);
    })
    root.querySelector('.arrow-right-2').addEventListener('click', (event) => {
        onClickArrow2(event, 2);
    })
    root.querySelectorAll('.arrow-center').forEach((arrowCenter, index) => {
        arrowCenter.addEventListener('click', (event) => {
            onClickArrowCenter(event, index + 1);
        })
    })
    root.querySelectorAll('.canvas-back').forEach((canvasBack, index) => {
        canvasBack.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            onEnterCanvas(event);
        })
        canvasBack.addEventListener('blur', (event) => {
            clearCanvasLineFocus(event)
        })
    })
    root.querySelectorAll('.ruler-number').forEach((div, index) => {
        div.addEventListener('click', (event) => {
            onEnterRulerNumber(event, Math.floor(index / 11)+1, index % 11, index)
        })
    })

    root.querySelectorAll("input").forEach((element) => {
        element.addEventListener('keydown', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
    });


    //``````````````````````````````````````````````````````````````````````````````````````
    // 탭 관련 키 후크
    //______________________________________________________________________________________
    root.querySelectorAll('[tabindex]').forEach((tab) => {
        if (parseInt(tab.getAttribute('tabindex')) > 0) {
            tab.addEventListener('keydown', function (event) {
                //console.log('tabIndex:' + event.key);
                if (event.key === 'Enter') {
                    tab.click()
                    event.stopPropagation();
                }
            });
        }
    });
    root.querySelectorAll('.input-div').forEach((div) => {
        div.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            div.querySelector('.input').click();
        })
    })

    root.querySelectorAll('.canvas-back').forEach((back, index) => {
        const canvasNumber = index + 1;
        // 캠퍼스에 포커스를 그려주어야 하기 때문에 여기에 정의한다.
        defineTab(`.canvas-back-${canvasNumber}`,
            //backward
            (event) => {
                if (getPageState() === 1) {
                    focus('.setting .number-select-box')
                } else if (getPageState() === 2) {
                    const canvas = back.parentElement.querySelector('canvas');
                    if (canvas.myTabIndex > -2) {
                        drawCanvasLineSmallFocus(canvas, event);
                    } else {
                        focus(`.quiz-1 .quiz-row-${canvasNumber} .quiz-row-txt`)
                    }
                } else if (getPageState() === 3) {
                    const canvas = back.parentElement.querySelector('canvas');
                    if (canvas.myTabIndex > -2) {
                        drawCanvasLineSmallFocus(canvas, event);
                    } else {
                        focus(`.quiz-2 .quiz-row-${canvasNumber} .number-select-box.second`)
                    }
                }
            },
            // forward
            (event) => {
                if (getPageState() === 1) {
                    focus('.setting .toggle-text');
                } else {
                    const canvas = back.parentElement.querySelector('canvas');
                    if (canvas.myTabIndex > -2) {
                        //console.log('canvas-back');
                        drawCanvasLineSmallFocus(canvas, event);
                    } else {
                        canvas.parentElement.parentElement.querySelector('.ruler-number-div div').focus();
                    }
                }
            });
    })

}


window.addEventListener("script-loaded", (env) => {
    if (root) return;
    //['5-2_1_2_4', '5-2_1_2', '5-2_1_3', '5-2_1_4_1', '5-2_1_4_2', '5-2_1_4_3', '5-2_1_8']
    lessonNo = lessons[0];
    //lessonNo = lessons[1];
    //lessonNo = lessons[2];
    //lessonNo = lessons[3];
    // 범위 구하기
    //lessonNo = lessons[4];
    //lessonNo = lessons[5];
    //lessonNo = lessons[6];
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');
    if (param && param !== env.detail.unique) return;
    root = env.detail.root;

    setFullButton(root);
    scale = autoScale(root);
    window.addEventListener("resize", (event) => {
        scale = autoScale(root);
    });
    checkIpad(root);
    setStartDim(root, (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.currentTarget.classList.add('hide');
        const popup = root.querySelector('.popup');
        if(!popup.classList.contains('hide')){
            popup.querySelector('.popup-content').focus();
        }else {
            setFocusToFullButton();
        }
    })
    createTabRule(root); // 주의: init 보다 앞에 있어야 한다.
    init(env);
    document.addEventListener('click', (event) => {
        clearAllModalAndArrow();
    })
    const modalOverlay = root.querySelector('.modal-overlay');
    modalOverlay.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
    })
    modalOverlay.addEventListener('keydown', (event) => {
        event.preventDefault();
        event.stopPropagation();
    })
    switch (lessonNo) {
        case lessons[0]:
            showIntro();
            showPopup(14, {pin: true});
            break;
        case lessons[1]: {
            showSetting(null, 1);
            root.querySelector('.setting input').value = '32';
            responseKeyPadEvent();
            onClickSettingComplete(null);
            setSingleSetting(root, {
                quiz_type: 1,
                show_canvas_2: true,
                alt_box_label: '수직선의 눈금을 클릭하여 삼십오 이상인 수와 삼십칠 이하인 수를 알아보는 활동입니다',
                input_disabled: true,
                first_input_value: '35',
                first_input_label: '삼십오',
                first_select_value: '이상',
                second_input_value: '37',
                second_input_label: '삼십칠',
                second_select_value: '이하',
                content_class: 'single-double'
            });
            // 순서상 뒤에 와야 한다.
            setSettingRuler(1, null);
            setSettingRuler(2, null);
            showPopup(15, {pin: true});
        }
            break;
        case lessons[2]: {
            showSetting(null, 1);
            root.querySelector('.setting input').value = '80';
            responseKeyPadEvent();
            onClickSettingComplete(null);
            setSingleSetting(root, {
                quiz_type: 1,
                show_canvas_2: true,
                alt_box_label: '수직선의 눈금을 클릭하여 팔십삼 초과인 수와 팔십육 미만인 수를 알아보는 활동입니다',
                input_disabled: true,
                first_input_value: '83',
                first_input_label: '팔십삼',
                first_select_value: '초과',
                second_input_value: '86',
                second_input_label: '팔십육',
                second_select_value: '미만',
                content_class: 'single-double'
            });
            // 순서상 뒤에 와야 한다.
            setSettingRuler(1, null);
            setSettingRuler(2, null);
            showPopup(15, {pin: true});
        }
            break;
        case lessons[3]: {
            showSetting(null, 1);
            root.querySelector('.setting input').value = '3';
            responseKeyPadEvent();
            onClickSettingComplete(null);
            setSingleSetting(root, {
                quiz_type: 1,
                show_canvas_2: true,
                alt_box_label: '수직선의 눈금을 클릭하여 팔 이상인 수와 십일 미만인 수를 알아보는 활동입니다',
                input_disabled: true,
                first_input_value: '8',
                first_input_label: '팔',
                first_select_value: '이상',
                second_input_value: '11',
                second_input_label: '십일',
                second_select_value: '미만',
                content_class: 'single-double'
            });
            // 순서상 뒤에 와야 한다.
            setSettingRuler(1, null);
            setSettingRuler(2, null);
            showPopup(15, {pin: true});
        }
            break;
        // 범위 구하기
        case lessons[4]: {
            showSetting(null, 2);
            root.querySelector('.setting input').value = '3';
            responseKeyPadEvent();
            onClickSettingComplete(null);
            setSingleSetting(root, {
                quiz_type: 2,
                show_canvas_2: false,
                alt_box_label: '수직선의 눈금을 클릭하여 팔 이상 십일 미만에 속하는 수의 범위를 알아보는 활동입니다',
                input_disabled: true,
                first_input_value: '8',
                first_input_label: '팔',
                first_select_value: '이상',
                second_input_value: '11',
                second_input_label: '십일',
                second_select_value: '미만',
                content_class: 'single-single'
            });
            // 순서상 뒤에 와야 한다.
            setSettingRuler(1, null);
            setSettingRuler(2, null);
            showPopup(16, {pin: true});
        }
            break;
        case lessons[5]:{
            showSetting(null, 2);
            root.querySelector('.setting input').value = '5';
            responseKeyPadEvent();
            root.querySelector('.setting-area .answer').innerHTML = '5';
            onClickSettingComplete(null);
            setSingleSetting(root, {
                quiz_type: 2,
                show_canvas_2: false,
                alt_box_label: '수직선의 눈금을 클릭한 후, 수의 범위를 나타내어 보세요',
                input_disabled: false,
                content_class: 'single-single'
            });
            // 순서상 뒤에 와야 한다.
            setSettingRuler(1, null);
            showPopup(16, {pin: true});
        }
            break;
        case lessons[6]:{
            showSetting(null, 2);
            root.querySelector('.setting input').value = '3.1';
            responseKeyPadEvent();
            root.querySelector('.setting-area .answer').innerHTML = '0.1';
            onClickSettingComplete(null);
            setSingleSetting(root, {
                quiz_type: 2,
                show_canvas_2: false,
                alt_box_label: '수직선의 눈금을 클릭하여 삼쩜사 초과 삼쩜팔 이하에 속하는 수의 범위를 알아보는 활동입니다',
                input_disabled: true,
                first_input_value: '3.4',
                first_input_label: '삼쩜사',
                first_select_value: '초과',
                second_input_value: '3.8',
                second_input_label: '삼쩜팔',
                second_select_value: '이하',
                content_class: 'single-single'
            });
            // 순서상 뒤에 와야 한다.
            setSettingRuler(1, null);
            showPopup(16, {pin: true});
        }
            break;
        default:
            break;
    }
    root.querySelector('.start-dim').focus();
});
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화 끝
//______________________________________________________________________________________________________________________








