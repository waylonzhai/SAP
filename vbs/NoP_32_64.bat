@echo off
set filename=\\ch01w0103\2015GBSAPFeel\Requirement\vbs\All_Password.vbs
set filepath=C:\Windows\SysWOW64\WScript.exe 
if exist C:\Windows\SysWOW64\WScript.exe (start %filepath%%filename% %1 %2 %3 cd) else (start %filename% %1 %2 %3 cd)



