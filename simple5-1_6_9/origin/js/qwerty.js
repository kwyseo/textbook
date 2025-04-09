import mapping from "./KoEnMapper.js";
const normal = ["ㅂ","ㅈ","ㄷ","ㄱ","ㅅ","ㅛ","ㅕ","ㅑ","ㅐ","ㅔ",""];
const shift = ["ㅃ","ㅉ","ㄸ","ㄲ","ㅆ","ㅛ","ㅕ","ㅑ","ㅒ","ㅖ",""];
let layOut = ["1","2","3","4","5","6","7","8","9","0","",
    "ㅂ","ㅈ","ㄷ","ㄱ","ㅅ","ㅛ","ㅕ","ㅑ","ㅐ","ㅔ","",
    "ㅁ","ㄴ","ㅇ","ㄹ","ㅎ","ㅗ","ㅓ","ㅏ","ㅣ","",
    "","ㅋ","ㅌ","ㅊ","ㅍ","ㅠ","ㅜ","ㅡ",",",".","",
    "",""," ","","","",];


let qwerty;
let callback;
let inputElement;
let name;

const onClickEnter = () => {
    if(!inputElement)
        return;
    qwerty.style.display = "none";
    if(inputElement.value.length < 1)
        inputElement.style.display = "none";
    else
        inputElement.readOnly = true;
    inputElement = null;
    callback('', true);
}
const onClickShift = () => {
    if(qwerty.querySelector(".qbutton32").classList.contains("shift")){
        qwerty.querySelector(".qbutton32").classList.remove("shift");
        qwerty.querySelector(".qbutton42").classList.remove("shift");
        for (var i = 11; i < 21; i++) {
            qwerty.querySelector(`.qbutton${i}`).classList.remove("shift");
        }
        layOut = [...layOut.slice(0, 11),...normal, ...layOut.slice(22)];
    }else {
        qwerty.querySelector(".qbutton32").classList.add("shift");
        qwerty.querySelector(".qbutton42").classList.add("shift");
        for (var i = 11; i < 21; i++) {
            qwerty.querySelector(`.qbutton${i}`).classList.add("shift");
        }
        layOut = [...layOut.slice(0, 11),...shift, ...layOut.slice(22)];
    }
}

const onClick = (event, i) => {
    event.preventDefault();
    event.stopPropagation();
    // 엔터 키
    if(i===31 && qwerty) {
        onClickEnter();
    }
    else if(i === 32 || i === 42){
        onClickShift();
    }
    else{
        let en = mapping.convKo2En(inputElement.value);
        if(i === 21){ // backspace
            inputElement.value = mapping.convEn2Ko(en.slice(0, -1));
        }else if(i === 47){
            // 왼쪽으로 커서 이동
        }else if(i === 48){
            // 오른쪽으로 커서 이동
        }else{
            en += mapping.convKo2En(layOut[i]);
            inputElement.value = mapping.convEn2Ko(en);
        }
        callback(inputElement.value);
        if(qwerty.querySelector(".qbutton32").classList.contains("shift")){
            onClickShift();
        }
    }
}

const remove = () => {
    onClickEnter();
}

const activate = (input, _name, cb, top=0, left=0) => {
    if(inputElement === input)
        return;
    if(inputElement){
        onClickEnter();
    }
    qwerty.style.display = "block";
    input.style.display = "block";
    input.removeAttribute("readonly");
    if (typeof input.selectionStart == "number") {
        input.selectionStart = input.selectionEnd = input.value.length;
    }
    input.focus();
    inputElement = input;
    name = _name;
    callback = cb;
    if(top ===0)
        qwerty.style.top = "500px";
    else
        qwerty.style.top = top+"px";
    if(left === 0)
        qwerty.style.left = "400px";
    else
        qwerty.style.left = left + "px";

}

const init = (documentRoot, target) => {
    qwerty = documentRoot.querySelector(target);
    qwerty.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
    });
    window.addEventListener("click", (event) => {
        event.preventDefault();
        onClickEnter();
    });
    let marginStartLeft = 37;
    let marginLeft = 96;
    let marginStartTop = 20;
    let height = 95;
    let indent = 0;
    // 첫번째 줄
    for(let i = 0; i < 49; i++) {
        if(i === 11){
            marginStartTop += height;
            indent = 11;
        }else if( i === 22){
            marginStartLeft = 92;
            marginStartTop += height;
            indent = 22;
        }else if( i === 32){
            marginStartLeft = 37;
            marginStartTop += height;
            indent = 32;
        }else if( i === 43){
            marginStartTop += height;
            indent = 43;
        }
        let img = document.createElement("img");
        img.src = `./img/keyboard/${i}.svg`;
        img.style.position = "absolute";
        if(i === 31)
            img.style.width = "117px";
        else if( i=== 45)
            img.style.width = "556px";
        else
            img.style.width = "76px";
        img.style.height = "81px";
        img.style.top = `${marginStartTop}px`;
        if(i === 46){
            marginStartLeft += 482;
        }
        img.style.left = `${marginStartLeft + (i - indent)*marginLeft}px`;
        img.style.cursor = "pointer";
        img.classList.add(`qbutton${i}`);
        img.onclick = (event) => onClick(event, i);
        qwerty.appendChild(img);
    }
}

export default {init, activate, remove}