// ==UserScript==
// @name         Sakai Deadline Helper
// @namespace    http://wilton.blue/
// @version      0.1
// @description  try to take over the world!
// @author       CubicPill
// @match        http://sakai.sustc.edu.cn/portal*
// @match        https://sakai.sustc.edu.cn/portal*
// @match        http://sakai.sustc.edu.cn/portal*
// @match        https://sakai.sustc.edu.cn/portal*
// @grant        none
// ==/UserScript==

var request;
var site_assignment_urls = [];
var tool_assignment_urls = [];
var assignments = [];

function parse_DOM(str) {
   var div = document.createElement("div");
   if (typeof str == "string")
      div.innerHTML = str;
   return div;
}

function get_site_urls() {
   var urls = []
   var siteobj = document.getElementById('topnav').children;
   for (var i = 1; i < siteobj.length; ++i) {
      urls.push(siteobj[i].firstChild.href);
   }
   return urls;
}

function get_site(siteurl) {
   request = new XMLHttpRequest();
   request.open('GET', siteurl, false);
   request.onreadystatechange = process_site_page;
   request.send(null);
}

function process_site_page() {
   if (request.readyState === 4 && request.status === 200) {
      tools = parse_DOM(request.responseText).getElementsByClassName('menuTitle');
      for (var i = 0; i < tools.length; ++i) {
         var title = tools[i].innerText;

         if (title === "Assignments" || title === "作业") {
            site_assignment_urls.push(tools[i].parentNode.href);
         }
      }
   }
}

function get_assignment_urls(site_assignment_url) {
   request = new XMLHttpRequest();
   request.open('GET', site_assignment_url, false);
   request.onreadystatechange = process_site_assignment_page;
   request.send(null);
}

function process_site_assignment_page() {
   if (request.readyState === 4 && request.status === 200) {
      link = parse_DOM(request.responseText).getElementsByTagName("iframe")[0].src;
      tool_assignment_urls.push(link);
   }
}

function get_assignments(tool_assignment_url) {
   request = new XMLHttpRequest();
   request.open('GET', tool_assignment_url, false);
   request.onreadystatechange = process_tool_assignment_page;
   request.send(null);
}

function process_tool_assignment_page() {
   if (request.readyState === 4 && request.status === 200) {
      tr = parse_DOM(request.responseText).getElementsByTagName("tr");
      for (var i = 1; i < tr.length; ++i) {
         td = tr[i].getElementsByTagName('td');
         as = [];
         for (var j = 1; j < td.length; ++j) {
            as.push(td[j].innerText.replace(/\s\s+/g, ""));
            dom = td[j];
         }
         assignments.push(as);
      }
   }
}

function display_assignments() {
   var ele = document.getElementById("col1of2");
   var div = document.createElement("div");
   div.innerHTML = "<p>" + assignments.toString() + "</p>"
   ele.appendChild(div);
}

function test() {
   var u = get_site_urls();
   for (var i = 0; i < u.length; ++i) {
      get_site(u[i]);
   }
   for (var i = 0; i < site_assignment_urls.length; ++i) {
      get_assignment_urls(site_assignment_urls[i]);
   }
   for (var i = 0; i < tool_assignment_urls.length; ++i) {
      get_assignments(tool_assignment_urls[i]);
   }
}
