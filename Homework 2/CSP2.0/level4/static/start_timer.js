function startTimer(seconds) {
    seconds = parseInt(seconds) || 3;
    setTimeout(function() { 
    window.confirm("Time is up!");
    window.history.back();
    }, seconds * 1000);
}

window.onload = function(){
    gif = document.getElementById('gif')
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('timer');
    gif.onload = function(){
        startTimer(myParam)
    };
    gif.src = "/static/loading.gif" 
}