NUM_ELEMENT = 10;
chrome.runtime.onMessage.addListener(onNewMessage);

function onNewMessage(request){
    console.log("received message")
    console.log(request.greeting)
}

function addOverlay(){
    // add div tag
    for (r = 0; r < NUM_ELEMENT; r++) {
        for (c=0; c < NUM_ELEMENT; c++){
            console.log(r,c)
            var overlay = this.document.createElement('div');
            overlay.className = 'overlay-'+String(r)+String(c);
            overlay.id = 'overlay-'+String(r)+String(c);
            this.document.body.appendChild(overlay);

            // add css
            addCSS(r,c);
        }
    }
}

function addCSS(r,c){
    percentage = 1/NUM_ELEMENT;
    top_point = Math.round(this.document.documentElement.scrollTop + r*percentage*this.document.documentElement.clientHeight);
    left_point = Math.round(0 + c*percentage*this.document.documentElement.clientWidth);

    // add css to html
    var css = this.document.createElement('style');
    css.innerHTML = '.overlay-'+ String(r)+String(c) +' { position: absolute; top:'+ top_point + 'px;left:' + left_point + 'px;height:'+ percentage*100+ '%;width:'+percentage*100+'%;background-color: rgba(0,0,0,0.5);z-index: 10;pointer-events: none;}';
    this.document.body.appendChild(css);
}

// addOverlay();