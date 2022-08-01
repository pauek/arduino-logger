<script lang="ts">
  import DataHeader from "./FileHeader.svelte";
  import Table from "./DataTable.svelte";
</script>

<main>
  <DataHeader />
  <div class="wrapper">
    <Table />
  </div>
</main>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .wrapper {
    flex: 1;
    overflow-y: scroll;
    background-color: #f5f5f5;
  }
</style>
