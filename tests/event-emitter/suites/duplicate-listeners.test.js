const { assert } = require("chai");

const { EventEmitter : NodeEventEmitter } = require("events");
const { EventEmitter } = require("../../../src");

module.exports = function ()
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
        emitter.on("log", log);
        emitter.once("log", log);
        emitter.once("log", log);
        emitter.prependListener("log", log);
        emitter.prependListener("log", log);
        emitter.prependOnceListener("log", log);
        emitter.prependOnceListener("log", log);

        emitter.emit("log", "foo");

        return logs;
    }

    it("should be allowed.", function ()
    {
        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.isAtLeast(nodeLogs.length, 2);
        assert.deepStrictEqual(logs, nodeLogs);
    });

    it("should not be allowed when `option.xPreventDuplicateListeners === true`.", function ()
    {
        const logs = doTest(new EventEmitter({
            xPreventDuplicateListeners : true,
        }));

        assert.deepStrictEqual(logs, ["foo"]);
    });
};
