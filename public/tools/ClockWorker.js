var hours = 0;
var minutes = 0;
var seconds = 0;
var tenths = 0;
var status = 0;
var STATUS_READY = 0;
var STATUS_RUNNING = 1;
var STATUS_STOPPED = 2;

onmessage = function(req) {
    switch(req.data.type) {
        case 'status' :
            status = req.data.status;
        break;

        case 'set' :
            hours = req.data.hours;
            minutes = req.data.minutes;
            seconds = req.data.seconds;
            tenths = 0;
        break;

        case 'init' :
            hours = req.data.hours;
            minutes = req.data.minutes;
            seconds = req.data.seconds;
            tenths = 0;
            setInterval(tick, 100);
        break;
    }
};

async function tick() {
    if(status !== STATUS_RUNNING) {
        return;
    }

    tenths--;
    if(tenths < 0) {
        tenths = 9;
        seconds--;
        if(seconds < 0) {
            minutes--;
            seconds = 59;
            if(minutes < 0) {
                hours--;
                minutes = 59;
                if(hours < 0) {
                    hours = 0;
                    minutes = 0;
                    seconds = 0;
                    tenths = 0;
                }
            }
        }

        setTimeout(function() {
            postMessage({
                type:'tick',
                hours:hours,
                minutes:minutes,
                seconds:seconds,
                tenths:tenths
            });
        }, 0);

    } else {
        setTimeout(function() {
            postMessage({
                type:'tenths',
                hours:hours,
                minutes:minutes,
                seconds:seconds,
                tenths:tenths
            });
        }, 0);
    }

    //continue ticking
    if(hours <= 0 && minutes <= 0 && seconds <= 0 && tenths <= 0) {
        postMessage({type:'done'});
    }
}