import { drawerComponent, drawerStore } from "../polymorphic-drawer";
import Pd1 from "./PD1.svelte";
import Pd2 from "./PD2.svelte";
import Pd3 from "./PD3.svelte";

export function setup() {
    drawerStore.set([
        drawerComponent<Pd1>({
            key: 'pd1',
            component: Pd1,
            props: {
                buttonText: 1
            }
        }),
        drawerComponent<Pd2>({
            key: 'pd2',
            component: Pd2,
            props: {
                test: 1
            }
        }),
        drawerComponent<Pd3>({
            key: 'pd3',
            component: Pd3,
            props: {
                buttonText: "ciao"
            }
        }),
    ]);
    
    drawerStore.active('pd1');
}