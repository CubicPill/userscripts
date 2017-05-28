// ==UserScript==
// @name         SUSTCEval
// @namespace    http://wilton.blue/
// @version      0.1
// @description  自动评教
// @author       CubicPill
// @match        http://eval.sustc.edu.cn/q.aspx*
// @grant        none
// ==/UserScript==

function doeval() {
   if (document.getElementsByClassName("formstyle").length === 0 && document.getElementsByClassName("mynexttask").length === 0) {
      setTimeout(doeval, 100);
   } else if (document.getElementsByClassName("mynexttask").length !== 0) {
      setTimeout(nextpage, 1000);
   } else {
      var questions = document.getElementsByClassName("formstyle");
      for (var i = 0; i < questions.length; ++i) {
         questions[i].getElementsByTagName("dd")[0].children[0].children[0].click();
      }
      document.getElementsByTagName("textarea")[0].value = "没有";
      document.getElementById("next_button").click();
      setTimeout(nextpage, 1000);
   }
}

function nextpage() {
   if (document.getElementsByClassName("mynexttask").length === 0) {
      setTimeout(nextpage, 100);
   } else {
      document.getElementsByClassName("mynexttask")[0].click();
   }
}

setTimeout(doeval, 1000);
