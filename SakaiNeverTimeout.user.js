// ==UserScript==
// @name         SakaiNeverTimeout
// @namespace    https://cubicpill.me/
// @version      0.1
// @description  Keep sakai session active
// @author       CubicPill
// @match        http://sakai.sustc.edu.cn/*
// @match        https://sakai.sustc.edu.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function (){
        jQuery.get("http://sakai.sustc.edu.cn/portal");
    },60000);
})();