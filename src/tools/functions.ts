function endTimeout(v) {
    try {clearTimeout(v);} catch(er) {}
}

function startTimeout(v, cb, delay, ...params) : number {
    endTimeout(v);
    return window.setTimeout(cb, delay, params);
}

function endInterval(v) {
    try {clearInterval(v);} catch(er) {}
}

function startInterval(v, cb, delay, ...params) :number {
    endInterval(v);
    return window.setInterval(cb, delay, params);
}

function endAnimation(v) {
    try {cancelAnimationFrame(v);} catch(er) {}
}

const delay = ms => new Promise(res => setTimeout(res, ms));

export {
    endTimeout,
    startTimeout,
    endInterval,
    startInterval,
    endAnimation,
    delay
};