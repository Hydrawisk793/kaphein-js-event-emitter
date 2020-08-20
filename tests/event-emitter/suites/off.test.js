const { assert } = require("chai");

const { EventEmitter : NodeEventEmitter } = require("events");
const { EventEmitter } = require("../../../src");

module.exports = function ()
{
    it("should remove corresponding listener only.", function ()
    {
        /**
         *  @param {NodeEventEmitter | EventEmitter} emitter
         */
        function doTest(emitter)
        {
            const logs = [];
            function log(text)
            {
                logs.push(text);
            }

            emitter.on("log", log);
            emitter.off("log", () =>
            {
                // Does nothing.
            });
            emitter.emit("log", "foo");

            emitter.off("log", log);
            emitter.emit("log", "bar");

            return logs;
        }

        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.deepStrictEqual(logs, nodeLogs);
    });

    it("should remove the most recently added one only.", function ()
    {
        /**
         *  @param {NodeEventEmitter | EventEmitter} emitter
         */
        function doTest(emitter)
        {
            const logs = [];
            function logFoo()
            {
                logs.push("foo");
            }
            function logBar()
            {
                logs.push("bar");
            }

            emitter.on("log", logFoo);
            emitter.on("log", logBar);
            emitter.on("log", logFoo);
            emitter.on("log", logFoo);
            emitter.off("log", logFoo);

            emitter.emit("log");
            emitter.emit("log");

            return logs;
        }

        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.deepStrictEqual(logs, nodeLogs);
    });

    it("should remove the most recently added once listener.", function ()
    {
        /**
         *  @param {NodeEventEmitter | EventEmitter} emitter
         */
        function doTest(emitter)
        {
            const logs = [];
            function log(text)
            {
                logs.push(text);
            }

            emitter.on("log", log);
            emitter.prependOnceListener("log", log);
            emitter.once("log", log);
            emitter.off("log", log);

            emitter.emit("log", "foo");
            emitter.emit("log", "bar");

            return logs;
        }

        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.deepStrictEqual(logs, nodeLogs);
    });
};
