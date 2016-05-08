#!/usr/bin/python
# app.py
from flask import Flask, render_template, request, redirect, jsonify
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
import json
from math import floor
from urlparse import urlparse
from datetime import datetime, timedelta
from helpers import toBase62, toBase10
from helpers import readDBInfo, toBase62, toBase10, getURL, insertURL

dbInfo = readDBInfo()
mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_DB'] = dbInfo[0]
app.config['MYSQL_DATABASE_HOST'] = dbInfo[1]
app.config['MYSQL_DATABASE_USER'] = dbInfo[2]
app.config['MYSQL_DATABASE_PASSWORD'] = dbInfo[3]
mysql.init_app(app)
host = 'http://52.37.140.113/'
CORS(app)

@app.route('/createCustomURL', methods=['POST'])
def createCustomURL():
    if request.method == 'POST':
        print request.form
        for key in request.form:
            data = json.loads(key)

        print data
        
        # original_url = data['url']
        
        # if urlparse(original_url).scheme == '':
        #     original_url = 'http://' + original_url

        # shortURL = insertURL(original_url)
        # return jsonify({'url': shortURL})


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
    cursor.execute(query)
    data = cursor.fetchall()
    # Close connections
    conn.commit()
    cursor.close()
    conn.close()
    res = []
    for i in range(0, len(data)):
        res.append((toBase62(data[i][0]), data[i][1], data[i][2]))
    # print res
    return jsonify({'top_ten': res})

# get number of visits when given a shortURL
@app.route('/getNumVisits', methods=['POST'])
def getNumVisits():
    if request.method == 'POST':
        for key in request.form:
            data = json.loads(key)

        shortURL = data['url']

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
        
        # print numVisits

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'num_visits': str(numVisits)})

# insert method takes in og url -> returns id of inserted record -> encode to b62 -> update shorturl in db ?
@app.route('/getShortURL', methods=['POST'])
def getShortURL():
    if request.method == 'POST':
        print request.form
        for key in request.form:
            data = json.loads(key)

        original_url = data['url']
        
        if urlparse(original_url).scheme == '':
            original_url = 'http://' + original_url

        shortURL = insertURL(original_url)
        return jsonify({'url': shortURL})

# Routing method retrieves og url and routes window to it -> increments visit count by 1
@app.route('/<shortURL>')
def useShortURL(shortURL):
    if (shortURL != "None" and shortURL != "favico.ico"):
        
        urlIndex = toBase10(shortURL)
        redirectURL = getURL(urlIndex)
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
    app.run(host='0.0.0.0', port=80, debug=True)