<script lang="ts" generics="T extends object, TPlugins extends AnyPlugins">
	import RowSelector from './RowSelector.svelte';
	import { derived, type Readable } from 'svelte/store';
	import type { TableDescription } from './datatable';
	import type { AnyPlugins } from 'svelte-headless-table/lib/types/TablePlugin';
    import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
    import { addColumnOrder, addHiddenColumns, addPagination, addResizedColumns, addSelectedRows, addSortBy } from 'svelte-headless-table/plugins';

    export let data: Readable<T[]>;
    export let descriptor: TableDescription<T>;
    export let tableClass: string = "table table-interactive";
    
    // TODO support for custom icons 

    const table = createTable(data, {
        sort: addSortBy<T>({
            disableMultiSort: descriptor.sort?.disableMultiSort,
        }),
        colOrder: addColumnOrder<T>({ // TODO svelte-dnd-action per drag and drop behavior ? 
            initialColumnIdOrder: descriptor.colOrder?.initialOrder,
        }),
        resize: addResizedColumns<T>({
        }),
        select: addSelectedRows<T>({
            initialSelectedDataIds: descriptor.select?.initialSelected,
            linkDataSubRows: descriptor.select?.linkDataSubRows,
        }),
        hide: addHiddenColumns<T>({
            initialHiddenColumnIds: descriptor.hidden?.initialHidden,
        }),
        page: addPagination<T>({
            initialPageSize: descriptor.page?.initialPageSize,
            initialPageIndex: descriptor.page?.initialPage,
        })
    });
    
    let columns = table.createColumns([
        table.display({
            id: 'selected',
            header: (cell, {pluginStates}) => {
                const { allRowsSelected, someRowsSelected  } = pluginStates.select;
                
                let indeterminate = derived([allRowsSelected, someRowsSelected], ([$all, $some]) => {
                    return !$all && $some;
                });
                return createRender(RowSelector, {
                    isSelected: allRowsSelected,
                    isIndeterminate: indeterminate,
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
        pageRows,
        tableAttrs,
        tableBodyAttrs,
        pluginStates, // per qualche motivo quando pluginStates viene destrutturato non funziona piú la reattivita del dom
    } = table.createViewModel(columns);
    
</script>

<table {...$tableAttrs} class="{tableClass}">
    <thead>
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
                                    
                                    <div 
                                        class:table-sort-asc={props.sort.order === 'asc'} 
                                        class:table-sort-dsc={props.sort.order === 'desc'} />
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
        {#each $pageRows as row (row.id)}
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