var clickToEdit = "<i style=\"color:grey\"> (Click to Edit...)</i>";
var clickToEditDate = "<i style=\"color:grey\"> (Click to Edit Date...)</i>"

var totalBudgetUserNb = "N/A";
var currentBudgetUserList = [];
var currentBudgetIndex = "";
var selectedBudget = [];

var currentCloseDateList = [];
var currentCloseDateIndex = "";
var selectedCloseDate = [];

var currentTimeSheetBillingList = [];
var currentTimeSheetBillingIndex = "";
var selectedTimeSheetBilling = [];

var currentOnOffSiteStateList = [];

var dateSearchingItems = {};
var recievedSupervisor = [];
var selectedRow = "";
var allSupervisors = [];
var dateSelectItems = {};

  var currentDate = new Date();
  var currentDateDD = currentDate.getDate();
  var currentDateXX = currentDate.getDay();
  currentDate.setDate(currentDateDD-currentDateXX+1);
  var currentMonth = currentDate.getMonth() + 1;
  var currentSun = currentDate.getFullYear() + "." + currentMonth + "." + currentDate.getDate();
  currentDate.setDate(currentDateDD+7-currentDateXX);
  currentMonth = currentDate.getMonth() + 1;
  var currentSat = currentDate.getFullYear() + "." + currentMonth + "." + currentDate.getDate();

function budgetUsageFunct()
{
  var BudgetUsageMain = addMainContainer("Budget_Usage", "div");

  addHeaderForMain(BudgetUsageMain,"Budget Usage");

  initialAlert(BudgetUsageMain);

  var tableDiv = createElementTo("div", BudgetUsageMain, "table-responsive");
  tableDiv.id = "current_list_div";

  var textBox = createElementTo("div", tableDiv);

  var generalText = createElementTo("p", textBox);
  generalText.innerHTML = "Current Budget Usage: ";
  generalText.id = "current_budget_usage";
  $("#current_budget_usage").css("float", "left");
  $("#current_budget_usage").css("padding-top", "8px");
  
  // var refreshBudgetBtn = createBtn("Refresh", textBox, "btn btn-success", "bgt_current_refresh_btn", function(){refreshBudgetBtnClick()});
  // refreshBudgetBtn.setAttribute("style","margin-left: 10px");

  var editBudgetBtn = createBtn('<span class="glyphicon glyphicon-edit"></span> Edit', textBox, "btn btn-warning", "edit_budgetusage_btn", function(){});
  editBudgetBtn.setAttribute("style", "margin-left:10px;");
  editBudgetBtn.setAttribute("data-toggle","modal");
  editBudgetBtn.setAttribute("data-target","#bdg_edit_modal");
  $("#edit_budget_btn").prop("disabled", true);

  var BudgetUsageDiv = createElementTo("div", BudgetUsageMain, "table-responsive table-overwide");
  BudgetUsageDiv.id = "budget_usage_div";
  
  var tableHeight=$(window).height()-$("#navbar").height()- ($("#main").innerHeight()-$("#main").height())- $(".page-header").outerHeight(true);
  $("#budget_usage_div").css("height",tableHeight+"px");
  $("#budget_usage_div").css("overflow-y", "auto");

  //var BudgetUsageList = createElementTo("table", BudgetUsageDiv, "table table-bordered table-striped");
  var BudgetUsageList = createElementTo("table", BudgetUsageDiv, "table table-bordered");
  BudgetUsageList.id = "budget_usage_table";
  $("#budget_usage_table").css("float", "left");
  $("#budget_usage_table").css("width", "80%");
  $("#budget_usage_table").css("margin-top", "10px");

  var budgetUsageListHead = createTableHead(budgetUsageHead, "budget_usage_table");
  formTable(budgetUsageListHead, null, "budget_usage_table");

  createBudgetEditModal(BudgetUsageMain);
  
  /////test
  //var budgetUsageListBody = createTableBody(testBudgetUsage, "budget_usage_table", budgetUsageHead)
  //formTable(budgetUsageListHead, budgetUsageListBody, "budget_usage_table");
  //$("#budget_usage_table tbody tr").click(function(){bgtListClick(this.id);});
  //createPlModal(BudgetUsageMain);
  //createResetModal(BudgetUsageMain);
  //createRemoveModal(BudgetUsageMain);
  
  //generateBudgetCurrentListBody(testBudgetUsage);
  refreshBudgetBtnClick();
  $("#Budget_Usage").click(function(){refreshBudgetBtnClick();});  
}

budgetUsageHead =
[
"HTS Assigned WBS", 
"HTS WBS Description", 
"ETC Hours",
"ETC Cost",
"Aero Project Start Date", 
"Aero Project Finish Date", 
"Estimated Heads", 
"Budget Enough for 1 month", 
"Issues tracking comments",
]

testBudgetUsage = 
[
{
	"Level2 WBS": "AE-00000820-021-0015",
	"Level2 WBS Desc": "CNS Software China DEV",
	"ETC Hours": "66.00",
	"ETC Cost": "5,400.00",
	"Latest Update Start": "23.02.2015",
	"Latest Update End": "25.08.2015",
	"Estimated Heads": "1.5",
	"Budget Enough for 1 Month": "No",
	"Issues Tracking Comments": "Enough until this year"
},
{
	"Level2 WBS" : "AE-00000820-021-0015",
	"Level2 WBS Desc": "CNS Software China DEV",
	"ETC Hours" : "2.00",
	"ETC Cost" : "200.00",
	"Latest Update Start" : "23.02.2015",
	"Latest Update End" : "25.08.2015",
	"Estimated Heads" : "1",
	"Budget Enough for 1 Month" : "No",
	"Issues Tracking Comments" : "Need ask for more"
},
{
	"Level2 WBS" : "",
	"Level2 WBS Desc": "",
	"ETC Hours" : "",
	"ETC Cost" : "",
	"Latest Update Start" : "",
	"Latest Update End" : "",
	"Estimated Heads" : "",
	"Budget Enough for 1 Month" : "",
	"Issues Tracking Comments" : ""
}
]

//var bugetUsageBodyHO = ["Estimated Heads", "Issues tracking comments", "Aero Project Start Date", "Budget Enough for 1 month", "HTS Assigned WBS", "HTS WBS Description", "Aero Project Finish Date", "ETC Cost", "ETC Hours"];
var bugetUsageBodyHO = ["HTS Assigned WBS", "HTS WBS Description", "ETC Hours", "ETC Cost", "Aero Project Start Date", "Aero Project Finish Date", "Estimated Heads", "Budget Enough for 1 month", "Issues tracking comments"];

function refreshBudgetBtnClick()
{
	$("#Budget_Usage_main_alert").fadeOut();
  //send refresh order to server here!!!
  $("#current_budget_usage").html('Current budget usage: ' + animateRefreshIcon + ' Loading...');

  utils.get(BUDGET_USAGE_REFRESH,"eid="+loginUser.eid, function(resp){refreshBudgetBtnClickSuccess(resp)}, function(){refreshBudgetBtnClickError()});
}

function refreshBudgetBtnClickSuccess(response)
{
  $("#generate_button").html('Generate');
  //$("#current_budget_usage").fadeOut();
  //$("#Budget_Usage_main_alert").fadeOut();

  response = response.replace(/\'/g, "\"");
  var recievedBudgetList = $.parseJSON(response);
  //var recievedBudgetList = testBudgetUsage
  currentBudgetUserList = recievedBudgetList;
  totalBudgetUserNb = recievedBudgetList.length;

  generateBudgetCurrentListBody(currentBudgetUserList);
  $("#current_budget_usage").html("Current budget usage: "+ totalBudgetUserNb);
  $("#budget_usage_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");
}

function refreshBudgetBtnClickError()
{
  $("#generate_button").html('Generate');
  $("#Budget_Usage_main_alert").fadeOut();
  $("#Budget_Usage_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Refresh budget usage failed!');
  $("#Budget_Usage_main_alert").fadeIn();
  $("#current_budget_usage").html('Current budget usage: N/A');
}


function generateBudgetCurrentListBody(bodylist)
{
  //$("#edit_budget_btn").prop("disabled", true);
  //$("#remove_project_btn").prop("disabled", true);
  if($("#budget_usage_table").length > 0)
    $("#budget_usage_table").remove();

  //var BudgetUsageList = createElementTo("table", document.getElementById("budget_usage_div"), "table table-bordered table-striped");
  var BudgetUsageList = createElementTo("table", document.getElementById("budget_usage_div"), "table table-bordered");
  BudgetUsageList.id = "budget_usage_table";
  $("#budget_usage_table").css("float", "left");
  $("#budget_usage_table").css("width", "80%");
  $("#budget_usage_table").css("margin-top", "10px");
  
  var currentBudgetusageListBody = createTableBody(bodylist, "budget_usage_table", bugetUsageBodyHO);
  
  var _head = createTableHead(budgetUsageHead, "budget_usage_table");

  formTable(_head, currentBudgetusageListBody,"budget_usage_table");

  $("#budget_usage_table tbody tr").click(function(){bgtListClick(this.id);});
  //tableSorterGroup("budget_usage_table");
  
  addPager("budget_usage_table",9);
	
	$.tablesorter.themes.bootstrap = {
	    // these classes are added to the table. To see other table classes available,
	    // look here: http://getbootstrap.com/css/#tables
	    table        : 'table table-bordered', //table-striped
	    caption      : 'caption',
	    // header class names
	    header       : 'bootstrap-header', // give the header a gradient background (theme.bootstrap_2.css)
	    sortNone     : '',
	    sortAsc      : '',
	    sortDesc     : '',
	    active       : '', // applied when column is sorted
	    hover        : '', // custom css required - a defined bootstrap style may not override other classes
	    // icon class names
	    icons        : '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
	    iconSortNone : 'bootstrap-icon-unsorted', // class name added to icon when column is not sorted
	    iconSortAsc  : 'glyphicon glyphicon-chevron-up', // class name added to icon when column has ascending sort
	    iconSortDesc : 'glyphicon glyphicon-chevron-down', // class name added to icon when column has descending sort
	    filterRow    : '', // filter row class; use widgetOptions.filter_cssFilter for the input/select element
	    footerRow    : '',
	    footerCells  : '',
	    even         : '', // even row zebra striping
	    odd          : ''  // odd row zebra striping
	  };

	$("#budget_usage_table").tablesorter({
	  // this will apply the bootstrap theme if "uitheme" widget is included
	  // the widgetOptions.uitheme is no longer required to be set
	  theme : "bootstrap",

	  widthFixed: true,

	  headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

	  // widget code contained in the jquery.tablesorter.widgets.js file
	  // use the zebra stripe widget if you plan on hiding any rows (filter widget)
	  widgets : [ "uitheme", "filter"],//, "zebra" ],

	  widgetOptions : {
	    // using the default zebra striping class name, so it actually isn't included in the theme variable above
	    // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
	    zebra : ["even", "odd"],

	    // reset filters button
	    filter_reset : ".reset",

	    // extra css class name (string or array) added to the filter element (input or select)
	    filter_cssFilter: "form-control",

	    // set the uitheme widget to use the bootstrap theme class names
	    // this is no longer required, if theme is set
	    // ,uitheme : "bootstrap"

	  }
	})

    .tablesorterPager({

	  // target the pager markup - see the HTML block below
	  container: $(".ts-pager"),

	  // target the pager page select dropdown - choose a page
	  cssGoto  : ".pagenum",

	  // remove rows from the table to speed up the sort of large tables.
	  // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
	  removeRows: false,

	  // output string - default is '{page}/{totalPages}';
	  // possible variables: {page}, {totalPages}, {filteredPages}, {startRow}, {endRow}, {filteredRows} and {totalRows}
	  output: '{startRow} - {endRow} ({totalRows})'

	});
	
	reformBudgetUsageTableStyle("budget_usage_table");
}

function reformBudgetUsageTableStyle(tableId)
{
    var bgtUsageArray = $("#" + tableId + "_body tr td:nth-child(8)");
    //var userStatusArray = $("#" + tableId + "_body tr td:nth-child(9)");
    var _trs = $("#" + tableId + "_body [role='row']");
	for(var i = 0; i < bgtUsageArray.length; i++)
	{
		var _sys = bgtUsageArray[i].innerHTML;

		if(_sys == "No/Close")
		{
			bgtUsageArray[i].style.color = "blue";
		}
	}
	
	for(var i = 0; i < bgtUsageArray.length; i++)
	{
		var _sys = bgtUsageArray[i].innerHTML;

		if(_sys == "No")
		{
			bgtUsageArray[i].style.color = "red";
		}
	}

}

function bgtListClick(itemId)
{
  var plIndex = itemId.replace("budget_usage_table_body","");
  var projectList = currentBudgetUserList;

  selectedBudget = currentBudgetUserList[plIndex];
  if($("#" + itemId).hasClass("checked"))
  {
    $("#" + itemId).removeClass("checked");
    selectedBudget = [];
    $("#edit_budget_btn").prop("disabled", true);
    //$("#remove_project_btn").prop("disabled", true);
    
  }
  else
  {
    if(currentBudgetIndex)
      $("#budget_usage_table_body" + currentBudgetIndex).removeClass("checked");
    currentBudgetIndex = plIndex;
    $("#" + itemId).addClass("checked");
    $("#edit_budget_btn").prop("disabled", false);
    //$("#remove_project_btn").prop("disabled", false);
  }
}


function addbudgetEditBtns(listItem)
{
  //var btnEdit = document.createElement("button");
  //btnEdit.className = "btn btn-warning btn-mini";
  //createElementTo("span", btnEdit, "glyphicon glyphicon-exclamation-sign");
  //btnEdit.setAttribute("type","button");
  //btnEdit.setAttribute("data-hover", "tooltip");
  //btnEdit.setAttribute("data-placement", "top");
  //btnEdit.setAttribute("title", "Edit ");
  //btnEdit.setAttribute("data-toggle","modal");
  //btnEdit.setAttribute("data-target","#reset_modal");
  //btnEdit.onclick = function(){currentUserId = listItem.EstimatedHeads;};
  var tableDiv = createElementTo("div", tableDiv, "table-responsive");
  tableDiv.id = "proj_mng_list_div";

  var bthBox = createElementTo("div", tableDiv);  
  //var bthBox = createElementTo("div", tableDiv);
  
  var editEstimatedHeadBtn = createBtn('<span class="glyphicon glyphicon-edit"></span> Edit', bthBox, "btn btn-warning", "edit_estimated_headroom_btn", function(){});
  editEstimatedHeadBtn.setAttribute("style", "margin-left:10px;");
  editEstimatedHeadBtn.setAttribute("data-toggle","modal");
  editEstimatedHeadBtn.setAttribute("data-target","#bdg_edit_modal");
  $("#edit_budget_btn").prop("disabled", true);

  listItem.edit = [editEstimatedHeadBtn];
}

//编辑，含多个输入框
function createBudgetEditModal(parentNode)
{
  //create modal for add project
  var bgtEditModal = createElementTo("div", parentNode, "modal fade");
  bgtEditModal.id = "bdg_edit_modal";
  bgtEditModal.setAttribute("tabindex","-1");
  bgtEditModal.setAttribute("role","dialog");
  bgtEditModal.setAttribute("aria-hidden", "true");
  bgtEditModal.setAttribute("data-backdrop", "static");
  initializeModal(bgtEditModal, "Edit Items");

  initialAlert(document.getElementById("bdg_edit_modal_body"));

  var bgtEditModalBody = document.getElementById("bdg_edit_modal_body");

  //输入框的简便办法
  newInputArea(bgtEditModalBody, "edit_estimated_heads", "Estimated Head:", "edprojdef", "text","");
  $("#edit_estimated_heads_input").prop('disabled', false);
  newInputArea(bgtEditModalBody, "edit_issue_tracking_comments", "Issue Tracking Comments:", "edprojname", "text","");
  $("#edit_issue_tracking_comments_input").prop('disabled', false);

  $("#bdg_edit_modal").on("show.bs.modal", function(){bgtEditModalShow();});
  
  var bgtEditModalFooter = document.getElementById("bdg_edit_modal_footer");
  var bgtEditCancelBtn = createBtn("Cancel", bgtEditModalFooter, "btn btn-default");
  bgtEditCancelBtn.setAttribute("data-dismiss", "modal");
  var bgtEditCancelBtn = createBtn("Save", bgtEditModalFooter, "btn btn-primary", "bdg_edit_modal_save_btn", function(){bgtEditSaveBtnClick()});
  bgtEditCancelBtn.id = "bdg_edit_modal_save_btn";
}

function bgtEditModalShow()
{
  $("#bdg_edit_modal_body_alert").fadeOut();
  $("#edit_estimated_heads_input").val("");
  $("#edit_issue_tracking_comments_input").val("");
  if(selectedBudget)
  {
    $("#edit_estimated_heads_input").val(selectedBudget["Estimated Heads"]);
    $("#edit_issue_tracking_comments_input").val(selectedBudget["Issues tracking comments"]);

    $("#edit_estimated_heads_input").attr("oldValue", selectedBudget["Estimated Heads"]);
    $("#edit_issue_tracking_comments_input").attr("oldValue", selectedBudget["Issues tracking comments"]);
  }
}

function bgtEditSaveBtnClick()
{
  $("#bdg_edit_modal_body_alert").fadeOut();
  var isNotEdited = ($("#edit_estimated_heads_input").attr("oldValue") == $("#edit_estimated_heads_input").val()) && ($("#edit_issue_tracking_comments_input").attr("oldValue") == $("#edit_issue_tracking_comments_input").val());

  if(isNotEdited)
  {
    $("#bdg_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Budget Edit info does not change!');
    $("#bdg_edit_modal_body_alert").fadeIn();
  }
  else
  {
    var postData = copyObj(selectedBudget);
    postData["Estimated Heads"] = $("#edit_estimated_heads_input").val();
    postData["Issues tracking comments"] = $("#edit_issue_tracking_comments_input").val();

    $("#bdg_edit_modal_save_btn").html('Save ' + animateRefreshIcon);
    utils.post(BUDGET_USAGE_EDIT, postData, function(){bgtEditSaveBtnClickSuccess();}, function(){bgtEditSaveBtnClickError();});
  }

}

function bgtEditSaveBtnClickSuccess()
{
  $("#bdg_edit_modal_save_btn").html('Save');
  $("#bdg_edit_modal").modal("hide");
  //refreshProjectList();
  refreshBudgetBtnClick();
}

function bgtEditSaveBtnClickError()
{
  $("#bdg_edit_modal_save_btn").html('Save');
  $("#bdg_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Edit project failed!');
  $("#bdg_edit_modal_body_alert").fadeIn();
}





function closeDateFunct()
{
  var CloseDateMain = addMainContainer("Close_Date", "div");

  addHeaderForMain(CloseDateMain,"Close Date");

  initialAlert(CloseDateMain);

  var tableCloseDateDiv = createElementTo("div", CloseDateMain, "table-responsive");
  tableCloseDateDiv.id = "current_close_date_div";

  var textCloseDateBox = createElementTo("div", tableCloseDateDiv);

  var generalCloseDateText = createElementTo("p", textCloseDateBox);
  generalCloseDateText.innerHTML = "Current Close Date list: ";
  generalCloseDateText.id = "current_close_date";
  $("#current_close_date").css("float", "left");
  $("#current_close_date").css("padding-top", "8px");
  
  // var refreshCloseDatetBtn = createBtn("Refresh", textCloseDateBox, "btn btn-success", "cls_current_refresh_btn", function(){refreshCloseDateBtnClick()});
  // refreshCloseDatetBtn.setAttribute("style","margin-left: 10px");

  var editCloseDateCommentBtn = createBtn('<span class="glyphicon glyphicon-edit"></span> Edit', textCloseDateBox, "btn btn-warning", "edit_close_date_comment_btn", function(){});
  editCloseDateCommentBtn.setAttribute("style", "margin-left:10px;");
  editCloseDateCommentBtn.setAttribute("data-toggle","modal");
  editCloseDateCommentBtn.setAttribute("data-target","#close_date_edit_modal");
  $("#edit_budget_btn").prop("disabled", true);

  //表太宽，在他的class最后增加table-overwide
  var closeDateDiv = createElementTo("div", CloseDateMain, "table-responsive table-overwide");
  closeDateDiv.id = "close_date_div";
  
  var tableHeight=$(window).height()-$("#navbar").height()- ($("#main").innerHeight()-$("#main").height())- $(".page-header").outerHeight(true);
  $("#close_date_div").css("height",tableHeight+"px");
  $("#close_date_div").css("overflow-y", "auto");

  //var BudgetUsageList = createElementTo("table", BudgetUsageDiv, "table table-bordered table-striped");
  var closeDateList = createElementTo("table", closeDateDiv, "table table-bordered");
  closeDateList.id = "close_date_table";
  $("#close_date_table").css("float", "left");
  $("#close_date_table").css("width", "80%");
  $("#close_date_table").css("margin-top", "10px");

  var closeDateListHead = createTableHead(closeDateHead, "close_date_table");
  formTable(closeDateListHead, null, "close_date_table");

  createCloseDateEditModal(CloseDateMain);
  
  /////test
  //var budgetUsageListBody = createTableBody(testBudgetUsage, "budget_usage_table", budgetUsageHead)
  //formTable(budgetUsageListHead, budgetUsageListBody, "budget_usage_table");
  //$("#budget_usage_table tbody tr").click(function(){bgtListClick(this.id);});
  
  //generateBudgetCurrentListBody(testBudgetUsage);
  //refreshCloseDateBtnClick();
  refreshCloseDateBtnClick();
  $("#Close_Date").click(function(){refreshCloseDateBtnClick();});  
}

testCloseDate = 
[
{
	"Level2 WBS": "AE-00000820-021-0015",
	"Level2 WBS Desc": "CNS Software China DEV",
	"Aero Close Date": "23.02.2015",
	"Close more than 1 month": "yes",
	"Issues Tracking Comments": "Enough until this year"
},
{
	"Level2 WBS": "AE-00000820-021-0016",
	"Level2 WBS Desc": "CNS Software China DEV",
	"Aero Close Date": "23.02.2015",
	"Close more than 1 month": "yes",
	"Issues Tracking Comments": "Enough until this year"
},
{
	"Level2 WBS": "AE-00000820-021-0017",
	"Level2 WBS Desc": "CNS Software China DEV",
	"Aero Close Date": "23.07.2015",
	"Close more than 1 month": "No",
	"Issues Tracking Comments": "Enough until this year"
}
]

closeDateHead =
[
"HTS Assigned WBS", 
"HTS WBS Description", 
"Aero Close Date",
"Close more than 1 month",
"Issues tracking comments"
]

var closeDateBodyHO = ["HTS Assigned WBS", "HTS WBS Description", "Aero Close Date", "Close more than 1 month", "Issues tracking comments"];

function refreshCloseDateBtnClick()
{
	$("#Budget_Usage_main_alert").fadeOut();
  //send refresh order to server here!!!
  $("#current_close_date").html('Current close date: ' + animateRefreshIcon + ' Loading...');

  utils.get(CLOSE_DATE_REFRESH,"eid="+loginUser.eid, function(resp){refreshCloseDateBtnClickSuccess(resp)}, function(){refreshCloseDateBtnClickError()});
}

function refreshCloseDateBtnClickSuccess(response)
{
  $("#generate_button").html('Generate');

  response = response.replace(/\'/g, "\"");
  var recievedCloseDateList = $.parseJSON(response);
  currentCloseDateList = recievedCloseDateList;
  //currentCloseDateList = testCloseDate;
  totalClosedateListNb = currentCloseDateList.length;

  generateCloseDateCurrentListBody(currentCloseDateList);
  $("#current_close_date").html("Current close date list: "+ totalClosedateListNb);
  $("#close_date_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");
}

function refreshCloseDateBtnClickError()
{
  $("#generate_button").html('Generate');
  $("#close_date_main_alert").fadeOut();
  $("#close_date_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Refresh close date failed!');
  $("#close_date_main_alert").fadeIn();
  $("#current_close_date").html('Current close date list: N/A');
}


function generateCloseDateCurrentListBody(bodylist)
{
  if($("#close_date_table").length > 0)
    $("#close_date_table").remove();

  var closeDateList = createElementTo("table", document.getElementById("close_date_div"), "table table-bordered");
  closeDateList.id = "close_date_table";
  $("#close_date_table").css("float", "left");
  $("#close_date_table").css("width", "80%");
  $("#close_date_table").css("margin-top", "10px");
  
  var currentCloseDateListBody = createTableBody(bodylist, "close_date_table", closeDateBodyHO);
  
  var _head = createTableHead(closeDateHead, "close_date_table");

  formTable(_head, currentCloseDateListBody,"close_date_table");

  $("#close_date_table tbody tr").click(function(){closedateListClick(this.id);});
  //tableSorterGroup("budget_usage_table");
  
  addPager("close_date_table",5);
	
	$.tablesorter.themes.bootstrap = {
	    // these classes are added to the table. To see other table classes available,
	    // look here: http://getbootstrap.com/css/#tables
	    table        : 'table table-bordered', //table-striped
	    caption      : 'caption',
	    // header class names
	    header       : 'bootstrap-header', // give the header a gradient background (theme.bootstrap_2.css)
	    sortNone     : '',
	    sortAsc      : '',
	    sortDesc     : '',
	    active       : '', // applied when column is sorted
	    hover        : '', // custom css required - a defined bootstrap style may not override other classes
	    // icon class names
	    icons        : '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
	    iconSortNone : 'bootstrap-icon-unsorted', // class name added to icon when column is not sorted
	    iconSortAsc  : 'glyphicon glyphicon-chevron-up', // class name added to icon when column has ascending sort
	    iconSortDesc : 'glyphicon glyphicon-chevron-down', // class name added to icon when column has descending sort
	    filterRow    : '', // filter row class; use widgetOptions.filter_cssFilter for the input/select element
	    footerRow    : '',
	    footerCells  : '',
	    even         : '', // even row zebra striping
	    odd          : ''  // odd row zebra striping
	  };

	$("#close_date_table").tablesorter({
	  // this will apply the bootstrap theme if "uitheme" widget is included
	  // the widgetOptions.uitheme is no longer required to be set
	  theme : "bootstrap",

	  widthFixed: true,

	  headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

	  // widget code contained in the jquery.tablesorter.widgets.js file
	  // use the zebra stripe widget if you plan on hiding any rows (filter widget)
	  widgets : [ "uitheme", "filter"],//, "zebra" ],

	  widgetOptions : {
	    // using the default zebra striping class name, so it actually isn't included in the theme variable above
	    // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
	    zebra : ["even", "odd"],

	    // reset filters button
	    filter_reset : ".reset",

	    // extra css class name (string or array) added to the filter element (input or select)
	    filter_cssFilter: "form-control",

	    // set the uitheme widget to use the bootstrap theme class names
	    // this is no longer required, if theme is set
	    // ,uitheme : "bootstrap"

	  }
	})

    .tablesorterPager({

	  // target the pager markup - see the HTML block below
	  container: $(".ts-pager"),

	  // target the pager page select dropdown - choose a page
	  cssGoto  : ".pagenum",

	  // remove rows from the table to speed up the sort of large tables.
	  // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
	  removeRows: false,

	  // output string - default is '{page}/{totalPages}';
	  // possible variables: {page}, {totalPages}, {filteredPages}, {startRow}, {endRow}, {filteredRows} and {totalRows}
	  output: '{startRow} - {endRow} ({totalRows})'

	});
	
	reformCloseDateTableStyle("close_date_table");
}

function reformCloseDateTableStyle(tableId)
{

    var clsDateArray = $("#" + tableId + "_body tr td:nth-child(4)");
    //var userStatusArray = $("#" + tableId + "_body tr td:nth-child(9)");
    var _trs = $("#" + tableId + "_body [role='row']");
	for(var i = 0; i < clsDateArray.length; i++)
	{
		var _sys = clsDateArray[i].innerHTML;
		//var _user = userStatusArray[i].innerHTML;


		if(_sys == "No")
		{
			clsDateArray[i].style.color = "red";
		}
	}
		for(var i = 0; i < clsDateArray.length; i++)
	{
		var _sys = clsDateArray[i].innerHTML;

		if(_sys == "No/Close")
		{
			clsDateArray[i].style.color = "blue";
		}
	}
}


function closedateListClick(itemId)
{
  var plIndex = itemId.replace("close_date_table_body","");
  var projectList = currentCloseDateList;

  selectedCloseDate = currentCloseDateList[plIndex];
  if($("#" + itemId).hasClass("checked"))
  {
    $("#" + itemId).removeClass("checked");
    selectedCloseDate = [];
    $("#edit_budget_btn").prop("disabled", true);
    //$("#remove_project_btn").prop("disabled", true);
    
  }
  else
  {
    if(currentCloseDateIndex)
      $("#close_date_table_body" + currentCloseDateIndex).removeClass("checked");
    currentCloseDateIndex = plIndex;
    $("#" + itemId).addClass("checked");
    //$("#edit_budget_btn").prop("disabled", false);
  }
}

//编辑，含多个输入框
function createCloseDateEditModal(parentNode)
{
  //create modal for add project
  var closeDateEditModal = createElementTo("div", parentNode, "modal fade");
  closeDateEditModal.id = "close_date_edit_modal";
  closeDateEditModal.setAttribute("tabindex","-1");
  closeDateEditModal.setAttribute("role","dialog");
  closeDateEditModal.setAttribute("aria-hidden", "true");
  closeDateEditModal.setAttribute("data-backdrop", "static");
  initializeModal(closeDateEditModal, "Edit Items");

  initialAlert(document.getElementById("close_date_edit_modal_body"));

  var closeDateEditModalBody = document.getElementById("close_date_edit_modal_body");

  //输入框的简便办法
  //newInputArea(closeDateEditModalBody, "edit_estimated_heads", "Estimated Head:", "edprojdef", "text","");
  //$("#edit_estimated_heads_input").prop('disabled', false);
  newInputArea(closeDateEditModalBody, "cls_edit_issue_tracking_comments", "Issue Tracking Comments:", "edprojname", "text","");
  $("#cls_edit_issue_tracking_comments_input").prop('disabled', false);

  $("#close_date_edit_modal").on("show.bs.modal", function(){closeDateEditModalShow();});
  
  var closeDateEditModalFooter = document.getElementById("close_date_edit_modal_footer");
  var clsdEditCancelBtn = createBtn("Cancel", closeDateEditModalFooter, "btn btn-default");
  clsdEditCancelBtn.setAttribute("data-dismiss", "modal");
  var clsdEditSaveBtn = createBtn("Save", closeDateEditModalFooter, "btn btn-primary", "close_date_edit_modal_save_btn", function(){clsdEditSaveBtnClick()});
  clsdEditSaveBtn.id = "close_date_edit_modal_save_btn";
}

function closeDateEditModalShow()
{
  $("#close_date_edit_modal_body_alert").fadeOut();
  //$("#edit_estimated_heads_input").val("");
  $("#cls_edit_issue_tracking_comments_input").val("");
  if(selectedCloseDate)
  {
    //$("#edit_estimated_heads_input").val(selectedCloseDate["Estimated Heads"]);
    $("#cls_edit_issue_tracking_comments_input").val(selectedCloseDate["Issues tracking comments"]);

    //$("#edit_estimated_heads_input").attr("oldValue", selectedCloseDate["Estimated Heads"]);
    $("#cls_edit_issue_tracking_comments_input").attr("oldValue", selectedCloseDate["Issues tracking comments"]);
  }
}

function clsdEditSaveBtnClick()
{
  $("#close_date_edit_modal_body_alert").fadeOut();
  //var isNotEdited = ($("#edit_estimated_heads_input").attr("oldValue") == $("#edit_estimated_heads_input").val()) && ($("#cls_edit_issue_tracking_comments_input").attr("oldValue") == $("#cls_edit_issue_tracking_comments_input").val());
  var isNotEdited = ($("#cls_edit_issue_tracking_comments_input").attr("oldValue") == $("#cls_edit_issue_tracking_comments_input").val());
  if(isNotEdited)
  {
    $("#close_date_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Budget Edit info does not change!');
    $("#close_date_edit_modal_body_alert").fadeIn();
  }
  else
  {
    var postData = copyObj(selectedCloseDate);
    //postData["Estimated Heads"] = $("#edit_estimated_heads_input").val();
    postData["Issues tracking comments"] = $("#cls_edit_issue_tracking_comments_input").val();

    $("#close_date_edit_modal_save_btn").html('Save ' + animateRefreshIcon);
    utils.post(CLOSE_DATE_EDIT, postData, function(){clsdEditSaveBtnClickSuccess();}, function(){clsdEditSaveBtnClickError();});
  }

}

function clsdEditSaveBtnClickSuccess()
{
  $("#close_date_edit_modal_save_btn").html('Save');
  $("#close_date_edit_modal").modal("hide");
  //refreshProjectList();
  refreshCloseDateBtnClick();
}

function clsdEditSaveBtnClickError()
{
  $("#close_date_edit_modal_save_btn").html('Save');
  $("#close_date_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Edit project failed!');
  $("#close_date_edit_modal_body_alert").fadeIn();
}

function timeSheetBillingFunct()
{ 
  var TimeSheetBillingMain = addMainContainer("TimeSheet_Billing", "div");

  addHeaderForMain(TimeSheetBillingMain,"TimeSheet Billing");

  initialAlert(TimeSheetBillingMain);

 var tableTimeSheetBillingDiv = createElementTo("div", TimeSheetBillingMain, "table-responsive");
  tableTimeSheetBillingDiv.id = "current_timesheet_billing_div";

  var textTimeSheetBillingBox = createElementTo("div", tableTimeSheetBillingDiv);

  var generalTimeSheetBillingText = createElementTo("p", textTimeSheetBillingBox);
  generalTimeSheetBillingText.innerHTML = "Current TimeSheet Billing list: ";
  generalTimeSheetBillingText.id = "current_timesheet_billing";
  $("#current_timesheet_billing").css("float", "left");
  $("#current_timesheet_billing").css("padding-top", "8px");
  
  // var refreshTimeSheetBillingBtn = createBtn("Refresh", textTimeSheetBillingBox, "btn btn-success", "cls_current_refresh_btn", function(){refreshTimeSheetBillingBtnClick()});
  // refreshTimeSheetBillingBtn.setAttribute("style","margin-left: 10px");
  
  var editTimeSheetBillingCommentBtn = createBtn('<span class="glyphicon glyphicon-edit"></span> Edit', textTimeSheetBillingBox, "btn btn-warning", "edit_timesheet_billing_comment_btn", function(){});
  editTimeSheetBillingCommentBtn.setAttribute("style", "margin-left:10px;");
  editTimeSheetBillingCommentBtn.setAttribute("data-toggle","modal");
  editTimeSheetBillingCommentBtn.setAttribute("data-target","#timesheet_billing_edit_modal");
  $("#edit_budget_btn").prop("disabled", true);
  
  var timeSheetBillingDiv = createElementTo("div", TimeSheetBillingMain, "table-responsive table-overwide");
  timeSheetBillingDiv.id = "timesheet_billing_div";
  
  var tableHeight=$(window).height()-$("#navbar").height()- ($("#main").innerHeight()-$("#main").height())- $(".page-header").outerHeight(true);
  $("#timesheet_billing_div").css("height",tableHeight+"px");
  $("#timesheet_billing_div").css("overflow-y", "auto");
  
  var timeSheetBillingList = createElementTo("table", timeSheetBillingDiv, "table table-bordered");
  timeSheetBillingList.id = "timesheet_billing_table";
  $("#timesheet_billing_table").css("float", "left");
  $("#timesheet_billing_table").css("width", "80%");
  $("#timesheet_billing_table").css("margin-top", "10px");
  
  var timeSheetBillingListHead = createTableHead(timeSheetBillingHead, "timesheet_billing_table");
  formTable(timeSheetBillingListHead, null, "timesheet_billing_table");
  
  createTimeSheetBillingEditModal(TimeSheetBillingMain)
  
    /////test
  //var timeSheetBillingListBody = createTableBody(testTimeSheetBilling, "timesheet_billing_table", timeSheetBillingHead)
  //formTable(timeSheetBillingListHead, timeSheetBillingListBody, "timesheet_billing_table");
  //$("#timesheet_billing_table tbody tr").click(function(){tsbListClick(this.id);});
  //createPlModal(TimeSheetBillingMain);
  //createResetModal(TimeSheetBillingMain);
  //createRemoveModal(TimeSheetBillingMain);
  //generateTimeSheetBillingCurrentListBody(testTimeSheetBilling);
  
  refreshTimeSheetBillingBtnClick()
  $("#TimeSheet_Billing").click(function(){refreshTimeSheetBillingBtnClick();});
}

testTimeSheetBilling = 
[
{
	"Level 2 WBS": "AE-00000820-021-0015",
	"Current Used Hours": "12",
	"Current Billed Hours": "14",
	"Bad Hours":"2",
	"Billing Match": "No",
	"Issues Tracking Comments": "Not Enough until this year"
},
{
	"Level 2 WBS": "AE-00000820-021-0016",
    "Current Used Hours": "12",
	"Current Billed Hours": "12",
	"Bad Hours":"2",
	"Billing Match": "Yes",
	"Issues Tracking Comments": "Enough until this year"
},
{
	"Level 2 WBS": "AE-00000820-021-0017",
    "Current Used Hours": "12",
	"Current Billed Hours": "11",
	"Bad Hours":"2",
	"Billing Match": "No",
	"Issues Tracking Comments": "Enough until this year"
}
]

timeSheetBillingHead =
[
"Level 2 WBS", 
"Current Used Hours", 
"Current Billed Hours",
"Bad Hours",
"Billing Match",
"Issues Tracking Comments"
]

var timeSheetBillingBodyHO = ["Level 2 WBS","Current Used Hours", "Current Billed Hours","Bad Hours","Billing Match","Issues Tracking Comments"];

function refreshTimeSheetBillingBtnClick()
{
	$("#Budget_Usage_main_alert").fadeOut();
  //send refresh order to server here!!!
  $("#current_timesheet_billing").html('Current timesheet billing: ' + animateRefreshIcon + ' Loading...');

  utils.get(TIMESHEET_BILLING_REFRESH,"eid="+loginUser.eid, function(resp){refreshTimeSheetBillingBtnClickSuccess(resp)}, function(){refreshTimeSheetBillingBtnClickError()});
}

function refreshTimeSheetBillingBtnClickSuccess(response)
{
  $("#generate_button").html('Generate');
  response = response.replace(/\'/g, "\"");
  var recievedTimeSheetBillingList = $.parseJSON(response);
  currentTimeSheetBillingList = recievedTimeSheetBillingList;
  //currentTimeSHeetBillingList = testTimeSheetBilling;
  totalTimesheetbillingListNb = currentTimeSheetBillingList.length;

  generateTimeSheetBillingCurrentListBody(currentTimeSheetBillingList);
  $("#current_timesheet_billing").html("Current timesheet billing list: "+ totalTimesheetbillingListNb);
  $("#timesheet_billing_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");
}

function refreshTimeSheetBillingBtnClickError()
{
  $("#generate_button").html('Generate');
  $("#timesheet_billing_main_alert").fadeOut();
  $("#timesheet_billing_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Refresh timesheet billing failed!');
  $("#timesheet_billing_main_alert").fadeIn();
  $("#current_timesheet_billing").html('Current timesheet billing list: N/A');
}

function generateTimeSheetBillingCurrentListBody(bodylist)
{
  if($("#timesheet_billing_table").length > 0)
    $("#timesheet_billing_table").remove();

  var timeSheetBillingList = createElementTo("table", document.getElementById("timesheet_billing_div"), "table table-bordered");
  timeSheetBillingList.id = "timesheet_billing_table";
  $("#timesheet_billing_table").css("float", "left");
  $("#timesheet_billing_table").css("width", "80%");
  $("#timesheet_billing_table").css("margin-top", "10px");
  
  var currentTimeSheetBillingListBody = createTableBody(bodylist, "timesheet_billing_table", timeSheetBillingBodyHO);
  
  var _head = createTableHead(timeSheetBillingHead, "timesheet_billing_table");

  formTable(_head, currentTimeSheetBillingListBody,"timesheet_billing_table");

  $("#timesheet_billing_table tbody tr").click(function(){timesheetbillingListClick(this.id);});
  //tableSorterGroup("budget_usage_table");
  
  addPager("timesheet_billing_table",6);
	
	$.tablesorter.themes.bootstrap = {
	    // these classes are added to the table. To see other table classes available,
	    // look here: http://getbootstrap.com/css/#tables
	    table        : 'table table-bordered', //table-striped
	    caption      : 'caption',
	    // header class names
	    header       : 'bootstrap-header', // give the header a gradient background (theme.bootstrap_2.css)
	    sortNone     : '',
	    sortAsc      : '',
	    sortDesc     : '',
	    active       : '', // applied when column is sorted
	    hover        : '', // custom css required - a defined bootstrap style may not override other classes
	    // icon class names
	    icons        : '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
	    iconSortNone : 'bootstrap-icon-unsorted', // class name added to icon when column is not sorted
	    iconSortAsc  : 'glyphicon glyphicon-chevron-up', // class name added to icon when column has ascending sort
	    iconSortDesc : 'glyphicon glyphicon-chevron-down', // class name added to icon when column has descending sort
	    filterRow    : '', // filter row class; use widgetOptions.filter_cssFilter for the input/select element
	    footerRow    : '',
	    footerCells  : '',
	    even         : '', // even row zebra striping
	    odd          : ''  // odd row zebra striping
	  };

	$("#timesheet_billing_table").tablesorter({
	  // this will apply the bootstrap theme if "uitheme" widget is included
	  // the widgetOptions.uitheme is no longer required to be set
	  theme : "bootstrap",

	  widthFixed: true,

	  headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

	  // widget code contained in the jquery.tablesorter.widgets.js file
	  // use the zebra stripe widget if you plan on hiding any rows (filter widget)
	  widgets : [ "uitheme", "filter"],//, "zebra" ],

	  widgetOptions : {
	    // using the default zebra striping class name, so it actually isn't included in the theme variable above
	    // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
	    zebra : ["even", "odd"],

	    // reset filters button
	    filter_reset : ".reset",

	    // extra css class name (string or array) added to the filter element (input or select)
	    filter_cssFilter: "form-control",

	    // set the uitheme widget to use the bootstrap theme class names
	    // this is no longer required, if theme is set
	    // ,uitheme : "bootstrap"

	  }
	})

    .tablesorterPager({

	  // target the pager markup - see the HTML block below
	  container: $(".ts-pager"),

	  // target the pager page select dropdown - choose a page
	  cssGoto  : ".pagenum",

	  // remove rows from the table to speed up the sort of large tables.
	  // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
	  removeRows: false,

	  // output string - default is '{page}/{totalPages}';
	  // possible variables: {page}, {totalPages}, {filteredPages}, {startRow}, {endRow}, {filteredRows} and {totalRows}
	  output: '{startRow} - {endRow} ({totalRows})'

	});
	
	reformTimeSheetBillingTableStyle("timesheet_billing_table");
}

function reformTimeSheetBillingTableStyle(tableId)
{
	var timshBillingArray = $("#" + tableId + "_body tr td:nth-child(5)");
    var _trs = $("#" + tableId + "_body [role='row']");
	for(var i = 0; i < timshBillingArray.length; i++)
	{
		var _sys = timshBillingArray[i].innerHTML;

		if(_sys == "No")
		{
			timshBillingArray[i].style.color = "red";
		}
	}
		for(var i = 0; i < timshBillingArray.length; i++)
	{
		var _sys = timshBillingArray[i].innerHTML;

		if(_sys == "No/Close")
		{
			timshBillingArray[i].style.color = "blue";
		}
	}
}

function timesheetbillingListClick(itemId)
{
  var plIndex = itemId.replace("timesheet_billing_table_body","");
  var projectList = currentTimeSheetBillingList;

  selectedTimeSheetBilling = currentTimeSheetBillingList[plIndex];
  if($("#" + itemId).hasClass("checked"))
  {
    $("#" + itemId).removeClass("checked");
    selectedTimeSheetBilling = [];
    $("#edit_budget_btn").prop("disabled", true);
    //$("#remove_project_btn").prop("disabled", true);
    
  }
  else
  {
    if(currentTimeSheetBillingIndex)
      $("#close_date_table_body" + currentTimeSheetBillingIndex).removeClass("checked");
    currentTimeSheetBillingIndex = plIndex;
    $("#" + itemId).addClass("checked");
    $("#edit_budget_btn").prop("disabled", false);
  }
}

function createTimeSheetBillingEditModal(parentNode)
{
	//create modal for add project
  var timeSheetBillingEditModal = createElementTo("div", parentNode, "modal fade");
  timeSheetBillingEditModal.id = "timesheet_billing_edit_modal";
  timeSheetBillingEditModal.setAttribute("tabindex","-1");
  timeSheetBillingEditModal.setAttribute("role","dialog");
  timeSheetBillingEditModal.setAttribute("aria-hidden", "true");
  timeSheetBillingEditModal.setAttribute("data-backdrop", "static");
  initializeModal(timeSheetBillingEditModal, "Edit Items");

  initialAlert(document.getElementById("timesheet_billing_edit_modal_body"));

  var timeSheetBillingEditModalBody = document.getElementById("timesheet_billing_edit_modal_body");

  //输入框的简便办法
  newInputArea(timeSheetBillingEditModalBody, "tsb_edit_bad_hours", "Bad Hours:", "edprojdef", "text","");
  $("#tsb_edit_bad_hours_input").prop('disabled', false);
  newInputArea(timeSheetBillingEditModalBody, "tsb_edit_issue_tracking_comments", "Issue Tracking Comments:", "edprojname", "text","");
  $("#tsb_edit_issue_tracking_comments_input").prop('disabled', false);
    
  $("#timesheet_billing_edit_modal").on("show.bs.modal", function(){timeSheetBillingEditModalShow();});
  
  var timeSheetBillingEditModalFooter = document.getElementById("timesheet_billing_edit_modal_footer");
  var tsbEditCancelBtn = createBtn("Cancel", timeSheetBillingEditModalFooter, "btn btn-default");
  tsbEditCancelBtn.setAttribute("data-dismiss", "modal");
  var tsbEditSaveBtn = createBtn("Save", timeSheetBillingEditModalFooter, "btn btn-primary", "timesheet_billing_edit_modal_save_btn", function(){tsbEditSaveBtnClick()});
  tsbEditSaveBtn.id = "timesheet_billing_edit_modal_save_btn";
}

function timeSheetBillingEditModalShow()
{
  $("#timesheet_billing_edit_modal_body_alert").fadeOut();
  $("#tsb_edit_bad_hours_input").val("");
  $("#tsb_edit_issue_tracking_comments_input").val("");
  if(selectedTimeSheetBilling)
  {
	$("#tsb_edit_bad_hours_input").val(selectedTimeSheetBilling["Bad Hours"]);
    $("#tsb_edit_issue_tracking_comments_input").val(selectedTimeSheetBilling["Issues Tracking Comments"]);
	
	$("#tsb_edit_bad_hours_input").attr("oldValue", selectedTimeSheetBilling["Bad Hours"]);
    $("#tsb_edit_issue_tracking_comments_input").attr("oldValue", selectedTimeSheetBilling["Issues Tracking Comments"]);
  }
}

function tsbEditSaveBtnClick()
{
  $("#timesheet_billing_edit_modal_body_alert").fadeOut();
  var isNotEdited =  ($("#tsb_edit_bad_hours_input").attr("oldValue") == $("#tsb_edit_bad_hours_input").val()) && ($("#tsb_edit_issue_tracking_comments_input").attr("oldValue") == $("#tsb_edit_issue_tracking_comments_input").val());
  if(isNotEdited)
  {
    $("#timesheet_billing_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Budget Edit info does not change!');
    $("#timesheet_billing_edit_modal_body_alert").fadeIn();
  }
  else
  {
    var postData = copyObj(selectedTimeSheetBilling);
	postData["Bad Hours"] = $("#tsb_edit_bad_hours_input").val();
    postData["Issues Tracking Comments"] = $("#tsb_edit_issue_tracking_comments_input").val();

    $("#timesheet_billing_edit_modal_save_btn").html('Save ' + animateRefreshIcon);
    utils.post(TIMESHEET_BILLING_EDIT, postData, function(){tsbEditSaveBtnClickSuccess();}, function(){tsbEditSaveBtnClickError();});
  }
}

function tsbEditSaveBtnClickSuccess()
{
  $("#timesheet_billing_edit_modal_save_btn").html('Save');
  $("#timesheet_billing_edit_modal").modal("hide");
  //refreshProjectList();
  refreshTimeSheetBillingBtnClick();
}

function tsbEditSaveBtnClickError()
{
  $("#timesheet_billing_edit_modal_save_btn").html('Save');
  $("#timesheet_billing_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Edit project failed!');
  $("#timesheet_billing_edit_modal_body_alert").fadeIn();
}


function timesheetfillingFunct()
{
  var timesheetfillingMain = addMainContainer("timesheet_filling", "div");
  addHeaderForMain(timesheetfillingMain,"Timesheet Filling");
  initialAlert(timesheetfillingMain);

  var searchingConditionDiv = createElementTo("div", timesheetfillingMain);
  searchingConditionDiv.id = "search_condition_div";
  var _searchheader = createElementTo("h3", searchingConditionDiv, "page-header");
  _searchheader.innerHTML="This function checks the Phase, Sub Phase and Admin Hours compliance";
  
  var showtableDiv = createElementTo("div", timesheetfillingMain, "table-responsive table-overwide");
  showtableDiv.id = "timesheet_filling_result_table_div";
  var _showheader = createElementTo("h3", showtableDiv, "page-header");
  _showheader.innerHTML="Searching Result";
  _showheader.id = "timesheet_filling_result_table_div_head";
  $("#timesheet_filling_result_table_div").hide();

  var searchSubmitBtn = createBtn('Search employees', searchingConditionDiv, "btn btn-success", "search_employees_btn", function(){searchEmployeesBtnClick()});

  var searchTableDiv = createElementTo("div", searchingConditionDiv);
  searchTableDiv.id = "search_condition_list_table_div";

  var searchItemList = createElementTo("table", searchTableDiv, "table table-hover");
  searchItemList.id = "search_condition_list_table";
  $("#search_condition_list_table").css("float", "left");
  $("#search_condition_list_table").css("box-sizing", "none");
  $("#search_condition_list_table").css("width", "50%");
  $("#search_condition_list_table").css("margin-top", "10px");

  searchConditionValueTableList[0]["Value"] = loginUser.name + clickToEdit;
  searchConditionValueTableList[1]["Value"] = "from " + currentSun + " to " + currentSat + clickToEditDate;
  var searchItemListHead = createTableHead(searchConditionListHO, "search_condition_list_table");
  var searchItemListBody = createTableBody(searchConditionValueTableList, "search_condition_list_table", searchConditionListHO);
  formTable(searchItemListHead, searchItemListBody, "search_condition_list_table");

  refreshSearchConditionTableStyle();

  var eidModal = new selectListModal("supervisor_select");
  var dateModal = new selectListModal("time_interval_select");

  var backToSearchBtn =  createBtn('<span class="glyphicon glyphicon-arrow-left"></span> Back to select supervisor', showtableDiv, "btn btn-default", "back_to_search_btn", function(){backToSearchSupervisorBtnClick();});
  backToSearchBtn.setAttribute("style", "margin-bottom: 10px;");

  var adminHoursResultBtn = createBtn("Show Admin Hours", showtableDiv, "btn btn-warning", "admin_hours_result_btn", function(){adminHoursResultBtnClick()});
  adminHoursResultBtn.setAttribute("style", "margin-left:15px; margin-bottom: 10px;");

  var phaseResultBtn = createBtn("Show Phase and Sub Phase", showtableDiv, "btn btn-success", "phase_result_btn", function(){searchEmployeesBtnClick()});
  phaseResultBtn.setAttribute("style", "margin-left:15px; margin-bottom: 10px;");
  $("#phase_result_btn").hide();

  $("#timesheet_filling").click(function(){
    if($("#search_condition_div").css("display") == "none")
        backToSearchSupervisorBtnClick();
    });
}

function adminHoursResultBtnClick()
{
  $("#timesheet_filling_main_alert").fadeOut();
  var supervisorEID = "";
  if(selectedRow)
    supervisorEID = allSupervisors[selectedRow]["Emp ID"];
  else
    supervisorEID = loginUser.eid;
  var postData = {
    "EID": supervisorEID,
    "Start Date" : dateSearchingItems["start"],
    "End Date" : dateSearchingItems["end"]
  };
  utils.post(GET_EMPLOYEES_ADMINHOURS_RESULT, postData, function(resp){adminHoursResultBtnClickSuccess(resp);}, function(){adminHoursResultBtnClickError()})

}

function adminHoursResultBtnClickSuccess(response)
{
  if(response == "TOO_MANY_ROWS")
  {
    $("#timesheet_filling_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Result size out of display capacity! Please add more condition to reduce the searching result numbers.');
    $("#timesheet_filling_main_alert").fadeIn();
  }
  else if(!response)
  {
    $("#timesheet_filling_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Search time sheet time out, please try it again!');
    $("#timesheet_filling_main_alert").fadeIn();
  }
  else
  {
    response = response.replace(/\"/g, "<quote>");
    response = response.replace(/\'/g, "\"");
    response = response.replace(/<quote>/g, "\'");
    response = response.replace(/\\/g, "\\\\");
    try
    {
      adminHoursResultList = $.parseJSON(response);
      buildAdminHoursResultTable();
    }
    catch(e)
    {
      $("#timesheet_filling_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Response format incorrect.');
      $("#timesheet_filling_main_alert").fadeIn();
    }
    $("#admin_hours_result_btn").hide();
    $("#phase_result_btn").show();
    $("#timesheet_filling_main_header").html("Admin Hours");
  }
}

function adminHoursResultBtnClickError()
{
  $("#timesheet_filling_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Submit search condition failed!');
  $("#timesheet_filling_main_alert").fadeIn();
}

function searchEmployeesBtnClick()
{
  $("#timesheet_filling_main_alert").fadeOut();
  $("#search_employees_btn").html('Search employees ' + animateRefreshIcon);
  var supervisorEID = "";
  if(selectedRow)
    supervisorEID = allSupervisors[selectedRow]["Emp ID"];
  else
    supervisorEID = loginUser.eid;

  if(dateSearchingItems["start"] && dateSearchingItems["end"])
    var postData = {
      "EID": supervisorEID,
      "Start Date" : dateSearchingItems["start"],
      "End Date" : dateSearchingItems["end"]
    };
  else 
      var postData = {
      "EID": supervisorEID,
      "Start Date" : currentSun,
      "End Date" : currentSat
    };

  utils.post(GET_EMPLOYEES_PHASE_RESULT, postData, function(resp){searchEmployeesBtnClickSuccess(resp);}, function(){searchEmployeesBtnClickError()})

}

function searchEmployeesBtnClickSuccess(response)
{
  if(response == "TOO_MANY_ROWS")
  {
    $("#timesheet_filling_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Result size out of display capacity! Please add more condition to reduce the searching result numbers.');
    $("#timesheet_filling_main_alert").fadeIn();
  }
  else if(!response)
  {
    $("#timesheet_filling_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Search time sheet time out, please try it again!');
    $("#timesheet_filling_main_alert").fadeIn();
  }
    else
    {
      response = response.replace(/\"/g, "<quote>");
      response = response.replace(/\'/g, "\"");
      response = response.replace(/<quote>/g, "\'");
      response = response.replace(/\\/g, "\\\\");
      try
      {
        phaseResultList = $.parseJSON(response);
        buildPhaseResultTable();
      }
      catch(e)
      {
        $("#search_employees_btn").html('Search employees');
        $("#timesheet_filling_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Response format incorrect.');
        $("#timesheet_filling_main_alert").fadeIn();
      }    
      $("#search_condition_div").fadeOut().promise().done(function() {
        $("#timesheet_filling_result_table_div").fadeIn();
      });
      $("#phase_result_btn").hide();
      $("#admin_hours_result_btn").show();
      $("#timesheet_filling_main_header").html("Phase and Sub Phase");
    }
    $("#search_employees_btn").html('Search employees');
}

function searchEmployeesBtnClickError()
{
  $("#search_employees_btn").html('Search employees');
  $("#timesheet_filling_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Submit search condition failed!');
  $("#timesheet_filling_main_alert").fadeIn();
}

function buildPhaseResultTable()
{
  if($("#timesheet_filling_result_table").length>0)
    $("#timesheet_filling_result_table").remove();

  var tableDiv = createElementTo("div", document.getElementById("timesheet_filling_result_table_div"));

  var tsResultTable = createElementTo("table", tableDiv, "table table-bordered  table-overwide");
  tsResultTable.id = "timesheet_filling_result_table";

  var resultHead = createTableHead(phaseResultTitleList, "timesheet_filling_result_table");
  var resultBody = createTableBody(phaseResultList, "timesheet_filling_result_table", phaseResultBodyHO);

  formTable(resultHead, resultBody, "timesheet_filling_result_table");
  addPager("timesheet_filling_result_table", 9);
  tableSorterForEid("timesheet_filling_result_table");

  $("#timesheet_filling_result_table_div_head").html("Searching Result")
}

function buildAdminHoursResultTable()
{
  if($("#timesheet_filling_result_table").length>0)
    $("#timesheet_filling_result_table").remove();

  var tableDiv = createElementTo("div", document.getElementById("timesheet_filling_result_table_div"));
  var tsResultTable = createElementTo("table", tableDiv, "table table-bordered  table-overwide");
  tsResultTable.id = "timesheet_filling_result_table";

  var resultHead = createTableHead(adminHoursResultTitleList, "timesheet_filling_result_table");
  var resultBody = createTableBody(adminHoursResultList, "timesheet_filling_result_table", adminHoursResultBodyHO);

  formTable(resultHead, resultBody, "timesheet_filling_result_table");
  addPager("timesheet_filling_result_table", 3);
  tableSorterForEid("timesheet_filling_result_table");

  var totalAdminHours = computeTotalHours($("#timesheet_filling_result_table_body td:nth-child(3)"));
  $("#timesheet_filling_result_table_div_head").html("Searching Result (Total Admin Hours: " + totalAdminHours + "h)")
}

function refreshSearchConditionTableStyle()
{

  var firstCols = $("#search_condition_list_table_body tr td:nth-child(1)");
  var secondCols = $("#search_condition_list_table_body tr td:nth-child(2)");
  var tds = $("#search_condition_list_table_body tr td");

  tds.css("border-top", "0px");
  firstCols.css("width","200px");
  firstCols.css("cursor","auto");
  firstCols.css("cursor","auto");
  firstCols.css("font-weight","bold");

  for(var i=0; i < supervisorIdOrder.length; i++)
  {
    var _modalId = "#" + supervisorIdOrder[i] + "_modal";
    secondCols[i].setAttribute("data-toggle","modal");
    secondCols[i].setAttribute("data-target", _modalId);
  }
}

var selectListModal = function (modalId, selectedListArray)
{
  this.titleText = modalTitleMap[modalId];
  this.listArray = selectedListArray;
  this.chooseAll = false;

  this.modal = createModalForTimesheetFilling(modalId, document.getElementById("search_condition_div"));
  var listModalId = this.modal.id;
  modalBodyMap[modalId](listModalId);
}

function createModalForTimesheetFilling(modalId, parentNode)
{
  var _modal = createElementTo("div", parentNode, "modal fade");
  _modal.id = modalId + "_modal";
  _modal.setAttribute("tabindex","-1");
  _modal.setAttribute("role","dialog");
  _modal.setAttribute("aria-hidden", "true");
  _modal.setAttribute("data-backdrop", "static");
  initializeModal(_modal, modalTitleMap[modalId]);

  var _modalBody = document.getElementById(_modal.id + "_body");
  initialAlert(_modalBody);
  var _modalFooter = document.getElementById(_modal.id + "_footer");

  if (modalId == "supervisor_select")
  {
    var getLatestBtn = createBtn("Refresh supervisor list", _modalFooter, "btn btn-success pull-left", _modal.id + "_refresh_button", function(){getLatestMap[modalId]()});
  }
  else
    var getLatestBtn = createBtn("Reset Dates", _modalFooter, "btn btn-success pull-left", _modal.id + "_reset_button", function(){getLatestMap[modalId]()});

  var _cancelBtn = createBtn("Cancel", _modalFooter, "btn btn-default");
  _cancelBtn.setAttribute("data-dismiss", "modal");
  var _saveBtn = createBtn("Save", _modalFooter, "btn btn-primary", _modal.id + "_save_button", function(){saveSearchConditionTableValue(this.id);});

  $("#" + _modal.id).on("show.bs.modal", function(){modalShowMap[modalId]();})
  return _modal;
}

function saveSearchConditionTableValue(listModalId)
{
  var _modalId = listModalId.replace("_modal_save_button", "");
  saveSelectValueMap[_modalId]();

  if($("#search_condition_list_table").length > 0)
    $("#search_condition_list_table").remove();

  var searchItemList = createElementTo("table", document.getElementById("search_condition_list_table_div"), "table table-hover");
  searchItemList.id = "search_condition_list_table";
  $("#search_condition_list_table").css("float", "left");
  $("#search_condition_list_table").css("box-sizing", "none");
  $("#search_condition_list_table").css("width", "50%");
  $("#search_condition_list_table").css("margin-top", "10px");

  var searchItemListHead = createTableHead(searchConditionListHO, "search_condition_list_table");
  var searchItemListBody = createTableBody(searchConditionValueTableList, "search_condition_list_table", searchConditionListHO);

  formTable(searchItemListHead, searchItemListBody, "search_condition_list_table");
  refreshSearchConditionTableStyle();
  $("search_employees_btn").after(searchItemList);
}

function supervisorGetLatest()
{
  $("#supervisor_select_modal_body_alert").fadeOut();
  $("#supervisor_select_modal_refresh_button").html('Refresh supervisor list ' + animateRefreshIcon);
  var postData = {"EID": loginUser.eid};
  utils.post(GET_SUPERVISORS, postData, function(resp){supervisorGetLatestSuccess(resp);},function(){supervisorGetLatestError();});
}

function supervisorGetLatestSuccess(response)
{
  $("#supervisor_select_modal_refresh_button").html('Refresh supervisor list');
  response = response.replace(/\'/g, "\"");
  recievedSupervisor = $.parseJSON(response);
  allSupervisors = $.parseJSON(response);
  refreshSupervisorTable();
}

function supervisorGetLatestError()
{
  $("#supervisor_select_modal_refresh_button").html('Refresh supervisor list');
  $("#supervisor_select_modal_body_alert p").html(' <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Get supervisor list failed');
  $("#supervisor_select_modal_body_alert").fadeIn();
}

function refreshSupervisorTable()
{
  if($("#supervisor_table").length>0)
  {
     $("#supervisor_table").remove();
  }

  var supervisorTable = createElementTo("table", document.getElementById("supervisor_select_modal_body_div"), "table table-bordered table-hover tablesorter");
  supervisorTable.id = "supervisor_table";

  var supervisorListWithCheck = addCheckForSupervisor(recievedSupervisor);
  var supervisorTableHead = createTableHead([ "<span class= 'glyphicon glyphicon-check'></span>", "EID", "Supervisor"], "supervisor_table");
  var supervisorTableBody = createTableBody(supervisorListWithCheck, "supervisor_table", supervisorTableHO);

  formTable(supervisorTableHead, supervisorTableBody, "supervisor_table");
  addPager("supervisor_table",3);
  tableSorterForEid("supervisor_table");
  refreshSupervisorTableStyle("supervisor_table");
}

function addCheckForSupervisor(array)
{
  var resultList = copyObj(array);
  for(var i = 0; i< array.length; i++)
  {
    if(resultList[i]["Emp ID"] == loginUser.eid)
      resultList[i]["isCheck"]="<span class=\"glyphicon glyphicon-ok for-eid\"></span><span class=\"glyphicon glyphicon-minus for-eid\">yes</span>";
    else
      resultList[i]["isCheck"]="<span class=\"glyphicon glyphicon-ok for-eid\">no</span><span class=\"glyphicon glyphicon-minus for-eid\"></span>";
  }
  return resultList;
}

function refreshSupervisorTableStyle(tableId)
{
  $("#supervisor_table_body tr td:nth-child(1)").css("width","75px!important");
  $("#supervisor_table_head tr th:nth-child(1)").css("width","75px!important");

  var trList = $("#supervisor_table_body tr");
  var checkedStatusList = $("#supervisor_table_body tr td:nth-child(1)")
  for (var i = 0; i < checkedStatusList.length; i++)
  {
    var statusText = checkedStatusList[i].innerHTML.replace("<span class=\"glyphicon glyphicon-ok for-eid\">","");
    statusText = statusText.replace("</span><span class=\"glyphicon glyphicon-minus for-eid\">","");
    statusText = statusText.replace("</span>","");
    if(statusText == "yes")
      {
        trList[i].className = "checked";
        selectedRow = i;
      }
  }
  $("#supervisor_table_body tr").click(function(){supervisorRowClick(this.id);});
}

function supervisorRowClick(rowid)
{
  var rowNum = rowid.replace("supervisor_table_body", "");
  if(selectedRow == rowNum)
    $("#.tablesorter").trigger("update");
  else 
    {
      $("#"+ "supervisor_table_body" + selectedRow).removeClass("checked");
      $("#"+ "supervisor_table_body" + selectedRow + " td .glyphicon-ok").html("no");
      $("#"+ "supervisor_table_body" + selectedRow + " td .glyphicon-minus").html("");
      selectedRow = rowNum;

      $("#"+ rowid).addClass("checked");
      $("#"+ rowid + " td .glyphicon-ok").html("");
      $("#"+ rowid + " td .glyphicon-minus").html("yes");

      $(".tablesorter").trigger("update");
    }
}

function supervisorSaveValue()
{
  $("#supervisor_select_modal_body_alert").fadeOut();
  searchConditionValueTableList[0]["Value"] = allSupervisors[selectedRow]["Employee Name"] + clickToEdit;
  $("#supervisor_select_modal").modal('hide');
}

function dateIntervalSaveValue()
{
  $("#time_interval_select_modal_body_alert").fadeOut();
  var startDateStr = $("#start_date_input_timesheet_filling").val();
  var endDateStr = $("#end_date_input_timensheet_filling").val();
  if(!startDateStr && !endDateStr)
  {
    dateSearchingItems["start"] = "";
    dateSearchingItems["end"] = "";
    searchConditionValueTableList[1]["Value"] = clickToEditDate;
    $("#time_interval_select_modal").modal('hide');
  }
  else
  {
    var startDate = new Date(startDateStr.replace(".", "-"))
    var endDate = new Date(endDateStr.replace(".", "-"))
    if (startDate > endDate)
    {
      $("#time_interval_select_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> End date is earlier than Start date! Please check your choice.');
      $("#time_interval_select_modal_body_alert").fadeIn();
    }
    else if(!startDateStr)
    {
      dateSearchingItems["start"] = "";
      dateSearchingItems["end"] = endDateStr;
      searchConditionValueTableList[1]["Value"] = "before " + endDateStr + clickToEditDate;
      $("#time_interval_select_modal").modal('hide');
    }
    else if(!endDateStr)
    {
      dateSearchingItems["start"] = startDateStr;
      dateSearchingItems["end"] = "";
      searchConditionValueTableList[1]["Value"] = "after " + startDateStr + clickToEditDate;
      $("#time_interval_select_modal").modal('hide');
    }
    else
    {
      dateSearchingItems["start"] = startDateStr;
      dateSearchingItems["end"] = endDateStr;
      searchConditionValueTableList[1]["Value"] = "from " + startDateStr + " to " + endDateStr + clickToEditDate;
      $("#time_interval_select_modal").modal('hide');
    }
  }
}

function resetDate()
{
  $("#start_date_input_timesheet_filling").val("");
  $("#end_date_input_timensheet_filling").val("");
}

function backToSearchSupervisorBtnClick()
{
    $("#timesheet_filling_main_header").html("TimeSheet Filling");
    $("#timesheet_filling_result_table_div").fadeOut().promise().done(function() {
      $("#search_condition_div").fadeIn();
    });
}

function supervisorShow()
{
  if(recievedSupervisor.length <= 0)
    supervisorGetLatest();
}

function supervisorBodyBuilding(listModalId)
{
  var eidBody = document.getElementById(listModalId + "_body");
  var eidTableDiv = createElementTo("div", eidBody);
  eidTableDiv.id = listModalId + "_body_div";

  if(recievedSupervisor.length <=0)
    supervisorGetLatest();
}

function dateIntervalBodyBuilding(listModalId)
{
  var dateBody = document.getElementById(listModalId + "_body");

  var _row = createElementTo("div", dateBody, "row");
  var _col = createElementTo("div", _row, "col-sm-12");

  var startGroup = createElementTo("div", dateBody, "form-group");
  var startLabel = createElementTo("label", startGroup);
  startLabel.innerHTML = "Start Date:";
  startLabel.setAttribute("style", "margin-top: 10px;float:left");

  var startDatePickerDiv = createElementTo("div", startGroup, "input-group date");
  startDatePickerDiv.id = "start_date_picker_timesheet_filling";
  
  var startInput = createElementTo("input", startDatePickerDiv,"form-control");
  startInput.id = "start_date_input_timesheet_filling";

  startInput.setAttribute("type","text");
  startDatePickerDiv.setAttribute("style","margin-left:120px");

  var startSpan = createElementTo("span", startDatePickerDiv, "input-group-addon");
  startSpan.innerHTML = "<span class=\"glyphicon glyphicon-calendar\"></span>";

  var endGroup = createElementTo("div", dateBody, "form-group");
  var endLabel = createElementTo("label", endGroup);
  endLabel.innerHTML = "End Date:";
  endLabel.setAttribute("style", "margin-top: 10px;float:left");

  var endDatePickerDiv = createElementTo("div", endGroup, "input-group date")
  endDatePickerDiv.id = "end_date_picker_timesheet_filling";
  
  var endInput = createElementTo("input", endDatePickerDiv,"form-control");
  endInput.id = "end_date_input_timensheet_filling";

  endInput.setAttribute("type","text");
  endDatePickerDiv.setAttribute("style","margin-left:120px");

  var endSpan = createElementTo("span", endDatePickerDiv, "input-group-addon");
  endSpan.innerHTML = "<span class=\"glyphicon glyphicon-calendar\"></span>";

  $("#start_date_picker_timesheet_filling").datetimepicker({
    format: "YYYY.MM.DD"
  });

  $("#end_date_picker_timesheet_filling").datetimepicker({
    format: "YYYY.MM.DD"
  });

  if($("#start_date_input_timesheet_filling").val() == "")
  	$("#start_date_input_timesheet_filling").val(currentSun);
  if($("#end_date_input_timensheet_filling").val() == "")
  	$("#end_date_input_timensheet_filling").val(currentSat);
}

var searchConditionListHO = 
[
   "Search Item",
   "Value"
]

var supervisorTableHO=
[
"isCheck",
"Emp ID",
"Employee Name"
]

var searchConditionValueTableList =
[{
  "Search Item": "Supervisor",
  "Value": loginUser.name + clickToEdit
},{
  "Search Item": "Date Interval",
  "Value": clickToEditDate
}]

var phaseResultTitleList=
[
"Employee EID",
"Employee Name",
"Phase",
"Sub Phase",
"Date",
"Hours",
"Remarks",
"WBS",
"WBS Description"
]

var phaseResultBodyHO=
[
 "Emp ID",
 "Employee Name",
 "Phase",
 "Sub Phase",
 "Work Date",
 "Hours",
 "Remarks",
 "Level 1 WBS",
 "Level 1 WBS Description"
]

var adminHoursResultTitleList=
[
 "Employee EID",
 "Employee Name",
 "Admin Hours"
]

var adminHoursResultBodyHO=
[
 "Emp ID",
 "Employee Name",
 "Admin Hours"
 ]

var supervisorIdOrder = 
[
  "supervisor_select",
  "time_interval_select"
]

var modalTitleMap = 
{
  "supervisor_select": "Choose supervisor",
  "time_interval_select": "Choose searching start and end date"
}

var modalBodyMap =
{
  "supervisor_select" : function(listModalId){supervisorBodyBuilding(listModalId);},
  "time_interval_select" : function(listModalId){dateIntervalBodyBuilding(listModalId);}
}

var saveSelectValueMap =
{
  "supervisor_select" : function(){supervisorSaveValue();},
  "time_interval_select" : function(){dateIntervalSaveValue();}
}

var modalShowMap =
{
  "supervisor_select" : function(){supervisorShow();},
  "time_interval_select" : function(){}
}

var getLatestMap =
{
  "supervisor_select" : function(){supervisorGetLatest();},
  "time_interval_select" : function(){resetDate();}
}


//These arrays are for test

var testSupervisor = 
[
{
  "Emp ID": "TEST",
  "Employee Name": "TEST 001"
},
{
  "Emp ID": "440236",
  "Employee Name": "Dong Bin"
}, 
{
  "Emp ID": "347834",
  "Employee Name": "Du Lin"
}, 
{
  "Emp ID": "435761",
  "Employee Name": "Liang Danhua"
}
];

var testPhase = 
[
{
 "Emp ID" : "403235",
 "Employee Name" : "Liu Bin",
 "Phase" : "PROJECT_PLAN_&_MANAGEMENT",
 "Sub Phase" : "DO",
 "Work Date" : "24.02.2015",
 "Hours" : "2.00",
 "Remarks" : "BPV17A Management"
},
{
 "Emp ID" : "403235",
 "Employee Name" : "Liu Bin",
 "Phase" : "PROJECT_PLAN_&_MANAGEMENT",
 "Sub Phase" : "DO",
 "Work Date" : "24.02.2015",
 "Hours" : "8.00",
 "Remarks" : "BPV17A Management"
}]

var testAdminHours = 
[
{
 "Emp ID" : "403235",
 "Employee Name" : "Liu Bin",
 "Admin Hours" : "10"
},
{
 "Emp ID" : "803235",
 "Employee Name" : "Liu Bin 1",
 "Admin Hours" : "9"
},
{
 "Emp ID" : "903235",
 "Employee Name" : "Liu Bin 2",
 "Admin Hours" : "8"
}]

var testSupervisorFull = 
[
{
 "Project Def" : "AE-00000820",
 "Project Description": "CNSCOE_BJ",
 "Level 1 WBS" : "AE-00000820-026",
 "Level 1 WBS Description" : "B777 BPV 17A",
 "WBS Element" : "AE-00000820-026-0042",
 "WBS Element Description" : "BPV17A RTET for 2015",
 "Emp ID" : "403235",
 "Employee Name" : "Liu Bin",
 "Phase" : "PROJECT_PLAN_&_MANAGEMENT",
 "Sub Phase" : "DO",
 "Work Date" : "24.02.2015",
 "Hours" : "2.00",
 "Remarks" : "BPV17A Management",
 "Supervisor Eid" : "329930",
 "Supervisor name" : "Jin Jiang"
},
{
 "Project Def" : "AE-00000821",
 "Project Description": "CNSCOE_SH",
 "Level 1 WBS" : "AE-00000821-026",
 "Level 1 WBS Description" : "B777 BPV 17A",
 "WBS Element" : "AE-00000821-026-0042",
 "WBS Element Description" : "BPV17A RTET for 2015",
 "Emp ID" : "403235",
 "Employee Name" : "Liu Bin",
 "Phase" : "PROJECT_PLAN_&_MANAGEMENT",
 "Sub Phase" : "DO",
 "Work Date" : "24.02.2015",
 "Hours" : "8.00",
 "Remarks" : "BPV17A Management",
 "Supervisor Eid" : "329930",
 "Supervisor name" : "Jin Jiang"
}]


function onOffSiteStateFunct()
{
  var OnOffSiteStateMain = addMainContainer("On_Off_Site_Status", "div");

  addHeaderForMain(OnOffSiteStateMain,"On/Off Site Status");

  initialAlert(OnOffSiteStateMain);

  var tableOnOffSiteStateDiv = createElementTo("div", OnOffSiteStateMain, "table-responsive");
  tableOnOffSiteStateDiv.id = "current_on_off_site_state_div";
  
  var textOnOffSiteStateBox = createElementTo("div", tableOnOffSiteStateDiv);
  
  var generalOnOffSiteStateText = createElementTo("p", textOnOffSiteStateBox);
  generalOnOffSiteStateText.innerHTML = "Current on/off site state list: ";
  generalOnOffSiteStateText.id = "current_on_off_site_state";
  $("#current_on_off_site_state").css("float", "left");
  $("#current_on_off_site_state").css("padding-top", "8px");
 
  // var refreshOnOffSiteStateBtn = createBtn("Refresh", textOnOffSiteStateBox, "btn btn-success", "onoff_current_refresh_btn", function(){refreshOnOffSiteStateBtnClick()});
  // refreshOnOffSiteStateBtn.setAttribute("style","margin-left: 10px");
  
  var selectdateOnOffSiteStateBtn = createBtn('<span class="glyphicon glyphicon-edit"></span> Date Interval', textOnOffSiteStateBox, "btn btn-warning", "onoff_current_select_data_btn", function(){});
  selectdateOnOffSiteStateBtn.setAttribute("style"," margin-left: 10px");
  selectdateOnOffSiteStateBtn.setAttribute("data-toggle","modal");
  selectdateOnOffSiteStateBtn.setAttribute("data-target","#select_date_modal");
  
  var visaLinkBtn = createBtn('HTS China Visa Status', textOnOffSiteStateBox, "btn btn-primary", "visa_status_btn", function(){window.open("https://teamsites2013.honeywell.com/sites/ChinaEOPS/On%20Site%20Travel%20Tracking/Visa_Status_HTS-China.xlsx")});
  visaLinkBtn.setAttribute("style"," margin-left: 10px");
  visaLinkBtn.setAttribute("data-toggle","modal");

  //表太宽，在他的class最后增加table-overwide
  var onOffSiteStateDiv = createElementTo("div", OnOffSiteStateMain, "table-responsive table-overwide");
  onOffSiteStateDiv.id = "on_off_site_state_div";
  
  var tableHeight=$(window).height()-$("#navbar").height()- ($("#main").innerHeight()-$("#main").height())- $(".page-header").outerHeight(true);
  $("#on_off_site_state_div").css("height",tableHeight+"px");
  $("#on_off_site_state_div").css("overflow-y", "auto");


  var onOffSiteStateList = createElementTo("table", onOffSiteStateDiv, "table table-bordered");
  onOffSiteStateList.id = "on_off_site_state_table";
  $("#on_off_site_state_table").css("float", "left");
  $("#on_off_site_state_table").css("width", "80%");
  $("#on_off_site_state_table").css("margin-top", "10px");

  var onOffSiteStateListHead = createTableHead(onOffSiteStateHead, "on_off_site_state_table");
  formTable(onOffSiteStateListHead, null, "on_off_site_state_table");

  createSelectDateModal(OnOffSiteStateMain)
  
  /////test
  //var onOffSiteStateListBody = createTableBody(testOnOffSiteStateData, "on_off_site_state_table", onOffSiteStateHead)
  //formTable(onOffSiteStateListHead, onOffSiteStateListBody, "on_off_site_state_table");
  //$("#budget_usage_table tbody tr").click(function(){bgtListClick(this.id);});
  
  //generateOnOffSiteStateCurrentListBody(testOnOffSiteStateData);

  //$("#On_Off_Site_Status").click(function(){refreshOnOffSiteStateBtnClick();}); 
  
  refreshOnOffSiteStateBtnClick();
}


testOnOffSiteStateData = 
[
{
	"Level2 WBS": "AE-00000820-021-0015",
	"Create Date": "23.02.2015",
	"On/Off Site Status": "LA-ON-0001",
	"Labor Hours": "20"
},
{
	"Level2 WBS": "AE-00000820-021-0015",
	"Create Date": "23.03.2013",
	"On/Off Site Status": "LA-ON-0001",
	"Labor Hours": "100"
},
{
	"Level2 WBS": "AE-00000820-021-0015",
	"Create Date": "29.07.2015",
	"On/Off Site Status": "LB-OFF-0001",
	"Labor Hours": "4"
}
]

onOffSiteStateHead =
[
"Level2 WBS", 
"Create Date", 
"On/Off Site Status",
"Labor Hours"
]

var onOffSiteStateBodyHO = ["Level2 WBS", "Create Date", "On/Off Site Status","Labor Hours"];

function refreshOnOffSiteStateBtnClick()
{
	$("#On_off_Site_State_main_alert").fadeOut();
  //send refresh order to server here!!!
  $("#current_on_off_site_state").html('Current on/off site state list: ' + animateRefreshIcon + ' Loading...');
  ////test
  //currentOnOffSiteStateList = testOnOffSiteStateData;
 
  dateSelectItems["EID"] = loginUser.eid;
  utils.get(ON_OFF_SITE_STATE_REFRESH,dateSelectItems, function(resp){refreshOnOffSiteStateBtnClickSuccess(resp)}, function(){refreshOnOffSiteStateBtnClickError()});
  }

function refreshOnOffSiteStateBtnClickSuccess(response)
{
  $("#generate_button").html('Generate');

  response = response.replace(/\'/g, "\"");
  var recievedOnOffSiteStateList = $.parseJSON(response);
  currentOnOffSiteStateList = recievedOnOffSiteStateList;
  ////test
  //currentOnOffSiteStateList = testOnOffSiteStateData;
  totalOnOffSitetatesListNb = currentOnOffSiteStateList.length;

  generateOnOffSiteStateCurrentListBody(currentOnOffSiteStateList);
  $("#current_on_off_site_state").html("Current on/off site state list: "+ totalOnOffSitetatesListNb);
  $("#on_off_site_state_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");
}

function refreshOnOffSiteStateBtnClickError()
{
  $("#generate_button").html('Generate');
  $("#on_off_site_state_main_alert").fadeOut();
  $("#on_off_site_state_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Refresh on/off site status failed!');
  $("#on_off_site_state_main_alert").fadeIn();
  $("#current_on_off_site_state").html('Current on/off site state list: N/A');
}

function generateOnOffSiteStateCurrentListBody(bodylist)
{
  if($("#on_off_site_state_table").length > 0)
    $("#on_off_site_state_table").remove();

  var onOffSiteStateList = createElementTo("table", document.getElementById("on_off_site_state_div"), "table table-bordered");
  onOffSiteStateList.id = "on_off_site_state_table";
  $("#on_off_site_state_table").css("float", "left");
  $("#on_off_site_state_table").css("width", "80%");
  $("#on_off_site_state_table").css("margin-top", "10px");
  
  var currentOnOffSiteStateListBody = createTableBody(bodylist, "on_off_site_state_table", onOffSiteStateBodyHO);
  
  var _head = createTableHead(onOffSiteStateHead, "on_off_site_state_table");

  formTable(_head, currentOnOffSiteStateListBody,"on_off_site_state_table");

  //$("#on_off_site_state_table tbody tr").click(function(){closedateListClick(this.id);});

  
  addPager("on_off_site_state_table",4);
	
	$.tablesorter.themes.bootstrap = {
	    // these classes are added to the table. To see other table classes available,
	    // look here: http://getbootstrap.com/css/#tables
	    table        : 'table table-bordered', //table-striped
	    caption      : 'caption',
	    // header class names
	    header       : 'bootstrap-header', // give the header a gradient background (theme.bootstrap_2.css)
	    sortNone     : '',
	    sortAsc      : '',
	    sortDesc     : '',
	    active       : '', // applied when column is sorted
	    hover        : '', // custom css required - a defined bootstrap style may not override other classes
	    // icon class names
	    icons        : '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
	    iconSortNone : 'bootstrap-icon-unsorted', // class name added to icon when column is not sorted
	    iconSortAsc  : 'glyphicon glyphicon-chevron-up', // class name added to icon when column has ascending sort
	    iconSortDesc : 'glyphicon glyphicon-chevron-down', // class name added to icon when column has descending sort
	    filterRow    : '', // filter row class; use widgetOptions.filter_cssFilter for the input/select element
	    footerRow    : '',
	    footerCells  : '',
	    even         : '', // even row zebra striping
	    odd          : ''  // odd row zebra striping
	  };

	$("#on_off_site_state_table").tablesorter({
	  // this will apply the bootstrap theme if "uitheme" widget is included
	  // the widgetOptions.uitheme is no longer required to be set
	  theme : "bootstrap",

	  widthFixed: true,

	  headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

	  // widget code contained in the jquery.tablesorter.widgets.js file
	  // use the zebra stripe widget if you plan on hiding any rows (filter widget)
	  widgets : [ "uitheme", "filter"],//, "zebra" ],

	  widgetOptions : {
	    // using the default zebra striping class name, so it actually isn't included in the theme variable above
	    // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
	    zebra : ["even", "odd"],

	    // reset filters button
	    filter_reset : ".reset",

	    // extra css class name (string or array) added to the filter element (input or select)
	    filter_cssFilter: "form-control",

	    // set the uitheme widget to use the bootstrap theme class names
	    // this is no longer required, if theme is set
	    // ,uitheme : "bootstrap"

	  }
	})

    .tablesorterPager({

	  // target the pager markup - see the HTML block below
	  container: $(".ts-pager"),

	  // target the pager page select dropdown - choose a page
	  cssGoto  : ".pagenum",

	  // remove rows from the table to speed up the sort of large tables.
	  // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
	  removeRows: false,

	  // output string - default is '{page}/{totalPages}';
	  // possible variables: {page}, {totalPages}, {filteredPages}, {startRow}, {endRow}, {filteredRows} and {totalRows}
	  output: '{startRow} - {endRow} ({totalRows})'

	});
	
	//reformOnOFfSiteStateTableStyle("on_off_site_state_table");
}

function createSelectDateModal(parentNode)
{
  var SelectDateModal = createElementTo("div", parentNode, "modal fade");
  SelectDateModal.id = "select_date_modal";
  SelectDateModal.setAttribute("tabindex","-1");
  SelectDateModal.setAttribute("role","dialog");
  SelectDateModal.setAttribute("aria-hidden", "true");
  SelectDateModal.setAttribute("data-backdrop", "static");
  initializeModal(SelectDateModal, "Choose searching start/end date");

  initialAlert(document.getElementById("select_date_modal_body"));

  var selectDateModalBody = document.getElementById("select_date_modal_body");
  
  var row_ = createElementTo("div", selectDateModalBody, "row");
  var col_ = createElementTo("div", row_, "col-sm-12");

  var startDateGroup = createElementTo("div", selectDateModalBody, "form-group");
  var startDateLabel = createElementTo("label", startDateGroup);
  startDateLabel.innerHTML = "Start Date:";
  startDateLabel.setAttribute("style", "margin-top: 10px;float:left");

  var startDateSelectDiv = createElementTo("div", startDateGroup, "input-group date");
  startDateSelectDiv.id = "start_date_select_on_off_site";
  startDateSelectDiv.setAttribute("style","margin-left:120px");
  
  var startDateInput = createElementTo("input", startDateSelectDiv,"form-control");
  startDateInput.id = "start_date_input_on_off_site";
  startDateInput.setAttribute("type","text");
  
  var startDateSpan = createElementTo("span", startDateSelectDiv, "input-group-addon");
  startDateSpan.innerHTML = "<span class=\"glyphicon glyphicon-calendar\"></span>";

  var endDateGroup = createElementTo("div", selectDateModalBody, "form-group");
  var endDateLabel = createElementTo("label", endDateGroup);
  endDateLabel.innerHTML = "End Date:";
  endDateLabel.setAttribute("style", "margin-top: 10px;float:left");

  var endDateSelectDiv = createElementTo("div", endDateGroup, "input-group date")
  endDateSelectDiv.id = "end_date_select_on_off_site";
  
  var endDateInput = createElementTo("input", endDateSelectDiv,"form-control");
  endDateInput.id = "end_date_input_on_off_site";

  endDateInput.setAttribute("type","text");
  endDateSelectDiv.setAttribute("style","margin-left:120px");

  var endDateSpan = createElementTo("span", endDateSelectDiv, "input-group-addon");
  endDateSpan.innerHTML = "<span class=\"glyphicon glyphicon-calendar\"></span>";

  $("#start_date_select_on_off_site").datetimepicker({
    format: "YYYY.MM.DD"
  });

  $("#end_date_select_on_off_site").datetimepicker({
    format: "YYYY.MM.DD"
  });
  
  var dateSelectModalFooter = document.getElementById("select_date_modal_footer");
  var dateSelectCancelBtn = createBtn("Cancel", dateSelectModalFooter, "btn btn-default");
  dateSelectCancelBtn.setAttribute("data-dismiss", "modal");
  var DateSelectSaveBtn = createBtn("Save", dateSelectModalFooter, "btn btn-primary", "select_date_modal_save_btn", function(){dateSelectSaveBtnClick()});
  DateSelectSaveBtn.id = "select_date_modal_save_btn";
  
}



function dateSelectSaveBtnClick()
{
  $("#select_date_modal_body_alert").fadeOut();
  var startDateString = $("#start_date_input_on_off_site").val();
  var endDateString = $("#end_date_input_on_off_site").val();
  if(!startDateString && !endDateString)
  {
    dateSelectItems["Start Date"] = "";
    dateSelectItems["End Date"] = "";
    $("#select_date_modal").modal('hide');
  }
  else
  {
    var startDateVal = new Date(startDateString.replace(".", "-"))
    var endDateVal = new Date(endDateString.replace(".", "-"))
    if (startDateVal > endDateVal)
    {
      $("#select_date_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> End date is earlier than Start date! Please check your choice.');
      $("#select_date_modal_body_alert").fadeIn();
    }
    else
    {
      dateSelectItems["Start Date"] = startDateString;
      dateSelectItems["End Date"] = endDateString;
      $("#select_date_modal_body_alert").modal('hide');
	  $("#select_date_modal").modal('hide');
    }
  }
  
  refreshOnOffSiteStateBtnClick();
}



