// ==UserScript==
// @name         Erya
// @namespace    https://cubicpill.me/
// @version      1.3.0
// @description  Disable erya's auto pause
// @author       CubicPill
// @match        https://mooc1-1.chaoxing.com/mycourse/studentstudy*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/CubicPill/userscripts/master/erya.user.js
// @updateURL    https://raw.githubusercontent.com/CubicPill/userscripts/master/erya.user.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js

// ==/UserScript==

(function () {
    'use strict';
    var last_sec = -1;
    var pass = false;
    var v_check = 0; // when reaches 3, the there is a task point
    var p_mid = "";

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
                body: text
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    new Notification("超星尔雅网课", {
                        body: text
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

    function display_copy_button() {
        var question_divs = window.document.querySelector("iframe").contentWindow.document.querySelector("iframe").contentWindow.document.querySelector("iframe").contentWindow.document.getElementsByClassName("TiMu");
        for (var i = 0; i < question_divs.length; ++i) {
            var text = question_divs[i].children[0].innerText.split("\n").join("").split("】")[1];
            console.log(text);
            var btn = document.createElement('button');
            btn.innerText = 'Copy';
            btn.id = 'copy-btn-' + i;
            btn.setAttribute('data-clipboard-text', text);
            btn.setAttribute('type', 'button');
            question_divs[i].querySelector("div.clearfix>div").insertAdjacentElement('beforeend', btn);
            new Clipboard('#copy-btn-' + i);
        }
    }

    function check_player(player) {
        if (pass) {
            return;
        }
        if (v_check >= 3) {
            pass = true;
            notify("任务点");
        }
        try {
            if (player.getPlayState() !== 1) {
                if (player.getPlayState() === 4) { // finished
                    notify("本节视频播放已结束");
                    document.querySelector("span[title=章节测验]").click();
                    setTimeout(display_copy_button, 3000);
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