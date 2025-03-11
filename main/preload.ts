import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

window.onerror = function (message, source, lineno, colno, error) {
  console.error('Global error handler:', {
    message,
    source,
    lineno,
    colno,
    error,
  });
  // Prevent default popup
  return true;
};

window.onunhandledrejection = function (event) {
  console.error('Unhandled rejection:', event.reason);
  // Prevent default popup
  return true;
};


const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
