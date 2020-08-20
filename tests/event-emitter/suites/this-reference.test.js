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
        function log()
        {
            logs.push(this === global);
        }

        emitter.on("log", log);
        emitter.once("log", log);
        emitter.prependListener("log", log);
        emitter.prependOnceListener("log", log);

        emitter.emit("log");
        emitter.emit("log");

        const thisRef = this;
        emitter.off("log", log);
        emitter.off("log", log);
        emitter.on("log", () =>
        {
            logs.push(this === thisRef);
        });

        emitter.emit("log");

        return logs;
    }

    it("should be the event emitter.", function ()
    {
        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.deepStrictEqual(logs, nodeLogs);
    });

    it("should be the global object when `option.xBindThis === false`.", function ()
    {
        const logs1 = doTest(new EventEmitter({
            xBindThis : false,
        }));
        const logs2 = doTest(new EventEmitter({
            xBindThis : {
                enabled : true,
                value : null,
            },
        }));
        const logs3 = doTest(new EventEmitter({
            xBindThis : {
                enabled : true,
                value : void 0,
            },
        }));

        const expected = new Array(7).fill(true);
        assert.deepStrictEqual(logs1, expected);
        assert.deepStrictEqual(logs2, expected);
        assert.deepStrictEqual(logs3, expected);
    });

    it("should be the specified object when `option.xBindThis` is configured.", function ()
    {
        const thisArg = {
            foo : 3,
            bar : "bar",
        };

        /**
         *  @param {NodeEventEmitter | EventEmitter} emitter
         */
        function doTest(emitter)
        {
            const logs = [];
            function log()
            {
                logs.push(this === thisArg);
            }

            emitter.once("log", log);

            emitter.emit("log");

            return logs;
        }

        const logs = doTest(new EventEmitter({
            xBindThis : {
                enabled : true,
                value : thisArg,
            },
        }));

        assert.deepStrictEqual(logs, [true]);
    });
};
