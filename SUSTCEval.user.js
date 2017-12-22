// ==UserScript==
// @name         SUSTCEval
// @namespace    http://wilton.blue/
// @version      0.1
// @description  自动评教
// @author       CubicPill
// @match        http://eval.sustc.edu.cn/q.aspx*
// @grant        none
// ==/UserScript==

// have bugs when going to the next page
var if_do_eval = true;

function doeval() {
   if (if_do_eval) {
      if_do_eval = false;
      var questions = document.getElementsByClassName("formstyle");
      if (document.getElementsByClassName("mynexttask").length !== 0) {
         setTimeout(nextpage, 1000);
      } else if (question.length !== 0) {
         for (var i = 0; i < questions.length; ++i) {
            questions[i].getElementsByTagName("dd")[0].children[0].children[0].click();
            // just select the first choice(Very Good), if wanna change you should alter the first index
         }
         document.getElementsByTagName("textarea")[0].value = "没有";
         // here is the final comment
         document.getElementById("next_button").click(); // next page
         setTimeout(nextpage, 1000);
      }
   }
}

function nextpage() {
   if (document.getElementsByClassName("mynexttask").length === 0) {
      setTimeout(nextpage, 100);
   } else {
      document.getElementsByClassName("mynexttask")[0].click();
   }
}

setInterval(doeval, 1000);
