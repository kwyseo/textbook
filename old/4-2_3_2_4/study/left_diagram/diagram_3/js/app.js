import {
	setCommonRoot,
	autoScale,
	toggleFullScreen,
	getScale
} from './common.js?ver=1';

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



	//추가된 스타일 초기화
	const if_common = root.querySelectorAll('.if_common');
	if_common.forEach((item) => {
		item.style.transition = '0s';
		item.style.opacity = '';
	})
	const aw1 = root.querySelectorAll('.arrow');
	aw1.forEach((item) => {
		item.style.transition = '0s';
		item.style.clipPath = '';
	})
	const aw2 = root.querySelectorAll('.arrow_red');
	aw2.forEach((item) => {
		item.style.transition = '0s';
		item.style.clipPath = '';
	})
	const text = root.querySelectorAll('.text');
	text.forEach((item) => {
		item.style.transition = '0s';
		item.style.opacity = '';
	})

	//박스2
	root.querySelector('#box_mom1 .box2_1').style.opacity = '';
	root.querySelector('#box_mom1 .box2_2').style.opacity = '';
	root.querySelector('#box_mom1 .box_color2_1').style.opacity = '';
	root.querySelector('#box_mom1 .box2_2').style.transition = '0s';
	root.querySelector('#box_mom1 .box2_1').style.transition = '0s';
	root.querySelector('#box_mom1 .box_color2_1').style.transition = '0s';
	//박스3
	root.querySelector('#box_mom1 .box3_1').style.opacity = '';
	root.querySelector('#box_mom1 .box3_2').style.opacity = '';
	root.querySelector('#box_mom1 .box_color3_1').style.opacity = '';
	root.querySelector('#box_mom1 .box3_1').style.transition = '0s';
	root.querySelector('#box_mom1 .box3_2').style.transition = '0s';
	root.querySelector('#box_mom1 .box_color3_1').style.transition = '0s';
	//박스4
	root.querySelector('#box_mom1 .box4_1').style.opacity = '';
	root.querySelector('#box_mom1 .box4_2').style.opacity = '';
	root.querySelector('#box_mom1 .box_color4_1').style.opacity = '';
	root.querySelector('#box_mom1 .box4_1').style.transition = '0s';
	root.querySelector('#box_mom1 .box4_2').style.transition = '0s';
	root.querySelector('#box_mom1 .box_color4_1').style.transition = '0s';
	//확대
	root.querySelector('#box_mom1 .mini').style.opacity = '';
	root.querySelector('#box_mom1 .line').style.transition = '0s';
	root.querySelector('#box_mom1 .line').style.clipPath = '';
	root.querySelector('#box_mom1 .big').style.opacity = '';
	root.querySelector('#box_mom1 .mini').style.transition = '0s';
	root.querySelector('#box_mom1 .line').style.transition = '0s';
	root.querySelector('#box_mom1 .big').style.transition = '0s';
	//하단 박스
	root.querySelector('#box_mom2 .box1').style.opacity = '';
	root.querySelector('#box_mom2 .box1').style.transition = '0s';

	// 가이드초기화
	stopGuide('#guide', 'reset');
	for (let i = 2; i < 17; i++) {
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
		root.querySelector(guide + 'Box').classList.add('hide');
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
	}, 7000);
	blinkTimeouts.push(intervalId);
}



function toggleGuide(guides) {
	const guide = root.querySelector(guides);
	const guideBox = root.querySelector(guides + 'Box');
	guide.classList.remove('show');
	guide.classList.remove('hide');
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
//클릭이벤트
/*****************************************************/
function clickEvent() {
	//첫번째 박스
	root.querySelector('#guideBox').addEventListener('click', function () {
		stopGuide('#guide');
		hideMotion('#box_mom1 .box2_1 ');
		showMotion('#box_mom1 .box2_2 ');
		//색상등장
		const time = setTimeout(function () {
			showMotion('#box_mom1 .box_color2_1 ');

			//점선 등장
			const time = setTimeout(function () {
				arrowMotion('#box_mom1 .aw1', 'bottom', '#guide2', function () {
					arrowMotion('#box_mom1 .aw1', 'top', '#guide2');
				});
			}, 500)
			blinkTimeouts2.push(time);
		}, 500)
		blinkTimeouts2.push(time);
	})

	root.querySelector('#guide2Box').addEventListener('click', function () {
		stopGuide('#guide2');
		toggleGuide('#guide3');
		root.querySelector('#box_mom1 #arrow1 .if2').style.opacity = 0;
	})

	root.querySelector('#guide3Box').addEventListener('click', function () {
		stopGuide('#guide3');
		toggleGuide('#guide4');
		root.querySelector('#box_mom1 #arrow1_2 .if1').style.opacity = 0;
	})
	//두번째 박스
	root.querySelector('#guide4Box').addEventListener('click', function () {
		stopGuide('#guide4');
		hideMotion('#box_mom1 .box3_1 ');
		showMotion('#box_mom1 .box3_2 ');
		//색상등장
		const time = setTimeout(function () {
			showMotion('#box_mom1 .box_color3_1 ');

			//점선 등장
			const time = setTimeout(function () {
				arrowMotion('#box_mom1 .aw2', 'bottom', '#guide5', function () {
					arrowMotion('#box_mom1 .aw2', 'top', '#guide5');
				});
			}, 500)
			blinkTimeouts2.push(time);
		}, 500)
		blinkTimeouts2.push(time);
	})

	root.querySelector('#guide5Box').addEventListener('click', function () {
		stopGuide('#guide5');
		toggleGuide('#guide6');
		root.querySelector('#box_mom1 #arrow2 .if2').style.opacity = 0;
	})

	root.querySelector('#guide6Box').addEventListener('click', function () {
		stopGuide('#guide6');
		toggleGuide('#guide7');
		root.querySelector('#box_mom1 #arrow2_2 .if1').style.opacity = 0;
	})
	//세번째 박스
	root.querySelector('#guide7Box').addEventListener('click', function () {
		stopGuide('#guide7');
		hideMotion('#box_mom1 .box4_1 ');
		showMotion('#box_mom1 .box4_2 ');
		//색상등장
		const time = setTimeout(function () {
			showMotion('#box_mom1 .box_color4_1 ');

			const time = setTimeout(function () {
				//확대이미지관련
				showMotion('#box_mom1 .mini ');
				const time = setTimeout(function () {
					//확대이미지관련
					root.querySelector('#box_mom1 .line ').style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
					root.querySelector('#box_mom1 .line ').style.transition = '0.5s linear';
					const time = setTimeout(function () {
						//확대이미지관련
						showMotion('#box_mom1 .big ');
						//점선 등장
						const time = setTimeout(function () {
							arrowMotion('#box_mom1 .aw3', 'bottom', '#guide8', function () {
								arrowMotion('#box_mom1 .aw3', 'top', '#guide8');
							});
						}, 500)
						blinkTimeouts2.push(time);
					}, 500)
					blinkTimeouts2.push(time);
				}, 500)
				blinkTimeouts2.push(time);
			}, 500)
			blinkTimeouts2.push(time);
		}, 500)
		blinkTimeouts2.push(time);




	})

	root.querySelector('#guide8Box').addEventListener('click', function () {
		stopGuide('#guide8');
		toggleGuide('#guide9');
		root.querySelector('#box_mom1 #arrow3 .if2').style.opacity = 0;
	})

	root.querySelector('#guide9Box').addEventListener('click', function () {
		stopGuide('#guide9');
		toggleGuide('#guide10');
		root.querySelector('#box_mom1 #arrow3_2 .if1').style.opacity = 0;
	})

	//여기서부터는 아래 박스 시작
	root.querySelector('#guide10Box').addEventListener('click', function () {
		stopGuide('#guide10');
		//toggleGuide('#guide12');
		showMotion('#box_mom2 .box1');

		const time = setTimeout(function () {
			arrowMotion2('#arrow4_1', 'right', '#guide11', function () {
				arrowMotion2('#arrow4_1 .arrow', 'right', '#guide11');
			});
		}, 500)
		blinkTimeouts2.push(time);
	})
	root.querySelector('#guide11Box').addEventListener('click', function () {
		stopGuide('#guide11');
		root.querySelector('#arrow4_1 .text').style.opacity = 1;
		root.querySelector('#arrow4_1 .if1').style.opacity = 0;
		const time = setTimeout(function () {
			arrowMotion2('#arrow4_2', 'right', '#guide12', function () {
				arrowMotion2('#arrow4_2 .arrow', 'right', '#guide12');
			});
		}, 500)
	})
	root.querySelector('#guide12Box').addEventListener('click', function () {
		stopGuide('#guide12');
		root.querySelector('#arrow4_2 .text').style.opacity = 1;
		root.querySelector('#arrow4_2 .if1').style.opacity = 0;
		const time = setTimeout(function () {
			arrowMotion2('#arrow4_3', 'right', '#guide13', function () {
				arrowMotion2('#arrow4_3 .arrow', 'right', '#guide13');
			});
		}, 500)
	})
	//왼쪽 점선 
	root.querySelector('#guide13Box').addEventListener('click', function () {
		stopGuide('#guide13');
		root.querySelector('#arrow4_3 .text').style.opacity = 1;
		root.querySelector('#arrow4_3 .if1').style.opacity = 0;
		const time = setTimeout(function () {
			arrowMotion2('#arrow5_1', 'right', '#guide14', function () {
				arrowMotion2('#arrow5_1 .arrow', 'right', '#guide14');
			});
		}, 500)
	})
	
	root.querySelector('#guide14Box').addEventListener('click', function () {
		stopGuide('#guide14');
		root.querySelector('#arrow5_1 .text').style.opacity = 1;
		root.querySelector('#arrow5_1 .if1').style.opacity = 0;
		const time = setTimeout(function () {
			arrowMotion2('#arrow5_2', 'right', '#guide15', function () {
				arrowMotion2('#arrow5_2 .arrow', 'right', '#guide15');
			});
		}, 500)
	})
	root.querySelector('#guide15Box').addEventListener('click', function () {
		stopGuide('#guide15');
		root.querySelector('#arrow5_2 .text').style.opacity = 1;
		root.querySelector('#arrow5_2 .if1').style.opacity = 0;
		const time = setTimeout(function () {
			arrowMotion2('#arrow5_3', 'right', '#guide16', function () {
				arrowMotion2('#arrow5_3 .arrow', 'right', '#guide16');
			});
		}, 500)
	})
	root.querySelector('#guide16Box').addEventListener('click', function () {
		stopGuide('#guide16');
		root.querySelector('#arrow5_3 .text').style.opacity = 1;
		root.querySelector('#arrow5_3 .if1').style.opacity = 0;
		
	})
}

/*****************************************************/
//사라지는모션 과 등장 모션
/*****************************************************/
function hideMotion(className) {
	root.querySelector(className).style.opacity = 0;
	root.querySelector(className).style.transition = '0.5s';

}

function showMotion(className) {
	root.querySelector(className).style.opacity = 1;
	root.querySelector(className).style.transition = '0.5s';

}
//박스윗부분 관련 점선 등장
function arrowMotion(className, position, guide, call) {
	if (position == 'bottom') {
		root.querySelector(className + ' .arrow').style.clipPath = 'polygon(0 0, 33% 0, 33% 100%, 0 100%)';
		root.querySelector(className + ' .arrow').style.transition = '0.5s linear';
		const time = setTimeout(function () {
			root.querySelector(className + ' .if2').style.transition = '0.5s';
			root.querySelector(className + ' .if2').style.opacity = 1;
			const time1 = setTimeout(function () {
				root.querySelector(className + ' .arrow').style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
				root.querySelector(className + ' .arrow').style.transition = '0.8s linear';
				const time1 = setTimeout(function () {
					//toggleGuide(guide);
					call(); //빨간점선 시작
				}, 800)
				blinkTimeouts2.push(time1);
			}, 200)
			blinkTimeouts2.push(time1);
		}, 500)
		blinkTimeouts2.push(time);

	} else if (position == 'top') {
		root.querySelector(className + ' .arrow_red').style.clipPath = 'polygon(65% 0, 100% 0, 100% 100%, 65% 100%)';
		root.querySelector(className + ' .arrow_red').style.transition = '0.5s linear';
		const time = setTimeout(function () {
			root.querySelector(className + ' .if1').style.transition = '0.5s';
			root.querySelector(className + ' .if1').style.opacity = 1;
			const time1 = setTimeout(function () {
				root.querySelector(className + ' .arrow_red').style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
				root.querySelector(className + ' .arrow_red').style.transition = '0.8s linear';
				const time1 = setTimeout(function () {
					toggleGuide(guide);
				}, 500)
				blinkTimeouts2.push(time1);
			}, 300)
			blinkTimeouts2.push(time1);
		}, 500)
		blinkTimeouts2.push(time);
	}


}

//박스 아랫부분 관련  점선 등장
function arrowMotion2(className, position, guide, call) {
	if (position == 'right') {
		//선 각각 속도가 같아야해서 시작
		let time2;
		if(className=="#arrow4_1"||className=="#arrow5_1"){
			root.querySelector(className + ' .arrow').style.transition = '0.8s linear';
			time2=800;
		}else if(className=="#arrow4_2"||className=="#arrow5_2"){
			root.querySelector(className + ' .arrow').style.transition = '1s linear';
			time2=1000;
		}else if(className=="#arrow4_3"||className=="#arrow5_3"){
			root.querySelector(className + ' .arrow').style.transition = '1.3s linear';
			time2=1300;
		}
		//선 각각 속도가 같아야해서 끝
		
		root.querySelector(className + ' .arrow').style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
		const time = setTimeout(function () {
			showMotion(className + ' .if1');
			toggleGuide(guide);
		}, time2)
		blinkTimeouts2.push(time);
	}
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

	//클릭 이벤트 핸들러 등록
	root.querySelector('#reset').addEventListener('click', function () {
		onClickReset();
	});


	// 버튼 클릭 시 전체 화면 토글
	var full = root.querySelector('#full');
	full.addEventListener('click', function () {
		toggleFullScreen(root);
	});

	//여기서부터 내꺼
	toggleGuide('#guide');
	clickEvent();
	//startGuide('#guide');
	
	
	//ipad 자동 전체화면 아이콘 없애기
	let agent = navigator.userAgent.toLowerCase();
    if( agent.indexOf("iphone") > -1 || agent.indexOf("ipad") > -1 || agent.indexOf("ipod") > -1 || agent.indexOf("mac") > -1) {
        full.style.display = "none"
    }

	// 부모에게서 받은 reset 요청 처리
	root.reset = ()=> {onClickReset()}
	root.autoScale = ()=> {autoScale()}
});
