<script lang="ts">
  export let name: string;
  export let size: number;
  export let color: string;

  import IconAdd from "./IconAdd.svelte";
  import IconClear from "./IconClear.svelte";
  import IconDelete from "./IconDelete.svelte";
  import IconPlay from "./IconPlay.svelte";
  import IconRecord from "./IconRecord.svelte";
  import IconSave from "./IconSave.svelte";
</script>

{#if name === "add"}
  <IconAdd {size} {color} />
{:else if name === "clear"}
  <IconClear {size} {color} />
{:else if name === "delete"}
  <IconDelete {size} {color} />
{:else if name === "play"}
  <IconPlay {size} {color} />
{:else if name === "record"}
  <IconRecord {size} {color} />
{:else if name === "save"}
  <IconSave {size} {color} />
{/if}
