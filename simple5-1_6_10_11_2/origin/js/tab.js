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
    const drawBoxes = root.querySelectorAll('.draw-box');
    if(!drawBoxes[0].classList.contains('hide')){
        // 가위 확인
        const scissors = root.querySelector('.scissors.horizontal');
        if(!scissors.classList.contains('hide'))
            scissors.focus();
        else
            root.querySelector('.complete-box_1').focus();
    }if(!drawBoxes[1].classList.contains('hide')){
        // 가위 확인
        const scissors = root.querySelector('.scissors.diagonal');
        if(!scissors.classList.contains('hide'))
            scissors.focus();
        else
            root.querySelector('.complete-box_2').focus();
    }else{
        // 세번째 박스가 활성화된 상태
        const scissors1 = root.querySelector('.scissors.vertical_1');
        const scissors2 = root.querySelector('.scissors.vertical_2');
        if(!scissors2.classList.contains('hide'))
            scissors2.focus();
        else if(!scissors1.classList.contains('hide'))
            scissors1.focus();
        else{
            root.querySelector('.complete-box_3').focus();
        }
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
        if(isExplain())
            setFocusToRefresh(false);
        else
            root.querySelector('.button_3').focus();
    },()=>{
        const content = root.querySelector('.scaffolding-content');
        if(isExplain())
            setFocusToAltBox();
        else{
            // 도형이 완성된 상태
            const boxes = root.querySelectorAll('.draw-box');
            if(!boxes[0].classList.contains('hide')) {
                root.querySelector('.complete-box_1').focus();
            }else if(!boxes[1].classList.contains('hide')) {
                root.querySelector('.complete-box_2').focus();
            }else{
                root.querySelector('.complete-box_3').focus();
            }
        }
    });
    defineTab('.complete-box_1', '.scaffolding-content',()=>{
        setFocusToFullButton(true);
    });
    defineTab('.complete-box_2', '.scaffolding-content',()=>{
        setFocusToFullButton(true);
    });
    defineTab('.complete-box_3', '.scaffolding-content',()=>{
        setFocusToFullButton(true);
    });
    //'.scaffolding-content'
    defineTab('.alt-box', ()=>{
        if(isExplain())
            root.querySelector('.scaffolding-content').focus();
        else
            setFocusToRefresh(false)
    },'.button_1');


    defineTab('.button_1', '.alt-box','.button_2');
    defineTab('.button_2', '.button_1','.button_3');
    defineTab('.button_3', '.button_2',()=>{
        if(isExplain())
            root.querySelector('.draw-box-box').focus();
        else
            setFocusToScaffolding(true);
    });
    defineTab('.draw-box-box', '.button_3',()=>{
        const drawBoxes = root.querySelectorAll('.draw-box');
        if(!drawBoxes[0].classList.contains('hide')){
            // 완성인지 아닌지 알아야 한다.
            const bar = root.querySelector('.click-bar-horizontal_1');
            if(!bar.classList.contains('hide')){
                bar.focus();
            }else{
                // 도형 이동이 완성된 상태
                setFocusToScaffolding(true);
            }
        }else if(!drawBoxes[1].classList.contains('hide')){
            // 완성인지 아닌지 알아야 한다.
            const bar = root.querySelector('.click-bar-horizontal_2');
            if(!bar.classList.contains('hide')){
                bar.focus();
            }else{
                // 도형 이동이 완성된 상태
                setFocusToScaffolding(true);
            }
        }else{
            // 두번째 박스가 활성화된 상태
            const bar1 = root.querySelector('.click-bar-vertical_1');
            const bar2 = root.querySelector('.click-bar-vertical_2');
            if(!bar1.classList.contains('hide'))
                bar1.focus();
            else if(!bar2.classList.contains('hide'))
                bar2.focus();
            else{
                // 도형 이동이 완성된 상태
                setFocusToScaffolding(true);
            }
        }
    });
    defineTab('.click-bar-horizontal_1', '.draw-box-box', '.scissors.horizontal');
    defineTab('.click-bar-horizontal_2', '.draw-box-box', '.scissors.diagonal');
    defineTab('.click-bar-vertical_1', '.draw-box-box', '.scissors.vertical_1');
    defineTab('.click-bar-vertical_2', ()=>{
        const scissors = root.querySelector('.scissors.vertical_1');
        if(!scissors.classList.contains('hide'))
            scissors.focus();
        else
            root.querySelector('.draw-box-box').focus();
    }, '.scissors.vertical_2');
    defineTab('.scissors.horizontal', '.click-bar-horizontal_1', ()=>{
        setFocusToFullButton(true);
    });
    defineTab('.scissors.diagonal', '.click-bar-horizontal_2', ()=>{
        setFocusToFullButton(true);
    });
    defineTab('.scissors.vertical_1', '.click-bar-vertical_1', ()=>{
        const bar2 = root.querySelector('.click-bar-vertical_2');
        if(!bar2.classList.contains('hide'))
            bar2.focus();
        else
            setFocusToFullButton(true);
    });
    defineTab('.scissors.vertical_2', '.click-bar-vertical_2', ()=>{
        setFocusToFullButton(true);
    });

}