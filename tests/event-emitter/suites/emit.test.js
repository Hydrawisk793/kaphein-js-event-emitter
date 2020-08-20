const { assert } = require("chai");

const { EventEmitter : NodeEventEmitter } = require("events");
const { EventEmitter } = require("../../../src");

module.exports = function ()
{
    it("should not call the rest listeners if a listener throws an error.", function ()
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

            emitter.on("log", logFoo);
            emitter.on("log", logBar);
            emitter.on("log", logBaz);

            try
            {
                emitter.emit("log");
            }
            catch(error)
            {
                // Does nothing.
            }

            return logs;
        }

        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.deepStrictEqual(logs, nodeLogs);
    });
};
