/** 엘리먼트 삭제하고 기존 위치에 다시 생성 (버튼 이벤트 초기화용) */
export function RemoveListener(target) {
    const cloneElement = target.cloneNode(true);
    target.parentNode.replaceChild(cloneElement, target);

    return cloneElement
  }