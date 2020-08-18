declare type EventName = string | symbol;

export declare interface EventListenable<
    ListenerMap extends Record<EventName, (...args : any[]) => any> = Record<EventName, (...args : any[]) => any>
>
{
    addListener<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    removeListener<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    on<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    once<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    off<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;
}

export declare interface EventListenerPrependable<
    ListenerMap extends Record<EventName, (...args : any[]) => any> = Record<EventName, (...args : any[]) => any>
>
    extends EventListenable<ListenerMap>
{
    prependListener<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    prependOnceListener<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;
}

export declare class EventEmitter<
    ListenerMap extends Record<EventName, (...args : any[]) => any> = Record<EventName, (...args : any[]) => any>
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

    public listenerCount<K extends keyof ListenerMap>(
        eventName : K
    ) : number;

    public listeners<K extends keyof ListenerMap>(
        eventName : K
    ) : (ListenerMap[K])[];

    public rawListeners<K extends keyof ListenerMap>(
        eventName : K
    ) : (ListenerWrapper<ListenerMap[K]>)[];

    public prependListener<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    public prependOnceListener<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    public addListener<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    public removeListener<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    public removeAllListeners<K extends keyof ListenerMap>(
        eventName? : K
    ) : this;

    public on<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    public once<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    public off<K extends keyof ListenerMap>(
        eventName : K,
        listener : ListenerMap[K]
    ) : this;

    public emit<K extends keyof ListenerMap>(
        eventName : K,
        ...args : Parameters<ListenerMap[K]>
    ) : boolean;

    public emitAndGetResults<K extends keyof ListenerMap>(
        eventName : K,
        ...args : Parameters<ListenerMap[K]>
    ) : (ReturnType<ListenerMap[K]>)[];
}

export declare interface ListenerWrapper<
    Listener extends (...args : any[]) => any = (...args : any[]) => any
>
{
    (...args : Parameters<Listener>) : ReturnType<Listener>;

    listener : Listener;
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
