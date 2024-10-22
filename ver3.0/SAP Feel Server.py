# !/usr/bin/env python
# coding=utf-8

import os, sys, platform
import posixpath
import BaseHTTPServer
from SocketServer import ThreadingMixIn

import threading
import urllib, urllib2
import cgi
import shutil
import mimetypes
import re
import time
import json
import urlparse
from urllib import unquote 
import pyodbc
from collections import OrderedDict
from os import curdir
import datetime
import loadsapdata
import logging
import StringIO
#import Image


#---------------------------------------------------------------------------------------------------
#CRITICAL > ERROR > WARNING > INFO > DEBUG > NOTSET
FILE = os.getcwd()
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s:%(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                    datefmt='%a, %d %b %Y %H:%M:%S',
                    filename = os.path.join(FILE,'log.txt'),
                    filemode='w')                        
log = logging.getLogger();
log.setLevel(logging.DEBUG)


#----------------------------------------------------------------------------------------------------

console = logging.StreamHandler()
console.setLevel(logging.INFO)
formatter = logging.Formatter('%(name)-12s: %(levelname)-8s %(message)s')
console.setFormatter(formatter)
logging.getLogger('').addHandler(console)
#----------------------------------------------------------------------------------------------------
#import logging
#LOG_FILENAME = 'log1111.txt'
#logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG,)

#logging.debug('This message should go to the log file')

#try:
#    data1= 1.0
#    data2 = 0.0
#    data = data1/data2
#except:
#    data = 100
#    logging.exception('Got exception on main handler')
#    raise

#----------------------------------------------------------------------------------------------------
# Get a date object 
today = datetime.date.today()

# General functions 
log.info("Year: %d",today.year)
log.info("Month: %d",today.month)
log.info("Day: %d",today.day)
log.info("Weekday: %d",today.weekday())
date = str(today.year)
date = str(today.year) + '-'+str(today.month) +'-'+ str(today.day)
log.info(date)

try:
    from cStringIO import StringIO
except ImportError:
    from StringIO import StringIO

log.info('----------------------------------------------------------------------->> ')
try:
    port = int(sys.argv[1])
except Exception, e:
    log.info( '-------->> Warning: Port is not given, will use deafult port: 8080 ')
    log.info( '-------->> if you want to use other port, please execute: ')
    log.info( '-------->> python SimpleHTTPServerWithUpload.py port ')
    log.info( "-------->> port is a integer and it's range: 1024 < port < 65535 ")
    port = 8080

if not 1024 < port < 65535:  port = 8080
serveraddr = ('172.19.19.29', port)
#serveraddr = ('192.168.0.100', port)
log.info( '-------->> Now, listening at port ' + str(port) + ' ...')
log.info( '-------->> You can visit the URL:   http://localhost:' + str(port))
log.info( '----------------------------------------------------------------------->> ')


log.info( 'begin connet databse')

global cnxn

cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=172.19.54.239',1433;DATABASE=gbtest;UID=sa;PWD=!Honeywell2')
#cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=localhost\\SQLEXPRESS;DATABASE=gbtest;UID=sa;PWD=1qaz2wsX')
log.debug(cnxn)
cnxn.autocommit = True
#cnxn = pyodbc.connect("Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=C:\Users\e883995\Students.accdb;")
log.info( 'connect complete')
cursor = cnxn.cursor()

#connect to the etc_mm database
global cnxn_mm
#cnxn_mm = pyodbc.connect("'DRIVER={SQL Server};SERVER=10.77.82.142,1433;DATABASE=gbtest;UID=sa;PWD=!Honeywell2'")
#cnxn_mm = pyodbc.connect("Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=e:\etc_mm.accdb;")
#cursor_mm = cnxn_mm.cursor()

global cursor_current

mydict={}
i1='eid'
i2='type'
i3='name'
i4='links'

seq=[]
seq.append(i1)
seq.append(i2)
seq.append(i3)
seq.append(i4)
mydict = mydict.fromkeys(seq, 'None')

etc_table = "level2wbs_info"
etc_item0 = "HTS Assigned WBS"
etc_item1 = "HTS WBS Description"
etc_item2 = "ETC Hours"
etc_item3 = "ETC Cost"
etc_item4 = "Aero Project Start Date"
etc_item5 = "Aero Project Finish Date"
etc_item6 = "Aero Close Date"
etc_item_list = []
#etc_item_list.append("[" + etc_item0 + "]")
etc_item_list.append("[" + etc_item1 + "]")
etc_item_list.append("[" + etc_item2 + "]")
etc_item_list.append("[" + etc_item3 + "]")
etc_item_list.append("[" + etc_item4 + "]")
etc_item_list.append("[" + etc_item5 + "]")
etc_items = ""
for li in etc_item_list:
	etc_items = etc_items + li + ","
etc_items = etc_items[:-1]

##############jeffrey####################
etc_item_list_closedate =[]
#etc_item_list_closedate.append("[" + etc_item0 + "]")
etc_item_list_closedate.append("[" + etc_item1 + "]")
etc_item_list_closedate.append("[" + etc_item6 + "]")
etc_items_closedate = ""
for li in etc_item_list_closedate:
	etc_items_closedate = etc_items_closedate + li + ","
etc_items_closedate = etc_items_closedate[:-1]

log.info(etc_items_closedate)
#############jeffrey####################
etc_mm_table = 'ETC_MM'
etc_mm_items = ""
etc_mm_item0 = "HTS Assigned WBS"
etc_mm_item1 = "Estimated Heads"
etc_mm_item2 = "Budget Enough for 1 month"
etc_mm_item3 = "Issues tracking comments"
etc_mm_item4 = "Close more than 1 month"
#############angela####################
etc_mm_item5 = "Current Used Hours"
etc_mm_item6 = "Current Billed Hours"
etc_mm_item7 = "Billing Status"
etc_mm_item8 = "Bad Hours"

web_billing_item0 = "Level 2 WBS"
web_billing_item1 = "Current Used Hours"
web_billing_item2 = "Current Billed Hours"
web_billing_item3 = "Bad Hours"
web_billing_item4 = "Billing Match"
web_billing_item5 = "Issues Tracking Comments"
#############angela####################
etc_mm_item_list = []
#etc_mm_item_list.append("[" + etc_mm_item0 + "]")
etc_mm_item_list.append("[" + etc_mm_item1 + "]")
etc_mm_item_list.append("[" + etc_mm_item2 + "]")
etc_mm_item_list.append("[" + etc_mm_item3 + "]")
for li in etc_mm_item_list:
  etc_mm_items = etc_mm_items + li + ","
etc_mm_items = etc_mm_items[:-1]
#############jeffrey####################
etc_mm_item_list_closedate =[]
etc_mm_item_list_closedate.append("[" + etc_mm_item3 + "]")
etc_mm_item_list_closedate.append("[" + etc_mm_item4 + "]")
etc_mm_items_closedate = ""
for li in etc_mm_item_list_closedate:
	etc_mm_items_closedate = etc_mm_items_closedate + li + ","
etc_mm_items_closedate = etc_mm_items_closedate[:-1]

log.info(etc_mm_items_closedate)
#############jeffrey####################
#############angela####################
# ======================================================================================================================
# global
DMM_set_start_year = 2011  # default is 2011
DMM_set_end_year = 2015
DMM_set_sleep_one_cycle = 120 # default  value is 2mins
DMM_set_sleep_times = 30 # default value is 30
batFileName = "\\\ch01w0103\\2015GBSAPFeel\\Requirement\\vbs\\NoP_32_64.bat"
dataFilePath = "\\\ch01w0103\\2015GBSAPFeel\\Requirement\\Data\\"
# ======================================================================================================================
#only for test
#DMM_set_start_year = 2011  # default is 2011
#DMM_set_sleep_one_cycle = 120 # default  value is 120, 2mins
#DMM_set_sleep_times = 3 # default value is 30
#batFileName = "C:\\test\\vbs\\Test.bat"
#dataFilePath = "C:\\test\\data\\"
# ======================================================================================================================   
global level1_status
global level2_status
level1_status = 1 
level2_status = 1  
# ======================================================================================================================
dmr_table = 'dmr_info'
dmr_item0 = "Aero WBS Number"
dmr_item1 = "Labor Hours "
dmr_item2 = "DMR Creation Date"
dmr_item3 = "Material No"
timesheet_table = 'Timesheet'
timesheet_tothours =  "Tot Hours"
timesheet_date =  "Work Date"

phase_mm_table = 'phase_info'
phase_mm_item0 = "project id"
phase_mm_item1 = "phase"
phase_mm_item2 = "subphase"

aewa_table = 'AEWA_info'
aewa_item0 = "WBS ID"
aewa_item1 = "Funding Hr"
aewa_item2 = "System Status"
aewa_item3 = "User Status"

OnOffStatus_item0 = "Level2 WBS"
OnOffStatus_item1 = "Create Date"
OnOffStatus_item2 = "On/Off Site Status"
OnOffStatus_item3 = "Labor Hours"


WBSOver_item0 = "HTS WBS ID"
WBSOver_item1 = "HTS WBS Description"
WBSOver_item2 = "Billing Match"
WBSOver_item3 = "Budget Enough for 1 month"
WBSOver_item4 = "Close more than 1 month"
WBSOver_item5 = "Issues Tracking Comments"
#############angela####################
mywbsdict={}
wbs1='Aero Network'
wbs2='Aero Activity Num'
wbs3='Aero Key Code'
wbs4='HTS Assigned WBS'
wbs5='HTS WBS Description'
wbs6='WBS Person Responsible'
wbs7='System Status'
wbs8='User Status'
wbs9='Active Status'

wbsseq=[]
wbsseq.append(wbs1)
wbsseq.append(wbs2)
wbsseq.append(wbs3)
wbsseq.append(wbs4)
wbsseq.append(wbs5)
wbsseq.append(wbs6)
wbsseq.append(wbs7)
wbsseq.append(wbs8)
wbsseq.append(wbs9)

mywbsdict = mywbsdict.fromkeys(wbsseq, 'None')

log.info(mydict)

def isNum2(value):
    try:
        x = float(value)
    except TypeError:
        return False
    except ValueError:
        return False
    except Exception, e:
        return False
    else:
        return True

def sizeof_fmt(num):
    for x in ['bytes', 'KB', 'MB', 'GB']:
        if num < 1024.0:
            return "%3.1f%s" % (num, x)
        num /= 1024.0
    return "%3.1f%s" % (num, 'TB')


def modification_date(filename):
    # t = os.path.getmtime(filename)
    # return datetime.datetime.fromtimestamp(t)
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(os.path.getmtime(filename)))


class SimpleHTTPRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    """Simple HTTP request handler with GET/HEAD/POST commands.

    This serves files from the current directory and any of its
    subdirectories.  The MIME type for files is determined by
    calling the .guess_type() method. And can reveive file uploaded
    by client.

    The GET/HEAD/POST requests are identical except that the HEAD
    request omits the actual contents of the file.

    """

    def do_GET(self):
        """
        """
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        parsed_path = urlparse.urlparse(self.path)
        ipdata = self.client_address      
        log.info(" %s ",(self.path))    
       # print self.path.split('/')
        sStr1 = self.path.split('/')
        log.info(sStr1)
        if sStr1[1] == "keycodemanagement":
            if "get" in sStr1[2]:
                para = sStr1[2].split('?')
                eidinfo = para[1].split('=')
                self.read_keycode_infor(eidinfo[1])
        if sStr1[1] == "statuschecking":
            if sStr1[2] == "budgetusage":
                if "refresh" in sStr1[3]:
                    para = sStr1[3].split('?')
                    if para[0] == "refresh":
                        eidinfo = para[1].split('=')
                        self.read_etc_info(parsed_path,eidinfo[1])
            elif sStr1[2] == "closedate":
                if "refresh" in sStr1[3]:
                    para = sStr1[3].split('?')
                    if para[0] == "refresh":
                        eidinfo = para[1].split('=')
                        self.read_etc_info_closedate(parsed_path,eidinfo[1])
            elif sStr1[2] == "onoff":
                if "get" in sStr1[3]:
                    para = sStr1[3].split('?')
                    paras = para[1].split('&')
                    if len(paras)>1:
                        eid = paras[0].split('=')[1]
                        startdate = paras[1].split('=')[1]
                        enddate = paras[2].split('=')[1]

                        startyear =startdate.split('.')[0]
                        startmonth =startdate.split('.')[1]
                        startday =startdate.split('.')[2]
                        start_d = datetime.datetime(int(startyear),int(startmonth), int(startday))
                        endyear =enddate.split('.')[0]
                        endmonth =enddate.split('.')[1]
                        endday =enddate.split('.')[2]
                        end_d = datetime.datetime(int(endyear),int(endmonth), int(endday))
                        self.read_onoff_infor(eid,start_d,end_d)
                    else:
                        eid = paras[0].split('=')[1]
                        currentyear =time.strftime("%Y")
                        currentmonth =time.strftime("%m")
                        currentdate =time.strftime("%d")
                        end_d = datetime.datetime(int(currentyear),int(currentmonth), int(currentdate))
                        start_d = end_d + datetime.timedelta(-60)
                        self.read_onoff_infor(eid,start_d,end_d)
            elif sStr1[2] == "timesheetbilling":
                if "refresh" in sStr1[3]:
                    para = sStr1[3].split('?')
                    if para[0] == "refresh":
                        eidinfo = para[1].split('=')
                        self.read_etc_info_billing(parsed_path,eidinfo[1])
            #elif sStr1[2] == "timesheetfilling":
            #    log.info("Phase function, %s",sStr1)
            #    if "getSupervisors" == sStr1[3]:
            #         self.read_supervisor_info_filling(parsed_path)
        if sStr1[1] == "overviewwbs":
            if "refresh" in sStr1[2]:
                eidinfo = sStr1[2].split('=')[1]
                self.get_wbs_overview(eidinfo)
        if sStr1[1] == "accountManage":
            if sStr1[2] == "admin":
                if sStr1[3] == "current":
                    if sStr1[4] == "refreshAccountList":
                        self.read_account_info(parsed_path)				
                    elif 'resetAccount' in sStr1[4]:
                        data = sStr1[4].split('=')
                        self.write_db('account_info', 1, 'eid', data[1], 'password', data[1])
                elif sStr1[3] =="project":
                    if sStr1[4] == "refreshProject":
                        seq=[]
                        seq.append('description')
                        seq.append('definition')
                        seq.append('id')
                        self.read_db('project_info', seq)
        elif sStr1[1] == '':
            fp = open(curdir + '\\pages\\login.html') 
            self.wfile.write(fp.read())
        elif sStr1[1] == 'main':
            fp = open(curdir + '\\pages\\main_dynamic.html') 
            self.wfile.write(fp.read())
        elif sStr1[1] == 'css':
            fp = open(curdir + '\\css\\mycss.css') 
            self.wfile.write(fp.read())
        elif sStr1[1] == 'js':
            #if sStr1[2]  == 'MainPage1.jpg':
                #fp = open(curdir + '\\js\\MainPage1.jpg')
                #log.debug(curdir + '\\js\\MainPage1.jpg')
            #    jpgfile = Image.open('MainPage1.jpg')
            #    log.info(jpgfile)
            #    self.wfile.write(jpgfile.read())   
            #    log.info(jpgfile)  
            #    log.info(curdir)        	
            if sStr1[2] == 'jquery.js':
                fp = open(curdir + '\\js\\jquery.js') 
                self.wfile.write(fp.read())
            if sStr1[2] == 'Menu.js':
                fp = open(curdir + '\\js\\Menu.js')
                self.wfile.write(fp.read())
            if sStr1[2] == 'Utils.js':
                fp = open(curdir + '\\js\\Utils.js')
                self.wfile.write(fp.read())
            if sStr1[2] == 'MainFuncts.js':
                fp = open(curdir + '\\js\\MainFuncts.js')
                self.wfile.write(fp.read())     
            if sStr1[2] == 'Account.js':    
                fp = open(curdir + '\\js\\Account.js')
                self.wfile.write(fp.read())
            if sStr1[2] == 'dynamic_test.js':
                fp = open(curdir + '\\js\\dynamic_test.js')
                self.wfile.write(fp.read())
            if sStr1[2] == 'Customize.js':
                fp = open(curdir + '\\js\\Customize.js')
                self.wfile.write(fp.read())
            if sStr1[2] == 'Bigdata.js':
                fp = open(curdir + '\\js\\Bigdata.js')
                self.wfile.write(fp.read())	
            if sStr1[2] == 'StatusCheck.js':
                fp = open(curdir + '\\js\\StatusCheck.js')
                self.wfile.write(fp.read())	
            if sStr1[2] == 'OverviewWBS.js':
                fp = open(curdir + '\\js\\OverviewWBS.js')
                self.wfile.write(fp.read())	     
            if sStr1[2] == 'DataManagement.js':
                fp = open(curdir + '\\js\\DataManagement.js')
                self.wfile.write(fp.read())	     
            if sStr1[2] == 'KeycodeManagement.js':
                fp = open(curdir + '\\js\\KeycodeManagement.js')
                self.wfile.write(fp.read())	                                        
        elif sStr1[1] == 'fusioncharts':
            if sStr1[2] == 'fusioncharts.js':
                fp = open(curdir + '\\fusioncharts\\fusioncharts.js') 
                self.wfile.write(fp.read()) 
            if sStr1[2] == 'fusioncharts.charts.js':
                fp = open(curdir + '\\fusioncharts\\fusioncharts.charts.js') 
                self.wfile.write(fp.read()) 
            if sStr1[2] == 'fusioncharts.gantt.js':
                fp = open(curdir + '\\fusioncharts\\fusioncharts.gantt.js') 
                self.wfile.write(fp.read()) 
            if sStr1[2] == 'fusioncharts.maps.js':
                fp = open(curdir + '\\fusioncharts\\fusioncharts.maps.js') 
                self.wfile.write(fp.read())         
            if sStr1[2] == 'fusioncharts.powercharts.js':
                fp = open(curdir + '\\fusioncharts\\fusioncharts.powercharts.js') 
                self.wfile.write(fp.read())  
            if sStr1[2] == 'fusioncharts.widgets.js':
                fp = open(curdir + '\\fusioncharts\\fusioncharts.widgets.js') 
                self.wfile.write(fp.read())    
        elif sStr1[1] == 'images':
            #if sStr1[2]  == 'MainPage1.jpg':
                #fp = open(curdir + '\\js\\MainPage1.jpg') 
            #    jpgfile = Image.open(curdir + '\\js\\MainPage1.jpg')
            #    log.info(jpgfile)
            #    self.wfile.write(jpgfile.read())   
            #    log.info(jpgfile)  
            #    log.info(curdir)     
            #if sStr1[2]  == 'MainPage2.jpg':
            #    fp = open(curdir + '\\js\\MainPage2.jpg') 
            #    self.wfile.write(fp.read())   
            #    log.info(fp)  
            #    log.info(curdir)       
            if sStr1[2] == 'Huangwenxin.JPG':
                fp = open(curdir + '\\images\\Huangwenxin.JPG') 
                self.wfile.write(fp.read())   
                log.info(fp)  
                log.info(curdir)
            if sStr1[2] == 'DingXiaofang.jpg':
                fp = open(curdir + '\\images\\DingXiaofang.jpg') 
                self.wfile.write(fp.read())   
                log.info(fp)                                                                                                                
        elif sStr1[1]=='updateTimesheet':
            log.debug(sStr1)
            if sStr1[2] == 'DA':         	
                if(sStr1[3]=='BJ'):
                    cur_status = self.proc_timesheet_add(sStr1)
                    sStr1[3] = 'SH' 
                    cur_status |= self.proc_timesheet_add(sStr1)
                    if cur_status == 1:
                        self.wfile.write('OK')
                    else:
                        self.wfile.write('ERR')    	
            elif sStr1[2] == 'DTA':
                if(sStr1[3]=='BJ'):
                    cur_status = self.proc_timesheet_del_add(sStr1)
                    sStr1[3] = 'SH'
                    cur_status |= self.proc_timesheet_del_add(sStr1)
                    if cur_status == 1:
                        self.wfile.write('OK')
                    else:
                        self.wfile.write('ERR') 
            elif sStr1[2] == 'clear':
                try:
                    loadsapdata.clear_timesheet(cnxn, cursor)
                    self.wfile.write('OK')
                except:
        		        self.wfile.write('ERR')

        elif sStr1[1]=='updateETC':
            if sStr1[2] == 'BJ':
                cur_status = self.proc_etc(sStr1)
                sStr1[2] = 'SH'
                cur_status |= self.proc_etc(sStr1)
                if cur_status == 1:
                    self.wfile.write('OK')
                else:
                    self.wfile.write('ERR')                 

        elif sStr1[1]=='updateDMR':
            if sStr1[2] == 'BJ':    
                cur_status = self.proc_dmr(sStr1)
                sStr1[2] = 'SH'     
                cur_status |= self.proc_dmr(sStr1)
                if cur_status == 1:
                    self.wfile.write('OK')
                else:
                    self.wfile.write('ERR')  
        elif sStr1[1]=='updateCN43N':
            try:
                loadsapdata.load_AEWA(cnxn, cursor)
                self.wfile.write('OK')
            except:
        		    self.wfile.write('ERR')
        elif sStr1[1]=='clearTimesheet':
            try:
                cursor.execute("delete from Timesheet")
                self.wfile.write('OK')
            except:
                self.wfile.write('ERR')
        elif sStr1[1] == 'all':
            if (sStr1[2] == 'clear') :
                try:
                    cursor.execute("delete from Timesheet")
                    cursor.execute("delete from level2wbs_info") 
                    cursor.execute("delete from dmr_info")
                    cursor.execute("delete from AEWA_info")
                    cursor.commit();
                    self.wfile.write('OK')
                except:
                    self.wfile.write('ERR')                                
        elif sStr1[1] == 'getUser':
            #get host ip and then get eid from login status table, then get name\type according to eid 
            ipdata = self.client_address
            stList = "'" + ipdata[0] + "'"
            stEid = self.check_db('login_status', 2, 'ip', stList,1)
            if stEid == None:
                self.wfile.write("NO_LOGIN_USER")
            else:
                stList = "'" + stEid + "'"
                stType = self.check_db('account_info', 2, 'eid', stList,2)
                stName = self.check_db('account_info', 2, 'eid', stList,3)
                stList = "{'eid':'"+stEid.rstrip()+"', 'name':'"+stName.rstrip()+"', 'type':'"+stType.rstrip() +"'}"
                self.wfile.write(stList)
        elif sStr1[1] == 'leave':     
            ipdata = self.client_address
            stList = "'" + ipdata[0] + "'"
            self.write_db('login_status', 2, 'ip', stList,'', '')
            self.wfile.write("OK")
            log.info(stList)
        elif sStr1[1] == 'customize':
            if sStr1[2] == 'level2':	
                if ('refresh' in sStr1[3]):                           	
                #if ('refresh' in sStr1[3]) & (level2_status == 1):    
                    #log.info("level2_status = %d",level2_status)                     	  
                    level2_status = 0                
                    data = sStr1[3].split('=')
                    self.read_wbs_info(data[1])
                    level2_status = 1  
                    log.info("level2_status = %d",level2_status)
                    #self.read_level1_wbs_info(data[1])
            elif sStr1[2] == 'level1' :   
                if ('refresh' in sStr1[3]) :
                #if ('refresh' in sStr1[3])  (level1_status == 1):
                    #log.info("level2_status = %d",level1_status)
                    level1_status = 0              	
                    data = sStr1[3].split('=')
                    #self.read_wbs_info(data[1])
                    self.read_level1_wbs_info(data[1])
                    level1_status = 1       
                    log.info("level2_status = %d",level1_status)
        elif sStr1[1] == 'projectmanage':
            if sStr1[2] == 'phasemanagement':
                if 'get' in sStr1[3]:
                    para = sStr1[3].split('=')
                    if para == None:
                        return
                    projectid = para[1]
                    emp = '[Phase], [Sub Phase]'
                    cursor.execute("select distinct %s from %s where [Project Def] = '%s';" %(emp, "Timesheet",projectid))
                    phaseinfor = cursor.fetchall()
                    retProj = "["
                    for i in range(len(phaseinfor)):
                        if i!=0:
                            retProj = retProj + ","
                        spe = phaseinfor[i]
                        tmp1 = str(spe[0])
                        tmp2 = str(spe[1])
                        line = self.check_db(phase_mm_table,1,"["+phase_mm_item0+"],"+phase_mm_item1+","+phase_mm_item2,"'"+projectid+"','"+tmp1+"','"+tmp2+"'",0)
                        flag = 'true'
                        if line == 0:
                            flag = 'false'
                        retProj = retProj +"{'Phase':'" + tmp1 +"', 'Sub Phase':'"+ tmp2 + "','Status':'" + flag + "'}"
                    retProj = retProj + "]"
                    print retProj
                    self.wfile.write(retProj)
        elif sStr1[1] == "bigData":  
            if sStr1[2] == 'timesheet':     
                if 'getAllWBS' in sStr1[3]:
                    try:
                        proj = self.check_db('Timesheet', 3, '[Project Def], [Project Description]', '','')
                    except:
                        log.warning('getAllWBS error')
                        return
                    #print '-------------------------getAllWBS-----------------------------'
                    log.debug(proj)
                    retProj = "{'Proj':["
                    for i in range(len(proj)):
                        if i!=0:
                            retProj = retProj + ","
                        spe = proj[i]
                        proDef = str(spe[0])
                        proDes = str(spe[1])
                        retProj = retProj +"{'Project Def':'" + proDef +"', 'Project Description':'"+ proDes +"'}"
                    retProj = retProj + "],"
                    #print proj
                    log.debug(retProj)
                    level1 = '[Level 1 WBS], [Level 1 WBS Description]'                     
                    level1 = self.check_db('Timesheet', 3, level1, '','')
                    retProj = retProj +"'Level 1':["
                    for i in range(len(level1)):
                        if i!=0:
                            retProj = retProj + ","
                        spe = level1[i]
                        wbs = str(spe[0])
                        wbsDes = str(spe[1])
                        retProj = retProj +"{'Level 1 WBS':'" + wbs +"', 'Level 1 WBS Description':'"+ wbsDes +"'}"
                    retProj = retProj + "],"
                    #print level1
                    #log.debug(retProj)
                    level2 = '[WBS Element], [WBS Element Description]'                     
                    level2 = self.check_db('Timesheet', 3, level2, '','')
                    retProj = retProj + "'Level 2':["
                    for i in range(len(level2)):
                        if i!=0:
                            retProj = retProj + ","
                        spe = level2[i]
                        wbs = str(spe[0])
                        wbsDes = str(spe[1])
                        retProj = retProj +"{'WBS Element':'" + wbs +"', 'WBS Element Description':'"+ wbsDes +"'}"
                    retProj = retProj + "]}"                
                    #log.debug(level2)
										#log.debug(retProj)
                    self.wfile.write(retProj)      
                    log.debug(retProj)
                    
                elif 'getAllEid' in sStr1[3]:
                    emp = '[Emp ID],[Employee Name]' 
                    #print '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n\n\n\n\n'	
                    try:
                        emp = self.check_db('Timesheet', 3, emp, '','')
                    except:
                        log.warning('getAllEid error')
                        return	   	    
                    retProj = "["
                    for i in range(len(emp)):
                        if i!=0:
                            retProj = retProj + ","
                        spe = emp[i]
                        empID = str(spe[0])
                        empName = str(spe[1])
                        retProj = retProj +"{'Emp ID':'" + empID +"', 'Employee Name':'"+ empName +"'}"
                    retProj = retProj + "]" 
                    self.wfile.write(retProj)
            elif sStr1[2] == 'copq':        
                if 'getPhasePair' in sStr1[3]:                  
                    #print '^^^^^^^^^^^^^^^^^^^^getPhasePair^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'
                    emp = '[Phase], [Sub Phase]'                        
                    try:
                        emp = self.check_db('Timesheet', 3, emp, '','')
                    except:
                        log.warning('getPhasePair error')
                        return
                    retProj = "["
                    for i in range(len(emp)):
                        if i!=0:
                            retProj = retProj + ","
                        spe = emp[i]
                        tmp1 = str(spe[0])
                        tmp2 = str(spe[1])
                        retProj = retProj +"{'Phase':'" + tmp1 +"', 'Sub Phase':'"+ tmp2 +"'}"
                    retProj = retProj + "]"             
                    #print emp
                    #print retProj
                    self.wfile.write(retProj)                   
                    

    def do_HEAD(self):
        """Serve a HEAD request."""
        f = self.send_head()
        if f:
            f.close()


    def do_POST(self):
        """
        """
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        parsed_path = urlparse.urlparse(self.path)
        log.info('**************************')
        log.info(" %s ",self.path)
        log.info(self.path.split('/'))
        sStr1 = self.path.split('/')
        log.info(sStr1)
        if sStr1[1] == "keycodemanagement":
            if "post" in sStr1[2]:
                length = self.headers['content-length']
                data = self.rfile.read(int(length))
                data = data.split('&')
                eid = data[0].split('=')[1]
                count = (len(data)-1)/2
                cursor.execute("delete from [account_level2wbs_relation] where [eid] = '%s';" %(eid))
                for i in range(count):
                    wps1 = data[i+1].split('=')[1]
                    wps2 = data[i+count+1].split('=')[1]
                    stList = "'"+eid+"','"+wps2+"','"+wps1+"'"
                    self.write_db('account_level2wbs_relation', 3, 'eid, [HTS Assigned WBS], [Level1 WBS]', stList,'', '')
				level2_status = 0
                self.read_wbs_info(eid)
                level2_status = 1
                log.info("level2_status = %d",level2_status)
        if sStr1[1] == "accountManage":
            if sStr1[2] == "admin":
                if sStr1[3] == "new":
                    if sStr1[4] == "createAccount":
                        length = self.headers['content-length'] 
                        data = self.rfile.read(int(length))
                        data = data.split('&')
                        stEid = data[0].split('=')
                        stName = data[1].split('=')
                        log.debug(stName)
                        stName[1] = stName[1].replace('+', ' ')
                        stName[1] = unquote(stName[1])
                        log.debug(stName)
                        #search if the eid existed
                        stList = "'"+stEid[1]+"'"
                        LineNum = self.check_db('account_info',1,'eid', stList, 0)
                        if LineNum != 0:
                            self.wfile.write("ACCOUNT_EXISTED")
                        else:
                            stList = "'"+stEid[1]+"','"+stEid[1]+"',"+"'Project',"+"'"+stName[1]+"'"
                            self.write_db('account_info', 3, 'eid, password, type, name', stList,'','')
                            self.wfile.write("OK")
                elif sStr1[3] == "current":
                    if sStr1[4] =="removeAccount":
                        length = self.headers['content-length']  
                        data = self.rfile.read(int(length))
                        data = data.split('=')
                        data[1] = "'" + data[1] + "'"
                        log.debug(data)
                        LineNum = self.check_db('login_status',1,'eid', data[1], 0)
                        if LineNum != 0:   #the eid has login
                            self.wfile.write("ACCOUNT_LOGIN")
                            log.info("the eid has login")
                        else:
                            self.write_db('account_info', 2, 'eid', data[1],'', '')
                            self.write_db('account_project_relation', 2, 'eid', data[1],'', '')
                            self.wfile.write("OK")
                            log.info("add the eid")
                    elif sStr1[4] =="saveProjectLinks":
                        length = self.headers['content-length']  
                        data = self.rfile.read(int(length))
                        data = data.split('&')
                        stEid = data[0].split('=')
                        stList = "'" + stEid[1] + "'"
                        self.write_db('account_project_relation', 2, 'eid', stList,'', '')
                        for i in range(len(data)):
                            if i!=0:
                                stDef = data[i].split('=')            
                        	stDef[1] = stDef[1].replace('+', ' ')
                        	stDef[1] = unquote(stDef[1])          
                                stList = "'"+stEid[1]+"','"+stDef[1]+"'"
                                self.write_db('account_project_relation', 3, 'eid, definition', stList,'', '')
                elif sStr1[3] =="project":
                    if sStr1[4] =="newProject":
                        length = self.headers['content-length'] 
                        data = self.rfile.read(int(length))
                        data = data.split('&')
                        stDef = data[0].split('=')
                        stDes = data[1].split('=')                        
                        stDef[1] = stDef[1].replace('+', ' ')
                        stDef[1] = unquote(stDef[1])          
                        stDes[1] = stDes[1].replace('+', ' ')
                        stDes[1] = unquote(stDes[1])
                        stList = "'"+stDes[1]+"','"+stDef[1]+"'"
                        self.write_db('project_info', 3, 'description, definition', stList,'', '')
                    elif sStr1[4] =="editProject":
                        length = self.headers['content-length'] 
                        data = self.rfile.read(int(length))
                        data = data.split('&')
                        stDef = data[0].split('=')
                        stDes = data[1].split('=')                      
                        stDef[1] = stDef[1].replace('+', ' ')
                        stDef[1] = unquote(stDef[1])          
                        stDes[1] = stDes[1].replace('+', ' ')
                        stDes[1] = unquote(stDes[1])
                        self.write_db('project_info', 1, 'definition', stDef[1], 'description', stDes[1])
                    elif sStr1[4] =="removeProject":
                        length = self.headers['content-length']
                        data = self.rfile.read(int(length))
                        data = data.split('&')
                        stDef = data[0].split('=')
                        stDes = data[1].split('=')                   
                        stDef[1] = stDef[1].replace('+', ' ')
                        stDef[1] = unquote(stDef[1])          
                        stDes[1] = stDes[1].replace('+', ' ')
                        stDes[1] = unquote(stDes[1])                        
                        stList = "'"+stDes[1]+"','"+stDef[1]+"'"
                        stRel = "'" + stDef[1] + "'"
                        self.write_db('project_info', 2, 'description, definition', stList,'', '')
                        self.write_db('account_project_relation', 2, 'definition', stRel,'', '')
            elif sStr1[2] =="project":
                if sStr1[3] =="passwordChange":
                    length = self.headers['content-length']  
                    data = self.rfile.read(int(length)) 
                    data = data.split('&')
                    stEid = data[0].split('=')
                    stOld = data[1].split('=')
                    stNew = data[2].split('=')
                    #search if the eid existed
                    stList = "'"+stEid[1]+"','"+stOld[1]+"'"
                    LineNum = self.check_db('account_info', 1, 'eid, password', stList,0)
                    if LineNum == 0:
                        self.wfile.write("OLD_PWD_WRONG")
                    else:
                        self.write_db('account_info', 1, 'eid', stEid[1], 'password', stNew[1])
                        self.wfile.write("OK")
        elif sStr1[1] == "login":
            length = self.headers['content-length']  
            data = self.rfile.read(int(length))
            data = data.split('&')
            stEid = data[0].split('=')
            stPwd = data[1].split('=')  
            stList1 = "'"+stEid[1]+"','"+stPwd[1]+"'"
            log.info(stList1)
            LineNum = self.check_db('account_info', 1, 'eid, password', stList1,0)
            stList2 = "'" + stEid[1] + "'"
            if LineNum == 0:
                LineNum = self.check_db('account_info', 1, 'eid', stList2,0)
                if LineNum == 0:
                    self.wfile.write("NON_EXIST_ACCOUNT")
                    log.warning('no exist')
                else:
                    self.wfile.write("WRONG_PASSWORD")
                    log.warning('wrong password')
            else: 
                ipdata = self.client_address
                stList3 = "'" + ipdata[0] + "'"
                LineNum1 = self.check_db('login_status', 1, 'ip', stList3,0)
                LineNum2 = self.check_db('login_status', 1, 'eid', stList2,0)
                if LineNum2 != 0:
                    #get login date according to eid
                    CurDate = self.check_db('login_status', 2, 'eid', stList2,2)
                    if cmp(CurDate,date) != 0:  #check if overtime
                        self.write_db('login_status', 2, 'eid', stList2,'', '')  #delete table by eid
                        stList = "'"+ipdata[0]+"','"+stEid[1]+"','"+ date +"'"
                        self.write_db('login_status', 3, 'ip, eid, login_time', stList,'', '')
                        self.wfile.write("OK")
                        log.warning('eid login overtime')
                    else:
                        self.wfile.write("EID_LOGIN")
                        log.warning('eid login exist')                
                elif LineNum1 != 0:
                    #get login date according to ip
                    CurDate = self.check_db('login_status', 2, 'ip', stList3,2)
                    if cmp(CurDate,date) != 0:  
                        self.write_db('login_status', 2, 'ip', stList3,'', '')  #delete table by ip
                        stList = "'"+ipdata[0]+"','"+stEid[1]+"','"+ date +"'"
                        self.write_db('login_status', 3, 'ip, eid, login_time', stList,'', '')
                        self.wfile.write("OK")
                        log.warning('ip login overtime')
                    else:
                        self.wfile.write("IP_LOGIN")
                        log.warning('ip login exist')
                else:           
                    #add a table in login_status
                    stList = "'"+ipdata[0]+"','"+stEid[1]+"','"+ date +"'"                    
                    self.write_db('login_status', 3, 'ip, eid, login_time', stList,'', '')
                    self.wfile.write("OK")
                    log.info("add a table in login_status")
                    log.info(stList)
        elif sStr1[1] == 'customize':
            if sStr1[2] == 'level2':   			
                if sStr1[3] == "activate":
                    length = self.headers['content-length']  
                    data = self.rfile.read(int(length))
                    data = data.split('&')
                    stEid = data[0].split('=')
                    stWbs = data[1].split('=')
                    cur_level2_wbs = stWbs[1];
                    cur_level1_wbs = cur_level2_wbs[0:15]
                    # add level1 wbs to account_level2wbs_relation
                    stList = "'"+stEid[1]+"','"+cur_level2_wbs+"','"+cur_level1_wbs+"'"
                    self.write_db('account_level2wbs_relation', 3, 'eid, [HTS Assigned WBS], [Level1 WBS]', stList,'', '')

                elif sStr1[3] == "deactivate":
                    length = self.headers['content-length']
                    data = self.rfile.read(int(length))
                    data = data.split('&')
                    stEid = data[0].split('=')
                    stWbs = data[1].split('=')
                    stList = ''
                    stList = "'"+stEid[1]+"','"+stWbs[1]+"'"
                    #stStatus = 'deactive'
                    #stList = stList +"','"+ stStatus+"'"
                    self.write_db('account_level2wbs_relation', 2, 'eid, [HTS Assigned WBS]', stList,'', '')
                    #self.write_db('account_level1wbs_relation', 2, 'eid, [level1 wbs]', stList,'', '')
            if sStr1[2] == 'level1':  # bug, Adam need to fix
                if sStr1[3] == "activate":
                    length = self.headers['content-length']
                    data = self.rfile.read(int(length))
                    data = data.split('&')
                    stEid = data[0].split('=')
                    stWbs = data[1].split('=')
                    stList = "'"+stEid[1]+"','"+stWbs[1]+"'"
                    log.info(stList)
                    #self.write_db('account_level1wbs_relation', 3, 'eid, [level1 wbs]', stList,'', '')
                    #---------------------------------------------------------------------------------------------------
                    #get all the relevant level2 wbs from etc information
                    #Need to active all the level2 wbs below the level1 wbs, including level1 wbs itself
                    (all_row_info,row_number ) =  self.get_table_info('[HTS Assigned WBS]','level2wbs_info')
                    list_l2 = [];
                    for i in range(row_number):
                        ele_l2 = str(all_row_info[i][0])   # get the level2 wbs
                        ele_l1 = ele_l2[0:15]  # get the level 1 wbs
                        if stWbs[1] in ele_l2:
                            tmp_str =  "'" + stEid[1] + "','" + ele_l2 + "','" + ele_l1+ "'"
                            list_l2.append(tmp_str)
                    #--------------------------------------------------------------------------------------------------=
                    # insert level1/level2 wbs into sql table
                    log.debug("Active level2, len = %d",len(list_l2))
                    for term in (list_l2):
                        #self.write_db('account_level2wbs_relation', 2, 'eid, [HTS Assigned WBS]', term,'', '')
                        self.write_db('account_level2wbs_relation', 3, 'eid, [HTS Assigned WBS], [Level1 WBS]', term,'', '')
                    #===================================================================================================
            #if sStr1[2] == 'level':  # bug, Adam need to fix
                if sStr1[3] == "deactivate":
                    length = self.headers['content-length']
                    data = self.rfile.read(int(length))
                    data = data.split('&')
                    stEid = data[0].split('=')
                    stWbs = data[1].split('=')
                    stList = "'"+stEid[1]+"','"+stWbs[1]+"'"
                    #self.write_db('account_level2wbs_relation', 2, 'eid, [HTS Assigned WBS]', stList,'', '')
                    self.write_db('account_level2wbs_relation', 2, 'eid, [Level1 wbs]', stList,'', '')

        if sStr1[1] == "overviewwbs":
            if "edit" in sStr1[2]:
                data = self.rfile.read(int(self.headers['content-length']))
                update_data = data.replace('+',' ').split('&')
                update_dict ={}
                for item in update_data:
                    data_key_value = item.split('=')
                    update_dict[data_key_value[0]] = data_key_value[1]
                # Check if the record exist in etc_mm_table
                line = self.check_db(etc_mm_table,1,"[" + etc_mm_item0 + "]", "'" + update_dict[WBSOver_item0] + "'",0)
                if line != 0:
					self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[WBSOver_item0],"[" + etc_mm_item7 + "]",update_dict[WBSOver_item2])
					self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[WBSOver_item0],"[" + etc_mm_item2 + "]",update_dict[WBSOver_item3])
					self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[WBSOver_item0],"[" + etc_mm_item4 + "]",update_dict[WBSOver_item4])
					self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[WBSOver_item0],"[" + etc_mm_item3 + "]",update_dict[WBSOver_item5])
                else:
                    update_dict[etc_mm_item1] = str(" ")
                    update_dict[etc_mm_item5] = str(" ")
                    update_dict[etc_mm_item6] = str(" ")
                    update_dict[etc_mm_item8] = str("0")
                    strA = "[" + etc_mm_item0 + "],"
                    strA = strA + "[" + etc_mm_item1 + "],"
                    strA = strA + "[" + etc_mm_item2 + "],"
                    strA = strA + "[" + etc_mm_item3 + "],"
                    strA = strA + "[" + etc_mm_item4 + "],"
                    strA = strA + "[" + etc_mm_item5 + "],"
                    strA = strA + "[" + etc_mm_item6 + "],"
                    strA = strA + "[" + etc_mm_item7 + "],"
                    strA = strA + "[" + etc_mm_item8 + "]"
                    valueA = "'" + update_dict[WBSOver_item0] + "'" + ","
                    valueA = valueA + "'" + update_dict[etc_mm_item1] + "'" + ","
                    valueA = valueA + "'" + update_dict[WBSOver_item3] + "'" + ","
                    valueA = valueA + "'" + update_dict[WBSOver_item5] + "'" + ","
                    valueA = valueA + "'" + update_dict[WBSOver_item4] + "'" + ","
                    valueA = valueA + "'" + update_dict[etc_mm_item5] + "'" + ","
                    valueA = valueA + "'" + update_dict[etc_mm_item6] + "'" + ","
                    valueA = valueA + "'" + update_dict[WBSOver_item2] + "'" + ","
                    valueA = valueA + "'" + update_dict[etc_mm_item8] + "'"
                    self.write_db(etc_mm_table,3,strA,valueA,'','')
            if "timechart" in sStr1[2]:
                    if "post" in sStr1[3]:
                        data = self.rfile.read(int(self.headers['content-length']))
                        self.get_wbs_hours(data)
            if "Gantt" in sStr1[2]:
                log.debug(sStr1)
                length = self.headers['content-length']
                data = self.rfile.read(int(length))
                data = data.split('&')
                result=[]
                for i in range(len(data)):
                    str1 = data[i].split('=')
                    result.append(str1[1])

                #stEid = data[0].split('=')
                #stWbs = data[1].split('=')
                #stList = "'"+stEid[1]+"','"+stWbs[1]+"'"
                log.info(result)
                self.get_wbs_gannt(result)

        elif sStr1[1] == 'projectmanage':
            if sStr1[2] == 'phasemanagement':
                if sStr1[3] == "post":
                    length = self.headers['content-length']
                    phaseinfors = self.rfile.read(int(length))
                    if (len(phaseinfors) <= 4):
                        return
                    projectid = phaseinfors.split('&')
                    projectid = projectid[0].split('=')[1]
                    if projectid == None:
                        return
                    self.write_db(phase_mm_table,2,"["+phase_mm_item0+"]","'"+projectid+"'",'','')
                    #phaseinfors = "[{'Phase':'CODING', 'Sub Phase':'DO','Status':'true'}&{'Phase':'CODING', 'Sub Phase':'REWORK','Status':'false'}&{'Phase':'DETAILED_DESIGN', 'Sub Phase':'DO','Status':'false'}&{'Phase':'ENGINEERING_SUPPORT', 'Sub Phase':'DO','Status':'false'}&{'Phase':'IMPLEMENTATION', 'Sub Phase':'CHECK','Status':'false'}]"
                    phaseinfors = phaseinfors.split('&')[1]
                    phaseinfors = phaseinfors.split('=')[1]
                    phaseinfors = phaseinfors.split("!")
                    index = 0
                    for phaseinfor in phaseinfors:
                        phaseinforTmp =  phaseinfor.split('-')
                        phase = phaseinforTmp[0].split('*')[1]
                        subphase = phaseinforTmp[1].split('*')[1]
                        #print phase
                        self.write_db(phase_mm_table, 3, "["+phase_mm_item0+"],"+phase_mm_item1+","+phase_mm_item2, "'"+projectid +"','"+phase+"','"+subphase+"'",'', '')

                elif sStr1[3] == "deactivate":
                    length = self.headers['content-length']  
                    data = self.rfile.read(int(length))
                    data = data.split('&')
                    stEid = data[0].split('=')
                    stWbs = data[1].split('=')
                    stList = "'"+stEid[1]+"','"+stWbs[1]+"'"
                    self.write_db('account_level2wbs_relation', 2, 'eid, [HTS Assigned WBS]', stList,'', '')
        elif sStr1[1] == "statuschecking":
            log.debug(sStr1)
            if sStr1[2] == "budgetusage":
                if sStr1[3] == "edit":
                    data = self.rfile.read(int(self.headers['content-length']))
                    update_data = data.replace('+',' ').split('&')
                    update_dict ={}
                    for item in update_data:
                      data_key_value = item.split('=')
                      update_dict[data_key_value[0]] = data_key_value[1]
                    log.warning(update_dict)
                    
                    # Caculate the Budget Enough and update
                    if isNum2(update_dict[etc_mm_item1]) == True:
                        if (float(update_dict[etc_mm_item1]) > 0 and float(update_dict[etc_item2])/float(update_dict[etc_mm_item1]) >= 160):
                            update_dict[etc_mm_item2] = "Yes"
                        else:
                            update_dict[etc_mm_item2] = "No"
                        update_dict[etc_mm_item1] = float(update_dict[etc_mm_item1])
                    else:
                        update_dict[etc_mm_item2] = "No"
                        update_dict[etc_mm_item1] = float("2")
                    
                    # Check if the record exist in etc_mm_table
                    line = self.check_db(etc_mm_table,1,"[" + etc_mm_item0 + "]", "'" + update_dict[etc_mm_item0] + "'",0)
                    log.debug(line)
                    if line != 0: 
                        self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[etc_mm_item0],"[" + etc_mm_item1 + "]",update_dict[etc_mm_item1]);
                        self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[etc_mm_item0],"[" + etc_mm_item3 + "]",update_dict[etc_mm_item3]);
                        self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[etc_mm_item0],"[" + etc_mm_item2 + "]",update_dict[etc_mm_item2]);
                    else:
                        update_dict[etc_mm_item4] = str(" ")
                        update_dict[etc_mm_item5] = str(" ")
                        update_dict[etc_mm_item6] = str(" ")
                        update_dict[etc_mm_item7] = str(" ")
                        update_dict[etc_mm_item8] = str("0")
                        strA = "[" + etc_mm_item0 + "],"
                        strA = strA + "[" + etc_mm_item1 + "],"
                        strA = strA + "[" + etc_mm_item2 + "],"
                        strA = strA + "[" + etc_mm_item3 + "],"
                        strA = strA + "[" + etc_mm_item4 + "],"
                        strA = strA + "[" + etc_mm_item5 + "],"
                        strA = strA + "[" + etc_mm_item6 + "],"
                        strA = strA + "[" + etc_mm_item7 + "],"
                        strA = strA + "[" + etc_mm_item8 + "]"
                        valueA = "'" + update_dict[etc_mm_item0] + "'" + ","
                        valueA = valueA + "'" + str(update_dict[etc_mm_item1]) + "'" + ","
                        valueA = valueA + "'" + update_dict[etc_mm_item2] + "'" + ","
                        valueA = valueA + "'" + update_dict[etc_mm_item3] + "'" + ","
                        valueA = valueA + "'" + update_dict[etc_mm_item4] + "'" + ","
                        valueA = valueA + "'" + update_dict[etc_mm_item5] + "'" + ","
                        valueA = valueA + "'" + update_dict[etc_mm_item6] + "'" + ","
                        valueA = valueA + "'" + update_dict[etc_mm_item7] + "'" + ","
                        valueA = valueA + "'" + update_dict[etc_mm_item8] + "'"
                        self.write_db(etc_mm_table,3,strA,valueA,'','')
                        #self.write_db(etc_mm_table,3,"[" + etc_mm_item0 + "]" + "," + "[" + etc_mm_item1 + "]" + "," + "[" + etc_mm_item2 + "]" + "," + "[" + etc_mm_item3 + "]", "'" + update_dict[etc_mm_item0] + "'" + "," + "'" + update_dict[etc_mm_item1] + "'" + "," + "'" + update_dict[etc_mm_item2] + "'"+ "," + "'" + update_dict[etc_mm_item3] + "'",'','')
            
            elif (sStr1[2] == "closedate"):
                if sStr1[3] == "edit": 
                    data = self.rfile.read(int(self.headers['content-length']))
                    update_data = data.replace('+',' ').split('&')
                    update_dict ={}
                    for item in update_data:
                      data_key_value = item.split('=')
                      update_dict[data_key_value[0]] = data_key_value[1]
                    log.debug(update_dict)
                    log.debug(sStr1[2])


                    # Check if the record exist in etc_mm_table
                    log.debug(etc_mm_item0)
                    log.debug(update_dict[etc_mm_item0])
                    line = self.check_db(etc_mm_table,1,"[" + etc_mm_item0 + "]", "'" + update_dict[etc_mm_item0] + "'",0)
                    log.debug(line)
                    if line != 0:
                        log.debug(etc_mm_item3)
                        #print update_dict[etc_mm_item1]
                        log.debug(update_dict[etc_mm_item3])
                       # print update_dict[etc_mm_item2]
                        #self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[etc_mm_item0],"[" + etc_mm_item1 + "]",update_dict[etc_mm_item1]);
                        self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[etc_mm_item0],"[" + etc_mm_item3 + "]",update_dict[etc_mm_item3]);
                        #self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[etc_mm_item0],"[" + etc_mm_item2 + "]",update_dict[etc_mm_item2]);
                    else:
                        update_dict[etc_mm_item1] = str("2.0")
                        update_dict[etc_mm_item2] = str(" ")
                        update_dict[etc_mm_item8] = str("0")
                        self.write_db(etc_mm_table,3,"[" + etc_mm_item0 + "]" + "," + "[" + etc_mm_item1 + "]" + "," + "[" + etc_mm_item2 + "]" + "," + "[" + etc_mm_item3 + "]"+ "," + "[" + etc_mm_item8 + "]", "'" + update_dict[etc_mm_item0] + "'" + "," + "'" + update_dict[etc_mm_item1] + "'" + "," + "'" + update_dict[etc_mm_item2] + "'"+ "," + "'" + update_dict[etc_mm_item3] + "'"+ "," + "'" + update_dict[etc_mm_item8] + "'",'','')
            elif (sStr1[2] == "timesheetbilling"):
                if sStr1[3] == "edit":
                    data = self.rfile.read(int(self.headers['content-length']))
                    update_data = data.replace('+',' ').split('&')
                    update_dict ={}
                    for item in update_data:
                      data_key_value = item.split('=')
                      update_dict[data_key_value[0]] = data_key_value[1]
                    log.debug(update_dict)
                    log.debug(sStr1[2])


                    # Check if the record exist in etc_mm_table
                    log.debug(etc_mm_item0)
                    line = self.check_db(etc_mm_table,1,"[" + etc_mm_item0 + "]", "'" + update_dict[web_billing_item0] + "'",0)
                    log.debug(line)
                    if update_dict[web_billing_item3] == "":
                        update_dict[web_billing_item3] = "0"
                    if line != 0:
						self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[web_billing_item0],"[" + etc_mm_item5 + "]",update_dict[web_billing_item1])
						self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[web_billing_item0],"[" + etc_mm_item6 + "]",update_dict[web_billing_item2])
						self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[web_billing_item0],"[" + etc_mm_item7 + "]",update_dict[web_billing_item4])
						self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[web_billing_item0],"[" + etc_mm_item8 + "]",update_dict[web_billing_item3])
						self.write_db(etc_mm_table,1,"[" + etc_mm_item0 + "]",update_dict[web_billing_item0],"[" + etc_mm_item3 + "]",update_dict[web_billing_item5])
                    else:
						update_dict[etc_mm_item1] = str("2.0")
						update_dict[etc_mm_item2] = str(" ")
						update_dict[etc_mm_item4] = str(" ")
						strA = "[" + etc_mm_item0 + "],"
						strA = strA + "[" + etc_mm_item1 + "],"
						strA = strA + "[" + etc_mm_item2 + "],"
						strA = strA + "[" + etc_mm_item3 + "],"
						strA = strA + "[" + etc_mm_item4 + "],"
						strA = strA + "[" + etc_mm_item5 + "],"
						strA = strA + "[" + etc_mm_item6 + "],"
						strA = strA + "[" + etc_mm_item7 + "],"
						strA = strA + "[" + etc_mm_item8 + "]"
						valueA = "'" + update_dict[web_billing_item0] + "'" + ","
						valueA = valueA + "'" + update_dict[etc_mm_item1] + "'" + ","
						valueA = valueA + "'" + update_dict[etc_mm_item2] + "'" + ","
						valueA = valueA + "'" + update_dict[web_billing_item5] + "'" + ","
						valueA = valueA + "'" + update_dict[etc_mm_item4] + "'" + ","
						valueA = valueA + "'" + update_dict[web_billing_item1] + "'" + ","
						valueA = valueA + "'" + update_dict[web_billing_item2] + "'" + ","
						valueA = valueA + "'" + update_dict[web_billing_item4] + "'" + ","
						valueA = valueA + "'" + update_dict[web_billing_item3] + "'"
						self.write_db(etc_mm_table,3,strA,valueA,'','')
            elif (sStr1[2] == "timesheetfilling"): 
                log.debug(sStr1)
                if sStr1[3] == "getSupervisors":
                    data = self.rfile.read(int(self.headers['content-length']))
                    self.read_supervisor_info_filling(parsed_path)        
                    update_data = data.replace('+',' ').split('&') 
                    log.debug(update_data)  
                if sStr1[3] == "searchPhase":
                    try:
		                    log.info("Phase function: searchPhase")
		                    data = self.rfile.read(int(self.headers['content-length']))
		                    update_data = data.replace('+',' ').split('&')
		                    #============================================================================================
		                    con1 = update_data[0].split('=')
		                    con2 = update_data[1].split('=')
		                    con3 = update_data[2].split('=')
		                    eid = con1[1];
		                    setDate1 = con2[1]
		                    setData2 = con3[1]
		                    log.debug(eid)
		                    log.debug(setDate1)
		                    log.debug(setData2)
		                    #============================================================================================
		                    # search relevant phase information from timesheet table
		                    #select_col = '[Emp ID],[Employee Name],[Project Def],[Phase],[Sub Phase],[Work Date],[Tot Hours],[Remarks]'
		                    select_col = '[Emp ID],[Employee Name],[Phase],[Sub Phase],[Work Date],[Tot Hours],[Remarks],[Level 1 WBS],[Level 1 WBS Description]'
		                    cursor.execute("select %s from Timesheet where Supervisor = '%s' and ([Work Date] >= '%s') and ([Work Date] <= '%s');" %(select_col,eid,setDate1,setData2))
		                    select_timesheet = cursor.fetchall()
		
		                    # check phase_status according to phase tabel
		                    result =[];
		                    for i in range(len(select_timesheet)):
		                        one_person_info = select_timesheet[i]
		                        tmpPro = one_person_info[2]
		                        tmpPhase = one_person_info[3]
		                        tmpSubphase = one_person_info[4]
		                        cursor.execute("select * from phase_info where [project id] = '%s'and [phase] = '%s' and [subphase] = '%s';" %(tmpPro,tmpPhase,tmpSubphase))
		                        phase_table = cursor.fetchall()
		                        #if the filling phase is not included, then record
		                        if(len(phase_table)==0):
		                            result.append(select_timesheet[i])
		
		                    strFormatToWeb = []
		                    strFormatToWeb.append("Emp ID")
		                    strFormatToWeb.append("Employee Name")
		                    #strFormatToWeb.append("Project ID")
		                    strFormatToWeb.append("Phase")
		                    strFormatToWeb.append("Sub Phase")
		                    strFormatToWeb.append("Work Date")
		                    strFormatToWeb.append("Hours")
		                    strFormatToWeb.append("Remarks")
		                    strFormatToWeb.append("Level 1 WBS")
		                    strFormatToWeb.append("Level 1 WBS Description")
		                    self.packet_data_to_wb(result,strFormatToWeb)
                    except:
		                    logging.exception('Got exception on main handler')
		                    raise

                elif sStr1[3] == "searchAdminHours":
                    log.info("Phase function: searchAdminHours")
                    data = self.rfile.read(int(self.headers['content-length']))
                    update_data = data.replace('+',' ').split('&')
                    #============================================================================================
                    con1 = update_data[0].split('=')
                    con2 = update_data[1].split('=')
                    con3 = update_data[2].split('=')
                    eid = con1[1];
                    setDate1 = con2[1]
                    setData2 = con3[1]
                    log.debug(eid)
                    log.debug(setDate1)
                    log.debug(setData2)
                    #============================================================================================
                    select_col = '[Emp ID],[Employee Name],[Project Def],[Phase],[Sub Phase],[Work Date],[Tot Hours],[Remarks]'
                    cursor.execute("select %s from Timesheet where Supervisor = '%s' and ([Work Date] >= '%s') and ([Work Date] <= '%s');" %(select_col,eid,setDate1,setData2))
                    #cursor.execute("select %s from Timesheet where Supervisor = '%s' ;" %(select_col,eid))
                    user_pjt_info = cursor.fetchall()
                    #get the name of each employee
                    select_col_seg = '[Emp ID]'
                    cursor.execute("select distinct %s from Timesheet where Supervisor = '%s';" %(select_col_seg,eid))
                    user_name_info = cursor.fetchall()
                    #log.debug(len(user_name_info))
                    #log.debug((user_name_info))
                    #log.debug(len(user_pjt_info))
                    #log.debug(user_pjt_info)
                    #user_pjt_info = ('552309', 'Yue Liang', 'HT-00000673', 'KNOWLEDGE_MGMT', 'DO', u'2015-10-19', '6.5', 'RA process formalization')
                    result=[]
                    #for j in range(len(user_pjt_info)):
                        #if user_pjt_info[j][0] == 'H131413':  
                            #log.debug(user_pjt_info[j])                                        
                    for i in range(len(user_name_info)):
                        if user_name_info[i][0] == 'H131413':
                            setPoint = 1
                        #if user_name_info[i][0] != 'H122070':
                        #    continue                            
                        cur_emp_id = user_name_info[i][0]
                        #tmp1 = cur_emp_id.split(',')
                        cur_num = len(user_pjt_info)
                        if cur_num>0:
                            #for cur_emp_id in user_pjt_info[j][0]:
                            one_pjt = []
                            work_hours = 0
                            pjt_flag = 0
                            cur_index = 0
                            cur_len = cur_num
                            #cosidering there is only 1 line
                            #if (len(user_pjt_info[1][0]) == 6):
                            #    cur_len = len(user_pjt_info)
                            #else:
                            #    cur_len = 1
                            for j in range(cur_len):
                                if(user_pjt_info[j][0]==cur_emp_id):
                                    #log.info(user_pjt_info[j])
                                    #if user_pjt_info[j][0] == 'H131413':
                                        #log.debug(user_pjt_info[j])
                                    if('HT' in user_pjt_info[j][2]):
                                        work_hours = work_hours + float(user_pjt_info[j][6].strip())
                                        pjt_flag = 1
                                        cur_index = j

                            if pjt_flag == 1:
                                one_pjt.append(user_pjt_info[cur_index][0])
                                one_pjt.append(user_pjt_info[cur_index][1])
                                #one_pjt.append(user_pjt_info[cur_index][3])
                                #one_pjt.append(user_pjt_info[cur_index][4])
                                #one_pjt.append(user_pjt_info[cur_index][7])
                                one_pjt.append(work_hours)
                                if(work_hours>0.0):
                                    result.append(one_pjt)
                                    log.debug(one_pjt)

                    strFormatToWeb = []
                    strFormatToWeb.append("Emp ID")
                    strFormatToWeb.append("Employee Name")
                    #strFormatToWeb.append("Phase")
                    #strFormatToWeb.append("Sub Phase")
                    strFormatToWeb.append("Admin Hours")
                    #strFormatToWeb.append("Remarks")

                    self.packet_data_to_wb(result,strFormatToWeb)

        elif sStr1[1] == "bigData":  
            if sStr1[2] == 'timesheet': 
                if sStr1[3] == 'searchWithConditions':
                    length = self.headers['content-length']  
                    data = self.rfile.read(int(length))
                    log.debug(data)
                    data = data.replace('+', ' ')
                    log.debug(data)
                    data = unquote(data)
                    log.debug(data)
                    #print data
                    data = data.split('&')
                    log.debug(data)
                    iLevel = 0
                    iEid = 0
                    iStart = 0
                    iEnd = 0
                    itext = "select * from Timesheet "
                    for ite in data:
                        con = ite.split('=')
                        if ('Level 2' in con[0]) and (con[1] != 'all'):
                            if iLevel ==0:
                                itext = itext+ "where ( [WBS Element] = '" + con[1] + "' "
                                iLevel = 1
                            else:
                                itext = itext + "or [WBS Element] = '" + con[1] + "' "
                        if ('EID' in con[0]) and (con[1] != 'all'):
                            if iEid ==0:
                                if iLevel == 1:
                                    itext = itext+ ") and ( [Emp ID] = '" + con[1] + "' "
                                else:
                                    itext = itext+ "where ( [Emp ID] = '" + con[1] + "' "
                                iEid = 1
                            else:
                                itext = itext + "or [Emp ID] = '" + con[1] + "' "   
                        if ('Start Date' in con[0]) and (con[1] != ''):
                            iDate = con[1]
                            iDate = iDate.split('.')
                            iyear = iDate[0]
                            imon = iDate[1]
                            iday = iDate[2]
                            if (iLevel == 1) or (iEid == 1):
                                itext = itext+ ") and ( [Work Date] >= '" + iyear +'-'+imon + "-" + iday + "'"
                            else:
                                itext = itext+ "where ( [Work Date] >= '" + iyear +'-'+imon + "-" + iday + "'"
                            iStart = 1
                        if ('End Date' in con[0]) and (con[1] != ''):
                            iDate = con[1]
                            iDate = iDate.split('.')
                            iyear = iDate[0]
                            imon = iDate[1]
                            iday = iDate[2]
                            if (iLevel == 1) or (iEid == 1) or (iStart == 1):
                                itext = itext+ ") and ( [Work Date] <= '" + iyear +'-'+imon + "-" + iday + "'"
                            else:
                                itext = itext+ "where ( [Work Date] <= '" + iyear +'-'+imon + "-" + iday + "'"
                            iEnd = 1
                    if (iLevel == 1) or (iEid == 1) or (iStart == 1) or (iEnd == 1):
                        itext = itext+ ")"
                    cursor.execute(itext)
                    results = cursor.fetchall() 
                    log.debug(len(results))  
                    log.debug(itext)          
                    if len(results) > 20000:
                        self.wfile.write("TOO_MANY_ROWS")                   
                    else:
                        inum = 0      # need to update inum to 0 for new database
                        retProj = "["
                        for i in range(len(results)):
                            if i!=0:
                                retProj = retProj + ","
                            spe = results[i]
                            iProDef = str(spe[inum])
                            iProDes = str(spe[inum+1])
                            iLe1 = str(spe[inum+2])
                            iLe1Des = str(spe[inum+3])
                            iWbs = str(spe[inum+4])
                            iWbsDes = str(spe[inum+5])
                            iEid = str(spe[inum+6])
                            iEname = str(spe[inum+7])
                            iPhase = str(spe[inum+8])
                            iSubPha = str(spe[inum+9])
                            iDate = spe[inum+10]
                            iHour = str(spe[inum+11])
                            iRemark = str(spe[inum+12])
                            iSupId = str(spe[inum+13])
                            iSupName = str(spe[inum+14])
                            retProj = retProj +"{'Project Def':'" + iProDef +"', 'Project Description':'"+ iProDes +"', 'Level 1 WBS':'" + iLe1 +"', 'Level 1 WBS Description':'"+ iLe1Des +"', 'WBS Element':'" + iWbs +"', 'WBS Element Description':'"+ iWbsDes +"', 'Emp ID':'"+ iEid +"', 'Employee Name':'" + iEname +"', 'Phase':'" + iPhase +"', 'Sub Phase':'" + iSubPha +"', 'Work Date':'" + str(iDate) +"', 'Hours':'" + iHour +"', 'Remarks':'" + iRemark +"', 'Supervisor Eid':'" + iSupId +"', 'Supervisor name':'" + iSupName +"'}"
                        retProj = retProj + "]"             
                        #print retProj  
                        self.wfile.write(retProj)        
                        log.info('bigData completed')
            elif sStr1[2] == 'copq': 
                if 'searchWbs' in sStr1[3]:                              
                    length = self.headers['content-length']  
                    data = self.rfile.read(int(length))
                    data = data.replace('+', ' ')
                    data = unquote(data)
                    #print data
                    data = data.split('&')
                    iLevel = 0
                    iPhaPair = 0
                    itext = "select * from Timesheet "
                    for ite in data:
                        con = ite.split('=')
                        if ('Level 2' in con[0]) and (con[1] != 'all'):
                            if iLevel ==0:
                                itext = itext+ "where ( [WBS Element] = '" + con[1] + "' "
                                iLevel = 1
                            else:
                                itext = itext + "or [WBS Element] = '" + con[1] + "' "
                        if ('Phase Pair' in con[0]) and (con[1] != 'all'):
                            if con[1]=='RH default':
                                iSub = 'REWORK'
                                if iPhaPair ==0:
                                    if iLevel == 1:
                                        itext = itext+ ") and ( ([Sub Phase] = '" + iSub +"') "
                                    else:
                                        itext = itext+ "where ( ([Sub Phase] = '" + iSub +"') "
                                    iPhaPair = 1
                                else:
                                    itext = itext + "or ([Sub Phase] = '" + iSub +"') "                                 
                            else:
                                iStep = con[1].split('>')   #parse phase and sub phase
                                log.info('(((((((((((((((((((((((((((((((((((((((((((((((((((')
                                log.debug(iStep)
                                iPha = iStep[1]
                                if '(and)' in iPha:
                                    iPha.replace('(and)','&')
                                iSub = iStep[3]
                                if '(and)' in iSub:
                                    iSub.replace('(and)','&')
                                if iPhaPair ==0:
                                    if iLevel == 1:
                                        itext = itext+ ") and ( ([Phase] = '" + iPha + "' and [Sub Phase] = '" + iSub +"') "
                                    else:
                                        itext = itext+ "where ( ([Phase] = '" + iPha + "' and [Sub Phase] = '" + iSub +"') "
                                    iPhaPair = 1
                                else:
                                    itext = itext + "or ([Phase] = '" + iPha + "' and [Sub Phase] = '" + iSub +"') "                                
                    if (iLevel == 1) or (iPhaPair == 1):
                        itext = itext+ ")"
                    log.info('************************copq itext**********************************')
                    #print itext
                    cursor.execute(itext)
                    results = cursor.fetchall() 
                    log.info('************************copq results**********************************')
                    #print results
                    inum = 0      # need to update inum to 0 for new database
                    retProj = "["
                    for i in range(len(results)):
                        if i!=0:
                            retProj = retProj + ","
                        spe = results[i]
                        iWbs = str(spe[inum+4])
                        iWbsDes = str(spe[inum+5])
                        iEname = str(spe[inum+7])
                        iPhase = str(spe[inum+8])
                        iSubPha = str(spe[inum+9])
                        iDate = spe[inum+10]
                        iHour = str(spe[inum+11])
                        retProj = retProj +"{'WBS Element':'" + iWbs +"', 'WBS Element Description':'"+ iWbsDes +"', 'Employee Name':'" + iEname +"', 'Phase':'" + iPhase +"', 'Sub Phase':'" + iSubPha +"', 'Date':'" + str(iDate) +"', 'Hours':'" + iHour +"'}"
                    retProj = retProj + "]"             
                    #print retProj  
                    self.wfile.write(retProj)
					
	
                    
                    

    def deal_post_data(self):
        boundary = self.headers.plisttext.split("=")[1]
        remainbytes = int(self.headers['content-length'])
        line = self.rfile.readline()
        remainbytes -= len(line)
        if not boundary in line:
            return (False, "Content NOT begin with boundary")
        line = self.rfile.readline()
        remainbytes -= len(line)
        fn = re.findall(r'Content-Disposition.*name="file"; filename="(.*)"', line)
        if not fn:
            return (False, "Can't find out file name...")
        path = self.translate_path(self.path)
        osType = platform.system()
        try:
            if osType == "Linux":
                fn = os.path.join(path, fn[0].decode('gbk').encode('utf-8'))
            else:
                fn = os.path.join(path, fn[0])
        except Exception, e:
            return (False, "222222222222222")
        while os.path.exists(fn):
            fn += "_"
        line = self.rfile.readline()
        remainbytes -= len(line)
        line = self.rfile.readline()
        remainbytes -= len(line)
        try:
            out = open(fn, 'wb')
        except IOError:
            return (False, "Can't create file to write, do you have permission to write?")

        preline = self.rfile.readline()
        remainbytes -= len(preline)
        while remainbytes > 0:
            line = self.rfile.readline()
            remainbytes -= len(line)
            if boundary in line:
                preline = preline[0:-1]
                if preline.endswith('\r'):
                    preline = preline[0:-1]
                out.write(preline)
                out.close()
                return (True, "File '%s' upload success!" % fn)
            else:
                out.write(preline)
                preline = line
        return (False, "Unexpect Ends of data.")


    def send_head(self):
        """Common code for GET and HEAD commands.

        This sends the response code and MIME headers.

        Return value is either a file object (which has to be copied
        to the outputfile by the caller unless the command was HEAD,
        and must be closed by the caller under all circumstances), or
        None, in which case the caller has nothing further to do.

        """
        path = self.translate_path(self.path)

        f = None
        if os.path.isdir(path):
            if not self.path.endswith('/'):
                # redirect browser - doing basically what apache does
                self.send_response(301)
                self.send_header("Location", self.path + "/")
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return self.list_directory(path)
        ctype = self.guess_type(path)
        try:
            # Always read in binary mode. Opening files in text mode may cause
            # newline translations, making the actual size of the content
            # transmitted *less* than the content-length!
            f = open(path, 'rb')
        except IOError:
            self.send_error(404, "File not found")
            return None
        self.send_response(200)
        self.send_header("Content-type", ctype)
        fs = os.fstat(f.fileno())
        self.send_header("Content-Length", str(fs[6]))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.end_headers()
        return f


    def list_directory(self, path):
        """Helper to produce a directory listing (absent index.html).

        Return value is either a file object, or None (indicating an
        error).  In either case, the headers are sent, making the
        interface the same as for send_head().

        """
        try:
            list = os.listdir(path)
        except os.error:
            self.send_error(404, "No permission to list directory")
            return None
        list.sort(key=lambda a: a.lower())
        f = StringIO()
        displaypath = cgi.escape(urllib.unquote(self.path))
        f.write('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">')
        f.write("<html>\n<title>Directory listing for %s</title>\n" % displaypath)
        f.write("<body>\n<h2>Directory listing for %s</h2>\n" % displaypath)
        f.write("<hr>\n")
        f.write("<form ENCTYPE=\"multipart/form-data\" method=\"post\">")
        f.write("<input name=\"file\" type=\"file\"/>")
        f.write("<input type=\"submit\" value=\"upload\"/>")
        f.write("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp")
        f.write("<input type=\"button\" value=\"HomePage\" onClick=\"location='/'\">")
        f.write("</form>\n")
        f.write("<hr>\n<ul>\n")
        for name in list:
            fullname = os.path.join(path, name)
            colorName = displayname = linkname = name
            # Append / for directories or @ for symbolic links
            if os.path.isdir(fullname):
                colorName = '<span style="background-color: #CEFFCE;">' + name + '/</span>'
                displayname = name
                linkname = name + "/"
            if os.path.islink(fullname):
                colorName = '<span style="background-color: #FFBFFF;">' + name + '@</span>'
                displayname = name
                # Note: a link to a directory displays with @ and links with /
            filename = os.getcwd() + '/' + displaypath + displayname
            f.write(
                '<table><tr><td width="60%%"><a href="%s">%s</a></td><td width="20%%">%s</td><td width="20%%">%s</td></tr>\n'
                % (urllib.quote(linkname), colorName,
                   sizeof_fmt(os.path.getsize(filename)), modification_date(filename)))
        f.write("</table>\n<hr>\n</body>\n</html>\n")
        length = f.tell()
        f.seek(0)
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Content-Length", str(length))
        self.end_headers()
        return f


    def translate_path(self, path):
        """Translate a /-separated PATH to the local filename syntax.

        Components that mean special things to the local file system
        (e.g. drive or directory names) are ignored.  (XXX They should
        probably be diagnosed.)

        """
        # abandon query parameters
        path = path.split('?', 1)[0]
        path = path.split('#', 1)[0]
        path = posixpath.normpath(urllib.unquote(path))
        words = path.split('/')
        words = filter(None, words)
        path = os.getcwd()
        for word in words:
            drive, word = os.path.splitdrive(word)
            head, word = os.path.split(word)
            if word in (os.curdir, os.pardir): continue
            path = os.path.join(path, word)
        return path


    def copyfile(self, source, outputfile):
        """Copy all data between two file objects.

        The SOURCE argument is a file object open for reading
        (or anything with a read() method) and the DESTINATION
        argument is a file object open for writing (or
        anything with a write() method).

        The only reason for overriding this would be to change
        the block size or perhaps to replace newlines by CRLF
        -- note however that this the default server uses this
        to copy binary data as well.

        """
        shutil.copyfileobj(source, outputfile)


    def guess_type(self, path):
        """Guess the type of a file.

        Argument is a PATH (a filename).

        Return value is a string of the form type/subtype,
        usable for a MIME Content-type header.

        The default implementation looks the file's extension
        up in the table self.extensions_map, using application/octet-stream
        as a default; however it would be permissible (if
        slow) to look inside the data to make a better guess.

        """

        base, ext = posixpath.splitext(path)
        if ext in self.extensions_map:
            return self.extensions_map[ext]
        ext = ext.lower()
        if ext in self.extensions_map:
            return self.extensions_map[ext]
        else:
            return self.extensions_map['']


    def get_wbs_gannt(self, wbs_info):

        itemSel = '[Start Date], [Finish Date]'
        cur_wbs_info = []
        for i in range(len(wbs_info)):
            data_info = []
            one_line = []
            item_wbs = str(wbs_info[i])
            #item_wbs = 'AE-00000835-001-0051'
            cursor.execute("select %s from %s where [WBS ID] = '%s';" %(itemSel, "AEWA_info", item_wbs))
            #cursor.execute("select %s from %s where [WBS ID] = '%s';" %(itemSel,aewa_table, item_wbs))
            data_info = cursor.fetchall()
            if len(data_info) == 0:
                continue
            start_date = data_info[0][0]
            end_date = data_info[0][1]
            year1 = int(start_date[6:10])
            month1 = int(start_date[3:5])
            day1 = int(start_date[0:2])
            year0 = today.year-1
            flag1 = 0
            log.debug(start_date)
            log.debug(end_date)
            #deal with start year
            if(year1 < year0):
                flag1=1
            else:
                if(month1 < 01):
                    flag1=1
                else:
                    if(day1<01):
                        flag1=1
            if flag1 == 1:
                start_date = '01/01/'+str(today.year-1)
                     
            flag1 = 0
            if(year1 > year0):
                flag1=1						
            if flag1 == 1:
                start_date = '31/12/'+str(today.year)
            #deal with end year
            year1 = int(end_date[6:10])
            month1 = int(end_date[3:5])
            day1 = int(end_date[0:2])   
            year0 = today.year-1
                    
            if(year1 < year0):
                flag1=1
            else:
                if(month1 < 01):
                    flag1=1
                else:
                    if(day1<01):
                       flag1=1
            if flag1 == 1:
                end_date = '01/01/'+str(today.year-1)
            flag1 = 0
            if(year1 > year0):
                flag1=1

            if flag1 == 1:
                end_date = '31/12/'+str(today.year)
               
                
            start_date = start_date.replace('.','/')
            end_date = end_date.replace('.','/')
            one_line.append(item_wbs)
            one_line.append(start_date)
            one_line.append(end_date)
            cur_wbs_info.append(one_line)
            log.debug(one_line)

        strFormatToWeb = []
        strFormatToWeb.append("WBS")
        strFormatToWeb.append("start date")
        strFormatToWeb.append("end date")

        self.packet_data_to_wb(cur_wbs_info,strFormatToWeb)

        log.debug(cur_wbs_info)

    def get_wbs_overview(self,eid):
        log.info("get_wbs_overview is called")
        cursor.execute("select [%s] from %s where eid = '%s';" %(etc_item0, "account_level2wbs_relation", eid))
        item = cursor.fetchall()
        self.wfile.write("[")
        log.debug(len(item))
        number = 0
        for i in item:
            if(number > 0):
                self.wfile.write(",")
            overview_dict = {}
            item_wbs = str(i[0].strip())
            overview_dict[WBSOver_item0] = item_wbs

            overview_dict[WBSOver_item2] = self.get_wbs_status(1,item_wbs)
            overview_dict[WBSOver_item3] = self.get_wbs_status(2,item_wbs)
            overview_dict[WBSOver_item4] = self.get_wbs_status(3,item_wbs)

            cursor.execute("select [%s] from %s where [HTS Assigned WBS] = '%s';" %(etc_item1, etc_table,item_wbs))
            results = cursor.fetchall()
            for result in results:
                overview_dict[WBSOver_item1] = str(result[0].strip())
                break
            cursor.execute("select [%s] from %s where [HTS Assigned WBS] = '%s';" %(etc_mm_item3,etc_mm_table,item_wbs))
            results = cursor.fetchall()
            if(len(results) != 0):
                for result in results:
                    overview_dict[WBSOver_item5] = str(result[0].strip())
                    break
            else:
                overview_dict[WBSOver_item5] = str("")
            self.wfile.write(overview_dict)
            #print overview_dict
            number += 1
            log.debug("get_wbs_overview debug num=%d",number)
        self.wfile.write("]")
        log.info("get_wbs_overview is returned, num = %d",number)


    def get_wbs_status(self,operation,item_wbs):
        statusInfor = ""
        cursor.execute("select [%s],[%s] from %s where [WBS ID] = '%s';" %(aewa_item2,aewa_item3, aewa_table, item_wbs))
        results_aewa = cursor.fetchall()
        if(len(results_aewa) != 0):
            for result_aewa in results_aewa:
                if((result_aewa[0]!= None and "TECO" in result_aewa[0]) or (result_aewa[1]!= None and "CLSE" in result_aewa[1])):
                    statusInfor = "/Close"
                    break
        if( operation == 1):#get billing match
            today1 = today #+ datetime.timedelta(2)
            weekday = today1.weekday()
            if(weekday ==0 or weekday == 1):
                sheetend_d = today1 + datetime.timedelta(-8-weekday)
                dmrend_d = today1 + datetime.timedelta(-5-weekday)
            else:
                sheetend_d = today1 + datetime.timedelta(-weekday-1)
                dmrend_d = today1 + datetime.timedelta(2-weekday)
            totleTH = 0.0
            totleBillH = 0.0
            cursor.execute("select [%s],[%s] from %s where [WBS Element] = '%s';" %(timesheet_tothours,timesheet_date, timesheet_table, item_wbs))
            results = cursor.fetchall()
            for result in results:
                sStrdate= result[1].split('-')
                d = datetime.datetime(int(sStrdate[0]), int(sStrdate[1]),int( sStrdate[2])).date()
                if d<= sheetend_d:
                    vardd = str(result[0].strip())
                    totleTH += float(vardd)
            cursor.execute("select [%s],[%s] from %s where [Aero WBS Number] = '%s';" %(dmr_item1,dmr_item2,dmr_table,item_wbs))
            results_dmr=cursor.fetchall()
            for resultdmr in results_dmr:
                sStrdate= resultdmr[1].split('-')
                d = datetime.datetime(int(sStrdate[0]), int(sStrdate[1]),int( sStrdate[2])).date()
                if d <= dmrend_d:
                    totleBillH = totleBillH + float(str(resultdmr[0].strip()))
            badHours = 0
            cursor.execute("select [%s],[%s] from %s where [HTS Assigned WBS] = '%s';" %(etc_mm_item3,etc_mm_item8,etc_mm_table,item_wbs))
            results_etcmm=cursor.fetchall()
            if (len(results_etcmm) != 0):
                for result_etcmm in results_etcmm:
                    if( result_etcmm[1]!= None and isNum2(result_etcmm[1].strip())):
                        badHours = float(result_etcmm[1].strip())
            if(totleTH + badHours == totleBillH):
                return "Yes"
            else:
                return "No"+statusInfor
        elif(operation == 2):#get Budget Enough for 1 month
            heads = 2.0
            cursor.execute("select %s from %s where [HTS Assigned WBS] = '%s';" %(etc_items, etc_table,item_wbs))
            results = cursor.fetchall()
            cur_flag = 0
            for result in results:
                cursor.execute("select %s from %s where [HTS Assigned WBS] = '%s';" %(etc_mm_items,etc_mm_table,item_wbs))
                results_mm=cursor.fetchall()
                cur_flag = 1
                if (len(results_mm) != 0):
                    for result_mm in results_mm:
                        if result_mm[0] != None and isNum2(result_mm[0].strip()) == True:
                            heads = float(result_mm[0].strip())
            if cur_flag == 1:               
                if (float(heads) > 0 and float(str(result[1].strip()))/float(heads) >= 160 ):
                    return "Yes"
                else:
                    return "No"+statusInfor
            else:
                log.debug('warnning')
        elif(operation == 3):#get Close more than 1 month
            cursor.execute("select %s from %s where [HTS Assigned WBS] = '%s';" %(etc_items_closedate, etc_table, item_wbs))
            resultsClose= cursor.fetchall()
            if(len(resultsClose) != 1):
                return "No"+statusInfor
            currentyear =time.strftime("%Y")
            currentmonth =time.strftime("%m")
            currentdate =time.strftime("%d")
            d1 = datetime.datetime(int(currentyear),int(currentmonth), int(currentdate))
            for result in resultsClose:
                sStrdate= result[1].split('.')
                d2 = datetime.datetime(int(sStrdate[2]), int(sStrdate[1]),int( sStrdate[0]))
                if (d2 <d1):
                    return "No"+statusInfor
                elif((d2-d1).days >30):
                    return "Yes"
                else:
                    return "No"+statusInfor
        else:
            return "No"+statusInfor


    def read_onoff_infor(self,eid,start_d,end_d):

        if((end_d-start_d).days < 0):
            return
        dmr_itmes = "["+ dmr_item0 + "],["+ dmr_item2 + "],["+ dmr_item3 + "],["+ dmr_item1 + "]"

        cursor.execute("select [%s] from %s where eid = '%s';" %(etc_item0, "account_level2wbs_relation", eid))
        wbsResults = cursor.fetchall()
        number = 0
        self.wfile.write("[")
        for wbsResult in wbsResults:
            item_wbs = str(wbsResult[0].strip())
            cursor.execute("select %s from %s where [%s] = '%s';" %(dmr_itmes, dmr_table,dmr_item0,item_wbs))
            results = cursor.fetchall()

            for result in results:
                sStrdate= result[1].split('-')
                create_d = datetime.datetime(int(sStrdate[0]), int(sStrdate[1]),int( sStrdate[2]))
                if((create_d-start_d).days >= 0 and (end_d -create_d).days >= 0):
                    if("LB-OFF" not in str(result[2].strip())):
                        if(number > 0):
                            self.wfile.write(",")
                        dmr_dict = {}
                        dmr_dict[OnOffStatus_item0] = str(result[0].strip())
                        dmr_dict[OnOffStatus_item1] = str(result[1].strip())
                        dmr_dict[OnOffStatus_item2] = str(result[2].strip())
                        dmr_dict[OnOffStatus_item3] = str(result[3].strip())
                        self.wfile.write(dmr_dict)
                        number += 1
        self.wfile.write("]")

    def get_wbs_hours(self,item_wbses):
        if(item_wbses == None):
            return
        item_wbses = item_wbses.split("=")
        if(item_wbses[1] == None or item_wbses[1] == ''):
            return
        item_wbses = item_wbses[1].split(",")
        #item_wbses[0]='ae-00000820-034-0007'
        #item_wbses[1]='ae-00000820-036-0002'
        self.wfile.write("[[")
        number = 0
        for item in item_wbses:
            if(number > 0):
                self.wfile.write(",")
            item_wbs = item
            wbs_dict = {}
            wbs_dict["label"]=item_wbs
            self.wfile.write(wbs_dict)
            number +=1
        self.wfile.write("],[")


        number = 0
        for item in item_wbses:
            if(number > 0):
                self.wfile.write(",")
            item_wbs = item
            timesheet_dict = {}
            totleTH = 0
            cursor.execute("select [%s] from %s where [WBS Element] = '%s';" %(timesheet_tothours, timesheet_table, item_wbs))
            results = cursor.fetchall()
            for result in results:
                vardd = str(result[0].strip())
                totleTH += float(vardd)
            timesheet_dict["value"]=str(totleTH)
            self.wfile.write(timesheet_dict)
            number +=1
        self.wfile.write("],[")


        number = 0
        for item in item_wbses:
            if(number > 0):
                self.wfile.write(",")
            item_wbs = item
            aewa_dict = {}
            cursor.execute("select [%s] from %s where [WBS ID] = '%s';" %(aewa_item1, aewa_table, item_wbs))
            results = cursor.fetchall()
            for result in results:
                if(result[0] != None and isNum2(result[0].strip()) == True):
                    totleH = float(result[0].strip())
                    aewa_dict["value"] = str(totleH)
                    break
            self.wfile.write(aewa_dict)
            number += 1
        self.wfile.write("]]")

    def read_keycode_infor(self, eid):
        #eid = 'TEST'
        log.info("start to read key code information")
        emp = '[Key Code],[Pro Def]'
        cursor.execute("select distinct %s from %s" %(emp, aewa_table))
        items = cursor.fetchall()
        count = 0
        retProj = "["
        for item in items:
            keycode = item[0]
            projectid = str(item[1].strip())
            likestr = '%-%-%-%'
            cursor.execute("select distinct [WBS ID] from %s where  [Key Code]='%s' and [Pro Def] = '%s'and [WBS ID] not like  '%s' order by [WBS ID];" %(aewa_table,keycode,projectid,likestr))
            wbs1s = cursor.fetchall()
            for wbs1 in wbs1s:
                wbs1str = str(wbs1[0].strip())
                wbs2like = wbs1str+"-%"
                cursor.execute("select distinct [WBS ID] from %s where [Pro Def] = '%s'and [Key Code]='%s' and [WBS ID]  like '%s'order by [WBS ID];" %( aewa_table,projectid,keycode,wbs2like))
                wbs2s = cursor.fetchall()
                for wbs2 in wbs2s:
                    if count!=0:
                        retProj = retProj + ","
                    wbs2str = str(wbs2[0].strip())
                    myval = "'"+eid+"','"+wbs1str+"','"+wbs2str+"'"
                    line = self.check_db('account_level2wbs_relation',1,'eid, [Level1 wbs], [HTS Assigned WBS]', myval, 0)
                    flag = 'true'
                    if line == 0:
                        flag = 'false'
                    retProj = retProj +"{'Keycode':'" + keycode + "','Project ID':'"+ projectid + "','Level 1 WBS':'" + wbs1str +"', 'Level 2 WBS':'"+ wbs2str + "','Status':'" + flag + "'}"
                    count = count + 1
        retProj = retProj + "]"
        self.wfile.write(retProj)


    def read_etc_info(self,path,eid):
        log.info("start to read ETC table information")
        #eid = "H145003"
        #Get the HTS information here
        cursor.execute("select [%s] from %s where eid = '%s';" %(etc_item0, "account_level2wbs_relation", eid))
        item = cursor.fetchall()

        self.wfile.write("[")
        number = 0;

        for i in item:
        	item_wbs = str(i[0].strip())

        	cursor.execute("select %s from %s where [HTS Assigned WBS] = '%s';" %(etc_items, etc_table,item_wbs))
        	results = cursor.fetchall()
        	#log.info(item_wbs)
        	for result in results:
        		etc_dict = {}
                log.info("Now it is the result \n")
                etc_dict[etc_item0] = str(item_wbs)
                etc_dict[etc_item1] = str(result[0].strip())
                etc_dict[etc_item2] = str(result[1].strip())
                etc_dict[etc_item3] = str(result[2].strip())
                etc_dict[etc_item4] = str(result[3].strip())
                etc_dict[etc_item5] = str(result[4].strip())

              # Get the data in etc_mm database
                assigned_wbs = str(etc_dict[etc_item0].strip())
                cursor.execute("select %s from %s where [HTS Assigned WBS] = '%s';" %(etc_mm_items,etc_mm_table,assigned_wbs))
                results_mm=cursor.fetchall()
                log.debug(results_mm)
                if (len(results_mm) != 0):
                    for result_mm in results_mm:
                        etc_dict[etc_mm_item3] = str(result_mm[2].strip())
                        if result_mm[0] != None and isNum2(result_mm[0].strip()) == True:
        					etc_dict[etc_mm_item1] = str(float(result_mm[0].strip()))
                        else:
                            etc_dict[etc_mm_item1] = str("2.0")
                else:
                    etc_dict[etc_mm_item1] = str("2.0")
                    etc_dict[etc_mm_item3] = str(" ")

                statusInfor = ""
                cursor.execute("select [%s],[%s] from %s where [WBS ID] = '%s';" %(aewa_item2,aewa_item3, aewa_table, item_wbs))
                results_aewa = cursor.fetchall()
                if(len(results_aewa) != 0):
                    for result_aewa in results_aewa:
                        if((result_aewa[0]!= None and "TECO" in result_aewa[0]) or (result_aewa[1]!= None and "CLSE" in result_aewa[1])):
                            statusInfor = "/Close"
                            break
                if (float(etc_dict[etc_mm_item1]) > 0 and float(etc_dict[etc_item2])/float(etc_dict[etc_mm_item1]) >= 160 ):
        			etc_dict[etc_mm_item2] = "Yes"
                else:
                    etc_dict[etc_mm_item2] = "No"+statusInfor
                log.debug(etc_dict[etc_mm_item2])
                etc_dict["Edit"] = str(" ")
                self.wfile.write(etc_dict)
                log.debug("The result is %s",(etc_dict))
                number += 1
                if (number < len(item)):
        		    self.wfile.write(",")
        self.wfile.write("]")
        
    def read_etc_info_closedate(self,path,eid):
        log.info("start to read ETC table information")
        #eid = str("H145003")
        cursor.execute("select [%s] from %s where eid = '%s';" %(etc_item0, "account_level2wbs_relation", eid))
        item = cursor.fetchall()
        
        self.wfile.write("[")
        number = 0;
        for i in item:
        	item_wbs = str(i[0].strip())
        	cursor.execute("select %s from %s where [HTS Assigned WBS] = '%s';" %(etc_items_closedate, etc_table, item_wbs))
        	results = cursor.fetchall()
        	
        	currentyear =time.strftime("%Y")
        	currentmonth =time.strftime("%m")
        	currentdate =time.strftime("%d")
        	log.debug(currentyear)
        	log.debug(currentmonth)
        	log.debug(currentdate)
        	d1 = datetime.datetime(int(currentyear),int(currentmonth), int(currentdate))
        	log.debug(d1)

        	log.debug(results)
        	for result in results:
        		etc_dict = {}
                etc_dict[etc_item0] = str(item_wbs)
                etc_dict[etc_item1] = str(result[0].strip())
                etc_dict[etc_item6] = str(result[1].strip())
                assigned_wbs = str(item_wbs)
                cursor.execute("select %s from %s where [HTS Assigned WBS] = '%s';" %(etc_mm_items_closedate,etc_mm_table,assigned_wbs))
                results_mm=cursor.fetchall()
                log.debug(results_mm)
                if (len(results_mm) != 0):
                    for result_mm in results_mm:
                        etc_dict[etc_mm_item3] = str(result_mm[0].strip())
                else:
                    etc_dict[etc_mm_item3] = str("")
                sStrdate= etc_dict[etc_item6].split('.')
                log.debug(sStrdate[0])
                log.debug(sStrdate[1])
                d2 = datetime.datetime(int(sStrdate[2]), int(sStrdate[1]),int( sStrdate[0]))
                statusInfor = ""
                cursor.execute("select [%s],[%s] from %s where [WBS ID] = '%s';" %(aewa_item2,aewa_item3, aewa_table, item_wbs))
                results_aewa = cursor.fetchall()
                if(len(results_aewa) != 0):
                    for result_aewa in results_aewa:
                        if((result_aewa[0]!= None and "TECO" in result_aewa[0]) or (result_aewa[1]!= None and "CLSE" in result_aewa[1])):
                            statusInfor = "/Close"
                            break
                if (d2 <d1):
        			etc_dict[etc_mm_item4] = "No"+statusInfor
                elif((d2-d1).days >30):
        			etc_dict[etc_mm_item4] = "Yes"
                else:
        			etc_dict[etc_mm_item4] = "No"+statusInfor
                log.debug(etc_dict[etc_mm_item4])
                etc_dict[etc_mm_item3] = str("")

                self.wfile.write(etc_dict)
                log.debug(etc_dict)
                number += 1
                if (number < len(item)):
                    self.wfile.write(",")
        self.wfile.write("]")

    def read_etc_info_billing(self,path,eid):
        #eid = str("H145003")
        cursor.execute("select [%s] from %s where eid = '%s';" %(etc_item0, "account_level2wbs_relation", eid))
        item = cursor.fetchall()
        self.wfile.write("[")
        number = 0
        today1 = today #+ datetime.timedelta(2)
        weekday = today1.weekday()
        if(weekday ==0 or weekday == 1):
            sheetend_d = today1 + datetime.timedelta(-8-weekday)
            dmrend_d = today1 + datetime.timedelta(-5-weekday)
        else:
            sheetend_d = today1 + datetime.timedelta(-weekday-1)
            dmrend_d = today1 + datetime.timedelta(2-weekday)
        for i in item:
            totleTH = 0.0
            totleBillH = 0.0

            dmr_dict = {}
            item_wbs = str(i[0].strip())
            cursor.execute("select [%s],[%s] from %s where [WBS Element] = '%s';" %(timesheet_tothours,timesheet_date, timesheet_table, item_wbs))
            results = cursor.fetchall()
            for result in results:
                sStrdate= result[1].split('-')
                d = datetime.datetime(int(sStrdate[0]), int(sStrdate[1]),int( sStrdate[2])).date()
                if d<= sheetend_d:
                    vardd = str(result[0].strip())
                    totleTH += float(vardd)
            cursor.execute("select [%s],[%s] from %s where [Aero WBS Number] = '%s';" %(dmr_item1,dmr_item2,dmr_table,item_wbs))
            results_dmr=cursor.fetchall()
            for resultdmr in results_dmr:
                sStrdate= resultdmr[1].split('-')
                d = datetime.datetime(int(sStrdate[0]), int(sStrdate[1]),int( sStrdate[2])).date()
                if d <= dmrend_d:
                    totleBillH = totleBillH + float(str(resultdmr[0].strip()))
            dmr_dict[web_billing_item0] = str(item_wbs)
            dmr_dict[web_billing_item1] = str(totleTH)
            dmr_dict[web_billing_item2] = str(totleBillH)
            badHours = 0
            cursor.execute("select [%s],[%s] from %s where [HTS Assigned WBS] = '%s';" %(etc_mm_item3,etc_mm_item8,etc_mm_table,item_wbs))
            results_etcmm=cursor.fetchall()
            if (len(results_etcmm) != 0):
                for result_etcmm in results_etcmm:
                    dmr_dict[web_billing_item5] = str(result_etcmm[0].strip())
                    if( result_etcmm[1]!= None and isNum2(result_etcmm[1].strip())):
                        badHours = float(result_etcmm[1].strip())
                    if( result_etcmm[1] == None):
                        dmr_dict[web_billing_item3] = str("0")
                    else:
                        dmr_dict[web_billing_item3] = str(result_etcmm[1].strip())
            else:
                dmr_dict[web_billing_item3] = str("0")
                dmr_dict[web_billing_item5] = str(" ")

            statusInfor = ""
            cursor.execute("select [%s],[%s] from %s where [WBS ID] = '%s';" %(aewa_item2,aewa_item3, aewa_table, item_wbs))
            results_aewa = cursor.fetchall()
            if(len(results_aewa) != 0):
                for result_aewa in results_aewa:
                    if((result_aewa[0]!= None and "TECO" in result_aewa[0]) or (result_aewa[1]!= None and "CLSE" in result_aewa[1])):
                        statusInfor = "/Close"
                        break

            if(totleTH + badHours == totleBillH):
                dmr_dict[web_billing_item4] = "Yes"
            else:
                dmr_dict[web_billing_item4] = "No"+statusInfor
            self.wfile.write(dmr_dict)
            #print dmr_dict
            number += 1
            if (number < len(item)):
                self.wfile.write(",")
        self.wfile.write("]")
    def read_supervisor_info_filling(self,path):
        log.info("read_supervisor_info_filling is called")
        emp = '[Project Def],[Supervisor],[Supervisor name]'
        cursor.execute("select distinct %s from Timesheet ;" %(emp))
        result_sv = cursor.fetchall()
        
        #get the project infromation
        project_lst=self.check_db('account_project_relation', 3, 'definition','',0)
        result = []
        for super_info in result_sv:
            super_item = []
            cur_pjt = super_info[0]
            pjt_valid = 0
            for prj_one_row in project_lst:
                if cur_pjt == prj_one_row[0]:
                    prj_valid = 1
                    break
            
            super_item.append(super_info[1])
            super_item.append(super_info[2])
            
            result.append(super_item)                   
        
        #delete the same elements
        #result = list(set(result))
        new_result = []
        for one_element in result:
            if one_element not in new_result:
                new_result.append(one_element)
                    
        result = new_result
        
        strFormatToWeb = []
        strFormatToWeb.append("Emp ID")
        strFormatToWeb.append("Employee Name")
        retProj = "["
        for i in range(len(result)):
            if i!=0:
                retProj = retProj + ","
            retProj = retProj + "{"
            for j in range(len(strFormatToWeb)):
                if j==0:
                    retProj = retProj + "'"+ (strFormatToWeb[j]) +"':'" + str(result[i][j])+"'";
                else:
                    retProj = retProj +"," +"'"+ (strFormatToWeb[j]) +"':'" + str(result[i][j])+"'";
            retProj = retProj + "}"
        retProj = retProj + "]"
        log.debug(retProj)
        self.wfile.write(retProj)
    #-----------------------------------------------------------------------------------------------------------------
    def packet_data_to_wb(self,result,strFormatToWeb):
        retProj = "["
        for i in range(len(result)):
            if i!=0:
                retProj = retProj + ","
            retProj = retProj + "{"
            for j in range(len(strFormatToWeb)):
                if j==0:
                    retProj = retProj + "'"+ (strFormatToWeb[j]) +"':'" + str(result[i][j])+"'";
                else:
                    retProj = retProj +"," +"'"+ (strFormatToWeb[j]) +"':'" + str(result[i][j])+"'";
            retProj = retProj + "}"
        retProj = retProj + "]"
        #log.debug(retProj)
        self.wfile.write(retProj)
    #=================================================================================================================
    def read_account_info(self, path):
        table1='account_info'
        list_1=[]
        list_1.append(i1)
        list_1.append(i2)
        list_1.append(i3)
        self.wfile.write("[")
        flag=0
        pflag=0
        items =''
        for s in list_1:
            items = items + s + ','
        items = items[:-1]
        cursor.execute("select %s from %s;" %(items, table1))
        rows = cursor.fetchall()
        for row in rows:
            if flag == 0:
                flag = 1
            else:
                self.wfile.write(',')
            mydict[seq[0]]=str(row[0])
            mydict[seq[1]]=str(row[1])
            mydict[seq[2]]=str(row[2])
            cursor.execute("select eid, definition  from account_project_relation")
            items=''
            pflag = 0
            prows=cursor.fetchall()
            for prow in prows:
                if prow.eid == row[0]:
                    if pflag == 0:
                        pflag = 1
                        items = items + prow.definition
                    else:
                        items = items + ','
                        items = items + prow.definition
            mydict[seq[3]]=str(items)
            self.wfile.write(mydict)
            log.info(mydict)
        self.wfile.write("]")

    def read_account_info(self, path):
        table1='account_info'
        list_1=[]
        list_1.append(i1)
        list_1.append(i2)
        list_1.append(i3)
        self.wfile.write("[")
        flag=0
        pflag=0
        items =''
        for s in list_1:
            items = items + s + ','
        items = items[:-1]
        cursor.execute("select %s from %s;" %(items, table1))
        rows = cursor.fetchall()
        for row in rows:
            if flag == 0:
                flag = 1
            else:
                self.wfile.write(',')
            mydict[seq[0]]=str(row[0])
            mydict[seq[1]]=str(row[1])
            mydict[seq[2]]=str(row[2])
            cursor.execute("select eid, definition  from account_project_relation")
            items=''
            pflag = 0
            prows=cursor.fetchall()
            for prow in prows:
                if prow.eid == row[0]:
                    if pflag == 0:
                        pflag = 1
                        items = items + prow.definition
                    else:
                        items = items + ','
                        items = items + prow.definition
            mydict[seq[3]]=str(items)
            self.wfile.write(mydict)
            #log.info(mydict)
        self.wfile.write("]")


    def add_space(self, input):
    	output=''
    	output="["+input+"]"
    	return output
    #===================================================================================================================
    def read_level1_wbs_info(self, eid):
        log.info("read_level1_wbs_info is called")
        #get the project infromation
        #project_lst=self.check_db('project_info', 3, 'definition','',0)
        cursor.execute("select definition from account_project_relation where eid = '%s';" %eid)
        project_lst = cursor.fetchall()        
        #---------------------------------------------------------------------------------------------------------------
        #selet level2 wbs information, then get level1 wbs from level2 wbs
        (all_row_info,row_number ) =  self.get_table_info('[WBS ID]','AEWA_info')
        list_l1 = [];
        for i in range(row_number):
            ele_l2 = all_row_info[i]
            str_l1 = ele_l2[0][0:15]  # get level 1 wbs by select some chars from level 2 wbs
            #---------------------------------------
            cur_pjt_name = ele_l2[0][0:11]
            # to make sure the level2 wbs belong to project list
            pjt_flag = 0
            for pjt0  in project_lst:
                if cur_pjt_name == pjt0[0]:
                    pjt_flag = 1
            if pjt_flag == 1:            
            #---------------------------------------
                if i ==0 :
                    list_l1.append(str_l1)
                else :
                    flag1 = 1;  # indicates whether is including already
                    if str_l1 in list_l1:
                        flag1 = 0;
                    if flag1 == 1:
                        list_l1.append(str_l1)
        #---------------------------------------------------------------------------------------------------------------
        # decide the status according to the table account_level1wbs_relation
        level1_wbs_info = list_l1
        result = []
        strFormatToWeb = []
        for level1_wbs in level1_wbs_info:
            #level1_wbs = level1_wbs.split(',')
            myval=''
            myval = "'"+eid+"','"+str(level1_wbs)+"'"
            LineNum = self.check_db('account_level2wbs_relation',1,'eid, [Level1 wbs]', myval, 0)
            if LineNum == 0:
                myStatus = 'Deactive'
            else:
                myStatus = 'Active'
            #level1_wbs.append(myStatus);
            mylist=[];
            mylist.append(myStatus)
            #mylist.append("NULL")
            #mylist.append("NULL")
            #mylist.append("NULL")
            #mylist.append("NULL")
            mylist.append(level1_wbs)
            #mylist.append("NULL")
            #mylist.append("NULL")
            #mylist.append("NULL")
            strFormatToWeb = []
            strFormatToWeb.append("Active Status")
            #strFormatToWeb.append("Aero Network")
            #strFormatToWeb.append("Aero Activity Num")
            #strFormatToWeb.append("Aero Key Code")
            #strFormatToWeb.append("WBS Person Responsible")
            strFormatToWeb.append("HTS Assigned WBS")
            #strFormatToWeb.append("HTS WBS Description")
            #strFormatToWeb.append("System Status")
            #strFormatToWeb.append("User Status")
            result.append(mylist)
        #result.sort(key=operator.itemgetter(1))
        result.sort(key=lambda x:x[1])
        self.packet_data_to_wb(result,strFormatToWeb)
        #log.debug(result)
        #log.debug(strFormatToWeb)

    def read_wbs_info(self, eid):
        #get the project infromation
        cursor.execute("select definition from account_project_relation where eid = '%s';" %eid)
        project_lst = cursor.fetchall()
        
        #project_lst=self.check_db('project_info', 3, 'definition','',0)
        log.info(project_lst)
        table1='level2wbs_info'
        list_1=[]
        list_1.append(self.add_space(wbs1))
        list_1.append(self.add_space(wbs2))
        list_1.append(self.add_space(wbs3))
        #list_1.append(self.add_space(wbs4))
        list_1.append(self.add_space(wbs5))
        list_1.append(self.add_space(wbs6))
        #self.wfile.write("[")
        flag=0
        pflag=0
        items =''
        for s in list_1:
            items = items + s + ','
        items = items[:-1]
        # wbs1='Aero Network' wbs2='Aero Activity Num' wbs3='Aero Key Code'
        # wbs4='HTS Assigned WBS' wbs5='HTS WBS Description' wbs6='WBS Person Responsible'
        #cursor.execute("select %s from %s;" %(items, table1))
        #wbs7='System Status' wbs8='User Status' wbs9='Active Status'
        #select wbs ID from AEWA
        cursor.execute("select [WBS ID], [System Status], [User Status]   from AEWA_info")
        rows = cursor.fetchall()
        
        cur_result = []
        for row in rows:
            cur_level2_wbs = str(row[0])
            cur_pjt_name = cur_level2_wbs[0:11]
            # to make sure the level2 wbs belong to project list
            item_one_row = []
            pjt_flag = 0
            for pjt0  in project_lst:
                if cur_pjt_name == pjt0[0]:
                    pjt_flag = 1
            if pjt_flag == 1:
                if flag == 0:
                    flag = 1
                #row[0]~row[2]  wbs4='HTS Assigned WBS'  wbs7='System Status' wbs8='User Status'
                cursor.execute("select %s from %s where [HTS Assigned WBS] = '%s';" %(items, table1,cur_level2_wbs))
                #cursor.execute("select [HTS Assigned WBS], [System Status], [User Status]   from AEWA_info")
                srows=cursor.fetchall()
                if len(srows) == 1:
                    item_one_row.append(str(srows[0][0])) #'Aero Network'
                    item_one_row.append(str(srows[0][1])) #'Aero Activity Num'
                    item_one_row.append(str(srows[0][2])) # 'Aero Key Code'
                
                    item_one_row.append(cur_level2_wbs)  # [WBS ID]
                
                    item_one_row.append(str(srows[0][3])) #'HTS WBS Description'
                    item_one_row.append(str(srows[0][4])) # 'WBS Person Responsible'
                
                    item_one_row.append(str(row[1])) # 'System Status'
                    item_one_row.append(str(row[2])) # 'User Status'
                
                    myval=''
                    myval = "'"+eid+"','"+cur_level2_wbs+"'"
                    LineNum = self.check_db('account_level2wbs_relation',1,'eid, [HTS Assigned WBS]', myval, 0)
                    if LineNum == 0:
                        item_one_row.append('Deactive')
                    else:
                        item_one_row.append('Active')
                    #self.wfile.write(mywbsdict)
                    cur_result.append(item_one_row)
                else:
                    log.warning(srows)
        # sort according to wbs id
        cur_result.sort(key=lambda x:x[3])
        self.packet_data_to_wb(cur_result,wbsseq)


    def check_db(self, table, type, item, value, offset):
        # 1: return line number
        # 2: return item[offset]
        # 3: return different items of specific columns
        
        cursor_current = cursor

        if type == 1:
            item=item.split(',')
            value=value.split(',')
            mystr=''
            for i in range(len(item)):
                if i==0:
                    mystr = mystr + item[i] + '=' + value[i]
                else: 
                    mystr = mystr + 'and ' + item[i] + '=' + value[i]
            cursor_current.execute("select * from %s where %s;" %(table, mystr))
            rows = cursor_current.fetchall()
            flag=0
            for row in rows:
                flag = flag+1       
            return flag
        elif type == 2:
            offset = offset #need to be deleted after transfer database
            item=item.split(',')
            value=value.split(',')
            mystr=''
            for i in range(len(item)):
                if i==0:
                    mystr = mystr + item[i] + '=' + value[i]
                else: 
                    mystr = mystr + 'and' + item[i] + '=' + value[i]
                cursor_current.execute("select * from %s where %s;" %(table, mystr))
            row = cursor_current.fetchone()
            if row == None:
                return None
            else:
                return row[offset]
        elif type==3:
            #log.info(item, table)
            cursor.execute("select distinct %s from %s;" %(item, table))
	    return cursor.fetchall()


    def read_db(self, table, seq):
        mydict={}
        mydict = mydict.fromkeys(seq, 'None')
        items =''
        count=0
        flag=0
        for s in seq:
            items = items + s + ','
            count = count+1
        items = items[:-1]
        cursor.execute("select %s from %s;" %(items, table))
        rows = cursor.fetchall()
        self.wfile.write("[")
        for row in rows:
            if flag == 0:
                flag = flag + 1
            else:
                self.wfile.write(',')
                flag = flag + 1
            for i in range(count-1):                                    
                mydict[seq[i]]=str(row[i])
            mydict[seq[count-1]]=str(flag)
            self.wfile.write(mydict)
        self.wfile.write("]")
    # get row_number and table information
    def get_table_info(self, table, seq):
        cursor.execute("select %s from %s ;" % (table, seq))
        one_row_info = cursor.fetchone()
        line_number = 0;
        all_row_info = []
        all_row_info.append(one_row_info)
        while(one_row_info != None):
            line_number+=1
            one_row_info  = cursor.fetchone()
            all_row_info.append(one_row_info)
        return (all_row_info,line_number)


    def write_db(self, table, method, item, value, newitem, newvalue):
        #method:
        #   1:change data
        #   2:delete line
        #   3:add line
        
        
        cursor_current = cursor
        
        if method == 1:
            cursor_current.execute("update %s set %s='%s' where %s='%s';"%(table, newitem, newvalue, item, value))
            
        elif method == 2:
            item=item.split(',')
            value=value.split(',')
            mystr=''
            for i in range(len(item)):
                if i==0:
                    mystr = mystr + item[i] + '=' + value[i]
                else: 
                    mystr = mystr + 'and' + item[i] + '=' + value[i]
            #print mystr
            cursor_current.execute("delete from %s where %s;" %(table, mystr))
            
        elif method == 3:
            cursor_current.execute("insert into %s(%s) values(%s);" %(table, item, value)) 

        cursor_current.commit()


    def read_TimeSheet(self, path):
        self.send_response(200)
        # self.send_header("Access-Control-Allow-Origin", "*")
        #self.end_headers()
        sql = "select * from TimeSheet"
        cursor.execute(sql)
        rows = cursor.fetchall()
        for row in rows:
            #   self.wfile.write(row)
            log.debug(row)

    #---------------------------------------------------------------------
    def proc_timesheet_add(self,sStr1):
        log.info('proc_timesheet_add is called, %s',sStr1);
        currentyear = int(time.strftime("%Y"))  #DMM_set_end_year #
        startyear = DMM_set_start_year
        for i in range(startyear,currentyear+1,1):
            filename = dataFilePath + "Timesheet_"+ sStr1[3] +"_"
            filename = filename + str(i)+".xlsx"
            log.debug(filename)
            fileExist = os.path.exists(filename)
            sleepCount = DMM_set_sleep_times # sleep 30 times, 2 minutes every time
            if(fileExist == False):
                log.info(batFileName+ " \"TimeSheet\" \"" + str(i) + "\" \"" + sStr1[3] + "\"")
                os.system(batFileName+ " \"TimeSheet\" \"" + str(i) + "\" \"" + sStr1[3] + "\"")
                while(fileExist == False and sleepCount>=1):
                    time.sleep(DMM_set_sleep_one_cycle)
                    sleepCount -= 1
                    fileExist = os.path.exists(filename)
                    log.debug("fileExist = %d, sleepCount = %d",fileExist,sleepCount)
                if fileExist == False:
                    log.info("ERR")
                    #self.wfile.write('ERR,the Timesheet data file of year ' + str(currentyear) + ' cannot be generated correctly.')
                    continue
            try :
                #cur_flag = 1
                #if 'BJ_2015' in filename:
            		#    cur_flag = 0
                #if cur_flag == 1:   
                #    log.debug("called")                	
                loadsapdata.load_timesheet_add(cnxn, cursor,filename)
                cur_status =  1
            except:
                cur_status =  0
        log.info('proc_timesheet_add is returned,%d',i) 
        return cur_status
        # delete then add
    #---------------------------------------------------------------------
    def proc_timesheet_del_add(self,sStr1):
        log.info('proc_timesheet_del_add is called, %s',sStr1);
        filename = dataFilePath +"Timesheet_"
        currentyear =int(time.strftime("%Y"))
        currentMonth =int(time.strftime("%m"))
        filename = filename + sStr1[3] + "_"+ str(currentMonth) + "_" + str(currentyear)+".xlsx"
        log.debug(filename)
        fileExist = os.path.exists(filename)
        sleepCount = DMM_set_sleep_times # sleep 30 times, 2 minutes every time
        if(fileExist == False):
            os.system(batFileName + " \"TimeSheet_3Month\" \"" + sStr1[3] + "\"")
            log.info(batFileName + " \"TimeSheet_3Month\" \"" + sStr1[3] + "\"")
            while(fileExist == False and sleepCount>=1):
                time.sleep(DMM_set_sleep_one_cycle)
                sleepCount = sleepCount - 1
                fileExist = os.path.exists(filename)
                log.debug("fileExist = %d, sleepCount = %d",fileExist,sleepCount)
            if fileExist == False:
                log.info("ERR")
                #self.wfile.write('ERR,the Timesheet data file cannot be generated correctly.')
                return 0
        try:
            loadsapdata.load_timesheet_del_add(cnxn, cursor,filename)
            cur_status =  1
        except:
            cur_status =  0
        log.info('proc_timesheet_del_add is returned') 
        return cur_status
    #---------------------------------------------------------------------        
    def proc_etc(self, sStr1):
        log.info('proc_etc is called, %s',sStr1);
        filename = dataFilePath + "ETC_"
        currentyear =int(time.strftime("%Y"))
        currentMonth =int(time.strftime("%m"))
        filename = filename + sStr1[2] + "_"+ str(currentMonth) + "_" + str(currentyear)+".xlsx"
        log.info(filename)
        fileExist = os.path.exists(filename)
        sleepCount = DMM_set_sleep_times # sleep 30 times, 2 minutes every time
        if(fileExist == False):
            os.system(batFileName+ " \"ETC\" \"" + sStr1[2] + "\"")
            log.info(batFileName+ " \"ETC\" \"" + sStr1[2] + "\"")
            while(fileExist == False and sleepCount>=1):
                time.sleep(DMM_set_sleep_one_cycle)
                sleepCount = sleepCount - 1
                fileExist = os.path.exists(filename)
                log.debug("fileExist = %d, sleepCount = %d",fileExist,sleepCount)
            if fileExist == False:
                #self.wfile.write('ERR,the ETC data file cannot be generated correctly.')
                log.info("ERR")
                return
        try:
            loadsapdata.load_etc(cnxn, cursor,filename)
            cur_status = 1
            #self.wfile.write('OK')
        except:
            cur_status =  0
            #self.wfile.write('ERR')
        log.info('proc_etc is returned') 
        return cur_status
    #---------------------------------------------------------------------  
    def proc_dmr(self, sStr1):
        log.info('proc_dmr is called, %s',sStr1);
        filename = dataFilePath + "DMR_"
        currentyear =int(time.strftime("%Y"))
        currentMonth =int(time.strftime("%m"))
        filename = filename + sStr1[2] + "_"+ str(currentMonth) + "_" + str(currentyear)+".xlsx"
        log.info(filename)
        fileExist = os.path.exists(filename)
        sleepCount = DMM_set_sleep_times # sleep 30 times, 2 minutes every time
        if(fileExist == False):
            os.system(batFileName+ " \"DMR\" \"" + sStr1[2] + "\"")
            log.info(batFileName+ " \"DMR\" \"" + sStr1[2] + "\"")
            while(fileExist == False and sleepCount>=1):
                time.sleep(DMM_set_sleep_one_cycle)
                sleepCount = sleepCount - 1
                fileExist = os.path.exists(filename)
                log.debug("fileExist = %d, sleepCount = %d",fileExist,sleepCount)
            if fileExist == False:
                #self.wfile.write('ERR,the DMR data file cannot be generated correctly.')
                log.debug("ERR")
                return
        try:
            loadsapdata.load_dmr(cnxn, cursor,filename)
            cur_status = 1
            #self.wfile.write('OK')
        except:
            cur_status = 0
            #self.wfile.write('ERR')
        log.info('proc_dmr is returned')  
        return cur_status       
    #---------------------------------------------------------------------
    if not mimetypes.inited:
        mimetypes.init()  # try to read system mime.types
        extensions_map = mimetypes.types_map.copy()
        extensions_map.update({
        '': 'application/octet-stream',  # Default
        '.py': 'text/plain',
        '.c': 'text/plain',
        '.h': 'text/plain',
    })


class ThreadingServer(ThreadingMixIn, BaseHTTPServer.HTTPServer):
    pass


def test(HandlerClass=SimpleHTTPRequestHandler,
         ServerClass=BaseHTTPServer.HTTPServer):
    BaseHTTPServer.test(HandlerClass, ServerClass)


if __name__ == '__main__':

    srvr = ThreadingServer(serveraddr, SimpleHTTPRequestHandler)
    srvr.serve_forever()
