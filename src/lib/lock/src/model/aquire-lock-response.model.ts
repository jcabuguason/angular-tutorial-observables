export interface AquireLockResponse {
  locked_resources: string[];
  type: string;
  user: string;
  timeout: string; // TODO: Date object?
}
