<script lang="ts">
  import { onDestroy } from "svelte";
  import ErrorMessage from "./lib/ErrorMessage.svelte";

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
