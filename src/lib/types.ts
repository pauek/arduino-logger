export interface Sample {
  timestamp: Date;
  values: number[];
  file?: string;
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