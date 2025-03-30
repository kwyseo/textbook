//=================== 기본형 ===================

/** 특정 엘리먼트 Active 시키기 */
export function SetActive(element) {
    element.classList.remove('deactive')
    element.classList.add('active')
}

/** 특정 엘리먼트 DeActive 시키기 */
export function SetDeActive(element) {
    element.classList.remove('active')
    element.classList.add('deactive')
}

/** Active, Deactive 상태 제거 */
export function RemoveActiveState(element) {
    element.classList.remove('active')
    element.classList.remove('deactive')
}

/** 엘리먼트 리스트 Active 시키기 */
export function SetActivityArray(elementList = []) {
    if (elementList.length > 0) {
        elementList.forEach(element => {
            SetActive(element)
        });
    }
}

/** 엘리먼트 리스트 DeActive 시키기 */
export function SetDeActivityArray(elementList = []) {
    if (elementList.length > 0) {
        elementList.forEach(element => {
            SetDeActive(element)
        });
    }
}


//=================== 파생형 ===================


/** Active면 Deactive로, Deactive면 Active로 */
export function SwitchActive(element) {
    if (element.classList.contains('active')) {
        SetDeActive(element)
    } else {
        SetActive(element)
    }
}

/** 2개의 엘리먼트 상태 스위칭 (On/Off 기능) */
export function SwitchBothElement(element1, element2) {
    if (element1.classList.contains('active')) {
        SetDeActive(element1)
        SetActive(element2)
    } else {
        SetActive(element1)
        SetDeActive(element2)
    }
}