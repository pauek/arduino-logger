<script lang="ts">
  import { onDestroy } from "svelte";
  import ErrorMessage from "./lib/ErrorMessage.svelte";

  import File from "./lib/File.svelte";
  import AppHeader from "./lib/AppHeader.svelte";
  import serial from "./lib/serial";
  import SideBar from "./lib/SideBar.svelte";

  let errorMessage: String = null;

  onDestroy(() => serial.close());
</script>

<ErrorMessage text={errorMessage} onDismiss={() => (errorMessage = null)} />
<div class="screen">
  <AppHeader />
  <div class="split">
    <SideBar />
    <File />
  </div>
</div>

<style>
  .screen {
    position: relative;
    height: 100vh;
  }
  .split {
    position: absolute;
    left: 0;
    right: 0;
    top: 3rem;
    bottom: 0;

    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
</style>
