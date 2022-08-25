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
    padding: 0.3rem 0.65rem 0.2rem 0.65rem;
    border-radius: 0.3rem;
    border-width: 0px;
    font-size: 95%;
    font-weight: bold;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
    cursor: pointer;
  }
  button:hover {
    background-color: var(--primary-color-darker);
  }
  button:active {
    box-shadow: none;
  }
  button[disabled] {
    background-color: lightgray;
  }
</style>
