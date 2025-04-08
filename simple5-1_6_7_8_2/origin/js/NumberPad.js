const layOut = ["1","2","3","4","5","6","7","8","9","0"]
let qwerty;
let callback;
let inputElement;

const onClick = (event, i) => {
    event.preventDefault();
    event.stopPropagation();
    inputElement.value += layOut[i];
}

const activate = (input, _name, cb) => {
    if(inputElement && inputElement !== input){
        callback(inputElement.value);
        inputElement.style.readOnly = true;
    }
    qwerty.style.display = "block";
    input.style.display = "block";
    input.removeAttribute("readonly");
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
        inputElement.style.readOnly = true;
    }
    qwerty.style.display = "none";
}

const init = (documentRoot, target) => {
    qwerty = documentRoot.querySelector(target);
    qwerty.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
    });
    window.addEventListener("click", (event) => {
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
