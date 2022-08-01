<script lang="ts">
  import Button from "./Button.svelte";
</script>

<div class="data-header">
  <h1>Title</h1>
  <div class="buttons">
    <Button title="Save to File" disabled />
    <div class="space" />
    <Button title="Clear" disabled />
    <div class="flex-space" />
    <Button title="Delete" disabled />
  </div>
</div>

<style>
  .data-header {
    display: flex;
    flex-direction: column;
    padding: 0.8rem;
    padding-left: 0;
    border-bottom: 1px solid black;
  }
  h1 {
    margin: 0.2rem 0 0.5rem;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .space {
    width: 0.4rem;
  }
  .flex-space {
    flex: 1;
  }
</style>
