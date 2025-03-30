const keyBoard = document.querySelector(".keyboard");

/** 키보드 열기 */
export function KeyBoardOn() {
    keyBoard.style.display = "flex"
}

/** 키보드 닫기 */
export function KeyBoardOff() {
    keyBoard.style.display = "none"
}

/** 키보드 위치 변경 */
export function SetKeyBoardPos(pos = {x: 0, y: 0}) {
    keyBoard.style.left = pos.x
    keyBoard.style.top = pos.y
}
