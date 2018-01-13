// ==UserScript==
// @name         Erya
// @namespace    https://cubicpill.me/
// @version      1.2.2
// @description  Disable erya's auto pause
// @author       CubicPill
// @match        https://mooc1-1.chaoxing.com/mycourse/studentstudy*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/CubicPill/userscripts/master/erya.user.js
// @updateURL    https://raw.githubusercontent.com/CubicPill/userscripts/master/erya.user.js
// ==/UserScript==

(function () {
    'use strict';
    var last_sec = -1;
    var pass = false;
    var v_check = 0; // when reaches 3, the there is a task point
    var p_mid = "";
    var sound = new Audio("data:audio/ogg;base64,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");

    function getPlayer() {
        try {
            var _frame1 = window.document.querySelector("iframe");
            var _frame2 = _frame1.contentWindow.document.querySelector("iframe");
            return _frame2.contentWindow.document.querySelector("object");
        } catch (e) {
            return null;
        }
    }

    function get_mid() {
        try {
            var _frame1 = window.document.querySelector("iframe");
            var _frame2 = _frame1.contentWindow.document.querySelector("iframe");
            return _frame2.contentWindow.frameElement.getAttribute("mid");
        } catch (e) {
            return null;
        }
    }

    function notify(text) {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            new Notification("超星尔雅网课", {
                body: text,
                sound: sound
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    new Notification("超星尔雅网课", {
                        body: text,
                        sound: sound
                    });
                }
            });
        }

    }

    function display_tp_answer() {
        var mid = get_mid();
        if (mid === p_mid) {
            return;
        }
        if (mid === null) {
            document.querySelector("#answer_to_tp").innerText = "无任务点信息";
            return;
        }
        document.querySelector("#answer_to_tp").innerText = "";
        p_mid = mid;
        var ans = "";
        var url = "https://mooc1-1.chaoxing.com/richvideo/initdatawithviewer?&start=undefined&mid=" + mid;
        $.getJSON(url, function (json) {
            var answers = [];
            for (var j = 0; j < json.length; ++j) {
                var options = json[j]["datas"][0]["options"];
                for (var i = 0; i < options.length; ++i) {
                    if (options[i]["isRight"] === true) {
                        answers.push(options[i]["name"]);
                    }
                }
            }
            ans = answers.join(' | ');
            if (ans !== "") {
                document.querySelector("#answer_to_tp").innerText = "任务点答案: " + ans;
            }
        });
    }

    function check_player(player) {
        if (pass)
            return;
        if (v_check >= 3) {
            pass = true;
            notify("任务点");
        }
        try {
            if (player.getPlayState() !== 1) {
                if (player.getPlayState() === 4) { // finished
                    notify("本节视频播放已结束");
                    document.querySelector("span[title=章节测验]").click();
                    pass = true;
                } else { // resume playing normally
                    last_sec = player.getPlaySecond();
                    player.playMovie();
                    setTimeout(function () {
                        if (player.getPlaySecond() === last_sec) {
                            ++v_check;
                        } else {
                            v_check = 0;
                        }
                    }, 2000);
                }
            }
        } catch (e) {

        }
    }

    function restart_poll() {
        pass = false;
        v_check = 0;
        last_sec = -1;
        display_tp_answer();
        var player = getPlayer();
        var i = setInterval(function () {
            check_player(player);
        }, 1000);
        console.log("Auto play enabled");
        return i;
    }

    function init() {
        var player = getPlayer();

        if (player === null || !("getPlayState" in player) || player.getPlayState() !== 1) {

            // if the video has not started, do not enable auto start
            // video metadata should be loaded by player in advance
            setTimeout(init, 1000);
            // console.log("Video not loaded, retry in 1s");
            return;
        }
        var ans = document.createElement("p");
        ans.style.display = "inline-block";
        ans.style.float = "right";
        ans.style.marginRight = "10px";
        ans.id = "answer_to_tp";
        var btn = document.createElement("button");
        btn.id = "headbutt_btn";
        btn.innerText = 'Headbutt';
        btn.style.float = "right";
        btn.style.marginTop = "12px";
        document.querySelector(".left .content .goback").appendChild(btn);
        document.querySelector(".left .content .goback").appendChild(ans);
        var i = restart_poll();
        btn.onclick = function () {
            clearInterval(i);
            i = restart_poll();
        };

    }

    setTimeout(init, 5000);
})();