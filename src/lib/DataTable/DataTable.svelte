<script lang="ts" generics="T extends object, TPlugins extends AnyPlugins">

	import RowSelector from './RowSelector.svelte';

	import type { Readable } from 'svelte/store';
	import type { TableDescription } from './datatable';
	import type { AnyPlugins } from 'svelte-headless-table/lib/types/TablePlugin';
    import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
    import { addResizedColumns, addSelectedRows, addSortBy } from 'svelte-headless-table/plugins';

    export let data: Readable<T[]>;
    export let descriptor: TableDescription<T>;
    export let tableClass: string = "table table-interactive";
    
    // TODO support for custom icons 

    const table = createTable(data, {
        sort: addSortBy({
            disableMultiSort: descriptor.sort?.disableMultiSort,
        }),
        resize: addResizedColumns({
        }),
        select: addSelectedRows({
            initialSelectedDataIds: descriptor.select?.initialSelected,
            linkDataSubRows: descriptor.select?.linkDataSubRows,
        }),
        /* 
        colFilter: addColumnFilters({

        })
        */
    });
    
    let columns = table.createColumns([
        table.display({
            id: 'selected',
            header: (cell, {pluginStates}) => {
                const { allRowsSelected, someRowsSelected  } = pluginStates.select;

                return createRender(RowSelector, {
                    isSelected: allRowsSelected,
                    isIndeterminate: someRowsSelected,
                });
            },
            cell: ({row}, { pluginStates }) => {
                const { isSelected, isSomeSubRowsSelected } = pluginStates.select.getRowState(row);
                return createRender(RowSelector, {
                    isSelected,
                    isIndeterminate: isSomeSubRowsSelected,
                });
            },
        }),
        ...descriptor.columns.map(column => {
        return table.column({
            header: column.header,
            accessor: column.key,
            plugins: {
                sort: column.sort && {
                    disable: column.sort.disable,
                },
                resize: column.resize && {
                    disable: column.resize.disable,
                    initialWidth: column.resize.initialWidth,
                    minWidth: column.resize.minWidth,
                    maxWidth: column.resize.maxWidth,
                },
            }
        });
    })]);

    const {
        headerRows,
        rows,
        tableAttrs,
        tableBodyAttrs,
        tableHeadAttrs,
        pluginStates
    } = table.createViewModel(columns);

</script>

<table {...$tableAttrs} class="{tableClass}">
    <thead {...$tableHeadAttrs}>
        {#each $headerRows as headerRow (headerRow.id)}
           <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
                <tr {...rowAttrs}>
                    {#each headerRow.cells as cell (cell.id)}
                        <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                            <th 
                                {...attrs} 
                                on:click={props.sort.toggle}
                                use:props.resize
                                class="relative overflow-hidden"
                                >
                                <div class="flex justify-between items-center gap-2">
                                    <Render of={cell.render()} />
                                    
                                    <!-- non so perché ma usare la sintassi class:<classe>={condizione} non me lo rende reattivo -->
                                    {#if props.sort.order === 'asc'}
                                        <div class="table-sort-asc" />
                                    {:else if props.sort.order === 'desc'}
                                        <div class="table-sort-dsc" />
                                    {/if}
                                </div>

                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                <div 
                                    role="separator"
                                    class="resizer bg-surface-400 hover:bg-tertiary-500"  
                                    use:props.resize.drag
                                    />
                            </th>
                        </Subscribe>
                    {/each}
                </tr>
            </Subscribe>
        {/each}
    </thead>
    <tbody {...$tableBodyAttrs}>
        {#each $rows as row (row.id)}
            <Subscribe rowAttrs={row.attrs()} let:rowAttrs rowProps={row.props()} let:rowProps>
                <tr {...rowAttrs} class:table-row-checked={rowProps.select.selected}>
                    {#each row.cells as cell (cell.id)}
                        <Subscribe attrs={cell.attrs()} let:attrs>
                            <td {...attrs} class="overflow-hidden">
                                <Render of={cell.render()} />
                            </td>
                        </Subscribe>
                    {/each}
                </tr>
            </Subscribe>   
        {/each}
    </tbody>
</table>

<style>
    .resizer {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0px;
        width: 4px;
        z-index: 1;
        cursor: col-resize;
    }
</style>    