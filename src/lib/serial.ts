import { derived, writable } from "svelte/store";
import type { Sample } from "./types";

export enum ConnectionState {
  disconnected,
  connecting,
  connected,
  active,
  paused,
  disconnecting,
}

let _state = ConnectionState.disconnected;
export const connectionState = writable<ConnectionState>(_state);

const setState = (s: ConnectionState) => {
  _state = s;
  connectionState.set(_state);
}
const stateIs = (s: ConnectionState) => _state === s;

let port: SerialPort = null;
let reader: ReadableStreamDefaultReader<Uint8Array> = null;
let stream: AsyncGenerator<Sample> = null;

const setup = async () => {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });
  reader = port.readable.getReader();
};

const close = async () => {
  if (stateIs(ConnectionState.active)) {
    await stream.return(null);
    reader?.releaseLock();
    await port.close();
  }
};

export const samples = writable<Array<Sample>>([]);

const connectToSerialPort = async () => {
  setState(ConnectionState.connecting);
  await setup();
  setState(ConnectionState.connected);
};

const goReadData = async () => {
  try {
    for await (let newSample of readDataStream()) {
      samples.update(($samples) => [...$samples, newSample]);
    }
  } catch (err) {
    console.error(err);
  }
};

const closeConnection = async () => {
  setState(ConnectionState.disconnecting);
  await close();
  setState(ConnectionState.disconnected);
};

const readDataStream = async function* (): AsyncGenerator<Sample> {
  try {
    let firstSample = true;
    let str = "";
    let textDecoder = new TextDecoder();
    for (;;) {
      const { value, done } = await reader.read();
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
    reader.releaseLock();
  }
};

export default {
  connectToSerialPort,
  goReadData,
  closeConnection,
};
