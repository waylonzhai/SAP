var createFunct = {
"new_account": function(){newAccountFunct()},
"current_accounts": function(){currentAccountsFunct()},
"project_manage" : function(){projMngFunct()},
"change_password" : function(){changePwdFunct()},
"keycode_management": function(){keycodeManagementFunct()},
"level_1_management" : function(){level1managementFunct()},
"level_2_management" : function(){level2ManegementFunct()},
"timesheet_hours" : function(){timesheetHoursFunct()},
"copq" : function(){copqFunct()},
"Budget_Usage": function(){budgetUsageFunct()},
"Close_Date": function(){closeDateFunct()},
"timesheet_filling": function(){timesheetfillingFunct()},
"TimeSheet_Billing": function(){timeSheetBillingFunct()},
"On_Off_Site_Status": function(){onOffSiteStateFunct()},
"overview_wbs": function(){overviewWbsBuildFunct()},
"developer_demo": function(){developerDemo()},
"data_management": function(){dataManagementFunct()}
}


function addHeaderForMain(parentNode, headerText)
{
	var _header = createElementTo("h1", parentNode, "page-header");
	if(parentNode.id)
		_header.id = parentNode.id + "_header";
	_header.innerHTML=headerText;
}

function addMainContainer(functId, containerType, containerClass)
{
  var _newContainer = createElementTo(containerType, null, containerClass); 
  _newContainer.id=functId+"_main";
  $("#main").append(_newContainer);

  return _newContainer;
}
