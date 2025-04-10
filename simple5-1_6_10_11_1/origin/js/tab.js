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
    const scissorsHorizontal = root.querySelector('.scissors.horizontal');
    const scissorsVertical = root.querySelector('.scissors.vertical');
    if(!scissorsVertical.classList.contains('hide'))
        scissorsVertical.focus();
    else if(!scissorsHorizontal.classList.contains('hide'))
        scissorsHorizontal.focus();
    else{
        root.querySelector('.complete-box').focus();
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

const isExplain = ()=> {
    const content = root.querySelector('.scaffolding-content');
    return content.classList.contains('explain');
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
            if(isExplain()) {
                setFocusToScaffolding(true);
            }else{
                setFocusToAltBox();
            }
        }
    );

    defineTab('.scaffolding-content', ()=>{
        const content = root.querySelector('.scaffolding-content');
        if(content.classList.contains('explain'))
            setFocusToRefresh(false);
        else
            setFocusToAltBox();
    },()=>{
        const content = root.querySelector('.scaffolding-content');
        if(content.classList.contains('explain'))
            setFocusToAltBox();
        else{
            // 도형이 완성된 상태
            root.querySelector('.complete-box').focus();
        }
    });
    defineTab('.complete-box', '.scaffolding-content',()=>{
        setFocusToFullButton(true);
    });

    defineTab('.alt-box', ()=>{
        if(isExplain())
            root.querySelector('.scaffolding-content').focus();
        else
            setFocusToRefresh(false)
    },()=>{
        if(isExplain())
            root.querySelector('.content-box-box').focus();
        else
            setFocusToScaffolding(true);
    });

    defineTab('.content-box-box', '.alt-box',()=>{
        const clickBarHorizontal = root.querySelector('.click-bar-horizontal');
        const clickBarVertical = root.querySelector('.click-bar-vertical');
        if(!clickBarHorizontal.classList.contains('hide')){
            clickBarHorizontal.focus();
        }else if(!clickBarVertical.classList.contains('hide')){
            clickBarVertical.focus();
        }else{
            // 도형 이동이 완성된 상태...음... 도형이 완성된 상태에서 content-box-box 를 클릭할 수 있나?
            setFocusToScaffolding(true);
        }
    });
    defineTab('.click-bar-horizontal', '.content-box-box', '.scissors.horizontal');
    defineTab('.click-bar-vertical', ()=>{
        const scissors = root.querySelector('.scissors.horizontal');
        if(!scissors.classList.contains('hide'))
            scissors.focus();
        else
            root.querySelector('.content-box-box').focus();
    }, '.scissors.vertical');
    defineTab('.scissors.horizontal', '.click-bar-horizontal', ()=>{
        const clickBar = root.querySelector('.click-bar-vertical');
        if(!clickBar.classList.contains('hide'))
            clickBar.focus();
        else
            setFocusToFullButton(true);
    });
    defineTab('.scissors.vertical', '.click-bar-vertical', ()=>{
        setFocusToFullButton(true);
    });
}