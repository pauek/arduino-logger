<script lang="ts">
  import Button from "./Button.svelte";
  import ConnectButton from "./ConnectButton.svelte";
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
  <div id="logo">
    Logo
  </div>
  <div class="button-wrapper connect">
    <ConnectButton />
  </div>
  <div class="space" />
  {#each itemList as item}
    <div
      class="file"
      class:selected={item.selected}
      on:click={select(item.file)}
    >
      {#if item.file === ""}
        <em>Scratch</em>
      {:else}
        {item.file}
      {/if}
    </div>
  {/each}
  <div class="space" />
  <div class="button-wrapper">
    {#if !active}
      <Button title="New File" />
    {/if}
  </div>
</div>

<style>
  .sidebar {
    padding-right: 1.4rem;
    padding-top: 0.4rem;
    width: 12rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    --left-padding: 1rem;
  }
  .space {
    height: 1.2rem;
  }
  .file {
    font-size: 12pt;
    padding: 0.3rem 0.3rem 0.3rem var(--left-padding);
    border-top-right-radius: 5rem;
    border-bottom-right-radius: 5rem;
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
  .file.selected {
    font-weight: bold;
    color: var(--primary-color);
    background-color: var(--primary-100);
  }
  .active .file {
    color: lightgray;
  }
  .active .file.selected {
    background-color: var(--active-100);
    color: var(--active-color);
  }

  .active .file:hover:not(.selected) {
    background-color: transparent;
  }
  .active .file:hover {
    cursor: default;
  }
  .button-wrapper {
    display: flex;
    flex-direction: row;
    padding-left: var(--left-padding);
  }
  .button-wrapper.connect {
    display: block;
    padding-left: var(--left-padding);
    padding-right: 0.6rem;
  }
  #logo {
    font-size: 16pt;
    padding: 0.8rem;
    padding-left: var(--left-padding);
    margin-bottom: .8rem;
  }
</style>
