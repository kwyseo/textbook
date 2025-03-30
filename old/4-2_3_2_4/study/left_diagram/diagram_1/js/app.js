import {
	setCommonRoot,
	autoScale,
	toggleFullScreen,
	getScale
} from './common.js?ver=2';

var metaUrl =
	import.meta.url;
var root = null;


/*****************************************************/
//변수모음
/*****************************************************/

/*****************************************************/
//리셋
/*****************************************************/

function onClickReset() { //전체 리셋



	//추가된 클래스값 초기화
	const textMom = root.querySelectorAll('.textMom');
	textMom.forEach((item) => {
		item.classList.remove('show');

	})	
	const img = root.querySelectorAll('#contents img');
	img.forEach((item) => {
		item.classList.remove('show');
		item.classList.remove('hide');
		item.classList.remove('motion');

	})
	const clip = root.querySelectorAll('#contents .clip');
	clip.forEach((item) => {
		item.classList.remove('motion');

	})




	// 가이드초기화
	stopGuide('#guide', 'reset');
	for (let i = 2; i < 5; i++) {
		//				console.log('#guide' + Number(i))
		stopGuide('#guide' + Number(i), 'reset');
	}

	
	//모션정지
	stopGuide2();

	//가이드관련
	toggleGuide('#guide');
}



/*****************************************************/
//가이드 관련시작
/*****************************************************/

//시간관련
var intervalId;

// 깜빡임 타이머들을 저장할 배열 -정지할때쓰임
var blinkTimeouts = [];
var blinkTimeouts2 = [];


function stopGuide(guide, text) {
	// intervalId가 정의되어 있다면 clearInterval 실행
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}

	// 모든 타임아웃 제거
	blinkTimeouts.forEach(timeout => clearTimeout(timeout));
	blinkTimeouts = [];

	if (text == "reset") {
		const guides = root.querySelector(guide);
		const guideBox = root.querySelector(guide + 'Box');
		guideBox.classList.add('hide');
		guides.classList.remove('show');
	} else {
		root.querySelector(guide).classList.add('hide');
	}

}

function stopGuide2() {
	blinkTimeouts2.forEach(timeout => clearTimeout(timeout));
	blinkTimeouts2 = [];
}

function startGuide(guide) {
	// intervalId가 정의되어 있다면 clear 후 다시 setInterval 시작
	if (intervalId) {
		clearInterval(intervalId);
	}

	intervalId = setInterval(function () {
		toggleGuide(guide);
	}, 9000);
}



function toggleGuide(guides) {
    const guide = root.querySelector(guides);
    const guideBox = root.querySelector(guides + 'Box');
    guide.classList.remove('show');
    guideBox.classList.remove('hide');

    // 깜빡임을 토글하는 함수
    function toggleBlink(element) {
        element.style.display = 'block';
        const timeoutId = setTimeout(function () {
            element.classList.toggle('show');
        }, 500);
        blinkTimeouts.push(timeoutId);
    }
// iPad 감지
const isIpad = /ipad|macintosh/.test(navigator.userAgent.toLowerCase()) && 'ontouchend' in document;

    // 3회의 깜빡거림 모션
    if (!isIpad || !guide.classList.contains('small')) { // iPad에서 .small 요소는 깜빡이지 않도록 설정
        for (let i = 0; i < 5; i++) {
            blinkTimeouts.push(setTimeout(function () {
                toggleBlink(guide);
            }, i * 800)); // 800밀리초마다 변경
        }
    }
}


/*****************************************************/
//클릭이벤트
/*****************************************************/
function clickEvent() {
	root.querySelector('.one_click').addEventListener('click', function () {
		stopGuide('#guide', 'reset');
		root.querySelector('.text2Mom').classList.add('show');
		root.querySelector('#action').classList.add('show');
		root.querySelector('#action .small').classList.add('show');
		const time = setTimeout(function () {
			root.querySelector('#action .clip1').classList.add('motion');
			const time = setTimeout(function () {
				root.querySelector('#action .big').classList.add('show');
				root.querySelector('#action .ruler').classList.add('show');
				
				root.querySelector('#action .clip2').classList.add('motion');
					const time = setTimeout(function () {
						toggleGuide('#guide2')

				}, 500);
				blinkTimeouts.push(time);
			}, 1200);
			blinkTimeouts.push(time);

		}, 500);
		blinkTimeouts.push(time);


	})
	root.querySelector('.two_click').addEventListener('click', function () {
		stopGuide('#guide2', 'reset');
		toggleGuide('#guide3')
		root.querySelector('.if3').classList.add('hide');
		root.querySelector('.text3Mom').classList.add('show');
		root.querySelector('#action .pink').classList.add('hide');


	})
	root.querySelector('.three_click').addEventListener('click', function () {
		stopGuide('#guide3', 'reset');
		toggleGuide('#guide4')
		root.querySelector('.if1').classList.add('hide');




	})
	root.querySelector('.four_click').addEventListener('click', function () {
		stopGuide('#guide4', 'reset');
		root.querySelector('.text3_1').classList.add('show');

		const time = setTimeout(function () {
			root.querySelector('.clip3 img').classList.add('motion');
			const time = setTimeout(function () {
				root.querySelector('.one').classList.add('show');
				const time = setTimeout(function () {
					root.querySelector('.clip4 img').classList.add('motion');
					const time = setTimeout(function () {
						root.querySelector('.if2').classList.add('show');
						const time = setTimeout(function () {
							root.querySelector('.text3_2').classList.add('show');
						}, 500);
					}, 500);
					blinkTimeouts.push(time);
				}, 500);
				blinkTimeouts.push(time);
			}, 500);
			blinkTimeouts.push(time);
		}, 500);
		blinkTimeouts.push(time);


	})
}
/*****************************************************/
//초기 실행
/*****************************************************/

window.addEventListener('script-loaded', function (ev) {

	if (root) return;
	const u = new URL(metaUrl);
	const param = u.searchParams.get('embed-unique');

	if (param && param !== ev.detail.unique) return;


	const shadowRoot = ev.detail.root; // 커스텀 이벤트에 담겨진 shadowRoot 객체
	root = shadowRoot;

	setCommonRoot(root, {});

	window.addEventListener('resize', function () { //autoscale
		autoScale();
	});

	autoScale();

	toggleGuide('#guide');
	clickEvent();

	// 클릭 이벤트 핸들러 등록
	root.querySelector('#reset').addEventListener('click', function () {
		onClickReset();
	});


	// 버튼 클릭 시 전체 화면 토글
	var full = root.querySelector('#full');
	full.addEventListener('click', function () {
		toggleFullScreen(root);
	});
	
	//ipad 자동 전체화면 아이콘 없애기
	let agent = navigator.userAgent.toLowerCase();
    if( agent.indexOf("iphone") > -1 || agent.indexOf("ipad") > -1 || agent.indexOf("ipod") > -1 || agent.indexOf("mac") > -1) {
        full.style.display = "none"
    }
	// 부모에게서 받은 reset 요청 처리
	root.reset = ()=> {onClickReset()}
	root.autoScale = ()=> {autoScale()}
});
