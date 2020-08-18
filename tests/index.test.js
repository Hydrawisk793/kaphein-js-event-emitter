const { assert } = require("chai");

const { EventEmitter : NodeEventEmitter } = require("events");
const { EventEmitter } = require("../src");

describe("EventEmitter", function ()
{
    describe("on", function ()
    {
        it("should listen until be removed.", function ()
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
                emitter.emit("log", "foo");
                emitter.emit("log", "bar");

                return logs;
            }

            const nodeLogs = doTest(new NodeEventEmitter());
            const logs = doTest(new EventEmitter());

            assert.deepStrictEqual(logs, nodeLogs);
        });

        it("should preserve the order of listeners", function ()
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
                emitter.emit("log");
                emitter.emit("log");

                return logs;
            }

            const nodeLogs = doTest(new NodeEventEmitter());
            const logs = doTest(new EventEmitter());

            assert.deepStrictEqual(logs, nodeLogs);
        });

        it("should not call rest listeners if a listener throws an error.", function ()
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
    });

    describe("once", function ()
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
    });

    describe("prependListener", function ()
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
    });

    describe("prependOnceListener", function ()
    {
        it("should prepend listeners only once.", function ()
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
                emitter.prependOnceListener("log", logBaz);
                emitter.prependOnceListener("log", logQux);

                emitter.emit("log");
                emitter.emit("log");

                return logs;
            }

            const nodeLogs = doTest(new NodeEventEmitter());
            const logs = doTest(new EventEmitter());

            assert.deepStrictEqual(logs, nodeLogs);
        });
    });

    describe("off", function ()
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
    });

    describe("duplicate listeners", function ()
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

        it("should add duplicate listeners.", function ()
        {
            const nodeLogs = doTest(new NodeEventEmitter());
            const logs = doTest(new EventEmitter());

            assert.isAtLeast(nodeLogs.length, 2);
            assert.deepStrictEqual(logs, nodeLogs);
        });

        describe("option.xPreventDuplicateListeners", function ()
        {
            it("should not add duplicate listeners.", function ()
            {
                const logs = doTest(new EventEmitter({
                    xPreventDuplicateListeners : true,
                }));

                assert.deepStrictEqual(logs, ["foo"]);
            });
        });
    });

    describe("this reference on called listeners", function ()
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

        it("should bind the event emitter.", function ()
        {
            const nodeLogs = doTest(new NodeEventEmitter());
            const logs = doTest(new EventEmitter());

            assert.deepStrictEqual(logs, nodeLogs);
        });

        describe("option.xBindThis", function ()
        {
            it("should bind the global object.", function ()
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

            it("should bind the specified object.", function ()
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
        });
    });

    describe("'newListener' event.", function ()
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

        it("should emit the event.", function ()
        {
            const nodeLogs = doTest(new NodeEventEmitter());
            const logs = doTest(new EventEmitter());

            assert.deepStrictEqual(logs, nodeLogs);
        });

        describe("option.xEmitNewListenerEvent === false", function ()
        {
            it("should not emit the event.", function ()
            {
                const nodeLogs = doTest(new NodeEventEmitter(), false);
                const logs = doTest(new EventEmitter({
                    xEmitNewListenerEvent : false,
                }));

                assert.deepStrictEqual(logs, nodeLogs);
            });
        });
    });

    describe("'removeListener' event.", function ()
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

        it("should emit the event.", function ()
        {
            const nodeLogs = doTest(new NodeEventEmitter());
            const logs = doTest(new EventEmitter());

            assert.deepStrictEqual(logs, nodeLogs);
        });

        describe("option.xEmitRemoveListenerEvent === false", function ()
        {
            it("should not emit the event.", function ()
            {
                const nodeLogs = doTest(new NodeEventEmitter(), false);
                const logs = doTest(new EventEmitter({
                    xEmitRemoveListenerEvent : false,
                }));

                assert.deepStrictEqual(logs, nodeLogs);
            });
        });
    });
});
