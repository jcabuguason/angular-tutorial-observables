export interface AquireLockRequest {
  resource_id: string[];
  type: string;
  reset_enabled: boolean;
}
