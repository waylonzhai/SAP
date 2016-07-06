var allAvailable = "<i style=\"color:grey\">All (Click to Edit...)</i>";
var clickToEdit = "<i style=\"color:grey\"> (Click to Edit...)</i>";

var wbsSearchingItems = ["all"];
var eidSearchingItems = ["all"];
var dateSearchingItems = {};

var searchResultList = [];
var recievedWbs = [];
var recievedEid = [];
var recievedCopq = [];

var copqRecievedWbs =[];
var copqRecievedPhase =[];
var copqWbsFilterList =["all"];
var copqTHPhaseList = ["all"];
var copqRHPhaseList = ["RH default"];

var clickCopqBtn = "";

  var currentDate = new Date();
  var currentDateDD = currentDate.getDate();
  var currentDateXX = currentDate.getDay();
  currentDate.setDate(currentDateDD-currentDateXX+1);
  var currentMonth = currentDate.getMonth() + 1;
  var currentSun = currentDate.getFullYear() + "." + currentMonth + "." + currentDate.getDate();
  currentDate.setDate(currentDateDD+7-currentDateXX);
  currentMonth = currentDate.getMonth() + 1;
  var currentSat = currentDate.getFullYear() + "." + currentMonth + "." + currentDate.getDate();

function timesheetHoursFunct()
{
	var timesheetHoursMain = addMainContainer("timesheet_hours", "div");

	addHeaderForMain(timesheetHoursMain,"Timesheet Hours");

	initialAlert(timesheetHoursMain);

	var searchingConditionDiv = createElementTo("div", timesheetHoursMain);
	searchingConditionDiv.id = "search_condition_select_div";
	var _searchheader = createElementTo("h3", searchingConditionDiv, "page-header");
	_searchheader.innerHTML="Select your searching condition";
	//buildSearchConditionTable();
	
	var showtableDiv = createElementTo("div", timesheetHoursMain);
	showtableDiv.id = "timesheet_result_table_div";
	var _showheader = createElementTo("h3", showtableDiv, "page-header");
	_showheader.innerHTML="Searching Result";
	_showheader.id = "timesheet_result_table_div_head";
	$("#timesheet_result_table_div").hide();
	//buildSearchConditionTable();

	var searchSubmitBtn = createBtn('Search with following condition', searchingConditionDiv, "btn btn-success", "search_submit_btn", function(){searchSubmitBtnClick()});

	var searchTableDiv = createElementTo("div", searchingConditionDiv);
	searchTableDiv.id = "search_item_list_table_div";

	var searchItemList = createElementTo("table", searchTableDiv, "table table-hover");
	searchItemList.id = "search_item_list_table";
	$("#search_item_list_table").css("float", "left");
	$("#search_item_list_table").css("box-sizing", "none");
	$("#search_item_list_table").css("width", "50%");
	$("#search_item_list_table").css("margin-top", "10px");

    searchItemValueTableList[2]["Value"] = "from " + currentSun + " to " + currentSat + clickToEditDate;
	var searchItemListHead = createTableHead(searchItemListHO, "search_item_list_table");
	var searchItemListBody = createTableBody(searchItemValueTableList, "search_item_list_table", searchItemListHO);

	formTable(searchItemListHead, searchItemListBody, "search_item_list_table");

	refreshSearchItemTableStyle();

	// var projDefModal = new selectedListModal("project_def_select");
	// var level1Modal = new selectedListModal("level_1_wbs_select");
	var level2Modal = new selectedListModal("level_2_wbs_select");
	var eidModal = new selectedListModal("eid_select");
	// var supEidModal = new selectedListModal("sup_eid_select");
	var dateModal = new selectedListModal("time_period_select");

	//$("#project_def_select_modal").modal();

	var backToSearchBtn =  createBtn('<span class="glyphicon glyphicon-arrow-left"></span> Back to select condition', showtableDiv, "btn btn-default", "back_btn", function(){backToSearchBtnClick();});
	backToSearchBtn.setAttribute("style", "margin-bottom: 10px;");

	$("#timesheet_hours").click(function(){
		if($("#search_condition_select_div").css("display") == "none")
				backToSearchBtnClick();
		});
}

function copqFunct()
{
	var copqMain = addMainContainer("copq", "div");

	addHeaderForMain(copqMain,"COPQ");

	initialAlert(copqMain);

	var copqInfoDiv = createElementTo("div", copqMain);
	copqInfoDiv.id = "copq_information_div";

	buildCopqInfoDiv();

	var copqTableDiv = createElementTo("div", copqMain);
	copqTableDiv.id = "copq_table_div";

	// //for test

	// recievedCopq = testCopq;
	// buildCopqTable();
	// updateCopqInfo();
	// //
}

function buildCopqInfoDiv()
{
	var infoDiv = document.getElementById("copq_information_div")

	var tableOperDiv = createElementTo("div", infoDiv);
	tableOperDiv.setAttribute("style", "margin-bottom:15px;")

	// var copqRefreshBtn =  createBtn('Refresh', tableOperDiv, "btn btn-success", "back_btn", function(){});
	// copqRefreshBtn.setAttribute("style", "margin-right: 10px;");

	
	

	var dataDisplayDiv = createElementTo("div",infoDiv);
	var totalHourDiv = createElementTo("div", dataDisplayDiv,"col-xs-2 col-sm-2 col-md-2");
	var reworkHourDiv = createElementTo("div", dataDisplayDiv,"col-xs-3 col-sm-3 col-md-3");
	var copqDiv = createElementTo("div", dataDisplayDiv,"col-xs-2 col-sm-2 col-md-3");
	
	totalHourDiv.setAttribute("style", "padding-left: 0px;");

	var totalHourPara = createElementTo("p", totalHourDiv);
	totalHourPara.id="total_hours_para";
	totalHourPara.innerHTML = "Total Hours: N/A";
	totalHourPara.setAttribute("style", "margin-top:10px;font-weight:bold;");
	var totalHourBtn = createBtn("Phase Setting", totalHourDiv, "btn btn-default", "total_phase_filter_btn");
	totalHourBtn.setAttribute("style","margin-right: 10px;margin-bottom: 10px;");
	totalHourBtn.setAttribute("data-container", "body");
	totalHourBtn.setAttribute("data-toggle", "popover");
	totalHourBtn.setAttribute("data-placement", "right");
	totalHourBtn.setAttribute("data-content", "<div id=\"th_phase_popover\"><div>");
	$("#total_phase_filter_btn").popover({html : true });
	$("#total_phase_filter_btn").on('shown.bs.popover', function () {clickCopqBtn="total_phase_filter_btn"; getPhasePair();});
	
	var reworkPara = createElementTo("p", reworkHourDiv)
	reworkPara.id="rework_hours_para";
	reworkPara.innerHTML = "Rework Hours: N/A";
	reworkPara.setAttribute("style", "margin-top:10px;font-weight:bold;");
	var reworkHourBtn = createBtn("Phase Setting", reworkHourDiv, "btn btn-default", "rework_phase_filter_btn");
	reworkHourBtn.setAttribute("style","margin-right: 10px;");
	reworkHourBtn.setAttribute("data-container", "body");
	reworkHourBtn.setAttribute("data-toggle", "popover");
	reworkHourBtn.setAttribute("data-placement", "right");
	reworkHourBtn.setAttribute("data-content", "<div id=\"rh_phase_popover\"><div>");
	$("#rework_phase_filter_btn").popover({html : true });
	$("#rework_phase_filter_btn").on('shown.bs.popover', function () {clickCopqBtn="rework_phase_filter_btn"; getPhasePair();});

	var copqPara = createElementTo("p", copqDiv);
	copqPara.id="copq_para";
	copqPara.innerHTML = "COPQ = N/A";
	copqPara.setAttribute("style", "margin-top:10px;font-weight:bold;");
	var wbsFilterBtn =  createBtn('Search by WBS', copqDiv, "btn btn-primary", "wbs_filter_btn");
	wbsFilterBtn.setAttribute("style", "margin-right: 10px;");
	wbsFilterBtn.setAttribute("data-container", "body");
	wbsFilterBtn.setAttribute("data-toggle", "popover");
	wbsFilterBtn.setAttribute("data-placement", "right");
	wbsFilterBtn.setAttribute("data-content", "<div id=\"wbs_filter_popover\"><div>");
	$("#wbs_filter_btn").popover({html : true });
	$("#wbs_filter_btn").on('shown.bs.popover', function () {getCopqWbs();});
}

function buildCopqTable()
{
	if($("#copq_table").length>0)
	{
		$("#copq_table").remove();
	}

	var copqTable = createElementTo("table", document.getElementById("copq_table_div"), "table table-bordered  table-overwide");
	copqTable.id = "copq_table";

	var copqHead = createTableHead(copqTitleList, "copq_table");
	var copqBody = createTableBody(recievedCopq, "copq_table", copqBodyHO);

	formTable(copqHead, copqBody, "copq_table");

	addPager("copq_table",7);

	tableSorterForEid("copq_table");

}

function updateCopqInfo()
{
	var phaseList = $("#copq_table_body tr td:nth-child(4)");
	var subPhaseList = $("#copq_table_body tr td:nth-child(5)");
	var hoursList = $("#copq_table_body tr td:nth-child(7)");

	var _sumTotal = 0;
	var _sumRework = 0;

	for(var i =0; i < phaseList.length; i++)
	{
		var phasePair = "Phase>" + phaseList[i].innerHTML + ">SubPhase>" + subPhaseList[i].innerHTML;
		var _hour = Number(hoursList[i].innerHTML);

		if(isContain(phasePair,copqTHPhaseList) || isContain("all",copqTHPhaseList))
		{
			_sumTotal += _hour;
		}

		if(isContain(phasePair,copqRHPhaseList) || (isContain("RH default", copqRHPhaseList) && subPhaseList[i].innerHTML == "REWORK"))
		{
			_sumRework += _hour;
		}
	}

	var copqVal = _sumRework * 100.0 / _sumTotal;
	$("#total_hours_para").html("Total Hours: " + _sumTotal + "h");
	$("#rework_hours_para").html("Rework Hours: " + _sumRework + "h");
	$("#copq_para").html("COPQ = " + parseFloat(copqVal).toFixed(2) + "%");

	if(copqVal>4)
	{
		$("#copq_para").css("color", "red");
	}
	else
	{
		$("#copq_para").css("color", "#333");
	}

}

function refreshSearchItemTableStyle()
{

	var firstCols = $("#search_item_list_table_body tr td:nth-child(1)");
	var secondCols = $("#search_item_list_table_body tr td:nth-child(2)");
	var tds = $("#search_item_list_table_body tr td");

	tds.css("border-top", "0px");
	firstCols.css("width","100px");
	firstCols.css("cursor","auto");
	firstCols.css("cursor","auto");
	firstCols.css("font-weight","bold");

	for(var i=0; i < modalIdOrder.length; i++)
	{
	 	var _modalId = "#" + modalIdOrder[i] + "_modal";
	 	secondCols[i].setAttribute("data-toggle","modal");
	 	secondCols[i].setAttribute("data-target", _modalId);
		//secondCols[i].onclick = function(){$( _modalId ).modal()};
	}
}

function createModalForTimesheet(modalId, parentNode)
{
	var _modal = createElementTo("div", parentNode, "modal fade");
	_modal.id = modalId + "_modal";
	_modal.setAttribute("tabindex","-1");
	_modal.setAttribute("role","dialog");
	_modal.setAttribute("aria-hidden", "true");
	_modal.setAttribute("data-backdrop", "static");
	initializeModal(_modal, modalTitleMapping[modalId]);

	var _modalBody = document.getElementById(_modal.id + "_body");

	initialAlert(_modalBody);
	
	var _modalFooter = document.getElementById(_modal.id + "_footer");

	if (modalId != "time_period_select")
	{
		var getLatestBtn = createBtn("Get latest list", _modalFooter, "btn btn-success pull-left", _modal.id + "_refresh_button", function(){getLatestMapping[modalId]()});
	}
	else
		var getLatestBtn = createBtn("Reset Dates", _modalFooter, "btn btn-success pull-left", _modal.id + "_reset_button", function(){getLatestMapping[modalId]()});


	var _cancelBtn = createBtn("Cancel", _modalFooter, "btn btn-default");
	_cancelBtn.setAttribute("data-dismiss", "modal");
	var _saveBtn = createBtn("Save", _modalFooter, "btn btn-primary", _modal.id + "_save_button", function(){refreshSearchItemTableValue(this.id);});

	$("#" + _modal.id).on("show.bs.modal", function(){modalShowMapping[modalId]();})

	return _modal;

}

var selectedListModal = function (modalId, selectedListArray)
{
	this.titleText = modalTitleMapping[modalId];
	this.listArray = selectedListArray;
	this.chooseAll = false;

	this.modal = createModalForTimesheet(modalId, document.getElementById("search_condition_select_div"));
	var listModalId = this.modal.id;

	modalBodyMapping[modalId](listModalId);
}

selectedListModal.prototype.constructor = selectedListModal;


function refreshSearchItemTableValue(listModalId)
{
	var _modalId = listModalId.replace("_modal_save_button", "");
	saveSelectValueMapping[_modalId]();

	if($("#search_item_list_table").length > 0)
		$("#search_item_list_table").remove();

	var searchItemList = createElementTo("table", document.getElementById("search_item_list_table_div"), "table table-hover");
	searchItemList.id = "search_item_list_table";
	$("#search_item_list_table").css("float", "left");
	$("#search_item_list_table").css("box-sizing", "none");
	$("#search_item_list_table").css("width", "50%");
	$("#search_item_list_table").css("margin-top", "10px");

	var searchItemListHead = createTableHead(searchItemListHO, "search_item_list_table");
	var searchItemListBody = createTableBody(searchItemValueTableList, "search_item_list_table", searchItemListHO);

	formTable(searchItemListHead, searchItemListBody, "search_item_list_table");
	refreshSearchItemTableStyle();
	$("search_submit_btn").after(searchItemList);
}

function searchSubmitBtnClick()
{
	$("#timesheet_hours_main_alert").fadeOut();

  if(dateSearchingItems["start"] && dateSearchingItems["end"])
    var postData = {
		"Level 2": wbsSearchingItems,
		"EID": eidSearchingItems,
		"Start Date" : dateSearchingItems["start"],
		"End Date" : dateSearchingItems["end"]
    };
  else 
      var postData = {
      	"Level 2": wbsSearchingItems,
		"EID": eidSearchingItems,
      	"Start Date" : currentSun,
      	"End Date" : currentSat
    };

	$("#search_submit_btn").html('Search with following condition ' + animateRefreshIcon);

	utils.post(GET_TS_SEARCH_RESULT, postData, function(resp){searchSubmitBtnClickSuccess(resp);}, function(){searchSubmitBtnClickError()})

	//for test
	// searchResultList = testResult;
	// buildResultTable();
	// $("#search_condition_select_div").fadeOut();
 //    $("#timesheet_result_table_div").fadeIn();
}

function searchSubmitBtnClickSuccess(response)
{
	if(response == "TOO_MANY_ROWS")
	{
		$("#timesheet_hours_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Result size out of display capacity! Please add more condition to reduce the searching result numbers.');
		$("#timesheet_hours_main_alert").fadeIn();
	}
	else if(!response)
	{
		$("#timesheet_hours_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Search time sheet time out, please try it again!');
		$("#timesheet_hours_main_alert").fadeIn();
	}
    else
    {
    	response = response.replace(/\"/g, "<quote>");
    	response = response.replace(/\'/g, "\"");
    	response = response.replace(/<quote>/g, "\'");
    	response = response.replace(/\\/g, "\\\\");
    	try
    	{
    	    searchResultList = $.parseJSON(response);
    	    buildResultTable();
    	}
    	catch(e)
    	{
    		$("#search_submit_btn").html('Search with following condition');
    		$("#timesheet_hours_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Response format incorrect.');
			$("#timesheet_hours_main_alert").fadeIn();
    	}
    
        
    
        $("#search_condition_select_div").fadeOut().promise().done(function() {
        	$("#timesheet_result_table_div").fadeIn();
        });
    }
    $("#search_submit_btn").html('Search with following condition');
}

function searchSubmitBtnClickError()
{
	$("#search_submit_btn").html('Search with following condition');
	$("#timesheet_hours_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>Submit search condition failed!');
	$("#timesheet_hours_main_alert").fadeIn();
}

function backToSearchBtnClick()
{
    $("#timesheet_result_table_div").fadeOut().promise().done(function() {
    	$("#search_condition_select_div").fadeIn();
    });
}

function buildResultTable()
{
	if($("#timesheet_result_table").length>0)
		$("#timesheet_result_table").remove();

	var tableDiv = createElementTo("div", document.getElementById("timesheet_result_table_div"));

	var tsResultTable = createElementTo("table", tableDiv, "table table-bordered  table-overwide");
	tsResultTable.id = "timesheet_result_table";

	var resultHead = createTableHead(resultTitleList, "timesheet_result_table");
	var resultBody = createTableBody(searchResultList, "timesheet_result_table", resultBodyHO);

	formTable(resultHead, resultBody, "timesheet_result_table");
	addPager("timesheet_result_table",15);
	tableSorterForEid("timesheet_result_table");

	var timeSheetResultTotalHours = computeTotalHours($("#timesheet_result_table_body td:nth-child(12)"));
	$("#timesheet_result_table_div_head").html("Searching Result (Total Hours: " + timeSheetResultTotalHours + "h)")
}

function computeTotalHours(cols)
{
	var _sum = 0;
	for (var i =0; i < cols.length; i++)
	{
		var _num = Number(cols[i].innerHTML);
		_sum = _sum + _num;
	}

	return _sum;
}

function wbsBodyBuilding(listModalId)
{
	var wbsBody = document.getElementById(listModalId + "_body");
	var wbsBodyContainer = createElementTo("div", wbsBody);
	wbsBodyContainer.id = wbsBody.id + "_div";

	if(recievedWbs.length <= 0)
		wbsGetLatest();

	//refreshWbsTree();
}

function eidBodyBuilding(listModalId)
{
	var eidBody = document.getElementById(listModalId + "_body");
	var eidTableDiv = createElementTo("div", eidBody);
	eidTableDiv.id = listModalId + "_body_div";

	if(recievedEid.length <=0)
		eidGetLatest();

	//refreshEidTable();
}

function dateBodyBuilding(listModalId)
{
	var dateBody = document.getElementById(listModalId + "_body");

	var _row = createElementTo("div", dateBody, "row");
	var _col = createElementTo("div", _row, "col-sm-12");

	var startGroup = createElementTo("div", dateBody, "form-group");
	var startLabel = createElementTo("label", startGroup);
	startLabel.innerHTML = "Start Date:";
	startLabel.setAttribute("style", "margin-top: 10px;float:left");

	var startDatePickerDiv = createElementTo("div", startGroup, "input-group date");
	startDatePickerDiv.id = "start_date_picker";
	
	var startInput = createElementTo("input", startDatePickerDiv,"form-control");
	startInput.id = "start_date_input";
	//startInput.setAttribute("data-format", "yyyy.MM.dd");
	startInput.setAttribute("type","text");
	startDatePickerDiv.setAttribute("style","margin-left:120px");

	var startSpan = createElementTo("span", startDatePickerDiv, "input-group-addon");
	startSpan.innerHTML = "<span class=\"glyphicon glyphicon-calendar\"></span>";

	var endGroup = createElementTo("div", dateBody, "form-group");
	var endLabel = createElementTo("label", endGroup);
	endLabel.innerHTML = "End Date:";
	endLabel.setAttribute("style", "margin-top: 10px;float:left");

	var endDatePickerDiv = createElementTo("div", endGroup, "input-group date")
	endDatePickerDiv.id = "end_date_picker";
	

	var endInput = createElementTo("input", endDatePickerDiv,"form-control");
	endInput.id = "end_date_input";
	//endInput.setAttribute("data-format", "yyyy.MM.dd");
	endInput.setAttribute("type","text");
	endDatePickerDiv.setAttribute("style","margin-left:120px");

	var endSpan = createElementTo("span", endDatePickerDiv, "input-group-addon");
	endSpan.innerHTML = "<span class=\"glyphicon glyphicon-calendar\"></span>";

	$("#start_date_picker").datetimepicker({
		format: "YYYY.MM.DD"
	});

	$("#end_date_picker").datetimepicker({
		format: "YYYY.MM.DD"
	});

	  if($("#start_date_input").val() == "")
	  	$("#start_date_input").val(currentSun);
	  if($("#end_date_input").val() == "")
	  	$("#end_date_input").val(currentSat);
}

function wbsSaveValue()
{
	$("#level_2_wbs_select_modal_body_alert").fadeOut();
	var allCheckedId = $("#wbs_tree").jstree("get_checked",null,true);	
	if(allCheckedId.length == 0)
	{
		$("#level_2_wbs_select_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> You should select at leat 1 WBS.');
		$("#level_2_wbs_select_modal_body_alert").fadeIn();
	}
	else
	{
		wbsSearchingItems=[];

		if(!isContain("wbs_all", allCheckedId))
		{
			for(var i = 0; i< allCheckedId.length; i++)
			{
				if(allCheckedId[i].indexOf("wbs_") !== -1)
				{
					var checkedId = allCheckedId[i].replace("wbs_","");
					wbsSearchingItems.push(checkedId);
				}
			}

		}
		else
			wbsSearchingItems=["all"];
		searchItemValueTableList[0]["Value"] = textToShow(wbsSearchingItems);
		$("#level_2_wbs_select_modal").modal('hide');
	}
}

function eidSaveValue()
{
	$("#eid_select_modal_body_alert").fadeOut();
	var allCheckedNode = $("#eid_table_body .checked");
	if(allCheckedNode.length == 0)
	{
		$("#eid_select_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> You should select at leat 1 EID.');
		$("#eid_select_modal_body_alert").fadeIn();
	}
	else
	{
		eidSearchingItems=[];
		var allCheckedTd = $("#eid_table_body .checked td:nth-child(2)");
		var allCheckedId = [];

		for(var i = 0; i < allCheckedTd.length; i++)
		{
			allCheckedId[i] = allCheckedTd[i].innerHTML;
		}

		if(!(allCheckedNode.length==$("#eid_table_body tr").length))
		{
			for(var i = 0; i< allCheckedId.length; i++)
			{
				
				//var checkedId = allCheckedId[i].replace("eid_","");
				eidSearchingItems.push(allCheckedId[i]);
			}

		}
		else
			eidSearchingItems=["all"];
		searchItemValueTableList[1]["Value"] = textToShow(eidSearchingItems);
		$("#eid_select_modal").modal('hide');
	}
}

function dateSaveValue()
{
	$("#time_period_select_modal_body_alert").fadeOut();
	var startDateStr = $("#start_date_input").val();
	var endDateStr = $("#end_date_input").val();
	if(!startDateStr && !endDateStr)
	{
		dateSearchingItems["start"] = "";
		dateSearchingItems["end"] = "";
		searchItemValueTableList[2]["Value"] = allAvailable;
		$("#time_period_select_modal").modal('hide');
	}
	else
	{
		var startDate = new Date(startDateStr.replace(".", "-"))
		var endDate = new Date(endDateStr.replace(".", "-"))
		if (startDate > endDate)
		{
			$("#time_period_select_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> End date is earlier than Start date! Please check your choice.');
			$("#time_period_select_modal_body_alert").fadeIn();
		}
		else if(!startDateStr)
		{
			dateSearchingItems["start"] = "";
			dateSearchingItems["end"] = endDateStr;
			searchItemValueTableList[2]["Value"] = "before " + endDateStr + clickToEdit;
			$("#time_period_select_modal").modal('hide');
		}
		else if(!endDateStr)
		{
			dateSearchingItems["start"] = startDateStr;
			dateSearchingItems["end"] = "";
			searchItemValueTableList[2]["Value"] = "after " + startDateStr + clickToEdit;
			$("#time_period_select_modal").modal('hide');
		}
		else
		{
			dateSearchingItems["start"] = startDateStr;
			dateSearchingItems["end"] = endDateStr;
			searchItemValueTableList[2]["Value"] = "from " + startDateStr + " to " + endDateStr + clickToEdit;
			$("#time_period_select_modal").modal('hide');
		}
	}

	

}

function wbsGetLatest()
{
	$("#level_2_wbs_select_modal_body_alert").fadeOut();
	$("#level_2_wbs_select_modal_refresh_button").html('Get latest list ' + animateRefreshIcon);
	utils.get(GET_WBS_LIST, null, function(resp){wbsGetLatestSuccess(resp);},function(){wbsGetLatestError();});
}

function wbsGetLatestSuccess(response)
{
	$("#level_2_wbs_select_modal_refresh_button").html('Get latest list');
	response = response.replace(/\'/g, "\"");
    recievedWbs = $.parseJSON(response);

    refreshWbsTree();
    $("#wbs_tree").bind("loaded.jstree", function (event, data) {
    	$("#wbs_tree").jstree('close_all', -1);
    });

}

function wbsGetLatestError()
{
	$("#level_2_wbs_select_modal_refresh_button").html('Get latest list');
	$("#level_2_wbs_select_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Get latest WBS list failed');
	$("#level_2_wbs_select_modal_body_alert").fadeIn();
}

function eidGetLatest()
{
	$("#eid_select_modal_body_alert").fadeOut();
	$("#eid_select_modal_refresh_button").html('Get latest list ' + animateRefreshIcon);
	utils.get(GET_EID_LIST, null, function(resp){eidGetLatestSuccess(resp);},function(){eidGetLatestError();});
}

function eidGetLatestSuccess(response)
{
	$("#eid_select_modal_refresh_button").html('Get latest list');
	response = response.replace(/\'/g, "\"");
    recievedEid = $.parseJSON(response);

    refreshEidTable();
}

function eidGetLatestError()
{
	$("#eid_select_modal_refresh_button").html('Get latest list');
	$("#eid_select_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Get latest EID list failed');
	$("#eid_select_modal_body_alert").fadeIn();
}

function resetDates()
{
	$("#start_date_input").val("");
	$("#end_date_input").val("");
}

function wbsShow()
{
	if(recievedWbs.length <= 0)
		wbsGetLatest();
}

function eidShow()
{
	if(recievedEid.length <=0)
		eidGetLatest();
}


function textToShow(array)
{
	var _str = "";
	if(isContain("all", array))
	{
		_str = allAvailable;
	}
	else
	{
		for(var i = 0; i < array.length && i < 3; i++)
		{
			if(i < 2)
			{
				_str = _str + array[i];
				if(i != array.length - 1)
					_str = _str + ", "
			}
			else
				_str = _str + "etc..."

		}

		_str = _str + clickToEdit;
	}

	return _str;
}

function addCheckForEid(array)
{
	var resultList = copyObj(array);
	for(var i = 0; i< array.length; i++)
	{
		
		if(isContain(array["Emp ID"], eidSearchingItems) || isContain("all", eidSearchingItems))
			resultList[i]["isCheck"]="<span class=\"glyphicon glyphicon-ok for-eid\"></span><span class=\"glyphicon glyphicon-minus for-eid\">yes</span>";
		else
			resultList[i]["isCheck"]="<span class=\"glyphicon glyphicon-ok for-eid\">no</span><span class=\"glyphicon glyphicon-minus for-eid\"></span>";
	}
	

	return resultList;
}

function changeWbsToTreeRelation(targetArray, selectedList)
{
	var rootsArray = targetArray["Proj"];
	var child1Array = targetArray["Level 1"];
	var child2Array = targetArray["Level 2"];
	var projDefList = gatherSpecAttr(rootsArray,"Project Def");
	var level1DefList = gatherSpecAttr(child1Array, "Level 1 WBS");

	var treeList = [];

	for (var i =0; i < rootsArray.length; i++)
	{
		var listRootObj = {};
		listRootObj["text"] = rootsArray[i]["Project Def"] + " : " + rootsArray[i]["Project Description"];
		listRootObj["id"] = "proj_" + rootsArray[i]["Project Def"];
		listRootObj["children"] = [];
		listRootObj.hasChild = false;
		var _child1=[];
		for (var j = 0; j< child1Array.length; j++)
		{
			if(child1Array[j]["Level 1 WBS"].indexOf(projDefList[i]) !== -1)
			{
				var listChild1obj = {};
				listChild1obj["children"] = [];
				listRootObj.hasChild = true;
				listChild1obj["text"] = child1Array[j]["Level 1 WBS"] + " : " + child1Array[j]["Level 1 WBS Description"];
				listChild1obj["id"] = "lv1_" + child1Array[j]["Level 1 WBS"];
				listChild1obj.hasChild = false;
				for(var k = 0; k< child2Array.length; k++)
				{
					if(child2Array[k]["WBS Element"].indexOf(level1DefList[j]) !== -1)
					{
						var listChild2Obj = {};
						listChild2Obj["text"] = child2Array[k]["WBS Element"] + " : " + child2Array[k]["WBS Element Description"];
						listChild2Obj["id"] = "wbs_" + child2Array[k]["WBS Element"];
						if(isContain(child2Array[k]["WBS Element"], selectedList) || isContain("all", selectedList))
						{
							var _status = {};
							_status["selected"] = true;
							listChild2Obj["state"] = _status;
						}
						listChild1obj["children"].push(listChild2Obj);
					}
				}
				listRootObj["children"].push(listChild1obj);
			}
		}
		treeList.push(listRootObj);
	}

	return treeList;
}

function changePhaseToTreeRelation(targetArray, selectedList)
{

	var treeList = [];
	var phaseList = [];

	for (var i =0; i < targetArray.length; i++)
	{
		var _pair = targetArray[i];
		if(!isContain(_pair["Phase"],phaseList))
		{
			phaseList.push(_pair["Phase"]);
			var newPhase = {};
			newPhase["text"] = _pair["Phase"];
			newPhase["id"] = "phase_" + _pair["Phase"];
			newPhase["children"] = [];
			var newSubPhase = {};
			newPhase["children"].push(newSubPhase);
			newSubPhase["text"] = _pair["Sub Phase"];
			newSubPhase["id"] = "Phase>" + newPhase["id"].replace("phase_", "") + ">SubPhase>" + _pair["Sub Phase"];
			if((isContain(newSubPhase["id"],selectedList) || isContain("all", selectedList) || (newSubPhase["text"] == "REWORK" && isContain("RH default", selectedList))))
			{
				var _status = {};
				_status["selected"] = true;
				newSubPhase["state"] = _status;
			}
			treeList.push(newPhase);
		}
		else
		{
			var existedPhase = treeList[phaseList.indexOf(_pair["Phase"])];
			if(existedPhase["children"].length < 0)
				existedPhase["children"] = [];
			var newSubPhase = {};
			existedPhase["children"].push(newSubPhase);
			newSubPhase["text"] = _pair["Sub Phase"];
			newSubPhase["id"] = "Phase>" + existedPhase["id"].replace("phase_", "") + ">SubPhase>" + _pair["Sub Phase"];
			if((isContain(newSubPhase["id"],selectedList) || isContain("all", selectedList) || (newSubPhase["text"] == "REWORK" && isContain("RH default", selectedList))))
			{
				var _status = {};
				_status["selected"] = true;
				newSubPhase["state"] = _status;
			}
		}
	}

	return treeList;
}

function refreshWbsTree()
{
	if($("#wbs_tree").length>0)
		$("#wbs_tree").remove();

	var wbsTreeDiv = createElementTo("div", document.getElementById("level_2_wbs_select_modal_body_div"), "proton-demo");
	wbsTreeDiv.id = "wbs_tree";

	//recievedWbs = testWbs;
	var treeData = {
		"text": "All",
		"id" : "wbs_all",
		"children": changeWbsToTreeRelation(recievedWbs, wbsSearchingItems)
	}

	$("#wbs_tree").jstree({
		'plugins': ["checkbox","json_data","themes","ui","sort"],
        'core': {
            'data': treeData,
            'themes': {
                'name': 'proton',
                'responsive': true,
                'icons' :false
            },
            'expand_selected_onload': false
        }
	})
	$("#wbs_tree").bind('loaded.jstree', function(e, data) {
    // invoked after jstree has loaded
    $(this).jstree("close_all");
})

}

function refreshEidTable()
{

	if($("#eid_table").length>0)
	{
		$("#eid_table").remove();
	}

	var eidTable = createElementTo("table", document.getElementById("eid_select_modal_body_div"), "table table-bordered table-hover tablesorter");
	eidTable.id = "eid_table";

	//recievedEid = testEid;
	var eidListWithCheck = addCheckForEid(recievedEid);

	var eidTableHead = createTableHead(["All <span class=\"glyphicon glyphicon-check select-all\"><span>", "EID", "Name"], "eid_table");
	var eidTableBody = createTableBody(eidListWithCheck, "eid_table", eidTableHO);


	formTable(eidTableHead, eidTableBody, "eid_table");
	//$("#eid_table_head tr th:nth-child(1)").attr("data-sorter", "false");
	addPager("eid_table",3);
	tableSorterForEid("eid_table");
	refreshEidTableStyle("eid_table");


}

function tableSorterForEid(tableId)
{
	//addPager(tableId, 3);



	
	$.tablesorter.themes.bootstrap = {
	    // these classes are added to the table. To see other table classes available,
	    // look here: http://getbootstrap.com/css/#tables
	    table        : 'table table-bordered',
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

	$("#" + tableId).tablesorter({
	  // this will apply the bootstrap theme if "uitheme" widget is included
	  // the widgetOptions.uitheme is no longer required to be set
	  theme : "bootstrap",

	  //sortList : [[0,1]],

	  widthFixed: true,

	  headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

	  // widget code contained in the jquery.tablesorter.widgets.js file
	  // use the zebra stripe widget if you plan on hiding any rows (filter widget)
	  widgets : ["uitheme","filter"],//, "zebra" ],

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

	    group_collapsible : true,
        group_collapsed   : false,
        group_count       : false,
        filter_childRows  : true

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
	  output: '{startRow} - {endRow} / {filteredRows} (total: {totalRows})'

	});


	$("#" + tableId + "_head input").attr("placeholder", 'Filter...');

}

function refreshEidTableStyle(tableId)
{
	$("#eid_table_body tr td:nth-child(1)").css("width","75px!important");
	$("#eid_table_head tr th:nth-child(1)").css("width","75px!important");

	var trList = $("#eid_table_body tr");
	var checkedStatusList = $("#eid_table_body tr td:nth-child(1)")
	for (var i = 0; i < checkedStatusList.length; i++)
	{
		//"<span class=\"glyphicon glyphicon-ok for-eid\"></span><span class=\"glyphicon glyphicon-minus for-eid\">yes</span>"
		var statusText = checkedStatusList[i].innerHTML.replace("<span class=\"glyphicon glyphicon-ok for-eid\">","");
		statusText = statusText.replace("</span><span class=\"glyphicon glyphicon-minus for-eid\">","");
		statusText = statusText.replace("</span>","");
		if(statusText == "yes")
			trList[i].className = "checked";
	}


	if($("#eid_table_body tr").length > $("#eid_table_body .checked").length)
	{
		$(".select-all").removeClass("glyphicon-check");
		$(".select-all").addClass("glyphicon-unchecked");
	}
	else
	{
		$(".select-all").removeClass("glyphicon-unchecked");
		$(".select-all").addClass("glyphicon-check");
	}

	$("#eid_table_body tr").click(function(){eidRowClick(this.id);});
	$("#eid_table .select-all").click(function(e){consumeBubbleEvent(e);selectAllClick(this);});
}

function selectAllClick(icon)
{
	if($("#eid_table_body tr").length > $("#eid_table_body .checked").length)
	{
		$("#eid_table_body tr:not(.checked)").addClass("checked");
		$("#eid_table_body tr .glyphicon-ok").html("");
		$("#eid_table_body tr .glyphicon-minus").html("yes");
		$(".select-all").removeClass("glyphicon-unchecked");
		$(".select-all").addClass("glyphicon-check");
	}
	else
	{
		$("#eid_table_body .checked .glyphicon-ok").html("no");
		$("#eid_table_body .checked .glyphicon-minus").html("");
		$("#eid_table_body .checked").removeClass("checked");
		$(".select-all").removeClass("glyphicon-check");
		$(".select-all").addClass("glyphicon-unchecked");
	}
}

function eidRowClick(rowid)
{
	var rowNum = rowid.replace("eid_table_body", "");

	if($("#" + rowid).hasClass("checked"))
	{
		$("#"+ rowid).removeClass("checked");
		$("#"+ rowid + " td .glyphicon-ok").html("no");
		$("#"+ rowid + " td .glyphicon-minus").html("");
	}
	else
	{
		$("#"+ rowid).addClass("checked");
		$("#"+ rowid + " td .glyphicon-ok").html("");
		$("#"+ rowid + " td .glyphicon-minus").html("yes");
	}
	$(".tablesorter").trigger("update");
	//var sorting = [[0,0]];
	//$("eid_table").trigger("sorton",[sorting]); 
}

function gatherSpecAttr(array, attrName)
{
	var resultArray = [];
	for(var i = 0; i < array.length; i++)
	{
		resultArray.push(array[i][attrName]);
	}

	return resultArray;
}

function getCopqWbs()
{
	if(copqRecievedWbs.length > 0)
		wbsPopoverBuild();
	else
	{
		if(recievedWbs.length > 0)
		{
			copqRecievedWbs = recievedWbs;
			wbsPopoverBuild();
		}
		else
		{
			utils.get(GET_WBS_LIST, null, function(resp){getCopqWbsSuccess(resp);}, function(){getCopqWbsError();});
		}
	}
}

function getCopqWbsSuccess(response)
{
	$("#copq_main_alert").fadeOut();

	response = response.replace(/\'/g, "\"");
    copqRecievedWbs = $.parseJSON(response);

    wbsPopoverBuild();
}

function getCopqWbsError()
{
	$("#copq_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Cannot get all the WBS. Please try it again.');
	$("#copq_main_alert").fadeIn();
}

function wbsPopoverBuild()
{
	//for test
	//copqRecievedWbs = testWbs;
	//

	var wbsPopoverDiv = document.getElementById("wbs_filter_popover");

	var wbsTreeCopqDiv = createElementTo("div", wbsPopoverDiv);
	wbsTreeCopqDiv.id = "copq_wbs_tree_div";

	var wbsBtnCopqDiv = createElementTo("div", wbsPopoverDiv);
	wbsBtnCopqDiv.id = "copq_wbs_btn_div";
	wbsBtnCopqDiv.setAttribute("style", "margin-top: 15px")

	var copqWbsCancelBtn = createBtn('Cancel', wbsBtnCopqDiv, "btn btn-default", "copq_wbs_tree_cancel_btn", function(){closePopover("wbs_filter_popover");});
	copqWbsCancelBtn.setAttribute("style", "float:left; margin-right: 10px;")
	var copqWbsSaveBtn = createBtn('Save & Search', wbsBtnCopqDiv, "btn btn-primary", "copq_wbs_tree_save_btn", function(){copqWbsSaveBtnClick();});

	var wbsTreeCopq = createElementTo("div", wbsTreeCopqDiv, "proton-demo");
	wbsTreeCopq.id = "copq_wbs_tree";

	//recievedWbs = testWbs;
	var treeData = {
		"text": "All",
		"id" : "wbs_all",
		"children": changeWbsToTreeRelation(copqRecievedWbs, copqWbsFilterList)
	}

	$("#copq_wbs_tree").jstree({
		'plugins': ["checkbox","json_data","themes","ui","sort"],
        'core': {
            'data': treeData,
            'themes': {
                'name': 'proton',
                'responsive': true,
                'icons' :false
            },
            'expand_selected_onload': false
        }
	})

}

function copqWbsSaveBtnClick()
{
	$("#copq_main_alert").fadeOut();

	var allCheckedId = $("#copq_wbs_tree").jstree("get_checked",null,true);	
	if(allCheckedId.length == 0)
	{
		$("#copq_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> You should select at leat 1 WBS.');
		$("#copq_main_alert").fadeIn();
	}
	else
	{
		copqWbsFilterList=[];

		if(!isContain("wbs_all", allCheckedId))
		{
			for(var i = 0; i< allCheckedId.length; i++)
			{
				if(allCheckedId[i].indexOf("wbs_") !== -1)
				{
					var checkedId = allCheckedId[i].replace("wbs_","");
					copqWbsFilterList.push(checkedId);
				}
			}

		}
		else
			copqWbsFilterList=["all"];
		//searchItemValueTableList[0]["Value"] = textToShow(copqWbsFilterList);
		closePopover("wbs_filter_popover");
	}

	var postData =
	{
		"Level 2" : copqWbsFilterList,
		"Phase Pair" : copqTHPhaseList.concat(copqRHPhaseList)
	}

	if(isContain("all", postData["Phase Pair"]))
		postData["Phase Pair"] = ["all"];

	for(var i = 0; i < postData["Phase Pair"].length; i++)
	{
		postData["Phase Pair"][i] = postData["Phase Pair"][i].replace("&", "(and)");
	}

	$("#copq_wbs_tree_save_btn").html("Save & Search " + animateRefreshIcon);

	utils.post(GET_COPQ_SEARCH_RESULT, postData, function(resp){copqWbsSaveBtnClickSuccess(resp)}, function(){copqWbsSaveBtnClickError()});
}

function copqWbsSaveBtnClickSuccess(response)
{
	$("#copq_wbs_tree_save_btn").html("Save & Search ");
	closePopover("wbs_filter_popover");

	response = response.replace(/\'/g, "\"");
    recievedCopq = $.parseJSON(response);

	buildCopqTable();
	updateCopqInfo();
}

function copqWbsSaveBtnClickError()
{
	$("#copq_wbs_tree_save_btn").html("Save & Search ");
	$("#copq_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Search failed! Please try it again.');
	$("#copq_main_alert").fadeIn();
}


function getPhasePair()
{
	if(copqRecievedPhase.length <= 0)
		utils.get(GET_PHASE_PAIR, null, function(resp){getPhasePairSuccess(resp)}, function(){getPhasePairError()});
	else
	{
		if(clickCopqBtn == "total_phase_filter_btn")
    		thPopoverBuild();
    	else
    		rhPopoverBuild();
	}
}

function getPhasePairSuccess(response)
{
	$("#copq_main_alert").fadeOut();

	response = response.replace(/\'/g, "\"");
    copqRecievedPhase = $.parseJSON(response);

    if(clickCopqBtn == "total_phase_filter_btn")
    	thPopoverBuild();
    else
    	rhPopoverBuild();
}

function getPhasePairError()
{
	$("#copq_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Cannot get all the Phase/Sub Phase. Please try it again.');
	$("#copq_main_alert").fadeIn();
}

function thPopoverBuild()
{
	var thPopoverDiv = document.getElementById("th_phase_popover");

	// //for test
	// copqRecievedPhase = testPhase;
	// //

	var thPhaseTreeCopqDiv = createElementTo("div", thPopoverDiv);
	thPhaseTreeCopqDiv.id = "copq_th_phase_tree_div";

	var thPhaseBtnCopqDiv = createElementTo("div", thPopoverDiv);
	thPhaseBtnCopqDiv.id = "copq_th_phase_btn_div";
	thPhaseBtnCopqDiv.setAttribute("style", "margin-top: 15px")

	var thPhaseCancelBtn = createBtn('Cancel', thPhaseBtnCopqDiv, "btn btn-default", "copq_th_phase_tree_cancel_btn", function(){closePopover("th_phase_popover")});
	thPhaseCancelBtn.setAttribute("style", "float:left; margin-right: 10px;")
	var thPhaseSaveBtn = createBtn('Save', thPhaseBtnCopqDiv, "btn btn-primary", "copq_th_phase_tree_save_btn", function(){thPhaseSaveBtnClick()});

	var thPhaseTreeCopq = createElementTo("div", thPhaseTreeCopqDiv, "proton-demo");
	thPhaseTreeCopq.id = "copq_th_phase_tree";

	var treeData = {
		"text": "All",
		"id" : "th_phase_all",
		"children": changePhaseToTreeRelation(copqRecievedPhase, copqTHPhaseList)
	}

	$("#copq_th_phase_tree").jstree({
		'plugins': ["checkbox","json_data","themes","ui","sort"],
        'core': {
            'data': treeData,
            'themes': {
                'name': 'proton',
                'responsive': true,
                'icons' :false
            },
            'expand_selected_onload': false
        }
	})

}

function thPhaseSaveBtnClick()
{
	$("#copq_main_alert").fadeOut();

	var allCheckedId = $("#copq_th_phase_tree").jstree("get_checked",null,true);	
	if(allCheckedId.length == 0)
	{
		$("#copq_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> You should select at leat 1 Phase/Sub Phase.');
		$("#copq_main_alert").fadeIn();
	}
	else
	{
		copqTHPhaseList=[];

		if(!isContain("th_phase_all", allCheckedId))
		{
			for(var i = 0; i< allCheckedId.length; i++)
			{
				if(allCheckedId[i].indexOf("Phase>") !== -1)
				{
					var checkedId = allCheckedId[i];//.replace("wbs_","");
					copqTHPhaseList.push(checkedId);
				}
			}

		}
		else
			copqTHPhaseList=["all"];
		//searchItemValueTableList[0]["Value"] = textToShow(copqTHPhaseList);
		closePopover("th_phase_popover");
	}

	if($("#copq_table").length>0)
		updateCopqInfo();
}

function rhPopoverBuild()
{
	var rhPopoverDiv = document.getElementById("rh_phase_popover");
	// //for test
	// copqRecievedPhase = testPhase;
	// //

	var rhPhaseTreeCopqDiv = createElementTo("div", rhPopoverDiv);
	rhPhaseTreeCopqDiv.id = "copq_rh_phase_tree_div";

	var rhPhaseBtnCopqDiv = createElementTo("div", rhPopoverDiv);
	rhPhaseBtnCopqDiv.id = "copq_rh_phase_btn_div";
	rhPhaseBtnCopqDiv.setAttribute("style", "margin-top: 15px")

	var rhPhaseCancelBtn = createBtn('Cancel', rhPhaseBtnCopqDiv, "btn btn-default", "copq_rh_phase_tree_cancel_btn", function(){closePopover("rh_phase_popover")});
	rhPhaseCancelBtn.setAttribute("style", "float:left; margin-right: 10px;")
	var rhPhaseSaveBtn = createBtn('Save', rhPhaseBtnCopqDiv, "btn btn-primary", "copq_rh_phase_tree_save_btn", function(){rhPhaseSaveBtnClick()});

	var rhPhaseTreeCopq = createElementTo("div", rhPhaseTreeCopqDiv, "proton-demo");
	rhPhaseTreeCopq.id = "copq_rh_phase_tree";

	var treeData = {
		"text": "All",
		"id" : "rh_phase_all",
		"children": changePhaseToTreeRelation(copqRecievedPhase, copqRHPhaseList)
	}

	$("#copq_rh_phase_tree").jstree({
		'plugins': ["checkbox","json_data","themes","ui","sort"],
        'core': {
            'data': treeData,
            'themes': {
                'name': 'proton',
                'responsive': true,
                'icons' :false
            },
            'expand_selected_onload': false
        }
	})
}

function rhPhaseSaveBtnClick()
{
	$("#copq_main_alert").fadeOut();

	var allCheckedId = $("#copq_rh_phase_tree").jstree("get_checked",null,true);	
	// if(allCheckedId.length == 0)
	// {
	// 	$("#copq_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> You should select at leat 1 Phase/Sub Phase.');
	// 	$("#copq_main_alert").fadeIn();
	// }
	// else
	// {
		copqRHPhaseList=[];

		if(!isContain("rh_phase_all", allCheckedId))
		{
			for(var i = 0; i< allCheckedId.length; i++)
			{
				if(allCheckedId[i].indexOf("Phase>") !== -1)
				{
					var checkedId = allCheckedId[i];//.replace("wbs_","");
					copqRHPhaseList.push(checkedId);
				}
			}

		}
		else
			copqRHPhaseList=["all"];
		//searchItemValueTableList[0]["Value"] = textToShow(copqRHPhaseList);
		closePopover("rh_phase_popover");
	// }

	if($("#copq_table").length>0)
		updateCopqInfo();
}

function closePopover(popoverId)
{{
	$("#"+popoverId).parent().parent().popover("hide");
}}

var modalTitleMapping = 
{
	// "project_def_select": "Choose searching WBS(s)",
	// "level_1_wbs_select": "Choose searching level 1 WBS(s)",
	"level_2_wbs_select": "Choose searching WBS(s)",
	"eid_select": "Choose searching EID(s)",
	//"sup_eid_select": "Choose searching Supervisor EID(s)",
	"time_period_select": "Choose searching start/end date"
}

var modalBodyMapping =
{
	"level_2_wbs_select" : function(listModalId){wbsBodyBuilding(listModalId);},
	"eid_select" : function(listModalId){eidBodyBuilding(listModalId);},
	"time_period_select" : function(listModalId){dateBodyBuilding(listModalId);}
}

var saveSelectValueMapping =
{
	"level_2_wbs_select" : function(){wbsSaveValue();},
	"eid_select" : function(){eidSaveValue();},
	"time_period_select" : function(){dateSaveValue();}
}

var getLatestMapping =
{
	"level_2_wbs_select" : function(){wbsGetLatest();},
	"eid_select" : function(){eidGetLatest();},
	"time_period_select" : function(){resetDates();}
}
var modalShowMapping =
{
	"level_2_wbs_select" : function(){wbsShow();},
	"eid_select" : function(){eidShow();},
	"time_period_select" : function(){}
}

var searchItemListHO = 
[
"Search Item",
"Value"
]

var eidTableHO=
[
"isCheck",
"Emp ID",
"Employee Name"
]

var resultTitleList=
[
"Project Def",
"Project Descr",
"Level1 WBS",
"Level1 WBS Descr",
"Level2 WBS",
"Level2 WBS Descr",
"Employee EID",
"Employee Name",
"Phase",
"Sub Phase",
"Date",
"Hours",
"Remarks",
"Supervisor Eid",
"Supervisor Name"
]

var resultBodyHO=
[
"Project Def",
 "Project Description",
 "Level 1 WBS",
 "Level 1 WBS Description",
 "WBS Element",
 "WBS Element Description",
 "Emp ID",
 "Employee Name",
 "Phase",
 "Sub Phase",
 "Work Date",
 "Hours",
 "Remarks",
 "Supervisor Eid",
 "Supervisor name"
 ]

var searchItemValueTableList =
[
{

	"Search Item": "WBS",
	"Value": allAvailable
},
{
	"Search Item": "EID",
	"Value": allAvailable
},
{
	"Search Item": "Date Interval",
	"Value": allAvailable
}
]

var modalIdOrder = 
[
	// "project_def_select",
	// "level_1_wbs_select",
	"level_2_wbs_select",
	"eid_select",
	//"sup_eid_select",
	"time_period_select"
]

var copqTitleList = 
[
"Level2 WBS",
"Level2 WBS Descr",
"Employee Name",
"Phase",
"Sub Phase",
"Date",
"Hours"
]

var copqBodyHO=
[
 "WBS Element",
 "WBS Element Description",
 "Employee Name",
 "Phase",
 "Sub Phase",
 "Work Date",
 "Hours"
 ]

//////////////////////////////////////////////////////////
// Arrays for test
//////////////////////////////////////////////////////////

var testWbs = 
{
"Proj":
[{
	"Project Def": "AE-00000818",
	"Project Description": "CBMCOE_BJ"
},
{
	"Project Def": "AE-00000819",
	"Project Description": "ESEA_BJ"
}, 
{
	"Project Def": "AE-00000820", 
	"Project Description": "CNSCOE_BJ"
}],
"Level 1": 
[{
	"Level 1 WBS": "AE-00000818-005", 
	"Level 1 WBS Description": "CMC"
}, 
{
	"Level 1 WBS": "AE-00000819-002", 
	"Level 1 WBS Description": "Apps Academy"
}, 
{
	"Level 1 WBS": "AE-00000820-026", 
	"Level 1 WBS Description": "B777 BPV 17A"
}],
"Level 2": 
[{
	"WBS Element": "AE-00000818-005-0003", 
	"WBS Element Description": "MTF HTS CHB"
}, 
{
	"WBS Element": "AE-00000819-002-0040",
	"WBS Element Description": "GBAS China in 2014"
}, 
{
	"WBS Element": "AE-00000820-026-0040",
	"WBS Element Description": "Real-Time Embedded Trace"
},
{
	"WBS Element": "AE-00000820-026-0024",
	"WBS Element Description": "FDCF Def SCRs Sys Test Onsite for SQIP"
},
{
	"WBS Element": "AE-00000820-026-0042", 
	"WBS Element Description": "BPV17A RTET for 2015"
}]};

var testEid = 
[
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

var testResult=
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

var testPhase = 
[
{
	"Phase": "CODING",
	"Sub Phase": "CHECK"
},
{
	"Phase": "CODING",
	"Sub Phase": "DO"
},
{
	"Phase": "CODING",
	"Sub Phase": "IMPROVE"
},
{
	"Phase": "CODING",
	"Sub Phase": "PREPARE"
},
{
	"Phase": "CODING",
	"Sub Phase": "REWORK"
},
{
	"Phase": "DESIGN",
	"Sub Phase": "CHECK"
},
{
	"Phase": "DESIGN",
	"Sub Phase": "DO"
},
{
	"Phase": "DESIGN",
	"Sub Phase": "IMPROVE"
},
{
	"Phase": "DESIGN",
	"Sub Phase": "PREPARE"
},
{
	"Phase": "DESIGN",
	"Sub Phase": "REWORK"
},
{
	"Phase": "TRAINING",
	"Sub Phase": "CLASS_ROOM_TRAINING-BEHAVIORAL"
},
{
	"Phase": "TRAINING",
	"Sub Phase": "CLASS_ROOM_TRAINING-BUSINESS_M"
},
{
	"Phase": "TRAINING",
	"Sub Phase": "CLASS_ROOM_TRAINING-COMPLIANCE"
}
]

var testCopq=
[
{
 "WBS Element" : "AE-00000820-026-0042",
 "WBS Element Description" : "BPV17A RTET for 2015",
 "Employee Name" : "Liu Bin",
 "Phase" : "PROJECT_PLAN_&_MANAGEMENT",
 "Sub Phase" : "DO",
 "Work Date" : "24.02.2015",
 "Hours" : "2.00"
},
{
 "WBS Element" : "AE-00000821-026-0042",
 "WBS Element Description" : "BPV17A RTET for 2015",
 "Employee Name" : "Liu Bin",
 "Phase" : "PROJECT_PLAN_&_MANAGEMENT",
 "Sub Phase" : "REWORK",
 "Work Date" : "24.02.2015",
 "Hours" : "8.00"
}]