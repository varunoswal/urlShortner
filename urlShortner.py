from flask import Flask, render_template, request, redirect, jsonify
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
import string
from math import floor
from urlparse import urlparse
from datetime import datetime
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

# Database queries
# get top 10 urls by views in last month
# get last 100 urls that were inserted
# get number of visits when given a shortURL

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

# Serve landing page
@app.route('/', methods=['GET'])
def home():
    print 'here'
    return render_template('index.html')

# insert method takes in og url -> returns id of inserted record -> encode to b62 -> update shorturl in db ?
@app.route('/getShortURL', methods=['POST'])
def getShortURL():
    if request.method == 'POST':
        original_url = request.form['url']
        if urlparse(original_url).scheme == '':
            original_url = 'http://' + original_url

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

        original_url = request.form['url']
        shortURL = host + encoded_string
        return jsonify({'url': shortURL})

# Routing method retrieves og url and routes window to it -> increments visit count by 1
@app.route('/<shortURL>')
def useShortURL(shortURL):
    if (shortURL != "None" and shortURL != "favico.ico"):
        redirectURL = "http://localhost:5000"
        urlIndex = toBase10(shortURL)
        conn = mysql.connect()
        cursor = conn.cursor()
        query = "SELECT long_url FROM tbl_url WHERE id=%d"%(urlIndex)
        cursor.execute(query)
        
        try:
            redirectURL = cursor.fetchone()[0]
            print redirectURL    
        except Exception as e:
            print e

        conn.commit()
        cursor.close()
        conn.close()

        return redirect(redirectURL)
    return render_template('index.html')



if __name__ == '__main__':
    print "starting"
    app.run(host="0.0.0.0", port=5000, debug=True)