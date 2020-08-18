declare type EventName = string | symbol;

export declare interface EventListenable<
    ListenerMap extends Record<EventName, (...args : any) => any> = Record<EventName, (...args : any) => any>
>
{
    addListener(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    removeListener(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    on(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    once(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    off(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;
}

export declare interface EventListenerPrependable<
    ListenerMap extends Record<EventName, (...args : any) => any> = Record<EventName, (...args : any) => any>
>
    extends EventListenable<ListenerMap>
{
    prependListener(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    prependOnceListener(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;
}

export declare class EventEmitter<
    ListenerMap extends Record<EventName, (...args : any) => any> = Record<EventName, (...args : any) => any>
>
    implements EventListenerPrependable<ListenerMap>
{
    public static defaultMaxListeners : number;

    public constructor(
        option? : EventEmitterOption
    );

    public getOption() : EventEmitterOption;

    public getMaxListeners() : number;

    public setMaxListeners(
        count : number
    ) : this;

    public eventNames() : (keyof ListenerMap)[];

    public listenerCount(
        eventName : (keyof ListenerMap)
    ) : number;

    public listeners(
        eventName : (keyof ListenerMap)
    ) : ((...args : any) => any)[];

    public rawListeners(
        eventName : (keyof ListenerMap)
    ) : ((...args : any) => any)[];

    public prependListener(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    public prependOnceListener(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    public addListener(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    public removeListener(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    public removeAllListeners(
        eventName? : (keyof ListenerMap)
    ) : this;

    public on(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    public once(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    public off(
        eventName : (keyof ListenerMap),
        listener : ListenerMap[(keyof ListenerMap)]
    ) : this;

    public emit(
        eventName : (keyof ListenerMap),
        ...args : Parameters<ListenerMap[(keyof ListenerMap)]>
    ) : boolean;

    public emitAndGetResults(
        eventName : (keyof ListenerMap),
        ...args : Parameters<ListenerMap[(keyof ListenerMap)]>
    ) : ReturnType<ListenerMap[(keyof ListenerMap)]>[];
}

export declare interface EventEmitterOption
{
    captureRejections : boolean;

    xEmitNewListenerEvent : boolean;

    xEmitRemoveListenerEvent : boolean;

    xPreventDuplicateListeners : boolean;

    xBindThis : boolean | {
        enabled : boolean;

        value : any;
    };

    xRemoveFirstFoundOne : boolean;

    xWarnIfMaxListenerCountExceeds : boolean;

    xStrictMaxListenerCount : boolean;
}
