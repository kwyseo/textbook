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
//var game_ing = 0; //게임 진행사항
var motioner1;
var motioner2;
var motioner3;
var motioner4;

/*****************************************************/
//리셋
/*****************************************************/

function onClickReset() { //전체 리셋
	stopGuide2();
	startPop('end')
	stopGuide3();
//	startPop('reset');
	
	const timer = setTimeout(function () {
				toggleGuide('#guide'); //가이드
				startGuide('#guide'); //가이드
			}, 10000);
			blinkTimeouts2.push(timer);
	

	//		toggleGuide('#guide'); //가이드
	stopGuide('#guide', 'reset'); //가이드
	root.querySelector('.square').classList.remove('noClick');


	clearTimeout(motioner1); //실행중인모션정지
	clearTimeout(motioner2); //실행중인모션정지//실행중인모션정지
	clearTimeout(motioner3); //실행중인모션정지
	clearTimeout(motioner4); //실행중인모션정지
	puzzleStart();

	root.querySelector('#pencilBox').className = "";
	root.querySelector('#pencil').className = "";
	root.querySelector('#clip1').className = "";
	root.querySelector('#clip1').className = "";
	root.querySelector('#clip2').className = "";
	root.querySelector('#clip2').className = "";
	root.querySelector('#clip3').className = "";
	root.querySelector('#clip3').className = "";
	root.querySelector('.angle1').className = "angle angle1";
	root.querySelector('.angle2').className = "angle angle2";
	root.querySelector('.angle3').className = "angle angle3";
	root.querySelector('.piece0').style.transform = 'rotate(0deg)';
	root.querySelector('.piece0').classList.remove('motion');

	root.querySelector('.piece0').style.top = '';
	root.querySelector('.piece0').style.left = '';
	root.querySelector('.piece0').classList.remove('drop');
	console.log(motioner1)

	console.log(motioner1)
	//game_ing = 0; //게임진행사항
	// SEO
	root.querySelector('#lineBox').style.display = "none";
}

/*****************************************************/
//퍼즐 관련
/*****************************************************/


var drag_num = 2; //클릭된 퍼즐 최상단으로 올림zindex

function puzzleStart() {
	// 초기 top 위치 값
	var pieceOffsetTop1 = [0];
	// 초기 left 위치 값
	var pieceOffsetLeft1 = [0];
	// 정위치의 top 값
	var pieceOffsetTop2 = [-463, -464, -484];
	// 정위치의 left 값
	var pieceOffsetLeft2 = [-479, 0, 477];
	// 드래그 완료 카운트
	var dragCount = 0;
	var pieces = root.querySelectorAll('.piece_wrap > div');
	pieces.forEach(function (piece) {
		piece.addEventListener('mousedown', startDrag);
		piece.addEventListener('touchstart', startDrag);



		root.querySelector('.square').classList.remove('noClick');

		function startDrag(event) {
			event.preventDefault(); // 기본 동작 방지
			// 현재 실행 중인 모든 타이머를 제거하여 깜빡임을 멈춘다
			stopGuide('#guide');

			piece.addEventListener('wheel', zoom);
			piece.addEventListener('keydown', handleKeydown);

			stopGuide2();
			startPop('end')


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
			function movePiece(moveEvent) {
				moveEvent.preventDefault(); // 기본 동작 방지

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

				var _thisNum = parseInt(piece.getAttribute('data-num'));
				var uiPosition = {
					top: parseInt(piece.style.top),
					left: parseInt(piece.style.left)
				};
				if (
					uiPosition.top > pieceOffsetTop2[0] - 300 &&
					uiPosition.top < pieceOffsetTop2[0] + 350 &&
					uiPosition.left > pieceOffsetLeft2[0] - 330 &&
					uiPosition.left < pieceOffsetLeft2[0] + 130
				) {
					drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 0)
					root.querySelector('.piece0').classList.add('motion');
					root.querySelector('.square').classList.add('noClick');
					////////////////////실행순서 시작////////////////////
					motioner1 = setTimeout(function () {
						drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 1)
						motioner2 = setTimeout(function () {
							drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 2)
							motioner3 = setTimeout(function () {
								piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
								piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';
								root.querySelector('.piece0').style.transform = 'rotate(0deg)';

								root.querySelector('.piece0').classList.remove('motion');
							}, 4600)
							blinkTimeouts3.push(motioner3);
						}, 4600)
							blinkTimeouts3.push(motioner2);
					}, 4600);
							blinkTimeouts3.push(motioner1);
					////////////////////실행순서 종료////////////////////
				} else if (
					uiPosition.top > pieceOffsetTop2[1] - 300 &&
					uiPosition.top < pieceOffsetTop2[1] + 350 &&
					uiPosition.left > pieceOffsetLeft2[1] - 120 &&
					uiPosition.left < pieceOffsetLeft2[1] + 170
				) {

					drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 1)

					root.querySelector('.piece0').classList.add('motion');
					////////////////////실행순서 시작////////////////////
					motioner1 = setTimeout(function () {
						drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 0)
						motioner2 = setTimeout(function () {
							drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 2)
							motioner3 = setTimeout(function () {
								piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
								piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';
								root.querySelector('.piece0').style.transform = 'rotate(0deg)';

								root.querySelector('.piece0').classList.remove('motion');
								root.querySelector('.square').classList.add('noClick');
							}, 4600)
							blinkTimeouts3.push(motioner3);
						}, 4600)
							blinkTimeouts3.push(motioner2);
					}, 4600);
							blinkTimeouts3.push(motioner1);
					////////////////////실행순서 종료////////////////////
				} else if (
					uiPosition.top > pieceOffsetTop2[2] - 300 &&
					uiPosition.top < pieceOffsetTop2[2] + 350 &&
					uiPosition.left > pieceOffsetLeft2[2] - 120 &&
					uiPosition.left < pieceOffsetLeft2[2] + 350
				) {

					drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 2)

					root.querySelector('.piece0').classList.add('motion');
					root.querySelector('.square').classList.add('noClick');
					////////////////////실행순서 시작////////////////////
					motioner1 = setTimeout(function () {
						drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 0)
						root.querySelector('.piece0').style.transform = 'rotate(0deg)';
						motioner2 = setTimeout(function () {
							drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 1)
							motioner3 = setTimeout(function () {
								piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
								piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';

								root.querySelector('.piece0').classList.remove('motion');
							}, 4600)
							blinkTimeouts3.push(motioner3);
						}, 4600)
							blinkTimeouts3.push(motioner2);
					}, 4600);
						blinkTimeouts3.push(motioner1);
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
function drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, _thisNum) {
	piece.classList.add('drop')
	piece.style.top = pieceOffsetTop2[_thisNum] + 'px';
	piece.style.left = pieceOffsetLeft2[_thisNum] + 'px';

	piece.removeEventListener('mousedown', startDrag);
	piece.removeEventListener('touchstart', startDrag);
	dragCount++;
	//////////////////////////////
	//드롭시 선밑으로
	//root.querySelector('.angleBox').style.zIndex = 1;
	//드롭시 모션
	// SEO
	root.querySelector('#lineBox').style.display = "block";
	if (_thisNum == 0) {
		motioner4 = setTimeout(function () {
			root.querySelector('#pencilBox').classList.add('show');
			root.querySelector('#pencil').classList.add('motion1');

			motioner4 = setTimeout(function () {
				root.querySelector('#clip1').classList.add('motion2');
				root.querySelector('#pencil').classList.add('motion2');
				motioner4 = setTimeout(function () {
					root.querySelector('#clip1').classList.add('motion3');
					root.querySelector('#pencil').classList.add('motion3');
					motioner4 = setTimeout(function () {
						root.querySelector('.angle1').classList.add('show');
						root.querySelector('#pencilBox').classList.remove('show');
						motioner4 = setTimeout(function () {
							root.querySelector('#pencil').className = "";
						}, 500);
						blinkTimeouts3.push(motioner4);
					}, 1500);
					blinkTimeouts3.push(motioner4);
				}, 1500);
				blinkTimeouts3.push(motioner4);
			}, 500);
			blinkTimeouts3.push(motioner4);
		}, 500);
		blinkTimeouts3.push(motioner4);

	} else if (_thisNum == 1) {

		motioner4 = setTimeout(function () {
			root.querySelector('#pencilBox').classList.add('show');
			root.querySelector('#pencil').classList.add('motion4');
			motioner4 = setTimeout(function () {
				root.querySelector('#clip2').classList.add('motion5');
				root.querySelector('#pencil').classList.add('motion5');
				motioner4 = setTimeout(function () {
					root.querySelector('#clip2').classList.add('motion6');
					root.querySelector('#pencil').classList.add('motion6');
					motioner4 = setTimeout(function () {
						root.querySelector('.angle2').classList.add('show');
						root.querySelector('#pencilBox').classList.remove('show');
						motioner4 = setTimeout(function () {
							root.querySelector('#pencil').className = "";
						}, 500);
						blinkTimeouts3.push(motioner4);
					}, 1500);
					blinkTimeouts3.push(motioner4);
				}, 1500);
				blinkTimeouts3.push(motioner4);
			}, 500);
			blinkTimeouts3.push(motioner4);
		}, 500);
		blinkTimeouts3.push(motioner4);
	} else if (_thisNum == 2) {
		motioner4 = setTimeout(function () {
			root.querySelector('.piece0').style.transform = 'rotate(-15deg)';
			root.querySelector('#pencilBox').classList.add('show');
			root.querySelector('#pencil').classList.add('motion7');
			motioner4 = setTimeout(function () {
				root.querySelector('#clip3').classList.add('motion8');
				root.querySelector('#pencil').classList.add('motion8');
				motioner4 = setTimeout(function () {
					root.querySelector('#clip3').classList.add('motion9');
					root.querySelector('#pencil').classList.add('motion9');
					motioner4 = setTimeout(function () {
						root.querySelector('.angle3').classList.add('show');
						root.querySelector('#pencilBox').classList.remove('show');
						motioner4 = setTimeout(function () {
							root.querySelector('#pencil').className = "";
						}, 500);
						blinkTimeouts3.push(motioner4);
					}, 1500);
					blinkTimeouts3.push(motioner4);
				}, 1500);
				blinkTimeouts3.push(motioner4);
			}, 500);
			blinkTimeouts3.push(motioner4);
		}, 500);
		blinkTimeouts3.push(motioner4);

	}
}

/*****************************************************/
//가이드 관련시작
/*****************************************************/

//시간관련
var intervalId;

// 깜빡임 타이머들을 저장할 배열 -정지할때쓰임
var blinkTimeouts = [];
var blinkTimeouts2 = []; //하단팝업
var blinkTimeouts3 = []; //연필모션


function startGuide(guide) {
	// intervalId가 정의되어 있다면 clear 후 다시 setInterval 시작
	if (intervalId) {
		clearInterval(intervalId);
	}

	intervalId = setInterval(function () {
		toggleGuide(guide);
	}, 7000);
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

function stopGuide2(guide, text) {

	// 모든 타임아웃 제거
	blinkTimeouts2.forEach(timeout => clearTimeout(timeout));


}

function stopGuide3() {

	// 모든 타임아웃 제거
	blinkTimeouts3.forEach(timeout => clearTimeout(timeout));


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


	}else if (text == 'reset') {
		const timer1 = setTimeout(function () {
				root.querySelector('footer').style.display = 'block';
				root.querySelector('footer').style.opacity = '1';
			}, 10000);
			blinkTimeouts2.push(timer1);
	} else if (text == 'end') {
		root.querySelector('footer').style.opacity = '0';
		root.querySelector('footer').style.display = 'none';
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

	//	clickEvent(); //클릭이벤트
	puzzleStart();
	startPop('start');



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
	// SEO
	root.querySelector('#lineBox').style.display = "none";
	// 부모에게서 받은 reset 요청 처리
	root.reset = ()=> {onClickReset()}
	root.autoScale = ()=> {autoScale()}
});
