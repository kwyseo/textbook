import anime from "./anime.js";
//import qwerty from "./qwerty.js";
import numberPad from "./NumberPad.js";


const metaUrl = import.meta.url;
let root;
let scale = 1;  // 화면 스케일링 값
let isBlinking = false;
let isHintBlinking = false;

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        const requestFullScreen = document.documentElement.requestFullscreen || document.mozRequestFullScreen || document.webkitRequestFullScreen || document.msRequestFullscreen;
        requestFullScreen.call(root.firstElementChild);
    }else{
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        cancelFullScreen.call(document);
    }
}

const onClickRefresh = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const input = root.querySelector('.input');
    input.value = '';
    input.classList.remove('gray');
    root.querySelector('.multiples-div').classList.remove('deactivate');
    root.querySelector('.hint').classList.remove('blue');
    root.querySelector('.range-box').classList.remove('active');
    root.querySelectorAll('.range').forEach((range, index)=>{
        range.classList.remove('active')
        range.classList.remove('cursor')
    })
    const buttonBox =root.querySelector('.button-box');
    buttonBox.classList.remove('active');
    buttonBox.querySelectorAll('.buttons').forEach((buttons, buttonsIndex)=>{
        if(buttonsIndex === 0)
            buttons.classList.remove('hide')
        else
            buttons.classList.add('hide')
        buttons.classList.remove('complete');
    })
    buttonBox.querySelectorAll('.button').forEach((button)=>{
        button.classList.remove('active');
        button.style.backgroundColor = "white";
        const overlay = button.querySelector('.overlay');
        overlay.style.backgroundColor = 'transparent';
    })
}

const blinkFalseButton = (button)=>{
    const overlay = button.querySelector('.overlay');
    const animation = anime.timeline({loop:2, complete:(anim)=>{
            anime({
                targets: overlay,
                easing: 'easeInOutQuad',
                duration: 500,
                backgroundColor: ['rgba(128,128,128,0.2)', 'rgba(128,128,128,0.7)']
            });
        }});
    animation.add({
            targets: overlay,
            easing: 'easeInOutSine',
            duration: 500,
            backgroundColor: ['rgba(255,0,0,0.15)', 'rgba(255,0,0,0.7)']
        }
    ).add({
            targets: overlay,
            easing: 'easeInOutSine',
            duration: 500,
            backgroundColor: ['rgba(255,0,0,0.7)', 'rgba(255,0,0,0.15)']
        }
    );
}

const onClickButton = (event, button, buttonsIndex)=>{
    // 완성된 것의 버튼은 더 이상 반응하지 않는다.
    const buttons = root.querySelectorAll('.buttons')[buttonsIndex];
    if(buttons.classList.contains('complete'))
        return;
    if(isHintBlinking)
        return;
    const overlay = button.querySelector('.overlay');
    // rgba string
    const backgroundColor = window.getComputedStyle(overlay).backgroundColor;
    const opacity = backgroundColor.substring(0, backgroundColor.length-1).split(',')[3];
    if(opacity.trim()!=='0')
        return;
    const multipleValue = root.querySelector('.input').value;
    if(button.innerText % multipleValue === 0){
        button.classList.add('active');
        button.style.backgroundColor = '#CFAFFF';
        // 이제 모두 클릭했는지 확인한다.
        let isComplete = true;
        const multipleValue = root.querySelector('.input').value;
        buttons.querySelectorAll('.button').forEach((button)=>{
            if(button.innerText % multipleValue === 0 && !button.classList.contains('active'))
                isComplete = false;
        });
        // 모두 완료하였다면 처리한다.
        if(isComplete){
            buttons.classList.add('complete');
            if(buttonsIndex < 2){
                // 너무 빨리 화면이 바뀌니까 좀 이상하다. 딜레이를 준다.
                setTimeout(()=>{
                    root.querySelectorAll('.range').forEach((range, rangeIndex)=>{
                        if(rangeIndex === 0)
                            range.classList.add('cursor');
                        if(rangeIndex === buttonsIndex + 1) {
                            range.classList.add('active');
                            range.classList.add('cursor');
                        }
                        else
                            range.classList.remove('active')
                    })
                    root.querySelectorAll('.buttons').forEach((element, elementIndex)=>{
                        if(elementIndex === buttonsIndex + 1)
                            element.classList.remove('hide')
                        else
                            element.classList.add('hide')
                    })
                }, 300)
            }else{
                // 마지막 것이 완성된 경우
                showPopup(`<div class="batang">100</div>까지의 모든 배수를 찾았어요!`)
            }
        }
    }else{
        blinkFalseButton(button);
    }
}

const onClickHint = (event, hint) => {
    event.preventDefault();
    if(!hint.classList.contains('blue'))
        return;
    if(isHintBlinking)
        return;
    const buttons = root.querySelector('.buttons:not(.hide)');
    const buttonList = [];
    const multipleValue = root.querySelector('.input').value;
    buttons.querySelectorAll('.button').forEach((button)=>{
        if(button.innerText % multipleValue === 0 && !button.classList.contains('active'))
            buttonList.push(button);
    });
    if(buttonList.length > 0){
        isHintBlinking = true;
        const animation = anime.timeline({loop:3, complete:(anim)=>{
                buttonList.forEach((element)=>{
                    element.style.backgroundColor = 'white';
                })
                isHintBlinking = false;
            }});
        animation.add({
                targets: buttonList,
                easing: 'easeInOutSine',
                duration: 500,
                backgroundColor: ['rgba(255,255,0,0.15)', 'rgba(255,255,0,1)']
            }
        ).add({
                targets: buttonList,
                easing: 'easeInOutSine',
                duration: 500,
                backgroundColor: ['rgba(255,255,0,1)', 'rgba(255,255,0,0.15)']
            }
        );
    }
}

const showPopup = (content)=>{
    const popup = root.querySelector('.popup');
    const popupContent = popup.querySelector('.popup-content');
    popupContent.innerHTML = content;
    popup.style.opacity = 0;
    popup.classList.remove('hide');
    const animation = anime.timeline({loop:1, complete:()=>{
            popup.classList.add('hide');
        }});
    animation.add({
            targets: popup,
            opacity: [0,1,1,1,1,1,1],
            duration: 1500,
            easing:"linear"
        }
    ).add({
            targets: popup,
            opacity: [1,1,1,1,0],
            duration: 500,
            easing:"linear"
        }
    );
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
    if(result) {
        root.querySelector('.btn-fullscreen').style.display = 'none';
    }
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
        scale = calculatedScaleWidth < calculatedScaleHeight ? calculatedScaleWidth: calculatedScaleHeight;
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
    };
    window.addEventListener("resize", _autoScale);
    _autoScale();
    // 새도우돔은 font-face 가 작동하지 않아서 넣는다.
    const sheets = root.styleSheets;
    const style = sheets[sheets.length -1];
    let href = style.href;
    href = href.substring(0, href.indexOf('/css'));
    for(let i = 0; i < style.cssRules.length; i++){
        const rule = style.cssRules[i];
        if(rule.cssText && rule.cssText.indexOf("@font-face")>=0){
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
    hint.onclick = (event)=>{ onClickHint(event, hint)}

    // 버튼을 만든다.
    root.querySelectorAll('.range').forEach((range, rangeIndex)=>{
        range.onclick = (event) => {
            if(!range.classList.contains('cursor'))
                return;
            if(isHintBlinking)
                return;
            root.querySelectorAll('.range').forEach((range, index)=>{
                if(rangeIndex === index)
                    range.classList.add('active')
                else
                    range.classList.remove('active')
            })
            root.querySelectorAll('.buttons').forEach((buttons, index)=>{
                if(rangeIndex === index)
                    buttons.classList.remove('hide')
                else
                    buttons.classList.add('hide')
            })
        }
    })
    root.querySelectorAll('.buttons').forEach((buttons, buttonsIndex)=>{
        buttons.querySelectorAll('.button-line').forEach((buttonLine, buttonLineIndex)=>{
            const startIndex = buttonsIndex*30 + buttonLineIndex*10;
            const endIndex = startIndex + 10;
            for(let i = startIndex; i < endIndex; i++){
                let button = document.createElement("div");
                button.classList.add('button');
                button.innerText = String(i + 1);
                button.onclick = (event)=>{
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
    root.addEventListener('keyboardDismiss', (event)=>{
        if(isBlinking)
            return;
        const input =  root.querySelector('.input');
        if(input.value.length > 0){
            // input 을 비활성화한다.
            input.classList.add('gray');
            root.querySelector('.multiples-div').classList.add('deactivate');
            // 나머지 것들을 활성화
            root.querySelector('.hint').classList.add('blue');
            root.querySelector('.range-box').classList.add('active');
            root.querySelectorAll('.range').forEach((range, index)=>{
                if(index === 0)
                    range.classList.add('active')
                else
                    range.classList.remove('active')
            })
            root.querySelector('.button-box').classList.add('active');
        }
    })
    root.querySelector(".btn-fullscreen").addEventListener('click', toggleFullScreen);
    root.querySelector(".btn-refresh").addEventListener('click', onClickRefresh);
    const input = root.querySelector("#multiple-input");
    input.onfocus = (event)=>{
        numberPad.activate(input, 'multiples', (text)=>{

        })
    }

    input.oninput = (event) => {
        if(event.target.value.length < 1)
            return;
        const currentValue = parseInt(event.target.value);
        if(currentValue < 1 || currentValue > 20){
            input.readOnly = true;
            isBlinking = true;
            const animation = anime.timeline({loop:2, complete:()=>{
                    input.removeAttribute("readonly");
                    input.value = "";
                    input.style.color = '#222222'
                    isBlinking = false;
                    input.focus();
                }});
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
            showPopup(`<div class="batang">1~20</div>&nbsp;사이의 수를 입력하세요.`)
        }
    }
    root.querySelector(".multiples-div").addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();
        if(!input.classList.contains('gray'))
            input.focus();

    });
    root.querySelectorAll("input").forEach((element)=>{
        element.addEventListener('keydown', (event)=>{
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
    });
}

window.addEventListener("script-loaded",(env)=>{
    if(root) return;
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');
    if(param && param !== env.detail.unique) return;
    root = env.detail.root;
    init(env);
});
//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// 로딩 시 초기화 끝
//______________________________________________________________________________________________________________________








