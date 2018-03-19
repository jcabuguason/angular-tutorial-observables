export interface AuthResponse {
  errorMesages: String[];
  isUserAuthenticated: boolean;
  session: AuthSession;
  user_fullname: string;
  user_role: string;
  username: string;
}

export interface AuthSession {
  shouldRegister: boolean;
  username: string;
  domain: string;
  first_name: string;
  last_name: string;
  other_info: string;
  groups: AuthGroup[];
}

export interface AuthGroup {
  affected_by_datasets: string[];
  owned_datasets: string[];
  en_name: string;
  fr_name: string;
  role: string;
  uri: string;
}
