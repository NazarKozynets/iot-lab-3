const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = process.argv[2];
let now = 0;
let sensor = 0;
let alarm = 0;
const common = {
	HIGH: 1,
	LOW: 0,
	delay() {},
	getName() {
		return "test";
	},
	setDeviceProperty() {},
};
const siren = {
	...common,
	digitalWrite(pin, value) {
		alarm = value;
	},
	customWrite() {},
	customRead() {
		return "0";
	},
	attachInterrupt() {},
	IoEClient: { setup() {}, reportStates() {} },
};
vm.createContext(siren);
vm.runInContext(fs.readFileSync(path.join(root, "siren/main.js"), "utf8"), siren);
siren.setup();
const detector = {
	...common,
	uptime() {
		return now;
	},
	digitalWrite(pin, value) {
		sensor = value;
	},
	IoEClient: {
		setup() {},
		reportStates(value) {
			siren.IoEClient.onInputReceive(String(value));
		},
	},
};
vm.createContext(detector);
vm.runInContext(fs.readFileSync(path.join(root, "motion-detector/main.js"), "utf8"), detector);
detector.setup();
assert.equal(sensor, 0);
assert.equal(alarm, 0);
detector.mouseEvent(true, 0, 0, true);
assert.equal(sensor, 1);
assert.equal(alarm, 1);
now = 9.9;
detector.loop();
assert.equal(alarm, 1);
now = 10;
detector.loop();
assert.equal(alarm, 0);
now = 20;
detector.mouseEvent(true, 0, 0, true);
now = 28;
detector.mouseEvent(true, 1, 1, false);
now = 30;
detector.loop();
assert.equal(alarm, 1);
now = 37.9;
detector.loop();
assert.equal(alarm, 1);
now = 38;
detector.loop();
assert.equal(alarm, 0);
now = 40;
detector.mouseEvent(true, 0, 0, true);
detector.cleanUp();
assert.equal(alarm, 0);
siren.IoEClient.onInputReceive("1");
assert.equal(alarm, 1);
siren.IoEClient.onInputReceive("invalid");
assert.equal(alarm, 0);
console.log("PASS: idle, activation, 10-second expiry, repeated motion, cleanup, invalid input.");
console.log("The server-rule transport is stubbed; this is not a Packet Tracer integration test.");
