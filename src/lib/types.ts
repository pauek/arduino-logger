export interface Sample {
  timestamp: Date;
  values: number[];
}

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