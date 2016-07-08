Dim LowDate
Dim HighDate
Dim RunInfo
Dim FileName
Dim Path
Dim FileNameXLSX
Dim strResultBJ
Dim ExportFlag
Dim CreateLogFlag
Dim Year
Dim City 
Dim TCode
Dim SubTCode
Dim SubTCode1
Dim TCode_Name
ExportFlag = 1
CreateLogFlag = 0
'''''''''''''''''''''''''''''''Get Year&City From Web'''''''''''''''''''''''''''''''''''
call Get_VarFromBat()
call Set_TCode()
call Set_City()
call Set_Year_FileName()
Rem for log to new or add to
If(Year = "2011" and City = "BJ")Then
CreateLogFlag = 1
End If
''''''''''''''''''''''''''''''Done Get Year&City''''''''''''''''''''''''''''''''''''''''''''''''''
Path = "\\ch01w0103\2015GBSAPFeel\Requirement\Data\" 
FileNameXLSX = Path & FileName & ".XLSX"
strResultBJ = Path & FileName & ".XLS"
'''''''''''''''''''''''''''''''''NoPassword'''''''''''''''''''''''''''''''''''''''''''''''''''''''
localSAPProfile = "1.11 ERP - ECC 6.0 Corp PRD"
Rem Create the GuiApplication object
'Set Application = CreateObject("Sapgui.ScriptingCtrl.1")
Rem Open a connection in synchronous mode
'Set Connection  = Application.OpenConnection(localSAPProfile, True)
'Set session     = Connection.Children(0)
'''''''''''''''''''''''''Done NoPassword''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''Psaaword''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
RunInfo = FileName
call Result()
RunInfo = Now & " " & chr(10) & "Try Connect to SAP!"
call Result()
''''''''''''''''''''''''''log Info''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
If Not IsObject(application) Then
Set application = CreateObject("Sapgui.ScriptingCtrl.1")
End If
If Not IsObject(connection) Then
Set connection = application.OpenConnection(localSAPProfile, True)
End If
If Not IsObject(session) Then
Set session = Connection.Children(0)
End If
If IsObject(WScript) Then
 WScript.ConnectObject session,     "on"
 WScript.ConnectObject application, "on"
End If
session.findById("wnd[0]/usr/txtRSYST-BNAME").text = "E335470"
session.findById("wnd[0]/usr/pwdRSYST-BCODE").text = "sapfeel4"
session.findById("wnd[0]").sendVKey 0
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
RunInfo = "Connect to SAP Connection done!"
call Result()
RunInfo = "Start to export data from SAP"
call Result()
''''''''''''''''''''Record From SAP Scripting ''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''TimeSheet''''''''''''''''''''''''''''''''''''''''''''''''''''''''
if(TCode_Name = "TimeSheet" or TCode_Name = "TimeSheet_3Month")Then
session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").text = TCode
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/ctxtS_DATE-LOW").text = LowDate
session.findById("wnd[0]/usr/ctxtS_DATE-HIGH").text = HighDate
session.findById("wnd[0]/usr/ctxtS_BUKRS-LOW").text = SubTCode
session.findById("wnd[0]/usr/ctxtS_CCG1-LOW").text = SubTCode1
session.findById("wnd[0]/usr/ctxtP_LAYOUT").setFocus
session.findById("wnd[0]/usr/ctxtP_LAYOUT").caretPosition = 0
session.findById("wnd[0]").sendVKey 4
session.findById("wnd[1]/usr").verticalScrollbar.position = 83
session.findById("wnd[1]/usr/lbl[1,21]").setFocus
session.findById("wnd[1]/usr/lbl[1,21]").caretPosition = 6
session.findById("wnd[1]").sendVKey 2
session.findById("wnd[0]/tbar[1]/btn[8]").press
session.findById("wnd[0]/mbar/menu[0]/menu[3]/menu[2]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = "C:\Temp"
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = FileName & ".XLS"
session.findById("wnd[1]").sendVKey 0
End If
'''''''''''''''''''''''''''''''''''''DMR''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
if(TCode_Name = "DMR")Then
session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").text = TCode
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/ctxtP_COMP").text = SubTCode
session.findById("wnd[0]/usr/ctxtS_DATE-LOW").text = LowDate
session.findById("wnd[0]/usr/ctxtS_DATE-HIGH").text = HighDate
session.findById("wnd[0]/usr/ctxtS_DATE-HIGH").setFocus
session.findById("wnd[0]/usr/ctxtS_DATE-HIGH").caretPosition = 10
session.findById("wnd[0]/tbar[1]/btn[8]").press
session.findById("wnd[0]/mbar/menu[0]/menu[1]/menu[2]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = "C:\Temp"
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = FileName & ".XLS"
session.findById("wnd[1]/usr/ctxtDY_FILENAME").caretPosition = 8
session.findById("wnd[1]/tbar[0]/btn[0]").press
End If

'''''''''''''''''''''''''''''''''''''ETC'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
if(TCode_Name = "ETC")Then 
session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").text = TCode
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/ctxtP_NWTYPE").text = SubTCode
session.findById("wnd[0]/tbar[1]/btn[8]").press
session.findById("wnd[0]/mbar/menu[0]/menu[3]/menu[2]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = "C:\Temp"
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = FileName & ".XLS"
session.findById("wnd[1]/usr/ctxtDY_FILENAME").caretPosition = 6
session.findById("wnd[1]/tbar[0]/btn[0]").press
End If
'''''''''''''''''''''''''''''''''''''CN43N '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
if(TCode_Name = "CN43N")Then 
session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").text = "CN43N"
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[1]/usr/ctxtTCNT-PROF_DB").text = "000000000001"
session.findById("wnd[1]/usr/ctxtTCNT-PROF_DB").caretPosition = 12
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[0]/tbar[1]/btn[16]").press
session.findById("wnd[0]/usr/ssub%_SUBSCREEN_%_SUB%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell").expandNode "         13"
session.findById("wnd[0]/usr/ssub%_SUBSCREEN_%_SUB%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell").selectNode "         14"
session.findById("wnd[0]/usr/ssub%_SUBSCREEN_%_SUB%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell").topNode = "         13"
session.findById("wnd[0]/usr/ssub%_SUBSCREEN_%_SUB%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/cntlSUB_CONTAINER/shellcont/shellcont/shell/shellcont[1]/shell").doubleClickNode "         14"
session.findById("wnd[0]/usr/ssub%_SUBSCREEN_%_SUB%_CONTAINER:SAPLSSEL:2001/ssubSUBSCREEN_CONTAINER2:SAPLSSEL:2000/ssubSUBSCREEN_CONTAINER:SAPLSSEL:1106/btn%_%%DYN001_%_APP_%-VALU_PUSH").press
session.findById("wnd[1]/usr/tabsTAB_STRIP/tabpSIVA/ssubSCREEN_HEADER:SAPLALDB:3010/tblSAPLALDBSINGLE/ctxtRSCSEL-SLOW_I[1,0]").text = "373C"
session.findById("wnd[1]/usr/tabsTAB_STRIP/tabpSIVA/ssubSCREEN_HEADER:SAPLALDB:3010/tblSAPLALDBSINGLE/ctxtRSCSEL-SLOW_I[1,1]").text = "385C"
session.findById("wnd[1]/usr/tabsTAB_STRIP/tabpSIVA/ssubSCREEN_HEADER:SAPLALDB:3010/tblSAPLALDBSINGLE/ctxtRSCSEL-SLOW_I[1,2]").setFocus
session.findById("wnd[1]/usr/tabsTAB_STRIP/tabpSIVA/ssubSCREEN_HEADER:SAPLALDB:3010/tblSAPLALDBSINGLE/ctxtRSCSEL-SLOW_I[1,2]").caretPosition = 0
session.findById("wnd[1]/tbar[0]/btn[8]").press
session.findById("wnd[0]/usr/ctxtCN_PROJN-LOW").text = "AE*"
session.findById("wnd[0]/usr/ctxtP_DISVAR").setFocus
session.findById("wnd[0]/usr/ctxtP_DISVAR").caretPosition = 10
session.findById("wnd[0]").sendVKey 4
session.findById("wnd[1]/usr").verticalScrollbar.position = 65
session.findById("wnd[1]/usr").verticalScrollbar.position = 64
session.findById("wnd[1]/usr").verticalScrollbar.position = 63
session.findById("wnd[1]/usr").verticalScrollbar.position = 62
session.findById("wnd[1]/usr").verticalScrollbar.position = 61
session.findById("wnd[1]/usr").verticalScrollbar.position = 60
session.findById("wnd[1]/usr").verticalScrollbar.position = 59
session.findById("wnd[1]/usr").verticalScrollbar.position = 60
session.findById("wnd[1]/usr").verticalScrollbar.position = 59
session.findById("wnd[1]/usr").verticalScrollbar.position = 58
session.findById("wnd[1]/usr").verticalScrollbar.position = 57
session.findById("wnd[1]/usr").verticalScrollbar.position = 56
session.findById("wnd[1]/usr").verticalScrollbar.position = 55
session.findById("wnd[1]/usr").verticalScrollbar.position = 54
session.findById("wnd[1]/usr").verticalScrollbar.position = 53
session.findById("wnd[1]/usr/lbl[1,4]").setFocus
session.findById("wnd[1]/usr/lbl[1,4]").caretPosition = 7
session.findById("wnd[1]").sendVKey 2
session.findById("wnd[0]/tbar[1]/btn[8]").press
session.findById("wnd[0]/mbar/menu[0]/menu[3]/menu[2]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = "C:\Temp"
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = FileName & ".XLS"
session.findById("wnd[1]/usr/ctxtDY_FILENAME").caretPosition = 6
session.findById("wnd[1]").sendVKey 0
End If

'''''''''''''''''''''''''''''''''''Export Done''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''Copy to Share Folder'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
set filesys=CreateObject("Scripting.FileSystemObject")
If filesys.FileExists("C:\Temp\" & FileName & ".XLS") Then
RunInfo = "Export From SAP done!"
call Result()
Else
RunInfo = "Export From SAP Error!"
ExportFlag = 0
call Result()
End If
REM copy file to share drive
If filesys.FileExists(strResultBJ) Then 
filesys.DeleteFile(strResultBJ)
End If
filesys.CopyFile "C:\Temp\" & FileName & ".XLS", strResultBJ
If filesys.FileExists(strResultBJ) Then
RunInfo = "Copy from Source Done!"
call Result()
filesys.DeleteFile("C:\Temp\" & FileName & ".XLS")
Else 
RunInfo = "Copy from Source Error!"
ExportFlag = 0
call Result()
End If
Rem Shutdown the connection
Set session     = Nothing
Connection.CloseSession("ses[0]")
Set Connection  = Nothing
Rem Wait a bit for the connection to be closed completely
Wscript.Sleep 1000
Set Application = Nothing
Rem Convert to XLSX
call xls2xlsx()
''''''''''''''''''''''''''''''''Function ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
public Sub Get_VarFromBat()     
    TCode_Name = WScript.Arguments(0)
    select case TCode_Name
        case "TimeSheet"       
            Year = WScript.Arguments(1)
            City = WScript.Arguments(2)
		case "CN43N"
		case else
            City = WScript.Arguments(1)
    end Select	 
End sub

public Sub Set_TCode()
    select case TCode_Name
        case "TimeSheet" 
                TCode = "ZHRTASKGRP"		
        case "TimeSheet_3Month"		
                TCode = "ZHRTASKGRP"
        case "ETC"
                TCode = "ZPSAIPROJPOSPENT"
		case "DMR"	
                TCode = "ZPSTAEROARINV"	
		case "CN43N"	
                TCode = "CN43N"	
    end Select
end	Sub

public Sub Set_Year_FileName()
curMonth = DatePart("m", Now )
If TCode_Name = "TimeSheet" Then 
    select case Year
        case "2011"       
                HighDate = "31.12.2011"
                LowDate = "03.01.2011"
	    case else
                HighDate = "31.12." & Year
                LowDate = "01.01." & Year
	    end Select
	FileName = TCode_Name & "_" & City & "_" & Year
End If
If TCode_Name = "TimeSheet_3Month" Then     
    HighDate = DatePart("d", Now ) & "." & curMonth & "." & DatePart("yyyy", Now)  
    FileName = "TimeSheet_" & City & "_" & curMonth & "_" & DatePart("yyyy", Now)	
    LowDate = DateAdd("d",-90,DatePart("d", Now ) & "-" & curMonth & "-" & DatePart("yyyy", Now))
	LowDate = DatePart("d", LowDate ) & "." & DatePart("m", LowDate ) & "." & DatePart("yyyy", LowDate) - 1
	'msgbox LowDate	
End If	
If TCode_Name = "ETC" or TCode_Name = "DMR" or TCode_Name = "CN43N" Then           
   LowDate = "03.01.2011"   
   'LowDate = DatePart("d", Now )-10 & "." & DatePart("m", Now ) & "." & DatePart("yyyy", Now)
   HighDate = DatePart("d", Now ) & "." & DatePart("m", Now ) & "." & DatePart("yyyy", Now)
   FileName = TCode_Name & "_" & City & "_" & curMonth & "_" & DatePart("yyyy", Now)
End If
If TCode_Name = "CN43N" Then           
   FileName = TCode_Name & "_" & curMonth & "_" & DatePart("yyyy", Now)
End If
end	Sub

public Sub Set_City()    
if(TCode_Name = "ETC")Then 
	select case City
        case "SH"       
                 SubTCode = "OUTCHS"				
        case "BJ"
                 SubTCode = "OUTCHB"
    end Select
else If(TCode_Name = "TimeSheet")Then
        select case City
            case "SH"
                 SubTCode = "385C"
				 SubTCode1 = "385C0130*"
		    case "BJ"
                 SubTCode = "373C"
				 SubTCode1 = "373C0020*"
	    end Select	
    Else
        select case City
            case "SH"       
                 SubTCode = "385C"
				 SubTCode1 = "385C*"
            case "BJ"
                 SubTCode = "373C"
				 SubTCode1 = "373C*"
        end Select	
	End If
End If
end	Sub

public Sub xls2xlsx()
set filesys = CreateObject("Scripting.FileSystemObject")
If filesys.FileExists(FileNameXLSX) Then 
filesys.DeleteFile(FileNameXLSX)
End If
        Set ExcelApp = CreateObject("Excel.Application")
        Set ExcelXls = ExcelApp.Workbooks.Open(strResultBJ)
        ExcelXls.SaveAs strResultBJ & "X",51
        ExcelXls.Close
        Set ExcelXls = Nothing
        ExcelApp.Quit
        Set ExcelApp = Nothing	
        If filesys.FileExists(FileNameXLSX) Then 
		RunInfo = "Convert to " & FileNameXLSX & " done!"	
		RunInfo = RunInfo & chr(10) & "Export succeed!" 
		filesys.DeleteFile(strResultBJ)
		Else 
		RunInfo = "Convert to " & FileNameXLSX & " Error!"
		RunInfo = RunInfo & chr(10) & "Export failed!"
		ExportFlag = 0		
		End If 
		call Result()
End	Sub

public Sub Result()
If ExportFlag Then 
   Rem WScript.Echo RunInfo & chr(10) & "Export succeed!"
   call log(RunInfo)   
Else
   WScript.Echo RunInfo & chr(10)  
   WScript.Quit 
   call log(RunInfo)
End If
End Sub
Rem modify log to record history 
public Sub log(Info)
Set fs = CreateObject("Scripting.FileSystemObject")  
If CreateLogFlag Then  
Set a = fs.CreateTextFile(Path & "SAPlog.txt", true)  
a.Close
Set a = fs.OpenTextFile(Path & "SAPlog.txt", 8,false)   
a.WriteLine(Info)  
a.Close
CreateLogFlag = 0
Else  
Set a = fs.OpenTextFile(Path & "SAPlog.txt", 8,false)   
a.WriteLine(Info)  
a.Close 
End If
End sub


