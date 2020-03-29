export class AuthToken {
  accessToken: string;
  expiresAt: Date;

  constructor(accessToken: string, expiresAt: Date) {
    this.accessToken = accessToken;
    this.expiresAt = expiresAt;
  }

  isExpired() {
    return +new Date() > this.expiresAt.getTime();
  }

  valueOf(): string {
    return this.accessToken;
  }

  toString(): string {
    return this.accessToken;
  }
}
