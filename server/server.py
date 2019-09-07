from flask import Flask
from flask_socketio  import SocketIO, join_room, emit
import random
import string

app = Flask('card_app')
socketio = SocketIO(app)
rooms = {}

def generate_room_id():
    """ Generate ID for room """
    id_length = 6
    while True:
        id_tmp = ''.join(random.SystemRandom().choice(string.ascii_uppercase) for _ in range(id_length))
        conflict = id_tmp in [room.game_id for room in rooms]
        if not conflict:
            return id_tmp

@socketio.on('create')
def on_create(data):
    print('hello')

<<<<<<< HEAD
@socketio.on('message')
def on_message(data):
    print('hello')
=======
# https://secdevops.ai/weekend-project-part-2-turning-flask-into-a-real-time-websocket-server-using-flask-socketio-ab6b45f1d896

>>>>>>> 67768ab90c4fe330a60527d2cf4723e0a76652f2
