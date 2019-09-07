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
        self.card_list = {}
        # Generate card list, initialized to the (originX, originY) position of the board.
        # We also need to set the depth of all the cards
        card_ids = [element for element in itertools.product(CARD_TYPE,CARD_SUIT)]

        # Add the jokers if there are jokers
        if (containJokers):
            card_ids.extend((('J','B'),('J','R')))

        # Create all the cards
        for card_name,card_suit in card_ids:
            card = Card(card_name+card_suit,originX,originY,False)
            self.card_list[card.name] = card
            print('{} {} {}'.format(card.name,card.x,card.y))

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

    def to_front(self,cardname):
        """Place a card at the front"""
        self.card_list[cardname].depth = self.depth_counter
        depth_counter = depth_counter+1
    
    def change_card(self, card):
        """Change the state of a card"""
        self.card_list[card.name] = card