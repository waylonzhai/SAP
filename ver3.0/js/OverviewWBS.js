var currentOverviewWbsList = [];
var selectedOverviewWbs = [];
var recievedArray=[];
var WBSArray = [];

function overviewWbsBuildFunct()
{
  var OverviewWbsMain = addMainContainer("overview_wbs", "div");

  addHeaderForMain(OverviewWbsMain,"Overview WBS");

  initialAlert(OverviewWbsMain);

  var tableOverviewWbsDiv = createElementTo("div", OverviewWbsMain, "table-responsive");
  tableOverviewWbsDiv.id = "current_overview_wbs_div";

  var textOverviewWbsBox = createElementTo("div", tableOverviewWbsDiv);

  var generalOverviewWbsText = createElementTo("p", textOverviewWbsBox);
  generalOverviewWbsText.innerHTML = "Current HTS active WBS data: ";
  generalOverviewWbsText.id = "current_overview_wbs";
  $("#current_overview_wbs").css("float", "left");
  $("#current_overview_wbs").css("padding-top", "8px");

  var ganttTableDiv = createElementTo("div", OverviewWbsMain, "table-responsive table-overwide");
  ganttTableDiv.id = "gantt_chart_table_div";
  var _ganttHeader = createElementTo("h3", ganttTableDiv, "page-header");
  _ganttHeader.id = "gantt_chart_table_div_head";
  var _ganttBody = createElementTo("h3", ganttTableDiv, "page-body");
  _ganttBody.id = "gantt_chart_table_div_body";
  $("#gantt_chart_table_div").hide();
  
  // var refreshOverviewWbsBtn = createBtn("Refresh", textOverviewWbsBox, "btn btn-success", "overview_wbs_refresh_btn", function(){refreshOverviewWbsBtnClick()});
  // refreshOverviewWbsBtn.setAttribute("style","margin-left: 10px");
  
  var editOverviewWbsCommentBtn = createBtn('<span class="glyphicon glyphicon-edit"></span> Edit', textOverviewWbsBox, "btn btn-warning", "edit_overview_wbs_comment_btn", function(){});
  editOverviewWbsCommentBtn.setAttribute("style", "margin-left:10px;");
  editOverviewWbsCommentBtn.setAttribute("data-toggle","modal");
  editOverviewWbsCommentBtn.setAttribute("data-target","#overview_wbs_edit_modal");

  
  var overviewWbsBtn1 = createBtn('<span class="glyphicon glyphicon-stats"></span> Check Used Hours', textOverviewWbsBox, "btn btn-info", "check_used_hours_btn", function(){UsedHoursGetLatest(this.id)});
  overviewWbsBtn1.setAttribute("style", "margin-left:10px;");
  overviewWbsBtn1.setAttribute("data-toggle","modal");
  overviewWbsBtn1.setAttribute("data-target","#check_used_hours_modal");
  
  var overviewWbsBtn2 = createBtn('<span class="glyphicon glyphicon-align-left"></span> Gantt Chart', textOverviewWbsBox, "btn btn-info", "gantt_chart_button", function(){ganttBtnClick()});
  overviewWbsBtn2.setAttribute("style", "margin-left:10px;");
  overviewWbsBtn2.setAttribute("data-toggle","modal");
  var backToOverviewBtn =  createBtn('<span class="glyphicon glyphicon-arrow-left"></span> Back to Overveiw WBS', _ganttHeader, "btn btn-default", "back_to_overview_btn", function(){backToOverviewBtnClick();});
  backToOverviewBtn.setAttribute("style", "margin-bottom: 10px;");
   
  var overviewWbsDiv = createElementTo("div", OverviewWbsMain, "table-responsive table-overwide");
  overviewWbsDiv.id = "overview_wbs_div";
  
  var tableHeight=$(window).height()-$("#navbar").height()- ($("#main").innerHeight()-$("#main").height())- $(".page-header").outerHeight(true);
  $("#overview_wbs_div").css("height",tableHeight+"px");
  $("#overview_wbs_div").css("overflow-y", "auto");
  
  var overviewWbsList = createElementTo("table", overviewWbsDiv, "table table-bordered");
  overviewWbsList.id = "overview_wbs_table";
  $("#overview_wbs_table").css("float", "left");
  $("#overview_wbs_table").css("width", "80%");
  $("#overview_wbs_table").css("margin-top", "10px");
  
  var overviewWbsListHead = createTableHead(overviewWbsHead, "overview_wbs_table");
  formTable(overviewWbsListHead, null, "overview_wbs_table");
  
  createOverviewWbsEditModal(OverviewWbsMain);
  createCheckUsedHoursModel(OverviewWbsMain);

    /////test
 
  //$("#overview_wbs_table tbody tr").click(function(){tsbListClick(this.id);});
  //currentOverviewWbsList = testOverviewWbs;
  //generateOverviewWbsCurrentListBody(testOverviewWbs);
  refreshOverviewWbsBtnClick();
  $("#overview_wbs").click(function(){refreshOverviewWbsBtnClick();});
}



overviewWbsHead =
[
"HTS Level 2 WBS", 
"HTS WBS Description", 
"Billing Match",
"Budget Enough for 1 month",
"Close more than 1 month",
"Issues Tracking Comments"
]

var overviewWbsBodyHO = ["HTS WBS ID", "HTS WBS Description", "Billing Match","Budget Enough for 1 month","Close more than 1 month","Issues Tracking Comments"];

function refreshOverviewWbsBtnClick()
{
	$("#overview_wbs_alert").fadeOut();
  //send refresh order to server here!!!
  $("#current_overview_wbs").html('Current HTS active WBS data: ' + animateRefreshIcon + ' Loading...');

  utils.get(OVERVIEW_WBS_GET,"eid="+loginUser.eid, function(resp){refreshOverviewWbsBtnClickSuccess(resp)}, function(){refreshOverviewWbsBtnClickError()});
}

function refreshOverviewWbsBtnClickSuccess(response)
{
  $("#generate_button").html('Generate');
  response = response.replace(/\'/g, "\"");
  var recievedOverviewWbsList = $.parseJSON(response);
  currentOverviewWbsList = recievedOverviewWbsList;
  
  ////test
  //currentOverviewWbsList = testOverviewWbs;
  
  totalOverviewWbsListNb = currentOverviewWbsList.length;

  generateOverviewWbsCurrentListBody(currentOverviewWbsList);
  $("#current_overview_wbs").html("Current HTS active WBS data: "+ totalOverviewWbsListNb);
  $("#overview_wbs_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");
}

function refreshOverviewWbsBtnClickError()
{
  $("#generate_button").html('Generate');
  $("#Overview_WBS_alert").fadeOut();
  $("#Overview_WBS_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Refresh timesheet billing failed!');
  $("#Overview_WBS_alert").fadeIn();
  $("#current_overview_wbs").html('Current HTS active WBS data:  N/A');
}


function generateOverviewWbsCurrentListBody(bodylist)
{
  if($("#overview_wbs_table").length > 0)
    $("#overview_wbs_table").remove();

  var overviewWbsList = createElementTo("table", document.getElementById("overview_wbs_div"), "table table-bordered");
  overviewWbsList.id = "overview_wbs_table";
  $("#overview_wbs_table").css("float", "left");
  $("#overview_wbs_table").css("width", "80%");
  $("#overview_wbs_table").css("margin-top", "10px");
  
  var currentOverviewWbsListBody = createTableBody(bodylist, "overview_wbs_table", overviewWbsBodyHO);
  
  var _head = createTableHead(overviewWbsHead, "overview_wbs_table");

  formTable(_head, currentOverviewWbsListBody,"overview_wbs_table");

  $("#overview_wbs_table tbody tr").click(function(){overviewWbsListClick(this.id);});
 
  
  addPager("overview_wbs_table",6);
	
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

	$("#overview_wbs_table").tablesorter({
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
	
	reformOverviewWbsTableStyle("overview_wbs_table");
}


function reformOverviewWbsTableStyle(tableId)
{
	var overviewWbsArray = $("#" + tableId + "_body tr td:nth-child(5)");
    var userStatusArray = $("#" + tableId + "_body tr td:nth-child(3)");
	var userStatusArray2 = $("#" + tableId + "_body tr td:nth-child(4)");
    var _trs = $("#" + tableId + "_body [role='row']");
	for(var i = 0; i < overviewWbsArray.length; i++)
	{
		var _sys = overviewWbsArray[i].innerHTML;



		if(_sys == "No")
		{
			overviewWbsArray[i].style.color = "red";
		}
	}
	
	for(var i = 0; i < userStatusArray.length; i++)
	{
		var _sys = userStatusArray[i].innerHTML;


		if(_sys == "No")
		{
			userStatusArray[i].style.color = "red";
		}
	}
	
	for(var i = 0; i < userStatusArray2.length; i++)
	{
		var _sys = userStatusArray2[i].innerHTML;



		if(_sys == "No")
		{
			userStatusArray2[i].style.color = "red";
		}
	}
	
		for(var i = 0; i < overviewWbsArray.length; i++)
	{
		var _sys = overviewWbsArray[i].innerHTML;

		if(_sys == "No/Close")
		{
			overviewWbsArray[i].style.color = "blue";
		}
	}
	
	for(var i = 0; i < userStatusArray.length; i++)
	{
		var _sys = userStatusArray[i].innerHTML;

		if(_sys == "No/Close")
		{
			userStatusArray[i].style.color = "blue";
		}
	}
	
	for(var i = 0; i < userStatusArray2.length; i++)
	{
		var _sys = userStatusArray2[i].innerHTML;

		if(_sys == "No/Close")
		{
			userStatusArray2[i].style.color = "blue";
		}
	}
}

function overviewWbsListClick(itemId)
{
  var plIndex = itemId.replace("overview_wbs_table_body","");
  var projectList = currentOverviewWbsList;

  selectedOverviewWbs = currentOverviewWbsList[plIndex];
  if($("#" + itemId).hasClass("checked"))
  {
    $("#" + itemId).removeClass("checked");
    selectedOverviewWbs = [];   
  }
  else
  { 
    $("#" + itemId).addClass("checked");
  }
}


function createOverviewWbsEditModal(parentNode)
{
  //create modal for add project
  var overviewWbsEditModal = createElementTo("div", parentNode, "modal fade");
  overviewWbsEditModal.id = "overview_wbs_edit_modal";
  overviewWbsEditModal.setAttribute("tabindex","-1");
  overviewWbsEditModal.setAttribute("role","dialog");
  overviewWbsEditModal.setAttribute("aria-hidden", "true");
  overviewWbsEditModal.setAttribute("data-backdrop", "static");
  initializeModal(overviewWbsEditModal, "Edit Items");

  initialAlert(document.getElementById("overview_wbs_edit_modal_body"));

  var overviewWbsEditModalBody = document.getElementById("overview_wbs_edit_modal_body");

  //输入框的简便办法
  newInputArea(overviewWbsEditModalBody, "ow_edit_issue_tracking_comments", "Issue Tracking Comments:", "edprojname", "text","");
  $("#ow_edit_issue_tracking_comments").prop('disabled', false);
    
  $("#overview_wbs_edit_modal").on("show.bs.modal", function(){overviewWbsEditModalShow();});
  
  var overviewWbsEditModalFooter = document.getElementById("overview_wbs_edit_modal_footer");
  var owEditCancelBtn = createBtn("Cancel", overviewWbsEditModalFooter, "btn btn-default");
  owEditCancelBtn.setAttribute("data-dismiss", "modal");
  var owEditSaveBtn = createBtn("Save", overviewWbsEditModalFooter, "btn btn-primary", "overview_wbs_edit_modal_save_btn", function(){owEditSaveBtnClick()});
  owEditSaveBtn.id = "overview_wbs_edit_modal_save_btn";
}

function overviewWbsEditModalShow()
{
  $("#overview_wbs_edit_modal_body_alert").fadeOut();
  $("#ow_edit_issue_tracking_comments_input").val("");
  if(selectedOverviewWbs)
  {
    $("#ow_edit_issue_tracking_comments_input").val(selectedOverviewWbs["Issues Tracking Comments"]);
    $("#ow_edit_issue_tracking_comments_input").attr("oldValue", selectedOverviewWbs["Issues Tracking Comments"]);
  }
}

function owEditSaveBtnClick()
{
  $("#overview_wbs_edit_modal_body_alert").fadeOut();
  var isNotEdited = $("#ow_edit_issue_tracking_comments_input").attr("oldValue") == $("#ow_edit_issue_tracking_comments_input").val();
  if(isNotEdited)
  {
    $("#overview_wbs_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Budget Edit info does not change!');
    $("#overview_wbs_edit_modal_body_alert").fadeIn();
  }
  else
  {
    var postData = JSON.parse(JSON.stringify(selectedOverviewWbs));
    postData["Issues Tracking Comments"] = $("#ow_edit_issue_tracking_comments_input").val();

    $("#overview_wbs_edit_modal_save_btn").html('Save ' + animateRefreshIcon);
    utils.post(OVERVIEW_WBS_POST, postData, function(){owEditSaveBtnClickSuccess();}, function(){owEditSaveBtnClickError();});
  }
}

function owEditSaveBtnClickSuccess()
{
  $("#overview_wbs_edit_modal_save_btn").html('Save');
  $("#overview_wbs_edit_modal").modal("hide");
  refreshOverviewWbsBtnClick();
}

function owEditSaveBtnClickError()
{
  $("#overview_wbs_edit_modal_save_btn").html('Save');
  $("#overview_wbs_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Edit project failed!');
  $("#overview_wbs_edit_modal_body_alert").fadeIn();
}


function createCheckUsedHoursModel(parentNode)
{
  var ckeckUsedHoursModal = createElementTo("div", parentNode, "modal fade");
  ckeckUsedHoursModal.id = "check_used_hours_modal";
  ckeckUsedHoursModal.setAttribute("tabindex","-1");
  ckeckUsedHoursModal.setAttribute("role","dialog");
  ckeckUsedHoursModal.setAttribute("aria-hidden", "true");
  ckeckUsedHoursModal.setAttribute("data-backdrop", "static");
  initializeModal(ckeckUsedHoursModal, "WBS Hours Status");

  initialAlert(document.getElementById("check_used_hours_modal_body"));
  var ckeckUsedHoursModalBody = document.getElementById("check_used_hours_modal_body");
  
  var ckeckUsedHoursModalFooter = document.getElementById("check_used_hours_modal_footer");
  
  var checkUsedHoursModelcancelBtn = createBtn("Cancel", ckeckUsedHoursModalFooter, "btn btn-default");
	  checkUsedHoursModelcancelBtn.setAttribute("data-dismiss", "modal");
	  
  var checkUsedHoursBodyContainer = createElementTo("div", ckeckUsedHoursModalBody);
	checkUsedHoursBodyContainer.id = ckeckUsedHoursModalBody.id + "_div";
	
}

function UsedHoursGetLatest(currentProjectIndex)
{
	$("#check_used_hours_modal_body_alert").fadeOut();
	$("#get_used_hours_btn").html('Get WBS Hours Status ' + animateRefreshIcon);
    var WBSArray = getWBSValue();
	
	////test
	//refreshTimeChart();
	//recievedArray = testChartData;
	
	utils.post(OVERVIEW_WBS_TIME_CHART_POST, 'WBS='+ WBSArray, function(resp){UsedHoursGetLatestSuccess(resp);},function(){UsedHoursGetLatestError();});
}

function UsedHoursGetLatestSuccess(response)
{
	if($("#time_chart").length>0)
		$("#time_chart").remove();
	
	$("#get_used_hours_btn").html('Get WBS Hours Status');
	response = response.replace(/\'/g, "\"");
    recievedArray = $.parseJSON(response);
    refreshTimeChart();
}

function UsedHoursGetLatestError()
{
	$("#get_used_hours_btn").html('Get Phase/SubPhase');
	$("#check_used_hours_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Get latest Charged/Total Hours failed');
	$("#check_used_hours_modal_body_alert").fadeIn();
}

function refreshTimeChart()
{
	var timeChartDiv = createElementTo("div", document.getElementById("check_used_hours_modal_body_div"), "proton-demo");
	timeChartDiv.id = "time_chart";
	
	FusionCharts.ready(function () {
    var revenueChart = new FusionCharts({
        type: 'scrollstackedcolumn2d',
        renderAt: 'check_used_hours_modal_body_div',
        width: '550',
        height: '350',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "WBS Charge Hours Status",
                "subCaption": "For selected WBS",
                "xAxisname": "WBS",
                "yAxisName": "Charged Hours",
                "showvalues": "0",
                "numberPrefix": "",
        
                //To show value as datavalue and percent value in tooltip
                "showPercentInTooltip" : "1",
                "showValues" : "1",
                "showPercentValues" : "0",
                //Value font color
                "valueFontColor" : "#000066",
                "bgcolor": "#ffffff",
                "showplotborder": "0",
                "showcanvasborder": "0",
                "legendshadow": "0",
                "plotgradientcolor": "#ffffff",
                "showCanvasBorder": "0",
                "showAxisLines": "0",
                "divlineAlpha": "100",
                "divlineThickness": "1",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "lineThickness": "3",
                "flatScrollBars": "1",
                "scrollheight": "10",
                "numVisiblePlot": "6",
                "showHoverEffect":"1",
		"showalternatehgridcolor": "0",
		"decimalSeparator": ",",
		"formatNumberScale": "0",
                "thousandSeparator": "."

            },

            "categories": [{
                "category": recievedArray[0]
            }],

            "dataset": [{
                "seriesname": "Charged Hours",
                    "data":recievedArray[1]
            }, {
                "seriesname": "Remained Hours",
                    "data": recievedArray[2]
            }]
        }
    });

    revenueChart.render();
});

}



function getWBSValue()
{
	var WBSArray = [];
	for (var i = 0; i < document.getElementById("overview_wbs_table_body").rows.length; i++)
	{
		if($("#overview_wbs_table_body"+ i).hasClass("checked"))
		{
			var selectedOverviewWbs = currentOverviewWbsList[i]
			WBSArray.push(selectedOverviewWbs["HTS WBS ID"]);
		}
	}
	return WBSArray;
}

testOverviewWbs =
[
{ 
	"HTS WBS ID": "AE-00000820-021-0015",
	"HTS WBS Description": "CNS Software China DEV",
	"Billing Match": "Yes",
	"Budget Enough for 1 month": "Yes",
	"Close more than 1 month": "Yes",
	"Issues Tracking Comments": "Enough until this year"
},
{
	"HTS WBS ID": "AE-00000820-021-0028",
	"HTS WBS Description": "CNS Software Brno DEV",
	"Billing Match": "No",
	"Budget Enough for 1 month": "No",
	"Close more than 1 month": "No",
	"Issues Tracking Comments": "Not Enough until this year"
},
{
	"HTS WBS ID": "AE-00000820-022-0078",
	"HTS WBS Description": "CNS Software India DEV",
	"Billing Match": "Yes",
	"Budget Enough for 1 month": "No",
	"Close more than 1 month": "Yes",
	"Issues Tracking Comments": "NOT Enough until this year"
}
]

function backToOverviewBtnClick()
{
    $("#gantt_chart_table_div").fadeOut().promise().done(function() {
      $("#overview_wbs_main_header").html("Overview WBS");
      $("#current_overview_wbs_div").fadeIn();
      $("#overview_wbs_div").fadeIn();
    });
}


function ganttBtnClick()
{
	var postData = [];
	var WBSdata = [];
	var projectList = currentOverviewWbsList;
	for(var i=0; i<projectList.length; i++){
		if($("#overview_wbs_table_body" + i).hasClass("checked"))
			WBSdata.push(projectList[i]["HTS WBS ID"]);
	};
	postData = {"WBS": WBSdata};
	utils.post(OVERVIEW_WBS_GANTT_CHART_GET, postData, function(resp){ganttBtnClickSuccess(resp);}, function(){ganttBtnClickError();})

	//ganttBtnClickSuccess(testGantt);
}

function ganttBtnClickError()
{
  $("#overview_wbs_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Drawing Gantt Chart failed!');
  $("#overview_wbs_main_alert").fadeIn();
}

function ganttBtnClickSuccess(resp)
{
	$("#overview_wbs_main_header").html("Gantt Chart for WBS");
	if($("#gantt_chart_table").length>0)
    $("#gantt_chart_table").remove();
	
	var currentDate = new Date();
	var currentYear = currentDate.getFullYear();
	var lastYear = currentYear - 1;
	var currentMonth = currentDate.getMonth() + 1;
    if (((currentYear % 4)==0) && ((currentYear % 100)!=0) || ((currentYear % 400)==0))
         var FebLastDate = "29/2/";
    else var FebLastDate = "28/2/";
    if (((lastYear % 4)==0) && ((lastYear % 100)!=0) || ((lastYear % 400)==0))
         var FebLastYear = "29/2/";
    else var FebLastYear = "28/2/";

    resp = resp.replace(/\'/g, "\"");
    var ganttData = $.parseJSON(resp);
    var processData = [];
    var taskData = [];
    var startDate = [];
    var endDate = [];

    //var ganttData = testGantt;

    for(var i=0; i<ganttData.length; i++){
    	var num = i+1;
    	var id = num.toString();
    	processData.push(
    	{
    		"label": ganttData[i]["WBS"],
    		"id": id,
    		"hoverBandColor": "#e44a00",
    		"hoverBandAlpha": "40"
    	});
    	startDate.push(
    	{
    		"label": ganttData[i]["start date"]
    	});
    	endDate.push(
    	{
    		"label": ganttData[i]["end date"]
    	});
    	taskData.push(
    	{
    		"label": "Actual",
    		"processid": id,
    		"start": ganttData[i]["start date"],
    		"end": ganttData[i]["end date"],
    		"id": id,
    		"color": "#99cc00",
    		"alpha": "60",
    		"use3dlighting":"1",
    		//"plotgradientcolor": "#99d8ff",
    		"toppadding": "35%",
    		"height": "25%"
    	})
    }

  FusionCharts.ready(function () {
    var cnstrctnPlan = new FusionCharts({
        type: 'gantt',
        renderAt: 'gantt_chart_table_div_body',
        width: '1000',
        height: '600',
        dataFormat: 'json',
        dataSource: {
            "chart": {            
                "dateformat": "dd/mm/yyyy",
                "outputdateformat": "ddds mns yy",
                "ganttwidthpercent": "60",
                "ganttPaneDuration": "730",
                "ganttPaneDurationUnit": "d",
                "plottooltext": "$processName{br} $label starting date $start{br}$label ending date $end",
                "legendBorderAlpha": "0",
                "legendShadow": "0",
                "usePlotGradientColor": "0",
                "showCanvasBorder": "0",
                "flatScrollBars": "1",
                "gridbordercolor": "#333333",
                "gridborderalpha": "20",
                "slackFillColor": "#e44a00",
                "taskBarFillMix": "light+0"
            },
            "categories": [
                {
                    "bgcolor": "#999999",
                    "category": [
                        {
                            "start": "1/1/" + lastYear,
                            "end": "31/12/" + currentYear,
                            "label": lastYear + " ~ " + currentYear,
                            "align": "middle",
                            "fontcolor": "#ffffff",
                            "fontsize": "12"
                        }
                    ]
                },
                {
                    "bgcolor": "#999999",
                    "align": "middle",                                                        
                    "fontcolor": "#ffffff",
                    "fontsize": "12",
                    "category": [
                        {
                            "start": "1/1/" + lastYear,
                            "end": "31/1/" + lastYear,
                            "label": "1" //"Jan"                            
                        },
                        {
                            "start": "1/2/" + lastYear,
                            "end": FebLastYear + lastYear,
                            "label": "2" //"Feb"
                        },
                        {
                            "start": "1/3/" + lastYear,
                            "end": "31/3/" + lastYear,
                            "label": "3" //"Mar"
                        },
                        {
                            "start": "1/4/" + lastYear,
                            "end": "30/4/" + lastYear,
                            "label": "4" //"Apr"                            
                        },
                        {
                            "start": "1/5/" + lastYear,
                            "end": "31/5/" + lastYear,
                            "label": "5" //"May"
                        },
                        {
                            "start": "1/6/" + lastYear,
                            "end": "31/6/" + lastYear,
                            "label": "6" //"Jun"
                        },
                        {
                            "start": "1/7/" + lastYear,
                            "end": "30/7/" + lastYear,
                            "label": "7" //"Jul"                            
                        },
                        {
                            "start": "1/8/" + lastYear,
                            "end": "31/8/" + lastYear,
                            "label": "8" //"Aug"
                        },
                        {
                            "start": "1/9/" + lastYear,
                            "end": "30/9/" + lastYear,
                            "label": "9" //"Sep"
                        },
                        {
                            "start": "1/10/" + lastYear,
                            "end": "31/10/" + lastYear,
                            "label": "10" //"Oct"                            
                        },
                        {
                            "start": "1/11/" + lastYear,
                            "end": "30/11/" + lastYear,
                            "label": "11" //"Nov"
                        },
                        {
                            "start": "1/12/" + lastYear,
                            "end": "31/12/" + lastYear,
                            "label": "12" //"Dec"
                        },
                        {
                            "start": "1/1/" + currentYear,
                            "end": "31/1/" + currentYear,
                            "label": "1" //"Jan"                            
                        },
                        {
                            "start": "1/2/" + currentYear,
                            "end": FebLastDate + currentYear,
                            "label": "2" //"Feb"
                        },
                        {
                            "start": "1/3/" + currentYear,
                            "end": "31/3/" + currentYear,
                            "label": "3" //"Mar"
                        },
                        {
                            "start": "1/4/" + currentYear,
                            "end": "30/4/" + currentYear,
                            "label": "4" //"Apr"                            
                        },
                        {
                            "start": "1/5/" + currentYear,
                            "end": "31/5/" + currentYear,
                            "label": "5" //"May"
                        },
                        {
                            "start": "1/6/" + currentYear,
                            "end": "31/6/" + currentYear,
                            "label": "6" //"Jun"
                        },
                        {
                            "start": "1/7/" + currentYear,
                            "end": "30/7/" + currentYear,
                            "label": "7" //"Jul"                            
                        },
                        {
                            "start": "1/8/" + currentYear,
                            "end": "31/8/" + currentYear,
                            "label": "8" //"Aug"
                        },
                        {
                            "start": "1/9/" + currentYear,
                            "end": "30/9/" + currentYear,
                            "label": "9" //"Sep"
                        },
                        {
                            "start": "1/10/" + currentYear,
                            "end": "31/10/" + currentYear,
                            "label": "10" //"Oct"                            
                        },
                        {
                            "start": "1/11/" + currentYear,
                            "end": "30/11/" + currentYear,
                            "label": "11" //"Nov"
                        },
                        {
                            "start": "1/12/" + currentYear,
                            "end": "31/12/" + currentYear,
                            "label": "12" //"Dec"
                        }
                    ]
                },
            ],
            "processes": {
                "headertext": "WBS",
                "fontcolor": "#000000",
                "fontsize": "11",
                "isanimated": "1",
                "bgcolor": "#6baa01",
                "headervalign": "center",
                "headeralign": "center",
                "headerbgcolor": "#999999",
                "headerfontcolor": "#ffffff",
                "headerfontsize": "12",
                "align": "center",
                "isbold": "1",
                "bgalpha": "25",
                "process": processData            
            },
            "datatable": {
                "showprocessname": "1",
                "namealign": "left",
                "fontcolor": "#000000",
                "fontsize": "10",
                "valign": "right",
                "align": "center",
                "headervalign": "bottom",
                "headeralign": "center",
                "headerbgcolor": "#999999",
                "headerfontcolor": "#ffffff",
                "headerfontsize": "12",                
                "datacolumn": [
                    {
                        "bgcolor": "#eeeeee",
                        "headertext": "Actual{br}Start{br}Date",
                        "text": startDate
                    },
                    {
                        "bgcolor": "#eeeeee",
                        "headertext": "Actual{br}End{br}Date",
                        "text": endDate
                    }                    
                ]
            },
            "tasks": {
                "task": taskData
            },
            "trendlines": [
                {
                    "line": [
                        {
                            "start": currentDate.getDate() + "/" + currentMonth + "/" +currentYear,
                            "displayvalue": currentDate.getDate() + "/" + currentMonth + "/" +currentYear,
                            "color": "333333",
                            "thickness": "2",
                            "dashed": "1"
                        }
                    ]
                }
            ],
        }
    })
    .render();
});
   $("#current_overview_wbs_div").fadeOut();
   $("#overview_wbs_div").fadeOut().promise().done(function() {
      $("#gantt_chart_table_div").fadeIn();})
}

var testGantt = 
[
{
 "WBS" : "403235",
 "start date" : "2/6/2015",
 "end date" : "6/7/2015"
},
{
 "WBS" : "4217383",
 "start date" : "2/4/2015",
 "end date" : "6/8/2015"
},
{
 "WBS" : "123214235",
 "start date" : "2/1/2015",
 "end date" : "6/4/2015"
},
{
 "WBS" : "2142345",
 "start date" : "2/7/2015",
 "end date" : "6/11/2015"
},
{
 "WBS" : "2342335",
 "start date" : "2/3/2015",
 "end date" : "6/7/2015"
},
{
 "WBS" : "856856856",
 "start date" : "2/5/2015",
 "end date" : "6/8/2015"
},
{
 "WBS" : "35357547",
 "start date" : "2/1/2015",
 "end date" : "6/2/2015"
},
{
 "WBS" : "568564563",
 "start date" : "2/8/2015",
 "end date" : "6/10/2015"
},
{
 "WBS" : "345367548",
 "start date" : "2/3/2015",
 "end date" : "6/4/2015"
},
{
 "WBS" : "845636",
 "start date" : "2/4/2015",
 "end date" : "6/6/2015"
},
{
 "WBS" : "403235",
 "start date" : "2/3/2015",
 "end date" : "6/7/2015"
},
{
 "WBS" : "4217383",
 "start date" : "2/4/2015",
 "end date" : "6/8/2015"
},
{
 "WBS" : "123214235",
 "start date" : "2/1/2015",
 "end date" : "6/4/2015"
}
]


