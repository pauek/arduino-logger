<script lang="ts">
  import Button from "./Button.svelte";
  import serial, { connectionState, errorMessage } from "./serial";
  import { ConnectionState } from "./types";

  const connect = async () => {
    try {
      await serial.connect();
      serial.goReadData();
    } catch (err) {
      $errorMessage = `Cannot connect: ${err.message}`;
      $connectionState = ConnectionState.disconnected;
    }
  };

  const disconnect = async () => {
    try {
      await serial.close();
    } catch (err) {
      $errorMessage = `Cannot disconnect: ${err.message}`;
    }
  };
</script>

<div class="button">
  {#if $connectionState === ConnectionState.disconnected}
    <Button icon="play" on:click={connect} type="big" title="Start" />
  {:else if $connectionState === ConnectionState.active}
    <Button icon="stop" on:click={disconnect} type="big" title="Stop" />
  {:else if $connectionState === ConnectionState.connecting}
    <Button
      on:click={disconnect}
      disabled
      type="big flat"
      title="Starting..."
    />
  {:else if $connectionState === ConnectionState.disconnecting}
    <Button
      on:click={disconnect}
      disabled
      type="big flat"
      title="Stopping..."
    />
  {:else if $connectionState === ConnectionState.starting}
    <Button on:click={disconnect} disabled type="big" title="Stop" />
  {/if}
</div>

<style>
  .button {
    display: flex;
    flex-direction: column;
  }
</style>
