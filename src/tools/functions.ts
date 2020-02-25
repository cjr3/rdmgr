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

function compareRecordName(a, b) {
    if(a && b && a.Name && b.Name)
        return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
    return 0;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const ordinalSuffix = (i) => {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

export {
    endTimeout,
    startTimeout,
    endInterval,
    startInterval,
    endAnimation,
    delay,
    compareRecordName,
    ordinalSuffix
};