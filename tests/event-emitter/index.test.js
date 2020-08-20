const on = require("./suites/on.test");
const once = require("./suites/once.test");
const off = require("./suites/off.test");
const prependListener = require("./suites/prepend-listener.test");
const prependOnceListener = require("./suites/prepend-once-listener.test");
const emit = require("./suites/emit.test");
const eventNewListener = require("./suites/event-new-listener.test");
const eventRemoveListener = require("./suites/event-remove-listener.test");
const thisReference = require("./suites/this-reference.test");
const duplicateListeners = require("./suites/duplicate-listeners.test");
const maxListeners = require("./suites/max-listeners.test");

module.exports = function ()
{
    describe("on", on.bind(this));
    describe("once", once.bind(this));
    describe("off", off.bind(this));
    describe("prependListener", prependListener.bind(this));
    describe("prependOnceListener", prependOnceListener.bind(this));
    describe("emit", emit.bind(this));
    describe("event 'newListener'", eventNewListener.bind(this));
    describe("event 'removeListener'", eventRemoveListener.bind(this));
    describe("'this' reference", thisReference.bind(this));
    describe("max listeners", maxListeners.bind(this));
    describe("duplicate listeners", duplicateListeners.bind(this));
};
