export interface AcquireLockResponse {
  locked_resources: string[];
  type: string;
  user: string;
  timeout: string; // TODO: Date object?
}
