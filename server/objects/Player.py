import json

class Player:
    def __init__(self, username, user_ppurl = '/images/2_of_clubs.png'):
        self.username = username
        self.user_ppurl = user_ppurl
        self.card_list = []
        self.cursor_x = 0
        self.cursor_y = 0
    
    def add_card(self, card):
        self.card_list.append(card)
    
    def remove_card(self, card):
        self.card_list.remove(card)
    
    def move_cursor(self, cursor_x, cursor_y):
        self.cursor_x = cursor_x
        self.cursor_y = cursor_y
    
    def toJSON(self):
        """Convert the Room to JSON Format"""
        return json.dumps(self, default=lambda o: o.__dict__, indent=4)