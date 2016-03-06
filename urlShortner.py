from flask import Flask, render_template, request
from flaskext.mysql import MySQL
import string

# root@localhost:shorturl;

mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'shorturl'
app.config['MYSQL_DATABASE_DB'] = 'urlDB'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


@app.route('/')
def hello_world():
    # return 'Hello World!'

    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * from tbl_url")
    data = cursor.fetchall()
    print len(data)
    print data
    return render_template('index.html')

if __name__ == '__main__':
    app.run()

# CREATE TABLE `urlDB`.`tbl_url` (
#   `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
#   `long_url` VARCHAR(500) NULL,
#   `short_url` VARCHAR(6) NULL,
#   `num_visits` MEDIUMINT(45) NULL,
#   `insert_date`  DATETIME NOT NULL,
#   PRIMARY KEY (`id`));