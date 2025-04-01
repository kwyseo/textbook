let root = null;
let selectedMode = 0;

export const setLibSelectedMode = (mode)=>{
    selectedMode = mode;
}


export const defineTab = (elementClass, beforeFunction, nextFunction)=>{
    if(!root){
        console.log('탭에 사용할 루트를 정의하세요');
        return;
    }
    /*
    if(elementClass.indexOf('quiz-row-1') > 0){
        alert(root.querySelector(elementClass));
    }
    console.log(elementClass)
     */
    const targetElement = (typeof elementClass === 'string')
        ?root.querySelector(elementClass):elementClass;
    targetElement.addEventListener('keydown', function(event) {
        if (event.key === 'Tab' && event.shiftKey) {
            if(!beforeFunction)
                return;
            event.preventDefault();
            event.stopPropagation();
            if(typeof beforeFunction === 'string')
                root.querySelector(beforeFunction).focus();
            else if(typeof beforeFunction === 'function')
                beforeFunction(event);
            else
                beforeFunction.focus()
        }else if (event.key === 'Tab') {
            if(!nextFunction)
                return;
            event.preventDefault();
            event.stopPropagation();
            if(typeof nextFunction === 'string')
                root.querySelector(nextFunction).focus();
            else if(typeof nextFunction === 'function')
                nextFunction(event);
            else
                nextFunction.focus();
        }
    });
}

export const getDisplay = (element) => {
    return window.getComputedStyle(element).display;
}

export const defineTabMulti = (elementClass, beforeFunction, nextFunction)=>{
    if(!root){
        console.log('탭에 사용할 루트를 정의하세요');
        return;
    }
    const targetElements = (typeof elementClass === 'string')
        ?root.querySelectorAll(elementClass):elementClass;
    targetElements.forEach((target, index)=>{
        target.addEventListener('keydown', (event)=>{
            if (event.key === 'Tab' && event.shiftKey) {
                if(!beforeFunction)
                    return;
                event.preventDefault();
                event.stopPropagation();
                if(typeof beforeFunction === 'string')
                    root.querySelector(beforeFunction).focus();
                else
                    beforeFunction(event);
            }else if (event.key === 'Tab') {
                if(!nextFunction)
                    return;
                event.preventDefault();
                event.stopPropagation();
                if(typeof nextFunction === 'string')
                    root.querySelector(nextFunction).focus();
                else
                    nextFunction(event);
            }
        })
    })
}
export const setFocusToFullButton = ( next = true) => {
    const btnFull = root.querySelector('.btn-fullscreen');
    if (getDisplay(btnFull) !== 'none') {
        btnFull.focus();
        return;
    }
    if(next){
        setFocusToRefresh(next);
    }else{
        setFocusToLastElement();
    }
}

const setFocusToRefresh = (next = true) =>{
    const btnRefresh = root.querySelector('.btn-refresh');
    const content = root.querySelector('.content');
    if(!root.querySelector('.section-intro').classList.contains('hide')){
        focus('.intro-button-1');
        return;
    }else if (getDisplay(content) !== 'none'){
        btnRefresh.focus();
        return;
    }
    if(next){
        setFocusToBack(next);
    }else{
        setFocusToFullButton(next);
    }
}

const setFocusToBack = (next = true) =>{
    const btnBack = root.querySelector('.btn-back');
    const sectionIntro = root.querySelector('.section-intro');
    if (getDisplay(btnBack) !== 'none' && sectionIntro.classList.contains('hide')) {
        btnBack.focus();
        return;
    }
    if(next){
        // alt_box or setting-area-back
        if(!root.querySelector('.setting').classList.contains('hide'))
            focus('.setting-area-back');
        else
            focus('.alt_box');
    }else{
        setFocusToRefresh(next);
    }
}

const setFocusToLastElement = () => {
    if(!root.querySelector('.section-intro').classList.contains('hide')){
        root.querySelector('.intro-button-2').focus();
    }else if(!root.querySelector('.setting').classList.contains('hide')){
        root.querySelector('.btn-close').focus();
    }else{
        let focused = false;
        root.querySelectorAll('.btn-copy').forEach((button)=>{
            if(button.style.visibility !== 'hidden'){
                button.focus();
                focused = true;
            }
        });
        if(!focused){
            // 두개다 포커스를 못 받는 경우는 single 인 경우다.
            const canvas2 = root.querySelector('.canvas-area-2');
            if(canvas2.classList.contains('hide')){
                root.querySelector('.canvas-area-1 .ruler-number-div div:last-child').focus();
            }else{
                root.querySelector('.canvas-area-2 .ruler-number-div div:last-child').focus();
            }
            root.querySelector('.canvas-area-2 .ruler-number-div div:last-child').focus();
        }
    }
}
const focusAltBox = ()=>{
    // hidden 이 나오는 경우는 single 일 때 만이다.
    if(root.querySelector('.canvas-area-2 .btn-copy').style.visibility==='hidden'){
        setFocusToFullButton(true)
    }else {
        root.querySelector('.alt_box').focus();
    }
}
export const focus = (elementClass)=>{
    if(!root){
        console.log('탭에 사용할 루트를 정의하세요');
        return;
    }
    const target = (typeof elementClass === 'string')
        ?root.querySelector(elementClass):elementClass;
    target.focus();
}
export const setAriaLabel = (elementClass, label)=> {
    if(!root){
        console.log('탭에 사용할 루트를 정의하세요');
        return;
    }
    if(typeof elementClass === 'string')
        root.querySelector(elementClass).setAttribute('aria-label', label);
    else
        elementClass.setAttribute('aria-label', label);
}

const getPageState = () => {
    return !root.querySelector('.section-intro').classList.contains('hide') ? 0
        : !root.querySelector('.setting').classList.contains('hide')? 1
            : !root.querySelector('.quiz-1').classList.contains('hide')? 2
                :3;

}

export const createTabRule = (shadowRoot) => {
    root = shadowRoot;
    defineTab('.btn-fullscreen',
        ()=> {
            setFocusToLastElement();
        },
        ()=> {
            setFocusToRefresh(true);
        }

    );
    defineTab('.intro-button-1',()=>{
        setFocusToFullButton(false);
    }, '.intro-button-2');
    defineTab('.intro-button-2','.intro-button-1', ()=>{
        setFocusToFullButton(true);
    });
    defineTab('.btn-refresh',()=>{
            setFocusToFullButton(false);
        },
        ()=>{
            setFocusToBack();
        }
    );
    defineTab('.setting-area-back',()=>{
        setFocusToBack(false)
    }, '.setting .start-number');
    defineTab('.setting .start-number','.setting-area-back', '.setting .input-div');
    defineTab('.setting .input-div','.setting .start-number', '.setting .unit-text');
    defineTab('.setting .unit-text','.setting .input-div', '.setting .number-select-box');
    defineTab('.setting .number-select-box','.setting .unit-text', '.canvas-back-1');
    defineTab('.setting .toggle-text','.canvas-back-1', '.milli-toggle');
    defineTab('.setting .milli-toggle','.setting .toggle-text', '.setting .btn-complete');
    defineTab('.setting .btn-complete','.setting .milli-toggle', '.setting .btn-close');
    defineTab('.setting .btn-close','.setting .btn-complete', ()=>{
        setFocusToFullButton(true);
    });

    defineTabMulti('.select_list_aria',(event)=>{
        const selectBox = event.currentTarget.parentElement;
        selectBox.querySelector('.select_list').classList.add('hide');
        selectBox.focus()
    }, (event)=>{
        const selectBox = event.currentTarget.parentElement;
        selectBox.querySelector('.select_list div').focus();
    });

    root.querySelectorAll('.select_list').forEach((list, index)=>{
        list.querySelectorAll('div').forEach((div, divIndex)=>{
            const parent = div.parentElement;
            if(divIndex === 0){
                const selectListArea = parent.parentElement.querySelector('.select_list_aria');
                defineTab(div,selectListArea, parent.querySelectorAll('div')[divIndex+1]);
            }else if(divIndex === 3 && (index===0 || index===1 || index===2) ){
                if(index === 0) {
                    defineTab(div,parent.querySelectorAll('div')[divIndex-1], ()=>{
                        parent.classList.add('hide');
                        root.querySelector('.canvas-back-1').focus();
                    });
                }else{
                    defineTab(div, parent.querySelectorAll('div')[divIndex-1], ()=>{
                        parent.classList.add('hide');
                        parent.parentElement.parentElement.querySelector('.quiz-row-txt').focus();
                    });
                }
            }else if(divIndex === 1 && (index===3 || index===4 || index===5 || index===6)){
                const ancestor = parent.parentElement.parentElement;
                const target = (index === 3 || index === 5) ? ancestor.querySelector('.input-div.second')
                    :index === 3 ? root.querySelector('.canvas-back-1')
                        :root.querySelector('.canvas-back-2');
                defineTab(div, parent.querySelectorAll('div')[divIndex-1], ()=>{
                    parent.classList.add('hide');
                    target.focus();
                });
            }else{
                defineTab(div,parent.querySelectorAll('div')[divIndex-1], parent.querySelectorAll('div')[divIndex+1]);
            }
        })
    })

    defineTab('.character',()=>{
        getPageState()===1
            ? focus('.setting .input-div')
            : null;
    }, '.popup-content');

    // 첫번째 문제 관련하여
    defineTab('.btn-back',()=>{
        setFocusToRefresh(false);
    }, ()=>{
        if(getPageState()===1){
            focus('.setting-area-back')
        }
        else if(getPageState()===2 || getPageState()===3){
            focus('.content .alt_box')
        }
    });
    defineTab('.content .alt_box',()=>{
        setFocusToBack(false)
    }, ()=>{
        if(getPageState()===2){
            focus('.quiz-1 .quiz-row-1 .input-div')
        }else if(getPageState()===3){
            focus('.quiz-2 .quiz-row-1 .input-div')
        }
    });
    defineTab('.quiz-1 .quiz-row-1 .input-div','.content .alt_box', '.quiz-1 .quiz-row-1 .number-select-box');
    defineTab('.quiz-1 .quiz-row-1 .number-select-box','.quiz-1 .quiz-row-1 .input-div', '.quiz-1 .quiz-row-1 .quiz-row-txt');
    defineTab('.quiz-1 .quiz-row-1 .quiz-row-txt','.quiz-1 .quiz-row-1 .number-select-box', '.canvas-back-1');
    defineTab('.quiz-1 .quiz-row-2 .input-div','.content .alt_box', '.quiz-1 .quiz-row-2 .number-select-box');
    defineTab('.quiz-1 .quiz-row-2 .number-select-box','.quiz-1 .quiz-row-2 .input-div', '.quiz-1 .quiz-row-2 .quiz-row-txt');
    defineTab('.quiz-1 .quiz-row-2 .quiz-row-txt','.quiz-1 .quiz-row-2 .number-select-box', '.canvas-back-2');

    // 두번째 문제
    defineTab('.quiz-2 .quiz-row-1 .number-select-box.first','.quiz-2 .quiz-row-1 .input-div.first', '.quiz-2 .quiz-row-1 .input-div.second');
    defineTab('.quiz-2 .quiz-row-1 .number-select-box.second','.quiz-2 .quiz-row-1 .input-div.second', '.canvas-back-1');
    defineTab('.quiz-2 .quiz-row-2 .number-select-box.first','.quiz-2 .quiz-row-2 .input-div.first', '.quiz-2 .quiz-row-2 .input-div.second');
    defineTab('.quiz-2 .quiz-row-2 .number-select-box.second','.quiz-2 .quiz-row-2 .input-div.second', '.canvas-back-2');
    root.querySelectorAll('.ruler-number-div').forEach((numbers, index)=>{
        numbers.querySelectorAll('.ruler-number').forEach((div, divIndex)=>{
            const canvasArea = root.querySelector(`.canvas-area-${index+1}`)
            if(divIndex === 0){
                defineTab(div,canvasArea.querySelector('.canvas-back'), canvasArea.querySelectorAll('.ruler-number')[divIndex+1]);
            }else if(divIndex === 10  && index === 0){
                // 이건 첫번째 캠바스 마지막 것
                defineTab(div,canvasArea.querySelectorAll('.ruler-number')[divIndex-1], ()=>{
                    const copyButton = canvasArea.querySelector('.btn-copy');
                    if(copyButton.style.visibility!=='hidden'){
                        copyButton.focus();
                    }else{
                        const canvas2 = root.querySelector('.canvas-area-2');
                        if(canvas2.classList.contains('hide')){
                            // 앞의 커피 버튼이 히든인데 canvas2 까지 히든인 것은 single 의 경우
                            setFocusToFullButton(true);
                        }else{
                            root.querySelector(`.quiz-${selectedMode} .quiz-row-2 .input-div`).focus();
                        }
                    }
                });
            }else if(divIndex === 10  && index === 1){
                defineTab(div,canvasArea.querySelectorAll('.ruler-number')[divIndex-1], ()=>{
                    const copyButton = canvasArea.querySelector('.btn-copy');
                    if(copyButton.style.visibility!=='hidden')
                        copyButton.focus();
                    else
                        setFocusToFullButton(true);
                });
            }else{
                defineTab(div,canvasArea.querySelectorAll('.ruler-number')[divIndex-1], canvasArea.querySelectorAll('.ruler-number')[divIndex+1]);
            }
        })
    })

    root.querySelectorAll('.quiz-row-2').forEach((row, index)=>{
        const target = row.querySelector('.input-div');
        defineTab(target,
            root.querySelector('.canvas-area-1 .ruler-number-div div:last-child'),
            null);
    })

    root.querySelectorAll('.quiz-2 .input-div.second').forEach((input, index)=>{
        const parent = input.parentElement;
        defineTab(input,
            parent.querySelector('.number-select-box.first'),
            null);
    })

    root.querySelectorAll('.circle-select div').forEach((div, index)=>{
        div.addEventListener('click', (event)=>{
            event.preventDefault();
            event.stopPropagation();
        })
        const module = index % 2;
        if(module === 0){
                defineTab(div,()=>{
                    div.parentElement.classList.add('hide');
                    focusAltBox();
                }, ()=>{
                    root.querySelectorAll('.circle-select div')[index+1].focus();
                });
        }else{
            defineTab(div,()=>{
                root.querySelectorAll('.circle-select div')[index-1].focus();
            }, ()=>{
                div.parentElement.classList.add('hide');
                focusAltBox();
            });
        }
    })
    root.querySelectorAll('.arrow').forEach((div, index)=>{
        div.addEventListener('click', (event)=>{
            event.preventDefault();
            event.stopPropagation();
        })
        const module = index % 2;
        let pairString = '';
        let boxString = '';
        if(div.classList.contains('arrow-left-1')){
            pairString = '.arrow-right-1';
            boxString = '.arrow-box-1';
        }
        else if(div.classList.contains('arrow-right-1')){
            pairString = '.arrow-left-1';
            boxString = '.arrow-box-1';
        }
        else if(div.classList.contains('arrow-left-2')){
            pairString = '.arrow-right-2';
            boxString = '.arrow-box-2';
        }
        else{
            pairString = '.arrow-left-2';
            boxString = '.arrow-box-2';
        }
        const pair = root.querySelector(pairString);
        const box = root.querySelector(boxString);
        const center = (pairString.indexOf('1') >= 0)
            ?root.querySelector('.arrow-center-1')
            :root.querySelector('.arrow-center-2');
        if(module === 0){
            defineTab(div,()=>{
                div.classList.add('hide');
                pair.classList.add('hide');
                center.classList.add('hide');
                box.classList.add('hide');
                focusAltBox();
            }, ()=>{
                if(center.classList.contains('hide'))
                    root.querySelectorAll('.arrow')[index+1].focus();
                else
                    center.focus();
            });
        }else{
            defineTab(div,()=>{
                if(center.classList.contains('hide'))
                    root.querySelectorAll('.arrow')[index-1].focus();
                else
                    center.focus();
            }, ()=>{
                div.classList.add('hide');
                pair.classList.add('hide');
                center.classList.add('hide');
                box.classList.add('hide');
                focusAltBox();
            });
        }
    })


    defineTab('.canvas-area-1 .btn-copy','.canvas-area-1 .ruler-number-div div:last-child', ()=>{
        setFocusToFullButton(true)
    });
    defineTab('.canvas-area-2 .btn-copy','.canvas-area-2 .ruler-number-div div:last-child', ()=>{
        setFocusToFullButton(true)
    });
    defineTab('.arrow-center-1','.arrow-left-1', '.arrow-right-1');
    defineTab('.arrow-center-2','.arrow-left-2', '.arrow-right-2');
    defineTab('.popup-content',()=>{
        focusAltBox();
    }, ()=>{
        focusAltBox();
    });
}