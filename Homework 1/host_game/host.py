from flask import render_template
from flask import Flask
from flask import request
from util import check_winner
from flask_socketio import SocketIO, emit

app = Flask(__name__)
params = {
    'ping_timeout': 5,
    'ping_interval': 1
}
socketio = SocketIO(app, **params)

grid_size = 19
stones = [['x' for i in range(grid_size)] for j in range(grid_size)]
clients = []
active_client = 0
playing = False


@app.route('/')
def chess(name=None):
    return render_template('index.html', name=None)


@socketio.on('connect')
def on_connect():
    global clients, stones, active_client, playing
    print("%s connected" % (request.sid))

    # when we have fewer than 2 players, register them
    if len(clients) < 2:
        if len(clients) == 0:
            emit('register', {'color': 'b'})
        else:
            emit('register', {'color': 'w'})
        clients.append(request.sid)
    # otherwise tell them the game so far
    else:
        print("Too many clients")
        clients.append(request.sid)
        if playing:
            for y in range(grid_size):
                for x in range(grid_size):
                    if stones[y][x] != 'x':
                        emit('draw_stone', {'x': x, 'y': y, 'color': stones[y][x],
                                            'winner': 'x', 'response': 'OK'})
        return

    # if we have more two players and game has not started
    if len(clients) >= 2 and not playing:
        start_game()
        


@socketio.on('disconnect')
def on_disconnect():
    print("%s disconnected" % (request.sid))
    global clients, playing
    clients.remove(request.sid)

    if len(clients) < 2:
        print("not enough players")
        playing = False
        emit('play', {'status': playing, 'message':"Wait for players"}, broadcast=True)
    else:
        start_game()

def start_game():
    print("start game!!!")
    global clients, stones, active_client, playing
    playing = True
    # emit('play', {'status': playing}, room=clients[0])
    for i in range(len(clients)):
        if i == 0 or i == 1:
            emit('play', {'status': playing, 'message':"Game started"}, room=clients[i])
        else:
            emit('play', {'status': playing, 'message':"Game started, watching"},room=clients[i])
    active_client = 0
    stones = [['x' for i in range(grid_size)] for j in range(grid_size)]



@socketio.on('draw_stone')
def on_draw_stone(message):
    global active_client, playing
    print("%s draw_stone" % (request.sid))

    if not playing:
        return

    # check if client in list
    if not request.sid in clients[:2]:
        emit('draw_stone', {'x': -1, 'y': -1, 'color': 'x',
                            'winner': 'x', 'response': 'You can only watch!'})
        return
    # check if this is my turn
    id = clients[:2].index(request.sid)
    if id != active_client:
        emit('draw_stone', {'x': -1, 'y': -1, 'color': 'x',
                            'winner': 'x', 'response': 'Wait for the other player to move!'})
        return

    x = message["x"]
    y = message["y"]

    # check if move is legal
    if (x < 0 or x >= grid_size or y < 0 or y >= grid_size):
        emit('draw_stone', {'x': x, 'y': y, 'color': 'x',
                            'winner': 'x', 'response': 'Illegal move'})
        return
    if (stones[y][x] != 'x'):
        emit('draw_stone', {'x': x, 'y': y, 'color': 'x',
                            'winner': 'x', 'response': 'Illegal move'})
        return

    # decide on color
    if id == 0:
        color = 'b'
    else:
        color = 'w'
    stones[y][x] = color

    # check if we have a winner
    winner = check_winner(stones, grid_size)
    # send corresponding message
    if winner == 'b':
        playing = False
        emit('draw_stone', {'x': x, 'y': y, 'color': color,
                            'winner': "You", 'response': 'OK'}, room=clients[0])
        emit('draw_stone', {'x': x, 'y': y, 'color': color,
                            'winner': "Other", 'response': 'OK'}, room=clients[1])
    elif winner == 'w':
        playing = False
        emit('draw_stone', {'x': x, 'y': y, 'color': color,
                            'winner': "You", 'response': 'OK'}, room=clients[1])
        emit('draw_stone', {'x': x, 'y': y, 'color': color,
                            'winner': "Other", 'response': 'OK'}, room=clients[0])
    else:
        emit('draw_stone', {'x': x, 'y': y, 'color': color,
                            'winner': winner, 'response': 'OK'}, broadcast=True)
    active_client = (active_client + 1) % 2


if __name__ == "__main__":
    socketio.run(app, debug=False)
