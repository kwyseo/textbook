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
    inputElement.focus();
}

const activate = (input, _name, cb) => {
    if(inputElement && inputElement !== input){
        callback(inputElement.value);
        inputElement = null;
    }
    qwerty.style.display = "block";
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
    if(qwerty.style.display !== 'none') {
        const keyboardDismiss = new CustomEvent('keyboardDismiss', {
            detail: {
                time: new Date(),
            },
        });
        root.dispatchEvent(keyboardDismiss);
    }
    qwerty.style.display = "none";
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
        qwerty.appendChild(div);
    }
}

export default {init, activate, remove}
