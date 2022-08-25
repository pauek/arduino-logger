<script lang="ts">
  import Button from "./Button.svelte";
  import db,{ samples,selectedFile } from "./db";
  import { connectionState } from './serial';
  import { ConnectionState } from "./types";

  $: isScratch = $selectedFile === "";
  $: hasData = $samples.length > 0;
  $: isActive = $connectionState === ConnectionState.active;
</script>

<div class="header">
  <h1>
    {#if isScratch}
      <em>Scratch</em>
    {:else}
      {$selectedFile}
    {/if}
  </h1>
  <div class="buttons">
    {#if !isActive}
      <Button title="Save as..." disabled={!hasData} />
    {/if}
    <div class="flex-space" />
    <Button
      title="Clear"
      on:click={db.clearFile}
      disabled={!hasData}
    />
    {#if !isScratch && !isActive}
      <div class="space" />
      <Button title="Delete" on:click={db.deleteFile} />
    {/if}
  </div>
</div>

<style>
  .header {
    display: flex;
    flex-direction: row;
    padding: 0.7rem 1.4rem 0.7rem 0;
  }
  h1 {
    margin: 0 1.2rem 0.2rem 0;
  }
  .buttons {
    flex: 1;
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
