<script lang="ts">
  import Button from "./Button.svelte";
  import db, { fileList, selectedFile } from "./db";
import { connectionState } from "./serial";
import { ConnectionState } from "./types";

  const select = (file) => () => {
    if ($connectionState !== ConnectionState.active) {
      db.setSelectedFile(file);
    }
  }
</script>

<div class="sidebar">
  {#each $fileList as file}
    <div
      class="file"
      class:selected={file === $selectedFile}
      on:click={select(file)}
    >
      {#if file === ""}
        Scratch
      {:else}
        {file}
      {/if}
    </div>
  {/each}
  <div class="space" />
  <div class="new">
    <Button title="New File" />
  </div>
</div>

<style>
  .sidebar {
    padding-right: 1.4rem;
    padding-top: .4rem;
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
    cursor: pointer;
    margin-bottom: .3rem;
  }
  .file:hover {
    background-color: #f7f7f7;
  }
  .file.selected {
    color: rgb(0, 130, 173);
    background-color: rgb(219, 246, 255);
  }
  .new {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
