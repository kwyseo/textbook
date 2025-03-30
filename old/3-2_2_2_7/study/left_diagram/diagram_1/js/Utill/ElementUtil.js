/** 엘리먼트의 자식 리스트로 리턴 */
export function GetChildList(parentEl, elementName) {
    let children = parentEl.children

    if (elementName) {
        children = parentEl.querySelectorAll(elementName)
    }

    let list = []

    Array.from(children).forEach((child, index) => {
        list.push(child)
    });

    return list
}

/** 특정 엘리먼트의 앞에서부터 자식 넣기 */
export function SetInsertBefore(parentEl, obj) {
    if (parentEl.firstChild) {
        parentEl.insertBefore(obj, parentEl.firstChild)
    } else {
        parentEl.appendChild(obj)
    }
}

/** 자식 엘리먼트중 특정 엘리먼트 삭제 (elementName == "div", "img", 클래스명) */
export function RemoveChildList(parentEl, elementName) {

    const parentEl_child = parentEl.querySelectorAll(elementName);

    parentEl_child.forEach(element => {
        element.remove();
    });
}

/** 부모의 몇번째 자식인지 찾기 */
export function FindIndexOfChild(parent, child) {
    let children = parent.children;
    
    for (let i = 0; i < children.length; i++) {
        if (children[i] === child) {
            return i;
        }
    }

    return -1;
}