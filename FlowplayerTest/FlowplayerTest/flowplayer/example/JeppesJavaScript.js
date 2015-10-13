(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-57122798-1', 'auto');
var interval = 1500;
var currentMilestone;
var timer;
var milestonesReached;
var milestonesSkipped;
var hasOnSeekHappened;

function onStartEvent() {
    timer = setInterval(function () {
        sendReportToGoogleAnalytics();
    }, interval);
    currentMilestone = 0;
    milestonesReached = [];
    milestonesReached.push(0);
    milestonesSkipped = [];
    hasOnSeekHappened = true;
    ga("send", {
        "hitType": "event",
        "eventCategory": window.eventCategory,
        "eventAction": "Start " + (interval / 1000),
        "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
        "eventValue": interval
    });
    console.log(">>> Start ", currentMilestone, eventCategory);
}

function onFinishEvent() {
    var seekOutTimeAlt = getLargest(milestonesReached, milestonesSkipped) + (interval / 1000);
    if (!hasOnSeekHappened) {
        ga("send", {
            "hitType": "event",
            "eventCategory": window.eventCategory,
            //"eventAction": "SeekOut " + (currentMilestone + parseFloat(interval / 1000)),
            "eventAction": "SeekOut " + seekOutTimeAlt,
            "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
            "eventValue": interval
        });
        ga("send", {
            "hitType": "event",
            "eventCategory": window.eventCategory,
            "eventAction": "SeekIn " + Math.round(window.flowplayer("player").getClip().duration),
            "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
            "eventValue": interval
        });
        console.log("SeekOut   " + (currentMilestone + parseFloat(interval / 1000)));
        console.log("SeekIn    " + Math.round(window.flowplayer("player").getClip().duration));
    }
    clearInterval(timer);
    ga("send", {
        "hitType": "event",
        "eventCategory": window.eventCategory,
        "eventAction": "Finish " + Math.round(window.flowplayer("player").getClip().duration),
        "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
        "eventValue": interval
    });
    console.log("MilestonesReached", milestonesReached);
    console.log("MilestonesSkipped", milestonesSkipped);
    console.log(">>> Finish", Math.round(window.flowplayer("player").getClip().duration));
}

function onPauseEvent() {
    console.log(">>> " + "onPauseEvent");
    clearInterval(timer);
}

function onResumeEvent() {
    console.log(">>> " + "onResumeEvent");
    timer = setInterval(function () {
        sendReportToGoogleAnalytics();
    }, interval);
}

function onBeforeSeekEvent(arg1, arg2) {
    clearInterval(timer);
    hasOnSeekHappened = false;
}

function onSeekEvent(arg1, arg2) {
    timer = setInterval(function () {
        sendReportToGoogleAnalytics();
    }, interval);
    hasOnSeekHappened = true;
}

function sendReportToGoogleAnalytics() {
    currentMilestone = Math.round(window.flowplayer("player").getTime() / (interval / 1000)) * (interval / 1000);
    var seekOutTimeAlt = getLargest(milestonesReached, milestonesSkipped) + (interval / 1000);
    var seekInTimeAlt = currentMilestone - (interval / 1000);
    if (seekInTimeAlt > seekOutTimeAlt) {
        ga("send", {
            "hitType": "event",
            "eventCategory": window.eventCategory,
            "eventAction": "SeekOut " + seekOutTimeAlt,
            "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
            "eventValue": interval
        });
        ga("send", {
            "hitType": "event",
            "eventCategory": window.eventCategory,
            "eventAction": "SeekIn " + (seekInTimeAlt + (interval / 1000)),
            "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
            "eventValue": interval
        });
        console.log("SeekOut   " + seekOutTimeAlt);
        console.log("SeekIn    " + (seekInTimeAlt + (interval / 1000)));
        setSkippedMilestoneList(seekOutTimeAlt, seekInTimeAlt);
    }
    if (milestonesReached.indexOf(currentMilestone) == -1 && currentMilestone != Math.round(window.flowplayer("player").getClip().duration)) {
        var eventAction;
        if (milestonesSkipped.indexOf(currentMilestone) != -1)
            eventAction = "SkippedMilestone " + currentMilestone;
        else
            eventAction = "Milestone " + currentMilestone;

        ga("send", {
            "hitType": "event",
            "eventCategory": window.eventCategory,
            "eventAction": eventAction,
            "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
            "eventValue": interval
        });
        console.log(eventAction);
        milestonesReached.push(currentMilestone);
    }
}
function getLargest(milestonesReached, milestonesSkipped) {
    var combinedArrayString = milestonesReached + "," + milestonesSkipped;
    var combinedArray = combinedArrayString.split(",");
    var largest = -1;
    for (var key in combinedArray) {
        if (parseFloat(combinedArray[key]) > largest) {
            largest = parseFloat(combinedArray[key]);
        }
    }
    return largest;
}


function setSkippedMilestoneList(start, end) {
    for (; start <= end;) {
        milestonesSkipped.push(start);
        start += (interval / 1000);
    };
}

var eventCategory = 'debugging16'

flowplayer("player", "../flowplayer-3.2.18.swf", {
    clip: {
        // this will be tracked under our Promo Video category
        eventCategory: eventCategory,
        onStart: onStartEvent,
        onPause: onPauseEvent,
        onResume: onResumeEvent,
        onFinish: onFinishEvent,
        onBeforeSeek: onBeforeSeekEvent,
        onSeek: onSeekEvent

    }
});