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
var currentMilestone = 0;
var timer;
var milestonesReached = [];
var milestonesSkipped = [];
var seekOutTime;
var justSeeked = false;
milestonesReached.push("Milestone 0");

function onStartEvent() {
    console.log("onStartEvent");
    timer = setInterval(function () {
        sendReportToGoogleAnalytics();
    }, interval);
}

function onFinishEvent() {
    console.log("onFinishEvent");
    clearInterval(timer);
    currentMilestone = 0;
}

function onPauseEvent() {
    console.log("onPauseEvent");
    clearInterval(timer);
}

function onResumeEvent() {
    console.log("onResumeEvent");
    timer = setInterval(function () {
        sendReportToGoogleAnalytics();
    }, interval);
}

function onBeforeSeekEvent(arg1, arg2) {
    seekOutTime = window.flowplayer("player").getTime();//milestonesReached[milestonesReached.length - 1].replace("Milestone ", "");
    clearInterval(timer);
}

function onSeekEvent(arg1, arg2) {
    timer = setInterval(function () {
        sendReportToGoogleAnalytics();
    }, interval);
    justSeeked = true;
}

function sendReportToGoogleAnalytics() {
    currentMilestone = Math.round(window.flowplayer("player").getTime() / (interval / 1000)) * (interval / 1000);
    var eventAction = currentMilestone; //var eventAction = "Milestone " + currentMilestone;
    if (justSeeked && seekOutTime < currentMilestone) {
        //ga("send", {
        //    "hitType": "event",
        //    "eventCategory": "This is a test",
        //    "eventAction": "SeekIn " + eventAction, //"eventAction": "SeekIn " + eventAction.replace("Milestone ", ""),
        //    "eventLabel": window.flowplayer("player").getClip().url,
        //    "eventValue": interval
        //});
        //var seekOutTimeAlt = (parseFloat(milestonesReached[milestonesReached.length - 1]) + parseFloat(interval / 1000)); //        var seekOutTimeAlt = (parseFloat(milestonesReached[milestonesReached.length - 1].replace("Milestone ", "")) + parseFloat(interval / 1000));
        var seekOutTimeAlt = getLargest(milestonesSkipped);
        var seekInTimeAlt = (parseFloat(currentMilestone) - parseFloat(interval / 1000));

        console.log("SeekOut " + seekOutTimeAlt);
        console.log("SeekIn " + seekInTimeAlt);

        console.log(setSkippedMilestoneList(seekOutTimeAlt, seekInTimeAlt));
        justSeeked = false;
    }
    if (milestonesReached.indexOf(eventAction) == -1) {
        if (milestonesSkipped.indexOf(eventAction) != -1) {
            eventAction = "SkippedMilestone " + currentMilestone;
        }
        //ga("send", {
        //    "hitType": "event",
        //    "eventCategory": "This is a test",
        //    "eventAction": "Milestone " + eventAction,
        //    "eventLabel": window.flowplayer("player").getClip().url,
        //    "eventValue": interval
        //});
        console.log(eventAction);

        milestonesReached.push(eventAction);
    }
}
function getLargest(arr) {
    var largest = -1;

    for (var key in arr) {
        if (arr[key].value > largest) {
            largest = arr[key].value;
        }
    }
    return largest;
}


function setSkippedMilestoneList(start, end) {
    var skippedTime = end - start;
    for (; start <= end;) {
        milestonesSkipped.push(start);
        start += (interval / 1000);
    };
    return milestonesSkipped;

}