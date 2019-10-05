space = 40
grid_size = 19
padding = 20
width = space * grid_size
height = space * grid_size
var context, canvas
var playing = false
var socket = io()
var stones = Array.from(Array(grid_size), _ => Array(grid_size).fill('x'))

// load canvas context and add event listener
function initialize() {
    canvas = document.getElementById("canvas_1")
    canvas.addEventListener("mousedown", cbMouseDown, false)
    context = canvas.getContext("2d")
    id = Math.floor((Math.random() * 100) + 1);
    drawboard()

    // set up callback
    socket.on('connect', function() {
        socket.emit('connected');
        console.log('connected')
    });
    socket.on('disconnect', function() {
        socket.emit('disconnected');
        console.log('disconnected')
    });
    socket.on('register', function(msg) {
        console.log(msg.color)
        color = msg.color
    });
    socket.on('play', function(msg) {
        console.log("playing?:" + msg.play)
        playing = msg.status
        resetGame()
        document.getElementById("status").innerText = msg.message
        
    });
    socket.on('draw_stone', function(msg){
        console.log("draw stone at" + msg.x, msg.y, msg.color)
        // illegal move
        if (msg.response != 'OK'){
            alert(msg.response)
        }
        // legal move
        else{
            // double check if move is legal
            if (msg.x < 0 || msg.x >= grid_size || msg.y<0 || msg.y>=grid_size){
                alert("Illegal move!")
                return
            }
            if (stones[msg.y][msg.x] != 'x'){
                alert("Illegal move!")
                return
            }
            drawstone(msg.x, msg.y, msg.color)
            stones[msg.y][msg.x] = msg.color

            if (msg.winner == 'You'){
                sleep(150).then(() => {
                    alert("You win!")
                })
                document.getElementById("status").innerText = 'Game Over'
            }
            else if (msg.winner == 'Other'){
                sleep(150).then(() => {
                    alert("You lose...")
                })
                document.getElementById("status").innerText = 'Game Over'
            }
        }
    });
}

// reset game
function resetGame() {
    console.log("reset game!")
    context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawboard()
    stones = Array.from(Array(grid_size), _ => Array(grid_size).fill('x'))
}

// put stone
function cbMouseDown(event) {
    x = event.pageX
    y = event.pageY

    if (playing) {
        rounded = roundlocation(x, y)
        x = rounded[0], y = rounded[1]
        socket.emit('draw_stone',{x:x, y:y})
    }
    else{
        alert("Illegal action!")
    }

}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
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

// check malicious stone and draw right stone
function drawstone(x, y, color) {
    // change to canvas location
    context.beginPath()
    context.arc(x * space + padding, y * space + padding, 15, 0, 2 * Math.PI)
    context.stroke()

    // pick color
    if (color == 'b') {
        context.fillStyle = "black"
    }
    else if (color == 'w') {
        context.fillStyle = "white"
    }

    // put stone
    context.fill()
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
