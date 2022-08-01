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

  import { Connection, connectToSerialPort } from "./lib/serial";
  import Table from "./lib/Table.svelte";
  import type { Sample } from "./lib/types";

  let errorMessage: String = null;
  let connection: Connection = null;
  let samples: Sample[] = [];

  const connect = async () => {
    try {
      connection ??= await connectToSerialPort();
      for await (let newSample of connection.readData()) {
        console.log("New sample:", newSample);
        samples = [...samples, newSample];
      }
    } catch (err) {
      errorMessage = `Cannot connect to serial port: ${err.toString()}`;
    }
  };

  const dismiss = () => {
    errorMessage = null;
  }

  const disconnect = async () => {
    connection.close();
    connection = null;
  };

  onDestroy(() => connection.close());
</script>

<ErrorMessage text={errorMessage} onDismiss={dismiss} />
<main>
  {#if connection === null}
    <button on:click={connect}>Connect to Arduino</button>
  {:else}
    <button on:click={disconnect}>Disconnect</button>
  {/if}

  <div class="space" />

  <Table {samples} connected={connection != null}/>
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
