const { assert } = require("chai");

const { EventEmitter : NodeEventEmitter } = require("events");
const { EventEmitter } = require("../../../src");

module.exports = function ()
{
    it("should listen only once.", function ()
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

            emitter.once("log", log);
            emitter.emit("log", "foo");
            emitter.emit("log", "bar");

            return logs;
        }

        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.deepStrictEqual(logs, nodeLogs);
    });

    it("should remove called listeners even if an error is thrown.", function ()
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
                throw new Error("An error occurred.");
            }
            function logBaz()
            {
                logs.push("baz");
            }

            emitter.once("log", logFoo);
            emitter.once("log", logBar);
            emitter.once("log", logBaz);

            try
            {
                // logBar will throw an error.
                emitter.emit("log");
            }
            catch(error)
            {
                // Does nothing.
            }

            // SHOULD NOT throw errors.
            emitter.emit("log");

            return logs;
        }

        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.deepStrictEqual(logs, nodeLogs);
    });
};
