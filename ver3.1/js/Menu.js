var mainMenuId=
[
  "data_management",
  "account_management",
  "keycode_management",
  "customize_wbs",
  "overview_wbs",
  "status_checking",
  "big_data",
];
var projectmainMenuId=
[
  "account_management",
  "keycode_management",
  "customize_wbs",
  "overview_wbs",
  "status_checking",
  "big_data",
  
];

var adminAccountMenuId=
[
  "new_account",
  "current_accounts",
  "project_manage",
  "change_password"
]

var projectAccountMenuId=
[
  "project_manage",
  "change_password"
]

//////////////////////////////////////////////
// Raymond Modified 2015-6-1
//////////////////////////////////////////////

var customizeWbsNemuId=
[
  "level_1_management",
  "level_2_management"
]

var bigDataMenuId=
[
  "timesheet_hours",
  "copq"
]
//////////////////////////////////////////////

var statusMenuId=
[
  "TimeSheet_Billing",
  "Budget_Usage",
  "Close_Date",
  "On_Off_Site_Status",
  "timesheet_filling"
]

var overviewWbsMenuId=[]
var keycodeManagementMenuId=[]
var dataManagementId=[]
 
var adminSubmenu ={
"data_management":dataManagementId,
"account_management":adminAccountMenuId,
"keycode_management":keycodeManagementMenuId,
"status_checking":statusMenuId,
"customize_wbs":customizeWbsNemuId,
"overview_wbs":overviewWbsMenuId,
"big_data":bigDataMenuId,
}

var projectSubmenu ={
"account_management":projectAccountMenuId,
"keycode_management":keycodeManagementMenuId,
"status_checking":statusMenuId,
"customize_wbs":customizeWbsNemuId,
"overview_wbs":overviewWbsMenuId,
"big_data":bigDataMenuId
}
// new Map();
// adminSubmenu.set("account_management", adminAccountMenuId);
// adminSubmenu.set("status_checking", statusMenuId);

var menuName = {
"data_management": "SAP Data Import",
"account_management": "Account Management",
"keycode_management": "Key Code Management",
"customize_wbs": "Customize WBS",
"overview_wbs": "Overview WBS",
"status_checking": "Status Checking",
"big_data": "Big Data",
"new_account": "New Account",
"current_accounts": "Current Accounts",
"project_manage": "Project Manage",
"change_password": "Change Password",
"TimeSheet_Billing": "TimeSheet Billing", 
"Budget_Usage": "Budget Usage",
"Close_Date": "Close Date",
"On_Off_Site_Status": "On/Off Site Status",
"timesheet_filling": "TimeSheet Filling",
"level_1_management": "Level-1 Management",
"level_2_management": "Level-2 Management",
"timesheet_hours": "Timesheet Hours",
"copq": "COPQ" 
}



function initializeMenu()
{
  if(loginUser.type=="admin")
    var subMenu=adminSubmenu;
  else
    var subMenu=projectSubmenu;
  if (loginUser.type=="admin")
  {
    createMenu(mainMenuId, "#sidebar", "nav nav-sidebar");
    for(var i=0;i< mainMenuId.length;i++)
    {
      if(subMenu[mainMenuId[i]])
      {
        createMenu(subMenu[mainMenuId[i]], "#"+mainMenuId[i], "nav nav-sidebar-2nd")
      }
    } 
  }
    else 
  {
    createMenu(projectmainMenuId, "#sidebar", "nav nav-sidebar");
    for(var i=0;i< projectmainMenuId.length;i++)
    {
      if(subMenu[projectmainMenuId[i]])
      {
      createMenu(subMenu[projectmainMenuId[i]], "#"+projectmainMenuId[i], "nav nav-sidebar-2nd")
      }
    }  
  }


}

function createMenu(menuList, parentId, targetClass)
{
  var targetNode=document.createElement("ul");
  targetNode.style.display="none";
  $(parentId).append(targetNode);
  targetNode.className=targetClass;
  var correctedParentId = parentId.replace("#","");
  targetNode.id=correctedParentId+"_ul";

  for(var i=0;i < menuList.length;i++)
  {
    var id=menuList[i];
    var menuItem=document.createElement("li");
	if ((mainMenuId[i].indexOf(id) > -1)||(projectmainMenuId[i].indexOf(id) > -1))
	{
		menuItem.innerHTML="<a href=\"#\">"+menuName[id]+"</a>";
		menuItem.setAttribute("style", "font-weight:bold;");
		menuItem.id=id;
        targetNode.appendChild(menuItem);
        menuItem.onclick=function(e) 
       {
        consumeBubbleEvent(e);//prevent "bubble click"
        menuOnclickEvent(this);
       };
	}
	else
	{
		menuItem.innerHTML="<a href=\"#\">"+menuName[id]+"</a>";
		menuItem.setAttribute("style", "font-weight:normal;")
		menuItem.id=id;
        targetNode.appendChild(menuItem);
        menuItem.onclick=function(e) 
       {
        consumeBubbleEvent(e);//prevent "bubble click"
        menuOnclickEvent(this);
       };
	}   
  }

  if(targetClass=="nav nav-sidebar")
    $("#"+targetNode.id).show();
}

function menuOnclickEvent(obj)
{

    if(!activeMenuId)
    {
      activateMenu(obj);
    }
    else
    {
      deactivateMenu(activeMenuId);
      activateMenu(obj);
    }

}

function activateMenu(obj)
{
  switchMainTo(obj.id);
  activeMenuId=obj.id;
  obj.className="active";
  if($("#"+obj.id+"_ul"))
    $("#"+obj.id+"_ul").slideToggle("fast");
}

function deactivateMenu(menuId)
{
  $("#"+menuId).removeClass("active");
}


