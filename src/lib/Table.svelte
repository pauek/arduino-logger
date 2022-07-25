<script lang="ts">
  export let samples;
</script>

<div class="table-container">
  <table class="data">
    {#if samples !== null && samples.length > 0}
      <thead>
        <th>Time</th>
        {#each samples[0].values as _, i}
          <th>Col {i}</th>
        {/each}
      </thead>
      <tbody>
        {#each samples.slice(-20) as sample}
          <tr>
            <td class="timestamp">
              {sample.timestamp.toLocaleTimeString("es-ES")}
            </td>
            {#each sample.values as value}
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
  table td.timestamp {
    text-align: left;
    font-style: italic;
    color: #777;
    font-size: 95%;
  }
</style>
