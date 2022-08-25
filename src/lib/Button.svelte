<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let title: String;
  export let disabled: boolean = false;
  export let type: string = "";

  const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch("click")} {disabled} class={type}>
  {title}
</button>

<style>
  button {
    color: #555;
    padding: 0.3rem 0.65rem 0.2rem 0.65rem;
    background-color: white;
    border-radius: 0.25em;
    border-width: 0px;
    font-size: 11pt;
    box-shadow: 0px 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border: 1px solid rgb(182, 182, 182);
  }
  button.big {
    padding: 0.6rem 1.2rem 0.4rem 1.2rem;
    font-size: 115%;
    background-color: var(--primary-color);
    border: none;
    border-radius: 0.5em;
    color: white;
    font-weight: bold;
  }
  button.flat {
    box-shadow: none;
  }
  button:hover {
    color: #444;
    border-color: rgb(150, 150, 150);
    background-color: rgba(0, 0, 120, 0.03);
  }
  button.big:hover {
    background-color: var(--primary-color-darker);
  }
  button:not([disabled]):active {
    box-shadow: none;
  }
  button[disabled] {
    background-color: lightgray;
    cursor: default;
  }
  button[disabled].flat {
    background-color: white;
    color: lightgray;
    border: 1px solid lightgray;
  }
</style>
