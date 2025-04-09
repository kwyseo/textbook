import anime from "./anime.js";
import {
    createTabRule,
    focus,
    setAriaLabel,
    defineTab,
    setFocusToFullButton
} from "./tab.js";

const metaUrl = import.meta.url;
let root;
let scale = 1;  // 화면 스케일링 값
let isAnimating = false;

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen || document.msRequestFullscreen;
        setAriaLabel('.btn-fullscreen', '전체 화면 켜져있는 상태입니다');
        requestFullScreen.call(root.firstElementChild);
    } else {
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        setAriaLabel('.btn-fullscreen', '전체 화면 꺼져있는 상태입니다');
        cancelFullScreen.call(document);
    }
}

const onClickRefresh = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const buttons = root.querySelectorAll('.button');
    buttons[0].classList.remove('off');
    buttons[1].classList.add('off');
    const drawBoxes = root.querySelectorAll('.draw-box');
    drawBoxes[0].classList.remove('hide');
    drawBoxes[1].classList.add('hide');
    root.querySelectorAll('.triangle-box').forEach((box) => {
        box.classList.remove('hide');
    });
    root.querySelectorAll('.triangle_piece').forEach((piece) => {
        piece.classList.add('hide');
        piece.style.transform = null;
    });
    root.querySelectorAll('.scissors').forEach((scissors) => {
        scissors.classList.remove('hide');
    });
    root.querySelectorAll('.click-bar').forEach((bar) => {
        bar.classList.remove('hide');
    });
    root.querySelectorAll('.complete-box').forEach((box) => {
        box.classList.add('hide');
    });
    setScaffoldingText(1);
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    if (result) {
        root.querySelector('.btn-fullscreen').classList.add('hide');
        return true;
    }
    return false;
}

const onClickButton = (event, index) => {
    const buttons = root.querySelectorAll('.button');
    if (!buttons[index].classList.contains('off'))
        return;
    const opponentNumber = index === 1 ? 0 : 1;
    const drawBoxes = root.querySelectorAll('.draw-box');
    buttons[index].classList.remove('off');
    buttons[opponentNumber].classList.add('off');
    drawBoxes[index].classList.remove('hide');
    drawBoxes[opponentNumber].classList.add('hide');
    // 도형이 완성되었는지 확인해서 scaffolding 내용도 바꾸어 주어야 한다.
    let isComplete = true;
    drawBoxes[index].querySelectorAll('.click-bar').forEach((bar) => {
        if (!bar.classList.contains('hide'))
            isComplete = false;
    })
    if (isComplete)
        setScaffoldingText(2);
    else
        setScaffoldingText(1);
}
const setScaffoldingText = (type, setFocus = false) => {
    const text = type === 1
        ? '<div aria-hidden="true">점선 또는 가위를 클릭하여 삼각형을 잘라 보세요.</div>'
        : '<div aria-hidden="true">삼각형을 잘라 만든 평행사변형의 넓이를 구해 보세요.</div>';
    const ariaLabel = type === 1
        ? '점선 또는 가위를 클릭하여 삼각형을 잘라 보세요'
        : '삼각형을 잘라 만든 평행사변형의 넓이를 구해 보세요';
    const contentDiv = root.querySelector('.scaffolding-content');
    contentDiv.innerHTML = text;
    if (type === 1) {
        contentDiv.classList.add('explain');
        contentDiv.classList.remove('complete');
    } else {
        contentDiv.classList.add('complete');
        contentDiv.classList.remove('explain');
    }
    setAriaLabel(contentDiv, ariaLabel);
    if (setFocus) {
        setTimeout(() => {
            contentDiv.focus();
        }, 10)
    }
}

const diagramArrange = () =>{
    const aboveLeft = root.querySelector('.diagram_above_left');
    const aboveRight = root.querySelector('.diagram_above_right');
    const belowLeft = root.querySelector('.diagram_below_left');
    const belowRight = root.querySelector('.diagram_below_right');
    anime({
        targets: [aboveLeft],
        translateX: 13,
        translateY: 100,
        duration: 1000,
        easing: 'easeInOutQuad'
    });
    anime({
        targets: [aboveRight],
        translateX: 7,
        translateY: 100,
        duration: 1000,
        easing: 'easeInOutQuad'
    });
    anime({
        targets: [belowRight],
        translateX: -417,
        translateY: -115,
        duration: 1000,
        easing: 'easeInOutQuad'
    });
    anime({
        targets: [belowLeft],
        translateX: 437,
        translateY: -115,
        duration: 1000,
        easing: 'easeInOutQuad',
        complete:()=>{isAnimating = false;}
    });
}

const moveScissorsHorizontal = (scissors) => {
    const originLeft = scissors.offsetLeft;
    let tempLeft = originLeft;
    const _smoothHorizontalMove = () => {
        tempLeft -= 3;
        scissors.style.left = `${tempLeft}px`;
        if (tempLeft > originLeft - 1060) {
            requestAnimationFrame(_smoothHorizontalMove);
        } else {
            anime({
                targets: scissors,
                opacity: [1, 0],
                duration: 1000,
                easing: 'easeInOutQuad',
                complete: () => {
                    scissors.classList.add('hide');
                    scissors.style.opacity = '1.0';
                    scissors.style.left = `${originLeft}px`;
                    root.querySelector('.click-bar-horizontal').classList.add('hide');
                }
            });
            // 이제 도형을 움직여 준다.
            const scissors2 = root.querySelector('.scissors.vertical');
            const above = root.querySelector('.diagram_above');
            const below = root.querySelector('.diagram_below');
            const aboveLeft = root.querySelector('.diagram_above_left');
            const aboveRight = root.querySelector('.diagram_above_right');
            const belowLeft = root.querySelector('.diagram_below_left');
            const belowRight = root.querySelector('.diagram_below_right');
            if (!scissors2.classList.contains('hide')) {
                above.classList.remove('hide');
                below.classList.remove('hide');
                anime({
                    targets: [above, aboveLeft, aboveRight],
                    translateY: -10,
                    duration: 1000,
                    easing: 'easeInOutQuad'
                });
                anime({
                    targets: [below, belowLeft, belowRight],
                    translateY: 10,
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    complete: () => {
                        isAnimating = false;
                    }
                });
                root.querySelector('.draw-box').classList.add('hide');
            } else {
                aboveLeft.classList.remove('hide');
                aboveRight.classList.remove('hide');
                belowLeft.classList.remove('hide');
                belowRight.classList.remove('hide');
                root.querySelector('.diagram_right').classList.add('hide');
                root.querySelector('.diagram_left').classList.add('hide');
                const animation = anime.timeline({
                    complete: () => {}
                });
                animation.add({
                        targets: [aboveLeft, aboveRight],
                        translateY: -10,
                        duration: 1000,
                        easing: "easeInOutQuad"
                    }
                );

                const animation2 = anime.timeline({
                    complete: () => {
                        diagramArrange();
                    }
                });

                animation2.add({
                        targets: [belowLeft, belowRight],
                        translateY: 10,
                        duration: 1000,
                        easing: "easeInOutQuad"
                    }
                ).add({
                        targets: [belowRight],
                        translateX: -440,
                        translateY: -225,
                        duration: 1000,
                        easing: "easeInOutQuad"
                    }
                ).add({
                        targets: [belowLeft],
                        translateX: 440,
                        translateY: -225,
                        duration: 1000,
                        easing: "easeInOutQuad"
                    }
                );
            }
        }
    }
    _smoothHorizontalMove();
}

const onClickHorizontalScissors = (event) => {
    event.preventDefault();
    if (isAnimating)
        return;
    isAnimating = true;
    moveScissorsHorizontal(event.currentTarget)
}
const moveScissorsVertical = (scissors, index) => {
    const originTop = scissors.offsetTop;
    let tempTop = originTop;
    const _smoothVerticalMove = () => {
        tempTop -= 3;
        scissors.style.top = `${tempTop}px`;
        if (tempTop > originTop - 620) {
            requestAnimationFrame(_smoothVerticalMove);
        } else {
            anime({
                targets: scissors,
                opacity: [1, 0],
                duration: 1000,
                easing: 'easeInOutQuad',
                complete: () => {
                    scissors.classList.add('hide');
                    scissors.style.opacity = '1.0';
                    scissors.style.top = `${originTop}px`;
                    root.querySelector('.click-bar-vertical').classList.add('hide');
                }
            });
            // 이제 도형을 움직여 준다.
            const scissors1 = root.querySelector('.scissors.horizontal');
            const left = root.querySelector('.diagram_left');
            const right = root.querySelector('.diagram_right');
            const aboveLeft = root.querySelector('.diagram_above_left');
            const aboveRight = root.querySelector('.diagram_above_right');
            const belowLeft = root.querySelector('.diagram_below_left');
            const belowRight = root.querySelector('.diagram_below_right');
            if (!scissors1.classList.contains('hide')) {
                left.classList.remove('hide');
                right.classList.remove('hide');
                anime({
                    targets: [left, aboveLeft, belowLeft],
                    translateX: -10,
                    duration: 1000,
                    easing: 'easeInOutQuad'
                });
                anime({
                    targets: [right, aboveRight, belowRight],
                    translateX: 10,
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    complete: () => {
                        isAnimating = false;
                    }
                });
                root.querySelector('.draw-box').classList.add('hide');
            } else {
                aboveLeft.classList.remove('hide');
                aboveRight.classList.remove('hide');
                belowLeft.classList.remove('hide');
                belowRight.classList.remove('hide');
                root.querySelector('.diagram_above').classList.add('hide');
                root.querySelector('.diagram_below').classList.add('hide');

                const animation = anime.timeline({
                    complete: () => {}
                });
                animation.add({
                        targets: [aboveLeft, belowLeft],
                        translateX: -10,
                        duration: 1000,
                        easing: "easeInOutQuad"
                    }
                );

                const animation2 = anime.timeline({
                    complete: () => {
                        diagramArrange();
                    }
                });

                animation2.add({
                        targets: [aboveRight, belowRight],
                        translateX: 10,
                        duration: 1000,
                        easing: "easeInOutQuad"
                    }
                ).add({
                        targets: [belowRight],
                        translateX: -440,
                        translateY: -225,
                        duration: 1000,
                        easing: "easeInOutQuad"
                    }
                ).add({
                        targets: [belowLeft],
                        translateX: 440,
                        translateY: -225,
                        duration: 1000,
                        easing: "easeInOutQuad"
                    }
                );
            }
        }
    }
    _smoothVerticalMove();
}

const onClickVerticalScissors = (event, index) => {
    event.preventDefault();
    if (isAnimating)
        return;
    isAnimating = true;
    moveScissorsVertical(event.currentTarget, index)
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
    const _autoScale = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        const viewWarp = root.querySelector('.view-wrap');
        const wrap = root.querySelector('.wrap');
        const targetWidth = 1920;
        const targetHeight = 1020;
        wrap.style.minWidth = targetWidth + "px";
        wrap.style.minHeight = targetHeight + "px";
        const calculatedScaleWidth = viewWarp.offsetWidth / targetWidth * 100;
        const calculatedScaleHeight = viewWarp.offsetHeight / targetHeight * 100;
        scale = calculatedScaleWidth < calculatedScaleHeight ? calculatedScaleWidth : calculatedScaleHeight;
        wrap.style.transform = "scale(" + scale + "%)";
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
    // 삼성 브라우져 때문에 넣는다.
    setTimeout(() => {
        _autoScale();
    }, 1);
    // 자판 만들기, 이거 활성화하면 checkbox 와 충돌한다. 피할려면 click 이벤트에서 window 로 이벤트 안가게 잡아준다.
    //qwerty.init(root, '.modal_qwerty');

    root.querySelector(".btn-fullscreen").addEventListener('click', toggleFullScreen);
    root.querySelector(".btn-refresh").addEventListener('click', onClickRefresh);
    const startDim = root.querySelector('.start-dim');
    startDim.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('hide');
        setFocusToFullButton();
    })

    startDim.addEventListener('keydown', (event) => {
        // Enter 는 nvda+space 를 눌러서 포커스모드로 바꿔야 한다.
        if (event.key === 'Tab' || event.key === 'Enter') {
            if (!root.querySelector('.start-dim').classList.contains('hide')) {
                event.preventDefault();
                event.stopPropagation();
                root.querySelector('.start-dim').classList.add('hide');
                setFocusToFullButton();
            }
        }
    })

    root.querySelector('.scissors.horizontal').addEventListener('click', onClickHorizontalScissors);
    root.querySelectorAll('.scissors.vertical').forEach((scissors, index) => {
        scissors.addEventListener('click', (event) => {
            onClickVerticalScissors(event, index);
        })
    })

    root.querySelector('.click-bar-horizontal').addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        root.querySelector('.scissors.horizontal').click();
    });
    root.querySelectorAll('.click-bar-vertical').forEach((bar, index) => {
        bar.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            root.querySelectorAll('.scissors.vertical')[index].click();
        })
    })
}

window.addEventListener("script-loaded", (env) => {
    if (root) return;
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');
    if (param && param !== env.detail.unique) return;
    root = env.detail.root;
    checkIpad(root);
    //createTabRule(root); // 주의: init 보다 앞에 있어야 한다.
    init(env);
    //root.querySelector('.start-dim').focus();
});
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화 끝
//______________________________________________________________________________________________________________________








