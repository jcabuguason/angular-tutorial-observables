export interface AuthResponse {
  errorMesages: String[];
  isUserAuthenticated: boolean;
  user_fullname: string;
  user_role: string;
  username: string;
}
