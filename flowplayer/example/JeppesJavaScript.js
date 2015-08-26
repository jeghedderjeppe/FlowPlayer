


var timePlayed;

function onBeforeUnload () {
	console.log('just before unloading page');
};

function onFinishEventListener (clip) {
	if (!timePlayed) {
		timePlayed = clip.getTime();
	}
	else {
		timePlayed += clip.getTime();
	}
};

function startEventListener (clip) {
	console.log("inside start listener");
};