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

                if (typeof beforeFunction === 'string') {
                    try
                    {
                        root.querySelector(beforeFunction).focus();
                    }catch (e){
                        console.log('not found: ' + beforeFunction)
                    }
                }
                else if (typeof beforeFunction === 'function')
                    beforeFunction(event);
                else
                    beforeFunction.focus()
            } else if (event.key === 'Tab') {
                if (!nextFunction)
                    return;
                event.preventDefault();
                event.stopPropagation();
                if (typeof nextFunction === 'string') {
                    try {
                        root.querySelector(nextFunction).focus();
                    }catch (e){
                        console.log('not found: ' + beforeFunction)
                    }
                }
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
        setFocusToRefresh(next)
    } else {
        setFocusToLastElement(next);
    }
}

export const setFocusToRefresh = (next = true) => {
    root.querySelector('.btn-refresh').focus();
}

export const setFocusToScaffolding = (next = true) => {
    const scaffolding = root.querySelector('.scaffolding-content');
    // 이 차시에는 이게 사라지는 일이 없다.
    scaffolding.focus();
}

const setFocusToLastElement = () => {
    const content = root.querySelector('.scaffolding-content');
    const retry = root.querySelector('.retry');
    if(content.classList.contains('explain')) {
        root.querySelector('.draw-box-2 .click-line-1').focus();
    }else if(content.classList.contains('false')) {
        root.querySelector('.draw-box-2 .click-line-1').focus();
    }else if(!retry.classList.contains('hide')){
        retry.focus();
    }else {
        root.querySelector('.content-box-box').focus();
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

const isExplainOrFalse = ()=> {
    const content = root.querySelector('.scaffolding-content');
    return content.classList.contains('explain') || content.classList.contains('false');
}

export const createTabRule = (shadowRoot) => {
    if (root)
        return;
    root = shadowRoot;
    // tabindex 가 0돠 큰 것은 enter 이벤트를 받을 수 있도록 한다.
    root.querySelectorAll('[tabindex]').forEach((tab) => {
        if (parseInt(tab.getAttribute('tabindex')) > 0) {
            tab.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    // 주의: nvda 를 키면 nvda 가 후킹을 해서 여기까지도 오지 않는다.
                    // 그래도 넣은 것은 nvda 를 켜지 않았을 때 엔터가 먹도록 넣은 것이다.
                    //const customClickEvent = new CustomEvent('click', {
                    //    detail: {isFromEnter: true}
                    //});
                    //tab.dispatchEvent(customClickEvent);
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
            if(isExplainOrFalse()) {
                setFocusToScaffolding(true);
            }else{
                setFocusToAltBox();
            }
        }
    );

    defineTab('.scaffolding-content', ()=>{
        if(isExplainOrFalse())
            setFocusToRefresh(false);
        else
            setFocusToAltBox();
    },()=>{
        const content = root.querySelector('.scaffolding-content');
        if(isExplainOrFalse()) {
            const intro = root.querySelector('.intro');
            if (intro.style.visibility !== 'hidden')
                intro.focus();
            else
                setFocusToAltBox();
        }
        // 도형을 만들고 있는 경우와 만든 경우
        else {
            root.querySelector('.content-box-box').focus();
        }
    });
    defineTab('.intro', '.scaffolding-content',()=>{
        setFocusToAltBox(true);
    });
    defineTab('.content-box-box', '.scaffolding-content',()=>{
        const retryButton = root.querySelector('.retry');
        if(!retryButton.classList.contains('hide'))
            retryButton.focus();
        else
            setFocusToFullButton(true);
    });
    defineTab('.retry', '.content-box-box',()=>{
        setFocusToFullButton(true);
    });
    defineTab('.alt-box', ()=>{
        if(isExplainOrFalse())
            root.querySelector('.intro').focus();
        else
            setFocusToRefresh(false)
    },()=>{
        if(isExplainOrFalse())
            root.querySelector('.draw-box-1 .draw-box-box').focus();
        else
            setFocusToScaffolding(true);
    });

    defineTab('.draw-box-1 .draw-box-box', '.alt-box','.draw-box-1 .click-line-2');
    defineTab('.draw-box-1 .click-line-2', '.draw-box-1 .draw-box-box','.draw-box-1 .click-line-3');
    defineTab('.draw-box-1 .click-line-3', '.draw-box-1 .click-line-2','.draw-box-1 .click-line-4');
    defineTab('.draw-box-1 .click-line-4', '.draw-box-1 .click-line-3','.draw-box-1 .click-line-1');
    defineTab('.draw-box-1 .click-line-1', '.draw-box-1 .click-line-4','.draw-box-2 .draw-box-box');
    defineTab('.draw-box-2 .draw-box-box', '.draw-box-1 .click-line-1','.draw-box-2 .click-line-2');
    defineTab('.draw-box-2 .click-line-2', '.draw-box-2 .draw-box-box','.draw-box-2 .click-line-3');
    defineTab('.draw-box-2 .click-line-3', '.draw-box-2 .click-line-2','.draw-box-2 .click-line-4');
    defineTab('.draw-box-2 .click-line-4', '.draw-box-2 .click-line-3','.draw-box-2 .click-line-1');
    defineTab('.draw-box-2 .click-line-1', '.draw-box-2 .click-line-4',()=>{
        setFocusToFullButton(true);
    });
}