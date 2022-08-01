<script lang="ts">
  import { onDestroy } from "svelte";
  import ErrorMessage from "./lib/ErrorMessage.svelte";

  import DataPane from "./lib/File.svelte";
  import Header from "./lib/AppHeader.svelte";
  import serial from "./lib/serial";
  import SideBar from "./lib/SideBar.svelte";

  let errorMessage: String = null;

  onDestroy(() => serial.close());
</script>

<ErrorMessage text={errorMessage} onDismiss={() => errorMessage = null} />
<div class="screen">
  <Header />
  <div class="split">
    <SideBar />
    <DataPane />
  </div>
</div>

<style>
  .screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .split {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
</style>
