<script lang="ts">
  import { ConnectionState, connectionState, samples } from "./serial";
  import type { Sample } from "./types";

</script>

<div class="table-container">
  <table
    class="data"
    class:active={$connectionState === ConnectionState.started}
    class:paused={$connectionState === ConnectionState.paused}
    class:pausing={$connectionState === ConnectionState.pausing}
    class:disconnected={$connectionState === ConnectionState.disconnected}
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
</div>

<style>
  table {
    border-collapse: collapse;
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
    border: 2px solid black;
  }

  table td.timestamp {
    text-align: left;
    font-style: italic;
    color: #777;
    font-size: 95%;
  }
</style>
