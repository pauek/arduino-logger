<script lang="ts">
  import { onDestroy } from "svelte";

  import { errorMessage } from "../lib/serial";

  export let duration: number = 5000;

  let message: String;
  let shownMessage: String;
  let timeoutID;

  let unsubscribe = errorMessage.subscribe((newMessage) => {
    if (newMessage !== null) {
      shownMessage = newMessage;
      message = newMessage;
      console.log(timeoutID);
      timeoutID = setTimeout(() => ($errorMessage = null), duration);
    } else {
      shownMessage = message;
      message = null;
    }
  });

  onDestroy(unsubscribe);

  const dismiss = () => {
    $errorMessage = null;
    clearTimeout(timeoutID);
  };
</script>

<div class="error-message" class:visible={message !== null}>
  <div class="wrapper">
    <div class="text">
      {shownMessage}
    </div>
    <span class="close" on:click={dismiss}>&times;</span>
  </div>
</div>

<style>
  .error-message {
    z-index: 10;
    position: absolute;
    top: 0.6rem;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: white;
    opacity: 0;
    pointer-events: none; /* Para poder clicar botones debajo!! */
    transition-property: opacity;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }
  .error-message.visible {
    opacity: 1;
    transition: ease-out;
  }
  .error-message .wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: red;
    padding: 0.6rem 0.6rem 0.6rem 1.2rem;
    border-radius: 0.25rem;
    box-shadow: 0px 6px 12px rgb(182, 182, 182);
  }
  .error-message .text {
    margin-right: 2rem;
  }
  .error-message .close {
    cursor: pointer;
    height: 1.5rem;
    width: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 150%;
    color: rgba(255, 255, 255, 0.5);
  }
  .error-message .close:hover {
    color: rgba(255, 255, 255, 0.7);
  }
</style>
