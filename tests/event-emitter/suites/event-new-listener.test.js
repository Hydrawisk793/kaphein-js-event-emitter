const { assert } = require("chai");

const { EventEmitter : NodeEventEmitter } = require("events");
const { EventEmitter } = require("../../../src");

module.exports = function ()
{
    /**
     *  @param {NodeEventEmitter | EventEmitter} emitter
     *  @param {boolean} [listenAddListenerEvent]
     */
    function doTest(emitter, listenAddListenerEvent = true)
    {
        const logs = [];
        function log(text)
        {
            logs.push(text);
        }
        log._name = "log";

        /**
         *  @this {NodeEventEmitter | EventEmitter}
         */
        function onNewListener(eventName, listener)
        {
            logs.push({
                name : "onNewListener",
                count : emitter.listenerCount(eventName),
                eventName,
                listenerName : listener._name,
                isListenerLogHandler : log === listener,
            });
        }
        onNewListener._name = "onNewListener";

        if(listenAddListenerEvent)
        {
            emitter.on("newListener", onNewListener);
            emitter.on("newListener", onNewListener);
            emitter.once("newListener", onNewListener);
            emitter.prependListener("newListener", onNewListener);
            emitter.prependOnceListener("newListener", onNewListener);
        }
        emitter.on("log", log);
        emitter.once("log", log);
        emitter.prependListener("log", log);
        emitter.prependOnceListener("log", log);

        emitter.emit("log", "foo");
        emitter.emit("log", "bar");
        emitter.emit("log", "baz");

        if(listenAddListenerEvent)
        {
            emitter.off("newListener", onNewListener);
            emitter.off("newListener", onNewListener);
            emitter.off("newListener", onNewListener);
        }

        emitter.on("log", log);

        emitter.emit("log", "qux");

        return logs;
    }

    it("should be emitted.", function ()
    {
        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter());

        assert.deepStrictEqual(logs, nodeLogs);
    });

    it("should not be emitted when `option.xEmitNewListenerEvent === false`.", function ()
    {
        const nodeLogs = doTest(new NodeEventEmitter(), false);
        const logs = doTest(new EventEmitter({
            xEmitNewListenerEvent : false,
        }));

        assert.deepStrictEqual(logs, nodeLogs);
    });
};
