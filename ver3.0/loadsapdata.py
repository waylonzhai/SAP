import xlrd
import sys
import time
from math import ceil
import shutil

import os
import logging
import datetime

reload(sys)
sys.setdefaultencoding('utf-8')
#--------------------------------------------------------------------------------------------------------
FILE = os.getcwd()
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s:%(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
                    datefmt='%a, %d %b %Y %H:%M:%S',
                    filename = os.path.join(FILE,'log.txt'),
                    filemode='a')
log = logging.getLogger();
log.setLevel(logging.DEBUG)
#--------------------------------------------------------------------------------------------------------
console = logging.StreamHandler()
console.setLevel(logging.INFO)
formatter = logging.Formatter('%(name)-12s: %(levelname)-8s %(message)s')
console.setFormatter(formatter)
logging.getLogger('').addHandler(console)
#--------------------------------------------------------------------------------------------------------
name_list=[]

def convert_timesheet_1():  #lack supervisor, and supervisor name
    try:
        f=open('NewTimesheet', 'w')
        result=int(time.mktime(time.strptime('01.01.2046', '%d.%m.%Y')))
        result_str = '01.01.2046'
        bk = xlrd.open_workbook('\\\ch01w0103\\2015GBSAPFeel\\Requirement\\Timesheet\\Timesheet.xlsx')
        table = bk.sheet_by_index(0)
        nrows = table.nrows
        for i in range(nrows):
            data = table.row_values(i)
            if data[0] == '' and data[1]!='' and data[1][0] >= '0' and data[1][0] <= '9':
                col= len(data)
                for j in range(col):
                    if j!=0:
                        f.write('|')
                        if data[j] >= u'\u4e00' and data[j] <=u'\u9fa5':
                            temp = data[j].encode('gb2312')
                            f.write(temp)
                        else:
                            if j==22:
                                temp = int(time.mktime(time.strptime(data[j], '%d.%m.%Y')))
                                if  temp < result:
                                    result = temp
                                    result_str = data[j]
                            f.write(str(data[j]))
                f.write('\n')
            elif data[0] == '' and data[1]!='':
                col=len(data)
                for j in range(col):
                    if j!=0:
                        name_list.append(data[j].lstrip().rstrip())
    finally:
        if f:
            f.close()
    return result_str, name_list


def convert_timesheet_2(lst, filename):	#same to txt
    #try:
    log.info("convert_timesheet_2 is called")
    f=open('NewTimesheet', 'w')
    result=int(time.mktime(time.strptime('01.01.2046', '%d.%m.%Y')))
    result_str = '01.01.2046'
    bk = xlrd.open_workbook(filename)
    table = bk.sheet_by_index(0)
    nrows = table.nrows    
    log.info(nrows)
    for i in range(nrows):
        data = table.row_values(i)
        cur_data = data
        if cur_data[0] == '' and cur_data[1]=='' and cur_data[2]!='' and ('Project' in cur_data[2]):
            col=len(data)
            for j in range(col):
                if j!=0:
                    name_list.append(data[j].lstrip().rstrip())
        elif cur_data[0] == '' and cur_data[1]=='' and cur_data[2]!='':
            #delete the project filter
            #if data[2] in lst:
            try:
                col= len(data)
                for j in range(col):
                    if j!=0:
                        f.write('|')
                        if data[j] >= u'\u4e00' and data[j] <=u'\u9fa5':
                            temp = data[j].encode('gb2312')
                            f.write(temp)
                        else:
                            if j==15:
                                temp = int(time.mktime(time.strptime(data[j], '%d.%m.%Y')))
                                if  temp < result:
                                    result = temp
                                    result_str = data[j]
                            if j == 11 or j == 34:
                                temp = int(data[j])
                                f.write(str(temp))
                            else:
                                f.write(str(data[j]))
                f.write('\n')
            except:
                log.warning(data)
    #finally:
    log.info(i)
    if f:
        f.close()
    log.info("convert_timesheet_2 is returned")
    return result_str, name_list

def convert_timesheet_3(lst, filename):	#same to txt
    #try:
    log.info("convert_timesheet_3 is called")
    f=open('NewTimesheet', 'w')
    result=int(time.mktime(time.strptime('01.01.2046', '%d.%m.%Y')))
    result_str = '01.01.2046'
    bk = xlrd.open_workbook(filename)
    table = bk.sheet_by_index(0)
    nrows = table.nrows    
    log.info(nrows)
    for i in range(nrows):
        data = table.row_values(i)
        cur_data = data
        if cur_data[0] == '' and cur_data[1]=='' and cur_data[2]!='' and ('Project' in cur_data[2]):
            col=len(data)
            for j in range(col):
                if j!=0:
                    name_list.append(data[j].lstrip().rstrip())
        elif cur_data[0] == '' and cur_data[1]=='' and cur_data[2]!='':
            #delete the project filter
            #if data[2] in lst:
                col= len(data)
                for j in range(col):
                    if j!=0 and j!=18:
                        f.write('|')
                        if data[j] >= u'\u4e00' and data[j] <=u'\u9fa5':
                            temp = data[j].encode('gb2312')
                            f.write(temp)
                        else:
                            if j==15:
                                temp = int(time.mktime(time.strptime(data[j], '%d.%m.%Y')))
                                if  temp < result:
                                    result = temp
                                    result_str = data[j]
                            if j == 11 or j == 35:
                                temp = int(data[j])
                                f.write(str(temp))
                            else:
                                f.write(str(data[j]))
                f.write('\n')
    #finally:
    log.info(i)
    if f:
        f.close()
    log.info("convert_timesheet_3 is returned")
    return result_str, name_list


def convert_etc(filename):
    try:
        f=open('NewETC', 'w')
        bk = xlrd.open_workbook(filename)
        table = bk.sheet_by_index(0)
        nrows = table.nrows
        for i in range(nrows):
            data = table.row_values(i)
            if data[0] == '' and data[1]!='' and type(data[1])== float:
                col= len(data)
                for j in range(col):
                    if j!=0:
                        f.write('|')
                        if j == 1  or j==2 or j == 3:
                        #if j == 1:
                            if type(data[j])==float:
                                temp = int(data[j])
                            else:
                                temp = data[j]
                            f.write(str(temp))
                        else:
                            f.write(str(data[j]))
                f.write('\n')
    finally:
        if f:
            f.close()


def insert_timesheet_table1(cursor):	#need to be verified
    global e_list
    cursor.execute("delete from Timesheet")
    etc_list=[]
    my_col1 ="[Project Def], [Project Description], [Level 1 WBS], [Level 1 WBS Description], [WBS Element], [WBS Element Description],[Emp ID],[Employee Name],[Phase],[Sub Phase],[Work Date],[Tot Hours],[Remarks]"
    my_list1 = ['Project Def', 'Project Description', 'Level 1 WBS', 'Level 1 WBS Description', 'WBS element', 'WBS Description','Emp ID','Emp Name','Phase','Sub Phase','Date','Target Hrs','Remarks']

    for i in range(len(my_list1)):
        etc_list.append(e_list.index(my_list1[i])+1)

    fr=open('NewTimesheet', 'r')
    lines = fr.readlines()
    my_pre="','"
    ln=0
    for line in lines:
        line = line.split('|')
        line_num=0
        my_str=''
        for items in line:
            if line_num in etc_list:
                if line_num == 22:
                    item=items.split('.')
                    items=item[2]+'-'+item[1]+'-'+item[0]
                else:
                    items=items.strip()
                    items=items.lstrip()
                    items=items.rstrip()
                my_str = my_str+my_pre+items.replace("'"," ")
            line_num=line_num+1
        my_str=my_str[2:]+"'"
        cursor.execute('insert into Timesheet (%s) values(%s);' %(my_col1, my_str))
    fr.close()

def insert_timesheet_table2(cursor):	
    global e_list

    etc_list=[]
    my_col2 ="[Project Def], [Project Description], [Level 1 WBS], [Level 1 WBS Description], [WBS Element], [WBS Element Description],[Emp ID],[Employee Name],[Phase],[Sub Phase],[Work Date],[Tot Hours],[Remarks], [Supervisor], [Supervisor name], [Status]"
    my_list2 = ['Project Def', 'Project Description', 'Level 1 WBS', 'L1 WBS Descr', 'WBS Element', 'WBS Element Description','Emp ID','Employee Name','Phase','Sub Phase','Date','Tot Hours','Remarks', 'Supervisor','name','Status']

    #for i in range(len(my_list2)):
    #	etc_list.append(e_list.index(my_list2[i])+1)
    #print etc_list
    etc_list = [2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 34, 33, 26]
    #print etc_list
    fr=open('NewTimesheet', 'r')
    lines = fr.readlines()
    log.info(len(lines))
    my_pre="','"
    for line in lines:
        line = line.split('|')
        #line_num=0
        my_str=''
        for line_num in etc_list:
        #for items in line:
            strSeg = line[line_num]
            if line_num == 15:
                strTemp=strSeg.split('.')
                strSeg=strTemp[2]+'-'+strTemp[1]+'-'+strTemp[0]
            elif (line_num == 11) | (line_num == 34):  #deal for E and H
                if len(strSeg) == 6:  # begin with E
                    strSeg = 'E' + strSeg
                elif (len(strSeg) == 7) & (strSeg[0] == '2'):
                    strSeg = 'H'+strSeg[1:7]    
            elif (line_num == 17):
                #special processing for the Remarks item when it is filed in chinese charactors mixed with English charactors
                newS = ''
                strChExitFlag = 0
                for s in strSeg:
                    if s.isalpha() | (s==' ') | (s==':')|(s=='/')|(s=='&')|(s=='_')|(s=='-')|(s=='.'):
                        newS += s
                    else:
                        strChExitFlag = 1
                #log.debug(newS)
                if strChExitFlag == 1:
                    strSeg = newS

            else:
                strSeg=strSeg.strip()
                strSeg=strSeg.lstrip()
                strSeg=strSeg.rstrip()
            my_str = my_str+my_pre+strSeg.replace("'"," ")
        my_str=my_str[2:]+"'"
        #print my_str
        try:
            cursor.execute('insert into Timesheet (%s) values(%s);' %(my_col2, my_str))
        except:
            log.warning(line)
    fr.close()

def check_timesheet_table(cursor):
    global e_date
    e_date=e_date.split('.')
    magic_date="'"+e_date[2]+'-'+e_date[1]+'-'+e_date[0]+"'"
    cursor.execute("delete from Timesheet where [Work Date] >= %s;" %magic_date)

def load_timesheet(cnxn, cursor, lst, filename):
    log.info("load_timesheet is called")
    global e_date, e_list
    if 'BJ_2015' in filename:
        e_date, e_list = convert_timesheet_3(lst,filename)
    else:
        e_date, e_list = convert_timesheet_2(lst,filename)
    log.debug(e_date)
        # no need to delete the existing data
        #if (len(e_date)==10):
                #check_timesheet_table(cursor)
    insert_timesheet_table2(cursor)
             
    #else:
    #	log.warning('Date format error')

    cnxn.commit()
# add directly



# add directly
def load_timesheet_add(cnxn, cursor,filename):
    lst = []
    log.info("load_timesheet is called")
    load_timesheet(cnxn, cursor, lst,filename)
    log.info("load_timesheet is returned")

# delete three month ago
def load_timesheet_del_add(cnxn, cursor,filename):
    # delete data from three month ago to today
    log.info("load_timesheet_del_add is called,filename = %s",filename)
    currentyear =time.strftime("%Y")
    currentmonth =time.strftime("%m")
    currentdate =time.strftime("%d")
    end_d = datetime.datetime(int(currentyear),int(currentmonth), int(currentdate))
    start_d = end_d + datetime.timedelta(-90)
    start_d_str = str(start_d) #start_d.year + "-" + start_d.month + "-" + start_d.day
    if 'BJ' in filename:
        cursor.execute("delete from Timesheet where [Work Date]>='%s';" %(start_d_str))
    cnxn.commit()
    # then call load
    lst = []
    load_timesheet(cnxn, cursor, lst,filename)
    log.info("load_timesheet_del_add is return")


# clear  etimesheet
def clear_timesheet(cnxn, cursor):
    cursor.execute("delete from Timesheet")
    cnxn.commit()


def insert_etc_table(cursor):	    
    etc_list = [1,2,3,21,22,23,24,25,30,31,32]
    my_col ="[Aero Network], [Aero Activity Num], [Aero Key Code], [ETC Hours],[ETC Cost],[Aero Project Start Date],[Aero Project Finish Date],[Aero Close Date], [HTS Assigned WBS], [HTS WBS Description], [WBS Person Responsible]"

    fr=open('NewETC', 'r')
    lines = fr.readlines()
    my_pre="','"
    for line in lines:
        line = line.split('|')
        line_num=0
        my_str=''
        for items in line:
            if line_num in etc_list:
                items=items.strip()
                items=items.lstrip()
                items=items.rstrip()
                my_str = my_str+my_pre+items
            line_num=line_num+1
        my_str=my_str[2:]+"'"
        cursor.execute('insert into level2wbs_info (%s) values(%s);' %(my_col, my_str))
    fr.close()

def load_etc(cnxn, cursor,filename):
    log.info("load_etc is called,file = %s",filename)
    if 'BJ' in filename:
       cursor.execute("delete from level2wbs_info")
    convert_etc(filename)
    insert_etc_table(cursor)
    cnxn.commit()
    log.info("load_etc is return")


def convert_dmr(filename):
    try:
        f = open('NewDMR', 'w')
        bk = xlrd.open_workbook(filename)
        table = bk.sheet_by_index(0)
        nrows = table.nrows
        for i in range(nrows):
            data = table.row_values(i)
            if data[0] == '' and data[1] == '' and data[2] != '':
                # if data[2] in lst:
                col = len(data)
                for j in range(col):
                    if j > 1:
                        f.write('|')
                        f.write(str(data[j]))
                f.write('\n')
        f.close()
    finally:
        if f:
            f.close()


def insert_dmr_table(cursor):
    dmr_list = [7, 10, 14, 17]
    my_col = "[Aero WBS Number], [DMR Creation Date], [Material No], [Labor Hours]"
    fr = open('NewDMR', 'r')
    lines = fr.readlines()
    my_pre = "','"
    for line in lines:
        line = line.split('|')
        line_num = 0
        my_str = ''
        for line_num in dmr_list:
            items = line[line_num]
            if line_num == 10:
                item = items.split('.')
                items = item[2] + '-' + item[1] + '-' + item[0]
            else:
                items = items.strip()
                items = items.lstrip()
                items = items.rstrip()
            my_str = my_str + my_pre + items
        my_str = my_str[2:] + "'"
        cursor.execute('insert into dmr_info (%s) values(%s);' % (my_col, my_str))
    fr.close()

def load_dmr(cnxn, cursor,filename):
    log.info("load_dmr is called, file = %s", filename)
    if 'BJ' in filename:
        cursor.execute("delete from dmr_info")
    convert_dmr(filename)
    insert_dmr_table(cursor)
    cnxn.commit()
    log.info("load_dmr is return")


########################################################################################################################
def load_AEWA(cnxn, cursor):
    #Test:
    log.info("load_AEWA is called")
    cursor.execute("delete from AEWA_info")
    #bk = xlrd.open_workbook('CN43N-1123.xlsx')
    bk = xlrd.open_workbook('\\\ch01w0103\\2015GBSAPFeel\\Requirement\\Data\\CN43N.xlsx')
    table = bk.sheet_by_index(0)
    nrows = table.nrows
    head_info = []
    my_pre = "','"
    # select Level1 WBS, Resp CC, Start Date, Status, Proj Fund, Funding Hr, Finish Date
    my_col = "[WBS ID], [Resp CC], [Start Date], [System Status],[User Status], [Proj Fund], [Funding Hr],[Finish Date],[Key Code],[Pro Def]"
    #my_col = "[Level1 WBS], [Resp CC], [Start Date], [Proj Fund], [Funding Hr],[Finish Date]"
    list_aray = [1, 7, 9, 26, 30, 31, 58, 59, 0]
    #list_aray = [1, 7, 9, 30, 31, 58]
    for i in range(nrows):
        #log.info(i)
        my_str = "'"
        flag_save = 1
        if(i==0):
            head_info = table.row_values(i)
        else:
            data = table.row_values(i)
            #log.debug(data)
            #log.debug(data[58])
            #log.debug(data[59])
            for col_index in list_aray:
                items = str(data[col_index])
                #ensure the funding hours is not empty. It means the WBS has been closed when funding hr is empty
                #if(len(items)>0)&(col_index==31):
                #    flag_save = 0
                #if(len(items)<16)&(col_index==1):
                #    flag_save = 0
                if col_index==26:
                    items = items.split('//')
                    my_str = my_str +my_pre+ items[0]
                    my_str = my_str +my_pre+ items[1]
                else:
                    items = items.strip()
                    items = items.lstrip()
                    items = items.rstrip()
                    if(col_index == 1):
                        my_str = my_str + items
                    else:
                        my_str = my_str +my_pre+ items
            my_str = my_str + "'"
            if flag_save == 1 :
                #log.info(i)            
                #log.info(my_str)
                cursor.execute('insert into AEWA_info (%s) values(%s);' % (my_col, my_str))
    cnxn.commit()
    log.info("load_AEWA is returned")
########################################################################################################################