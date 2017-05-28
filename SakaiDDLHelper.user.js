// ==UserScript==
// @name         Sakai Deadline Helper
// @namespace    http://wilton.blue/
// @version      0.1
// @description  try to take over the world!
// @author       CubicPill
// @match        http://sakai.sustc.edu.cn/portal*
// @match        https://sakai.sustc.edu.cn/portal*
// @grant        none
// ==/UserScript==

var request;
var site_assignment_urls = [];
var tool_assignment_urls = [];
var assignments = [];
var unsubmitted = [];

function parse_DOM(str) {
   var div = document.createElement("div");
   if (typeof str == "string")
      div.innerHTML = str;
   return div;
}

function get_site_urls() {
   var urls = [];
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
            if (tools[i].parentNode.href == "")
               process_site_assignment_page();
            else
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
         }
         assignments.push(as);
      }
   }
}

function filter_unsubmitted() {
   var now = new Date();
   for (var a in assignments) {
      if (assignments[a][1].search(/已提交/) < 0 && parse_date(assignments[a][3]) > now) {
         unsubmitted.push(assignments[a]);
      }
   }
}

function display_assignments() {
   var ele = document.getElementById("mastLogin");
   var div = document.createElement("div");
   div.innerHTML = "<a href=\"javascript:show_popup();\">click here</a>";
   ele.appendChild(div);
}

function show_popup() {
   var text = "";
   for (var i = 0; i < unsubmitted.length; ++i) {
      text += unsubmitted[i].join(" ");
      text += "\n";
   }
   alert(text);
}

function parse_date(date_str) {
   var year = parseInt(date_str.split(" ")[0].split("-")[0]);
   var month = parseInt(date_str.split(" ")[0].split("-")[1]);
   var day = parseInt(date_str.split(" ")[0].split("-")[2]);
   var period = date_str.split(" ")[1].substring(0, 2);
   var hour = parseInt(date_str.split(" ")[1].substring(2).split(":")[0]);
   var minute = parseInt(date_str.split(" ")[1].substring(2).split(":")[1]);
   if (period == "下午" && hour != 12) {
      hour += 12;
   } else if (period == "上午" && hour == 12) {
      hour = 0;
   }
   var date = new Date();
   date.setFullYear(year, month - 1, day);
   date.setHours(hour, minute, 0);
   return date;
}

function test() {
   site_assignment_urls = [];
   tool_assignment_urls = [];
   assignments = [];
   unsubmitted = [];
   u = get_site_urls();
   for (var i = 0; i < u.length; ++i) {
      get_site(u[i]);
   }
   for (var i = 0; i < site_assignment_urls.length; ++i) {
      get_assignment_urls(site_assignment_urls[i]);
   }
   for (var i = 0; i < tool_assignment_urls.length; ++i) {
      get_assignments(tool_assignment_urls[i]);
   }
   filter_unsubmitted();
   display_assignments();
}
