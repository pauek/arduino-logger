<script lang="ts">
  import FileHeader from "./FileHeader.svelte";
  import DataTable from "./DataTable.svelte";
</script>

<main>
  <FileHeader />
  <div class="wrapper">
    <DataTable />
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
    background-color: #f9f9f9;
    border-top-left-radius: .2rem;
  }
</style>
