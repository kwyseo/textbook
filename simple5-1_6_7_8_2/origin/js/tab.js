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
        setFocusToScaffolding(next)
    } else {
        setFocusToLastElement(next);
    }
}

export const setFocusToScaffolding = (next = true) => {
    const scaffolding = root.querySelector('.scaffolding');
    if (!scaffolding.classList.contains('hide'))
        return scaffolding.querySelector('.scaffolding-content').focus();
    if (next) {
        setFocusToIntro(next);
    } else {
        setFocusToFullButton(next);
    }
}

export const setFocusToIntro = (next = true) => {
    const intro = root.querySelector('.menu .intro');
    if (!intro.classList.contains('hide'))
        return intro.focus();
    if (next) {
        setFocusToAltBox(next);
    } else {
        setFocusToScaffolding(next);
    }
}

const setFocusToLastElement = () => {
    if (isQuizComplete('pink')) {
        root.querySelector('.complete-box_2').focus();
    } else {
        root.querySelector('.triangle-pink.second .red-line-3').focus();
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

const isQuizComplete = (type) => {
    let result = false;
    const _check = (element) => {
        const style = getComputedStyle(element);
        // Extract the transform matrix
        const transformMatrix = style.transform; // e.g., "matrix(0.7071, 0.7071, -0.7071, 0.7071, 0, 0)"
        // Check if a transform is applied
        if (transformMatrix !== 'none') {
            const values = transformMatrix.match(/matrix\(([^)]+)\)/)[1].split(', ');
            const a = parseFloat(values[0]); // First value (a) in the matrix
            const b = parseFloat(values[1]); // Second value (b) in the matrix

            // Calculate the rotation angle
            const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI)); // Convert radians to degrees
            if (angle)
                result = true;
        } else {
            //
        }
    }
    root.querySelectorAll(`.${type === 'blue' ? 'triangle-blue' : 'triangle-pink'}`).forEach((triangle) => {
        _check(triangle);
    })
    return result;
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
                    if(event.currentTarget.classList.contains('click-line')){
                        const mouseDownEvent = new MouseEvent('mousedown', {
                            bubbles: true,      // Allows the event to bubble up through the DOM
                            cancelable: true,   // Allows the event to be canceled
                            view: window        // Specifies the view (usually the window)
                        });
                        tab.dispatchEvent(mouseDownEvent);
                    }else {
                        tab.click()
                    }
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
            setFocusToScaffolding(true);
        }
    );
    defineTab('.scaffolding-content',
        () => {
            const content = root.querySelector('.scaffolding-content');
            if(content.classList.contains('explain'))
                setFocusToFullButton(false);
            else{
                // 음... 원래것으로 돌아가야 하나?
            }
        },
        () => {
            const content = root.querySelector('.scaffolding-content');
            if(content.classList.contains('explain'))
                setFocusToIntro(true);
            else
                setFocusToAltBox();
        }
    );
    defineTab('.menu .intro',
        () => {
            setFocusToScaffolding(false);
        }, '.alt-box');
    defineTab('.alt-box', () => {
        setFocusToIntro(false)
    }, '.refresh_1');
    defineTab('.refresh_1', '.alt-box', '.title_1');
    defineTab('.title_1', '.refresh_1', '.draw-box-box_1');
    defineTab('.draw-box-box_1', '.title_1', () => {
        if (isQuizComplete('blue')) {
            root.querySelector('.complete-box_1').focus();
        } else {
            root.querySelector('.triangle-blue.first .triangle-box').focus();
        }
    });
    defineTab('.complete-box_1', '.draw-box-box_1', '.refresh_2');
    defineTab('.triangle-blue.first .triangle-box', '.draw-box-box_1', '.triangle-blue.first .blue-line-1');
    defineTab('.triangle-blue.first .blue-line-1', '.triangle-blue.first .triangle-box', '.triangle-blue.first .blue-line-2');
    defineTab('.triangle-blue.first .blue-line-2', '.triangle-blue.first .blue-line-1', '.triangle-blue.first .blue-line-3');
    defineTab('.triangle-blue.first .blue-line-3', '.triangle-blue.first .blue-line-2', '.triangle-blue.second .triangle-box');
    defineTab('.triangle-blue.second .triangle-box', '.triangle-blue.first .blue-line-3', '.triangle-blue.second .blue-line-1');
    defineTab('.triangle-blue.second .blue-line-1', '.triangle-blue.second .triangle-box', '.triangle-blue.second .blue-line-2');
    defineTab('.triangle-blue.second .blue-line-2', '.triangle-blue.second .blue-line-1', '.triangle-blue.second .blue-line-3');
    defineTab('.triangle-blue.second .blue-line-3', '.triangle-blue.second .blue-line-2', '.refresh_2');
    defineTab('.refresh_2', () => {
        if (isQuizComplete('blue')) {
            root.querySelector('.complete-box_1').focus();
        } else {
            root.querySelector('.triangle-blue.second .blue-line-3').focus();
        }
    }, '.title_2');
    defineTab('.title_2', '.refresh_2', '.draw-box-box_2');
    defineTab('.draw-box-box_2', '.title_2', () => {
        if (isQuizComplete('pink')) {
            root.querySelector('.complete-box_2').focus();
        } else {
            root.querySelector('.triangle-pink.first .triangle-box').focus();
        }
    });
    defineTab('.complete-box_2', '.draw-box-box_2', () => {
        setFocusToFullButton(true);
    });
    defineTab('.triangle-pink.first .triangle-box', '.draw-box-box_2', '.triangle-pink.first .red-line-1');
    defineTab('.triangle-pink.first .red-line-1', '.triangle-pink.first .triangle-box', '.triangle-pink.first .red-line-2');
    defineTab('.triangle-pink.first .red-line-2', '.triangle-pink.first .red-line-1', '.triangle-pink.first .red-line-3');
    defineTab('.triangle-pink.first .red-line-3', '.triangle-pink.first .red-line-2', '.triangle-pink.second .triangle-box');
    defineTab('.triangle-pink.second .triangle-box', '.triangle-pink.first .red-line-3', '.triangle-pink.second .red-line-1');
    defineTab('.triangle-pink.second .red-line-1', '.triangle-pink.second .triangle-box', '.triangle-pink.second .red-line-2');
    defineTab('.triangle-pink.second .red-line-2', '.triangle-pink.second .red-line-1', '.triangle-pink.second .red-line-3');
    defineTab('.triangle-pink.second .red-line-3', '.triangle-pink.second .red-line-2', () => {
        setFocusToFullButton(true);
    });

}