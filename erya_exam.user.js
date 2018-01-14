// ==UserScript==
// @name         Erya_exam
// @namespace    https://cubicpill.me/
// @version      1.0.1
// @description  Copy problem content with one click
// @author       CubicPill
// @match        https://mooc1-1.chaoxing.com/exam/test/reVersionTestStartNew*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/CubicPill/userscripts/master/erya_exam.user.js
// @updateURL    https://raw.githubusercontent.com/CubicPill/userscripts/master/erya_exam.user.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// ==/UserScript==
function init_clip() {
    var text = null;
    var cnt = 0;
    do {
        try {
            var raw_text = document.querySelector("div.Cy_TItle > div.clearfix").innerText;
            var text_arr = raw_text.split('。（', 1);
            if (text_arr.length === 1) {
                text_arr = raw_text.split('。', 1);
            }
            text = text_arr[0];
        } catch (e) {
            ++cnt; // prevent page freezing
        }
    } while (!text && cnt < 5);
    var btn = document.createElement('button');
    btn.innerText = 'Copy';
    btn.id = 'copy-btn';
    btn.setAttribute('data-clipboard-text', text);
    var div = document.querySelector("div.leftBottom");
    div.insertAdjacentElement('afterbegin', btn);
    new Clipboard('#copy-btn');
}


$(document).ready(function () {
    init_clip();
});