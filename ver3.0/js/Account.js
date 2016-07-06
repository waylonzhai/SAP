var totalUserNb = "N/A";
var currentUserId = "N/A";
var currentUserLinks = [];
var currentUserList = [];// copyObj(testCurrentList);
var currentProjectList = [];// copyObj(testProjectList);
var currentProjectIndex = "";
var selectedProject = [];
var recievedPhase = [];
var PhaseList =["all"];


function newAccountFunct()
{
  
  var newAccountForm = addMainContainer("new_account", "form", "form-horizontal");

  addHeaderForMain(newAccountForm, "New Project Account");

  initialAlert(newAccountForm);
  $("#new_account_main_alert").attr("id", "new_account_main_alert_success");
  $("#new_account_main_alert_success").removeClass("alert-danger");
  $("#new_account_main_alert_success").addClass("alert-success");
  initialAlert(newAccountForm);

  newInputArea(newAccountForm, "user_eid", "Account EID:", "username","text", 
  	"Please insert login name for new account.</br><b>Attention:</b> Default password is EID with CAPITAL letters.");
  //newInputArea(newAccountForm, "input_password", "Password", "userpassword", "password", "Please insert password for new account.");
  //newInputArea(newAccountForm, "input_comfirm_password", "Confirm Password", "confirmpassword", "password", "Please confirm your password.");

  newInputArea(newAccountForm, "display_name", "Outlook Display Name:", "displayname", "text", ""/*'Click "Generate" button to get the Outlook display name of the input EID.'*/)
  //$("#display_name_input").css("float", "left");
  var generateBtn = createBtn("Generate", null, "btn btn-default", "generate_button", function(){generateBtnClick();});
  generateBtn.setAttribute("style","margin-left: 5px");
  $("#display_name_input").after(generateBtn);
  $("#generate_button").hide();

  newInputArea(newAccountForm, "submit", "", "dummy", "dummy", "");
  $("#submit_input").remove();
  $("#submit_help").remove();
  var submitBtn = createBtn("Submit", null, "btn btn-primary", "submit_button", function(){submitBtnClick();});
  $("#submit_controls").append(submitBtn);

  $("#new_account").click( function(){
    $("#new_account_main_alert_success").fadeOut();
    $("#new_account_main_alert").fadeOut();
  });
}

function currentAccountsFunct()
{
  var currentAccountsMain = addMainContainer("current_accounts", "div");

  addHeaderForMain(currentAccountsMain,"Current Accounts List");

  initialAlert(currentAccountsMain);
  
  var tableDiv = createElementTo("div", currentAccountsMain, "table-responsive");
  tableDiv.id = "current_list_div";

  var textBox = createElementTo("div", tableDiv);

  var generalText = createElementTo("p", textBox);
  generalText.innerHTML = "Current user number: " + totalUserNb;
  generalText.id = "current_list_general_text";
  $("#current_list_general_text").css("display", "inline");
  $("#current_list_general_text").css("padding-top", "8px");

  // var refreshListBtn = createBtn("Refresh", textBox, "btn btn-success", "current_refresh_btn", function(){refreshBtnClick()});
  // refreshListBtn.setAttribute("style","margin-left: 10px");

  var tableInDiv = createElementTo("div", tableDiv);
  tableInDiv.id = "table_in_div";

  var accountList = createElementTo("table", tableInDiv, "table table-bordered table-striped");
  accountList.id = "account_list_table";
  $("#account_list_table").css("float", "left");
  $("#account_list_table").css("width", "80%");
  $("#account_list_table").css("margin-top", "10px");
  //$("#account_list_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");

  var accountListHead = createTableHead(currentListHead, "account_list_table");

  formTable(accountListHead, null, "account_list_table");

  createPlModal(currentAccountsMain);
  createResetModal(currentAccountsMain);
  createRemoveModal(currentAccountsMain);
  
  refreshBtnClick();
  $("#current_accounts").click(function(){refreshBtnClick();});
  //for test part, use the following order to generate a local list.
  //generateCurrentListBody(currentUserList);

}

function projMngFunct()
{
  var projMngMain = addMainContainer("project_manage", "div");

  addHeaderForMain(projMngMain,"Project Manage");

  initialAlert(projMngMain);
  
  var projectMngDiv = createElementTo("div", projMngMain, "table-responsive");
  projectMngDiv.id = "proj_mng_list_div";

  var bthBox = createElementTo("div", projectMngDiv);

  //var refreshProjBtn = createBtn('Refresh', bthBox, "btn btn-success", "add_project_btn", function(){refreshProjectList();});

   if(loginUser.type=="admin")
   {
  var addProjBtn = createBtn('<span class="glyphicon glyphicon-plus"></span> Add', bthBox, "btn btn-warning", "add_project_btn");
  //addProjBtn.setAttribute("style", "margin-left:10px;");  
  addProjBtn.setAttribute("data-toggle","modal");
  addProjBtn.setAttribute("data-target","#pm_add_modal");

  var editProjBtn = createBtn('<span class="glyphicon glyphicon-edit"></span> Edit', bthBox, "btn btn-warning", "edit_project_btn", function(){});
  editProjBtn.setAttribute("style", "margin-left:10px;");
  editProjBtn.setAttribute("data-toggle","modal");
  editProjBtn.setAttribute("data-target","#pm_edit_modal");
  $("#edit_project_btn").prop("disabled", true);

  var removeProjBtn = createBtn('<span class="glyphicon glyphicon-remove"></span> Remove', bthBox, "btn btn-danger", "remove_project_btn", function(){});
  removeProjBtn.setAttribute("style", "margin-left:10px;");
  removeProjBtn.setAttribute("data-toggle","modal");
  removeProjBtn.setAttribute("data-target","#pm_remove_modal");
  $("#remove_project_btn").prop("disabled", true);
   }
 

  var PhaseMngBtn = createBtn('<span class="glyphicon glyphicon-edit"></span> Phase Management', bthBox, "btn btn-primary", "phase_management_btn", function(){phaseMngGetLatest(this.id)});
  PhaseMngBtn.setAttribute("style", "margin-left:10px;");
  PhaseMngBtn.setAttribute("data-toggle","modal");
  PhaseMngBtn.setAttribute("data-target","#pm_phase_mng_modal");
  $("#phase_management_btn").prop("disabled", true);
  
  
  var projectList = createElementTo("table", projectMngDiv, "table table-bordered table-hover");
  projectList.id = "project_manage_list_table";
  $("#project_manage_list_table").css("float", "left");
  $("#project_manage_list_table").css("width", "40%");
  $("#project_manage_list_table").css("margin-top", "10px");
  //$("#project_manage_list_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");

  var accountListHead = createTableHead(["Project Definition", "Project Description"], "project_manage_list_table");

  formTable(accountListHead, null, "project_manage_list_table");

   if(loginUser.type=="admin")
   {
	 createPmAddModal(projMngMain);
     createPmEditModal(projMngMain);
     createPmRemoveModal(projMngMain);  
   }
  
  createPmPhaseMngModal(projMngMain);

  refreshProjectList();
  //For loccal test
  //refreshProjectListSuccess();
  $("#project_manage").click(function(){refreshProjectList();});
}


function createPmPhaseMngModal(parentNode)
{
  //create modal for add project
  var pmPhaseMngModal = createElementTo("div", parentNode, "modal fade");
  pmPhaseMngModal.id = "pm_phase_mng_modal";
  pmPhaseMngModal.setAttribute("tabindex","-1");
  pmPhaseMngModal.setAttribute("role","dialog");
  pmPhaseMngModal.setAttribute("aria-hidden", "true");
  pmPhaseMngModal.setAttribute("data-backdrop", "static");
  initializeModal(pmPhaseMngModal, "Phase/Sub Phase Management");

  initialAlert(document.getElementById("pm_phase_mng_modal_body"));
  var pmPhaseMngModalBody = document.getElementById("pm_phase_mng_modal_body");
  
  var pmPhaseMngModalFooter = document.getElementById("pm_phase_mng_modal_footer");
  

  //$(#"pm_phase_mng_modal").on("show.bs.modal", function(){pmPhaseMngModalShow();});
  
  var PhaseMngcancelBtn = createBtn("Cancel", pmPhaseMngModalFooter, "btn btn-default");
	  PhaseMngcancelBtn.setAttribute("data-dismiss", "modal");
	  
  var PhaseMngsaveBtn = createBtn("Save", pmPhaseMngModalFooter, "btn btn-primary", "pm_phase_mng_modal_save_button", function(){phaseSaveBtnClick(selectedProject.definition)});
  
  phaseMngBodyBuilding("pm_phase_mng_modal");
  
}

function phaseMngBodyBuilding(listModalId)
{
	var phaseMngBody = document.getElementById(listModalId + "_body");
	var phaseMngBodyContainer = createElementTo("div", phaseMngBody);
	phaseMngBodyContainer.id = phaseMngBody.id + "_div";

	//if(recievedPhase.length <= 0)
		//phaseMngGetLatest();

}

function phaseMngGetLatest(currentProjectIndex)
{
	$("#pm_phase_mng_modal_body_alert").fadeOut();
	$("#pm_phase_mng_modal_refresh_button").html('Get Phase/SubPhase ' + animateRefreshIcon);

	//refreshPhaseTree();

	utils.get(PM_PHASEMNG_GET, "ProjectID="+selectedProject.definition, function(resp){phaseMngGetLatestSuccess(resp);},function(){phaseMngGetLatestError();});
}

function phaseMngGetLatestSuccess(response)
{
	$("#pm_phase_mng_modal_refresh_button").html('Get Phase/SubPhase');
	response = response.replace(/\'/g, "\"");
    recievedPhase = $.parseJSON(response);

    refreshPhaseTree();

}

function phaseMngGetLatestError()
{
	$("#pm_phase_mng_modal_refresh_button").html('Get Phase/SubPhase');
	$("#pm_phase_mng_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Get latest Phase/Sub Phase failed');
	$("#pm_phase_mng_modal_body_alert").fadeIn();
}

function refreshPhaseTree()
{
	if($("#phase_tree").length>0)
		$("#phase_tree").remove();

	var phaseTreeDiv = createElementTo("div", document.getElementById("pm_phase_mng_modal_body_div"), "proton-demo");
	phaseTreeDiv.id = "phase_tree";
	
	////test
	//recievedPhase = testPhase2;
	
	var treeData = {
		"text": "All",
		"id" : "phase_all",
		"children": changePhaseToTree(recievedPhase, PhaseList)
	}

	$("#phase_tree").jstree({
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
	//$("#phase_tree").bind('loaded.jstree', function(e, data) {
    // invoked after jstree has loaded
    //$(this).jstree("close_all")
}


function changePhaseToTree(TargetArray, SelectedList)
{
	var treeList = [];
	var phaseList = [];

	for (var i =0; i < TargetArray.length; i++)
	{
		var _pair = TargetArray[i];
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
			if((isContain(newSubPhase["id"],SelectedList) || isContain("all", SelectedList)))
			{
				var _status = {};
				if (_pair["Status"]=="true")
				{_status["selected"] = true}
				else
				{_status["selected"] = false}
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
			if((isContain(newSubPhase["id"],SelectedList) || isContain("all", SelectedList)))
			{
				var _status = {};
				if (_pair["Status"]=="true")
				{_status["selected"] = true}
				else
				{_status["selected"] = false}
				newSubPhase["state"] = _status;
			}
		}
	}

	return treeList;
}


function phaseSaveBtnClick(item)
{
	$("#phase_main_alert").fadeOut('Save' + animateRefreshIcon);
	$("#pm_phase_mng_modal_save_button").html('Save');
	var allCheckedId = $("#phase_tree").jstree("get_checked",null,true);

	var targetArray =[];
	
	var SubArray = {};
	var PhaseInfor = "";
	var index = 0;
	for(var i = 0; i< allCheckedId.length; i++)
	{
		if (allCheckedId[i].indexOf(">SubPhase>") !== -1)
			{  
		        if(index != 0)
					PhaseInfor = PhaseInfor + "!"
				PhaseInfor = PhaseInfor + "Phase*";
				var Phasetext = allCheckedId[i].substring(allCheckedId[i].indexOf(">")+1,allCheckedId[i].indexOf(">SubPhase>"));
				var SubPhasetext = allCheckedId[i].substring(allCheckedId[i].lastIndexOf(">")+1);
				PhaseInfor = PhaseInfor + Phasetext;
				PhaseInfor = PhaseInfor+"-SubPhase*";
				PhaseInfor = PhaseInfor + SubPhasetext;
				targetArray.push(PhaseInfor);	
				index++;
			}
		
	}
  SubArray["ProjectID"]=item;
  SubArray["PhaseInfor"]=PhaseInfor;
  utils.post(PM_PHASEMNG_SAVE, SubArray, function(){savePhaseSuccess();}, function(){savePhaseError();});
 
}

function savePhaseSuccess() 
{
  $("#pm_phase_mng_modal_save_button").html('Save');
  closePopover("phase_popover");
  $("#pm_phase_mng_modal").modal("hide");
}

function savePhaseError()
{
  $("#pm_phase_mng_modal_save_button").html('Save');
  $("#pm_phase_mng_modal_save_button_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Save phase/Sub phase failed!');
  $("#pm_phase_mng_modal_save_button_alert").fadeIn();
}



function changePwdFunct()
{
  var changePwdMain = addMainContainer("change_password", "form", "form-horizontal");

  addHeaderForMain(changePwdMain,"Change Password");

  initialAlert(changePwdMain);
  $("#change_password_main_alert").attr("id", "change_password_main_alert_success");
  $("#change_password_main_alert_success").removeClass("alert-danger");
  $("#change_password_main_alert_success").addClass("alert-success");
  initialAlert(changePwdMain);

  newInputArea(changePwdMain, "old_password", "Old Password", "oldpassword", "password", "Insert your old password here.");
  newInputArea(changePwdMain, "new_password", "New Password", "newpassword", "password", "Insert your new password. (6-18 characters limited, letters and numbers only.)");
  newInputArea(changePwdMain, "confirm_password", "Confirm New Password", "confirmpassword", "password", "Please confirm your password.");

  newInputArea(changePwdMain, "pwd_submit", "", "dummy", "dummy", "");
  $("#pwd_submit_input").remove();
  $("#pwd_submit_help").remove();
  var changePwdSubmitBtn = createBtn("Submit", null, "btn btn-primary", "pwd_submit_button", function(){changePwdSubmitBtnClick()});
  $("#pwd_submit_controls").append(changePwdSubmitBtn);
}

function generateBtnClick()
{
  $("#new_account_main_alert_success").fadeOut();
  $("#new_account_main_alert").fadeOut();

  var inputEid = $("#user_eid_input").val();
  if(!inputEid)
  {
    $("#new_account_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Please complete the EID!');
    $("#new_account_main_alert").fadeIn();
  }
  else if(!/^[e|h|E|H]{1}\d{6}$/.test(inputEid))
  {

    $("#new_account_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> IncorrectEID format!');
    $("#new_account_main_alert").fadeIn();
  }
  else
  {
    $("#generate_button").html('Generate' + animateRefreshIcon);
    utils.get(ADMIN_GENERATE_NAME, "eid=" + inputEid, function(resp){generateBtnClickSuccess(resp);}, function(){generateBtnClickError()});
  }
}

function generateBtnClickSuccess(item)
{
  $("#generate_button").html('Generate');
  $("#new_account_main_alert_success").fadeOut();
  $("#new_account_main_alert").fadeOut();

  if(item == "NO_RESULT")
  {
    $("#new_account_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> No result in the Outlook database!');
    $("#new_account_main_alert").fadeIn();
  }
  else
  {
    item = item.replace(/\'/g, "\"");
    var responseItem = $.parseJSON(item);
    $("#display_name_input").val(responseItem.name);
  }
}

function generateBtnClickError()
{
  $("#generate_button").html('Generate');
  $("#new_account_main_alert_success").fadeOut();
  $("#new_account_main_alert").fadeOut();
  $("#new_account_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Generate Outlook display name failed!');
  $("#new_account_main_alert").fadeIn();
}

function submitBtnClick()
{
  $("#new_account_main_alert_success").fadeOut();
  $("#new_account_main_alert").fadeOut();
  //send submit order to server here!!!
  var inputEid = $("#user_eid_input").val();
  var inputName = $("#display_name_input").val();

  if(!(inputEid && inputName))
  {
    $("#new_account_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Lack of account information!');
    $("#new_account_main_alert").fadeIn();
  }
  else if(!/^[e|h|E|H]{1}\d{6}$/.test(inputEid))
  {
    $("#new_account_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> EID format error!');
    $("#new_account_main_alert").fadeIn();
  }
  else
  {
    $("#submit_button").html('Submit' + animateRefreshIcon);

    var postData = {
      eid: inputEid.toUpperCase(),
      name: inputName
    }
    utils.post(ADMIN_CREATE_ACCOUNT, postData, function(resp){submitBtnClickSuccess(resp);}, function(){submitBtnClickError();});
  }
}

function submitBtnClickSuccess(resp)
{
  
  $("#submit_button").html('Submit');
  
  if(resp == "ACCOUNT_EXISTED")
  {
    $("#new_account_main_alert_success").fadeOut();
      $("#new_account_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> EID existed!');
      $("#new_account_main_alert").fadeIn();
  }
  else  
  {
    $("#new_account_main_alert").fadeOut();
    $("#new_account_main_alert_success p").html("<b>" + $("#user_eid_input").val() + "</b> is successfully created!");
    $("#new_account_main_alert_success").fadeIn();
    $("#user_eid_input").val("");
    $("#display_name_input").val("");
  }
}

function submitBtnClickError()
{
  $("#new_account_main_alert_success").fadeOut();
  $("#submit_button").html('Submit');
  $("#new_account_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Create new account failed!');
  $("#new_account_main_alert").fadeIn();
}

function changePwdSubmitBtnClick()
{

  $("#change_password_main_alert_success").fadeOut();
  $("#change_password_main_alert").fadeOut();
  var oldPwd = $("#old_password_input").val();
  var newPwd = $("#new_password_input").val();
  var confmPwd = $("#confirm_password_input").val();

  if(!(oldPwd && newPwd && confmPwd))
  {
    $("#change_password_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Please complete form.');
    $("#change_password_main_alert").fadeIn();
  }
  else if(!/^[a-zA-Z\d_]{6,18}$/.test(newPwd))
  {
    $("#change_password_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Incorrect password format!');
    $("#change_password_main_alert").fadeIn();
  }
  else if(newPwd != confmPwd)
  {
    $("#change_password_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Your new passwords don\'t match!');
    $("#change_password_main_alert").fadeIn();
  }
  else 
  {
    var postData = {};
    postData.eid = loginUser.eid;
    postData.oldpwd = oldPwd;
    postData.newpwd = newPwd;
    $("#pwd_submit_button p").html('Submit' + animateRefreshIcon);

    utils.post(CHANGE_PASSWORD, postData, function(resp){changePwdSubmitBtnClickSuccess(resp);}, function() {changePwdSubmitBtnClickError();});
  }
}

function changePwdSubmitBtnClickSuccess(resp)
{
  $("#change_password_main_alert_success").fadeOut();
  $("#pwd_submit_button").html('Submit');
  if(resp == "OLD_PWD_WRONG")
  {
    $("#change_password_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Your old password is incorrect!');
    $("#change_password_main_alert").fadeIn();
  }
  else
  {
    $("#change_password_main_alert_success p").html('Your password changes successfully!');
    $("#change_password_main_alert_success").fadeIn();
    $("#old_password_input").val("");
    $("#new_password_input").val("");
    $("#confirm_password_input").val("");
  }
}

function changePwdSubmitBtnClickError()
{
  $("#change_password_main_alert_success").fadeOut();
  $("#pwd_submit_button").html('Submit');
  $("#change_password_main_alert").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Change password failed!');
  $("#change_password_main_alert").fadeIn();
}

function newInputArea(parentNode, inputId, inputText, inputAttrName, inputAttrType, inputHelpText) 
{
  var _inputArea = createElementTo("div", parentNode, "control-group");
  _inputArea.id=inputId;
  
  var _label = createElementTo("label", _inputArea,"control-label");
  _label.id=inputId+"_label";
  _label.setAttribute("for",inputAttrName);
  _label.innerHTML=inputText;

  var _controls = createElementTo("div", _inputArea, "controls");
  _controls.id=inputId+"_controls";

  var _input = createElementTo("input", _controls, "form-control")
  _input.id=inputId+"_input";
  _input.setAttribute("style", "width: 270px");
  $("#" + _input.id).attr("type", inputAttrType);
  _input.setAttribute("name", inputAttrName);

  var _help=createElementTo("p", _controls,"help-block");
  _help.id=inputId+"_help";
  _help.innerHTML=inputHelpText;
}

function refreshBtnClick()
{
  //send refresh order to server here!!!
  $("#current_list_general_text").html('Current user number: ' + animateRefreshIcon + ' Loading...');
  //$("#account_list_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");
  //
  utils.get(ADMIN_REFRESH_ACCOUNT_LIST,"", function(resp){refreshBtnCLickSuccess(resp)}, function(){refreshBtnCLickError()});
  //$.get("http://10.78.146.49:8080","RAYMOND TEST/");
}

function refreshBtnCLickSuccess(response)
{
  
  response = response.replace(/\'/g, "\"");
  var recievedList = $.parseJSON(response);
  for (var i = 0; i < recievedList.length; i++)
  {
    var str = recievedList[i].links;
    recievedList[i].links = [];
    if(str)
      recievedList[i].links = str.split(",");
  }
  currentUserList = recievedList;
  totalUserNb = recievedList.length;

  generateCurrentListBody(currentUserList);
  $("#current_list_general_text").html("Current user number: "+ totalUserNb);
  //$("#account_list_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");
  // $("#current_list_general_text").css("color", "#0f0");
  // $("#current_list_general_text").animate({color:'#333'},3000);
}

function refreshBtnCLickError()
{
  $("#current_accounts_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Can\'t get the latest account list!')
  $("#current_accounts_main_alert").fadeIn();
  $("#current_list_general_text").html("Current user number: "+ totalUserNb);
  $("#account_list_table").css("margin-left", "-" + $("#current_list_general_text").width() + "px");
//   $("#current_list_general_text").css("color", "f00");
//   $("#current_list_general_text").animate({color:'#333'},3000);
}







function createPlModal(parentNode)
{
  var projectLinkModal = createElementTo("div", parentNode, "modal fade");
  projectLinkModal.id = "project_link_modal";
  projectLinkModal.setAttribute("tabindex","-1");
  projectLinkModal.setAttribute("role","dialog");
  projectLinkModal.setAttribute("aria-hidden", "true");
  projectLinkModal.setAttribute("data-backdrop", "static");
  initializeModal(projectLinkModal, "Link to projects");

  initialAlert(document.getElementById("project_link_modal_body"));

  var warningIcon = createElementTo("span", document.getElementById("project_link_modal_body"), "glyphicon glyphicon-link");
  warningIcon.setAttribute("style", "font-size:30px; color: #46b8da; float: left")

  var userIden = createElementTo("p", document.getElementById("project_link_modal_body"));
  userIden.id = "pl_user_iden";

  var projectList = createElementTo("table", document.getElementById("project_link_modal_body"), "table table-bordered table-hover");
  projectList.id = "pl_list_table";

  var plTitle = createTableHead(["Project Definition", "Project Description", "Status"], "pl_list_table");
  $("#project_link_modal").on("show.bs.modal", function(){plModalShow(plTitle);});

  var plModalFooter = document.getElementById("project_link_modal_footer");
  var plRefreshBtn = createBtn("Reset links", plModalFooter, "btn btn-success pull-left", "pl_refresh_button", function(){plRefreshBtnClick()});
  plRefreshBtn.id = "project_link_modal_refresh_btn";
  var plCancelBtn = createBtn("Cancel", plModalFooter, "btn btn-default");
  plCancelBtn.setAttribute("data-dismiss", "modal");
  var plSaveBtn = createBtn("Save Links", plModalFooter, "btn btn-primary", "pl_save_button", function(){plSaveBtnClick()});
  plSaveBtn.id = "project_link_modal_save_btn";

  formTable(plTitle, null, "pl_list_table")
  plRefreshBtnClick();
}

function plModalShow(head)
{
  if(currentProjectList.length<=0)
    plRefreshBtnClick();
  $("#project_link_modal_body_alert").hide();
  var currentUserName = selectItemByAttr("eid", currentUserId, currentUserList).name;
  currentUserLinks = selectItemByAttr("eid", currentUserId, currentUserList).links;
  $("#pl_user_iden").html("<b>Current account:</b> " + currentUserName);
  $("#pl_user_iden").css("padding-top", "7px");
  $("#pl_user_iden").css("padding-left", "30px");
  
  plRefreshBtnClick();
}

function plSaveBtnClick()
{
  //send save project link order to server here!!!
  $("#project_link_modal_save_btn").html('Save Links' + animateRefreshIcon);
  var projectListWithId = copyObj(currentProjectList);
  var projectList = cutIdforProjectList(projectListWithId);
  currentUserLinks = [];

  for (var i = 0; i < projectList.length; i++)
  {
    if($("#pl_list_table_body"+ i +" td span").attr("class") == "glyphicon glyphicon-ok")
    {
        currentUserLinks.push(projectList[i].definition);
    }
  }
  var postData = {
    eid: currentUserId,
    links: currentUserLinks
  }
  utils.post(ADMIN_SAVE_LINKS, postData, function(){plSaveBtnClickSuccess()}, function (){plSaveBtnClickError()});
}

function plSaveBtnClickSuccess()
{
  $("#project_link_modal_save_btn").html('Save Links');
  

  selectItemByAttr("eid", currentUserId, currentUserList)["links"] = currentUserLinks;
  $("#project_link_modal").modal('hide');
  // $("#project_link_modal").attr("aria-hidden", "true");
  // $("#project_link_modal").removeClass("in");
  // $("body").removeClass("modal-open");
  generateCurrentListBody(currentUserList);
}

function plSaveBtnClickError()
{
  $("#project_link_modal_save_btn").html('Save Links');
  $("#project_link_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Save project links failed!');
  $("#project_link_modal_body_alert").fadeIn();
}

function plRefreshBtnClick()
{
  //send save project link order to server here!!!
  $("#project_link_modal_refresh_btn").html('Reset Links' + animateRefreshIcon);
  if (currentProjectList.length<=0)
  {
    $("#project_link_modal_body_alert").fadeOut()
    utils.get(ADMIN_REFRESH_PROJECT_LIST, "", function(resp){refreshPlSuccess(resp);}, function(){refreshPlError();});
  }
  else
  {
    var projectListWithId = copyObj(currentProjectList);//should change to the list recieved from server
    var projectList = cutIdforProjectList(projectListWithId);

    for (var i = 0; i < projectList.length; i++)
    {
      // var _listItem = createElementTo("a", document.getElementById("pl_list_table"), "list-grooup-item");
      // _listItem.setAttribute("href", "#");//?
      projectList.id=projectList.definition;
      addCheckIcon(projectList[i]);
    }  
    if($("#pl_list_table_body"))
      $("#pl_list_table_body").remove();
    var plListBody = createTableBody(projectList, "pl_list_table", plListHO);

    formTable(document.getElementById("pl_list_table_head"), plListBody, "pl_list_table");
    for (trs in $("#pl_list_table_body tr"))
    {
      if($("#pl_list_table_body"+ trs +" td span").attr("class") == "glyphicon glyphicon-ok")
      {
        $("#pl_list_table_body"+ trs).addClass("checked");
        // $("#pl_list_table_body"+ trs).css("background-color", "#D6EEFF");
        // $("#pl_list_table_body"+ trs).hover(function(){ $(this).css("background-color", "#d5e4FF");}, function(){ $(this).css("background-color", "#D6EEFF");});
        // $("#pl_list_table_body"+ trs +" td").css("color", "#009900");
      }
    }

    $("#pl_list_table tbody tr").click(function(){plListClick(this.id);});

    $("#project_link_modal_refresh_btn").html('Reset Links');
    }
  
}

function refreshPlSuccess(response)
{
  /////////////////////////////////////////
  //For test, using following code
  //need uncomment & comment!
  response = response.replace(/\'/g, "\"");
  currentProjectList = $.parseJSON(response);
  /////////////////////////////////////////
  //currentProjectList = copyObj(testProjectList);

  var projectListWithId = copyObj(currentProjectList);//should change to the list recieved from server
  var projectList = cutIdforProjectList(projectListWithId);

  for (var i = 0; i < projectList.length; i++)
  {
    // var _listItem = createElementTo("a", document.getElementById("pl_list_table"), "list-grooup-item");
    // _listItem.setAttribute("href", "#");//?
    projectList.id=projectList.definition;
    addCheckIcon(projectList[i]);
  }

  var plListBody = createTableBody(projectList, "pl_list_table", plListHO);

  formTable(document.getElementById("pl_list_table_head"), plListBody, "pl_list_table");
  for (trs in $("#pl_list_table_body tr"))
  {
    if($("#pl_list_table_body"+ trs +" td span").attr("class") == "glyphicon glyphicon-ok")
    {
      $("#pl_list_table_body"+ trs).addClass("checked");
      // $("#pl_list_table_body"+ trs).css("background-color", "#D6EEFF");
      // $("#pl_list_table_body"+ trs).hover(function(){ $(this).css("background-color", "#d5e4FF");}, function(){ $(this).css("background-color", "#D6EEFF");});
      // $("#pl_list_table_body"+ trs +" td").css("color", "#009900");
    }
  }

  $("#pl_list_table tbody tr").click(function(){plListClick(this.id);});

  $("#project_link_modal_refresh_btn").html('Reset Links');
}



function refreshPlError()
{
  $("#project_link_modal_refresh_btn").html('Reset Links');
  $("#project_link_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Can\'t get current project list.');
  $("#project_link_modal_body_alert").fadeIn();

}

function plListClick(itemId)
{
  var checkstatus = $("#" + itemId + " td span").attr("class");
  //var currentItem = selectItemByAttr("eid", currentUserId, currentUserList);

  var plIndex = itemId.replace("pl_list_table_body","");
  var currentItem = currentUserList[plIndex];

  if (checkstatus == "glyphicon glyphicon-minus")
  {
    $("#" + itemId + " td span").removeClass("glyphicon-minus");
    $("#" + itemId + " td span").addClass("glyphicon-ok");
    $("#" + itemId + " td span").css("color", "#009900");
    $("#" + itemId).addClass("checked");
  }
  else
  {
    $("#" + itemId + " td span").removeClass("glyphicon-ok");
    $("#" + itemId + " td span").addClass("glyphicon-minus");
    $("#" + itemId + " td span").css("color", "black");
    $("#" + itemId).removeClass("checked");
  }


}

///////////////////////////////////
//modal示例
///////////////////////////////////
function createResetModal(parentNode)
{
  ////////////////////////////////////////
  //属性初始化，只需更改id，其他照搬就行
  //create warning modal for reset password
  var resetModal = createElementTo("div", parentNode, "modal fade");
  resetModal.id = "reset_modal";
  resetModal.setAttribute("tabindex","-1");
  resetModal.setAttribute("role","dialog");
  resetModal.setAttribute("aria-hidden", "true");
  resetModal.setAttribute("data-backdrop", "static");
  initializeModal(resetModal, "Reset password");

  //初始化告警条，用相应id
  initialAlert(document.getElementById("reset_modal_body"));
  
  //modal内部的文字
  var warningIcon = createElementTo("span", document.getElementById("reset_modal_body"), "glyphicon glyphicon-exclamation-sign");
  warningIcon.setAttribute("style", "font-size:30px; color: #eea236; float: left")
  var resetWarningText = createElementTo("p", document.getElementById("reset_modal_body"));
  resetWarningText.id = "reset_modal_body_text";

  //声明每次该modal出现的函数
  $("#reset_modal").on("show.bs.modal", function(){rsModalShow();});

  //声明footer里的按钮，用相应id
  var rsModalFooter = document.getElementById("reset_modal_footer");
  var rsCancelBtn = createBtn("No", rsModalFooter, "btn btn-default");
  rsCancelBtn.setAttribute("data-dismiss", "modal");
  var rsEnterBtn = createBtn("Yes", rsModalFooter, "btn btn-primary", "pl_save_button", function(){rsEnterBtnClick(this)});
  rsEnterBtn.id = "reset_modal_enter_btn";
}

function rsModalShow()
{
  $("#reset_modal_body_alert").hide();
  var currentUserName = selectItemByAttr("eid", currentUserId, currentUserList).name;
  
  $("#reset_modal_body_text").html("Are you sure you want to reset password of <b>" + currentUserName + " (EID:" + currentUserId + ")</b>?");
  $("#reset_modal_body_text").css("padding-top", "7px");
  $("#reset_modal_body_text").css("padding-left", "40px");
}


function rsEnterBtnClick(itm)
{
  $("#reset_modal_enter_btn").html('Yes' + animateRefreshIcon);
  
  utils.get(ADMIN_RESET_ACCOUNT, "eid=" + currentUserId, function(){rsEnterBtnClickSuccess();}, function(){rsEnterBtnClickError();});
}

function rsEnterBtnClickSuccess()
{
  $("#reset_modal_enter_btn").html("Yes");
  $("#reset_modal").modal("hide");
}

function rsEnterBtnClickError()
{
  $("#reset_modal_enter_btn").html("Yes");
  $("#reset_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Reset password failed!');
  $("#reset_modal_body_alert").fadeIn();
}

function createRemoveModal(parentNode)
{
  //create warning modal for reset password
  var removeModal = createElementTo("div", parentNode, "modal fade");
  removeModal.id = "remove_modal";
  removeModal.setAttribute("tabindex","-1");
  removeModal.setAttribute("role","dialog");
  removeModal.setAttribute("aria-hidden", "true");
  removeModal.setAttribute("data-backdrop", "static");
  initializeModal(removeModal, "Remove Account");

  initialAlert(document.getElementById("remove_modal_body"));
  
  var warningIcon = createElementTo("span", document.getElementById("remove_modal_body"), "glyphicon glyphicon-remove");
  warningIcon.setAttribute("style", "font-size:30px; color: #d43f3a; float: left")

  $("#remove_modal").on("show.bs.modal", function(){rmModalShow();});

  var resetWarningText = createElementTo("p", document.getElementById("remove_modal_body"));
  resetWarningText.id = "remove_modal_body_text";

  var rmModalFooter = document.getElementById("remove_modal_footer");
  var rmCancelBtn = createBtn("No", rmModalFooter, "btn btn-default");
  rmCancelBtn.setAttribute("data-dismiss", "modal");
  var rmEnterBtn = createBtn("Yes", rmModalFooter, "btn btn-primary", "pl_save_button", function(){rmEnterBtnClick(this)});
  rmEnterBtn.id = "remove_modal_enter_btn";
}

function rmModalShow()
{
  $("#remove_modal_body_alert").hide();
  var currentUserName = selectItemByAttr("eid", currentUserId, currentUserList).name;
  
  $("#remove_modal_body_text").html("Are you sure you want to remove <b>" + currentUserName + " (EID:" + currentUserId + ")</b>?");
  $("#remove_modal_body_text").css("padding-top", "7px");
  $("#remove_modal_body_text").css("padding-left", "40px");
}

function rmEnterBtnClick(itm)
{
  $("#remove_modal_enter_btn").html('Yes' + animateRefreshIcon);
  
  var postData = {
    eid: currentUserId
  }
  utils.post(ADMIN_REMOVE_ACCOUNT, postData, function(resp){rmEnterBtnClickSuccess(resp);}, function(){rmEnterBtnClickError();});
}

function rmEnterBtnClickSuccess(resp)
{ 
  $("#remove_modal_enter_btn").html("Yes");
  if(resp == "ACCOUNT_LOGIN")
  {
    $("#remove_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> This account is being logged in. You cannot remove it!');
    $("#remove_modal_body_alert").fadeIn();
  }
  else
  {
    $("#remove_modal").modal("hide");
    refreshBtnClick();
  }
}

function rmEnterBtnClickError()
{
  $("#remove_modal_enter_btn").html("Yes");
  $("#remove_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Remove account failed!');
  $("#remove_modal_body_alert").fadeIn();
}

function generateCurrentListBody(bodylist)
{
  for (var i =0; i < bodylist.length; i++)
  {
    addEditBtns(bodylist[i]);
  };

  if($("#account_list_table").length > 0)
     $("#account_list_table").remove();

  var accountList = createElementTo("table", document.getElementById("table_in_div"), "table table-bordered table-striped");
  accountList.id = "account_list_table";
  $("#account_list_table").css("float", "left");
  $("#account_list_table").css("width", "80%");
  $("#account_list_table").css("margin-top", "10px");
  var currentListBody = createTableBody(bodylist, "account_list_table", accountListHO);
  var accountListHead = createTableHead(currentListHead, "account_list_table");

  formTable(accountListHead, currentListBody,"account_list_table");

  addPager("account_list_table",5);

  tableSorterForEid("account_list_table");
}

function refreshProjectList()
{
  selectedProject = [];
  $("#refresh_project_btn").html(animateRefreshIcon + ' Refresh');
  utils.get(ADMIN_REFRESH_PROJECT_LIST, "", function(resp){refreshProjectListSuccess(resp);}, function(){refreshProjectListError();});
}

function refreshProjectListSuccess(response)
{
  $("#refresh_project_btn").html('Refresh');
  /////////////////////////////////////////
  //For test, using following code
  //need uncomment & comment!
  response = response.replace(/\'/g, "\"");
  currentProjectList = $.parseJSON(response);
  /////////////////////////////////////////
  //currentProjectList = copyObj(testProjectList);
  generateProjectList(cutIdforProjectList(currentProjectList));
}



function refreshProjectListError()
{
  $("#refresh_project_btn").html('Refresh');
  $("#project_manage_main_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Get project list failed!');
  $("#project_manage_main_alert").fadeIn();

}

function generateProjectList(bodylist)
{
  $("#edit_project_btn").prop("disabled", true);
  $("#remove_project_btn").prop("disabled", true);
  $("#phase_management_btn").prop("disabled", true);
  
  if($("#project_manage_list_table_body").length > 0)
    $("#project_manage_list_table_body").remove();

  var pmListBody = createTableBody(bodylist, "project_manage_list_table", pmListHO);

  formTable(document.getElementById("project_manage_list_table_head"), pmListBody, "project_manage_list_table");

  $("#project_manage_list_table tbody tr").click(function(){pmListClick(this.id);});
}

function pmListClick(itemId)
{
  var plIndex = itemId.replace("project_manage_list_table_body","");
  var projectList =cutIdforProjectList(currentProjectList);

  selectedProject = currentProjectList[plIndex];
  if($("#" + itemId).hasClass("checked"))
  {
    $("#" + itemId).removeClass("checked");
    selectedProject = [];
    $("#edit_project_btn").prop("disabled", true);
    $("#remove_project_btn").prop("disabled", true);
    $("#phase_management_btn").prop("disabled", true);
  }
  else
  {
    if(currentProjectIndex && currentProjectIndex)
      $("#project_manage_list_table_body" + currentProjectIndex).removeClass("checked");
    currentProjectIndex = plIndex;
    $("#" + itemId).addClass("checked");
    $("#edit_project_btn").prop("disabled", false);
    $("#remove_project_btn").prop("disabled", false);
	$("#phase_management_btn").prop("disabled", false);
  }
}

function createPmAddModal(parentNode)
{
  //create modal for add project
  var pmAddModal = createElementTo("div", parentNode, "modal fade");
  pmAddModal.id = "pm_add_modal";
  pmAddModal.setAttribute("tabindex","-1");
  pmAddModal.setAttribute("role","dialog");
  pmAddModal.setAttribute("aria-hidden", "true");
  pmAddModal.setAttribute("data-backdrop", "static");
  initializeModal(pmAddModal, "Add a New Project");

  initialAlert(document.getElementById("pm_add_modal_body"));

  
  var pmAddModalBody = document.getElementById("pm_add_modal_body");

  newInputArea(pmAddModalBody, "new_proj_def", "Project definition:", "nprojdef", "text","");
  newInputArea(pmAddModalBody, "new_proj_name", "Project description:", "nprojname", "text","");

  var pmAddModalFooter = document.getElementById("pm_add_modal_footer");
  var pmAddCancelBtn = createBtn("Cancel", pmAddModalFooter, "btn btn-default");
  pmAddCancelBtn.setAttribute("data-dismiss", "modal");
  var pmAddSubmitBtn = createBtn("Submit", pmAddModalFooter, "btn btn-primary", "pm_add_save_button", function(){pmAddSubmitBtnClick()});
  pmAddSubmitBtn.id = "pm_add_modal_enter_btn";
}

function pmAddSubmitBtnClick()
{
  $("#pm_add_modal_body_alert").fadeOut();
  var newDef = $("#new_proj_def_input").val();
  var newName = $("#new_proj_name_input").val();

  if(!(newDef && newName))
  {
    $("#pm_add_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Lack of information for new project!');
    $("#pm_add_modal_body_alert").fadeIn();
  }
  else
  {
    var postData = {
      definition: newDef,
      description: newName
    };
    $("#pm_add_modal_enter_btn").html('Submit' + animateRefreshIcon);
    utils.post(ADMIN_CREATE_PROJECT, postData, function(){pmAddSubmitBtnClickSuccess();}, function(){pmAddSubmitBtnClickError();});
  }

}

function pmAddSubmitBtnClickSuccess()
{
  $("#pm_add_modal_enter_btn").html('Submit');
  $("#pm_add_modal").modal("hide");
  refreshProjectList();
}

function pmAddSubmitBtnClickError()
{
  $("#pm_add_modal_enter_btn").html('Submit');
  $("#pm_add_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Add new project failed!');
  $("#pm_add_modal_body_alert").fadeIn();
}


//编辑，含多个输入框
function createPmEditModal(parentNode)
{
  //create modal for add project
  var pmEditModal = createElementTo("div", parentNode, "modal fade");
  pmEditModal.id = "pm_edit_modal";
  pmEditModal.setAttribute("tabindex","-1");
  pmEditModal.setAttribute("role","dialog");
  pmEditModal.setAttribute("aria-hidden", "true");
  pmEditModal.setAttribute("data-backdrop", "static");
  initializeModal(pmEditModal, "Edit Project");

  initialAlert(document.getElementById("pm_edit_modal_body"));

  var pmEditModalBody = document.getElementById("pm_edit_modal_body");

  //输入框的简便办法
  newInputArea(pmEditModalBody, "edit_proj_def", "Project Definition:", "edprojdef", "text","");
  $("#edit_proj_def_input").prop('disabled', true);
  newInputArea(pmEditModalBody, "edit_proj_name", "Project Description:", "edprojname", "text","");

  $("#pm_edit_modal").on("show.bs.modal", function(){pmEditModalShow();});
  
  var pmEditModalFooter = document.getElementById("pm_edit_modal_footer");
  var pmEditCancelBtn = createBtn("Cancel", pmEditModalFooter, "btn btn-default");
  pmEditCancelBtn.setAttribute("data-dismiss", "modal");
  var pmEditSaveBtn = createBtn("Save", pmEditModalFooter, "btn btn-primary", "pm_edit_save_button", function(){pmEditSaveBtnClick()});
  //pmEditSaveBtn.id = "pm_edit_modal_save_btn";
}

function pmEditModalShow()
{
  $("#pm_edit_modal_body_alert").fadeOut();
  $("#edit_proj_def_input").val("");
  $("#edit_proj_name_input").val("");
  if(selectedProject)
  {
    $("#edit_proj_def_input").val(selectedProject.definition);
    $("#edit_proj_name_input").val(selectedProject.description);

    $("#edit_proj_def_input").attr("oldValue", selectedProject.definition);
    $("#edit_proj_name_input").attr("oldValue", selectedProject.description);
  }
}

function pmEditSaveBtnClick()
{
  $("#pm_edit_modal_body_alert").fadeOut();
  var isNotEdited = ($("#edit_proj_def_input").attr("oldValue") == $("#edit_proj_def_input").val()) && ($("#edit_proj_name_input").attr("oldValue") == $("#edit_proj_name_input").val());

  if(isNotEdited)
  {
    $("#pm_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Project information does not change!');
    $("#pm_edit_modal_body_alert").fadeIn();
  }
  else
  {
    var postData = copyObj(selectedProject);
    postData.definition = $("#edit_proj_def_input").val();
    postData.description = $("#edit_proj_name_input").val();

    $("#pm_edit_save_button").html('Save' + animateRefreshIcon);
    utils.post(ADMIN_UPDATE_PROJECT, postData, function(){pmEditSaveBtnClickSuccess();}, function(){pmEditSaveBtnClickError();});
  }

}

function pmEditSaveBtnClickSuccess()
{
  $("#pm_edit_save_button").html('Save');
  $("#pm_edit_modal").modal("hide");
  refreshProjectList();
}

function pmEditSaveBtnClickError()
{
  $("#pm_edit_save_button").html('Save');
  $("#pm_edit_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Edit project failed!');
  $("#pm_edit_modal_body_alert").fadeIn();
}

function createPmRemoveModal(parentNode)
{
  //create warning modal for reset password
  var pmRemoveModal = createElementTo("div", parentNode, "modal fade");
  pmRemoveModal.id = "pm_remove_modal";
  pmRemoveModal.setAttribute("tabindex","-1");
  pmRemoveModal.setAttribute("role","dialog");
  pmRemoveModal.setAttribute("aria-hidden", "true");
  pmRemoveModal.setAttribute("data-backdrop", "static");
  initializeModal(pmRemoveModal, "Remove Project");

  initialAlert(document.getElementById("pm_remove_modal_body"));
  
  var warningIcon = createElementTo("span", document.getElementById("pm_remove_modal_body"), "glyphicon glyphicon-remove");
  warningIcon.setAttribute("style", "font-size:30px; color: #d43f3a; float: left")

  $("#pm_remove_modal").on("show.bs.modal", function(){pmRemoveModalShow();});

  var resetWarningText = createElementTo("p", document.getElementById("pm_remove_modal_body"));
  resetWarningText.id = "pm_remove_modal_body_text";

  var pmRemoveModalFooter = document.getElementById("pm_remove_modal_footer");
  var pmRemoveCancelBtn = createBtn("No", pmRemoveModalFooter, "btn btn-default");
  pmRemoveCancelBtn.setAttribute("data-dismiss", "modal");
  var rmEnterBtn = createBtn("Yes", pmRemoveModalFooter, "btn btn-primary", "pm_remove_enter_button", function(){pmRemoveEnterBtnClick(this)});
  rmEnterBtn.id = "pm_remove_modal_enter_btn";
}

function pmRemoveModalShow()
{
  $("#pm_remove_modal_body_alert").hide();
  //var currentUserName = selectItemByAttr("eid", currentUserId, currentUserList).name;
  
  $("#pm_remove_modal_body_text").html("Are you sure you want to remove <b>" + selectedProject.description + " (" + selectedProject.definition + ")?<br/><font color=\"red\">Caution: </b>Project removing may cause unexpectable problems in other function!</font>");
  $("#pm_remove_modal_body_text").css("padding-top", "7px");
  $("#pm_remove_modal_body_text").css("padding-left", "40px");
}

function pmRemoveEnterBtnClick()
{
  $("#pm_remove_modal_enter_btn").html('Yes' + animateRefreshIcon);
  var postData = selectedProject;
  utils.post(ADMIN_REMOVE_PROJECT, postData, function(){pmRemoveEnterBtnClickSuccess();}, function(){pmRemoveEnterBtnClickError();});
}

function pmRemoveEnterBtnClickSuccess()
{
  $("#pm_remove_modal_enter_btn").html('Yes');
  $("#pm_remove_modal").modal("hide");
  refreshProjectList();
}

function pmRemoveEnterBtnClickError()
{
  $("#pm_remove_modal_enter_btn").html('Yes');
  $("#pm_remove_modal_body_alert p").html('  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b> Remove project failed!');
  $("#pm_remove_modal_body_alert").fadeIn();
}



function addEditBtns(listItem)
{
  var btnReset = document.createElement("button");
  btnReset.className = "btn btn-warning btn-mini";
  createElementTo("span", btnReset, "glyphicon glyphicon-exclamation-sign");
  btnReset.setAttribute("type","button");
  btnReset.setAttribute("data-hover", "tooltip");
  btnReset.setAttribute("data-placement", "top");
  btnReset.setAttribute("title", "Reset password");
  btnReset.setAttribute("data-toggle","modal");
  btnReset.setAttribute("data-target","#reset_modal");
  btnReset.onclick = function(){currentUserId = listItem.eid;};

  var btnRemove = document.createElement("button");
  btnRemove.className = "btn btn-danger btn-mini";
  createElementTo("span", btnRemove, "glyphicon glyphicon-remove");
  btnRemove.setAttribute("type","button");
  btnRemove.setAttribute("data-hover", "tooltip");
  btnRemove.setAttribute("data-placement", "top");
  btnRemove.setAttribute("title", "Remove");
  btnRemove.setAttribute("data-toggle","modal");
  btnRemove.setAttribute("data-target","#remove_modal");
  btnRemove.onclick = function(){currentUserId = listItem.eid;};

  var btnLink = document.createElement("button");
  btnLink.className = "btn btn-info btn-mini";
  createElementTo("span", btnLink, "glyphicon glyphicon-link");
  btnLink.setAttribute("type","button");
  btnLink.setAttribute("data-hover", "tooltip");
  btnLink.setAttribute("data-placement", "top");
  btnLink.setAttribute("title", "Link to projects");
  btnLink.setAttribute("data-toggle","modal");
  btnLink.setAttribute("data-target","#project_link_modal");
  btnLink.onclick = function(){currentUserId = listItem.eid;};

  listItem.edit = [btnReset,  btnRemove, btnLink];
}

function addCheckIcon(listItem)
{
  var checkIcon = document.createElement("span");
  checkIcon.id = listItem.definition+"_check";
  if(isContain(listItem.definition, currentUserLinks))
  {
    checkIcon.className = "glyphicon glyphicon-ok";
    checkIcon.setAttribute("style", "color: #009900");
  }
  else
    checkIcon.className = "glyphicon glyphicon-minus";
  //$("#"+checkIcon.id).hide();
  listItem.check = checkIcon.outerHTML;
}

function initialAlert(parentNode)
{
  var _alertDiv = createElementTo("div", parentNode,"alert alert-danger");
  _alertDiv.id=parentNode.id+"_alert";

  _alertDiv.setAttribute("style","display:none");
  var _closeBtn = createBtn("&times;", _alertDiv, "close", _alertDiv.id+"close");
  _closeBtn.onclick= function () {$("#"+_alertDiv.id).fadeOut();};
  _alertDiv.appendChild(_closeBtn);
  
  var _p = createElementTo("p", _alertDiv);
  _p.innerHTML='  <span class= "glyphicon glyphicon-alert"></span>  <b>Error:</b>';

  return _alertDiv;
}

function cutIdforProjectList(listWithId)
{
  var list = copyObj(listWithId);
  for(var i = 0; i < list.length; i++)
  {
    delete list[i].id;
  }

  return list;
}

currentListHead=[
"EID",
"Account Type",
"Outlook Display Name",
"Linked Projects",
"Edit"];


function developerDemo()
{

  var developerDemoMain = addMainContainer("developer_demo", "div");

  addHeaderForMain(developerDemoMain, "Developer Demo");

  initialAlert(developerDemoMain);
  
  var developerDemoDiv = createElementTo("div", developerDemoMain, "table-responsive");
  developerDemoDiv.id = "developer_demo_div";
  
  var developerDemoBodyHO = ["person1","person2", "person3","person4"];

  var developerDemoList = createElementTo("table", document.getElementById("developer_demo_div"), "table table-bordered");
  developerDemoList.id = "developer_demo_table";
  $("#developer_demo_table").css("float", "left");
  $("#developer_demo_table").css("width", "80%");
  $("#developer_demo_table").css("margin-top", "10px");
  
  var currentdeveloperDemoListBody = createTableBody(bodylist, "developer_demo_table", developerDemoBodyHO);
  
  formTable("",currentdeveloperDemoListBody,"developer_demo_table");
  


}

bodylist =
[
{ 
	"person1": '<img src=""><b>王菲</b>',
	"person2": '',
	"person3": '',
	"person4": '',
},
{
	"person1": '<b>Web Page</b>',
	"person2": "" ,
	"person3": "",
	"person4": '',
},
{
	"person1": '<img src="../images/HuangRaymond.jpg"><b>   黄振 </b>',
	"person2": '<img src="../images/LiAdam.jpg"><b>   李海鑫</b>' ,
	"person3": '<img src=""><b>   李琦</b>',
	"person4": '<img src=""><b>   Yang Jialin</b>',
},
{
	"person1": '<b>Database/Python</b>',
	"person2": '',
	"person3": '',
	"person4": '',
},

{
	"person1": '<img src="../images/FanDandan.jpg"><b>   范丹丹</b>',
	"person2": '<img src="../images/chenjiang.jpg"><b>   陈江</b>',
	"person3": '<img src="../images/minghui.jpg"><b>   陈明辉</b>',
	"person4": '<img src="../images/jingfeng.bmp"><b>   Jing Feng</b>',
},
{
	"person1": '<img src="../images/WangLin.jpg"><b>   王琳</b>',
	"person2": '',
	"person3": '',
	"person4": '',
},
{
	"person1": '<b>Document</b>',
	"person2": '' ,
	"person3": '',
	"person4": '',
},
{
	"person1": '<img src="../images/Huangwenxin.JPG" /><b>   黄文欣</b>',
	"person2": '<img src="../images/DingXiaofang.jpg"><b>   丁小芳</b>',
	"person3": '<img src="../images/zhanlingling.jpg"><b>   詹玲玲</b>',
	"person4": '<img src="../images/lidongjian.png"><b>   李冬建</b>',
},
{
	"person1": '<img src="../images/kechongyang.jpg"><b>   柯重阳</b>',
	"person2": '<img src="../images/zhongli.JPG"><b>   钟丽</b>',
	"person3": '<img src=""><b>   Wu Rebecca</b>',
	"person4": '<img src=""><b>   Li Na</b>',
}
]
