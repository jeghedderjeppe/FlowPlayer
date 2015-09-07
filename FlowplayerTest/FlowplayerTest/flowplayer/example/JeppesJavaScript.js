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

function onStartEvent() {
    console.log(">>> " + "onStartEvent");
    timer = setInterval(function () {
        sendReportToGoogleAnalytics();
    }, interval);

    currentMilestone = 0;
    milestonesReached = [];
    milestonesReached.push(0);
    milestonesSkipped = [];

    ga("send", {
        "hitType": "event",
        "eventCategory": window.eventCategory,
        "eventAction": "Start " + (interval / 1000),
        "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
        "eventValue": interval
    });
}

function onFinishEvent() {
    console.log(">>> " + "onFinishEvent");
    clearInterval(timer);
    currentMilestone = 0;
    ga("send", {
        "hitType": "event",
        "eventCategory": window.eventCategory,
        "eventAction": "Finish " + Math.round(window.flowplayer("player").getTime() / (interval / 1000)) * (interval / 1000),
        "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
        "eventValue": interval
    });
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
}

function onSeekEvent(arg1, arg2) {
    timer = setInterval(function () {
        sendReportToGoogleAnalytics();
    }, interval);
}

function sendReportToGoogleAnalytics() {
    currentMilestone = Math.round(window.flowplayer("player").getTime() / (interval / 1000)) * (interval / 1000);
    var seekInTimeAlt = (parseFloat(currentMilestone) - parseFloat(interval / 1000));
    var seekOutTimeAlt = getLargest(milestonesReached, milestonesSkipped) + parseFloat(interval / 1000);
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
            "eventAction": "SeekIn " + seekInTimeAlt,
            "eventLabel": window.flowplayer("player").getClip().url.split("/")[4].split("_")[0],
            "eventValue": interval
        });
        console.log("SeekOut   " + seekOutTimeAlt);
        console.log("SeekIn    " + seekInTimeAlt);

        setSkippedMilestoneList(seekOutTimeAlt, seekInTimeAlt);
    }
    if (milestonesReached.indexOf(currentMilestone) == -1) {

        var eventAction;
        if (milestonesSkipped.indexOf(currentMilestone) != -1) {
            eventAction = "SkippedMilestone " + currentMilestone;
        }
        else {
            eventAction = "Milestone " + currentMilestone;
        }
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
function getLargest(arr, arr2) {
    var arrString = arr + ","+ arr2;
    var theArr = arrString.split(",");
    var largest = -1;

    var newArr = [];
    for (var key in theArr) {
        newArr.push(parseFloat(theArr[key]));
    };

    for (var key in newArr) {
        if (newArr[key] > largest) {
            largest = newArr[key];
        }
    }

    return largest;
}


function setSkippedMilestoneList(start, end) {
   // if (start === end) return;
    for (; start <= end;) {
        milestonesSkipped.push(start);
        start += (interval / 1000);
    };
}