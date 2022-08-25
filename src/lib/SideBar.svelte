<script lang="ts">
  import Button from "./Button.svelte";
  import db, { fileList, selectedFile } from "./db";
  import { connectionState } from "./serial";
  import { ConnectionState } from "./types";

  $: itemList = $fileList.map((file) => {
    const selected = file === $selectedFile;
    return { file, selected };
  });

  $: active = $connectionState === ConnectionState.active;

  const select = (file: string) => () => {
    if ($connectionState !== ConnectionState.active) {
      db.setSelectedFile(file);
    }
  };
</script>

<div class="sidebar" class:active>
  {#each itemList as item}
    <div
      class="file"
      class:selected={item.selected}
      on:click={select(item.file)}
    >
      {#if item.file === ""}
        Scratch
      {:else}
        {item.file}
      {/if}
    </div>
  {/each}
  <div class="space" />
  <div class="new">
    {#if !active}
      <Button title="New File" />
    {/if}
  </div>
</div>

<style>
  .sidebar {
    padding-right: 1.4rem;
    padding-top: 0.4rem;
    width: 10rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .space {
    height: 1rem;
  }
  .file {
    font-weight: bold;
    font-size: 15pt;
    padding: 0.4rem;
    border-top-right-radius: 5rem;
    border-bottom-right-radius: 5rem;
    margin-bottom: 0.3rem;
    border-width: 1px;
    border-style: solid;
    border-left: none;
    border-color: transparent;
  }
  :not(.active) .file:not(.selected) {
    cursor: pointer;
  }
  :not(.active) .file:not(.selected):hover {
    background-color: #f7f7f7;
  }
  .active .file {
    color: lightgray;
  }
  .active .file.selected {
    background-color: var(--active-100);
    border-color: var(--active-color);
    color: var(--active-color);
  }

  .active .file:hover:not(.selected) {
    background-color: transparent;
  }
  .active .file:hover {
    cursor: default;
  }
  .file.selected {
    color: var(--primary-color);
    background-color: var(--primary-100);
    border-color: var(--primary-color);

  }
  .new {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
