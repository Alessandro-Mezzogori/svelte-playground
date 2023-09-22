<script lang="ts">
	import PolymorphicDrawer from "$lib/PolymorphicDrawer/PolymorphicDrawer.svelte";
	import { setup } from "$lib/PolymorphicDrawer/test/test";
	import { drawerComponent, drawerStore } from "$lib/PolymorphicDrawer/polymorphic-drawer";
	import Pd1 from "$lib/PolymorphicDrawer/test/PD1.svelte";
	import Pd2 from "$lib/PolymorphicDrawer/test/PD2.svelte";
	import Pd3 from "$lib/PolymorphicDrawer/test/PD3.svelte";

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
</script>

<PolymorphicDrawer />


<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Let's get cracking bones!</h1>
		<p>Start by exploring:</p>
		<ul>
			<li><code class="code">/src/routes/+layout.svelte</code> - barebones layout</li>
			<li><code class="code">/src/app.postcss</code> - app wide css</li>
			<li>
				<code class="code">/src/routes/+page.svelte</code> - this page, you can replace the contents
			</li>
			<li>
				{#each $drawerStore.components as component, i}
					<button on:click={() => drawerStore.active(component.key, true)} class="btn">
						Button {i + 1}	
					</button>
				{/each}
			</li>
		</ul>
	</div>
</div>
