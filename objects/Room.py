import itertools
import random
import json
from objects.Card import Card,CARD_SUIT,CARD_TYPE
from objects.Player import Player

class Room:
    """ Represents a Game room.

    This class keeps track of the players list and card objects
    associated with a game room. 
    """

    def __init__(self, room_id, excluded, numPlayers, originX=100, originY=200, containJokers=False):
        self.room_id = room_id
        self.players_list = []
        self.card_list = {}
        self.excluded = excluded
        self.numPlayers = numPlayers
        
        # Generate card list, initialized to the (originX, originY) position of the board.
        card_ids = [element for element in itertools.product(CARD_TYPE,CARD_SUIT)]

        card_ids.extend((('J','B'),('J','R')))
        # Create all the cards
        for card_name,card_suit in card_ids:
            card = Card(card_name+card_suit,originX,originY,False)
            self.card_list[card.name] = card

        for card_id in excluded:
            self.card_list.pop(card_id, None)
        

    def enter_room(self, player):
        """Add a player to the room"""
        self.players_list.append(player)

    def leave_room(self, player):
        """Remove a player from the room"""
        self.players_list.remove(player)

    def get_id(self):
        """Get the room id"""
        return self.room_id

    def get_players_list(self):
        """Return a list of players in the room"""
        for player in self.players_list:
            yield player
    
    def get_cards_list(self):
        """Return a list of the cards in the room"""
        for card_name,card in self.card_list:
            yield card

    def get_card(self, card_name):
        """Get a specific card"""
        return self.card_list[card_name]
    
    def update_card(self, card):
        """Change the state of a card"""
        self.card_list[card.name] = card

    def toJSON(self):
        """Convert the Room to JSON Format"""
        return json.dumps(self, default=lambda o: o.__dict__, indent=4)