const { assert } = require("chai");

const { EventEmitter : NodeEventEmitter } = require("events");
const { EventEmitter } = require("../../../src");

module.exports = function ()
{
    /**
     *  @param {NodeEventEmitter | EventEmitter} emitter
     *  @param {boolean} [listenRemoveListenerEvent]
     */
    function doTest(emitter, listenRemoveListenerEvent = true)
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
        function onNewListener(eventName, l)
        {
            logs.push({
                name : "onNewListener",
                count : emitter.listenerCount(eventName),
                eventName,
                listenerName : l._name,
                isListenerLogHandler : log === l,
            });
        }
        onNewListener._name = "onNewListener";

        /**
         *  @this {NodeEventEmitter | EventEmitter}
         */
        function onRemoveListener(eventName, l)
        {
            const foo = {
                name : "onRemoveListener",
                count : emitter.listenerCount(eventName),
                eventName,
                listenerName : l._name,
                isListenerLogHandler : log === l,
                isWrapper : "function" === typeof l.listener,
            };
            logs.push(foo);
        }
        onRemoveListener._name = "onRemoveListener";

        if(listenRemoveListenerEvent)
        {
            emitter.on("removeListener", onRemoveListener);
        }

        emitter.on("newListener", onNewListener);
        emitter.on("newListener", onNewListener);
        emitter.once("newListener", onNewListener);
        emitter.prependListener("newListener", onNewListener);
        emitter.prependOnceListener("newListener", onNewListener);
        emitter.on("log", log);
        emitter.once("log", log);
        emitter.prependListener("log", log);
        emitter.prependOnceListener("log", log);

        emitter.emit("log", "foo");
        emitter.emit("log", "bar");
        emitter.emit("log", "baz");

        emitter.off("newListener", onNewListener);
        emitter.off("log", log);
        emitter.off("newListener", onNewListener);
        if(listenRemoveListenerEvent)
        {
            emitter.off("removeListener", onRemoveListener);
        }
        emitter.off("log", log);

        return logs;
    }

    it("should be emitted.", function ()
    {
        const nodeLogs = doTest(new NodeEventEmitter());
        const logs = doTest(new EventEmitter({
            // Since Node.js v12
            xPassRawListenerOnRemoveListenerEvent : true,
        }));

        assert.deepStrictEqual(logs, nodeLogs);
    });

    it("should not be emitted when `option.xEmitRemoveListenerEvent === false`.", function ()
    {
        const nodeLogs = doTest(new NodeEventEmitter(), false);
        const logs = doTest(new EventEmitter({
            xEmitRemoveListenerEvent : false,
        }));

        assert.deepStrictEqual(logs, nodeLogs);
    });
};
