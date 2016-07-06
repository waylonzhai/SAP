var filterStatus1 = false;
var lv1FilterContent = [];
var needTableSorter1 = true;
var customerWidget = ["uitheme", "group"];
var filterStatus = false;
var lv2FilterContent = [];
var needTableSorter = true;

function level2ManegementFunct()
{
  var level2Main = addMainContainer("level_2_management", "div");

  addHeaderForMain(level2Main,"Level-2 Management");

  initialAlert(level2Main);

  // var addProjBtn = createBtn('Refresh', level2Main, "btn btn-success", "refresh_level_2_btn", function(){refreshLevel2Click();}); 
  // $("#refresh_level_2_btn").css("margin-bottom", "3px");

  var addProjBtn = createBtn('Enable Filter', level2Main, "btn btn-primary", "filter_switch_btn", function(){filterSwitchClick();}); 
  $("#filter_switch_btn").css("margin-left", "10px");
  $("#filter_switch_btn").css("margin-bottom", "3px");
  
  //表太宽，在他的class最后增加table-overwide

  var level2TableDiv = createElementTo("div", level2Main, "table-responsive table-overwide");
  level2TableDiv.id = "level_2_list_div";
  
  tableHeight=$(window).height()-$("#navbar").height()- $(".page-header").outerHeight(true)-75;
  $("#level_2_list_div").css("height",tableHeight+"px");
  $("#level_2_list_div").css("overflow-y", "auto");
  

  var level2List = createElementTo("table", level2TableDiv, "table table-bordered");
  level2List.id = "level_2_table";
  $("#level_2_table").css("margin-left", "10px");
  $("#level_2_table").css("width", "80%");
  $("#level_2_table").css("margin-top", "10px");

  var level2ListHead = createTableHead(level2WbsListHead, "level_2_table");
  formTable(level2ListHead, null, "level_2_table");

  for(var i = 0; i< $("#level_2_table_head tr th").length; i++)
  {
  	var _ths = $("#level_2_table_head tr th")[i];
  	if(_ths.innerHTML == "Active Status")
  		_ths.className = "group-word";
  	else
  		_ths.className = "group-false";
  }
  var level2BodyItem = copyObj(testLevel2);

  $("#level_2_management").click(function(){refreshLevel2Click();});
  refreshLevel2Click();
}

function refreshLevel2Click()
{
	$("#level_2_management_main_alert").fadeOut();
	//$("#refresh_level_2_btn").html('Refresh' + animateRefreshIcon);
	utils.get(CUSTOMIZE_REFRESH_LEVEL_2, "eid=" + loginUser.eid, function(resp){refreshLevel2ClickSuccess(resp);}, function() {refreshLevel2ClickError();});
	disableCursorInTable();
}

function refreshLevel2ClickSuccess(response)
{
	response = response.replace(/\'/g, "\"");
    recievedList = $.parseJSON(response);
    level2BodyItem = copyObj(recievedList);

    rebuildLevel2Table(level2BodyItem);
    //$("#refresh_level_2_btn").html('Refresh');
    enableCursorInTable();
}

function refreshLevel2ClickError()
{
    //$("#refresh_level_2_btn").html('Refresh');
    $("#level_2_management_main_alert").html(' <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Refresh level-2 WBS table failed!')
    $("#level_2_management_main_alert").fadeIn();
    enableCursorInTable();
}

function disableCursorInTable()
{
	//$(".actStatus span").addClass("disabled-active");
}

function enableCursorInTable()
{
	//$(".actStatus span").removeClass("disabled-active");
}


function rebuildLevel2Table(bodyItem)
{
  if($("#level_2_table").length > 0)
  {
      recordLv2FilterContent();
      $("#level_2_table").remove();
  }

  var level2List = createElementTo("table", document.getElementById("level_2_list_div"), "table table-bordered");
  level2List.id = "level_2_table";
  $("#level_2_table").css("margin-left", "10px");
  $("#level_2_table").css("width", "80%");
  $("#level_2_table").css("margin-top", "10px");

  var level2ListHead = createTableHead(level2WbsListHead, "level_2_table");
  formTable(level2ListHead, null, "level_2_table");
  var level2ListBody = createTableBody(bodyItem, "level_2_table", level2HO)
  formTable(document.getElementById("level_2_table_head"), level2ListBody, "level_2_table");

  for(var i = 0; i< $("#level_2_table_head tr th").length; i++)
  {
  	var _ths = $("#level_2_table_head tr th")[i];
  	if(_ths.innerHTML == "Active Status")
  		_ths.className = "group-word";
  	else
  		_ths.className = "group-false";
  }
  
  addEditActiveBtn("level_2_table");
  tableSorterGroup("level_2_table", 9);
  
  $.tablesorter.setFilters( $("#level_2_table"), lv2FilterContent, true);
  $("#level_2_table").trigger('search', lv2FilterContent);

  reformTableStyle("level_2_table");
  fillLv2FilterContent();
}

function recordLv2FilterContent()
{
	lv2FilterContent = [];
	var _filterInputs = $("#level_2_table_head .tablesorter-filter-row td input");
	for (var i = 0; i < _filterInputs.length; i++)
	{
		lv2FilterContent.push(_filterInputs[i].value);
	}
}

function fillLv2FilterContent()
{
	var _filterInputs = $("#level_2_table_head .tablesorter-filter-row td input");
	for (var i = 0; i < _filterInputs.length; i++)
	{
		if(lv2FilterContent[i])
			_filterInputs[i].value = lv2FilterContent[i];
	}
}

function addEditActiveBtn(tableId)
{
	$("#" + tableId + "_body tr td:first-child").addClass("actStatus");
	for(var i = 0; i < $(".actStatus").length; i++)
	{
		var _td = $(".actStatus")[i];
		_td.id = "act_status_" + i;
		if(_td.innerHTML == "Active")
		{
			$("#" + _td.id).addClass("status-active");
		}
		else
		{
			$("#" + _td.id).addClass("status-deactive");
		}
		if(_td.innerHTML.indexOf("</span>") < 0)
			_td.innerHTML = "<span></span>" + _td.innerHTML;
	}
}

function ActStatusClick(rowId)
{
	$("#level_2_management_main_alert").fadeOut();
	var selectedWBSNum = $("#" + rowId + " td:nth-child(6)").html();
	postData =
	{
		"Eid": loginUser.eid,
		"HTS Assigned WBS": selectedWBSNum
	}
	utils.post(ACTIVATE_LEVEL_2, postData, function() {ActStatusClickSuccess();}, function() {ActStatusClickError();});
}

function ActStatusClickSuccess()
{
	refreshLevel2Click();
}

function ActStatusClickError()
{
	$("#level_2_management_main_alert").html(' <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Activate this WBS failed!')
    $("#level_2_management_main_alert").fadeIn();
}


function DeactStatusClick(rowId)
{
	$("#level_2_management_main_alert").fadeOut();
	var selectedWBSNum = $("#" + rowId + " td:nth-child(6)").html();
	postData =
	{
		"Eid": loginUser.eid,
		"HTS Assigned WBS": selectedWBSNum
	}
	utils.post(DEACTIVATE_LEVEL_2, postData, function() {DeactStatusClickSuccess();}, function() {DeactStatusClickError();});
}

function DeactStatusClickSuccess()
{
	refreshLevel2Click();
}

function DeactStatusClickError()
{
	$("#level_2_management_main_alert").html(' <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Deactivate this WBS failed!')
    $("#level_2_management_main_alert").fadeIn();
}

function reformTableStyle(tableId)
{
	$("#" + tableId + " .status-active span").addClass("glyphicon glyphicon-arrow-down");
	$("#" + tableId + " .status-active span").css("color", "#009900");
	$("#" + tableId + " .status-active span").css("font-size", "16px");
	$("#" + tableId + " .status-active span").attr("data-hover", "tooltip");
	$("#" + tableId + " .status-active span").attr("data-placement", "top");
	$("#" + tableId + " .status-active span").attr("title", "Deactivate this WBS");
	$("#" + tableId + " .status-active span").attr("href", "#");

	$("#" + tableId + " .status-deactive span").addClass("glyphicon glyphicon-arrow-up");
	$("#" + tableId + " .status-deactive span").css("color", "#FF3300");
	$("#" + tableId + " .status-deactive span").css("font-size", "16px");
	$("#" + tableId + " .status-deactive span").attr("data-hover", "tooltip");
	$("#" + tableId + " .status-deactive span").attr("data-placement", "top");
	$("#" + tableId + " .status-deactive span").attr("title", "Activate this WBS");
	$("#" + tableId + " .status-deactive span").attr("href", "#");

	$("#" + tableId + " .status-active span").click(function(){DeactStatusClick(this.parentNode.parentNode.id);})
	$("#" + tableId + " .status-deactive span").click(function(){ActStatusClick(this.parentNode.parentNode.id);})

	$("#level_2_table_head input").attr("placeholder", 'Filter...');

    if($("#level_2_table").height()>tableHeight)
    {
    	$("#level_2_list_div").css("border-width", "1px");
        $("#level_2_list_div").css("border-color", "#B2B2B2");
	    $("#level_2_list_div").css("border-style", "solid");
	}
	else
	  	$("#level_2_list_div").css("border-style", "none");

}

function filterSwitchClick()
{
	if(!filterStatus)
	{
		customerWidget.push("filter");
		rebuildLevel2Table(level2BodyItem);
		filterStatus = true;
		$("#filter_switch_btn").html("Disable Filter");

	}
	else
	{
		customerWidget = ["uitheme", "group"];
		rebuildLevel2Table(level2BodyItem);
		filterStatus = false;
		$("#filter_switch_btn").html("Enable Filter");
	}
}

function addPager(tableId, colNum)
{
	var _tablefooter = createElementTo("tfoot", document.getElementById(tableId));
	_tablefooter.id = "account_list_footer";
	$("#" + tableId + "_head").after(_tablefooter);
	var _tablePager = createElementTo("tr", _tablefooter);
	_tablePager.id = "account_list_pager";
	_tablePager.innerHTML = '<th colspan="' + colNum + '" class="ts-pager form-horizontal"><button type="button" class="btn first"><i class="icon-step-backward glyphicon glyphicon-step-backward"></i></button><button type="button" class="btn prev"><i class="icon-arrow-left glyphicon glyphicon-backward"></i></button><span class="pagedisplay"></span> <!-- this can be any element, including an input --><button type="button" class="btn next"><i class="icon-arrow-right glyphicon glyphicon-forward"></i></button><button type="button" class="btn last"><i class="icon-step-forward glyphicon glyphicon-step-forward"></i></button><select class="pagesize input-mini" title="Select page size"><option selected="selected" value="10">10</option><option value="20">20</option><option value="30">30</option><option value="40">40</option></select><select class="pagenum input-mini" title="Select page number"></select></th>';

}

function deletePager()
{
	$("#account_list_pager").remove();
	$("#account_list_footer").remove();
}

function tableSorterGroup(tableId, colNum)
{
	addPager(tableId, colNum);
	
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

	  sortList : [[0,0]],

	  widthFixed: true,

	  headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

	  // widget code contained in the jquery.tablesorter.widgets.js file
	  // use the zebra stripe widget if you plan on hiding any rows (filter widget)
	  widgets : customerWidget,//, "zebra" ],

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
        filter_external   : ".tablesorter-filter",
        filter_saveFilters : true,
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
}

function level1managementFunct() 
{
  var level1Main = addMainContainer("level_1_management", "div");
  addHeaderForMain(level1Main,"Level-1 Management");
  initialAlert(level1Main);

  // var addProjBtn = createBtn('Refresh', level1Main, "btn btn-success", "refresh_level_1_btn", function(){refreshLevel1Click();}); 
  // $("#refresh_level_1_btn").css("margin-bottom", "3px");

  var addProjBtn = createBtn('Enable Filter', level1Main, "btn btn-primary", "filter_switch_1_btn", function(){filterSwitch1Click();}); 
  $("#filter_switch_1_btn").css("margin-left", "10px");
  $("#filter_switch_1_btn").css("margin-bottom", "3px");

  var level1TableDiv = createElementTo("div", level1Main, "table-responsive table-overwide");
  level1TableDiv.id = "level_1_list_div"; 
  tableHeight1=$(window).height()-$("#navbar").height()- $(".page-header").outerHeight(true)-75;
  $("#level_1_list_div").css("height",tableHeight1+"px");
  $("#level_1_list_div").css("overflow-y", "auto");
  
  var level1List = createElementTo("table", level1TableDiv, "table table-bordered");
  level1List.id = "level_1_table";
  $("#level_1_table").css("margin-left", "10px");
  $("#level_1_table").css("width", "80%");
  $("#level_1_table").css("margin-top", "10px");

  var level1ListHead = createTableHead(level1WbsListHead, "level_1_table");
  formTable(level1ListHead, null, "level_1_table");

  for(var i = 0; i< $("#level_1_table_head tr th").length; i++)
  {
  	var _ths = $("#level_1_table_head tr th")[i];
  	if(_ths.innerHTML == "Active Status")
  		_ths.className = "group-word";
  	else
  		_ths.className = "group-false";
  }
  $("#level_1_management").click(function(){refreshLevel1Click();});
  //var level1BodyItem = copyObj(testLevel2);
  refreshLevel1Click();
}

function refreshLevel1Click()
{
	$("#level_1_management_main_alert").fadeOut();
	//$("#refresh_level_1_btn").html('Refresh' + animateRefreshIcon);
	utils.get(CUSTOMIZE_REFRESH_LEVEL_1, "eid=" + loginUser.eid, function(resp){refreshLevel1ClickSuccess(resp);}, function() {refreshLevel1ClickError();});
}

function refreshLevel1ClickSuccess(response)
{
	response = response.replace(/\'/g, "\"");
    recievedList1 = $.parseJSON(response);
    level1BodyItem = copyObj(recievedList1);

    rebuildLevel1Table(level1BodyItem);
    //$("#refresh_level_1_btn").html('Refresh');
}

function refreshLevel1ClickError()
{
    //$("#refresh_level_1_btn").html('Refresh');
    $("#level_1_management_main_alert").html(' <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Refresh level-1 WBS table failed!')
    $("#level_1_management_main_alert").fadeIn();
}

function filterSwitch1Click()
{
	if(!filterStatus)
	{
		customerWidget.push("filter");
		rebuildLevel1Table(level1BodyItem);
		filterStatus = true;
		$("#filter_switch_1_btn").html("Disable Filter");
	}
	else
	{
		customerWidget = ["uitheme", "group"];
		rebuildLevel1Table(level1BodyItem);
		filterStatus = false;
		$("#filter_switch_1_btn").html("Enable Filter");
	}
}

function rebuildLevel1Table(bodyItem)
{
  if($("#level_1_table").length > 0)
  {
      recordLv1FilterContent();
      $("#level_1_table").remove();
  }

  var level1List = createElementTo("table", document.getElementById("level_1_list_div"), "table table-bordered");
  level1List.id = "level_1_table";
  $("#level_1_table").css("margin-left", "10px");
  $("#level_1_table").css("width", "80%");
  $("#level_1_table").css("margin-top", "10px");

  var level1ListHead = createTableHead(level1WbsListHead, "level_1_table");
  formTable(level1ListHead, null, "level_1_table");
  var level1ListBody = createTableBody(bodyItem, "level_1_table", level1HO)
  formTable(document.getElementById("level_1_table_head"), level1ListBody, "level_1_table");

  for(var i = 0; i< $("#level_1_table_head tr th").length; i++)
  {
  	var _ths = $("#level_1_table_head tr th")[i];
  	if(_ths.innerHTML == "Active Status")
  		_ths.className = "group-word";
  	else
  		_ths.className = "group-false";
  }
  
  addEditActiveBtn("level_1_table");
  tableSorterGroup("level_1_table", 2);

  $.tablesorter.setFilters( $("#level_1_table"), lv1FilterContent, true);
  $("#level_1_table").trigger('search', lv1FilterContent);

  reformTableStyle1("level_1_table");
  fillLv1FilterContent();
}

function recordLv1FilterContent()
{
	lv1FilterContent = [];
	var _filterInputs = $("#level_1_table_head .tablesorter-filter-row td input");
	for (var i = 0; i < _filterInputs.length; i++)
	{
		lv1FilterContent.push(_filterInputs[i].value);
	}
}

function fillLv1FilterContent()
{
	var _filterInputs = $("#level_1_table_head .tablesorter-filter-row td input");
	for (var i = 0; i < _filterInputs.length; i++)
	{
		if(lv1FilterContent[i])
			_filterInputs[i].value = lv1FilterContent[i];
	}
}

function reformTableStyle1(tableId)
{
	$("#" + tableId + " .status-active span").addClass("glyphicon glyphicon-arrow-down");
	$("#" + tableId + " .status-active span").css("color", "#009900");
	$("#" + tableId + " .status-active span").css("font-size", "16px");
	$("#" + tableId + " .status-active span").attr("data-hover", "tooltip");
	$("#" + tableId + " .status-active span").attr("data-placement", "top");
	$("#" + tableId + " .status-active span").attr("title", "Deactivate this WBS");
	$("#" + tableId + " .status-active span").attr("href", "#");

	$("#" + tableId + " .status-deactive span").addClass("glyphicon glyphicon-arrow-up");
	$("#" + tableId + " .status-deactive span").css("color", "#FF3300");
	$("#" + tableId + " .status-deactive span").css("font-size", "16px");
	$("#" + tableId + " .status-deactive span").attr("data-hover", "tooltip");
	$("#" + tableId + " .status-deactive span").attr("data-placement", "top");
	$("#" + tableId + " .status-deactive span").attr("title", "Activate this WBS");
	$("#" + tableId + " .status-deactive span").attr("href", "#");

	$("#" + tableId + " .status-active span").click(function(){DeactStatusClick1(this.parentNode.parentNode.id);})
	$("#" + tableId + " .status-deactive span").click(function(){ActStatusClick1(this.parentNode.parentNode.id);})
    var _trs = $("#" + tableId + "_body [role='row']");
	$("#level_1_table_head input").attr("placeholder", 'Filter...');

	
    if($("#level_1_table").height()>tableHeight1)
    {
    	$("#level_1_list_div").css("border-width", "1px");
        $("#level_1_list_div").css("border-color", "#B2B2B2");
	    $("#level_1_list_div").css("border-style", "solid");
	}
	else
	  	$("#level_1_list_div").css("border-style", "none");
}

function ActStatusClick1(rowId)
{
	$("#level_1_management_main_alert").fadeOut();
	var selectedWBSNum = $("#" + rowId + " td:nth-child(2)").html();
	postData =
	{
		"Eid": loginUser.eid,
		"HTS Assigned WBS": selectedWBSNum
	}
	utils.post(ACTIVATE_LEVEL_1, postData, function() {ActStatusClick1Success();}, function() {ActStatusClick1Error();});
}

function ActStatusClick1Success()
{
	refreshLevel1Click();
}

function ActStatusClick1Error()
{
	$("#level_1_management_main_alert").html(' <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Activate this WBS failed!')
    $("#level_1_management_main_alert").fadeIn();
}

function DeactStatusClick1(rowId)
{
	$("#level_1_management_main_alert").fadeOut();
	var selectedWBSNum = $("#" + rowId + " td:nth-child(2)").html();
	postData =
	{
		"Eid": loginUser.eid,
		"HTS Assigned WBS": selectedWBSNum
	}
	utils.post(DEACTIVATE_LEVEL_1, postData, function() {DeactStatusClick1Success();}, function() {DeactStatusClick1Error();});
}

function DeactStatusClick1Success()
{
	refreshLevel1Click();
}

function DeactStatusClick1Error()
{
	$("#level_1_management_main_alert").html(' <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Deactivate this WBS failed!')
    $("#level_1_management_main_alert").fadeIn();
}

level1WbsListHead =
[
"Active Status",
"Level 1 WBS"
]

level1HO = 
[
"Active Status",
"HTS Assigned WBS"
]

level2WbsListHead =
[
"Active Status",
"Network Num",
"Activity Num",
"Key Code",
"Owner",
"Level 2 WBS",
"L2 WBS Description",
"System Status",
"User Status"
]

testLevel2 = 
[
{
	"Active Status" : "Active",
	"Aero Network": "7011327162",
	"Aero Activity Num" : "0040",
	"Aero Key Code" : "24055",
	"WBS Person Responsible" : "Liu Peng",
	"HTS Assigned WBS" : "AE-00000820-021-0015",
	"HTS WBS Description" : "CNS Software China DEV",
	"System Status" : "REL ACPT",
	"User Status" : "FIU"
},
{
	"Active Status" : "Active",
	"Aero Network": "7011327161",
	"Aero Activity Num" : "0040",
	"Aero Key Code" : "24055",
	"WBS Person Responsible" : "Liu Peng",
	"HTS Assigned WBS" : "AE-00000820-021-0014",
	"HTS WBS Description" : "CNS Software China LOE",
	"System Status" : "REL ACPT",
	"User Status" : "WHTEVER"
},
{
	"Active Status" : "Deactive",
	"Aero Network": "7011327161-CPY",
	"Aero Activity Num" : "0040",
	"Aero Key Code" : "24055",
	"WBS Person Responsible" : "Liu Peng",
	"HTS Assigned WBS" : "AE-00000820-021-0014",
	"HTS WBS Description" : "CNS Software China LOE",
	"System Status" : "REL ACPT",
	"User Status" : "FIU  CLSE"
}
]