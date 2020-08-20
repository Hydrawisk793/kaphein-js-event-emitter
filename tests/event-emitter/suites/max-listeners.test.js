const { assert } = require("chai");

const { EventEmitter : NodeEventEmitter } = require("events");
const { EventEmitter } = require("../../../src");

module.exports = function ()
{
    it("should be same as the default maximum count.", function ()
    {
        /**
         *  @param {NodeEventEmitter | EventEmitter} emitter
         */
        function doTest(emitter)
        {
            const logs = [];

            logs.push(emitter.getMaxListeners());

            return logs;
        }

        const actualLogs = doTest(new EventEmitter());
        const expectedLogs = doTest(new NodeEventEmitter());

        assert.deepStrictEqual(actualLogs, expectedLogs);
    });

    it("should be able to be changed.", function ()
    {
        const maxCount = 32;

        /**
         *  @param {NodeEventEmitter | EventEmitter} emitter
         */
        function doTest(emitter)
        {
            const logs = [];

            emitter.setMaxListeners(maxCount);
            logs.push(emitter.getMaxListeners() == maxCount);

            return logs;
        }

        const actualLogs = doTest(new EventEmitter());
        const expectedLogs = doTest(new NodeEventEmitter());

        assert.deepStrictEqual(actualLogs, expectedLogs);
    });

    it("should not be coerced to zero when the value is infinity.", function ()
    {
        const emitter = new EventEmitter();
        emitter.setMaxListeners(Infinity);

        assert.isNotTrue(Number.isFinite(emitter.getMaxListeners()));
    });

    it("should not be coerced to infinity when the value is zero.", function ()
    {
        const emitter = new EventEmitter();
        emitter.setMaxListeners(0);

        assert.equal(emitter.getMaxListeners(), 0);
    });

    it("should be affected by 'defaultMaxListeners' static property until it is manually specified.", function ()
    {
        /**
         *  @param {typeof EventEmitter | typeof NodeEventEmitter} klass
         */
        function doTest(klass)
        {
            const originalMaxCount = klass.defaultMaxListeners;

            klass.defaultMaxListeners = 1;
            const first = new klass();
            assert.equal(first.getMaxListeners(), 1);

            klass.defaultMaxListeners = 2;
            const second = new klass();
            assert.equal(second.getMaxListeners(), 2);
            assert.equal(first.getMaxListeners(), 2);
            second.setMaxListeners(5);
            assert.equal(first.getMaxListeners(), 2);

            const oldDefaultMaxCount = klass.defaultMaxListeners;
            second.setMaxListeners(oldDefaultMaxCount);
            klass.defaultMaxListeners = 8;
            assert.equal(first.getMaxListeners(), 8);
            assert.equal(second.getMaxListeners(), oldDefaultMaxCount);

            klass.defaultMaxListeners = originalMaxCount;
        }

        doTest(EventEmitter);
    });

    it("should be able to add listeners infinitely when the maximum count is zero or infinity.", function ()
    {
        this.timeout(0);

        const iteration = 1000;

        assert.deepStrictEqual(
            doTestWithCountParams(new EventEmitter(), 0, iteration),
            doTestWithCountParams(new NodeEventEmitter(), 0, iteration)
        );
        assert.deepStrictEqual(
            doTestWithCountParams(new EventEmitter(), Infinity, iteration),
            doTestWithCountParams(new NodeEventEmitter(), Infinity, iteration)
        );
        assert.deepStrictEqual(
            doTestWithCountParams(new EventEmitter(), 0, iteration),
            doTestWithCountParams(new NodeEventEmitter(), Infinity, iteration)
        );
        assert.deepStrictEqual(
            doTestWithCountParams(new EventEmitter(), Infinity, iteration),
            doTestWithCountParams(new NodeEventEmitter(), 0, iteration)
        );
    });

    it("should be able to add listeners regardless of the maximum count.", function ()
    {
        const actualLogs = doTestWithCountParams(new EventEmitter(), 1, 3);
        const expectedLogs = doTestWithCountParams(new NodeEventEmitter(), 1, 3);

        assert.deepStrictEqual(actualLogs, expectedLogs);
    });

    it("should be not allow exceeded listeners when `option.xStrictMaxListenerCount === true`.", function ()
    {
        const unexpected = {};

        function foo()
        {
            // Does nothing.
        }

        const emitter = new EventEmitter({
            xStrictMaxListenerCount : true,
        });
        emitter.setMaxListeners(2);

        try
        {
            emitter.on("foo", foo);
            emitter.on("foo", foo);

            // An exception should be thrown on here.
            emitter.on("foo", foo);

            throw unexpected;
        }
        catch(error)
        {
            if(unexpected === error)
            {
                throw error;
            }
            else
            {
                assert.equal(emitter.listenerCount("foo"), emitter.getMaxListeners());
            }
        }
    });

    /**
     *  @param {NodeEventEmitter | EventEmitter} emitter
     *  @param {number} maxCount
     *  @param {number} listenerCount
     */
    function doTestWithCountParams(emitter, maxCount, listenerCount)
    {
        const logs = [];

        function foo()
        {
            logs.push("foo");
        }
        function bar()
        {
            logs.push("bar");
        }

        emitter.setMaxListeners(maxCount);

        for(let i = 0; i < listenerCount; ++i)
        {
            emitter.on("foo", foo);
        }
        logs.push(emitter.listenerCount("foo") === listenerCount);
        emitter.emit("foo");

        for(let i = 0; i < listenerCount; ++i)
        {
            emitter.on("bar", bar);
        }
        logs.push(emitter.listenerCount("bar") === listenerCount);
        emitter.emit("bar");

        return logs;
    }
};
