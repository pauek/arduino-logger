<script lang="ts">
  import { afterUpdate } from "svelte";

  export let text: String;
  export let onDismiss: () => void;

  afterUpdate(() => {
    setTimeout(onDismiss, 5000);
  });
</script>

<div class="error-message" class:visible={text != null}>
  <div class="text">
    {text}
    <span class="close" on:click={onDismiss}>&times;</span>
  </div>
</div>

<style>
  :global(body) {
    --error-message-height: 2.6rem;
  }
  .error-message {
    position: absolute;
    top: -2.6rem;
    left: 0;
    right: 0;
    height: var(--error-message-height);
    background-color: red;
    color: white;
    transition-property: top;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }
  .error-message.visible {
    top: 0;
    transition: ease-out;
  }
  .error-message .text {
    height: var(--error-message-height);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 0.5rem 0 1rem;
    align-items: center;
  }
  .error-message .close {
    cursor: pointer;
    height: 1.5rem;
    width: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 150%;
  }
</style>
