<script lang="ts">
  import { tick } from "svelte";
  import db from "./db";

  export let name: string;
  export let isScratch: boolean = false;
  export let disabled: boolean = false;

  let isEditing: boolean = false;
  let editName: string;
  let inputElement: HTMLInputElement;

  $: {
    if (isEditing) {
      document.addEventListener("keydown", stopEditingOnEscape);
    } else {
      document.removeEventListener("keydown", stopEditingOnEscape);
    }
  }

  const startEditing = async () => {
    if (disabled) {
        return;
    }
    editName = name;
    isEditing = true;
    await tick();
    inputElement.focus();
    inputElement.select();
  };

  const stopEditing = () => {
    isEditing = false;
  };

  const stopEditingOnEscape = (e) => {
    if (e.keyCode === 27 /* Escape */) {
      stopEditing();
    }
  };

  const saveName = async () => {
    await db.fileRename(editName);
    isEditing = false;
    name = editName;
  };
</script>

<div class="editable-file-name">
  {#if isScratch}
    <h1 class="scratch"><em>Scratch</em></h1>
  {:else if isEditing}
    <form on:submit|preventDefault={saveName} on:keydown={stopEditingOnEscape}>
      <input
        type="text"
        bind:value={editName}
        on:blur={stopEditing}
        bind:this={inputElement}
      />
    </form>
  {:else}
    <h1 on:click={startEditing}>{name}</h1>
  {/if}
</div>

<style>
  h1 {
    font-size: 20pt;
    margin: 0 1.2rem 0.2rem 0;
    padding: 3px 0 0 4px;
  }
  h1.scratch {
    color: gray;
  }
  .editable-file-name {
    margin-right: 1rem;
    min-width: 12rem;
  }
  input[type="text"] {
    font-size: 20pt;
    font-weight: bold;
    width: 12rem;
  }
</style>
