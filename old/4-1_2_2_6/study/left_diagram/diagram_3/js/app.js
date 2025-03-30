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
//var game_ing = 0; //게임 진행사항
var motioner1;
var motioner2;
var motioner3;

/*****************************************************/
//리셋
/*****************************************************/

function onClickReset() { //전체 리셋
	toggleGuide('#guide'); //가이드
	startGuide('#guide'); //가이드
	stopGuide2();
	startPop('end');
	stopGuide('#guide', 'reset'); //가이드



//	clearTimeout(motioner1); //실행중인모션정지
//	clearTimeout(motioner2); //실행중인모션정지//실행중인모션정지
//	clearTimeout(motioner3); //실행중인모션정지


	root.querySelector('.protractor').classList.remove('drop');
	root.querySelector('.protractor .piece0').classList.remove('drop');

	var nums = root.querySelectorAll('.num');
		nums.forEach(function (num) {
			num.classList.remove('show');
			num.classList.remove('hide');
			root.querySelector('.pink').classList.remove('show');
			root.querySelector('.blue').classList.remove('show');
			root.querySelector('.green').classList.remove('show');

			root.querySelector('.piece0 img').style.transform = 'rotate(-0deg)';

		});

	root.querySelector('.piece0').style.top = '';
	root.querySelector('.piece0').style.left = '';
	puzzleStart();


	//game_ing = 0; //게임진행사항


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
	var pieceOffsetTop2 = [-468, -470, -446];
	// 정위치의 left 값
	var pieceOffsetLeft2 = [-635, -159, 322];
	// 드래그 완료 카운트
	var dragCount = 0;

	var pieces = root.querySelectorAll('.piece_wrap > div');
	pieces.forEach(function (piece) {
		piece.addEventListener('mousedown', startDrag);
		piece.addEventListener('touchstart', startDrag);

		function startDrag(event) {
			event.preventDefault(); // 기본 동작 방지
			// 현재 실행 중인 모든 타이머를 제거하여 깜빡임을 멈춘다
			stopGuide('#guide');
			startPop('end');
			//			clearTimeout(timer); //푸터제거
			root.querySelector('.angle1').style.zIndex = '0';
			root.querySelector('.angle2').style.zIndex = '0';
			root.querySelector('.angle3').style.zIndex = '0';
			//			root.querySelector('.protractor').style.zIndex = '0';

			piece.addEventListener('wheel', zoom);
			piece.addEventListener('keydown', handleKeydown);


			// 클릭된 퍼즐은 젤위로
			//			const targetParent = event.target.parentElement;

			// 해당 요소의 부모 요소의 zIndex를 2로 설정
			//			drag_num++;
			//
			//			if (targetParent.className !== 'piece_wrap') {
			//				targetParent.style.zIndex = drag_num;
			//			}



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
					uiPosition.top > pieceOffsetTop2[0] - 250 &&
					uiPosition.top < pieceOffsetTop2[0] + 250 &&
					uiPosition.left > pieceOffsetLeft2[0] - 250 &&
					uiPosition.left < pieceOffsetLeft2[0] + 350
				) {
					drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 0)
					////////////////////실행순서 시작////////////////////
					const time = setTimeout(function () {
						num_hide(1); //숫자사라짐
						drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 1)
						const time = setTimeout(function () {
							num_hide(2); //숫자사라짐
							drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 2)
							const time = setTimeout(function () {

								num_hide(3); //숫자사라짐
								piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
								piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';
								root.querySelector('.piece0 img').style.transform = 'rotate(0deg)';
							}, 3000)
							blinkTimeouts2.push(time);
						}, 3000)
						blinkTimeouts2.push(time);
					}, 3000);
					blinkTimeouts2.push(time);
					////////////////////실행순서 종료////////////////////
				} else if (
					uiPosition.top > pieceOffsetTop2[1] - 250 &&
					uiPosition.top < pieceOffsetTop2[1] + 250 &&
					uiPosition.left > pieceOffsetLeft2[1] - 250 &&
					uiPosition.left < pieceOffsetLeft2[1] + 350
				) {

					drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 1)
					////////////////////실행순서 시작////////////////////
					const time = setTimeout(function () {
						num_hide(2); //숫자사라짐
						drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 0)
						const time = setTimeout(function () {
							num_hide(1); //숫자사라짐
							drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 2)
							const time = setTimeout(function () {
								num_hide(3); //숫자사라짐
								piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
								piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';
								root.querySelector('.piece0 img').style.transform = 'rotate(0deg)';
							}, 3000)
							blinkTimeouts2.push(time);
						}, 3000)
						blinkTimeouts2.push(time);
					}, 3000);
					blinkTimeouts2.push(time);
					////////////////////실행순서 종료////////////////////
				} else if (
					uiPosition.top > pieceOffsetTop2[2] - 250 &&
					uiPosition.top < pieceOffsetTop2[2] + 250 &&
					uiPosition.left > pieceOffsetLeft2[2] - 250 &&
					uiPosition.left < pieceOffsetLeft2[2] + 350
				) {

					drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 2)
					////////////////////실행순서 시작////////////////////
					const time = setTimeout(function () {
						num_hide(3); //숫자사라짐
						drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 0)
						root.querySelector('.piece0 img').style.transform = 'rotate(0deg)';
						const time = setTimeout(function () {
							num_hide(1); //숫자사라짐
							drop_custom(piece, pieceOffsetTop2, pieceOffsetLeft2, startDrag, dragCount, 1)
							const time = setTimeout(function () {
								num_hide(2); //숫자사라짐
								piece.style.top = pieceOffsetTop1[_thisNum] + 'px';
								piece.style.left = pieceOffsetLeft1[_thisNum] + 'px';
							}, 3000)
							blinkTimeouts2.push(time);
						}, 3000)
						blinkTimeouts2.push(time);
					}, 3000);
					blinkTimeouts2.push(time);
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
	root.querySelector('.protractor').classList.add('drop');
	root.querySelector('.protractor .piece0').classList.add('drop');
	const num_num = _thisNum;
	if (num_num == 0) {
		root.querySelector('.angle1').style.zIndex = '1';
		root.querySelector('.angle2').style.zIndex = '1';
		root.querySelector('.angle3').style.zIndex = '1';
	} else if (num_num == 1) {
		root.querySelector('.angle1').style.zIndex = '1';
		root.querySelector('.angle2').style.zIndex = '1';
		root.querySelector('.angle3').style.zIndex = '1';
	} else if (num_num == 2) {
		root.querySelector('.angle1').style.zIndex = '1';
		root.querySelector('.angle2').style.zIndex = '1';
		root.querySelector('.angle3').style.zIndex = '1';
	}
	//	root.querySelector('.protractor').style.zIndex = '0';





	piece.style.top = pieceOffsetTop2[_thisNum] + 'px';
	piece.style.left = pieceOffsetLeft2[_thisNum] + 'px';

	piece.removeEventListener('mousedown', startDrag);
	piece.removeEventListener('touchstart', startDrag);
	dragCount++;
	//////////////////////////////
	//드롭시 선밑으로
	root.querySelector('.angleBox').style.zIndex = 1;
	//드롭시 모션
	var num1 = root.querySelectorAll('.num1 > .num');
	var num2 = root.querySelectorAll('.num2 > .num');
	var num3 = root.querySelectorAll('.num3 > .num');
	root.querySelector('.angleBox').style.zIndex = '1';

	if (_thisNum == 0) {
		const time = setTimeout(function () {
			num1.forEach(function (nums, index) {
				const time = setTimeout(function () {
					nums.classList.add('show');
					if (index == 7) {
						const time = setTimeout(function () {
							root.querySelector('.pink').classList.add('show');

						}, 300);
						blinkTimeouts2.push(time);
					}
				}, 200 * index); // 각 요소마다 0.5초씩 딜레이를 가지도록 설정
				blinkTimeouts2.push(time);
			});
		}, 500);
		blinkTimeouts2.push(time);
	} else if (_thisNum == 1) {
		const time = setTimeout(function () {
			num2.forEach(function (nums, index) {
				const time = setTimeout(function () {
					nums.classList.add('show');
					if (index == 4) {
						const time = setTimeout(function () {
							root.querySelector('.blue').classList.add('show');
						}, 300);
						blinkTimeouts2.push(time);
					}
				}, 200 * index); // 각 요소마다 0.5초씩 딜레이를 가지도록 설정
				blinkTimeouts2.push(time);
			});
		}, 500);
		blinkTimeouts2.push(time);
	} else if (_thisNum == 2) {
		root.querySelector('.piece0 img').style.transform = 'rotate(-15deg)';
		const time = setTimeout(function () {

			num3.forEach(function (nums, index) {
				const time = setTimeout(function () {
					nums.classList.add('show');
					if (index == 3) {
						const time = setTimeout(function () {
							root.querySelector('.green').classList.add('show');
						}, 300);
						blinkTimeouts2.push(time);
					}
				}, 200 * index); // 각 요소마다 0.5초씩 딜레이를 가지도록 설정
				blinkTimeouts2.push(time);
			});
		}, 500);
		blinkTimeouts2.push(time);
	}

}

function num_hide(num_num) {
	var nums = root.querySelectorAll('.num' + (num_num) + ' .num');
	nums.forEach(function (num) {
		num.classList.remove('show');
		num.classList.add('hide');
	});
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

function stopGuide2(guide, text) {

	// 모든 타임아웃 제거
	blinkTimeouts2.forEach(timeout => clearTimeout(timeout));


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

				}, 1500)
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



function startPop(text) {

	if (text == 'start' || text == 'reset') {
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
	// 부모에게서 받은 reset 요청 처리
	root.reset = ()=> {onClickReset()}
	root.autoScale = ()=> {autoScale()}
	root.showAngle = () => {
		//pink numBOx
		root.querySelectorAll('.numBOx').forEach((box)=>{
			box.classList.add('show');
		})
	}
});
