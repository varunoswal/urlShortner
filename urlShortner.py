from flask import Flask, render_template, request, redirect, jsonify
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
import string
from math import floor
from urlparse import urlparse
from datetime import datetime, timedelta
# root@localhost:shorturl;

mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'shorturl'
app.config['MYSQL_DATABASE_DB'] = 'urlDB'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)
host = 'http://localhost:5000/'
CORS(app)

# Base62 Encoder
def toBase62(num, b = 62):
    if b <= 0 or b > 62:
        return 0
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
    return res

# Database queries
def retreiveURL(urlIndex):
    conn = mysql.connect()
    cursor = conn.cursor()
    query = "SELECT long_url FROM tbl_url WHERE id=%d"%(urlIndex)
    cursor.execute(query)
    redirectURL = "http://localhost:5000"

    try:
        redirectURL = cursor.fetchone()[0]
        print redirectURL       
    except Exception as e:
        print e

    if redirectURL != "http://localhost:5000":
        query = "UPDATE tbl_url SET num_visits = num_visits + 1 WHERE id=%d"%(urlIndex)
        cursor.execute(query)

    conn.commit()
    cursor.close()
    conn.close()
    return redirectURL

def insertLongURL(original_url):
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

# get last 100 urls that were inserted
@app.route('/getLastHundred', methods=['GET'])
def getLastHundred():
    conn = mysql.connect()
    cursor = conn.cursor()
    query = "SELECT id, long_url, num_visits from tbl_url ORDER BY insert_date desc LIMIT 100"
    cursor.execute(query)
    data = cursor.fetchall()
    # print data
    # Close connections
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'last_hundred': data})


# get top 10 urls by views in last month
@app.route('/getTopTen', methods=['GET'])
def getTopTen():
    conn = mysql.connect()
    cursor = conn.cursor()
    month = timedelta(days=30)
    endOfToday = str(datetime.today())[0:10] + " 23:59:00"
    lastMonth = str(datetime.today() - month)[0:10] + " 00:00:00"
    query = "SELECT id, long_url, num_visits from tbl_url WHERE insert_date BETWEEN \'" + lastMonth  + "\' and \'" + endOfToday + "\' ORDER BY num_visits desc LIMIT 10;"
    # print query
    cursor.execute(query)
    data = cursor.fetchall()
    # print data
    # Close connections
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'top_ten': data})

# get number of visits when given a shortURL
@app.route('/getNumVisits', methods=['POST'])
def getNumVisits():
    if request.method == 'POST':
        shortURL = request.form['url']
        print shortURL
        b62Str = shortURL[len(host):len(shortURL)]
        urlID = toBase10(b62Str)
        conn = mysql.connect()
        cursor = conn.cursor()
        query = "SELECT num_visits FROM tbl_url WHERE id=%d" % (urlID)
        cursor.execute(query)
        visits = cursor.fetchone()
        
        if visits != None:
            numVisits = visits[0]
        else:
            numVisits = -1            
        
        print numVisits

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'num_visits': str(numVisits)})

# insert method takes in og url -> returns id of inserted record -> encode to b62 -> update shorturl in db ?
@app.route('/getShortURL', methods=['POST'])
def getShortURL():
    if request.method == 'POST':
        original_url = request.form['url']
        
        if urlparse(original_url).scheme == '':
            original_url = 'http://' + original_url

        shortURL = insertLongURL(original_url)
        return jsonify({'url': shortURL})

# Routing method retrieves og url and routes window to it -> increments visit count by 1
@app.route('/<shortURL>')
def useShortURL(shortURL):
    if (shortURL != "None" and shortURL != "favico.ico"):
        
        urlIndex = toBase10(shortURL)
        redirectURL = retreiveURL(urlIndex)
        if(redirectURL==host[0:-1]):
            print 'no link found'
        else:
            return redirect(redirectURL)

    return render_template('index.html')

# Serve landing page
@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)