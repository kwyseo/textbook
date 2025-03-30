import MainActivity from "./Activity/MainActivity.js";
import {HideAlert, ShowOneSecond} from "./Utill/AlertController.js";

var metaUrl = import.meta.url;
var scale = 0;
var shadow = null

function autoScale() {
    const findWidth = shadow.querySelector('#viewWrap');
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
    const wrap = shadow.querySelector(".wrap");
    wrap.style.transform = "scale(" + calculatedScale + "%)";
    scale = calculatedScale;
}

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomNumberArray = (isPrimeNumber) =>{
    if (!isPrimeNumber) {
        while (true) {
            const nominator = getRandomNumber(10, 99);
            const denominators = getRandomNumber(2, 9);
            if (nominator % denominators === 0) {
                return [nominator, denominators];
            }
        }
    } else {
        while (true) {
            const nominator = getRandomNumber(10, 99);
            const denominators = getRandomNumber(2, 9);
            if (nominator % denominators !== 0) {
                return [nominator, denominators];
            }
        }
    }
}

window.addEventListener("script-loaded", async function (e) {

    //======기본세팅========
    if (shadow) return;
    const u = new URL(metaUrl);
    const param = u.searchParams.get('embed-unique');

    if (param && param !== e.detail.unique) return;

    shadow = e.detail.root;

    window.addEventListener('resize', function () {//autoscale
        autoScale();
    });

    autoScale();
    shadow.querySelector("#contentsWrap").style.visibility = "visible"

    //======기본세팅 끝========

    let mainActivity = new MainActivity()

    mainActivity.shadow = shadow
    mainActivity.metaUrl = metaUrl
    mainActivity.scale = scale
    
    mainActivity.Init()
    mainActivity.Start()


    const _show = (isPrimeNumber) => {
        const data = getRandomNumberArray(isPrimeNumber);
        mainActivity.value1 = data[0];
        mainActivity.value2 = data[1];
        mainActivity.step = mainActivity.Step.ACTIVITY_1;
        mainActivity.SetStep();
        const args = {
            'root': mainActivity.shadow,
            'type': 'initValue',
            'numerator': mainActivity.value1,
            'denominator': mainActivity.value2
        };

        const event = new CustomEvent('callToParent',
            {
                detail: {message: args},
                bubbles: true,
                composed: true
            }
        );
        mainActivity.shadow.dispatchEvent(event);
    }

    mainActivity.shadow.autoScale = ()=> {autoScale()}

    mainActivity.shadow.checkAnswer = ()=>{
        mainActivity.activity1.CheckAnswer();
    }

    mainActivity.shadow.showStepOne = (isPrimeNumber)=> {
        mainActivity.showStartMessage = true;
        HideAlert(mainActivity);
        _show(isPrimeNumber);
        mainActivity.step = mainActivity.Step.ACTIVITY_1;
        mainActivity.SetStep();
    }

    mainActivity.shadow.showStepOneWithIntro = (isPrimeNumber)=> {
        mainActivity.showStartMessage = false;
        HideAlert(mainActivity);
        _show(isPrimeNumber);
        mainActivity.step = mainActivity.Step.INTRO;
        mainActivity.SetStep();
    }

    mainActivity.shadow.showStepTwo = (isPrimeNumber)=> {
        _show(isPrimeNumber);
        mainActivity.step = mainActivity.Step.ACTIVITY_2;
        mainActivity.SetStep();
    }

    mainActivity.shadow.showStepTwoWithIntro = (isPrimeNumber)=> {
        _show(isPrimeNumber);
        mainActivity.step = mainActivity.Step.INTRO;
        mainActivity.SetStep();
    }
    mainActivity.shadow.showActivityMessage = ()=> {
        ShowOneSecond(mainActivity, `활동을 완료한 후 '확인하기' 버튼을 클릭해 주세요.`, 8000)
    }
});
