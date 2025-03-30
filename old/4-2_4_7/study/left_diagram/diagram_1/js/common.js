import { Ukp } from "./default.js";

var ukp__js_content = {
    current_title: 0,
    current_character: 0,
    clone_cnt: 0,
    z_index_cnt: 1,
    drag_element: {
        bool: false,
        cla: "",
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        rotate: 0,
        move_bool: false,
        current_x: 0,
        current_y: 0
    },
    title: [
        ["", "모양 조각", ""],
        ["모양 조각", "모양 조각", "칠교 조각"],
        ["모양 채우기", "칠교 조각", "모양 조각"]
    ],
    character: [
        [
            "회전 버튼으로 조각을 돌릴 수 있어요.",
            "오른쪽의 조각을 왼쪽으로 옮겨 보세요.",
            "왼쪽의 조각을 오른쪽으로 옮기면 사라져요."
        ],
        [
            "회전 버튼으로 조각을 돌릴 수 있어요.",
            "오른쪽의 조각을 왼쪽으로 옮겨 보세요.",
            "왼쪽의 조각을 오른쪽으로 옮기면 사라져요."
        ],
        [
            "회전 버튼으로 조각을 돌릴 수 있어요.",
            "오른쪽의 조각을 왼쪽으로 옮겨 보세요."
        ]
    ],
    init: function (root) {
        //전체화면
        ukp__js_wrap.find(".ukp__js_content_full").addEventListener("click", function () {
            if (ukp__js_content.fullscreen_bool) {
                document.exitFullscreen();
            } else {
                ukp__js_wrap.find(".ukp__js_wrap_box").requestFullscreen();
            }
        });
        document.addEventListener("fullscreenchange", function (e) {
            if (document.fullscreenElement) {
                ukp__js_content.fullscreen_bool = true;
                var src = ukp__js_wrap.attr(".ukp__js_content_full", "src");
                ukp__js_wrap.attr(".ukp__js_content_full", "src", src.replace("-on.png", "-off.png"));
            } else {
                ukp__js_content.fullscreen_bool = false;
                var src = ukp__js_wrap.attr(".ukp__js_content_full", "src");
                ukp__js_wrap.attr(".ukp__js_content_full", "src", src.replace("-off.png", "-on.png"));
            }
        });
        if (navigator.userAgent.match(/iPhone|iPad|iPod/) !== null || (navigator.userAgent.match(/Mac OS X/) !== null && navigator.maxTouchPoints > 0)) {
            ukp__js_wrap.css(".ukp__js_content_full", "pointer-events", "none");
            ukp__js_wrap.css(".ukp__js_content_full", "opacity", "0");
        }
        //초기화
        ukp__js_wrap.find(".ukp__js_content_reset").addEventListener("click", function () {
            ukp__js_content.reset(root);
        });
        ukp__js_content.change_title();
        //드래그
        window.addEventListener("touchmove", ukp__js_content.move);
        window.addEventListener("touchend", ukp__js_content.end);
        window.addEventListener("mousemove", ukp__js_content.move);
        window.addEventListener("wheel", ukp__js_content.move);
        window.addEventListener("mouseup", ukp__js_content.end);
        ukp__js_wrap.find(".ukp__js_content_svg_0").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_0").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_1").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_1").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_2").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_2").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_3").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_3").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_4").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_4").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_5").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_5").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_6").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_6").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_7").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_7").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_8").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_8").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_9").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_9").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_10").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_10").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_11").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_11").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_12").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_12").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_13").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_13").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_14").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_14").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_15").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_15").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_16").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_16").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_17").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_17").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_18").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_svg_18").addEventListener("mousedown", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_rotate_btn").addEventListener("touchstart", ukp__js_content.start);
        ukp__js_wrap.find(".ukp__js_content_rotate_btn").addEventListener("mousedown", ukp__js_content.start);
        //타이틀
        ukp__js_wrap.find(".ukp__js_content_left").addEventListener("click", function () {
            ukp__js_content.current_title = ukp__js_content.current_title == 0 ? (ukp__js_content.title.length - 1) : ukp__js_content.current_title - 1;
            ukp__js_content.change_title();
        });
        ukp__js_wrap.find(".ukp__js_content_right").addEventListener("click", function () {
            ukp__js_content.current_title = (ukp__js_content.current_title + 1) % ukp__js_content.title.length;
            ukp__js_content.change_title();
        });
        //타이틀 설명
        ukp__js_wrap.find(".ukp__js_content_character_text").innerHTML = ukp__js_content.character[ukp__js_content.current_title][ukp__js_content.current_character];
        ukp__js_wrap.find(".ukp__js_content_character_btn_off").addEventListener("click", function () {
            ukp__js_wrap.hide(".ukp__js_content_character_btn_off");
            ukp__js_wrap.show(".ukp__js_content_character_btn_on");
            ukp__js_content.current_character = 0;
            ukp__js_wrap.find(".ukp__js_content_character_text").innerHTML = ukp__js_content.character[ukp__js_content.current_title][ukp__js_content.current_character];
            ukp__js_wrap.add_class(".ukp__js_content_small_left", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_small_right", "ukp__disabled");
            ukp__js_wrap.show(".ukp__js_content_character_content");
        });
        ukp__js_wrap.find(".ukp__js_content_character_btn_on").addEventListener("click", function () {
            ukp__js_wrap.show(".ukp__js_content_character_btn_off");
            ukp__js_wrap.hide(".ukp__js_content_character_btn_on");
            ukp__js_wrap.hide(".ukp__js_content_character_content");
        });
        ukp__js_wrap.find(".ukp__js_content_small_left").addEventListener("click", function () {
            var title = ukp__js_content.current_title;
            ukp__js_content.current_character--;
            if (ukp__js_content.current_character <= 0) {
                ukp__js_content.current_character = 0;
                ukp__js_wrap.add_class(".ukp__js_content_small_left", "ukp__disabled");
            }
            ukp__js_wrap.remove_class(".ukp__js_content_small_right", "ukp__disabled");
            ukp__js_wrap.find(".ukp__js_content_character_text").innerHTML = ukp__js_content.character[title][ukp__js_content.current_character];
        });
        ukp__js_wrap.find(".ukp__js_content_small_right").addEventListener("click", function () {
            var title = ukp__js_content.current_title;
            ukp__js_content.current_character++;
            if (ukp__js_content.current_character >= (ukp__js_content.character[title].length - 1)) {
                ukp__js_content.current_character = ukp__js_content.character[title].length - 1;
                ukp__js_wrap.add_class(".ukp__js_content_small_right", "ukp__disabled");
            }
            ukp__js_wrap.remove_class(".ukp__js_content_small_left", "ukp__disabled");
            ukp__js_wrap.find(".ukp__js_content_character_text").innerHTML = ukp__js_content.character[title][ukp__js_content.current_character];
        });
        //배경클릭
        ukp__js_wrap.find(".ukp__js_content_content_background").addEventListener("click", function () {
            ukp__js_content.hide_rotate();
        });
        ukp__js_wrap.find(".ukp__js_content_content_left").addEventListener("click", function () {
            ukp__js_content.hide_rotate();
        });
        ukp__js_wrap.find(".ukp__js_content_content_right").addEventListener("click", function () {
            ukp__js_content.hide_rotate();
        });
        //모양조각 상단메뉴
        ukp__js_wrap.find(".ukp__js_content_dropup_btn").addEventListener("click", function () {
            ukp__js_wrap.add_class(".ukp__js_content_dropdown_content", "ukp__hide");
            ukp__js_wrap.remove_class(".ukp__js_content_dropdown_btn", "ukp__hide");
            ukp__js_wrap.add_class(".ukp__js_content_dropup_btn", "ukp__hide");
        });
        ukp__js_wrap.find(".ukp__js_content_dropdown_btn").addEventListener("click", function () {
            ukp__js_wrap.remove_class(".ukp__js_content_dropdown_content", "ukp__hide");
            ukp__js_wrap.add_class(".ukp__js_content_dropdown_btn", "ukp__hide");
            ukp__js_wrap.remove_class(".ukp__js_content_dropup_btn", "ukp__hide");
        });
        ukp__js_wrap.find(".ukp__js_content_pic_0").addEventListener("click", function () {
            ukp__js_content.area_pick(0);
        });
        ukp__js_wrap.find(".ukp__js_content_pic_1").addEventListener("click", function () {
            ukp__js_content.area_pick(1);
        });
        ukp__js_wrap.find(".ukp__js_content_pic_2").addEventListener("click", function () {
            ukp__js_content.area_pick(2);
        });
        ukp__js_wrap.find(".ukp__js_content_pic_3").addEventListener("click", function () {
            ukp__js_content.area_pick(3);
        });
        ukp__js_wrap.find(".ukp__js_content_pic_4").addEventListener("click", function () {
            ukp__js_content.area_pick(4);
        });
    },
    start: function (e) {
        var cla = e.target.id;
        if (cla.indexOf(".ukp__js_content_shape_") > -1) {
            e.preventDefault();
            var data = ukp__js_wrap.find(cla).dataset;
            var mouse_offset = ukp__js_wrap.offset(e, ".ukp__js_content_content");
            ukp__js_content.drag_element.current_x = mouse_offset.x;
            ukp__js_content.drag_element.current_y = mouse_offset.y;
            var style = getComputedStyle(ukp__js_wrap.find(cla));
            //이미 이동된경우
            if (ukp__js_wrap.find(cla).style.top != "") {
                ukp__js_content.drag_element.move_bool = true;
            } else {
                ukp__js_content.drag_element.move_bool = false;
            }
            ukp__js_content.drag_element.cla = cla;
            ukp__js_content.drag_element.x = mouse_offset.x;
            ukp__js_content.drag_element.y = mouse_offset.y;
            ukp__js_content.drag_element.left = parseFloat(style.left);
            ukp__js_content.drag_element.top = parseFloat(style.top);
            ukp__js_content.drag_element.width = parseFloat(data.width);
            ukp__js_content.drag_element.height = parseFloat(data.height);
            ukp__js_content.drag_element.rotate = typeof (data.rotate) == "undefined" ? 0 : parseFloat(data.rotate);
            //if (mouse_offset.x < 0 || 1250 < mouse_offset.x || mouse_offset.y < 0 || 760 < mouse_offset.y) {
            if (mouse_offset.x < 0 || 1562 < mouse_offset.x || mouse_offset.y < 0 || 944 < mouse_offset.y) {
                ukp__js_content.drag_element.bool = false;
            } else {
                ukp__js_content.drag_element.bool = true;
            }
            ukp__js_content.hide_rotate();
            //드래그요소 가장 상위로
            var target = ukp__js_wrap.find(cla);
            target.style.zIndex = 1000 + ukp__js_content.z_index_cnt++;
            var popup = ukp__js_wrap.find('.ukp__js_content_character_btn_on');
            var opacity = window.getComputedStyle(popup).getPropertyValue('opacity');
            if(parseFloat(opacity)!==0){
                ukp__js_wrap.show(".ukp__js_content_character_btn_off");
                ukp__js_wrap.hide(".ukp__js_content_character_btn_on");
                ukp__js_wrap.hide(".ukp__js_content_character_content");
            }
        } else if (cla == ".ukp__js_content_rotate") {
            var shape_cla = ukp__js_wrap.find(cla).dataset.cla;
            var element = ukp__js_wrap.find(shape_cla);
            var data = element.dataset;
            var mouse_offset = ukp__js_wrap.offset(e, ".ukp__js_content_box");
            var offset = ukp__js_wrap.offset(ukp__js_wrap.find(".ukp__js_content_content"), ".ukp__js_content_box");
            var style = getComputedStyle(element);
            var x = (parseFloat(data.width) / 2) + offset.x + parseFloat(style.left);
            var y = (parseFloat(data.height) / 2) + offset.y + parseFloat(style.top);
            ukp__js_content.drag_element.rotate = ukp__js_wrap.deg(x, y, mouse_offset.x, mouse_offset.y) - parseFloat(typeof (data.rotate) == "undefined" ? 0 : data.rotate);
            ukp__js_content.drag_element.x = x;
            ukp__js_content.drag_element.y = y;
            ukp__js_content.drag_element.cla = cla;
        }
    },
    move: function (e) {
        if (ukp__js_content.drag_element.cla == "") {
            return;
        }
        var cla = ukp__js_content.drag_element.cla;
        if (cla.indexOf(".ukp__js_content_shape_") > -1) {
            var element = ukp__js_content.drag_element;
            var mouse_offset = ukp__js_wrap.offset(e, ".ukp__js_content_content");
            ukp__js_content.drag_element.current_x = mouse_offset.x;
            ukp__js_content.drag_element.current_y = mouse_offset.y;
            var left = element.left + mouse_offset.x - element.x;
            var top = element.top + mouse_offset.y - element.y;
            //SEO
            //if (mouse_offset.x < 0 || 1250 < mouse_offset.x || mouse_offset.y < 0 || 760 < mouse_offset.y) {
            if (mouse_offset.x < 0 || 1562 < mouse_offset.x || mouse_offset.y < 0 || 944 < mouse_offset.y) {
                ukp__js_wrap.css(cla, "left", "");
                ukp__js_wrap.css(cla, "top", "");
                if (typeof (ukp__js_wrap.find(cla).dataset.clone_flag) != "undefined") {
                    ukp__js_wrap.css(cla, "opacity", "0");
                }
                ukp__js_content.drag_element.bool = false;
                return;
            }
            ukp__js_wrap.css(cla, "left", left + "px");
            ukp__js_wrap.css(cla, "top", top + "px");
            ukp__js_wrap.css(cla, "opacity", "");
            ukp__js_content.drag_element.bool = true;
        } else if (cla == ".ukp__js_content_rotate") {
            var mouse_offset = ukp__js_wrap.offset(e, ".ukp__js_content_box");
            var rotate = ukp__js_wrap.deg(ukp__js_content.drag_element.x, ukp__js_content.drag_element.y, mouse_offset.x, mouse_offset.y) - ukp__js_content.drag_element.rotate;
            var shape_cla = ukp__js_wrap.find(cla).dataset.cla;
            var data = ukp__js_wrap.find(shape_cla).dataset;
            data.rotate = rotate;
            ukp__js_wrap.css(shape_cla, "transform", "rotate(" + (-rotate) + "deg)");
            ukp__js_wrap.css(cla, "transform", "rotate(" + (-rotate) + "deg)");
        }
    },
    end: function (e) {
        if (ukp__js_content.drag_element.cla == "") {
            return;
        }
        var cla = ukp__js_content.drag_element.cla;
        ukp__js_content.drag_element.cla = "";
        if (cla.indexOf(".ukp__js_content_shape_") > -1) {
            var element = ukp__js_wrap.find(cla);
            var data = element.dataset;
            var mouse_offset_x = ukp__js_content.drag_element.current_x;
            var mouse_offset_y = ukp__js_content.drag_element.current_y;
            var style = getComputedStyle(element);
            var left = ukp__js_content.drag_element.bool ? (ukp__js_content.drag_element.left + mouse_offset_x - ukp__js_content.drag_element.x) : parseFloat(style.left);
            var top = ukp__js_content.drag_element.bool ? (ukp__js_content.drag_element.top + mouse_offset_y - ukp__js_content.drag_element.y) : parseFloat(style.top);
            var width = ukp__js_content.drag_element.width;
            var height = ukp__js_content.drag_element.height;
            var rotate = ukp__js_content.drag_element.rotate;
            //드래그 벗어남
            if (!ukp__js_content.drag_element.bool) {
                //복제본인경우
                if (typeof (data.clone_flag) != "undefined") {
                    element.remove();
                    return;
                }
                ukp__js_content.show_rotate(cla, left, top, width, height, rotate);
                return;
            }
            //드래그 성공
            //복제본인경우, 복제 불가능한경우
            if (typeof (data.clone_flag) != "undefined" || data.copy_flag == "n") {
                ukp__js_content.show_rotate(cla, left, top, width, height, rotate);
                var target = ukp__js_wrap.find(cla);
                var cloneZIndex = target.style.zIndex;
                var firstImage = ukp__js_wrap.find('.ukp__js_content_shape_area_0');
                var displayValue = window.getComputedStyle(firstImage).getPropertyValue('display');
                if(displayValue === "none" && cloneZIndex >= 1000){
                    target.style.zIndex = cloneZIndex - 1000;
                }
                return;
            }
            //복제
            var clone = element.cloneNode(true);
            // z-index 를 정상으로 돌려 놓는다.
            // 개념 학습 첫번째 것은 돌려 놓으면 안된다.
            //ukp__js_content_shape_area_0
            var firstImage = ukp__js_wrap.find('.ukp__js_content_shape_area_0');
            var displayValue = window.getComputedStyle(firstImage).getPropertyValue('display');
            if(displayValue === "none")
                clone.style.zIndex = clone.style.zIndex - 1000;


            var clone_cla = ".ukp__js_content_shape_clone_" + ukp__js_content.clone_cnt;
            var temp = clone.getAttribute("class").replace(cla.slice(1), "ukp__js_content_shape_title_" + ukp__js_content.current_title + " " + clone_cla.slice(1));
            clone.setAttribute("class", temp);
            var clone_svg = clone.querySelector(cla.replace("shape", "svg"));
            clone_svg.id = ".ukp__js_content_shape_clone_" + ukp__js_content.clone_cnt;
            clone_svg.addEventListener("touchstart", ukp__js_content.start);
            clone_svg.addEventListener("mousedown", ukp__js_content.start);
            clone.dataset.clone_flag = "y";
            ukp__js_wrap.find(".ukp__js_content_content").appendChild(clone);
            ukp__js_content.clone_cnt++;
            ukp__js_wrap.css(cla, "left", "");
            ukp__js_wrap.css(cla, "top", "");
            ukp__js_wrap.css(cla, "transform", "");
            ukp__js_wrap.find(cla).dataset.rotate = 0;
            ukp__js_content.show_rotate(clone_cla, left, top, width, height, rotate);
        }
    },
    show_rotate: function (cla, left, top, width, height, rotate) {
        var offset = ukp__js_wrap.offset(ukp__js_wrap.find(".ukp__js_content_content"), ".ukp__js_content_box");
        ukp__js_wrap.css(".ukp__js_content_rotate", "left", (left + offset.x) + "px");
        ukp__js_wrap.css(".ukp__js_content_rotate", "top", (top + offset.y) + "px");
        ukp__js_wrap.css(".ukp__js_content_rotate", "width", width + "px");
        ukp__js_wrap.css(".ukp__js_content_rotate", "height", height + "px");
        ukp__js_wrap.css(".ukp__js_content_rotate", "transform", "rotate(" + (-rotate) + "deg)");
        ukp__js_wrap.find(".ukp__js_content_rotate").dataset.cla = cla;
        ukp__js_wrap.add_class(".ukp__js_content_rotate", "ukp__active");
    },
    hide_rotate: function () {
        ukp__js_wrap.remove_class(".ukp__js_content_rotate", "ukp__active");
    },
    change_title: function () {
        var title = ukp__js_content.title[ukp__js_content.current_title];
        /*
        ukp__js_wrap.find(".ukp__js_content_title_left").innerHTML = title[0];
        ukp__js_wrap.find(".ukp__js_content_title_center").innerHTML = title[1];
        ukp__js_wrap.find(".ukp__js_content_title_right").innerHTML = title[2];
         */
        ukp__js_wrap.find(".ukp__js_content_title_left").innerHTML = '';
        ukp__js_wrap.find(".ukp__js_content_title_center").innerHTML = title[1];
        ukp__js_wrap.find(".ukp__js_content_title_right").innerHTML = '';
        ukp__js_content.current_character = 0;
        ukp__js_content.hide_rotate();
        ukp__js_wrap.find(".ukp__js_content_character_text").innerHTML = ukp__js_content.character[ukp__js_content.current_title][ukp__js_content.current_character];
        ukp__js_wrap.add_class(".ukp__js_content_small_left", "ukp__disabled");
        ukp__js_wrap.remove_class(".ukp__js_content_small_right", "ukp__disabled");
        if (ukp__js_content.current_title == 0) {
            ukp__js_wrap.remove_class(".ukp__js_content_shape_0", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_1", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_2", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_3", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_4", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_5", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_6", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_7", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_8", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_9", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_10", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_11", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_12", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_13", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_14", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_15", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_16", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_17", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_18", "ukp__disabled");
        } else if (ukp__js_content.current_title == 1) {
            ukp__js_wrap.remove_class(".ukp__js_content_shape_0", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_1", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_2", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_3", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_4", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_5", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_6", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_7", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_8", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_9", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_10", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_11", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_12", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_13", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_14", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_15", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_16", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_17", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_18", "ukp__disabled");
        } else {
            ukp__js_wrap.add_class(".ukp__js_content_shape_0", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_1", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_2", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_3", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_4", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_5", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_6", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_7", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_8", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_9", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_10", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_11", "ukp__disabled");
            ukp__js_wrap.remove_class(".ukp__js_content_shape_12", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_13", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_14", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_15", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_16", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_17", "ukp__disabled");
            ukp__js_wrap.add_class(".ukp__js_content_shape_18", "ukp__disabled");
        }
        if (ukp__js_content.current_title == 1 || ukp__js_content.current_title == 2) {
            ukp__js_wrap.show(".ukp__js_content_title_1_content");
        } else {
            ukp__js_wrap.hide(".ukp__js_content_title_1_content");
        }
        for (var i = 0; i < ukp__js_content.title.length; i++) {
            ukp__js_wrap.add_class(".ukp__js_content_shape_title_" + i, "ukp__disabled");
        }
        ukp__js_wrap.remove_class(".ukp__js_content_shape_title_" + ukp__js_content.current_title, "ukp__disabled");
        ukp__js_wrap.hide(".ukp__js_content_character_btn_off");
        ukp__js_wrap.show(".ukp__js_content_character_btn_on");
        ukp__js_wrap.show(".ukp__js_content_character_content");
    },
    area_pick: function (num) {
        for (var i = 0; i < 100; i++) {
            var element = ukp__js_wrap.find(".ukp__js_content_shape_area_" + i);
            if (element === null) {
                if(i > 10)
                    break;
                else
                    continue;
            }
            if (i == num) {
                ukp__js_wrap.remove_class(".ukp__js_content_shape_area_" + i, "ukp__hide");
            } else {
                ukp__js_wrap.add_class(".ukp__js_content_shape_area_" + i, "ukp__hide");
            }
        }
    },
    reset: function (root) {
        // ukp__js_content.current_title = 0;
        // ukp__js_content.change_title();
        // for (var i = 0; i < 100; i++) {
        //     var element = ukp__js_wrap.find(".ukp__js_content_shape_" + i);
        //     if (element === null) {
        //         break;
        //     }
        //     ukp__js_wrap.css(".ukp__js_content_shape_" + i, "transform", "");
        //     ukp__js_wrap.css(".ukp__js_content_shape_" + i, "left", "");
        //     ukp__js_wrap.css(".ukp__js_content_shape_" + i, "top", "");
        // }
        // for (var i = 0; i < ukp__js_content.clone_cnt; i++) {
        //     var element = ukp__js_wrap.find(".ukp__js_content_shape_clone_" + i);
        //     if (element === null) {
        //         continue;
        //     }
        //     element.remove();
        // }
        // ukp__js_wrap.remove_class(".ukp__js_content_dropdown_content", "ukp__hide");
        // ukp__js_wrap.remove_class(".ukp__js_content_dropup_btn", "ukp__hide");
        // ukp__js_wrap.add_class(".ukp__js_content_dropdown_btn", "ukp__hide");
        // for (var i = 0; i < 100; i++) {
        //     var element = ukp__js_wrap.find(".ukp__js_content_shape_area_" + i);
        //     if (element === null) {
        //         break;
        //     }
        //     ukp__js_wrap.add_class(".ukp__js_content_shape_area_" + i, "ukp__hide");
        // }
        // ukp__js_wrap.show(".ukp__js_content_character_content");
        // ukp__js_wrap.hide(".ukp__js_content_character_btn_off");
        // ukp__js_wrap.show(".ukp__js_content_character_btn_on");
        // ukp__js_wrap.css(".ukp__js_content_shape", "z-index", "");
        // ukp__js_content.z_index_cnt = 1;
        ukp__js_content.change_title();
        ukp__js_wrap.show(".ukp__js_content_character_content");
        ukp__js_wrap.hide(".ukp__js_content_character_btn_off");
        ukp__js_wrap.show(".ukp__js_content_character_btn_on");
        root.querySelectorAll(".ukp__js_content_shape_title_" + ukp__js_content.current_title).forEach(function (element) {
            element.remove();
        });
        if (ukp__js_content.current_title == 0) {
            for (var i = 0; i <= 5; i++) {
                var element = ukp__js_wrap.find(".ukp__js_content_shape_" + i);
                if (element === null) {
                    break;
                }
                ukp__js_wrap.css(".ukp__js_content_shape_" + i, "transform", "");
                ukp__js_wrap.css(".ukp__js_content_shape_" + i, "left", "");
                ukp__js_wrap.css(".ukp__js_content_shape_" + i, "top", "");
            }
        } else if (ukp__js_content.current_title == 1) {
            for (var i = 13; i <= 18; i++) {
                var element = ukp__js_wrap.find(".ukp__js_content_shape_" + i);
                if (element === null) {
                    break;
                }
                ukp__js_wrap.css(".ukp__js_content_shape_" + i, "transform", "");
                ukp__js_wrap.css(".ukp__js_content_shape_" + i, "left", "");
                ukp__js_wrap.css(".ukp__js_content_shape_" + i, "top", "");
            }
            /* SEO
            ukp__js_wrap.remove_class(".ukp__js_content_dropdown_content", "ukp__hide");
            ukp__js_wrap.remove_class(".ukp__js_content_dropup_btn", "ukp__hide");
            ukp__js_wrap.add_class(".ukp__js_content_dropdown_btn", "ukp__hide");
            for (var i = 0; i < 100; i++) {
                var element = ukp__js_wrap.find(".ukp__js_content_shape_area_" + i);
                if (element === null) {
                    break;
                }
                ukp__js_wrap.add_class(".ukp__js_content_shape_area_" + i, "ukp__hide");
            }
             */
        } else {
            for (var i = 6; i <= 12; i++) {
                var element = ukp__js_wrap.find(".ukp__js_content_shape_" + i);
                if (element === null) {
                    break;
                }
                ukp__js_wrap.css(".ukp__js_content_shape_" + i, "transform", "");
                ukp__js_wrap.css(".ukp__js_content_shape_" + i, "left", "");
                ukp__js_wrap.css(".ukp__js_content_shape_" + i, "top", "");
            }
        }
    }
};

var ukp__js_wrap = null;
window.addEventListener("script-loaded", function (e) {
    if (ukp__js_wrap !== null) {
        return;
    }
    ukp__js_wrap = new Ukp(e.detail.root);
    var element = ukp__js_wrap.find(".ukp__js_wrap_content");
    // var style = getComputedStyle(element);
    ukp__js_wrap.content_width = parseInt(element.style.width);
    ukp__js_wrap.content_height = parseInt(element.style.height);
    ukp__js_wrap.resize();
    window.addEventListener("resize", function () {
        ukp__js_wrap.resize();
    });
    ukp__js_content.init(e.detail.root);
    //폰트 임시적용
    // root를 전역으로 안쓰네.... 음... 뭐 원칙에 맞는 것일 수도....
    var root = e.detail.root;
    var url = root.querySelector(".ukp__js_wrap_font").getAttribute("href").replace("/font.css", "");
    var style = document.createElement("style");
    style.textContent = `
        @font-face {
            font-family: "Malgun Gothic";
            src: url('${url}/malgunsl.woff2') format("woff2");
            src: url('${url}/malgunsl.woff') format("woff");
            font-weight: 300;
        }

        @font-face {
            font-family: "Malgun Gothic";
            src: url('${url}/malgun.woff2') format("woff2");
            src: url('${url}/malgun.woff') format("woff");
            font-weight: 400;
        }

        @font-face {
            font-family: "Malgun Gothic";
            src: url('${url}/malgunbd.woff2') format("woff2");
            src: url('${url}/malgunbd.woff') format("woff");
            font-weight: 700;
        }

        @font-face {
            font-family: "Batang";
            src: url('${url}/batang.woff2') format("woff2");
            src: url('${url}/batang.woff') format("woff");
        }
    `;
    document.body.appendChild(style);
    //폰트 임시적용 끝
    ukp__js_wrap.show(".ukp__js_content_box");
    root.reset = (type = 1, number = 4)=>{
        // 0: 기본, 1: 모양 채우기, 2: 칠교 조각
        //type = 1;
        //number = 4;
        ukp__js_content.reset(root);
        if(type !==0){
            ukp__js_content.current_title = type;
            ukp__js_content.change_title();
            if(type===1 || type===2){
                ukp__js_content.area_pick(number);
            }
        }else{
            ukp__js_content.current_title = type;
            ukp__js_content.change_title();
        }
    }
    root.autoScale = () => {
        ukp__js_wrap.resize();
    }
});
window.addEventListener("contextmenu", function (e) {
    //e.preventDefault();
});