
export interface UserInfoResponse {
  name: string;
  sub: string;
  emailVerified: boolean;
  issuer: string | null;
  branchName: string;
  preferredUsername: string;
  nonce: string;
  sid: string;
  branchCode: string;
  audience: string[];
  acr: string;
  azp: string;
  authTime: string;
  fullName: string;
  position: string;
  expiration: string;
  sessionState: string;
  issuedAt: string;
  jti: string;
  authorities: string[];
  username: string;
  email: string | null;
  roles: string[];
  lotusRoles: string[];
  // API returns the versioned JSON string. `unknown` also permits the old object
  // shape during a no-downtime backend migration.
  customizer?: unknown
}
