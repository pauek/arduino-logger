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
    <Button on:click={connect} title="Connect to Arduino" />
  {:else if $connectionState === ConnectionState.active}
    <Button on:click={disconnect} title="Disconnect" />
  {:else if $connectionState === ConnectionState.connecting}
    <Button on:click={disconnect} disabled={true} title="Connecting..." />
  {:else if $connectionState === ConnectionState.disconnecting}
    <Button on:click={disconnect} disabled={true} title="Disconnecting..." />
  {:else if $connectionState === ConnectionState.starting}
    <Button on:click={disconnect} disabled={true} title="Disconnect" />
  {/if}
</div>
