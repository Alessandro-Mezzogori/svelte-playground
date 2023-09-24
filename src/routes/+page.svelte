<script lang="ts">
	import PolymorphicDrawer from "$lib/PolymorphicDrawer/PolymorphicDrawer.svelte";
	import { setup } from "$lib/PolymorphicDrawer/test/test";
	import { drawerComponent, drawerStore } from "$lib/PolymorphicDrawer/polymorphic-drawer";
	import Pd1 from "$lib/PolymorphicDrawer/test/PD1.svelte";
	import Pd2 from "$lib/PolymorphicDrawer/test/PD2.svelte";
	import Pd3 from "$lib/PolymorphicDrawer/test/PD3.svelte";
	import DataTable from "$lib/DataTable/DataTable.svelte";
	import { readable, writable } from "svelte/store";
	import { createTable } from "svelte-headless-table";
	import { addSortBy } from "svelte-headless-table/plugins";
	import type { TableDescription } from "$lib/DataTable/datatable";

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
	
	type Data = {
		id: number;
		name: string;
		surname: string,
		age: number;
	};

	const data: Data[] = Array.from({length: 10}, (_, i) => {
		return {
			id: i,
			name: `Nam ${i}`,
			surname: `Surname ${100 - i}`,
			age: i * 10
		} satisfies Data;
	});
	
	const dataStore = readable(data);
	const descriptor: TableDescription<Data> = {
		page: {
			initialPageSize: 5,
		},
		columns: [
			{
				key: "id",
				header: "Id",
			},
			{
				key: "name",
				header: "Name",
			},
			{
				key: "surname",
				header: "Surname",
			},
			{
				key: "age",
				header: "Age",
			}
		]
	}
</script>

<PolymorphicDrawer />


<div class="container h-full mx-auto flex justify-center items-center flex-col gap-5">
	<div class="space-y-5">
		<h1 class="h1">Let's get cracking bones!</h1>
		<p>Start by exploring:</p>
		<ul>
			<li>
				{#each $drawerStore.components as component, i}
					<button on:click={() => drawerStore.active(component.key, true)} class="btn">
						Button {i + 1}	
					</button>
				{/each}
			</li>
		</ul>
	</div>
	<div class="bg-red-900">
		<DataTable 
			data={dataStore} 
			descriptor={descriptor}
			/>
	</div>
</div>
