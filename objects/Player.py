import json
import random

class Player:
    def __init__(self, username, userPPUrl):
        self.username = username
        self.userPPUrl = userPPUrl
        self.card_list = []
        self.cursor_x = 0
        self.cursor_y = 0
        r = lambda: random.randint(0,255)
        self.color = '#%02X%02X%02X' % (r(),r(),r())
    
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