import { derived, writable } from "svelte/store";
import type { Sample } from "./types";

export enum ConnectionState {
  disconnected,
  connecting,
  connected,
  paused,
  starting,
  started,
  pausing,
  disconnecting,
}

let _state = ConnectionState.disconnected;
export const connectionState = writable<ConnectionState>(_state);

const setState = (s: ConnectionState) => {
  _state = s;
  console.log(ConnectionState[s]);
  connectionState.set(_state);
};
const stateIs = (s: ConnectionState) => _state === s;

let port: SerialPort = null;
let reader: ReadableStreamDefaultReader<Uint8Array> = null;
let stream: AsyncGenerator<Sample> = null;

export const samples = writable<Array<Sample>>([]);

const connect = async () => {
  setState(ConnectionState.connecting);
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });
  reader = port.readable.getReader();
  setState(ConnectionState.connected);
};

const start = async () => {
  if (stateIs(ConnectionState.paused)) {
    setState(ConnectionState.starting);
    await port.open({ baudRate: 9600 });
    reader = port.readable.getReader();
    goReadData();
  }
};

const pause = async () => {
  if (stateIs(ConnectionState.started)) {
    setState(ConnectionState.pausing);
    await stream.return(null);
    reader?.releaseLock();
    reader = null;
    await port.close();
    setState(ConnectionState.paused);
  }
};

const close = async () => {
  if (stateIs(ConnectionState.started) || stateIs(ConnectionState.paused)) {
    setState(ConnectionState.disconnecting);
    await stream.return(null);
    stream = null;
    reader?.releaseLock();
    reader = null;
    if (stateIs(ConnectionState.started)) {
      await port.close();
      port = null;
    }
    setState(ConnectionState.disconnected);
  }
};

const goReadData = async () => {
  try {
    stream = readDataStream();
    setState(ConnectionState.started);
    for await (let newSample of stream) {
      samples.update(($samples) => [...$samples, newSample]);
    }
  } catch (err) {
    console.error(err);
  }
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
  connect,
  goReadData,
  close,
  pause,
  start,
};
