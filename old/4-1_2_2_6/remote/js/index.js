import MainEvent from "./Activity/MainEvent.js";
function autoScale() {
    const findWidth = document.querySelector("#container");
    const width = findWidth.offsetWidth;
    const height = findWidth.offsetHeight;
    const givenWidth = 1920; // 너비
    const givenHeight = 1020; // 높이
    const targetWidth = width;
    const targetHeight = height;
    // 스케일 계산
    const calculatedScaleWidth = (targetWidth / givenWidth) * 100;
    const calculatedScaleHeight = (targetHeight / givenHeight) * 100;
    // 더 작은 값을 기준으로 스케일 적용
    const calculatedScale = Math.min(calculatedScaleWidth, calculatedScaleHeight);
    const wrap = document.querySelector(".wrap");
    wrap.style.transform = "scale(" + calculatedScale + "%)";

    MainEvent.leftScale = 1 - (calculatedScale/100)
}


let loadedComponents = 0;
// 주의: 아랫단에서 가져오는 shadow dom 갯수를 더해야 한다.
let totalComponents = document.querySelectorAll(".embed").length + 6;

// remote-html-embed 가 실행된 후 실행된다.
// 다른 말로 하면 remote-html-embed 가 index.html 에 없으면 실행되지 않는다.
window.addEventListener('component-loaded', () => {
    loadedComponents++;

    if (loadedComponents === totalComponents) {
        window.addEventListener('resize', function () {
            autoScale();
        });

        autoScale();
        
        MainEvent.Init();
        MainEvent.Start();
        
        //데이터 로딩 후 화면 표출
        document.querySelector("#container").style.visibility = "visible"
        document.querySelector("#study_activity").style.visibility = "visible"
    }
});