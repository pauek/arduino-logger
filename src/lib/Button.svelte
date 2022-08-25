<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let title: String;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch("click")} {disabled}>{title}</button>

<style>
  button {
    color: white;
    background-color: var(--primary-color);
    padding: 0.4rem 0.6rem;
    border-radius: 5rem;
    border-width: 0px;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 105%;
    font-weight: bold;
  }
  button[disabled] {
    background-color: lightgray;
  }
</style>
