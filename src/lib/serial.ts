import { writable } from "svelte/store";
import { ConnectionState, type Sample } from "./types";
import db from './db';

let _state = ConnectionState.disconnected;
export const connectionState = writable<ConnectionState>(_state);
export const errorMessage = writable<String>(null);

const setState = (s: ConnectionState) => {
  _state = s;
  console.log(ConnectionState[s]);
  connectionState.set(_state);
};
const stateIs = (s: ConnectionState) => _state === s;

let port: SerialPort = null;
let reader: ReadableStreamDefaultReader<Uint8Array> = null;
let stream: AsyncGenerator<Sample> = null;

const connect = async () => {
  setState(ConnectionState.connecting);
  if (port === null) {
    port = await navigator.serial.requestPort();
  }
  if (!port.readable) {
    await port.open({ baudRate: 9600 });
  }
  reader = port.readable.getReader();
  setState(ConnectionState.connected);
};

const close = async () => {
  if (stateIs(ConnectionState.active)) {
    setState(ConnectionState.disconnecting);
    await stream.return(null);
    stream = null;
    reader?.releaseLock();
    reader = null;
    if (stateIs(ConnectionState.active)) {
      await port.close();
    }
    setState(ConnectionState.disconnected);
  }
};

const goReadData = async () => {
  try {
    stream = readDataStream();
    setState(ConnectionState.active);
    for await (let newSample of stream) {
      db.addSample(newSample);
    }
  } catch (err) {
    setState(ConnectionState.error);
    errorMessage.set(`Cannot read from serial port: ${err.toString()}`);
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
};
