import itertools
import random
from Card import Card,CARD_SUIT,CARD_TYPE
from Player import Player

class Room:
    """ Represents a Game room.

    This class keeps track of the players list and card objects
    associated with a game room. 
    """

    def __init__(self, room_id, originX=0, originY=0, containJokers=False):
        self.room_id = room_id
        self.players_list = []
        self.card_list = []
        # Generate card list, initialized to the (originX, originY) position of the board.
        # We also need to set the depth of all the cards
        self.depth_counter = 54
        depth_list = [i for i in range(52)]
        card_ids = [element for element in itertools.product(CARD_TYPE,CARD_SUIT)]

        # Add the jokers if there are jokers
        if (containJokers):
            depth_list.extend((52,53))
            card_ids.extend((('J','B'),('J','R')))
        random.shuffle(depth_list)

        # Create all the cards
        for i in range(len(depth_list)):
            card = Card(card_ids[i][0]+card_ids[i][1],originX,originY,depth_list[i])
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