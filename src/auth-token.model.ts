export class AuthToken {
  accessToken: string = '';
  expiresAt: Date = new Date();

  constructor(accessToken: string, expiresAt: Date) {
    this.accessToken = accessToken;
    this.expiresAt = expiresAt;
  }
}
