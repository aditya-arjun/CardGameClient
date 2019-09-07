

class Room:
    """ Represents a Game room.

    This class keeps track of the players list and card objects
    associated with a game room. 
    """

    def __init__(self, room_id):
        self.room_id = room_id
        self.players_list = []
        self.card_list = []
        # TODO: insert code to generate card list, initialized to the center of the board.
        # We also need to set the depth of all the cards
        

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
    
    def change_card(self, card_id, card):
        """Change the state of a card"""
        self.card_list[card_id] = card