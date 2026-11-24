var state = 0;

function setup() {
	IoEClient.setup({
		type: "Siren",
		states: [{ name: "On", type: "bool", controllable: true }],
	});
	IoEClient.onInputReceive = function (input) {
		if (input.length > 0) setState(parseInt(input, 10));
	};
	attachInterrupt(0, function () {
		setState(parseInt(customRead(0), 10));
	});
	setState(0);
}

function setState(value) {
	state = value === 1 ? 1 : 0;
	// D1 керує штатним індикатором сирени в Packet Tracer.
	digitalWrite(1, state ? HIGH : LOW);
	customWrite(0, state);
	IoEClient.reportStates(state);
	setDeviceProperty(getName(), "state", state);
}

function mouseEvent(pressed, x, y, firstPress) {
	if (firstPress) setState(state ? 0 : 1);
}
