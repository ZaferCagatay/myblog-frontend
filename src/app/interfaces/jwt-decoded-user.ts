export interface JwtDecodedUser {
  email: string;
  name: string;
  nameid: string;
  aud?: string;
  iss?: string;
  role: string[];
  nbf?: number;
  exp?: number;
  iat?: number;
}
