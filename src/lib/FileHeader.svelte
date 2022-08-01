<script lang="ts">
  import Button from "./Button.svelte";
  import serial,{ connectionState } from "./serial";
  import { ConnectionState } from "./types";
</script>

<div class="data-header">
  <h3>Title</h3>
  <div class="buttons">
    {#if $connectionState === ConnectionState.paused}
      <Button on:click={serial.start} title="Start" />
    {:else if $connectionState === ConnectionState.started}
      <Button on:click={serial.pause} title="Pause" />
    {:else if $connectionState === ConnectionState.pausing}
      <Button on:click={serial.close} disabled={true} title="Pausing..." />
    {:else if $connectionState === ConnectionState.starting}
      <Button on:click={serial.close} disabled={true} title="Starting..." />
    {/if}
    <div class="space"></div>
    <Button title="Save to File" />
    <div class="space"></div>
    <Button title="Clear" />
    <div class="flex-space"></div>
    <Button title="Delete" />
  </div>
</div>

<style>
  .data-header {
    display: flex;
    flex-direction: column;
    padding: 0.8rem;
    border-bottom: 1px solid black;
  }
  h3 {
    margin: 0;
    margin-bottom: 0.5rem;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .space {
    width: .4rem;
  }
  .flex-space {
    flex: 1;
  }
</style>
