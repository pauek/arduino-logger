<script lang="ts">
  import { samples } from "./db";
  import { connectionState } from "./serial";
  import { ConnectionState } from "./types";

  $: isActive = $connectionState === ConnectionState.active;
  $: isDisconnected = $connectionState === ConnectionState.disconnected;

</script>

<div class="table-container">
  <table
    class="data"
    class:active={isActive}
    class:disconnected={isDisconnected}
  >
    {#if $samples !== null && $samples.length > 0}
      <thead>
        <th>Time</th>
        {#each $samples[0].values as _, i}
          <th>Col {i}</th>
        {/each}
      </thead>
      <tbody>
        {#each $samples.slice(-50).reverse() as s}
          <tr>
            <td class="timestamp">
              {s.timestamp.toLocaleTimeString("es-ES")}
            </td>
            {#each s.values as value}
              <td>{value}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    {/if}
  </table>
  {#if isActive && $samples.length === 0}
    <p>Waiting for data...</p>
  {/if}
</div>

<style>
  table {
    border-collapse: collapse;
    background-color: white;
  }
  table td,
  table th {
    border: 1px solid #ccc;
    padding: 0.2em 0.4em;
  }
  table td {
    text-align: right;
  }
  table tr:first-child td {
    font-weight: bold;
  }
  table.active tr:first-child td {
    background-color: rgb(158, 255, 156);
  }
  table.paused tr:first-child td {
    background-color: rgb(255, 224, 156);
  }
  table.pausing tr:first-child td {
    background-color: rgb(255, 224, 156);
  }
  table.disconnected tr:first-child td {
    background-color: lightgray;
  }

  table tr:first-child {
    outline: 1px solid black;
  }

  table td.timestamp {
    text-align: left;
    font-style: italic;
    color: #777;
    font-size: 95%;
  }
</style>
