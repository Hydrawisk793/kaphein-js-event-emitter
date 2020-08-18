module.exports = (function ()
{
    /* global console */

    /**
     *  @typedef {import("./event-emitter").EventEmitterOption} EventEmitterOption
     */

    var _slice = Array.prototype.slice;

    var _defaultMaxListeners = 10;

    /**
     *  @constructor
     *  @param {EventEmitterOption} [option]
     */
    function EventEmitter()
    {
        /** @type {Record<string | symbol, Function[]>} */this._map = {};
        this._maxListeners = null;
        /** @type {EventEmitterOption} */this._option = Object.assign(
            {
                captureRejections : false,
                xBindThis : true,
                xEmitNewListenerEvent : true,
                xEmitRemoveListenerEvent : true,
                xPreventDuplicateListeners : false,
                xStrictMaxListenerCount : false,
                xWarnIfMaxListenerCountExceeds : true
            },
            arguments[0]
        );
    }

    EventEmitter.prototype = {
        constructor : EventEmitter,

        getOption : function getOption()
        {
            return Object.assign({}, this._option);
        },

        getMaxListeners : function getMaxListeners()
        {
            var count = this._maxListeners;
            if("number" !== typeof count || (Number.isFinite(count) && !Number.isSafeInteger(count)))
            {
                count = EventEmitter.defaultMaxListeners;

                if("number" !== typeof count || (Number.isFinite(count) && !Number.isSafeInteger(count)))
                {
                    count = _defaultMaxListeners;
                }
            }

            return count;
        },

        setMaxListeners : function setMaxListeners(count)
        {
            if(Number.isSafeInteger(count))
            {
                this._maxListeners = count;
            }
            else if(!Number.isFinite(count))
            {
                this._maxListeners = Infinity;
            }
            else
            {
                throw new RangeError("'count' must be a safe integer or infinite value.");
            }
        },

        eventNames : function eventNames()
        {
            var names = Object.keys(this._map);

            return (
                Object.getOwnPropertySymbols
                    ? names.concat(Object.getOwnPropertySymbols(this._map))
                    : names
            );
        },

        listenerCount : function listenerCount(eventName)
        {
            _assertIsEventNameValid(eventName);

            return (eventName in this._map ? this._map[eventName].length : 0);
        },

        listeners : function listeners(eventName)
        {
            _assertIsEventNameValid(eventName);

            return _getListeners(this, eventName)
                .map(function (listener)
                {
                    return (
                        "listener" in listener
                            ? listener.listener
                            : listener
                    );
                })
            ;
        },

        rawListeners : function rawListeners(eventName)
        {
            _assertIsEventNameValid(eventName);

            return _getListeners(this, eventName).slice();
        },

        prependListener : function prependListener(eventName, listener)
        {
            _assertIsListener(listener);
            var listeners = _ensureCanAddListener(this, eventName);

            if(_hasNoDuplicates(this, listeners, listener))
            {
                if(this._option.xEmitNewListenerEvent)
                {
                    this.emit("newListener", eventName, listener);
                }

                listeners.unshift(listener);
            }

            return this;
        },

        prependOnceListener : function prependOnceListener(eventName, listener)
        {
            _assertIsListener(listener);
            var listeners = _ensureCanAddListener(this, eventName);

            if(_hasNoDuplicates(this, listeners, listener))
            {
                if(this._option.xEmitNewListenerEvent)
                {
                    this.emit("newListener", eventName, listener);
                }

                listeners.unshift(_createOnceWrapper(this, eventName, listener));
            }

            return this;
        },

        addListener : function addListener(eventName, listener)
        {
            return this.on(eventName, listener);
        },

        removeListener : function removeListener(eventName, listener)
        {
            return this.off(eventName, listener);
        },

        removeAllListeners : function removeAllListeners()
        {
            var eventName = arguments[0];

            if("undefined" === typeof eventName)
            {
                this._map = {};
            }
            else
            {
                _assertIsEventNameValid(eventName);

                if(eventName in this._map)
                {
                    delete this._map[eventName];
                }
            }

            return this;
        },

        on : function on(eventName, listener)
        {
            _assertIsListener(listener);
            var listeners = _ensureCanAddListener(this, eventName);

            if(_hasNoDuplicates(this, listeners, listener))
            {
                if(this._option.xEmitNewListenerEvent)
                {
                    this.emit("newListener", eventName, listener);
                }

                listeners.push(listener);
            }

            return this;
        },

        once : function once(eventName, listener)
        {
            _assertIsListener(listener);
            var listeners = _ensureCanAddListener(this, eventName);

            if(_hasNoDuplicates(this, listeners, listener))
            {
                if(this._option.xEmitNewListenerEvent)
                {
                    this.emit("newListener", eventName, listener);
                }

                listeners.push(_createOnceWrapper(this, eventName, listener));
            }

            return this;
        },

        off : function off(eventName, listener)
        {
            _removeListener(this, eventName, listener);

            return this;
        },

        emit : function emit(eventName)
        {
            return _emit(this, eventName, _slice.call(arguments, 1)) > 0;
        },

        emitAndGetResults : function emitAndGetResults(eventName)
        {
            return _emit(this, eventName, _slice.call(arguments, 1));
        }
    };

    EventEmitter.defaultMaxListeners = _defaultMaxListeners;

    /**
     *  @param {EventEmitter} thisRef
     *  @param {string | symbol} eventName
     *  @param {boolean} [addIfNotExist]
     */
    function _getListeners(thisRef, eventName)
    {
        _assertIsEventNameValid(eventName);

        var addIfNotExist = arguments[2];

        var listeners = thisRef._map[eventName];
        if(!Array.isArray(listeners))
        {
            listeners = [];

            if(addIfNotExist)
            {
                thisRef._map[eventName] = listeners;
            }
        }

        return listeners;
    }

    /**
     *  @param {Function[]} listeners
     *  @param {Function} listener
     *  @param {boolean} [findExactOnly]
     */
    function _findIndex(listeners, listener)
    {
        var findExactOnly = !!arguments[2];
        var isFinding = true;
        var index = 0;
        while(isFinding && index < listeners.length)
        {
            var other = listeners[index];
            if(
                other === listener
                || (!findExactOnly && "listener" in other && other.listener === listener)
            )
            {
                isFinding = false;
            }
            else
            {
                ++index;
            }
        }
        if(isFinding)
        {
            index = -1;
        }

        return index;
    }

    /**
     *  @param {Function[]} listeners
     *  @param {Function} listener
     *  @param {boolean} [findExactOnly]
     */
    function _findLastIndex(listeners, listener)
    {
        var findExactOnly = !!arguments[2];
        var isFinding = true;
        var index = listeners.length - 1;
        while(isFinding && index >= 0)
        {
            var other = listeners[index];
            if(
                other === listener
                || (!findExactOnly && "listener" in other && other.listener === listener)
            )
            {
                isFinding = false;
            }
            else
            {
                --index;
            }
        }
        if(isFinding)
        {
            index = -1;
        }

        return index;
    }

    /**
     *  @param {EventEmitter} thisRef
     *  @param {string | symbol} eventName
     *  @param {Function} listener
     *  @param {boolean} [findExactOnly]
     */
    function _removeListener(thisRef, eventName, listener)
    {
        var findExactOnly = arguments[3];

        _assertIsListener(listener);

        var listeners = _getListeners(thisRef, eventName);
        var index = _findLastIndex(listeners, listener, findExactOnly);
        if(index >= 0)
        {
            var removed = (listeners.splice(index, 1))[0];

            if(listeners.length < 1)
            {
                delete thisRef._map[eventName];
            }

            if(thisRef._option.xEmitRemoveListenerEvent)
            {
                thisRef.emit(
                    "removeListener",
                    eventName,
                    (
                        "function" === typeof removed.listener
                            ? removed.listener
                            : removed
                    )
                );
            }
        }
    }

    /**
     *  @param {EventEmitter} thisRef
     *  @param {string | symbol} eventName
     *  @param {Function} listener
     */
    function _createOnceWrapper(thisRef, eventName, listener)
    {
        var wrapper = function ()
        {
            _removeListener(thisRef, eventName, wrapper, true);
            listener.apply(this, arguments);
        };
        wrapper.listener = listener;

        return wrapper;
    }

    /**
     *  @param {EventEmitter} thisRef
     *  @param {Function[]} listeners
     *  @param {Function} listener
     */
    function _hasNoDuplicates(thisRef, listeners, listener)
    {
        return !thisRef._option.xPreventDuplicateListeners
            || _findIndex(listeners, listener) < 0
        ;
    }

    /**
     *  @param {EventEmitter} thisRef
     *  @param {string | symbol} eventName
     *  @param {any[]} args
     */
    function _emit(thisRef, eventName, args)
    {
        var listeners = thisRef.rawListeners(eventName);

        var thisArg = void 0;
        var bindThisOpt = thisRef._option.xBindThis;
        if(bindThisOpt)
        {
            thisArg = thisRef;

            if("object" === typeof bindThisOpt)
            {
                thisArg = (bindThisOpt.enabled ? bindThisOpt.value : void 0);
            }
        }

        var results = [];
        for(var i = 0; i < listeners.length; ++i)
        {
            results.push(listeners[i].apply(thisArg, args));
        }

        return results;
    }

    /**
     *  @param {Function} listener
     */
    function _assertIsListener(listener)
    {
        if(!(
            "function" === typeof listener
            || (
                "call" in listener && "function" === typeof listener.call
                && "apply" in listener && "function" === typeof listener.apply
            )
        ))
        {
            throw new TypeError("'listener' must be a function.");
        }
    }

    /**
     *  @param {EventEmitter} thisRef
     *  @param {string | symbol} eventName
     */
    function _ensureCanAddListener(thisRef, eventName)
    {
        var option = thisRef._option;
        var shouldStrict = option.xStrictMaxListenerCount;
        var warnIfExceeds = option.xWarnIfMaxListenerCountExceeds;

        var listeners = _getListeners(thisRef, eventName, true);
        var count = listeners.length;
        var maxCount = thisRef.getMaxListeners();
        if(!_isCountInfinite(count) && count >= maxCount)
        {
            if(shouldStrict)
            {
                throw new Error("The maximum number of listeners per event is " + maxCount + ".");
            }
            else if(warnIfExceeds)
            {
                (
                    ("undefined" !== typeof console && "function" === typeof console.warn)
                        ? console.warn("The maximum number of listeners per event is " + maxCount + ".")
                        : void 0
                );
            }
        }

        return listeners;
    }

    function _isCountInfinite(count)
    {
        return 0 === count || !Number.isFinite(count);
    }

    /**
     *  @param {string | symbol} eventName
     */
    function _assertIsEventNameValid(eventName)
    {
        switch(typeof eventName)
        {
        case "string":
        case "symbol":
            // Does nothing.
            break;
        default:
            throw new TypeError("'eventName' must be a string or a symbol.");
        }
    }

    return {
        EventEmitter : EventEmitter
    };
})();
