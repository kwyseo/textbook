import { ChangeCaptureStyle, RollBackCaptureStyle } from "./CaptureCustom.js";

/** 캡쳐 */
export function StartCapture(fileName) {
    let wrap = document.querySelector(".wrap");
    const originalTransform = wrap.style.transform;

    // 캡쳐할 때 일시적으로 변경시킬 CSS -------------------------
    wrap.style.transform = `scale(1)`;
    ChangeCaptureStyle()    
    //--------------------------------------------------

    document.querySelector("#loading").style.display = "block"

    // 캡쳐
    html2canvas(wrap.querySelector("#study_activity"), {
        useCORS: true,
        ignoreElements: function(element) {
            return element.classList.contains('ukp__hide')
                || element.classList.contains('ukp__disabled')
                || element.classList.contains('ukp__svg')
                || element.classList.contains('hide');
        }
    }).then(function(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "middle"

        const imgData = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = imgData;
        link.download = fileName +'.png';
        link.click();
        document.querySelector("#loading").style.display = "none"
    }).catch(function(error) {
        document.querySelector("#loading").style.display = "none"
    });

    
    // 캡쳐할 때 일시적으로 변경시킨 CSS 복구-------------------
    wrap.style.transform = originalTransform;
    RollBackCaptureStyle()
    //------------------------------------------------   
}

