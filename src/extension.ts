import * as fs from "fs";
import * as vscode from "vscode";
import * as vsls from "vsls";

import { createWebView } from "./webView";
import { registerTreeDataProvider } from "./treeDataProvider";

export async function activate(context: vscode.ExtensionContext) {
  const vslsApi = (await vsls.getApi())!;
  registerTreeDataProvider(vslsApi);

  let webviewPanel: vscode.WebviewPanel | null;
  console.log("test");
  context.subscriptions.push(
    vscode.commands.registerCommand("liveshare.openWhiteboard", async () => {
      if (webviewPanel) {
        return webviewPanel.reveal();
      } else {
        webviewPanel = createWebView(context);

        // If the end-user closes the whiteboard, then we
        // need to ensure we re-created it on the next click.
        webviewPanel.onDidDispose(() => {
          webviewPanel = null;
        });
      }

      let { default: initializeService } =
        vslsApi.session.role === vsls.Role.Host
          ? require("./service/hostService")
          : require("./service/guestService");

      await initializeService(vslsApi, webviewPanel);
    })
  );

  vslsApi!.onDidChangeSession(e => {
    // If there isn't a session ID, then that
    // means the session has been ended.
    if (!e.session.id && webviewPanel) {
      webviewPanel.dispose();
    }
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("liveshare.saveWhiteboard", async () => {
      if (webviewPanel) {
        const uri = await vscode.window.showSaveDialog({
          filters: {
            SVG: ["svg"]
          }
        });
        if (!uri) return;

        webviewPanel.webview.onDidReceiveMessage(({ command, data }) => {
          if (command === "snapshotSVGResponse") {
            fs.writeFileSync(uri.toString().replace("file://", ""), data);
          }
        });
        await webviewPanel.webview.postMessage({ command: "getSnapshotSVG" });
      }
    })
  );
}
