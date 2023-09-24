<script lang="ts">
	import type { Readable } from "svelte/store";

    export let isSelected: Readable<boolean>;
    export let isIndeterminate: Readable<boolean> | undefined;
  </script>
  
  <input type="checkbox" 
    bind:checked={$isSelected} 
    indeterminate={$isIndeterminate} 
    />
  