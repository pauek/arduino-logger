<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Icon from "./icons/Icon.svelte";

  export let icon: string = "";
  export let title: string;
  export let disabled: boolean = false;
  export let type: string = "";

  $: size = type === "big" ? 22 : 16;

  const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch("click")} {disabled} class={type}>
  {#if icon}
    <Icon name={icon} color={type === "big" ? "white" : "black"} {size} />
  {/if}
  <div class="space" />
  <span class="text">{title}</span>
</button>

<style>
  button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center;
    color: #555;
    padding: 0.3rem 0.55rem 0.3rem 0.45rem;
    background-color: white;
    border-radius: 0.25em;
    border-width: 0px;
    font-size: 10pt;
    box-shadow: 0px 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border: 1px solid rgb(182, 182, 182);
  }
  .space {
    width: 0.4rem;
  }

  button.big {
    padding: 0.4rem 1.2rem 0.4rem 1.2rem;
    font-size: 14pt;
    background-color: var(--primary-color);
    border: none;
    border-radius: 0.5em;
    color: white;
    font-weight: bold;
  }
  button.flat {
    box-shadow: none;
  }
  button:not([disabled]):hover {
    color: #444;
    border-color: rgb(150, 150, 150);
    background-color: rgba(0, 0, 120, 0.03);
  }
  button.big:hover {
    color: white;
    background-color: var(--primary-color-darker);
  }
  button:not([disabled]):active {
    box-shadow: none;
  }
  button[disabled] {
    opacity: 0.6;
    cursor: default;
  }
  button[disabled].flat {
    background-color: white;
    color: lightgray;
    border: 1px solid lightgray;
  }
</style>
