<script lang="ts">
  import Button from "./Button.svelte";
  import serial, { connectionState } from "./serial";
  import { ConnectionState } from "./types";

  const connect = async () => {
    await serial.connect();
    serial.goReadData();
  };

  const disconnect = async () => {
    await serial.close();
  };
</script>

<div class="button">
  {#if $connectionState === ConnectionState.disconnected}
    <Button on:click={connect} type="big" title="Connect" />
  {:else if $connectionState === ConnectionState.active}
    <Button on:click={disconnect} type="big" title="Disconnect" />
  {:else if $connectionState === ConnectionState.connecting}
    <Button on:click={disconnect} disabled type="big flat" title="Connecting..." />
  {:else if $connectionState === ConnectionState.disconnecting}
    <Button on:click={disconnect} disabled type="big flat" title="Disconnecting..." />
  {:else if $connectionState === ConnectionState.starting}
    <Button on:click={disconnect} disabled type="big" title="Disconnect" />
  {/if}
</div>

<style>
  .button {
    display: flex;
    flex-direction: column;
  }
</style>