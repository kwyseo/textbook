import {setAriaLabel} from "./tab.js";

export const setFullButton = (root)=>{
    root.querySelector(".btn-fullscreen").addEventListener('click',
        async (event)=>{await toggleFullScreen(root)});
}

const toggleFullScreen = async (root) => {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen || document.msRequestFullscreen;
        root.querySelector('.btn-fullscreen').setAttribute('aria-label', '전체 화면 켜져있는 상태입니다');
        await requestFullScreen.call(root.firstElementChild);
    }else{
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        root.querySelector('.btn-fullscreen').setAttribute('aria-label', '전체 화면 꺼져있는 상태입니다');
        await cancelFullScreen.call(document);
    }
}

export const checkIpad = (root) => {
    const result = [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    if(result) {
        root.querySelector('.btn-fullscreen').style.display = 'none';
        return true;
    }
    return false;
}

export const autoScale = (root) => {
    const viewWarp = root.querySelector('.view-wrap');
    const wrap = root.querySelector('.wrap');
    const targetWidth = 1920;
    const targetHeight = 1020;
    viewWarp.style.maxHeight = root.innerHeight;
    wrap.style.minWidth = targetWidth + "px";
    wrap.style.minHeight = targetHeight + "px";
    const calculatedScaleWidth = viewWarp.offsetWidth / targetWidth * 100;
    const calculatedScaleHeight = viewWarp.offsetHeight / targetHeight * 100;
    let scale = calculatedScaleWidth < calculatedScaleHeight ? calculatedScaleWidth: calculatedScaleHeight;
    wrap.style.transform = "scale(" + scale + "%)";
    // 뷰어 때문에 이짓을 한다.
    const rec = wrap.getBoundingClientRect();
    scale = rec.height / wrap.offsetHeight * 100;
    // fullscreen 에서 esc 누르는 것 때문에 사용한다.
    if (!document.fullscreenElement) {
        const btn = root.querySelector(".btn-fullscreen");
        btn.classList.remove('off');
    }else{
        const btn = root.querySelector(".btn-fullscreen");
        btn.classList.add('off');
    }
    return scale;
};

export const setStartDim = (root, callback) => {
    const startDim = root.querySelector('.start-dim');
    startDim.addEventListener('click', (event) => {
        if(callback)
            callback(event);
    })
    startDim.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === 'Tab') {
            if(callback) callback(event);
        }
    })
    startDim.focus();
}

export const setSingleSetting = (root, options) =>{
    root.querySelector('.content').style.backgroundColor='white';
    root.querySelector('.popup').classList.add('single');
    if(options.show_canvas_2) {
        root.querySelector('.canvas-area-1 .btn-copy').click();
    }
    root.querySelector('.canvas-area-1 .btn-copy').style.visibility = 'hidden';
    root.querySelector('.canvas-area-2 .btn-copy').style.visibility = 'hidden';
    root.querySelector('.canvas-area-1').classList.add('single');
    root.querySelector('.canvas-area-2').classList.add('single');
    root.querySelector('.btn-back').classList.add('hide');
    root.querySelector('.btn-refresh').style.marginRight = '-45px';
    setAriaLabel('.alt_box', options.alt_box_label);
    if(options.input_disabled) {
        const firstInput = options.quiz_type===1 ?
            root.querySelector('.quiz-1 .quiz-row-1 .input')
            :root.querySelector('.quiz-2 .quiz-row-1 .input.first');
        firstInput.value = options.first_input_value;
        firstInput.disabled = options.input_disabled;
        setAriaLabel(options.quiz_type===1
            ?'.quiz-1 .quiz-row-1 .input-div'
            : '.quiz-2 .quiz-row-1 .input-div.first', options.first_input_label);
        root.querySelector(options.quiz_type===1
            ?'.quiz-1 .quiz-row-1 .answer'
            :'.quiz-2 .quiz-row-1 .answer.first').innerHTML = options.first_select_value;
        setAriaLabel(options.quiz_type===1
            ?'.quiz-1 .quiz-row-1 .select_list_aria'
            :'.quiz-2 .quiz-row-1 .number-select-box.first .select_list_aria', options.first_select_value);
        const secondInput = options.quiz_type===1
            ? root.querySelector('.quiz-1 .quiz-row-2 .input')
            :root.querySelector('.quiz-2 .quiz-row-1 .input.second');
        secondInput.value = options.second_input_value;
        secondInput.disabled = options.input_disabled;
        setAriaLabel(options.quiz_type===1
            ?'.quiz-1 .quiz-row-2 .input-div'
            :'.quiz-2 .quiz-row-1 .input-div.second', options.second_input_label);
        root.querySelector(options.quiz_type===1
            ? '.quiz-1 .quiz-row-2 .answer'
            :'.quiz-2 .quiz-row-1 .answer.second').innerHTML = options.second_select_value;
        setAriaLabel(options.quiz_type===1
            ? '.quiz-1 .quiz-row-2 .select_list_aria'
            :'.quiz-2 .quiz-row-1 .number-select-box.second .select_list_aria', options.second_select_value);
        root.querySelectorAll(`${options.quiz_type===1?'.quiz-1':'.quiz-2'} .pencil`).forEach((pencil) => {
            pencil.classList.add('hide');
        })
    }
}