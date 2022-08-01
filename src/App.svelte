<script lang="ts">
  import { onDestroy } from "svelte";
  import ErrorMessage from "./lib/ErrorMessage.svelte";
  /*
  Connection:
  - Crear una conexión (esto debería estar todo el rato): connectToSerialPort
  - Poner un for await a leer datos
  - Pausar la conexión (parar el proceso que lee datos).
  - Reanudar la conexión (volver a empezar el proceso que lee datos).
  - Cerrar la conexión.

  Los stores son *GRANULARES*, haces un store para cada cosa que el UI necesita!
  > Samples puede ser un store. (readable, easy)
  > ConnectionState puede ser otro store (readable)
  > Errors puede ser otro (readable)
  > Un writable para indicar qué hay que hacer?

  $samples
  $connectionState
  $errors

  funciones:
  - connectToSerialPort
  - pause
  - resume
  - disconnect

  */

  import serial, { connectionState, ConnectionState } from "./lib/serial";
  import Table from "./lib/Table.svelte";

  let errorMessage: String = null;

  const connect = async () => {
    await serial.connect();
    serial.goReadData();
  };

  const dismiss = () => {
    errorMessage = null;
  };

  const disconnect = async () => {
    await serial.close();
  };

  onDestroy(() => serial.close());
</script>

<ErrorMessage text={errorMessage} onDismiss={dismiss} />
<main>
  {#if $connectionState === ConnectionState.disconnected}
    <button on:click={connect}>Connect to Arduino</button>
  {:else if $connectionState === ConnectionState.started || $connectionState === ConnectionState.paused}
    <button on:click={disconnect}>Disconnect</button>
  {:else if $connectionState === ConnectionState.connecting}
    <button on:click={disconnect} disabled={true}>Connecting...</button>
  {:else if $connectionState === ConnectionState.disconnecting}
    <button on:click={disconnect} disabled={true}>Disconnecting...</button>
  {:else if $connectionState === ConnectionState.pausing || $connectionState === ConnectionState.starting}
    <button on:click={disconnect} disabled={true}>Disconnect</button>
  {/if}

  {#if $connectionState === ConnectionState.paused}
    <button on:click={serial.start}>Start</button>
  {:else if $connectionState === ConnectionState.started}
    <button on:click={serial.pause}>Pause</button>
  {:else if $connectionState === ConnectionState.pausing}
    <button on:click={disconnect} disabled={true}>Pausing...</button>
  {:else if $connectionState === ConnectionState.starting}
    <button on:click={disconnect} disabled={true}>Starting...</button>
  {/if}

  <div class="space" />

  <Table />
</main>

<style>
  main {
    padding: 1rem;
    padding-top: 1rem;
  }
  .space {
    height: 2rem;
  }
</style>
