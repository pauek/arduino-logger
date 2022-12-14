<script lang="ts">
  import Button from "./Button.svelte";
  import ConnectButton from "./ConnectButton.svelte";
  import db, { fileList, SCRATCH_FILENAME, selectedFile } from "./db";
  import { connectionState } from "./serial";
  import { ConnectionState } from "./types";

  $: itemList = $fileList.map((file) => {
    const selected = file === $selectedFile;
    return { file, selected };
  });

  $: active = $connectionState === ConnectionState.active;

  const select = (file: string) => () => {
    if ($connectionState !== ConnectionState.active) {
      db.fileSelect(file);
    }
  };
</script>

<div class="sidebar" class:active>
  <div id="logo" title="Arduino Logger">
    <img src="logo.svg" alt="logo" width="124" height="42" />
  </div>
  <div class="button-wrapper connect">
    <ConnectButton />
  </div>
  <div class="space" />
  <div class="button-wrapper new">
    <Button icon="add" title="New" on:click={db.fileNew} disabled={active} />
  </div>
  <div class="small-space" />
  {#each itemList as item}
    <div
      class="file"
      class:selected={item.selected}
      on:click={select(item.file)}
    >
      {#if item.file === SCRATCH_FILENAME}
        <em>Scratch</em>
      {:else}
        {item.file}
      {/if}
      {#if item.selected && active}
        <div id="dot">
          <div class="body" />
        </div>
      {/if}
    </div>
  {/each}

  <div class="flex-space" />
  <footer>Made by <a href="https://twitter.com/pauek">@pauek</a></footer>
</div>

<style>
  .sidebar {
    padding: 0.8rem 0.8rem 0.8rem 0;
    width: 12rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    --left-padding: 0.8rem;
  }
  .space {
    height: 0.6rem;
  }
  .small-space {
    height: 0.6rem;
  }
  .file {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 12pt;
    padding: 0.3rem 0.5em 0.3rem var(--left-padding);
    border-top-right-radius: 5rem;
    border-bottom-right-radius: 5rem;
    border-width: 1px;
    border-style: solid;
    border-left: none;
    border-color: transparent;
  }
  #dot {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 15px;
    height: 15px;
  }
  #dot .body {
    animation-duration: 1s;
    animation-name: pulse;
    animation-iteration-count: infinite;
    background-color: var(--active-color);
    width: 10px;
    height: 10px;
    border-radius: 5px;
  }
  @keyframes pulse {
    from {
      opacity: 0.5;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
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
  .button-wrapper.new {
    justify-content: flex-end;
  }
  .button-wrapper.connect {
    display: block;
    padding-left: var(--left-padding);
  }
  #logo {
    font-size: 16pt;
    padding-top: .5rem;
    padding-left: calc(1.4rem + var(--left-padding));
    margin-bottom: 1.2rem;
  }
  .flex-space {
    flex: 1;
  }
  footer {
    color: #777;
    padding-left: var(--left-padding);
    font-size: 70%;
  }
  footer a {
    text-decoration: none;
  }
</style>
