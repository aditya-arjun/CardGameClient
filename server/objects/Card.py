
CARD_TYPE = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
CARD_SUIT = ['C','D','H','S']

class Card: 
    def __init__(self, name, x, y, face_up=False, depth=0, owner=None):
        self.name = name
        self.x = x
        self.y = y
        self.face_up = face_up
        # Higher depth on top
        self.depth = depth
        self.owner = owner
    
    def flip(self):
        self.face_up = not self.face_up
    
    def set_owner(self, nxt_owner):
        self.owner = nxt_owner
    
    def card_value(self):
        ''' Returns integer representation of value of card '''
        if self.name == 'JB' or self.name == 'JR':
            return len(CARD_TYPE)
        
        return CARD_TYPE.index(name[0])
    
    def set_depth(self, nxt_depth):
        self.depth = nxt_depth