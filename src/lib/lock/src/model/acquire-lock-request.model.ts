export interface AcquireLockRequest {
  resource_id: string[];
  type: string;
  reset_enabled: boolean;
}
