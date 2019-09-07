from flask import Flask, render_template, redirect, url_for, send_from_directory, session
from flask_socketio  import SocketIO, join_room, leave_room, send, emit
from objects import Card, Player, Room
import random
import string

# config = {
#     "apiKey": "AIzaSyCJICEdyv7BNBLsAGvo8praE61ELBZhBhE",
#     "authDomain": "cards-216a6.firebaseapp.com",
#     "databaseURL": "https://cards-216a6.firebaseio.com",
#     "projectId": "cards-216a6",
#     "storageBucket": "cards-216a6.appspot.com",
#     "messagingSenderId": "579456830961",
#     "appId": "1:579456830961:web:7853ac66dc5b91fc718850"
# };

# firebase = pyrebase.initialize_app(config)
# auth = firebase.auth()
# db = firebase.database()

app = Flask(__name__, static_url_path = '', static_folder='../public', template_folder='../public')
socketio = SocketIO(app)
rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/<int:room_id>')
def render_room():
    if 'player' not in session:
        return 'hello'
    return 'bye'

@app.route('/register')
def register():
    return 'lol'


def generate_room_id():
    """ Generate ID for room """
    id_length = 6
    while True:
        id_tmp = ''.join(random.SystemRandom().choice(string.ascii_uppercase) for _ in range(id_length))
        conflict = id_tmp in rooms.keys()
        if not conflict:
            return id_tmp

@socketio.on('create')
def on_create(data):
    ''' Creates game lobby '''
    game_id = generate_room_id()
    room = Room(room_id=game_id)
    rooms[game_id] = room
    join_room(room)
    emit('join_room', {'room' : room})

@socketio.on('join_room')
def on_join(data):
    room_id = data['room']
    if room_id in rooms.keys():
        join_room(room_id)
    else:
        emit('error', {'error' : f'Room {room_id} passed does not exist'})

if __name__ == '__main__':
    socketio.run(app, debug=True)
