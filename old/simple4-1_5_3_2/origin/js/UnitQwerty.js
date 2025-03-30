const layOut = ["가구","개","관","권","년",
    "대","만 명","만 회","명","백 명",
    "분","상자","세","시","억 원",
    "원","월","일","천 명","회",
    "℃","cm","g", "kg", "mm"]
let qwerty;
let callback;
let name;

const onClick = (event, i, div) => {
    event.preventDefault();
    event.stopPropagation();
    qwerty.querySelectorAll('.button').forEach((element, index) => {
        element.style.backgroundColor = "white";
        let character = element.querySelector("div");
        character.classList.remove(`b_${index+1}`);
        character.classList.add(`w_${index+1}`);
    });
    div.style.backgroundColor = "black";
    let unit = div.querySelector("div");
    unit.classList.remove(`w_${i+1}`);
    unit.classList.add(`b_${i+1}`);
    callback(layOut[i]);
}

const activate = (_name, cb) => {
    qwerty.style.display = "block";
    name = _name;
    callback = cb;
}

const remove = () => {
    qwerty.style.display = "none";
}
const refresh = () => {
    qwerty.querySelectorAll('.button').forEach((element, index) => {
        element.style.backgroundColor = "white";
        let character = element.querySelector("div");
        character.classList.remove(`b_${index+1}`);
        character.classList.add(`w_${index+1}`);
    });
}

const init = (documentRoot, target) => {
    qwerty = documentRoot.querySelector(target);
    qwerty.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
    });
    documentRoot.addEventListener("click", () => {
        if(qwerty.style.display === "block") {
            callback("");
            qwerty.style.display = "none";
        }
    });
    documentRoot.addEventListener('click', () => {
        remove();
    });
    let marginStartLeft = 25;
    let marginLeft = 94;
    let marginStartTop = 42;
    let height = 87;
    // 첫번째 줄
    for(let i = 0; i < 25; i++) {
        if(i!== 0 && i % 5 === 0){
            marginStartTop += height;
        }
        let div = document.createElement("div");
        div.classList.add("button");
        div.style.position = "absolute";
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
        div.style.width = "84px";
        div.style.height = "75px";
        div.style.top = `${marginStartTop}px`;
        div.style.left = `${marginStartLeft + (i % 5)*marginLeft}px`;
        div.style.cursor = "pointer";
        div.style.backgroundColor = "white";
        div.style.borderRadius = "18px";
        const character = document.createElement("div");
        const sheets = documentRoot.styleSheets;
        const style = sheets[sheets.length -1];
        let content = `.w_${i+1} {content:url(../img/unit/w_${i+1}.png);}`
        style.insertRule(content);
        content = `.b_${i+1} {content:url(../img/unit/b_${i+1}.png);}`;
        style.insertRule(content);
        character.classList.add(`w_${i+1}`);
        div.appendChild(character);
        div.onclick = (event) => onClick(event, i, div);
        qwerty.appendChild(div);
    }
}

export default {init, activate, remove, refresh}
