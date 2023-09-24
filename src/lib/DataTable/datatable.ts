/**
 * @file datatable.ts
 */

import type { Table } from "svelte-headless-table";
import type { AnyPlugins } from "svelte-headless-table/lib/types/TablePlugin";

type StringKeyOf<T> = Extract<keyof T, string>;
export type TablePlugins<T> = T extends Table<unknown, infer P> ? P : never;

export type TableDescription<T extends object> = {
    columns: TableColumn<T, keyof T>[];
    sort?: {
        disableMultiSort: boolean;
    },
    select?: {
        initialSelected?: Record<string, boolean>;
        linkDataSubRows?: boolean;
    },
    colOrder?: {
        // non mi piace molto ma funziona, senza il plugin si lamenta he ci sono dei number
        initialOrder?: (StringKeyOf<T>)[], 
        hideUnspecified?: boolean;
    },
    hidden?: {
        initialHidden?: StringKeyOf<T>[];
    },
    page?: {
        initialPage?: number;
        initialPageSize?: number;
    },
}

export type TableColumn<T, TKey extends keyof T> = {
    /**
     * Key of the column in the data object
     */
    key: TKey;

    /**
     * Header of the column, shown in table
     */
    header: string;
    sort?: {
        /**
         * Disables sorting for this column
         */
        disable?: boolean;
        
        /**
         * Comparison function for sorting
         * @param left 
         * @param right 
         * @returns 
         */
        compare?: (left: T[TKey], right: T[TKey]) => number;
        
        /**
         * Selects values to sort by for complex types
         * @param value value of the cell
         * @returns value to use in sort
         */
        getSortValue?: (value: T[TKey]) => string | number | ( string | number )[];
        
        /**
         * inverts the sort order
         */
        invert?: boolean;
    },
    resize?: {
        initialWidth?: number;
        minWidth?: number;
        maxWidth?: number;
        disable?: boolean;
    }
}
