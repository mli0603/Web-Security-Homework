import copy
from collections import deque

# check if anyone has won the game


def check_winner(stones, grid_size):
    result_h = checkrow(copy.deepcopy(stones))  # horizontal
    result_v = checkcol(copy.deepcopy(stones))  # vertical
    result_da = checkcol(shiftstone(copy.deepcopy(
        stones), 'ascending', grid_size))  # diagnal ascending
    result_dd = checkcol(shiftstone(copy.deepcopy(
        stones), 'descending', grid_size))  # diagnal descending

    if (result_h != 'x'):
        return result_h
    elif (result_v != 'x'):
        return result_v
    elif (result_dd != 'x'):
        return result_dd
    elif (result_da != 'x'):
        return result_da
    return 'x'

# check if 5 consecutive stones have been placed along a row


def checkrow(s):
    white_win = 'wwwww'
    black_win = 'bbbbb'

    h = ''
    for sublist in s:
        for item in sublist:
            h += item
        h += 'x'
    if white_win in h:
        return 'w'
    elif black_win in h:
        return 'b'
    else:
        return 'x'

# check if 5 consecutive stones have been placed along a column


def checkcol(s):
    return checkrow(list(map(list, zip(*s))))

# shift stones ascending or descending


def shiftstone(s, direction, grid_size):
    if (direction == "descending"):
        # shift i-th row by i left
        for i in range(grid_size):
            dq = deque(s[i])
            dq.rotate(-i)
            s[i] = list(dq)
    else:
        # shift i-th row by (intersection - i - 1) left
        for i in range(grid_size):
            dq = deque(s[i])
            dq.rotate(-grid_size + i + 1)
            s[i] = list(dq)
    return s


if __name__ == "__main__":
    grid_size = 19
    stones = [['x' for i in range(grid_size)] for j in range(grid_size)]
    stones[0][4] = 'b'
    stones[1][3] = 'b'
    stones[2][2] = 'b'
    stones[3][1] = 'b'
    stones[4][0] = 'b'
    print(check_winner(stones, grid_size))
    # check_winner(stones,grid_size)
