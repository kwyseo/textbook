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
            ? root.querySelectorAll(elementClass) : elementClass;
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
    const drawBox = root.querySelector('.right .draw-box');
    if (drawBox.hasChildNodes()) {
        drawBox.lastElementChild.focus();
    } else {
        root.querySelector('.frame .right .draw-box-box').focus();
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
            setFocusToAltBox(true);
        }
    );
    defineTab('.alt-box', () => {
        setFocusToRefresh(false);
    }, '.shape-box');
    defineTab('.shape-box', '.alt-box', '.shape.circle');
    defineTab('.shape.circle', '.shape-box', '.shape.square');
    defineTab('.shape.square', '.shape.circle', '.shape.rectangle');
    defineTab('.shape.rectangle', '.shape.square', '.paste-all-form label');
    defineTab('.paste-all-form label', '.shape.rectangle', '#paste-all');
    defineTab('#paste-all', '.paste-all-form label', '.left .box-title');
    defineTab('.left .box-title', '#paste-all', '.left .draw-box-box');
    defineTab('.right .draw-box-box', '.right .box-title', () => {
        const drawBox = root.querySelector('.right .draw-box');
        if (drawBox.hasChildNodes()) {
            drawBox.firstElementChild.focus();
        } else {
            setFocusToFullButton(true);
        }
    });
}