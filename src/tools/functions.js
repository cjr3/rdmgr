function endTimeout(v) {
    try {clearTimeout(v);} catch(er) {}
}

function startTimeout(v, cb, delay, ...params) {
    endTimeout(v);
    return setTimeout(cb, delay, params);
}

function endInterval(v) {
    try {clearInterval(v);} catch(er) {}
}

function startInterval(v, cb, delay, ...params) {
    endInterval(v);
    return setInterval(cb, delay, params);
}

function endAnimation(v) {
    try {cancelAnimationFrame(v);} catch(er) {}
}

export {
    endTimeout,
    startTimeout,
    endInterval,
    startInterval,
    endAnimation
};