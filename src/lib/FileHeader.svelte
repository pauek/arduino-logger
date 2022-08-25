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
      Scratch
    {:else}
      {$selectedFile}
    {/if}
  </h1>
  <div class="buttons">
    {#if !isScratch && !isActive && hasData}
      <Button title="Save to File" disabled={!hasData} />
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
    flex-direction: column;
    padding: 0.8rem;
    padding-left: 0;
    padding-bottom: 1.2rem;
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
