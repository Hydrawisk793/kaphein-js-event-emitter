const { assert } = require("chai");

const { EventEmitter : NodeEventEmitter } = require("events");
const { EventEmitter } = require("../../../src");

module.exports = function ()
{
    it("should prepend listeners.", function ()
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
            function logBaz()
            {
                logs.push("baz");
            }
            function logQux()
            {
                logs.push("qux");
            }

            emitter.on("log", logFoo);
            emitter.on("log", logBar);
            emitter.prependListener("log", logBaz);
            emitter.prependListener("log", logQux);

            emitter.emit("log");

            return logs;
        }

        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.deepStrictEqual(logs, nodeLogs);
    });
};
