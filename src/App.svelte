<script lang="ts">
import Table from "./lib/Table.svelte";

  interface Sample {
    timestamp: Date;
    values: number[];
  }

  let port: SerialPort = null;
  let samples: Sample[] = null;

  const getPort = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      return port;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const readData = async (port: SerialPort) => {
    while (port.readable) {
      const reader = port.readable.getReader();
      try {
        let str = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          str += new TextDecoder().decode(value);
          const pos = str.indexOf("\n");
          if (pos !== -1) {
            const line = str.slice(0, pos);
            str = str.slice(pos + 2);
            const newSample = {
                  timestamp: new Date(),
                  values: line.split(",").map(Number),
                };
            if (Array.isArray(samples)) {
              samples = [...samples, newSample];
            } else if (samples === null) {
              // Discard first line of data
              samples = [];
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        reader.releaseLock();
      }
    }
  };

  const connect = async () => {
    if (port === null) {
      port = await getPort();
    }
    readData(port);
  };
</script>

<main>
  <button on:click={connect}>Connect to Arduino</button>
  <div>
    {(port && "Connected") || ""}
  </div>
  <Table samples={samples} />
</main>

