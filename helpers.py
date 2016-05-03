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
host = 'http://52.37.140.113/'

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

# Database functions
def getURL(urlIndex):
    conn = mysql.connect()
    cursor = conn.cursor()
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

    conn.commit()
    cursor.close()
    conn.close()
    return redirectURL

def insertURL(original_url):
    conn = mysql.connect()
    cursor = conn.cursor()
    original_url = conn.escape_string(original_url)
    ts = str(datetime.now())[0:-7]
    query = "INSERT INTO tbl_url (long_url, num_visits, insert_date) VALUES ('%s','%s','%s')" % (original_url, 0, ts)
    cursor.execute(query)
    lastID = cursor.lastrowid
    
    # Commit and close connections
    conn.commit()
    cursor.close()
    conn.close()
    encoded_string = toBase62(lastID)
    shortURL = host + encoded_string
    return shortURL

def isCustomExt(custom_url):
    conn = mysql.connect()
    cursor = conn.cursor()
    query = "SELECT long_url_id FROM custom_url WHERE custom_id=" + "\'" + str(custom_url) + "\'"
    cursor.execute(query)
    long_url_id = -1

    try:
        long_url_id = cursor.fetchone()[0]
        # print redirectURL       
    except Exception as e:
        print e

    # Commit and close connections
    conn.commit()
    cursor.close()
    conn.close()

    return long_url_id

def insertSourceURL(original_url):
    conn = mysql.connect()
    cursor = conn.cursor()
    original_url = conn.escape_string(original_url)
    ts = str(datetime.now())[0:-7]
    query = "INSERT INTO tbl_url (long_url, num_visits, insert_date) VALUES ('%s','%s','%s')" % (original_url, 0, ts)
    cursor.execute(query)
    lastID = cursor.lastrowid

    # Commit and close connections
    conn.commit()
    cursor.close()
    conn.close()

    return lastID

def insertCustomURL(custom_url, original_url_id):
    conn = mysql.connect()
    cursor = conn.cursor()
    ts = str(datetime.now())[0:-7]
    query = "INSERT INTO custom_url (custom_id, long_url_id) VALUES ('%s','%d')" % (custom_url, original_url_id)
    cursor.execute(query)
    lastID = cursor.lastrowid

    # Commit and close connections
    conn.commit()
    cursor.close()
    conn.close()   