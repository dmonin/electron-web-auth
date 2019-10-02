import { ipcRenderer } from 'electron';

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electronService: any = {
  getAuthToken: (callback: (token: string) => void) => {
    ipcRenderer.once('auth-token', (sender: any, authToken: string) => {
      callback(authToken);
    });

    ipcRenderer.send('get-auth-token');
  }
};

interface Window {
  [key: string]: any; // Add index signature
}

export const registerWebService = (win: Window) => {
  win['ElectronService'] = electronService;
  console.log('registered!');
}
