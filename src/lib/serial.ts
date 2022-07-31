import type { Sample } from "./types";

export class Connection {
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

export const connectToSerialPort = async (): Promise<Connection> => {
  const connection = new Connection();
  await connection.setup();
  return connection;
};

export const readDataStream = async function* (
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
