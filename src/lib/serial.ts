import { derived, writable } from "svelte/store";
import type { Sample } from "./types";

export enum ConnectionState {
  connecting,
  connected,
  disconnecting,
  disconnected,
  active,
  paused,
}

const state = writable<ConnectionState>(
  ConnectionState.disconnected
);
export const connectionState = derived(state, x => x);
class Connection {
  port: SerialPort;
  reader: ReadableStreamDefaultReader<Uint8Array>;
  stream: AsyncGenerator<Sample>;

  constructor() {
    this.port = null;
    this.reader = null;
    this.stream = null;
  }

  async setup() {
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 9600 });
    this.reader = this.port.readable.getReader();
  }

  async close() {
    await this.stream.return(null);
    this.reader?.releaseLock();
    await this.port.close();
  }

  readData(): AsyncGenerator<Sample> {
    this.stream = readDataStream(this);
    return this.stream;
  }
}

export const samples = writable<Array<Sample>>([]);

let connection;

const connectToSerialPort = async (): Promise<Connection> => {
  state.set(ConnectionState.connecting);
  connection = new Connection();
  await connection.setup();
  state.set(ConnectionState.connected);
  return connection;
};

const goReadData = async () => {
  try {
    for await (let newSample of connection.readData()) {
      samples.update(($samples) => [...$samples, newSample]);
    }
  } catch (err) {
    console.error(err);
  }
};

const closeConnection = async () => {
  state.set(ConnectionState.disconnecting)
  await connection.close();
  state.set(ConnectionState.disconnected);
};

const readDataStream = async function* (
  connection: Connection
): AsyncGenerator<Sample> {
  try {
    let firstSample = true;
    let str = "";
    let textDecoder = new TextDecoder();
    for (;;) {
      const { value, done } = await connection.reader.read();
      if (done) {
        break;
      }
      str += textDecoder.decode(value);
      const pos = str.indexOf("\n");
      if (pos !== -1) {
        const line = str.slice(0, pos);
        str = str.slice(pos + 2);
        const newSample: Sample = {
          timestamp: new Date(),
          values: line.split(",").map(Number),
        };
        if (!firstSample) {
          // avoid first sample (since it may be arduino serial buffer garbage)
          yield newSample;
        }
        firstSample = false;
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    connection.reader.releaseLock();
  }
};

export default {
  connectToSerialPort,
  goReadData,
  closeConnection,
};
