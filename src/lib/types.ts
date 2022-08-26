export interface Sample {
  timestamp: Date;
  values: number[];
}

export enum ConnectionState {
  disconnected,
  connecting,
  connected,
  starting,
  active,
  disconnecting,
  error,
}