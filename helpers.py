import string
from math import floor
from flask import Flask
from flaskext.mysql import MySQL
from datetime import datetime, timedelta

def readDBInfo():
    fname = 'config/dbinfo.txt'
    with open(fname) as f:
        dbInfo = f.read().splitlines()
    return dbInfo

dbInfo = readDBInfo()
mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_DB'] = dbInfo[0]
app.config['MYSQL_DATABASE_HOST'] = dbInfo[1]
app.config['MYSQL_DATABASE_USER'] = dbInfo[2]
app.config['MYSQL_DATABASE_PASSWORD'] = dbInfo[3]
mysql.init_app(app)
from api_prod import host

# Base62 Encoder
def toBase62(num, b = 62):
    if b <= 0 or b > 62:
        return 0
    num = num + 1000000
    base = string.digits + string.lowercase + string.uppercase
    r = num % b
    res = base[r]
    q = floor(num / b)

    while q:
        r = q % b
        q = floor(q / b)
        res = base[int(r)] + res
    return res

# Base62 Decoder
def toBase10(num, b = 62):
    base = string.digits + string.lowercase + string.uppercase

    limit = len(num)
    res = 0
    for i in xrange(limit):
        res = b * res + base.find(num[i])
    res = res - 1000000
    return res

def formatTopTenData(data):
    res = []
    for i in range(0, len(data)):
        if(data[i][4] != None):
            res.append((data[i][4], data[i][1], data[i][2]))
        else:    
            res.append((toBase62(data[i][0]), data[i][1], data[i][2]))

    return res

# Database functions
def getURL(urlIndex):
    conn, cursor = getConnObjects(mysql)
    query = "SELECT long_url FROM tbl_url WHERE id=%d"%(urlIndex)
    cursor.execute(query)
    redirectURL = host[0:-1]

    try:
        redirectURL = cursor.fetchone()[0]
        print redirectURL       
    except Exception as e:
        print e

    if redirectURL != host[0:-1]:
        query = "UPDATE tbl_url SET num_visits = num_visits + 1 WHERE id=%d"%(urlIndex)
        cursor.execute(query)

    commitCloseConn(conn, cursor)
    return redirectURL

def getConnObjects(sqlObj):
    conn = sqlObj.connect()
    cursor = conn.cursor()
    return(conn, cursor)

def commitCloseConn(conn, cursor):    
    conn.commit()
    cursor.close()
    conn.close()

def insertURL(original_url):
    conn, cursor = getConnObjects(mysql)
    original_url = conn.escape_string(original_url)
    ts = str(datetime.now())[0:-7]
    query = "INSERT INTO tbl_url (long_url, num_visits, insert_date) VALUES ('%s','%s','%s')" % (original_url, 0, ts)
    cursor.execute(query)
    lastID = cursor.lastrowid
    commitCloseConn(conn, cursor)
    encoded_string = toBase62(lastID)
    shortURL = host + encoded_string
    return shortURL

def getAllCustomExt():
    conn, cursor = getConnObjects(mysql)
    query = "SELECT * FROM custom_url;"
    cursor.execute(query)
    data = cursor.fetchall()
    commitCloseConn(conn, cursor)
    
    res = {}
    if data != None:
        for i in range(0, len(data)):
            res[str(data[i][0])] = data[i][1]

    return res

def isCustomExt(custom_url):
    conn, cursor = getConnObjects(mysql)
    query = "SELECT long_url_id FROM custom_url WHERE custom_id=" + "\'" + str(custom_url) + "\'"
    cursor.execute(query)
    long_url_id = -1
    try:
        long_url_id = cursor.fetchone()[0]
        # print redirectURL       
    except Exception as e:
        print e

    commitCloseConn(conn, cursor)

    return long_url_id

def insertSourceURL(original_url):
    conn, cursor = getConnObjects(mysql)
    original_url = conn.escape_string(original_url)
    ts = str(datetime.now())[0:-7]
    query = "INSERT INTO tbl_url (long_url, num_visits, insert_date) VALUES ('%s','%s','%s')" % (original_url, 0, ts)
    cursor.execute(query)
    lastID = cursor.lastrowid
    commitCloseConn(conn, cursor)

    return lastID

def insertCustomURL(custom_url, original_url_id):
    conn, cursor = getConnObjects(mysql)
    ts = str(datetime.now())[0:-7]
    success = False
    isUnique = isCustomExt(custom_url)
    
    if isUnique == -1:
        query = "INSERT INTO custom_url (custom_id, long_url_id) VALUES ('%s','%d')" % (custom_url, original_url_id)
        cursor.execute(query)
        lastID = cursor.lastrowid
        commitCloseConn(conn, cursor)
        success = True

    return success
               