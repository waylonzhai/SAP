var loginUser = {eid:"TEST", name:"TEST001", type: "admin"};
var activeMenuId = null;
var activeMainId = null;
var tableHeight = 500;

function tableResize()
{
  tableHeight=$(window).height()-$("#navbar").height()- $(".page-header").outerHeight(true)-75;
  $(".table-overwide").css("height",tableHeight+"px");
  $(".table-overwide").css("overflow-y", "auto");
}

$(document).ready(function()
{
  defaultMain();
  utils.get(GET_USER, "", function(resp){getUserSuccess(resp);}, function(){getUserError()});


   //need to uncomment here to initialize loginUser
   //initializeMenu();


  //Initialize tooltips
  $("body").tooltip({ selector: '[data-hover = tooltip]' });
  //$("#welcome_note a").html("Welcome, " + loginUser.name + " (" + loginUser.eid + ")");
  $("#logout_link").click(function(){
    //utils.get(LOGOUT, "", function(){logoutSuccess();}, function(){logoutError();})
    window.event.returnValue = false;
    location.href="."; 

  });

  

});


$(window).resize(function() 
{
  tableResize();
});

function getUserSuccess(resp)
{
  if(resp == "NO_LOGIN_USER")
    getUserError();
  else
  {
    resp = resp.replace(/\'/g, "\"");
    var responseItem = $.parseJSON(resp);
    loginUser = responseItem;
    initializeMenu();
    $("#welcome_note a").html("Welcome, " + loginUser.name + " (" + loginUser.eid + ")");
  }
}

function getUserError()
{
  welcomePara.innerHTML = "<font color=\"red\"><b>Error:</b> Cannot load login user information.</br>Please login again or contact to the administrator.</br>The page will jump to login page within 5 seconds...</font>"
  setTimeout(
    function(){
      welcomePara.innerHTML = "<font color=\"red\"><b>Error:</b> Cannot load login user information.</br>Please login again or contact to the administrator.</br>The page will jump to login page within 4 seconds...</font>"; 
      setTimeout(
        function(){
          welcomePara.innerHTML = "<font color=\"red\"><b>Error:</b> Cannot load login user information.</br>Please login again or contact to the administrator.</br>The page will jump to login page within 3 seconds...</font>"; 
          setTimeout(
            function(){
              welcomePara.innerHTML = "<font color=\"red\"><b>Error:</b> Cannot load login user information.</br>Please login again or contact to the administrator.</br>The page will jump to login page within 2 seconds...</font>"; 
              setTimeout(
                function(){
                  welcomePara.innerHTML = "<font color=\"red\"><b>Error:</b> Cannot load login user information.</br>Please login again or contact to the administrator.</br>The page will jump to login page within 1 seconds...</font>"; 
                   setTimeout(function(){window.location="."; },1000);
                },1000);
            },1000);
        },1000);
    },1000);
  
  
  
}

function logoutSuccess()
{
  window.event.returnValue = false;
  location.href="."; 
}

function logoutError()
{
  switchMainTo("welcome_note");
  welcomePara.innerHTML = "<font color=\"red\"><b>Error:</b> Logout error, please try again.</font>"
}

window.onbeforeunload = function(){
  return 'Your action is about to leave this page. This may cause your login information mikssing and need to login again. Are you sure you want to continue?';
};

$( window ).on('unload', function() {
  //utils.get(LEAVE);
  if(loginUser.eid != "TEST")
    {
      $.ajax({
        type: 'GET',
        url: LEAVE,
        async:false
      });
    }
});



function defaultMain()
{
  var welcome = document.createElement("div");
  welcome.className="jumbotron";
  welcome.id="welcome_note"+"_main";

  var welcomeContainer=document.createElement("div");
  welcomeContainer.className="container";
  welcomeContainer.id="welcome_note_main_container";
  welcome.appendChild(welcomeContainer);

  welcomeHead = document.createElement("h1");
  //welcomeHead.align="center";
  welcomeHead.innerHTML="Welcome to use SAP Feel!";
  welcomeContainer.appendChild(welcomeHead);

  welcomePara = document.createElement("p");
  //welcomePara.align="center";
  welcomePara.innerHTML = "This is an advanced SAP tool for project management.</br></br>Flow Chart</br><img src='../images/MainPage1.jpg'><img src='../images/MainPage2.jpg'>".bold();
  welcomeContainer.appendChild(welcomePara);

  $("#main").append(welcome);
  activeMainId=welcome.id;

  updateWelcomeInfo();
}

function updateWelcomeInfo(){
  //Update Welcome Name here!!
  //*************************
   $("#developer_demo").click(function(){switchMainTo("developer_demo");});
  $("#welcome_note").click(function(){switchMainTo("welcome_note");});
  $("#back_to_welcome").click(function(){switchMainTo("welcome_note");});

}

