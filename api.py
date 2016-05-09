#!/usr/bin/python
from flask import Flask, render_template, request, redirect, jsonify
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
import string
import json
from math import floor
from urlparse import urlparse
from datetime import datetime, timedelta
from helpers import *


dbInfo = readDBInfo()

mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_DB'] = dbInfo[0]
app.config['MYSQL_DATABASE_HOST'] = dbInfo[1]
app.config['MYSQL_DATABASE_USER'] = dbInfo[2]
app.config['MYSQL_DATABASE_PASSWORD'] = dbInfo[3]
mysql.init_app(app)
host = 'http://10.0.1.12/'
# host = 'http://localhost:5000/'
# host = 'http://52.37.140.113/'
CORS(app)


# WRITE UNIT TESTS FOR YOUR CODE

@app.route('/createCustomURL', methods=['POST'])
def createCustomURL():
    if request.method == 'POST':
        for key in request.form:
            data = json.loads(key)

        original_url = data['sourceURL']
        custom_url = data['customURL']        
        
        if urlparse(original_url).scheme == '':
            original_url = 'http://' + original_url

        urlID = insertSourceURL(original_url)
        insertCustomURL(custom_url, urlID)
        customURL = host + custom_url
        return jsonify({'url': customURL})

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

# CACHE THESE RESULTS + JOIN WITH CUSTOM 
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

# get visit information when given a shortURL
@app.route('/trackURLInfo', methods=['POST'])
def trackURLInfo():
    if request.method == 'POST':
        for key in request.form:
            data = json.loads(key)

        shortURL = data['url']
        encodedStr = shortURL[len(host):len(shortURL)]
        
        # Returns -1 if custom extension not in db            
        urlID = isCustomExt(encodedStr) 
        
        # Not a custom url string so encode to base 10 and retrieve url id
        if urlID == -1:        
            urlID = toBase10(encodedStr)

        conn = mysql.connect()
        cursor = conn.cursor()
        query = "SELECT * FROM tbl_url WHERE id=%d" % (urlID)
        cursor.execute(query)
        urlInfo = cursor.fetchone()
        
        if urlInfo != None:
            res = {'source_url': urlInfo[1], 'views': urlInfo[2], 'date_created': urlInfo[3]}
        else:
            res = None

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'url_info': res})

# insert method takes in og url -> returns id of inserted record -> encode to b62 -> update shorturl in db ?
@app.route('/getShortURL', methods=['POST'])
def getShortURL():
    if request.method == 'POST':
        for key in request.form:
            data = json.loads(key)

        original_url = data['url']
        if urlparse(original_url).scheme == '':
            original_url = 'http://' + original_url

        shortURL = insertURL(original_url)
        return jsonify({'url': shortURL})

# Routing method retrieves original url and redirects browser to it -> increments visit count by 1
@app.route('/<shortURL>')
def useShortURL(shortURL):
    if (shortURL != "None" and shortURL != "favico.ico"):
        
        print request.user_agent    # Create database cols for mac visits, windows visits, etc.. Then you can give percentage graphs relative to total views

        isCustom = isCustomExt(shortURL) # Returns -1 if custom extension not in db
        
        if isCustomExt(shortURL) != -1:
            redirectURL = getURL(isCustom)
            return redirect(redirectURL)
        else:    
            urlIndex = toBase10(shortURL)
            redirectURL = getURL(urlIndex)
        
        if(redirectURL==host[0:-1]):
            print 'No short url found: direct to home'
        else:
            return redirect(redirectURL)

    return render_template('index.html')

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=80, debug=True)