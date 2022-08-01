<script>
  import Button from "./Button.svelte";
</script>

<div class="sidebar">
  <div>SideBar</div>
  <Button title="New File" disabled />
</div>

<style>
  .sidebar {
    padding: .6rem;
    padding-right: 1.4rem;
    width: 10rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
</style>
