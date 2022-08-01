<script lang="ts">
  export let title: String;
  export let disabled: boolean = false;
</script>

<button on:click {disabled}>{title}</button>

<style>
  button {
    color: white;
    background-color: rgb(50, 112, 255);
    padding: 0.4rem 0.6rem;
    border-radius: 5rem;
    border-width: 0px;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }
  button[disabled] {
    background-color: lightgray;
  }
</style>
