/**
 * Created by Administrator on 2017/4/21.
 */
$(document).ready(function() {
    var sub = $("#sub");
    var activeRow, activeMenu;

    var timer;

    var mouseInSub = false;
    $("#aa").on("mouseenter",function(){
        $("#wrap,#wrap ul").removeClass("none");
    }).on("mouseleave",function(){
        $("#wrap,#wrap ul").addClass("none");
    })
    sub.on("mouseenter",
        function() {
            mouseInSub = true;
        }).on("mouseleave",
        function() {
            mouseInSub = false;
        });

    var mouseTrach = [];
    var moveHandler = function(e) {
        mouseTrach.push({
            x: e.pageX,
            y: e.pageY
        });
        if (mouseTrach.length > 3) {
            mouseTrach.shift();
        }
    };

    $("#wrap").on("mouseenter",
        function() {
            sub.removeClass("none");
            $(document).bind("mousemove", moveHandler);
        }).on("mouseleave",
        function() {
            sub.addClass("none");

            if (activeRow) {
                activeRow.removeClass("active");
                activeRow = null;
            }
            if (activeMenu) {
                activeMenu.addClass("none");
                activeMenu = null;
            }

            $(document).unbind("mousemove", moveHandler);
        }).on("mouseenter", "li",
        function(e) {
            if (!activeRow) {
                activeRow = $(e.target).addClass("active");
                activeMenu = $("#" + activeRow.data("id"));
                activeMenu.removeClass("none");
            }
            if (timer) {
                clearTimeout(timer);
            }

            var curMouse = mouseTrach[mouseTrach.length - 1];
            var prevMouse = mouseTrach[mouseTrach.length - 2];
            //console.log(curMouse, prevMouse);
            var delay = needDelay(sub, curMouse, prevMouse);

            if (delay) {
                timer = setTimeout(function() {
                        if (mouseInSub) {
                            return
                        }
                        activeRow.removeClass("active");
                        activeMenu.addClass("none");

                        activeRow = $(e.target);
                        activeRow.addClass("active");
                        activeMenu = $("#" + activeRow.data("id"));
                        activeMenu.removeClass("none");

                        timer = null;
                    },
                    300);
            } else {
                var prevActiveRow = activeRow;
                var prevActiveMenu = activeMenu;

                activeRow = $(e.target);
                activeMenu = $("#" + activeRow.data("id"));

                prevActiveRow.removeClass("active");
                prevActiveMenu.addClass("none");

                activeRow.addClass("active");
                activeMenu.removeClass("none");

            }
        });
});

function vector(a, b) {
    return {
        x: b.x - a.x,
        y: b.y - a.y
    }
}

function vectorPro(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
}

function sameSign(a, b) {
    return (a ^ b) >= 0;
}

function isPoint(p, a, b, c) {
    var pa = vector(p, a);
    var pb = vector(p, b);
    var pc = vector(p, c);

    var t1 = vectorPro(pa, pb);
    var t2 = vectorPro(pb, pc);
    var t3 = vectorPro(pc, pa);

    return sameSign(t1, t2) && sameSign(t2, t3);
}

function needDelay(ele, curMouse, prevMouse) {
    if (!curMouse || !prevMouse) {
        return
    }
    var offset = ele.offset();

    var topleft = {
        x: offset.left,
        y: offset.top
    };
    var leftbottom = {
        x: offset.left,
        y: offset.top + ele.height()
    };

    return isPoint(curMouse, prevMouse, topleft, leftbottom);
}