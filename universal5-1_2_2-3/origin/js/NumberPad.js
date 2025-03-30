const layOut = ["1","2","3","4","5","6","7","8","9","0"]
let qwerty;
let callback;
let inputElement;
let root;

const onClick = (event, i) => {
    event.preventDefault();
    event.stopPropagation();
    inputElement.value += layOut[i];
    const inputEvent = new Event('input');
    inputElement.dispatchEvent(inputEvent);
    //inputElement.focus();
}

const activate = (input, _name, cb) => {
    if(inputElement && inputElement !== input){
        callback(inputElement.value);
        inputElement = null;
    }
    //qwerty.style.display = "block";
    qwerty.classList.remove('hide');
    input.style.display = "block";
    input.focus();
    if (typeof input.selectionStart == "number") {
        input.selectionStart = input.selectionEnd = input.value.length;
    }
    inputElement = input;
    name = _name;
    callback = cb;
}

const remove = () => {
    if(inputElement) {
        callback(inputElement.value);
        inputElement = null;
    }
    if(!qwerty.classList.contains('hide')) {
        const keyboardDismiss = new CustomEvent('keyboardDismiss', {
            detail: {
                time: new Date(),
            },
        });
        root.dispatchEvent(keyboardDismiss);
    }
    qwerty.classList.add('hide');
}

const init = (documentRoot, target) => {
    root = documentRoot;
    qwerty = documentRoot.querySelector(target);
    qwerty.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
    });
    documentRoot.addEventListener("click", (event) => {
        event.preventDefault();
        remove();
    });
    let marginStartLeft = 35;
    let marginLeft = 140.5;
    let marginStartTop = 19;
    for(let i = 0; i < 10; i++) {
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.width = "120px";
        div.style.height = "120px";
        div.style.top = `${marginStartTop}px`;
        div.style.left = `${marginStartLeft + i*marginLeft}px`;
        div.style.cursor = "pointer";
        div.onclick = (event) => onClick(event, i);
        div.setAttribute('tabindex', String(i + 6));
        div.setAttribute('role', 'button');
        if(i===9){
            div.setAttribute('aria-label', '영');
        }else{
            div.setAttribute('aria-label', String(i + 1));
        }
        qwerty.appendChild(div);
        const keyboardTabOut = new CustomEvent('keyboardTabOut', {
            detail: {
                time: new Date(),
            },
        });
        if(i===0){
            div.addEventListener('keydown', function(event) {
                if (event.key === 'Tab' && event.shiftKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    root.dispatchEvent(keyboardTabOut);
                }
            });
        }else if(i===9){
            div.addEventListener('keydown', function(event) {
                if (event.key === 'Tab') {
                    event.preventDefault();
                    event.stopPropagation();
                    root.dispatchEvent(keyboardTabOut);
                }
            });
        }
    }
}

export default {init, activate, remove}
