var TIMEOUT_SECONDS = 10;
var state = 0;
var lastMotion = null;

function setup() {
	IoEClient.setup({
		type: "Motion Detector",
		states: [{ name: "On", type: "bool", controllable: false }],
	});
	lastMotion = null;
	setState(0);
}

function mouseEvent(pressed, x, y, firstPress) {
	// Кожна подія руху продовжує тривогу ще на десять секунд.
	lastMotion = uptime();
	if (state === 0) setState(1);
}

function loop() {
	if (state === 1 && uptime() - lastMotion >= TIMEOUT_SECONDS) setState(0);
	delay(100);
}

function setState(value) {
	state = value;
	digitalWrite(1, state ? HIGH : LOW);
	IoEClient.reportStates(state);
	setDeviceProperty(getName(), "state", state);
}

function cleanUp() {
	lastMotion = null;
	setState(0);
}
