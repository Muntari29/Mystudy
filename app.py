from flask import Flask, render_template, request
from flask.json import jsonify
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'muntari'
app.config['BCRYPT_LEVEL'] = 10

bcrypt = Bcrypt(app)

client = MongoClient('localhost', 27017)
db = client.dbjungle

#jwt
app.config['JWT_SECRET_KEY'] = 'my_secrct_key'
algorithm = 'HS256'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/board')
def board():
    return render_template('board.html')

@app.route('/post_board')
def post_board():
    return render_template('post_board.html')

@app.route('/signup')
def page_signup():
    return render_template('signup.html')

@app.route('/signin')
def page_singin():
    return render_template('signin.html')

@app.route('/user/signup', methods=["POST"])
def sign_up():
    user_id = request.form['userId']
    user_pw = request.form['userPw']
    pw_hash = bcrypt.generate_password_hash(user_pw)
    find_user = db.users.find_one({'userId' : user_id})

    if find_user is not None:
        return render_template('signin.html')

    db.users.insert_one({'userId' : user_id, 'userPw': pw_hash})
    return jsonify({'result': 'success'})

@app.route('/user/signin', methods=["POST"])
def sign_in():
    user_id = request.form['userId']
    user_pw = request.form['userPw']
    find_user = db.users.find_one({'userId' : user_id})
    
    if find_user is None:
        return jsonify({'result' : 'Not correct'})

    find_pw = find_user['userPw']
    if bcrypt.check_password_hash(find_pw, user_pw):
        payload = {
            "user_id": user_id,
            "exp" : datetime.now() + timedelta(hours=2)
        }
        access_token = jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm)
        return jsonify({
            'result' : 'success',
            'access_token' : access_token
            })
    return jsonify({'result': 'Not correct'})

@app.route('/board/post', methods = ["POST"])
def board_post():
    user = request.form['user']
    title = request.form['title']
    post_body = request.form['body']

    #중복 여부 체크하지 않음
    db.posts.insert_one({'userId' : user, 'postTitle' : title, 'postBody': post_body, 'time' : datetime.now().strftime('%Y/%m/%d %H:%M:%S'), 'like' : 0})
    return jsonify({'result' : 'success'})

@app.route('/board/show', methods = ["GET"])
def show_post():
    # post_list = list(db.posts.find({}, {'_id' : False}))
    # post_list.sort(key=lambda x : x['like'], reverse=True)
    # return jsonify({
    #     'result' : 'success',
    #     'post_list' : post_list
    #     })
    offset = int(request.args.get('offset'))
    limit = int(request.args.get('limit'))

    #limit 5로 고정
    post_list = list(db.posts.find({}, {'_id' : False}).skip(offset-1).limit(5))
    next_url = '/board/show?offset=' + str(limit+1) + '&limit=' + str(limit + 5)
    prev_url = '/board/show?offset=' + str(offset-5) + '&limit=' + str(limit - 5)
    return jsonify({
        'result' : 'success',
        'post_list' : post_list,
        'next_url' : next_url,
        'prev_url' : prev_url
        })

@app.route('/board/list/' , methods =["GET"])
def _list():
    page = int(request.args.get('offset', 1))
    per_page = int(request.args.get('limit', 5))
    a = list(db.posts.find({}).skip(per_page * (page-1)).limit(5))
    
    print('=============================================')
    return jsonify({'result' : 'success', 'a' : a})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)