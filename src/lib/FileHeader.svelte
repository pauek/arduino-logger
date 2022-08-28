<script lang="ts">
  import Button from "./Button.svelte";
  import db, { samples, SCRATCH_FILENAME, selectedFile } from "./db";
  import EditableFileName from "./EditableFileName.svelte";
  import { connectionState } from "./serial";
  import { ConnectionState } from "./types";

  $: isScratch = $selectedFile === SCRATCH_FILENAME;
  $: hasData = $samples.length > 0;
  $: isActive = $connectionState === ConnectionState.active;

  const saveFile = async () => {
    const a = document.createElement("a");
    const content = await db.fileContent();
    a.href = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
    a.download = isScratch ? "scratch.csv" : $selectedFile + ".csv";
    a.click();
  };
</script>

<div class="header">
  <EditableFileName {isScratch} name={$selectedFile} disabled={isActive} />
  <div class="vspace" />
  <div class="buttons">
    {#if !isActive}
      <Button
        icon="save"
        title="Export"
        on:click={saveFile}
        disabled={!hasData}
      />
    {/if}
    <div class="flex-space" />
    <Button
      icon="clear"
      title="Clear"
      on:click={db.fileClear}
      disabled={!hasData}
    />
    {#if !isScratch && !isActive}
      <div class="space" />
      <Button icon="delete" title="Delete" on:click={db.fileDelete} />
    {/if}
  </div>
</div>

<style>
  .header {
    display: flex;
    flex-direction: column;
    padding: 0.7rem 1.4rem 0.7rem 0;
  }
  .buttons {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .vspace {
    height: 0.1rem;
  }
  .space {
    width: 0.4rem;
  }
  .flex-space {
    flex: 1;
  }
</style>
