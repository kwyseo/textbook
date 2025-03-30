/* default */
var metaUrl =
	import.meta.url;
let root = null;
var viewWrap;
var scale = 0;
var animation;
var scaleTotalV = 0;
var dropzones;

export function setCommonRoot(shadowRoot, functions) {
	root = shadowRoot;
	viewWrap = root.querySelector('#viewWrap');
	dropzones = Array.from(root.querySelectorAll('.dropzone'));
	console.log('embed-test', root, functions);
};

/* default end */
export function autoScale() {
	const findWidth = root.querySelector('#viewWrap');
	const width = findWidth.offsetWidth; // 너비
	const height = findWidth.offsetHeight; // 높이
	const givenWidth = 1920; // 주어진 너비
	const givenHeight = 1020; // 주어진 높이
	const targetWidth = width; // 원하는 너비
	const targetHeight = height; // 원하는 높이
	// 주어진 너비에서의 스케일 계산
	const calculatedScaleWidth = (targetWidth / givenWidth) * 100;
	const calculatedScaleHeight = (targetHeight / givenHeight) * 100;
	// width, height 중에서 더 작은 값을 기준으로 스케일 적용
	const calculatedScale = Math.min(calculatedScaleWidth, calculatedScaleHeight);
	const wrap = root.querySelector(".wrap");
	wrap.style.transform = "scale(" + calculatedScale + "%)";
	//	console.log(findWidth)
	//	console.log(width)
	//	console.log(height)
	scale = calculatedScale;

	//	console.log(width)
	//	console.log(height)
	
}
export function getScale() {
	return scale/100;
}


export function toggleFullScreen(root) {
	var doc = document;
	var docEl = root.firstElementChild;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	function fullScreenChangeHandler() {
		if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			// 전체화면이 종료된 경우
			console.log("전체화면이 종료되었습니다.");
			root.querySelector('#full > img').src = new URL('../img/full.png?ver=2', metaUrl).href;
		} else {
			// 전체화면이 시작된 경우
			console.log("전체화면 모드로 전환되었습니다.");
			root.querySelector('#full > img').src = new URL('../img/btn-fullscreen-off.png?ver=2', metaUrl).href;
		}
	}

	if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
		requestFullScreen.call(docEl);
	} else {
		cancelFullScreen.call(doc);
	}

	doc.addEventListener('fullscreenchange', fullScreenChangeHandler);
	doc.addEventListener('mozfullscreenchange', fullScreenChangeHandler);
	doc.addEventListener('webkitfullscreenchange', fullScreenChangeHandler);
	doc.addEventListener('msfullscreenchange', fullScreenChangeHandler);
}
