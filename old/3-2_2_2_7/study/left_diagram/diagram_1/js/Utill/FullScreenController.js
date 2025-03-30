import { AnimationHeler } from "./AnimationHelper.js";

export function FullScreenController(main) {
    let fullScreenButton = main.shadow.querySelector('#fullScreenButton');
	fullScreenButton.addEventListener('click', function() {
		AnimationHeler.BtnClick(fullScreenButton)
		toggleFullScreen(main);
	});

    //IOS에서는 안보이게
    let agent = navigator.userAgent.toLowerCase();
    if( agent.indexOf("iphone") > -1 || agent.indexOf("ipad") > -1 || agent.indexOf("ipod") > -1 || agent.indexOf("mac") > -1) {
        fullScreenButton.style.display = "none"
    }

	main.viewWrap.addEventListener('fullscreenchange', () => {
        handleFullscreenChange(main)
    });
}


function toggleFullScreen(main) {
    let doc = document;
    let docEl = main.shadow.firstElementChild;

    let requestFullScreen = doc.documentElement.requestFullscreen || doc.mozRequestFullScreen || doc.webkitRequestFullScreen || doc.msRequestFullscreen;
    let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    	requestFullScreen.call(docEl);
    	// 전체화면 이미지로 변경
    	main.shadow.querySelector('#fullScreenButton > img').src = new URL('../img/btn-fullscreen-off.png', main.metaUrl).href;
    } else {
    	cancelFullScreen.call(doc);
    	// 일반 이미지로 변경
    	main.shadow.querySelector('#fullScreenButton > img').src = new URL('../img/btn-fullscreen-on.png', main.metaUrl).href;
    }
}

function handleFullscreenChange(main) {
    var doc = document;
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        main.shadow.querySelector('#fullScreenButton > img').src = new URL('../img/btn-fullscreen-on.png', main.metaUrl).href;
    }
}