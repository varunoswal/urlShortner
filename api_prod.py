#!/usr/bin/python
import json
import string
from helpers import *
from math import floor
from urlparse import urlparse
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from datetime import datetime, timedelta
from werkzeug.contrib.cache import SimpleCache
from flask import Flask, render_template, request, redirect, jsonify

cache = SimpleCache()
dbInfo = readDBInfo()
mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_DB'] = dbInfo[0]
app.config['MYSQL_DATABASE_HOST'] = dbInfo[1]
app.config['MYSQL_DATABASE_USER'] = dbInfo[2]
app.config['MYSQL_DATABASE_PASSWORD'] = dbInfo[3]
mysql.init_app(app)
host = 'http://52.37.140.113/'
# host = 'http://localhost:5000/'
CORS(app)

# Create a custom URL extension
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
        res = insertCustomURL(custom_url, urlID)
        print res
        if res == False:
            customURL = False
        else:
            customURL = host + custom_url
        
        res = {'sourceURL':original_url, "shortURL": customURL}
        return jsonify({'url': res})    

# get last 100 urls that were inserted
@app.route('/getLastHundred', methods=['GET'])
def getLastHundred():
    conn, cursor = getConnObjects(mysql)
    query = "SELECT id, long_url, num_visits from tbl_url ORDER BY insert_date desc LIMIT 100"
    cursor.execute(query)
    data = cursor.fetchall()
    # print data
    # Close connections
    commitCloseConn(conn, cursor)
    return jsonify({'last_hundred': data})

# get top 10 urls by views in last month
@app.route('/getTopTen', methods=['GET'])
def getTopTen():
    conn, cursor = getConnObjects(mysql)
    res = cache.get('topten')
    if res is None:       
        print 'Cached'
        month = timedelta(days=30)
        endOfToday = str(datetime.today())[0:10] + " 23:59:00"
        lastMonth = str(datetime.today() - month)[0:10] + " 00:00:00"
        query = "SELECT * FROM tbl_url LEFT JOIN custom_url ON tbl_url.id = custom_url.long_url_id WHERE insert_date BETWEEN \'" + lastMonth  + "\' and \'" + endOfToday + "\' ORDER BY num_visits desc LIMIT 10;"
        cursor.execute(query)
        data = cursor.fetchall()
        
        # Close connections
        commitCloseConn(conn, cursor)
        res = formatTopTenData(data)
        cache.set('topten', res, timeout=60)
            
    # print res
    return jsonify({'top_ten': res})

# get visit information when given a shortURL
@app.route('/trackURLInfo', methods=['POST'])
def trackURLInfo():
    if request.method == 'POST':        
        for key in request.form:
            data = json.loads(key)
        
        customURLDict = cache.get('customUrls')
        
        if customURLDict == None:
            print 'Cached'
            customURLDict = getAllCustomExt()            
            cache.set('customUrls', customURLDict, timeout=30) 

        shortURL = data['url']
        encodedStr = shortURL[len(host):len(shortURL)]

        urlID = -1
        # Check if only custom extension given as input
        if shortURL in customURLDict:
            urlID = customURLDict[shortURL]
        elif encodedStr in customURLDict:
            urlID = customURLDict[encodedStr]
                
        # Not a custom url string so encode to base 10 and retrieve url id
        if urlID == -1:        
            urlID = toBase10(encodedStr)

        conn, cursor = getConnObjects(mysql)
        query = "SELECT * FROM tbl_url WHERE id=%d" % (urlID)
        cursor.execute(query)
        urlInfo = cursor.fetchone()
        commitCloseConn(conn, cursor)
        
        if urlInfo != None:
            res = {'source_url': urlInfo[1], 'views': urlInfo[2], 'date_created': urlInfo[3]}
        else:
            res = None       

        return jsonify({'url_info': res})

# insert method takes in original url -> returns id of inserted record which is encode to base62
@app.route('/getShortURL', methods=['POST'])
def getShortURL():
    if request.method == 'POST':
        for key in request.form:
            data = json.loads(key)

        original_url = data['url']
        if urlparse(original_url).scheme == '':
            original_url = 'http://' + original_url

        shortURL = insertURL(original_url)
        res = {'sourceURL':original_url, "shortURL": shortURL}
        return jsonify({'url': res})

# Routing method retrieves original url and redirects browser to it -> increments visit count by 1
@app.route('/<shortURL>')
def useShortURL(shortURL):
    if (shortURL != "None" and shortURL != "favico.ico"):
        # Create database cols for mac visits, windows visits, etc..
        # print request.user_agent   

        # Returns -1 if custom extension not in db
        isCustom = isCustomExt(shortURL) 
        
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

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')
    
if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=80, debug=True)