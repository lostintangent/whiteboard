import { WebView } from "../webView";
import { SharedService, SharedServiceProxy } from "vsls/vscode";

interface Message {
    data?: any;
    peer?: number;
}

const NOTIFICATIONS = ["backgroundColorChange", "clear", "undo", "shapeSaved", "redo"];
export const SERVICE_NAME = "whiteboard";

export default function (peer: number, service: SharedService | SharedServiceProxy, webView: WebView) {
    NOTIFICATIONS.forEach((commandName) => {
        service.onNotify(commandName, (message: Message) => {
            if (message.peer === peer) return;
    
            webView.postMessage({ command: commandName, data: message.data });
        });
    });

    let handler: (command: string, data: any) => boolean;
    webView.onDidReceiveMessage(({ command, data }) => {
        if (handler && handler(command, data)) return;

        service.notify(command, { peer, data });
    });

    return {
        setCustomWebviewHandler(customHandler: (command: string, data: any) => boolean) {
            handler = customHandler;
        }
    }
}