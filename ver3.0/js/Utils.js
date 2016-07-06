var destHost = "http://CH5OLT7WG4Q12.global.ds.honeywell.com:8080";
//var destHost = "http://192.168.0.100:8088";

//Define the URL of every function
var ADMIN_CREATE_ACCOUNT = destHost + "/accountManage/admin/new/createAccount";
var ADMIN_REFRESH_ACCOUNT_LIST = destHost + "/accountManage/admin/current/refreshAccountList";
var ADMIN_RESET_ACCOUNT = destHost + "/accountManage/admin/current/resetAccount";
var ADMIN_REMOVE_ACCOUNT = destHost + "/accountManage/admin/current/removeAccount";
var ADMIN_SAVE_LINKS = destHost + "/accountManage/admin/current/saveProjectLinks";
var ADMIN_REFRESH_PROJECT_LIST = destHost + "/accountManage/admin/project/refreshProject";
var ADMIN_CREATE_PROJECT = destHost + "/accountManage/admin/project/newProject";
var ADMIN_UPDATE_PROJECT = destHost + "/accountManage/admin/project/editProject";
var ADMIN_REMOVE_PROJECT = destHost + "/accountManage/admin/project/removeProject";
var CHANGE_PASSWORD = destHost + "/accountManage/project/passwordChange";
var ADMIN_GENERATE_NAME = destHost + "/accountManage/admin/generateName";
var GET_USER = destHost + "/getUser";
var LEAVE = destHost + "/leave";
var LOGOUT = destHost + "/logout";
var CUSTOMIZE_REFRESH_LEVEL_1 = destHost + "/customize/level1/refresh";
var ACTIVATE_LEVEL_1 = destHost + "/customize/level1/activate";
var DEACTIVATE_LEVEL_1 = destHost + "/customize/level1/deactivate";
var CUSTOMIZE_REFRESH_LEVEL_2 = destHost + "/customize/level2/refresh";
var ACTIVATE_LEVEL_2 = destHost + "/customize/level2/activate";
var DEACTIVATE_LEVEL_2 = destHost + "/customize/level2/deactivate";
var GET_WBS_LIST = destHost + "/bigData/timesheet/getAllWBS";
var GET_EID_LIST = destHost + "/bigData/timesheet/getAllEid";
var GET_TS_SEARCH_RESULT = destHost + "/bigData/timesheet/searchWithConditions";
var GET_PHASE_PAIR = destHost + "/bigData/copq/getPhasePair";
var GET_COPQ_SEARCH_RESULT = destHost + "/bigData/copq/searchWbs";
var BUDGET_USAGE_REFRESH = destHost + "/statuschecking/budgetusage/refresh";
var BUDGET_USAGE_EDIT = destHost + "/statuschecking/budgetusage/edit";
var CLOSE_DATE_REFRESH = destHost + "/statuschecking/closedate/refresh";
var CLOSE_DATE_EDIT = destHost + "/statuschecking/closedate/edit";
var ON_OFF_SITE_STATE_REFRESH = destHost + "/statuschecking/onoff/get";
var TIMESHEET_BILLING_REFRESH = destHost + "/statuschecking/timesheetbilling/refresh";
var TIMESHEET_BILLING_EDIT = destHost + "/statuschecking/timesheetbilling/edit";
var PM_PHASEMNG_GET = destHost + "/projectmanage/phasemanagement/get";
var PM_PHASEMNG_SAVE = destHost + "/projectmanage/phasemanagement/post";
var GET_EMPLOYEES_PHASE_RESULT = destHost + "/statuschecking/timesheetfilling/searchPhase";
var GET_EMPLOYEES_ADMINHOURS_RESULT = destHost + "/statuschecking/timesheetfilling/searchAdminHours";
var GET_SUPERVISORS = destHost + "/statuschecking/timesheetfilling/getSupervisors";
var OVERVIEW_WBS_GET = destHost + "/overviewwbs/refresh";
var OVERVIEW_WBS_POST = destHost + "/overviewwbs/edit";
var OVERVIEW_WBS_TIME_CHART_POST = destHost + "/overviewwbs/timechart/post"
var OVERVIEW_WBS_GANTT_CHART_GET = destHost + "/overviewwbs/Gantt";
var GET_KEY_CODE_LIST = destHost + "/keycodemanagement/get";
var POST_ACTIVE_WBS_RESULT = destHost + "/keycodemanagement/post";
var GET_WBS_ATTRIBUTE = destHost + "/keycodemanagement/wbs/get";

var animateRefreshIcon = "<span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span>";
//judge if the item is in the array
function isContain(itm, array)
{
  if($.inArray(itm, array)>=0)
    return true;
  else
    return false;
}

//Copy obj
function copyObj(oldObject)
{
  var newObject = JSON.parse(JSON.stringify(oldObject));
  return newObject;
}

//select item from targetList by a certain attribute value
function selectItemByAttr(attrName, attrValue, targetList)
{
  for(var i = 0; i< targetList.length; i++)
  {
    if(targetList[i][attrName] == attrValue)
      return targetList[i];
  }
  return null;
}

//avoid bubble event of the component (such as click)
function consumeBubbleEvent(e)
{
  if (!e)
      e = window.event;

    //IE9 & Other Browsers
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    //IE8 and Lower
    else {
      e.cancelBubble = true;
    }
}

//change the "main" div to a certain function
function switchMainTo(functId){
  
  if(!createFunct[functId] && functId != "welcome_note")
    return;
  $("#"+activeMainId).hide();
  activeMainId=functId+"_main";
  if($("#"+functId+"_main").length>0)
    $("#"+functId+"_main").show();
  else
    createFunct[functId]();
}

//add an element (certain node type & class) to the parent node
function createElementTo(nodeName, parentNode, className)
{
  var newElement=document.createElement(nodeName);
  if(parentNode)
    parentNode.appendChild(newElement);
  if(className)
    newElement.className=className;
  return newElement;
}

//create a button to a parent node, with certain text, class, id & onclick function
function createBtn(btnText, parentNode, btnClass, btnId, funct)
{
  var _btn = createElementTo("button", parentNode, btnClass);
  _btn.id = btnId;
  _btn.setAttribute("type","button");
  _btn.innerHTML = btnText;
  //_btn.onclick=funct;
  if($("#"+_btn.id).length>0)
    $("#"+_btn.id).click(funct);
  else
    _btn.onclick=funct;

  return _btn;
}

//initialize a modal given a title text
function initializeModal(modalDiv, titleText)
{
  var _modalDialog = createElementTo("div", modalDiv, "modal-dialog");
  var _modalContent = createElementTo("div", _modalDialog, "modal-content");
  var _modalHeader = createElementTo("div", _modalContent, "modal-header");

  var _closeBtn = createElementTo("button", _modalHeader, "close");
  _closeBtn.setAttribute("type","button");
  _closeBtn.setAttribute("data-dismiss","modal");
  _closeBtn.setAttribute("aria-hidden", "true");
  _closeBtn.innerHTML = "&times;";

  var _header = createElementTo("h3", _modalHeader, "modal-title");
  _header.innerHTML = titleText;

  var _body = createElementTo("div", _modalContent, "modal-body");
  _body.id = modalDiv.id + "_body";

  var _footer = createElementTo("div", _modalContent,"modal-footer");
  _footer.id = modalDiv.id + "_footer";
}

///////////////////////////
//Table forming functions//
///////////////////////////

//head + body = a full table
function formTable(head, body, parentTableId)
{
  $("#"+parentTableId + "thead").remove();
  $("#"+parentTableId).append(head);
  if(body)
  {
    $("#"+parentTableId + "tbody").remove();
    $("#"+parentTableId).append(body);
  }
}

function createTableHead(tableHeadList, parentTableId)
{
  var _tablehead = document.createElement("thead");
  var _tablehead_tr = createElementTo("tr", _tablehead);
  _tablehead.id = parentTableId+"_head";

  for (var i = 0; i < tableHeadList.length; i ++)
  {
    var _th = createElementTo("th", _tablehead_tr);
    _th.innerHTML=tableHeadList[i];
  }
  return _tablehead;
}

function createTableBody(tableBodyList, parentTableId, headOrderList)
{
  var _tablebody = document.createElement("tbody");
  _tablebody.id = parentTableId + "_body";

  for(var i = 0; i < tableBodyList.length; i ++)
    {
      var _tablebody_tr = createElementTo("tr", _tablebody);
      _tablebody_tr.id = _tablebody.id + i;

      for(var k = 0; k < headOrderList.length; k ++)
      {
        itm = headOrderList[k];
        var _td = createElementTo("td", _tablebody_tr);
        //for multiple objects appended to the table
        if(itm == "edit")
        {
          for(var j = 0; j< tableBodyList[i][itm].length; j++)
          {
            _td.appendChild(tableBodyList[i][itm][j]);
            _td.appendChild(document.createTextNode(" "));
          }
        }
        else if(itm == "links")
        {
          if(tableBodyList[i][itm].length > 0)
          {
              _td.innerHTML=tableBodyList[i][itm];
              _td.innerHTML = _td.innerHTML.replace(/\,/g, "<br/>")
          }
            else
              _td.innerHTML="";
        }
        else
          if(tableBodyList[i][itm])
          {
            if(tableBodyList[i][itm].length > 0)
              _td.innerHTML=tableBodyList[i][itm];
            else
              _td.innerHTML="";
          }
          else
            _td.innerHTML="";
      }
    }
  return _tablebody;
}

var utils = {
  get : function (url, para, onSuccess, onError)
  {
    $.ajax({
      method: "GET",
      data: para,
      url: url,
      success: onSuccess,
      error: onError
    });
  },
  post : function (url, data, onSuccess, onError)
  {
    $.ajax({
      method: "POST",
      data: data,
      url: url,
      success: onSuccess,
      error: onError
    });
  }
}

/////////////////////////////////////////////////////////////////
// The following objects are for local testing.
// They should be sent by server in actual situation.
// Only for local test. Must be deleted before release!
/////////////////////////////////////////////////////////////////

var testCurrentList = [
{
  eid: "Admin1",
  type: "Admin",
  name:"Admin1",
  links: null
},
{
  eid: "Admin2",
  type: "Admin",
  name:"Admin2",
  links: ["AA-00000244", "KI-00027344"]
},
{
  eid: "Admin3",
  type: "Admin",
  name:"Admin3",
  links: null
},
{
  eid:"E335470",
  type: "Project",
  name: "Wang, Fei (EX CH01)",
  links: ["AE-00000820"]
}
];

var testProjectList = [
{
  id: "1",
  definition: "AE-00000820",
  description: "CNSCOE_BJ"
},
{
  id: "2",
  definition: "AE-00000821",
  description: "CNSCOE_SH"
},
{
  id: "3",
  definition: "AA-00000244",
  description: "DUMMY_001"
},
{
  id: "4",
  definition: "PA-00360254",
  description: "DUMMY_002"
},
{
  id: "5",
  definition: "AE-00000114",
  description: "DUMMY_003"
},
{
  id: "6",
  definition: "YE-00027344",
  description: "DUMMY_004"
}
];

var accountListHO = ["eid","type","name","links","edit"];
var plListHO = ["definition", "description", "check"];
var pmListHO = ["definition", "description"];
var level2HO = ["Active Status","Aero Network","Aero Activity Num","Aero Key Code","WBS Person Responsible","HTS Assigned WBS","HTS WBS Description","System Status","User Status"];