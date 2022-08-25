<script lang="ts">
  import ConnectButton from "./ConnectButton.svelte";
</script>

<header>
  <div id="logo">Logo</div>
  <div class="spacer" />
  <ConnectButton />
</header>

<style>
  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
    height: 2.5rem;
    background-color: white;
  }
  .spacer {
    flex: 1;
  }
</style>
