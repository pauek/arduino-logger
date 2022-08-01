<script lang="ts">
  import Button from "./Button.svelte";
  import db, { samples, selectedFile } from "./db";
</script>

<div class="data-header">
  <h1>
    {#if $selectedFile === ""}
      Scratch
    {:else}
      {$selectedFile}
    {/if}
  </h1>
  <div class="buttons">
    <Button title="Save to File" disabled />
    <div class="space" />
    <Button title="Clear" on:click={db.clearFile} disabled="{$samples.length === 0}" />
    <div class="flex-space" />
    <Button title="Delete" on:click={db.deleteFile} />
  </div>
</div>

<style>
  .data-header {
    display: flex;
    flex-direction: column;
    padding: 0.8rem;
    padding-left: 0;
  }
  h1 {
    margin: 0.2rem 0 0.5rem;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .space {
    width: 0.4rem;
  }
  .flex-space {
    flex: 1;
  }
</style>
