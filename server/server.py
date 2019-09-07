from flask import Flask
from flask_socketio  import SocketIO, join_room, emit

app = Flask('card_app')
socketio = SocketIO(app)
rooms = {}

@socketio.on('create')
def on_create(data):
    print('hello')

# https://secdevops.ai/weekend-project-part-2-turning-flask-into-a-real-time-websocket-server-using-flask-socketio-ab6b45f1d896

