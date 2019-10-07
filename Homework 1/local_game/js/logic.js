space = 40
grid_size = 19
padding = 20
width = space * grid_size
height = space * grid_size
var context, curr_user = 'b', canvas
var stones = Array.from(Array(grid_size), _ => Array(grid_size).fill('x'));
var playing = false

// load canvas context and add event listener
function initialize() {
    canvas = document.getElementById("canvas_1")
    canvas.addEventListener("mousedown", cbMouseDown, false)
    context = canvas.getContext("2d")
    drawboard()
}

// (re)start game
function cbStart() {
    console.log('clicked')
    button = document.getElementById("start_button")
    playing = !playing
    if (playing) {
        button.innerText = 'Stop'
    }
    else {
        button.innerText = 'Start'
        resetGame()
    }
    console.log("Now playing?: " + playing)

}

// reset game
function resetGame() {
    context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawboard()
    stones = Array.from(Array(grid_size), _ => Array(grid_size).fill('x'))
    curr_user = 'b'
}

// put stone
function cbMouseDown(event) {
    x = event.pageX
    y = event.pageY

    if (playing) {
        // TODO: detect client ID
        drawstone(x, y)

        // check if we have a winner
        winner = checkwin()
        if (winner != 'x') {
            alert('Winner is ' + winner + ' !')
            cbStart()
        }

        // switch user
    }

}

// round mouse position to grid
function roundlocation(x, y) {
    // TODO: fix this hard coded position??
    shift = 50

    // change to grid location
    console.log("event position", x, y)
    x = Math.round((x - shift) / space)
    y = Math.round((y - shift) / space)
    console.log("rounded position", x, y)

    return [x, y]
}

// check if anyone has won the game
function checkwin() {
    result_v = checkrow(stones) // vertical
    result_h = checkcol(stones) // horizontal
    result_dd = checkcol(shiftstone(stones, 'descending')) // diagnal descending
    result_da = checkcol(shiftstone(stones, 'ascending')) // diagnal ascending

    if (result_v != 'x') {
        return result_v
    }
    else if (result_h != 'x') {
        return result_h
    }
    else if (result_dd != 'x') {
        return result_dd
    }
    else if (result_da != 'x') {
        return result_da
    }
    return 'x'
}

// shift stones ascending or descending
function shiftstone(stones, direction) {
    s = JSON.parse(JSON.stringify(stones)) // make a deep copy of array
    if (direction == "descending") {
        // shift i-th row by i left
        for (i = 0; i < grid_size; i++) {
            for (j = 0; j < i; j++) {
                e = s[i].shift()
                s[i].push(e)
            }
        }
    }
    else {
        // shift i-th row by (intersection - i - 1) left
        for (i = 0; i < grid_size; i++) {
            for (j = 0; j < grid_size - i - 1; j++) {
                e = s[i].shift()
                s[i].push(e)
            }
        }
    }
    return s
}

// check if 5 consecutive stones have been placed along a row
function checkrow(s) {
    white_win = 'wwwww'
    black_win = 'bbbbb'

    v = []
    for (i = 0; i < grid_size; i++) {
        v[i] = s[i].join("")
    }
    v = v.join("x")

    if (v.includes(white_win)) {
        return 'w'
    }
    else if (v.includes(black_win)) {
        return 'b'
    }
    else {
        return 'x'
    }
}

// check if 5 consecutive stones have been placed along a column
function checkcol(s) {
    return checkrow(s[0].map((col, i) => s.map(row => row[i])))
}

// check malicious stone and draw right stone
function drawstone(x, y) {
    rounded = roundlocation(x, y)
    x = rounded[0], y = rounded[1]

    // check if position is taken
    if (stones[y][x] != 'x') {
        console.log("space taken!")
    }
    // record position   
    else {
        stones[y][x] = curr_user

        // change to canvas location
        context.beginPath()
        context.arc(x * space + padding, y * space + padding, 15, 0, 2 * Math.PI)
        context.stroke()

        // change color
        if (curr_user == 'b') {
            context.fillStyle = "black"
            curr_user = 'w'
        }
        else if (curr_user == 'w') {
            context.fillStyle = "white"
            curr_user = 'b'
        }

        // put stone
        context.fill()
    }

}

// draw a board
function drawboard() {
    console.log("draw board")
    context.beginPath()
    for (var x = padding; x <= width; x += 40) {
        context.moveTo(x, padding);
        context.lineTo(x, height - padding);
    }
    for (var y = padding; y <= height; y += 40) {
        context.moveTo(padding, y);
        context.lineTo(width - padding, y);
    }
    context.strokeStyle = "black";
    context.stroke();
}