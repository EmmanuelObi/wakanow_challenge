export interface UserDetails {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  admin: boolean;
  approved?: boolean;
  tempKey?: string | null;
}
