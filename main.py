from flask import Flask, render_template, redirect, url_for, send_from_directory, session
from flask_socketio  import SocketIO, join_room, leave_room, send, emit
from objects.Room import Room
from objects.Player import Player

import random
import string

app = Flask(__name__, static_url_path = '', static_folder='public', template_folder='public')
socketio = SocketIO(app)
rooms = {}

@app.route('/',methods=['GET','POST'])
def index():
    return render_template('index.html')

@app.route('/game',methods=['GET','POST'])
def game():
    return render_template('game.html')

@app.route('/game/<string:room_id>')
def render_room(room_id):
    on_join(room_id)
    return redirect(url_for('game'))

def generate_room_id():
    """ Generate ID for room """
    id_length = 6
    while True:
        id_tmp = ''.join(random.SystemRandom().choice(string.ascii_uppercase) for _ in range(id_length))
        conflict = id_tmp in rooms
        if not conflict:
            return id_tmp

@socketio.on('generate_user_id')
def generate_user_id():
    emit('generate_user_id',{'data': generate_room_id()})
    
@socketio.on('create')
def on_create(data):
    ''' Creates game lobby '''
    game_id = generate_room_id()
    room = Room(room_id=game_id, excluded=data['excluded'], numPlayers=data['numPlayers'])
    rooms[game_id] = room
    data['roomCode'] = game_id
    emit('room_number',{'room_id': game_id})
    on_join(data)
        
@socketio.on('join_room')
def on_join(data):
    joining_user = Player(username=data['userName'], userPPUrl=data['userPPUrl'])
    room_id = data['roomCode']
    if room_id in rooms:
        session['room_id'] = room_id
        print(session['room_id'])
        join_room(room_id)
        room = rooms[room_id]
        room.enter_room(joining_user)
        emit('confirm')
    else:
        emit('error', {'error' : f'Room {room_id} passed does not exist'})
    on_check()

@socketio.on('check_room')
def on_check():
    room = get_room()
    if len(room.players_list) == int(room.numPlayers):
        emit('start', {'data':room.toJSON()}, broadcast=True)

def get_room():
    return rooms[session['room_id']]

# Stuff with the commands

@socketio.on('cursor')
def cursor_move(msg):
    room = get_room()
    for player in room.players_list:
        if player.session_id is msg['author']:
            player.move_cursor(msg['cursor_x'],msg['cursor_y'])
            break
    emit('cursor', msg, broadcast=True)

@socketio.on('card_move')
def card_move(msg):
    room = get_room()
    card = room.get_card(msg['cardName'])
    card.set_position(msg['newX'], msg['newY'])
    room.update_card(card)
    # broadcast new position to all
    emit('card_move',msg,broadcast=True)

@socketio.on('transfer')
def transfer(msg):
    room = get_room()
    card = room.get_card(msg['cardName'])
    card.set_owner(msg['newOwner'])
    room.update_card(card)
    # broadcast this information
    emit('transfer',msg,broadcast=True)

@socketio.on('card_front')
def on_card_front(msg):
    ''' Brings card to front '''
    emit('card_front', msg, broadcast=True)

@socketio.on('card_flip')
def on_card_flip(msg):
    ''' Flips card '''
    emit('card_flip', msg,broadcast=True)

@socketio.on('reset')
def on_reset(data):
    ''' Resets cards back to deck '''
    deckX = 100
    deckY = 100

    room = get_room()
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
    room = get_room()

    cards = room.card_list.items()
    random.shuffle(cards)

    cards_per_player = len(room.card_list) // len(room.players_list)
    if len(room.card_list) % len(room.players_list) > 0:
        cards_per_player += 1
    
    curr_player = 0
    for card_name, card in cards:
        if len(room.players_list[curr_player].card_list) == cards_per_player:
            curr_player += 1
        
        emit('transfer', {'cardName' : card_name, 'newOwner' : room.players_list[curr_player].username }, broadcast=True)

@socketio.on('retrieve')
def on_retrieve(msg):
    emit('retrieve', rooms[session['room_id']].toJSON())

if __name__ == '__main__':
    socketio.run(app, port=443, debug=True )
