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
var timesTriggered = 1;
var totalTimeWatched = 0;
var timer;
var milestonesReached = [];

function onStartEvent() {
    console.log("onStartEvent");
    timer = setInterval(function () {
        sendReportToGoogleAnalytics();
    }, interval);
}

function onFinishEvent() {
    console.log("onFinishEvent");
    clearInterval(timer);
    totalTimeWatched = 0;
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

var justSeeked = false;
//function onBeforeSeekEvent() {
//    console.log("onBeforeSeek");
//    console.log(milestonesReached); // [milestonesReached.length - 1].substring(0, 10)
//    //ga("send", {
//    //    "hitType": "event",
//    //    "eventCategory": "This is a test",
//    //    "eventAction": milestonesReached[fruits.length - 1].substring(0, 10),
//    //    "eventLabel": window.flowplayer("player").getClip().url,
//    //    "eventValue": interval
//    //});

//    justSeeked = true;
//}

function onSeekEvent() {
    console.log("onSeek");
    console.log(milestonesReached[milestonesReached.length - 1].replace("Milestone ", ""));
}

function sendReportToGoogleAnalytics() {
    totalTimeWatched += interval / 1000;
    //console.log("totalTimeWatched " + totalTimeWatched)
    var eventAction = "Milestone " + totalTimeWatched;
    if (milestonesReached.indexOf(eventAction) == -1) {
        ga("send", {
            "hitType": "event",
            "eventCategory": "This is a test",
            "eventAction": eventAction,
            "eventLabel": window.flowplayer("player").getClip().url,
            "eventValue": interval
        });
        console.log(eventAction);
        milestonesReached.push(eventAction);
    }
    timesTriggered++;
    
}