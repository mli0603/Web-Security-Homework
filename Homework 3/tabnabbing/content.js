NUM_ELEMENT = 3;
chrome.runtime.onMessage.addListener(onNewMessage);
var percentage = 1/NUM_ELEMENT;

function onNewMessage(request){
    console.log("received message");
    console.log(request.mask);
    updateCSS(request.mask);
}

function updateCSS(mask){
    // add div tag
    for (r = 0; r < NUM_ELEMENT; r++) {
        for (c=0; c < NUM_ELEMENT; c++){
            // console.log(r,c)
            var css = this.document.getElementById('overlay-css-'+String(r)+String(c));
            top_point = Math.round(this.document.documentElement.scrollTop + r*percentage*this.document.documentElement.clientHeight);
            left_point = Math.round(0 + c*percentage*this.document.documentElement.clientWidth);
            css.innerHTML = '.overlay-'+ String(r)+String(c) +' { position: absolute; top:'+ top_point + 'px;left:' + left_point + 'px;height:'+ percentage*100+ '%;width:'+percentage*100+'%;background-color: rgba(0,0,0,' + mask[r*NUM_ELEMENT+c]+ ');z-index: 10;pointer-events: none;}';
        }
    }
    
}

function addOverlay(){
    for (r = 0; r < NUM_ELEMENT; r++) {
        for (c=0; c < NUM_ELEMENT; c++){
                // console.log(r,c)
                var overlay = this.document.createElement('div');
                overlay.className = 'overlay-'+String(r)+String(c);
                overlay.id = 'overlay-'+String(r)+String(c);
                this.document.body.appendChild(overlay);

                // add css
                var css = this.document.createElement('style');
                css.id = 'overlay-css-'+String(r) + String(c);
                css.innerHTML = '.overlay-'+ String(r)+String(c) +' { position: absolute; top: 0px;left: 0px; height: 100%;width:100%;background-color: rgba(0,0,0,0.0);z-index: 10;pointer-events: none;}';
                this.document.body.appendChild(css);
    
        }
    }
}

addOverlay();
