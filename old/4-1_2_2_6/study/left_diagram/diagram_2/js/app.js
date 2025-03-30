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

/*****************************************************/
//리셋
/*****************************************************/

function onClickReset() { //전체 리셋
	stopGuide('#guide', 'reset'); //가이드
	stopGuide2();
	
	const timer1 = setTimeout(function () {
				toggleGuide('#guide'); //가이드
				startGuide('#guide'); //가이드
			}, 10000);
			blinkTimeouts.push(timer1);
	
	

	const clips = root.querySelectorAll('.clip');
	clips.forEach((item) => {
		item.classList.remove('motion');
	})


	root.querySelectorAll('.piece_wrap >div').forEach((item) => {
		item.style.top = '';
		item.style.left = '';
		item.style.transform = 'rotate(0deg)';
		item.classList.remove('drop');
	})

	root.querySelector('.piece_wrap').style.zIndex = '1';
	puzzleStart('one');
	puzzleStart('two');
	puzzleStart('three');
	clickOff();



}

/*****************************************************/
//가이드 관련시작
/*****************************************************/

//시간관련
var intervalId;

// 깜빡임 타이머들을 저장할 배열 -정지할때쓰임
var blinkTimeouts = [];
var blinkTimeouts2 = [];


function startGuide(guide) {
	// intervalId가 정의되어 있다면 clear 후 다시 setInterval 시작
	if (intervalId) {
		clearInterval(intervalId);
	}

	intervalId = setInterval(function () {
		toggleGuide(guide);
	}, 14000);
	blinkTimeouts.push(intervalId)
}

function stopGuide(guide, text) {
	// intervalId가 정의되어 있다면 clearInterval 실행
	if (intervalId) {
		clearInterval(intervalId);
	}

	// 모든 타임아웃 제거
	blinkTimeouts.forEach(timeout => clearTimeout(timeout));
	if (text == 'reset') {
		root.querySelector('#guideBox').classList.add('hide');
		root.querySelector(guide).classList.remove('hide');
		root.querySelector(guide).classList.remove('show');
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

	// 깜빡임을 토글하는 함수
	function toggleBlink(element) {

		element.style.display = 'block';
		root.querySelector('#guideBox').classList.remove('hide');
		element.classList.remove('motion');
		element.classList.remove('show');
		intervalId = setTimeout(function () {
			element.classList.add('show');
			intervalId = setTimeout(function () {
				element.classList.add('motion');

				intervalId = setTimeout(function () {
					root.querySelector('#guideBox').classList.add('hide');
					intervalId = setTimeout(function () {
						element.classList.remove('show');
						intervalId = setTimeout(function () {
							root.querySelector('#guideBox').classList.remove('hide');
							element.classList.remove('motion');
						}, 1500)
						blinkTimeouts.push(intervalId)
					}, 500)
					blinkTimeouts.push(intervalId)

				}, 3000)
				blinkTimeouts.push(intervalId)
			}, 500)
			blinkTimeouts.push(intervalId)
		}, 500)
		blinkTimeouts.push(intervalId)

	}
	// 3회의 깜빡거림 모션
	for (let i = 0; i < 1; i++) {
		blinkTimeouts.push(setTimeout(function () {
			toggleBlink(guide);
		}, i * 6000)); // 500밀리초마다 변경
	}


}
/*****************************************************/
//가이드 관련끝
/*****************************************************/


/*****************************************************/
//퍼즐 관련
/*****************************************************/

var pieceOffsetTop1;
var pieceOffsetLeft1;
var pieceOffsetTop2;
var pieceOffsetLeft2;
var dragCount;
var pieces;
var name;

function offset(text) {
	if (text == 'one') {
		// 초기 top 위치 값
		pieceOffsetTop1 = [0];
		// 초기 left 위치 값
		pieceOffsetLeft1 = [0];
		// 정위치의 top 값
		pieceOffsetTop2 = [-448, -448, -459];
		// 정위치의 left 값
		pieceOffsetLeft2 = [-168, 309, 794];
		// 드래그 완료 카운트
		dragCount = 0;
		pieces = root.querySelectorAll('.piece_wrap .piece0');
		name = '#dashBox1';
	} else if (text == 'two') {
		// 초기 top 위치 값
		pieceOffsetTop1 = [0];
		// 초기 left 위치 값
		pieceOffsetLeft1 = [0];
		// 정위치의 top 값
		pieceOffsetTop2 = [-444, -444, -463];
		// 정위치의 left 값
		pieceOffsetLeft2 = [-530, -51, 442];
		// 드래그 완료 카운트
		dragCount = 0;
		pieces = root.querySelectorAll('.piece_wrap .piece1');
		name = '#dashBox2';
	} else if (text == 'three') {
		// 초기 top 위치 값
		pieceOffsetTop1 = [0];
		// 초기 left 위치 값
		pieceOffsetLeft1 = [0];
		// 정위치의 top 값
		pieceOffsetTop2 = [-444, -444, -444];
		// 정위치의 left 값
		pieceOffsetLeft2 = [-942, -464, 16];
		// 드래그 완료 카운트
		dragCount = 0;
		pieces = root.querySelectorAll('.piece_wrap .piece2');
		name = '#dashBox3';
	}
}

//처음 드롭되었을때 
function offCon(name) {
	//드롭이 되었을때 이벤트영역 막음
	root.querySelector('#one').style.display = "block";
	root.querySelector('#two').style.display = "block";
	root.querySelector('#three').style.display = "block";	


	if (name == '#dashBox1') {
		root.querySelector('.triangle1').classList.add('show')
		root.querySelector('.triangle1-off').classList.remove('show')
		root.querySelector('.triangle2').classList.remove('show')
		root.querySelector('.triangle2-off').classList.add('show')
		root.querySelector('.triangle3').classList.remove('show')
		root.querySelector('.triangle3-off').classList.add('show')

	} else if (name == '#dashBox2') {
		root.querySelector('.triangle1').classList.remove('show')
		root.querySelector('.triangle1-off').classList.add('show')
		root.querySelector('.triangle2').classList.add('show')
		root.querySelector('.triangle2-off').classList.remove('show')
		root.querySelector('.triangle3').classList.remove('show')
		root.querySelector('.triangle3-off').classList.add('show')
	} else if (name == '#dashBox3') {
		root.querySelector('.triangle1').classList.remove('show')
		root.querySelector('.triangle1-off').classList.add('show')
		root.querySelector('.triangle2').classList.remove('show')
		root.querySelector('.triangle2-off').classList.add('show')
		root.querySelector('.triangle3').classList.add('show')
		root.querySelector('.triangle3-off').classList.remove('show')
	}
}

//드롭이 끝났을때
var data = [];

function clickOff(name) {

	if (name == '#dashBox1') {
		data.push('one');
	} else if (name == '#dashBox2') {
		data.push('two');
	} else if (name == '#dashBox3') {
		data.push('three');
	} else {
		data = []; //초기화
	}




	// 모든 클래스가 "click_box"인 요소를 선택합니다.
	var elements = root.querySelectorAll(".click_box");
	var imgs = root.querySelectorAll(".piece_wrap > div");

	// elements를 배열로 변환하여 필요한 요소를 선택합니다.
	for (var i = 0; i < elements.length; i++) {
		var id = elements[i].id;
		if (data.indexOf(id) === -1) {
			// data 배열에 해당 아이디가 없는 경우
			elements[i].style.display = "none"; // 예시로 스타일을 변경합니다.
			imgs[i].childNodes[1].classList.remove('show')
			imgs[i].childNodes[3].classList.add('show')
		} else {
			imgs[i].childNodes[1].classList.add('show')
			imgs[i].childNodes[3].classList.remove('show')
		}
	}



}
if (data.length === 3) {
	data = []; //초기화

}

//라인관련
function showdash(text, name) {
	if (text == 'hide') {
		root.querySelectorAll('.dashBox').forEach((item) => {
			item.classList.remove('show');
			item.classList.add('hide');
		})
	} else if (text == 'show') {
		root.querySelector(name).classList.add('show');
		root.querySelector(name).classList.remove('hide');

	}
}

function puzzleStart(text) {
	offset(text); //기본값

	pieces.forEach(function (piece) {
		piece.addEventListener('mousedown', startDrag);
		piece.addEventListener('touchstart', startDrag);

		function startDrag(event) {
			event.preventDefault(); // 기본 동작 방지
			// 현재 실행 중인 모든 타이머를 제거하여 깜빡임을 멈춘다
			stopGuide('#guide');


			piece.addEventListener('wheel', zoom);
			piece.addEventListener('keydown', handleKeydown);
			root.querySelector('.piece_wrap').style.zIndex = '3';
				stopGuide('#guide', 'reset'); //가이드


			console.log(piece.classList[0])
			if (piece.classList[0] == 'piece0') {
				offset('one')
			} else if (piece.classList[0] == 'piece1') {
				offset('two')
			} else if (piece.classList[0] == 'piece2') {
				offset('three')
			}

			// 이벤트 시작 시 현재 위치 저장
			var startX, startY;
			if (event.type === 'mousedown') {
				startX = event.clientX;
				startY = event.clientY;
			} else if (event.type === 'touchstart') {
				startX = event.touches[0].clientX;
				startY = event.touches[0].clientY;
			}

			var startTop = parseInt(window.getComputedStyle(this).getPropertyValue('top'));
			var startLeft = parseInt(window.getComputedStyle(this).getPropertyValue('left'));

			// 마우스/터치 이동 이벤트 추가

			// 마우스/터치 이동 이벤트 추가
			function movePiece(moveEvent) {
				moveEvent.preventDefault(); // 기본 동작 방지
				root.querySelector('footer').style.display = 'none';
				root.querySelector('footer').style.opacity = '0';
				stopGuide('#guide');

				var diffX, diffY;
				if (moveEvent.type === 'mousemove') {
					diffX = moveEvent.clientX - startX;
					diffY = moveEvent.clientY - startY;
				} else if (moveEvent.type === 'touchmove') {
					diffX = moveEvent.touches[0].clientX - startX;
					diffY = moveEvent.touches[0].clientY - startY;
				}

				// 스케일링된 요소의 크기와 위치에 맞게 위치를 조정합니다.
				var scaledDiffX = diffX;
				var scaledDiffY = diffY;


				// piece 요소의 현재 위치와 크기 정보를 가져옵니다.
				var rect = piece.getBoundingClientRect();
				var originalWidth = rect.width;
				var originalHeight = rect.height;
				var originalLeft = (rect.x - rect.left) * (piece.offsetWidth / rect.width) - parseInt(getComputedStyle(piece).borderLeftWidth);
				var originalTop = (rect.y - rect.top) * (piece.offsetHeight / rect.height) - parseInt(getComputedStyle(piece).borderTopWidth);

				// 스케일링된 위치로 새로운 위치를 계산합니다.
				var newLeft = originalLeft + scaledDiffX;
				var newTop = originalTop + scaledDiffY;

				// 스케일링된 비율에 따라 위치를 업데이트합니다.
				piece.style.left = ((newLeft - originalLeft) * (piece.offsetWidth / originalWidth)) + 'px';
				piece.style.top = ((newTop - originalTop) * (piece.offsetHeight / originalHeight)) + 'px';




			}

			function zoom() {
				console.log(dragCount)
				piece.removeEventListener('mouseup', startDrag);
				piece.removeEventListener('touchend', startDrag);
				root.removeEventListener('mousemove', movePieceListener);
				root.removeEventListener('touchmove', movePieceListener);


				// 모든 요소들을 선택합니다.
				const allPieces = root.querySelectorAll('.piece');
				// drop 클래스가 없는 요소들을 필터링합니다.
				const piecesWithoutDrop = Array.from(allPieces).filter(piece => !piece.classList.contains('drop'));
				// 필터링된 요소들을 출력합니다.
				piecesWithoutDrop.forEach(piece_d => {
					piece_d.style.left = '0px';
					piece_d.style.top = '0px'
				});

			}

			function handleKeydown(event) {
				if (event.ctrlKey) {
					if (event.key === '+' || event.key === '=' || event.key === '-' || event.key === '0') {
						console.log('Zoom function triggered'); // 콘솔에 로그를 출력합니다.
						zoom();
						// 여기에 줌 인/아웃 로직을 추가하세요.
					}
				}
			}



			// 마우스/터치 이동 이벤트 등록
			var movePieceListener = movePiece.bind(this);
			root.addEventListener('mousemove', movePieceListener);
			root.addEventListener('touchmove', movePieceListener);

			// 마우스/터치 이벤트 종료 시 동작
			function endDrag() {
				root.removeEventListener('mouseup', endDrag);
				root.removeEventListener('touchend', endDrag);
				root.removeEventListener('mousemove', movePieceListener);
				root.removeEventListener('touchmove', movePieceListener);

				root.querySelector('.piece_wrap').style.zIndex = '1';
				


				var _thisNum = parseInt(piece.getAttribute('data-num'));
				var uiPosition = {
					top: parseInt(piece.style.top),
					left: parseInt(piece.style.left)
				};
				if (
					uiPosition.top > pieceOffsetTop2[0] - 300 &&
					uiPosition.top < pieceOffsetTop2[0] + 300 &&
					uiPosition.left > pieceOffsetLeft2[0] - 220 &&
					uiPosition.left < pieceOffsetLeft2[0] + 220
				) {
					showdash('hide'); //라인관련
					offCon(name); //드롭시 막기
					showdash('show', name); //라인관련
					drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 0, name)

					////////////////////실행순서 시작////////////////////
					const motion = setTimeout(function () {
						drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 1, name)

						const motion = setTimeout(function () {
							drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 2, name)

							const motion = setTimeout(function () {
								piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
								piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';
								piece.style.transform = 'rotate(0deg)';
								clickOff(name);
							}, 2500)
							blinkTimeouts2.push(motion);
						}, 2500)
						blinkTimeouts2.push(motion);
					}, 2500);
					blinkTimeouts2.push(motion);
					////////////////////실행순서 종료////////////////////
				} else if (
					uiPosition.top > pieceOffsetTop2[1] - 300 &&
					uiPosition.top < pieceOffsetTop2[1] + 300 &&
					uiPosition.left > pieceOffsetLeft2[1] - 150 &&
					uiPosition.left < pieceOffsetLeft2[1] + 220
				) {
					showdash('hide'); //라인관련
					offCon(name); //드롭시 막기
					showdash('show', name); //라인관련
					drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 1, name)

					////////////////////실행순서 시작////////////////////
					const motion = setTimeout(function () {
						drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 0, name)
						const motion = setTimeout(function () {
							drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 2, name)
							const motion = setTimeout(function () {
								piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
								piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';
								piece.style.transform = 'rotate(0deg)';
								clickOff(name);
							}, 2500)
							blinkTimeouts2.push(motion);
						}, 2500)
						blinkTimeouts2.push(motion);
					}, 2500);
					blinkTimeouts2.push(motion);
					////////////////////실행순서 종료////////////////////
				} else if (
					uiPosition.top > pieceOffsetTop2[2] - 300 &&
					uiPosition.top < pieceOffsetTop2[2] + 300 &&
					uiPosition.left > pieceOffsetLeft2[2] - 180 &&
					uiPosition.left < pieceOffsetLeft2[2] + 180
				) {
					showdash('hide'); //라인관련
					offCon(name); //드롭시 막기
					showdash('show', name); //라인관련
					drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 2, name)

					////////////////////실행순서 시작////////////////////
					const motion = setTimeout(function () {
						drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 0, name)
						const motion = setTimeout(function () {
							drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 1, name)
							const motion = setTimeout(function () {
								piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
								piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';
								piece.style.transform = 'rotate(0deg)';
								clickOff(name);
							}, 2500)
							blinkTimeouts2.push(motion);
						}, 2500)
						blinkTimeouts2.push(motion);
					}, 2500);
					blinkTimeouts2.push(motion);
					////////////////////실행순서 종료////////////////////
				} else {
					piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
					piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';
				}
			}

			// 마우스/터치 이벤트 종료 이벤트 등록
			root.addEventListener('mouseup', endDrag);
			root.addEventListener('touchend', endDrag);

			// 요소에 포커스 설정
			piece.focus();
		}
	});
}

//아래함수설명- 하나의 퍼즐이 3가지 위치값으로 갈수있도록
function drop_custom1(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, _thisNum, name) {

	piece.style.top = pieceOffsetTop2[_thisNum] + 'px';
	piece.style.left = pieceOffsetLeft2[_thisNum] + 'px';
	piece.classList.add('drop');

	piece.removeEventListener('mousedown', startDrag);
	piece.removeEventListener('touchstart', startDrag);
	dragCount++;
	//////////////////////////////
	//드롭시 선밑으로
	//root.querySelector('.angleBox').style.zIndex = 1;
	//드롭시 모션

	if (_thisNum == 0) {
		piece.style.transform = 'rotate(0deg)';

		const time = setTimeout(function () {

			root.querySelector(name + ' .clip1').classList.add('motion');
		}, 500)
		blinkTimeouts2.push(time);
	} else if (_thisNum == 1) {
		piece.style.transform = 'rotate(0deg)';

		const time = setTimeout(function () {
			root.querySelector(name + ' .clip2').classList.add('motion');
		}, 500)
		blinkTimeouts2.push(time);
	} else if (_thisNum == 2) {
		piece.style.transform = 'rotate(-15deg)';

		const time = setTimeout(function () {
			root.querySelector(name + ' .clip3').classList.add('motion');
		}, 500)
		blinkTimeouts2.push(time);

	}
}




function startPop(text) {

	if (text == 'start') {
		const timer = setTimeout(function () {
			root.querySelector('footer').style.display = 'block';
			root.querySelector('footer').style.opacity = '1';

			const timer = setTimeout(function () {
				root.querySelector('footer').style.display = 'none';
				root.querySelector('footer').style.opacity = '0';

				toggleGuide('#guide'); //가이드
				startGuide('#guide'); //가이드
			}, 2000);
			blinkTimeouts2.push(timer);
		}, 0);


		blinkTimeouts2.push(timer);


	} else if (text == 'end') {
		root.querySelector('footer').style.opacity = '0';
		root.querySelector('footer').style.display = 'none';
	}




}



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
		//toggleGuide('#guide'); //가이드
		//startGuide('#guide'); //가이드
		puzzleStart('one');
		puzzleStart('two');
		puzzleStart('three');
		startPop('start');
		//		clickEvent(); //클릭이벤트

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
