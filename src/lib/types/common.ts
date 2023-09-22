    
export type CssClasses = string;
export type SvelteEvent<E extends Event = Event, T extends EventTarget = Element> = E & { currentTarget: EventTarget & T };
    