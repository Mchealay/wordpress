!function(e){var t={};function s(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,a){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:a})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=1035)}({1035:function(e,t,s){"use strict";!function(e){var t={pm_search_request:function(e,t){jQuery.ajax({beforeSend:function(e){e.setRequestHeader("X-WP-Nonce",PM_Global_Vars.permission)},url:""+PM_Global_Vars.api_base_url+PM_Global_Vars.api_namespace+"/admin-topbar-search",data:{query:e,model:"project"},success:function(e){"function"==typeof t&&t(e)}})},setPermalink:function(e){if(e=e.replace(/([^:]\/)\/+/g,"$1"),!PM_Global_Vars.permalinkStructure){var t=0;e=e.replace(/\?/g,function(e){return++t>1?"&":e})}return e},pm_result_item_url:function(e){var t=null;switch(e.type){case"task":t="#/projects/"+e.project_id+"/task-lists/tasks/"+e.id;break;case"subtask":t="#/projects/"+e.project_id+"/task-lists/tasks/"+e.parent_id;break;case"project":t="#/projects/"+e.id+"/task-lists/";break;case"milestone":t="#/projects/"+e.project_id+"/milestones/";break;case"discussion_board":break;case"task_list":t="#/projects/"+e.project_id+"/task-lists/"+e.id;break;default:t=t}return t?PM_Global_Vars.project_page+t:t},pm_get_projects:function(e){jQuery.ajax({beforeSend:function(e){e.setRequestHeader("X-WP-Nonce",PM_Global_Vars.permission)},url:t.setPermalink(""+PM_Global_Vars.api_base_url+PM_Global_Vars.api_namespace+"/projects?project_transform=false&per_page=all"),data:{},success:function(t){"function"==typeof e&&e(t)}})},pm_create_task:function(e,s){jQuery.ajax({beforeSend:function(e){e.setRequestHeader("X-WP-Nonce",PM_Global_Vars.permission)},method:"POST",url:t.setPermalink(""+PM_Global_Vars.api_base_url+PM_Global_Vars.api_namespace+"/projects/"+e.project_id+"/tasks"),data:e,success:function(e){"function"==typeof s&&s(e)}})}};e.widget("custom.pmautocomplete",e.ui.autocomplete,{_create:function(){this._super(),this.widget().menu("option","items","> :not(.pm-search-type)")}}),e(document).ready(function(){var s=!1,a=!1,n=!1,r=e("#pmswitchproject");function o(){r.css("display","block").addClass("active"),r.find("input").focus(),r.find("input").val("")}e(document).bind("keydown",function(e){var t=e.keyCode||e.which;17!==t&&91!==t&&93!==t||n?a||!s||74!==t||n?a&&s&&74===t?(e.preventDefault(),a=!1,n=!1,r.css("display","none").removeClass("active")):n=!0:(e.preventDefault(),a=!0,n=!1,o()):(s=!0,n=!1),27===t&&(a=!1,s=!1,n=!1,r.css("display","none").removeClass("active"))}),e(document).bind("keyup",function(e){var t=e.keyCode||e.which;n=!1,17!==t&&91!==t&&93!==t||(s=!1)}),e(document).bind("click",function(t){e(t.target).closest("#wp-admin-bar-pm_search").length||e(t.target).closest("#wp-admin-bar-pm_create_task").length||e(t.target).closest(".pmswitcharea").length||e(t.target).closest("#pmcteatetask .inner").length||(e(this).find("#pmswitchproject").hasClass("active")&&(a=!1,s=!1,n=!1,r.css("display","none").removeClass("active")),e(this).find("#pmcteatetask").hasClass("active")&&c.css("display","none").removeClass("active"))}),e("#wp-admin-bar-pm_search a").bind("click",function(e){o()});var i=[];r.find("input").pmautocomplete({autoFocus:!0,appendTo:".pm-spresult",source:function(s,a){var n=this;if(e(this).removeClass("pm-open"),!s.term.trim()&&i.length)return a(i),void e(n).removeClass("pm-sspinner");if(s.term.trim()||i.length){var r=e.ui.autocomplete.escapeRegex(s.term),o=new RegExp(r,"ig"),c=e.grep(i,function(e){return o.test(e.title)});c.length&&(a(c),e(n).removeClass("pm-sspinner")),t.pm_search_request(s.term,function(t){i=t,a(t),e(n).removeClass("pm-sspinner")})}else t.pm_search_request("",function(t){i=t,a(t),e(n).removeClass("pm-sspinner")})},search:function(t,s){e(this).addClass("pm-sspinner")},open:function(){e(this).removeClass("pm-sspinner"),e(this).addClass("pm-open"),e(this).pmautocomplete("widget").css({"z-index":999999,position:"relative",top:0,left:0})},select:function(e,s){var n=t.pm_result_item_url(s.item);n&&(location.href=n,r.css("display","none").removeClass("active"),a=!1)}}).focus(function(){e(this).data("custom-pmautocomplete").search(" ")}).data("custom-pmautocomplete")._renderItem=function(s,a){return void 0!==a.no_result?e('<li class="no-result">').data("ui-autocomplete-item",a).append(a.no_result).appendTo(s):e("<li>").data("ui-autocomplete-item",a).append("<span class='icon-pm-incomplete'></span>").append("<a href='"+t.pm_result_item_url(a)+"'>"+a.title+"</a>").appendTo(s)};var c=e("#pmcteatetask");e("#wp-admin-bar-pm_create_task a").bind("click",function(e){e.preventDefault(),c.css("display","block").addClass("active"),t.pm_get_projects(function(e){var t="";t+="<select name='project' id='project' >",t+="<option value='0' selected > Select A project </option>",e.data.map(function(e){t+="<option value="+e.id+"  > "+e.title+" </option>"}),t+="</select>",c.find(".select-project").html(t)})}),e("#newtaskform").submit(function(e){e.preventDefault()})})}(jQuery)}});