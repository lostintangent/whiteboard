import { WebviewPanel } from "vscode";
import { SharedService, SharedServiceProxy } from "vsls";

interface Message {
  data?: any;
  peer?: number;
}

interface WebviewMessage {
  command: string;
  data: any;
}

const NOTIFICATIONS = [
  "backgroundColorChange",
  "clear",
  "undo",
  "shapeSaved",
  "redo"
];

export const SERVICE_NAME = "whiteboard";

const pendingWebviewMessages: WebviewMessage[] = [];

export default function(
  peer: number,
  service: SharedService | SharedServiceProxy,
  webviewPanel: WebviewPanel,
  broadcastNotifications: boolean = false
) {
  NOTIFICATIONS.forEach(commandName => {
    service.onNotify(commandName, (message: Message) => {
      if (message.peer === peer) return;

      const webviewMessage = {
        command: commandName,
        data: message.data
      };

      if (webviewPanel.visible) {
        webviewPanel.webview.postMessage(webviewMessage);
      } else {
        pendingWebviewMessages.push(webviewMessage);
      }

      if (broadcastNotifications) {
        service.notify(commandName, message);
      }
    });
  });

  webviewPanel.onDidChangeViewState(e => {
    if (e.webviewPanel.visible) {
      let message;
      while ((message = pendingWebviewMessages.shift())) {
        webviewPanel.webview.postMessage(message);
      }
    }
  });

  let handler: (command: string, data: any) => boolean;
  webviewPanel.webview.onDidReceiveMessage(({ command, data }) => {
    if (handler && handler(command, data)) return;

    service.notify(command, { peer, data });
  });

  return {
    setCustomWebviewHandler(
      customHandler: (command: string, data: any) => boolean
    ) {
      handler = customHandler;
    }
  };
}
