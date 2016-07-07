var ADMIN_UPDATE_TS_BJ_DA = destHost + "/updateTimesheet/DA/BJ";
var ADMIN_UPDATE_TS_SH_DA = destHost + "/updateTimesheet/DA/SH";
var ADMIN_UPDATE_TS_BJ_DTA = destHost + "/updateTimesheet/DTA/BJ";
var ADMIN_UPDATE_TS_SH_DTA = destHost + "/updateTimesheet/DTA/SH";
var ADMIN_UPDATE_TS_CLEAR = destHost + "/updateTimesheet/clear";
var ADMIN_UPDATE_DMR_BJ = destHost + "/updateDMR/BJ";
var ADMIN_UPDATE_DMR_SH = destHost + "/updateDMR/SH";
var ADMIN_UPDATE_ETC_BJ = destHost + "/updateETC/BJ";
var ADMIN_UPDATE_ETC_SH = destHost + "/updateETC/SH";
var ADMIN_UPDATE_CN43N = destHost + "/updateCN43N";
var ADMIN_UPDATE_ALL_CLEAR = destHost + "/all/clear";

function dataManagementFunct(){
  var dataMngMain = addMainContainer("data_management", "div");
  addHeaderForMain(dataMngMain,"SAP Data Import");
  initialAlert(dataMngMain);
  
  var dataMngDiv = createElementTo("div", dataMngMain, "table-responsive");
  dataMngDiv.id = "data_mng_list_div";
  var _dataMngHeader = createElementTo("h3", dataMngDiv, "page-header");
  _dataMngHeader.innerHTML="ONLY use this function when database collapse!!!";
  
  if(loginUser.type!="admin")
  {
	  _dataMngHeader.innerHTML="ONLY Admin can use this function to import database!!! ";
	  return;
  }

  var clearAllBtn = createBtn('Clear all data(Timesheet, DMR, ETC)', dataMngDiv, "btn btn-warning", "clear_all_btn", function(){clearAllBtnClick()});
  $("#clear_all_btn").css("margin-bottom", "8px");

  var tableList = createElementTo("table", dataMngDiv, "table table-bordered");
  tableList.id = "table_list";
  $("#table_list").css("width", "80%");
  $("#table_list").css("margin-top", "10px");

  var tableListHead = createTableHead(tableHead, "table_list");
  formTable(tableListHead, null, "table_list");
  var tableListBody = createTableBody(tableListData, "table_list", tableHO);
  formTable(document.getElementById("table_list_head"), tableListBody, "table_list");  

  $("#table_list_head tr th:nth-child(4)").css("width", "220px");
  $("#table_list_head tr th:nth-child(4)").css("text-align", "center");

  $("#update_time_sheet_da_btn").click( function(){updateTSBtnClick("da");});
  $("#update_time_sheet_dta_btn").click( function(){updateTSBtnClick("dta");});
  $("#update_time_sheet_all_clear_btn").click( function(){updateTSBtnClick("all_clear");});
  $("#update_dmr_btn").click( function(){updateDMRBtnClick();});
  $("#update_etc_btn").click( function(){updateETCBtnClick();});
  $("#update_cn43n_btn").click( function(){updateCN43NBtnClick();});
}

function clearAllBtnClick()
{
  $("#data_management_alert_success").fadeOut();
  $("#data_management_alert").fadeOut();
  $("#clear_all_btn").html("Clearing " + animateRefreshIcon);

  utils.get(ADMIN_UPDATE_ALL_CLEAR, null, function(resp){clearAllBtnClickSuccess(resp);}, function(){clearAllBtnClickError();});
}

function clearAllBtnClickSuccess(response)
{
  if(response == "OK")
  {
    $("#clear_all_btn").html("Clear all data(Timesheet, DMR, ETC)");
    $("#data_management_alert_success").html("Timesheet updated successfully!");
    $("#data_management_alert_success").fadeIn();
  }
  else
    clearAllBtnClickError();
}

function clearAllBtnClickError()
{
  $("#clear_all_btn").html("Clear all data(Timesheet, DMR, ETC)");
  $("#data_management_alert").html("Timesheet updated failed! Please try again!");
  $("#data_management_alert").fadeIn();
}

function updateTSBtnClick(func)
{
  $("#data_management_alert_success").fadeOut();
  $("#data_management_alert").fadeOut();
  $("#update_time_sheet_" + func + "_btn").html("Updating " + animateRefreshIcon);

	if(func == "da"){
    utils.get(ADMIN_UPDATE_TS_BJ_DA, null, function(resp){updateTSBtnClickSuccess(func, resp);}, function(){updateTSBtnClickError(func);});
    //utils.get(ADMIN_UPDATE_TS_SH_DA, null, function(resp){updateTSBtnClickSuccess(func, resp);}, function(){updateTSBtnClickError(func);});
  }
	else if(func == "dta"){
	  utils.get(ADMIN_UPDATE_TS_BJ_DTA, null, function(resp){updateTSBtnClickSuccess(func, resp);}, function(){updateTSBtnClickError(func);});
	  //utils.get(ADMIN_UPDATE_TS_SH_DTA, null, function(resp){updateTSBtnClickSuccess(func, resp);}, function(){updateTSBtnClickError(func);});
  }
  else 
    utils.get(ADMIN_UPDATE_TS_CLEAR, null, function(resp){updateTSBtnClickSuccess(func, resp);}, function(){updateTSBtnClickError(func);});
}

function updateTSBtnClickSuccess(func, response)
{
  if(response == "OK")
  {
  	if(func == "da")
  		$("#update_time_sheet_da_btn").html("Update")
  	else if(func == "dta")
  		$("#update_time_sheet_dta_btn").html("Update")
  	else 
  		$("#update_time_sheet_all_clear_btn").html("Clear Timesheet");

    $("#data_management_alert_success").html("Timesheet updated successfully!");
    $("#data_management_alert_success").fadeIn();
  }
  else
    updateTSBtnClickError(func);
}

function updateTSBtnClickError(func)
{
  if(func == "da")
  	$("#update_time_sheet_da_btn").html("Update")
  else if(func == "dta")
  	$("#update_time_sheet_dta_btn").html("Upadate")
  else 
  	$("#update_time_sheet_all_clear_btn").html("Clear Timesheet");

  $("#data_management_alert").html("Timesheet updated failed! Please try again!");
  $("#data_management_alert").fadeIn();
}

function updateDMRBtnClick()
{
  $("#data_management_alert_success").fadeOut();
  $("#data_management_alert").fadeOut();
  $("#update_dmr_btn").html("Updating " + animateRefreshIcon);
  
  	utils.get(ADMIN_UPDATE_DMR_BJ, null, function(resp){updateDMRBtnClickSuccess(resp);}, function(){updateDMRBtnClickError();});
  	//utils.get(ADMIN_UPDATE_DMR_SH, null, function(resp){updateDMRBtnClickSuccess(resp);}, function(){updateDMRBtnClickError();});
}

function updateDMRBtnClickSuccess(response)
{
  if(response == "OK")
  {
    $("#update_dmr_btn").html("Update");
    $("#data_management_alert_success").html("DMR updated successfully!");
    $("#data_management_alert_success").fadeIn();
  }
  else
    updateDMRBtnClickError();
}

function updateDMRBtnClickError()
{
  $("#update_dmr_btn").html("Update");
  $("#data_management_alert").html("DMR updated failed! Please try again!");
  $("#data_management_alert").fadeIn();
}

function updateETCBtnClick()
{
  $("#data_management_alert_success").fadeOut();
  $("#data_management_alert").fadeOut();
  $("#update_etc_btn").html("Updating " + animateRefreshIcon);

  	utils.get(ADMIN_UPDATE_ETC_BJ, null, function(resp){updateETCBtnClickSuccess(resp);}, function(){updateETCBtnClickError();});
  	//utils.get(ADMIN_UPDATE_ETC_SH, null, function(resp){updateETCBtnClickSuccess(resp);}, function(){updateETCBtnClickError();});
}

function updateETCBtnClickSuccess(response)
{
  if(response == "OK")
  {
    $("#update_etc_btn").html("Update");
    $("#data_management_alert_success").html("ETC updated successfully!");
    $("#data_management_alert_success").fadeIn();
  }
  else
    updateETCBtnClickError();
}

function updateETCBtnClickError()
{
  $("#update_etc_btn").html("Update");
  $("#data_management_alert").html("ETC updated failed! Please try again!");
  $("#data_management_alert").fadeIn();
}

function updateCN43NBtnClick()
{
  $("#data_management_alert_success").fadeOut();
  $("#data_management_alert").fadeOut();
  $("#update_cn43n_btn").html("Updating " + animateRefreshIcon);

  utils.get(ADMIN_UPDATE_CN43N, null, function(resp){updateCN43NBtnClickSuccess(resp);}, function(){updateCN43NBtnClickError();});
}

function updateCN43NBtnClickSuccess(response)
{
  if(response == "OK")
  {
    $("#update_cn43n_btn").html("Update");
    $("#data_management_alert_success").html("CN43N updated successfully!");
    $("#data_management_alert_success").fadeIn();
  }
  else
    updateCN43NBtnClickError();
}

function updateCN43NBtnClickError()
{
  $("#update_cn43n_btn").html("Update");
  $("#data_management_alert").html("CN43N updated failed! Please try again!");
  $("#data_management_alert").fadeIn();
}

tableHead =
[
"Project",
"Start Year",
"End Year",
"BJ/SH"
]

tableHO =
[
"project",
"startYear",
"endYear",
"bj/sh"
]

tableListData = 
[
	{"project": "Timesheet",
	 "startYear": "2011",
	 "endYear": "This Year",
	 "bj/sh": '<button class="btn btn-success" id="update_time_sheet_da_btn" type="button" style="width:200px;">Update</button>'},
	{"project": "",
	 "startYear": "3 Month ago",
	 "endYear": "Today",
	 "bj/sh": '<button class="btn btn-success" id="update_time_sheet_dta_btn" type="button"  style="width:200px;">Update</button>'},
	 {"project": "",
	 "startYear": "",
	 "endYear": "",
	 "bj/sh": '<button class="btn btn-warning" id="update_time_sheet_all_clear_btn" type="button" style="width:200px;">Clear Timesheet</button>'},
	 {"project": "DMR",
	 "startYear": "2011",
	 "endYear": "Today",
	 "bj/sh": '<button class="btn btn-success" id="update_dmr_btn" type="button" style="width:200px;">Update</button>'},
	 {"project": "ETC",
	 "startYear": "2011",
	 "endYear": "Today",
	 "bj/sh": '<button class="btn btn-success" id="update_etc_btn" type="button" style="width:200px;">Update</button>'},
   {"project": "CN43N",
   "startYear": "2011",
   "endYear": "Today",
   "bj/sh": '<button class="btn btn-success" id="update_cn43n_btn" type="button" style="width:200px;">Update</button>'}
]