from flask import Flask, render_template, request
from flask.json import jsonify
from pymongo import MongoClient
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'muntari'
app.config['BCRYPT_LEVEL'] = 10

bcrypt = Bcrypt(app)

client = MongoClient('localhost', 27017)
db = client.dbjungle

@app.route('/')
def home():
    return render_template('signin.html')

@app.route('/user/signup', methods=["POST"])
def sign_up():
    user_id = request.form['userId']
    user_pw = request.form['userPw']
    pw_hash = bcrypt.generate_password_hash(user_pw)
    find_user = db.users.find_one({'user_id' : user_id})

    if find_user is not None:
        return jsonify({'result': 'exist_userId'})

    db.users.insert_one({'userId' : user_id, 'userPw': pw_hash})
    return jsonify({'result': 'success'})

@app.route('/user/signin', methods=["POST"])
def sign_in():
    user_id = request.form['userId']
    user_pw = request.form['userPw']
    find_user = db.users.find_one({'userId' : user_id})
    
    if find_user is None:
        return jsonify({'result' : 'Not coract'})

    find_pw = find_user['userPw']
    if bcrypt.check_password_hash(find_pw, user_pw):
        return jsonify({'result' : 'success'})
    return jsonify({'result': 'Not coract'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)