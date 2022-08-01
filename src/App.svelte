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

  import serial, { samples, connectionState, ConnectionState } from "./lib/serial";
  import Table from "./lib/Table.svelte";
  import type { Sample } from "./lib/types";

  let errorMessage: String = null;

  const connect = async () => {
    await serial.connectToSerialPort();
    serial.goReadData();
  };

  const dismiss = () => {
    errorMessage = null;
  };

  const disconnect = async () => {
    await serial.closeConnection();
  };

  onDestroy(() => serial.closeConnection());
</script>

<ErrorMessage text={errorMessage} onDismiss={dismiss} />
<main>
  {#if $connectionState === ConnectionState.disconnected}
    <button on:click={connect}>Connect to Arduino</button>
  {:else}
    <button on:click={disconnect}>Disconnect</button>
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
