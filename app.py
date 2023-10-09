from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

#Create flask app
app = Flask(__name__)

#CORS allows for cross-origin requests (ie requests from a different server)
CORS(app)

#Create database with SQLAlchemy
app.config.from_object(Config)

db=SQLAlchemy(app)
migrate=Migrate(app, db)

# ------------------------------- MODELS --------------------------------------

#Create User tables in database

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)

    def __repr__(self):
        return '<User {}>'.format(self.username)
    

# ------------------------------- ROUTES --------------------------------------
    
# TEST request that returns a message 'Hello World'
@app.route('/api/hello', methods=['GET'])
def testHello():
    return {'message': 'Hello, World!'}

# request that returns a list of users
@app.route('/api/users', methods=['GET'])
def users():
    users = Users.query.all()
    return {'users': [{'id': user.id, 'name': user.username} for user in users]}

# request that adds a user to the database given a name in the request body
@app.route('/api/users/add', methods=['POST'])
def add_user():
    name = request.json['name']
    [user, message] = createUserByName(name)

    return {
        'user': {
            'id': user.id,
            'username': user.username,
            'message': message,
        }
    }

# request that adds a user to the database given a name in the request body
@app.route('/api/users/reset', methods=['POST'])
def reset_users():
    for u in Users.query.all():
        db.session.delete(u)
    db.session.commit()
    return users()


def createUserByName(username):
    """adds a new user to database with name, returns user"""
    existing_u = Users.query.filter_by(username=username).first()

    if not existing_u:
        u = Users(username=username)
        db.session.add(u)
        db.session.commit()
        return [u, 'created new user']
    else:
        return [existing_u, 'user already exists']
    
# ------------------------------- MAIN ----------------------------------------
if __name__ == '__main__':
    db.create_all()
    app.run()