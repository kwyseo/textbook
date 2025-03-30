export class Ukp {
    constructor(root) {
        this.root = root;
        this.content_width = 0;
        this.content_height = 0;
        this.width = 0;
        this.height = 0;
    }
    resize() {
        var element = this.find(".ukp__js_wrap_box");
        var rect = {
            width: parseInt(getComputedStyle(element).width),
            height: parseInt(getComputedStyle(element).height)
        };
        if (this.width != rect.width || this.height != rect.height) {
            var width = rect.width / this.content_width;
            var height = rect.height / this.content_height;
            this.css(".ukp__js_wrap_content", "transform", "scale(" + (width > height ? height : width) + ")");
            this.width = width;
            this.height = height;
        }
    }
    strval(str) {
        if (typeof (str) == "string") {
            return str;
        } else if (typeof (str) == "number") {
            return str + "";
        } else {
            return "";
        }
    }
    show(cla) {
        this.css(cla, "opacity", "");
        this.css(cla, "pointer-events", "");
    }
    hide(cla) {
        this.css(cla, "opacity", "0");
        this.css(cla, "pointer-events", "none");
    }
    toggle(cla) {
        var elements = this.root.querySelectorAll(cla);
        var ukp__js_wrap = this;
        elements.forEach(function (element) {
            var arr = ukp__js_wrap.strval(element.getAttribute("style")).split(";");
            var show_bool = false;
            for (var k in arr) {
                var v = arr[k];
                if (v.trim() == "") {
                    continue;
                }
                var property = v.split(":");
                if (property[0].indexOf("pointer-events") > -1 || property[0].indexOf("opacity") > -1) {
                    show_bool = true;
                    break;
                }
            }
            if (show_bool) {
                this.show(cla);
            } else {
                this.hide(cla);
            }
        });
    }
    css(cla, key, value = "") {
        var elements = this.root.querySelectorAll(cla);
        var ukp__js_wrap = this;
        elements.forEach(function (element) {
            var arr = ukp__js_wrap.strval(element.getAttribute("style")).split(";");
            var style = "";
            for (var k in arr) {
                var v = arr[k];
                if (v.trim() == "") {
                    continue;
                }
                var property = v.split(":");
                if (property[0].indexOf(key) > -1) {
                    continue;
                }
                style += v + ";";
            }
            if (value != "") {
                style += key + ": " + value + ";";
            }
            element.setAttribute("style", style);
        });
    }
    attr(cla, key, value = null) {
        var element = this.root.querySelector(cla);
        if (value === null) {
            return element.getAttribute(key);
        } else if (value == "") {
            element.removeAttribute(key);
        } else {
            element.setAttribute(key, value);
        }
    }
    add_class(cla, key) {
        var elements = this.root.querySelectorAll(cla);
        var ukp__js_wrap = this;
        elements.forEach(function (element) {
            var arr = ukp__js_wrap.strval(element.getAttribute("class")).split(" ");
            var value = key;
            for (var k in arr) {
                var v = arr[k];
                if (v.trim() == "" || v.trim() == key) {
                    continue;
                }
                value += " " + v;
            }
            element.setAttribute("class", value);
        });
    }
    remove_class(cla, key) {
        var elements = this.root.querySelectorAll(cla);
        var ukp__js_wrap = this;
        elements.forEach(function (element) {
            var arr = ukp__js_wrap.strval(element.getAttribute("class")).split(" ");
            var value = "";
            for (var k in arr) {
                var v = arr[k];
                if (v.trim() == "" || v.trim() == key) {
                    continue;
                }
                if (value != "") {
                    value += " ";
                }
                value += v;
            }
            element.setAttribute("class", value);
        });
    }
    focus(cla) {
        this.root.querySelector(cla).focus();
    }
    find(cla) {
        return this.root.querySelector(cla);
    }
    findAll(cla) {
        return this.root.querySelectorAll(cla);
    }
    offset(e, cla) {
        var x = 0;
        var y = 0;
        //마우스
        if (typeof (e.clientX) != "undefined") {
            x = e.clientX;
            y = e.clientY;
        }
        //터치
        else if (typeof (e.touches) != "undefined") {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        //태그
        else if (typeof (e.getBoundingClientRect) != "undefined") {
            x = e.getBoundingClientRect().x;
            y = e.getBoundingClientRect().y;
        }
        var element = this.find(cla);
        var rect = element.getBoundingClientRect();
        /*
            x축 기준 설명

            x: 브라우저 화면기준 대상요소의 x좌표, 대상요소.getBoundingClientRect().x 로 구할 수 있음
            rect.x: 브라우저 화면 기준 드래그영역의 x좌표, 드래그영역.getBoundingClientRect().x 로 구할 수 있음
            x - rect.x를 하면 드래그영역 기준으로 대상요소의 "x좌표"를 얻을 수 있음(확대비율 적용됨)

            element.offsetWidth: 드래그영역의 원본너비
            rect.width: 드래그영역의 화면출력 너비
            element.offsetWidth / rect.width를 하면 드래그영역의 "확대비율"을 얻을 수 있음

            대상요소의 "x좌표"에 "확대비율"을 곱하면 대상요소의 "원본 x좌표"를 얻을 수 있음

            parseInt(getComputedStyle(element).borderLeftWidth): 드래그영역의 왼쪽 테두리선 너비
            드래그영역의 x좌표는 테두리선 안쪽부터 시작하므로 왼쪽 테두리선 너비만큼 빼줌

        */
        var obj = {
            x: (x - rect.x) * (element.offsetWidth / rect.width) - parseInt(getComputedStyle(element).borderLeftWidth),
            y: (y - rect.y) * (element.offsetHeight / rect.height) - parseInt(getComputedStyle(element).borderTopWidth)
        };
        return obj;
    }
    deg (center_x, center_y, outer_x, outer_y) {
        var x = outer_x - center_x;
        var y = center_y - outer_y;
        if (x == 0) {
            return y < 0 ? 270 : 90;
        }
        var deg = Math.atan(y / x) * (180 / Math.PI);
        if (x < 0) {
            deg += 180;
        } else if (y < 0) {
            deg += 360;
        }
        return deg;
    }
}