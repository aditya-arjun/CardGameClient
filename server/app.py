
from flask import Flask, render_template, redirect, url_for, send_from_directory, session
from flask_socketio  import SocketIO, join_room, leave_room, send, emit
from objects import Card, Player, Room
import random
import string

app = Flask(__name__, static_url_path = '', static_folder='../public', template_folder='../public')
socketio = SocketIO(app)
rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/<string:room_id>')
def render_room(room_id):
    if room_id in rooms:
        return rooms[room_id]
    return redirect(url_for('index'))

def generate_room_id():
    """ Generate ID for room """
    id_length = 6
    while True:
        id_tmp = ''.join(random.SystemRandom().choice(string.ascii_uppercase) for _ in range(id_length))
        conflict = id_tmp in rooms
        if not conflict:
            return id_tmp

@socketio.on('create')
def on_create(data):
    ''' Creates game lobby '''
    game_id = generate_room_id()
    room = Room(room_id=game_id, settings=data['settings'])
    rooms[game_id] = room
    join_room(room)
    emit('join_room', {'room' : room})
    return redirect(f'/{game_id}')

@socketio.on('join_room')
def on_join(data):
    room_id = data['room']
    if room_id in rooms.keys():
        join_room(room_id)
        session['room_id'] = room_id
    else:
        emit('error', {'error' : f'Room {room_id} passed does not exist'})

def get_room(session):
    return rooms[session['room_id']]

# Stuff with the commands

@socketio.on('cursor')
def cursor_move(msg):
    # TODO: implement each player's cursor, then do a broadcast that tells everyone the cursor position
    room = get_room(session)

@socketio.on('card_move')
def card_move(msg):
    room = get_room(session)
    card = room.get_card(msg['cardName'])
    card.set_position(msg['newX'], msg['newY'])
    print(msg['cardName'] + ' changed to position: ' + msg['newX'] + ' ' +  msg['newY'])
    room.update_card(card)
    # broadcast new position to all
    emit('card_move',msg,room=room.room_id)

@socketio.on('transfer')
def transfer(msg):
    room = get_room(session)
    card = room.get_card(msg['cardName'])
    card.set_owner(msg['newOwner'])
    room.update_card(card)
    # broadcast this information
    emit('transfer',msg,room=room.room_id)

@socketio.on('card_front')
def on_card_front(data):
    ''' Brings card to front '''
    card_id = data['card_name']
    room = get_room(session)
    room_id = room.room_id
    emit('card_front', data, room=room_id)

@socketio.on('card_flip')
def on_card_flip(data):
    ''' Flips card '''
    card_id = data['card_name']
    room = get_room(session)
    room_id = room.room_id
    room.card_list[card_id].flip()
    emit('card_flip', data, room=room_id)

@socketio.on('reset')
def on_reset(data):
    ''' Resets cards back to deck '''
    deckX = 100
    deckY = 100

    room = get_room(session)
    room_id = room.room_id
    for card in room.get_cards_list():
        card.x = deckX
        card.y = deckY
        if card.face_up:
            card.flip()
            emit('card_flip', {'card_name' : card.name }, broadcast=True)
        
        if card.owner:
            card.set_owner(None)
            emit('transfer', {'cardName' : card.name, 'newOwner' : None }, broadcast=True)
        
        emit('card_move',{'cardName' : card.name, 'newX' : card.x, 'newY' : card.y}, broadcast=True)

@socketio.on('deal')
def on_deal(data):
    ''' Deals cards to players and sends info '''
    room = get_room(session)
    room_id = room.room_id

    cards = room.card_list.items()
    random.shuffle(items)

    cards_per_player = len(room.card_list) // len(room.players_list)
    if len(room.card_list) % len(room.players_list) > 0:
        cards_per_player += 1
    
    curr_player = 0
    for card_name, card in cards:
        if len(room.players_list[curr_player].card_list) == cards_per_player:
            curr_player += 1
        
        emit('transfer', {'cardName' : card_name, 'newOwner' : room.players_list[curr_player].username }, broadcast=True)








if __name__ == '__main__':
    socketio.run(app, debug=True)
