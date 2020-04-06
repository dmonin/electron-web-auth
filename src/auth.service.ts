import { BrowserWindow, ipcMain } from 'electron';
import { AuthToken } from './auth-token.model';
import { EventEmitter } from 'events';
import * as storage from 'electron-json-storage';

export class AuthService extends EventEmitter {
  token?: AuthToken;
  authWindow?: BrowserWindow;
  authUrl: string;

  constructor(authUrl: string) {
    super();

    this.authUrl = authUrl;

    ipcMain.on('auth-complete', this.handleAuthComplete.bind(this));
  }

  authorize(): void {
    storage.get('token', (err: any, tokenData: any) => {
      if (tokenData && tokenData['accessToken']) {
        const token: AuthToken = new AuthToken(tokenData['accessToken'],
          new Date(tokenData['expiresAt']));

        if (!token.isExpired()) {
          this.token = token;
          this.emit('auth', this.token);
          return;
        }
      }

      this.createWindow();
    });

    ipcMain.on('get-auth-token', (evt: any, data: any) => {
      const win = evt.sender as BrowserWindow;
      if (this.token) {
        win.webContents.send('auth-token', this.token.accessToken);
      } else {
        win.webContents.send('auth-token', null);
      }
    });
  }

  handleAuthComplete(evt: any, tokenData: any): void {
    if (tokenData) {
      this.token = new AuthToken(tokenData.accessToken, new Date(tokenData.expiresAt));
      storage.set('token', this.token, (err: any) => {
        //
      });
    }

    if (this.authWindow && this.token) {
      this.authWindow.close();
      this.emit('auth', this.token);
    }
  }

  private createWindow(): void {
    this.authWindow = new BrowserWindow({
      height: 600,
      width: 600,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      }
    });

    this.authWindow.loadURL(this.authUrl);
  }
}
