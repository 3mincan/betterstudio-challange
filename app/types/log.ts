export interface Log {
  timestamp: string;
  event: string;
  type: string;
  message: string;
  id: string;
}

export interface LogsClientProps {
  initialLogs: Log[];
}
