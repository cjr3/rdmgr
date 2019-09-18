var playing = false;
var timer = null;
var toggle = false;

/**
 * Triggered when a request is received.
 */
onmessage = function(req) {
    if(req.data === 'play') {
        play();
    } else if(req.data === 'pause') {
        pause();
    }
}

/**
 * Cancels the rendering
 */
function clear() {
    try {cancelAnimationFrame(timer);} catch(er) {}
}

/**
 * Pauses the rendering
 */
function pause() {
    clear();
    playing = false;
    postMessage('pause');
}

/**
 * Plays the rendering
 */
function play() {
    clear();
    timer = requestAnimationFrame(render);
    playing = true;
    postMessage('play');
}

/**
 * Triggers a render request
 */
function render() {
    //if(toggle)
        postMessage('render');
    toggle = !toggle;
    if(playing) {
        timer = requestAnimationFrame(render);
    }
}