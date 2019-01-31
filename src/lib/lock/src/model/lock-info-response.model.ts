export interface LockInfoResponse {
  resource_id: string;
  type: string;
  user: string;
  user_first_name: string;
  user_last_name: string;
  timeout: string; // TODO: Date Obj?
}
