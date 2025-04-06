let root = null;
export const defineTab = (elementClass, beforeFunction, nextFunction, isMultiElements = false) => {
    if (!root) {
        console.log('탭에 사용할 루트를 정의하세요');
        return;
    }
    let targetElement = (typeof elementClass === 'string')
        ? root.querySelector(elementClass) : elementClass;
    if (isMultiElements)
        targetElement = (typeof elementClass === 'string')
            ? [...root.querySelectorAll(elementClass)] : elementClass;
    const _defineTab = (target) => {
        target.addEventListener('keydown', function (event) {
            if (event.key === 'Tab' && event.shiftKey) {
                if (!beforeFunction)
                    return;
                event.preventDefault();
                event.stopPropagation();

                if (typeof beforeFunction === 'string')
                    root.querySelector(beforeFunction).focus();
                else if (typeof beforeFunction === 'function')
                    beforeFunction(event);
                else
                    beforeFunction.focus()
            } else if (event.key === 'Tab') {
                if (!nextFunction)
                    return;
                event.preventDefault();
                event.stopPropagation();
                if (typeof nextFunction === 'string')
                    root.querySelector(nextFunction).focus();
                else if (typeof nextFunction === 'function')
                    nextFunction(event);
                else
                    nextFunction.focus();
            }
        });
    }
    if (Array.isArray(targetElement)) {
        targetElement.forEach((target) => {
            _defineTab(target);
        })
    } else {
        _defineTab(targetElement);
    }
}

export const getDisplay = (element) => {
    return window.getComputedStyle(element).display;
}
export const setFocusToFullButton = (next = true) => {
    const btnFull = root.querySelector('.btn-fullscreen');
    if (getDisplay(btnFull) !== 'none') {
        btnFull.focus();
        return;
    }
    if (next) {
        setFocusToRefresh(next);
    } else {
        setFocusToLastElement();
    }
}

const setFocusToRefresh = (next = true) => {
    const btnRefresh = root.querySelector('.btn-refresh');
    // 이 차시에서는 refresh 버튼이 없을 수 없다.
    btnRefresh.focus();
}

const setFocusToLastElement = () => {
    const parallelogram = root.querySelector('.parallelogram');
    if(!parallelogram.classList.contains('hide')) {
        const imageNames = ['select_1', 'select_2', 'select_3', 'select_4'];
        imageNames.forEach((className, index) => {
            if (parallelogram.classList.contains(className)) {
                root.querySelectorAll('.parallelogram .bar')[index].focus();
            }
        })
    }else{
        root.querySelector('.parallelogram-box').focus();
    }
}
const setFocusToAltBox = () => {
    root.querySelector('.wrap .alt-box').focus();
}
export const focus = (elementClass) => {
    if (!root) {
        console.log('탭에 사용할 루트를 정의하세요');
        return;
    }
    const target = (typeof elementClass === 'string')
        ? root.querySelector(elementClass) : elementClass;
    target.focus();
}
export const setAriaLabel = (elementClass, label) => {
    if (!root) {
        console.log('탭에 사용할 루트를 정의하세요');
        return;
    }
    if (typeof elementClass === 'string')
        root.querySelector(elementClass).setAttribute('aria-label', label);
    else
        elementClass.setAttribute('aria-label', label);
}


export const createTabRule = (shadowRoot) => {
    if (root)
        return;
    root = shadowRoot;
    // tabindex 가 0돠 큰 것은 enter 이벤트를 받을 수 있도록 한다.
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
    defineTab('.btn-fullscreen',
        () => {
            setFocusToLastElement();
        },
        () => {
            setFocusToRefresh(true);
        }
    );
    defineTab('.btn-refresh',
        () => {
            setFocusToFullButton(false);
        },
        () => {
            const box = root.querySelector('.pink-box');
            if(!box.classList.contains('hide')){
                box.focus();
            }else {
                setFocusToAltBox(true);
            }
        }
    );
    defineTab('.alt-box', () => {
        const pinkBox = root.querySelector('.pink-box');
        if(!pinkBox.classList.contains('hide'))
            pinkBox.focus();
        else
            setFocusToRefresh(false);
    }, '.parallelogram-box');
    defineTab('.pink-box', '.btn-refresh', '.alt-box');
    defineTab('.parallelogram-box', '.alt-box', ()=>{
        const box = root.querySelector('.scissors-box');
        if(box.classList.contains('hide')){
            const parallelogram = root.querySelector('.parallelogram ');
            if(parallelogram.classList.contains('hide'))
                setFocusToFullButton();
            else
                setFocusToLastElement();
        }else{
            const buttons = root.querySelectorAll('.button');
            if(!buttons[1].classList.contains('hide'))
                buttons[1].focus();
            else
                buttons[0].focus();
        }
    });
    defineTab('.button.right', '.parallelogram-box', ()=>{
        const leftButton = root.querySelector('.button.left');
        if(!leftButton.classList.contains('hide'))
            leftButton.focus();
        else
            root.querySelector('.trapezoid').focus();
    });
    defineTab('.button.left', ()=>{
        const rightButton = root.querySelector('.button.right');
        if(!rightButton.classList.contains('hide'))
            rightButton.focus();
        else
            root.querySelector('.parallelogram-box').focus();
    }, '.trapezoid');
    defineTab('.trapezoid', ()=>{
        const leftButton = root.querySelector('.button.left');
        if(!leftButton.classList.contains('hide'))
            leftButton.focus();
        else
            root.querySelector('.button.right').focus();
    }, ()=>{
        setFocusToLastElement();
    });
    defineTab('.parallelogram .bar', ()=>{
        const box = root.querySelector('.scissors-box');
        if(box.classList.contains('hide')){
            setFocusToAltBox();
        }else{
            const buttons = root.querySelectorAll('.button');
            if(!buttons[0].classList.contains('hide'))
                buttons[0].focus();
            else
                buttons[1].focus();
        }
    }, ()=>{
        setFocusToFullButton(true)
    }, true);
    defineTab('.scaffolding', '.btn-refresh', '.parallelogram-box');
}