from flask import Flask
from flask_socketio  import SocketIO, join_room, leave_room, send, emit
from objects import Card, Player, Room
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
        conflict = id_tmp in rooms.keys()
        if not conflict:
            return id_tmp

@socketio.on('create')
def on_create(data):
    ''' Creates game lobby '''
    game_id = generate_room_id()
    room = Room()
    rooms[game_id] = room
    join_room(room)
    emit('join_room', {'room' : room})

if __name__ == '__main__':
    socketio.run(app, debug=True)
