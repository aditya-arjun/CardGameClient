
class Player:
    def __init__(self, session_id, username):
        self.session_id = session_id
        self.username = username
        self.card_list = []
    
    def add_card(self, card):
        self.card_list.append(card)
    
    def remove_card(self, card):
        self.card_list.remove(card)
    
        