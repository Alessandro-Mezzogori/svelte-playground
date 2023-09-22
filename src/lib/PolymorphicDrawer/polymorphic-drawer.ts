import type { SvelteComponent } from "svelte";
import { writable } from "svelte/store";

type SvelteComponentProps<T extends SvelteComponent<any, any, any>> = T extends SvelteComponent<infer P, any, any> ? P : never;
type SvelteComponentEvents<T extends SvelteComponent<any, any, any>> = T extends SvelteComponent<any, infer E, any> ? E : never;
type SvelteComponentSlots<T extends SvelteComponent<any, any, any>> = T extends SvelteComponent<any, any, infer S> ? S : never;

type RequiredFields<T extends object> = Exclude<{
    [K in keyof T]: Extract<T[K], undefined> extends never ? K : never
}[keyof T], undefined>

type PseudoRequired<T extends object, Opt extends keyof T> = Omit<T, Opt> & Required<Pick<T, Opt>>;

export type PolymorphicDrawerComponent<T extends SvelteComponent<any, any, any>> = PseudoRequired<{
    key: string;
    component: typeof SvelteComponent<
        SvelteComponentProps<T>,
        SvelteComponentEvents<T>,
        SvelteComponentSlots<T>
    >;
    props?: SvelteComponentProps<T>;
}, RequiredFields<SvelteComponentProps<T>> extends keyof SvelteComponentProps<T> ? 'props' : never>

export function drawerComponent<T extends SvelteComponent<any, any, any>>(v: PolymorphicDrawerComponent<T>) {
    return v;
}

export type PolymorphicDrawerStore = {
    components: PolymorphicDrawerComponent<any>[];
    active?: PolymorphicDrawerComponent<any>;
    open: boolean;
}

function createDrawerStore(){
    const { subscribe, set, update } = writable<PolymorphicDrawerStore>({
        components: [],
        active: undefined,
        open: false
    });
    
    function add(component: PolymorphicDrawerComponent<any>){
        update((store) => {
            store.components.push(component);
            return store;
        });
    }
    
    function remove(key: string){
        update((store) => {
            store.components = store.components.filter((c) => c.key !== key);
            return store;
        });
    }
    
    function active(key: string, open: boolean = true){
        update((store) => {
            store.active = store.components.find((c) => c.key === key);
            store.open = open;
            return store;
        });
    }

    function setStore(components: PolymorphicDrawerComponent<any>[]){
        set({
            components,
            active: undefined,
            open: false
        });
    }
    
    function openFunc(){
        update((store) => {
            store.open = true;
            return store;
        });
    }
    
    function close(){
        console.log("close");
        update((store) => {
            store.open = false;
            return store;
        });
    }
    
    return {
        subscribe,
        set: setStore,
        add,
        remove,
        active,
        open,
        close
    };
}

export const drawerStore = createDrawerStore();