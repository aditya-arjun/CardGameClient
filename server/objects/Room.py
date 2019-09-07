

class Room:
    def __init__(self, room_id):
        self.room_id = room_id
        self.players_list = []

    def add_player(self, player):
        self.players_list.append(player)

    
        