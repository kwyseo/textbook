import anime from "./anime.js";
//import qwerty from "./qwerty.js";
import numberPad from "./NumberPad.js";


const metaUrl = import.meta.url;
let root;
let scale = 1;  // 화면 스케일링 값
let isFalseButtonBlinking = false;
let isHintBlinking = false;
let tempTabRoute = false;

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen || document.msRequestFullscreen;
        announceAlert('전체 화면 켜져있는 상태입니다')
        requestFullScreen.call(root.firstElementChild);
    } else {
        // full screen 나가는 것
        announceAlert('전체 화면 꺼져있는 상태입니다')
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        cancelFullScreen.call(document);
    }
}

const onClickRefresh = (event) => {
    event.preventDefault();
    //event.stopPropagation(); 넘버 자판을 없애야 한다.
    const input = root.querySelector('.input');
    input.value = '';
    input.classList.remove('gray');
    root.querySelectorAll('.pencil').forEach((pencil, index) => {
        pencil.classList.remove('hide')
    })
    root.querySelector('.multiples-div-inner').classList.remove('deactivate');
    root.querySelector('.hint').classList.remove('blue');
    root.querySelector('.range-box').classList.remove('active');
    root.querySelectorAll('.range').forEach((range, index) => {
        range.classList.remove('active')
        range.classList.remove('cursor')
    })
    const buttonBox = root.querySelector('.button-box');
    buttonBox.classList.remove('active');
    buttonBox.querySelectorAll('.buttons').forEach((buttons, buttonsIndex) => {
        if (buttonsIndex === 0)
            buttons.classList.remove('hide')
        else
            buttons.classList.add('hide')
        buttons.classList.remove('complete');
    })
    buttonBox.querySelectorAll('.button').forEach((button) => {
        button.classList.remove('active');
        button.style.backgroundColor = "white";
        const overlay = button.querySelector('.overlay');
        overlay.style.backgroundColor = 'transparent';
    })
    setAriaLabel('.input-text', "일부터 이십까지의 숫자 값을 입력합니다");
    tempTabRoute = false;
    root.querySelector('.btn-green').style.visibility = 'hidden';
    const guideHand = root.querySelector('.guide_hand');
    guideHand.classList.add('hide');
    guideHand.classList.remove('right');
    root.querySelector('.popup').classList.add('hide');
    showPopup(3);
}

const handGuideAnimation = (isRight = false) => {
    const guideHand = root.querySelector('.guide_hand');
    if(isRight)
        guideHand.classList.add('right');
    else
        guideHand.classList.remove('right');
    guideHand.style.opacity = '0.0';
    guideHand.classList.remove('hide');
    const animation = anime.timeline({loop:2, complete:()=>{
            if(!guideHand.classList.contains('hide')) {
                //setTimeout(animation.restart, 3000);
                anime({
                    targets: guideHand,
                    opacity: [0, 0, 1],
                    duration: 500,
                    easing: 'linear',
                    loop: false
                });

            }
        }});
    animation.add({
            targets: guideHand,
            //delay: 12000,
            opacity: [0,1,1],
            duration: 1000,
            easing:"linear"
        }
    ).add({
            targets: guideHand,
            opacity: [1,0],
            duration: 1000,
            easing:"linear"
        }
    );
}

const blinkFalseButton = (button) => {
    // 반투명 사용하지 않는다고 한다.
    const overlay = button.querySelector('.overlay');
    isFalseButtonBlinking = true;
    const animation = anime.timeline({
        loop: 2, complete: (anim) => {
            anime({
                targets: button,
                easing: 'easeInOutQuad',
                duration: 500,
                backgroundColor: ['rgba(248,181,176)', 'rgba(230, 233, 240)'],
                complete: function (anim) {
                    // 바로 포커스를 옮겨달란다.
                    //root.querySelector('.section-border').focus();
                    isFalseButtonBlinking = false;
                }
            });
        }
    });
    animation.add({
            targets: button,
            easing: 'easeInOutSine',
            duration: 500,
            backgroundColor: ['rgb(248,181,176)', 'rgba(248, 106, 97)']
        }
    ).add({
            targets: button,
            easing: 'easeInOutSine',
            duration: 700,
            backgroundColor: ['rgba(248, 106, 97)', 'rgba(248,181,176)']
        }
    );
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

// 1부터 100까지 버튼
const onClickButton = (event, button, buttonsIndex) => {
    // enter 로도 클릭을 하니까... 체크해야 한다.
    if (!root.querySelector('.multiples-div .input').classList.contains('gray')) {
        return;
    }
    // 완성된 것의 버튼은 더 이상 반응하지 않는다.
    const buttons = root.querySelectorAll('.buttons')[buttonsIndex];

    if (buttons.classList.contains('complete'))
        return;
    if (isHintBlinking)
        return;
    if (isFalseButtonBlinking)
        return;
    const overlay = button.querySelector('.overlay');
    // rgba string
    const backgroundColor = window.getComputedStyle(overlay).backgroundColor;
    const opacity = backgroundColor.substring(0, backgroundColor.length - 1).split(',')[3];
    const multipleValue = root.querySelector('.input').value;
    const falseText = `${multipleValue}의 배수에 포함되지 않습니다`;
    const text = `${multipleValue}의 배수에 포함됩니다`;
    // 정답은 클릭을 죽였음으로...
    if (opacity.trim() !== '0') {
        announceAlert(falseText);
        return;
    }
    if (button.innerText % multipleValue === 0) {
        button.classList.add('active');
        button.style.backgroundColor = '#CFAFFF';
        // 음성을 들려 주어야 한다고 한다.
        announceAlert(text);
        // 이제 모두 클릭했는지 확인한다.
        let isComplete = true;
        const multipleValue = root.querySelector('.input').value;
        buttons.querySelectorAll('.button').forEach((button) => {
            if (button.innerText % multipleValue === 0 && !button.classList.contains('active'))
                isComplete = false;
        });
        // 모두 완료하였다면 처리한다.
        if (isComplete) {
            buttons.classList.add('complete');
            if (buttonsIndex < 2) {
                // 너무 빨리 화면이 바뀌니까 좀 이상하다. 딜레이를 준다.
                setTimeout(() => {
                    root.querySelectorAll('.range').forEach((range, rangeIndex) => {
                        if (rangeIndex <= buttonsIndex) {
                            range.classList.add('cursor');
                        } else if (rangeIndex === buttonsIndex + 1) {
                            // 자동 이동을 안하니까 active 를 넣지 않는다.
                            //range.classList.add('active');
                            range.classList.add('cursor');
                            // 포커스를 옮기는 것이 좋겠다.
                            root.querySelectorAll('.range').forEach((range, index) => {
                                if (rangeIndex === index)
                                    range.focus();
                            })
                        } else
                            range.classList.remove('active')
                    })
                    /* 나레이션이 나오는 것 때문에 자동이동에서 수동 이동으로 바꾸었다.
                    root.querySelectorAll('.buttons').forEach((element, elementIndex)=>{
                        if(elementIndex === buttonsIndex + 1) {
                            element.classList.remove('hide');
                        }
                        else
                            element.classList.add('hide')
                    })
                     */
                    // 손을 보여준다.
                    handGuideAnimation(buttonsIndex === 1);
                }, 300)
            } else {
                // 마지막 것이 완성된 경우
                showPopup(2, {focusFirst: true})
            }
        }
    } else {
        blinkFalseButton(button);
        // 네레이션을 들려 주어야 한다.
        announceAlert(falseText);
        root.querySelector('.section-border').focus();
    }
}

const onClickHint = (event, hint) => {
    event.preventDefault();
    if (!hint.classList.contains('blue'))
        return;
    if (isHintBlinking)
        return;
    const buttons = root.querySelector('.buttons:not(.hide)');
    const buttonList = [];
    // 오버레이를 사용하지 않는다고 한다...
    const overlayList = [];
    const multipleValue = root.querySelector('.input').value;
    buttons.querySelectorAll('.button').forEach((button) => {
        if (button.innerText % multipleValue === 0 && !button.classList.contains('active')) {
            buttonList.push(button);
            overlayList.push(button.querySelector('.overlay'))
        }
    });
    if (buttonList.length > 0) {
        isHintBlinking = true;
        const animation = anime.timeline({
            loop: 2, complete: (anim) => {
                isHintBlinking = false;
                /*
                overlayList.forEach((overlay) => {
                    overlay.style.backgroundColor = 'transparent';
                })
                 */
                buttonList.forEach((button) => {
                    button.style.backgroundColor = 'white';
                });
            }
        });
        animation.add({
                targets: buttonList,
                easing: 'easeInOutSine',
                duration: 500,
                backgroundColor: ['rgba(255,255, 255,1)', 'rgba(255, 248, 46,0.7)']
            }
        ).add({
                targets: buttonList,
                easing: 'easeInOutSine',
                duration: 500,
                backgroundColor: ['rgba(255, 248, 46, 0.7)', 'rgba(255,255, 255,1)']
            }
        );
    }
}

const setFocusToFullscreenBtn = () => {
    if (root.querySelector('.btn-fullscreen').style.display !== 'none') {
        root.querySelector('.btn-fullscreen').focus();
    } else {
        root.querySelector('.btn-refresh').focus();
    }
}

//숫자를 입력하여 주어진 수의 범위 내에서 배수를 찾아봐요.
const showPopup = (contentType, options) => {
    let content = '';
    let narration = '';
    if (contentType === 1) {
        content = `<div class="batang">1~20</div>&nbsp;사이의 수를 입력하세요.`;
        narration = `일과 이십 사이의 수를 입력하세요`;
    } else if (contentType === 2) {
        content = `<div class="batang">100</div>까지의 모든 배수를 찾았어요!`;
        narration = `100까지의 모든 배수를 찾았어요`;
    } else if (contentType === 3) {
        content = `<div class="batang">1~20</div>&nbsp;사이의 숫자를 입력하고,&nbsp;<div class="batang">100</div>까지의 배수를 찾아 보아요.`;
        narration = `일과 이십 사이의 숫자를 입력하고, 백까지의 배수를 찾아 보아요`;
    }else if (contentType === 4) {
        content = `입력한 수의 배수를 선택하세요.`;
        narration = `입력한 수의 배수를 선택하세요`;
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
    if (contentType === 2) {
        popup.style.opacity = 1;
    }else if (contentType === 3) {
        popup.style.opacity = 1;
        popup.responseClick = true;
    }else {
        const modalOverlay = root.querySelector('.modal-overlay');
        modalOverlay.classList.remove('hide');
        //modalOverlay.focus();
        setFocusToFullscreenBtn();
        const animation = anime.timeline({
            loop: 1, complete: () => {
                popup.classList.add('hide');
                root.querySelector('.modal-overlay').classList.add('hide');
                //if(isKeypadDisplayed)
                //    numberPad.classList.remove('hide')
                // 네레이션이 다 나오도록 시간을 주자.
                try {
                    if (options) {
                        if (options.deleteInput) {
                            options.deleteInput.value = '';
                            options.deleteInput.blur();
                            options.deleteInput.parentElement.querySelector('.pencil').classList.remove('hide');
                        }
                        if (options.focus) {
                            options.focus.focus();
                        }
                        if (options.focusFirst) {
                            setFocusToFullscreenBtn()
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
        animation.add({
                targets: popup,
                opacity: [0, 1, 1, 1, 1, 1, 1],
                duration: 3000,
                easing: "linear"
            }
        ).add({
                targets: popup,
                opacity: [1, 1, 1, 1, 0],
                duration: 1000,
                easing: "linear"
            }
        );
    }
}

const checkIpad = () => {
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
    if (result) {
        root.querySelector('.btn-fullscreen').style.display = 'none';
    }
}

const removeStartDim = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    root.querySelector('.start-dim').classList.add('hide');
    showPopup(3);
    setFocusToFullscreenBtn();
}

const onClickGreenButton = (event) => {
    const input = root.querySelector('.input');
    const currentValue = parseInt(input.value);
    // 버튼을 없앤다.
    root.querySelector('.btn-green').style.visibility = 'hidden';
    if (currentValue < 1 || currentValue > 20) {
        input.readOnly = true;
        const animation = anime.timeline({
            loop: 2, complete: () => {
                input.removeAttribute("readonly");
                input.value = "";
                input.style.color = '#222222'
                root.querySelectorAll('.pencil').forEach((pencil, index) => {
                    pencil.classList.remove('hide')
                });
                //input.focus();
            }
        });
        animation.add({
                targets: input,
                easing: 'easeInOutSine',
                duration: 500,
                color: ['rgba(34,34,34,0)', 'rgba(34,34,34,1)']
            }
        ).add({
                targets: input,
                easing: 'easeInOutSine',
                duration: 500,
                color: ['rgba(34,34,34,1)', 'rgba(34,34,34,0)']
            }
        );
        showPopup(1, {focusFirst: true});
        return;
    }
    // input 을 비활성화한다.
    input.classList.add('gray');
    root.querySelector('.multiples-div-inner').classList.add('deactivate');
    // 나머지 것들을 활성화
    root.querySelector('.hint').classList.add('blue');
    root.querySelector('.range-box').classList.add('active');
    root.querySelectorAll('.range').forEach((range, index) => {
        if (index === 0)
            range.classList.add('active')
        else
            range.classList.remove('active')
    })
    root.querySelector('.button-box').classList.add('active');
    setAriaLabel('.input-text', `${input.value}의 배수를 알아봅시다`)
    setTimeout(() => {
        root.querySelector('.input-text').focus();
    }, 150);
    //root.querySelector('.input-text').focus();
    tempTabRoute = true;
    showPopup(4);
}

//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화
//_____________________________________________________________________________________________________________________
const init = (env) => {
    const _autoScale = () => {
        const viewWarp = root.querySelector('.view-wrap');
        const wrap = root.querySelector('.wrap');
        const targetWidth = 1920;
        const targetHeight = 1020;
        viewWarp.style.maxHeight = root.innerHeight;
        wrap.style.minWidth = targetWidth + "px";
        wrap.style.minHeight = targetHeight + "px";
        const calculatedScaleWidth = viewWarp.offsetWidth / targetWidth * 100;
        const calculatedScaleHeight = viewWarp.offsetHeight / targetHeight * 100;
        scale = calculatedScaleWidth < calculatedScaleHeight ? calculatedScaleWidth : calculatedScaleHeight;
        wrap.style.transform = "scale(" + scale + "%)";
        // 뷰어 때문에 이짓을 한다.
        const rec = wrap.getBoundingClientRect();
        scale = rec.height / wrap.offsetHeight * 100;
        // fullscreen 에서 esc 누르는 것 때문에 사용한다.
        if (!document.fullscreenElement) {
            const btn = root.querySelector(".btn-fullscreen");
            btn.classList.remove('off');
        } else {
            const btn = root.querySelector(".btn-fullscreen");
            btn.classList.add('off');
        }
    };
    window.addEventListener("resize", _autoScale);
    _autoScale();
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
    checkIpad();

    const hint = root.querySelector('.hint');
    hint.onclick = (event) => {
        onClickHint(event, hint)
    }

    //
    root.querySelectorAll('.range').forEach((range, rangeIndex) => {
        range.onclick = (event) => {
            if (!range.classList.contains('cursor'))
                return;
            if (isHintBlinking)
                return;
            root.querySelector('.guide_hand').classList.add('hide');
            root.querySelectorAll('.range').forEach((range, index) => {
                if (rangeIndex === index)
                    range.classList.add('active')
                else
                    range.classList.remove('active')
            })
            root.querySelectorAll('.buttons').forEach((buttons, index) => {
                if (rangeIndex === index)
                    buttons.classList.remove('hide')
                else
                    buttons.classList.add('hide')
            })
        }
    })
    root.querySelectorAll('.buttons').forEach((buttons, buttonsIndex) => {
        const startTabIndex = 19;
        buttons.querySelectorAll('.button-line').forEach((buttonLine, buttonLineIndex) => {
            const startIndex = buttonsIndex * 30 + buttonLineIndex * 10;
            const endIndex = startIndex + 10;
            for (let i = startIndex; i < endIndex; i++) {
                let button = document.createElement("div");
                button.classList.add('button');
                button.innerText = String(i + 1);
                button.setAttribute('tabindex', String(i + startTabIndex));
                button.setAttribute('role', 'button');
                button.setAttribute('aria-label', String(i + 1));
                button.onclick = (event) => {
                    onClickButton(event, button, buttonsIndex);
                }
                const overlay = document.createElement("div");
                overlay.classList.add('overlay');
                button.appendChild(overlay);
                buttonLine.appendChild(button);
            }
        })
    })

    // 자판 만들기
    //qwerty.init(root, '.modal_qwerty');
    numberPad.init(root, '.modal_number_pad');

    const responseKeyPadEvent = (event, fromTab = false) => {
        if (fromTab) {
            // 일단 숫자 패드를 안보이게 한다.
            root.querySelector('.modal_number_pad').classList.add('hide');
        }
        const input = root.querySelector('.input');
        if (input.value.length < 1)
            return;
        // green 버튼을 보여준다.
        if (input.value.length > 0) {
            const btnGreen = root.querySelector('.btn-green');
            btnGreen.style.visibility = 'visible';
            btnGreen.focus();
        } else {
            root.querySelectorAll('.pencil').forEach((pencil, index) => {
                pencil.classList.remove('hide')
            });
            root.querySelector('.btn-green').style.visibility = 'hidden';
            if (fromTab) {
                showPopup(1, {focusFirst: true})
            }
        }
    }

    root.addEventListener('keyboardDismiss', (event) => {
        responseKeyPadEvent(event)
    })

    root.addEventListener('keyboardTabOut', (event) => {
        responseKeyPadEvent(event, true)
    })

    const btnFullscreen = root.querySelector(".btn-fullscreen");
    btnFullscreen.addEventListener('click', toggleFullScreen);
    btnFullscreen.onfocus = () => {
        tempTabRoute = false
    };
    const btnRefresh = root.querySelector(".btn-refresh");
    btnRefresh.addEventListener('click', onClickRefresh);
    btnRefresh.onfocus = () => {
        if (root.querySelector('.btn-fullscreen').style.display === 'none') {
            tempTabRoute = false;
        }
    };

    root.querySelector(".btn-green").addEventListener('click', onClickGreenButton);

    const input = root.querySelector("#multiple-input");

    input.onblur = (event) => {
        const pencil = input.parentElement.querySelector('.pencil');
        const numberPad = root.querySelector('.modal_number_pad');
        if (input.value.length > 0 || !numberPad.classList.contains('hide'))
            pencil?.classList.add('hide');
        else
            pencil?.classList.remove('hide');
    }

    input.onfocus = (event) => {
        numberPad.activate(input, 'multiples', (text) => {

        })
        const pencil = input.parentElement.querySelector('.pencil');
        pencil?.classList.add('hide');
    }
    input.onkeydown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            root.querySelector('.modal_number_pad').firstChild.focus();
        } else if (!/^[0-9]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Delete') {
            event.preventDefault(); // 숫자, 백스페이스, 화살표, 삭제키가 아닌 경우 입력 방지
        }
    }

    const multiplesDivInner = root.querySelector(".multiples-div-inner");
    multiplesDivInner.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const popup = root.querySelector('.popup');
        if(popup.responseClick){
            popup.responseClick = false;
            popup.classList.add('hide');
        }
        if (!input.classList.contains('gray'))
            input.focus();

    });

    root.querySelectorAll("input").forEach((element) => {
        element.addEventListener('keydown', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
    });

    const startDim = root.querySelector('.start-dim');
    startDim.addEventListener('click', (event) => {
        removeStartDim(event);
    })
    startDim.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === 'Tab') {
            removeStartDim(event);
        }
    })
    startDim.focus();

    initTab();
}
const initTab = () => {
    root.querySelectorAll('[tabindex]').forEach((tab) => {
        if (parseInt(tab.getAttribute('tabindex')) > 0) {
            tab.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    tab.click()
                    event.stopPropagation();
                }
            });
        }
    });
    defineTab('.btn-fullscreen', null, '.btn-refresh');
    defineTab('.btn-refresh', '.btn-fullscreen', '.hint');
    defineTab('.hint', '.btn-refresh', () => {
        if(tempTabRoute){
            focus('.section-border');
        }else{
            const btnGreen = root.querySelector('.btn-green');
            if(btnGreen.style.visibility!=='hidden')
                btnGreen.focus();
            else
                focus('.input-text')
        }
    });
    defineTab('.btn-green', '.hint', '.input-text');

    defineTab('.input-text', ()=>{
        const btnGreen = root.querySelector('.btn-green');
        if(btnGreen.style.visibility!=='hidden')
            btnGreen.focus();
        else
            root.querySelector('.hint').focus();
    }, () => {
        if(tempTabRoute){
            focus('.hint');
        }else{
            focus('.section-border')
        }
    });

    defineTab('.section-border', () => {
        tempTabRoute
            ? focus('.hint')
            : focus('.input-text')
    }, '.range-1');
    defineTab('.range-1', '.section-border', '.range-2');
    defineTab('.range-2', '.range-1', '.range-3');
    defineTab('.range-3', '.range-2', null);
    const endButtons = ['19', '48', '49', '78', '79', '118']
    endButtons.forEach((tabindexValue, index) => {
        root.querySelector(`[tabindex="${tabindexValue}"]`).addEventListener('keydown', (event) => {
            const page = Math.floor(index / 2) + 1;
            const isStart = index % 2 === 0;
            if ((event.key === 'Tab' && event.shiftKey && isStart)
                || (event.key === 'Tab' && !isStart)) {
                const target = root.querySelectorAll('.buttons')[page - 1];
                let selectExist = false;
                target.querySelectorAll('.button').forEach((button) => {
                    const overlay = button.querySelector('.overlay');
                    // rgba string
                    const backgroundColor = window.getComputedStyle(overlay).backgroundColor;
                    const opacity = backgroundColor.substring(0, backgroundColor.length - 1).split(',')[3];
                    if (button.classList.contains('active') || opacity.trim() !== '0') {
                        selectExist = true;
                    }
                })
                if (!selectExist || !isStart) {
                    event.preventDefault();
                    setFocusToFullscreenBtn();
                }
            }
        })
    })

}
const defineTab = (elementClass, beforeFunction, nextFunction) => {
    root.querySelector(elementClass).addEventListener('keydown', function (event) {
        if (event.key === 'Tab' && event.shiftKey) {
            if (!beforeFunction)
                return;
            event.preventDefault();
            if (typeof beforeFunction === 'string')
                root.querySelector(beforeFunction).focus();
            else
                beforeFunction();
        } else if (event.key === 'Tab') {
            if (!nextFunction)
                return;
            event.preventDefault();
            if (typeof nextFunction === 'string')
                root.querySelector(nextFunction).focus();
            else
                nextFunction();
        }
    });
}

const focus = (elementClass) => {
    root.querySelector(elementClass).focus();
}
const setAriaLabel = (elementClass, label) => {
    root.querySelector(elementClass).setAttribute('aria-label', label);
}
window.addEventListener("script-loaded", (env) => {
    if (root) return;
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');
    if (param && param !== env.detail.unique) return;
    root = env.detail.root;
    init(env);
    document.addEventListener('click', (event)=>{
        const popup = root.querySelector('.popup');
        if(popup.responseClick){
            popup.responseClick = false;
            popup.classList.add('hide');
        }
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
});
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화 끝
//______________________________________________________________________________________________________________________








