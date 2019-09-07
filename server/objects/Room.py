import itertools
import random
from objects.Card import Card,CARD_SUIT,CARD_TYPE
from objects.Player import Player
from objects.Settings import Settings

class Room:
    """ Represents a Game room.

    This class keeps track of the players list and card objects
    associated with a game room. 
    """

    def __init__(self, room_id, settings, originX=0, originY=0, containJokers=False):
        self.room_id = room_id
        self.players_list = []
        self.card_list = {}
        self.settings = settings
        # Generate card list, initialized to the (originX, originY) position of the board.
        card_ids = [element for element in itertools.product(CARD_TYPE,CARD_SUIT)]

        # Add the jokers if there are jokers
        if (containJokers):
            card_ids.extend((('J','B'),('J','R')))

        # Create all the cards
        for card_name,card_suit in card_ids:
            card = Card(card_name+card_suit,originX,originY,False)
            self.card_list[card.name] = card

    def enter_room(self, player):
        """Add a player to the room"""
        self.players_list.append(player)

    def leave_room(self, player):
        """Remove a player from the room"""
        self.players_list.remove(player)

    def get_id(self):
        """Get the room id"""
        return room_id

    def get_players_list(self):
        """Return a list of players in the room"""
        for player in players_list:
            yield player
    
    def get_cards_list(self):
        """Return a list of the cards in the room"""
        for card_name,card in card_list:
            yield card
    
    def change_card(self, card):
        """Change the state of a card"""
        self.card_list[card.name] = card