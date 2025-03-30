export function DragOffset(e, element) {
    let x = 0;
    let y = 0;

    //마우스
    if (typeof (e.clientX) != "undefined") {
        x = e.clientX;
        y = e.clientY;
    }
    //터치
    else if (typeof (e.touches) != "undefined") {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }
    //태그
    else if (typeof (e.getBoundingClientRect) != "undefined") {
        x = e.getBoundingClientRect().x;
        y = e.getBoundingClientRect().y;
    }

    let rect = element.getBoundingClientRect();
    /*
        x축 기준 설명

        x: 브라우저 화면기준 대상요소의 x좌표, 대상요소.getBoundingClientRect().x 로 구할 수 있음
        rect.x: 브라우저 화면 기준 드래그영역의 x좌표, 드래그영역.getBoundingClientRect().x 로 구할 수 있음
        x - rect.x를 하면 드래그영역 기준으로 대상요소의 "x좌표"를 얻을 수 있음(확대비율 적용됨)

        element.offsetWidth: 드래그영역의 원본너비
        rect.width: 드래그영역의 화면출력 너비
        element.offsetWidth / rect.width를 하면 드래그영역의 "확대비율"을 얻을 수 있음

        대상요소의 "x좌표"에 "확대비율"을 곱하면 대상요소의 "원본 x좌표"를 얻을 수 있음

        parseInt(getComputedStyle(element).borderLeftWidth): 드래그영역의 왼쪽 테두리선 너비
        드래그영역의 x좌표는 테두리선 안쪽부터 시작하므로 왼쪽 테두리선 너비만큼 빼줌

    */
    var obj = {
        x: (x - rect.x) * (element.offsetWidth / rect.width) - parseInt(getComputedStyle(element).borderLeftWidth),
        y: (y - rect.y) * (element.offsetHeight / rect.height) - parseInt(getComputedStyle(element).borderTopWidth)
    };
    return obj;
}