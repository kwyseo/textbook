import {
	setCommonRoot,
	autoScale,
	toggleFullScreen,
	getScale
} from './common.js?ver=4';

var metaUrl =
	import.meta.url;
var root = null;


/*****************************************************/
//변수모음
/*****************************************************/
var game_ing = 0; //게임 진행사항

/*****************************************************/
//클릭이벤트
/*****************************************************/

function clickEvent() {
	//첫번째 클릭
	root.querySelector('#one_click').addEventListener('click', function () {
		if (game_ing === 0) {
			game_ing = 1;
			motion1(); //모션 시작
			stopGuide('#guide', 'reset'); //가이드제거
			clickBox('#one_click', 'off'); //클릭박스
		}
	});
	//두번째 클릭
	root.querySelector('#two_click').addEventListener('click', function () {
		if (game_ing === 1) {
			game_ing = 2;
			motion2(); //모션 시작
			clickBox('#two_click', 'off'); //클릭박스
			stopGuide('#guide2', 'reset'); //가이드제거
		}
	});
	//세번째 클릭
	root.querySelector('#three_click').addEventListener('click', function () {
		if (game_ing === 2) {
			game_ing = 3;
			motion3(); //모션 시작
			clickBox('#three_click', 'off'); //클릭박스
			stopGuide('#guide3', 'reset'); //가이드제거
		}
	});
	//네번째 클릭
	root.querySelector('#four_click').addEventListener('click', function () {
		if (game_ing === 3) {
			game_ing = 4;
			motion4(); //모션 시작
			clickBox('#four_click', 'off'); //클릭박스
			stopGuide('#guide4', 'reset'); //가이드제거
		}
	});
	//다섯번째 클릭
	root.querySelector('#five_click').addEventListener('click', function () {
		if (game_ing === 4) {
			game_ing = 5;
			motion5(); //모션 시작
			clickBox('#five_click', 'off'); //클릭박스
			stopGuide('#guide5', 'reset'); //가이드제거
		}
	});
	//여섯번째 클릭
	root.querySelector('#six_click').addEventListener('click', function () {
		if (game_ing === 5) {
			game_ing = 6;
			motion6(); //모션 시작
			clickBox('#six_click', 'off'); //클릭박스
			stopGuide('#guide6', 'reset'); //가이드제거
		}
	});
	//일곱번째 클릭
	root.querySelector('#seven_click').addEventListener('click', function () {
		if (game_ing === 6) {
			game_ing = 7;
			motion7(); //모션 시작
			clickBox('#seven_click', 'off'); //클릭박스
			stopGuide('#guide7', 'reset'); //가이드제거
		}
	});
}
/*****************************************************/
//모션
/*****************************************************/
function motion1() {
	root.querySelector('#con1 #text1').classList.add('show');
	root.querySelector('#con1 .line1').classList.add('show');

	const time = setTimeout(function () {
		root.querySelector('#con1 #clip1').classList.add('motion');
		const time = setTimeout(function () {
			root.querySelector('#con1 .big').classList.add('show');
			const time = setTimeout(function () {
				root.querySelector('#con1 .pink').classList.add('show');
				toggleGuide('#guide2');
					clickBox('#two_click', 'on'); //클릭박스
			}, 500);
			blinkTimeouts2.push(time); // 타이머 식별자를 배열에 저장
		}, 1200);
		blinkTimeouts2.push(time); // 타이머 식별자를 배열에 저장
	}, 500);
	blinkTimeouts2.push(time); // 타이머 식별자를 배열에 저장

}

function motion2() {
	root.querySelector('#con1 .if2').classList.add('hide');
	root.querySelector('#con1 #text2').classList.add('show');
	const time = setTimeout(function () {
		toggleGuide('#guide3');
		clickBox('#three_click', 'on'); //클릭박스

	}, 0);
	blinkTimeouts2.push(time); // 타이머 식별자를 배열에 저장
}

function motion3() {
	root.querySelector('#con1 .if3').classList.add('hide');
	root.querySelector('#con1 .num2').classList.add('show');
	const time = setTimeout(function () {
		toggleGuide('#guide4');
		clickBox('#four_click', 'on'); //클릭박스

	}, 0);
}

function motion4() {
	root.querySelector('#con2 #text3').classList.add('show');


	root.querySelector('#con1 .line1').classList.remove('show');
	root.querySelector('#con2 .line1').classList.add('show');


	root.querySelector('#con1 #clip1').classList.remove('motion');
	root.querySelector('#con1 .big').classList.remove('show');
	root.querySelector('#con1 .pink').classList.remove('show');

	const time = setTimeout(function () {
		root.querySelector('#con2 #clip2').classList.add('motion');
		const time = setTimeout(function () {
			root.querySelector('#con2 .big').classList.add('show');
			const time = setTimeout(function () {
				root.querySelector('#con2 .pink').classList.add('show');
				toggleGuide('#guide5');
					clickBox('#five_click', 'on'); //클릭박스
			}, 500);
			blinkTimeouts2.push(time); // 타이머 식별자를 배열에 저장
		}, 1200);
		blinkTimeouts2.push(time); // 타이머 식별자를 배열에 저장
	}, 500);
	blinkTimeouts2.push(time); // 타이머 식별자를 배열에 저장




}

function motion5() {
	root.querySelector('#con2 .if5').classList.add('hide');
	const time = setTimeout(function () {
		toggleGuide('#guide6');
		clickBox('#six_click', 'on'); //클릭박스
		root.querySelector('#con2 #text4').classList.add('show');

	}, 0);
}

function motion6() {
	root.querySelector('#con2 .if6').classList.add('hide');
	root.querySelector('#con2 .num1').classList.add('show');
	const time = setTimeout(function () {
		toggleGuide('#guide7');
		clickBox('#seven_click', 'on'); //클릭박스

	}, 0);
} 

function motion7() {
	root.querySelector('#con2 #text5').classList.add('show');
	root.querySelector('#con2 .one').classList.add('show');
	root.querySelector('#con2 #text6').classList.add('show');
	root.querySelector('#con2 .pink_clip').classList.add('hide');
	const time = setTimeout(function(){
		root.querySelector('#con2 .pink').classList.remove('show');
	},500)
	blinkTimeouts2.push(time)
	//	const time = setTimeout(function () {
	//		toggleGuide('#guide7');
	//		clickBox('#seven_click', 'on'); //클릭박스
	//
	//	}, 0);
}
/*****************************************************/
//클릭박스제거
/*****************************************************/
function clickBox(text, state) {
	if (state == 'off') {
		root.querySelector(text).classList.remove('show');
	} else if (state == 'on') {
		root.querySelector(text).classList.add('show');
	}
}

/*****************************************************/
//리셋
/*****************************************************/

function onClickReset() { //전체 리셋
	stopGuide('#guide', 'reset'); //가이드
	stopGuide('#guide2', 'reset'); //가이드
	stopGuide('#guide3', 'reset'); //가이드
	stopGuide('#guide4', 'reset'); //가이드
	stopGuide('#guide5', 'reset'); //가이드
	stopGuide('#guide6', 'reset'); //가이드
	stopGuide('#guide7', 'reset'); //가이드
	stopGuide2();




	root.querySelector('#con1 #text1').classList.remove('show');
	root.querySelector('#con1 #text2').classList.remove('show');
	root.querySelector('#con2 #text3').classList.remove('show');
	root.querySelector('#con2 #text4').classList.remove('show');
	root.querySelector('#con2 #text5').classList.remove('show');
	root.querySelector('#con1 .line1').classList.remove('show');
	root.querySelector('#con1 .line2').classList.remove('show');
	root.querySelector('#con2 .line1').classList.remove('show');
	root.querySelector('#con2 .line2').classList.remove('show');
	root.querySelector('#con2 #text6').classList.remove('show');
	root.querySelector('#con2 .num1').classList.remove('show');
	root.querySelector('#con2 .one').classList.remove('show');

	root.querySelector('#con1 #clip1').classList.remove('motion');
	root.querySelector('#con2 #clip2').classList.remove('motion');
	root.querySelector('#con1 .big').classList.remove('show');
	root.querySelector('#con2 .big').classList.remove('show');
	root.querySelector('#con1 .pink').classList.remove('show');
	root.querySelector('#con2 .pink').classList.remove('show');
	root.querySelector('#con2 .pink_clip').classList.remove('hide');
	
	root.querySelector('.if').classList.remove('hide');
	root.querySelector('.if2').classList.remove('hide');
	root.querySelector('.if3').classList.remove('hide');
	root.querySelector('.if5').classList.remove('hide');
	root.querySelector('.if6').classList.remove('hide');
	

	
	clickBox('#one_click', 'on'); //클릭박스
	clickBox('#two_click', 'off'); //클릭박스
	clickBox('#three_click', 'off'); //클릭박스
	clickBox('#four_click', 'off'); //클릭박스
	clickBox('#five_click', 'off'); //클릭박스
	clickBox('#six_click', 'off'); //클릭박스
	clickBox('#seven_click', 'off'); //클릭박스






	setTimeout(function () {
		toggleGuide('#guide'); //가이드
	}, 500)

	game_ing = 0; //게임진행사항


}

/*****************************************************/
//가이드 관련시작
/*****************************************************/

//시간관련
var intervalId;

// 깜빡임 타이머들을 저장할 배열 -정지할때쓰임
var blinkTimeouts = [];
var blinkTimeouts2 = [];


function startGuide() {
	// intervalId가 정의되어 있다면 clear 후 다시 setInterval 시작
	if (intervalId) {
		clearInterval(intervalId);
	}

	intervalId = setInterval(function () {
		toggleGuide();
	}, 6600);
}

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

function stopGuide2(guide, text) {

	// 모든 타임아웃 제거
	blinkTimeouts2.forEach(timeout => clearTimeout(timeout));
	blinkTimeouts2 = [];


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

	// 3회의 깜빡거림 모션
	for (let i = 0; i < 5; i++) {
		blinkTimeouts.push(setTimeout(function () {
			toggleBlink(guide);
		}, i * 800)); // 500밀리초마다 변경
	}

}

/*****************************************************/
//가이드 관련끝
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

	setTimeout(function () {
		toggleGuide('#guide'); //가이드
		clickBox('#one_click', 'on'); //클릭박스
		clickEvent(); //클릭이벤트
		//			startGuide(); //가이드
		//		toggleGuide2('#xboxs');
	}, 0)

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
