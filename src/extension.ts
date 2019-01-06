import * as fs from "fs";
import * as vscode from "vscode";
import * as vsls from "vsls";

import createWebView from "./webView";
import registerTreeDataProvider from "./treeDataProvider";

export async function activate(context: vscode.ExtensionContext) {
  const vslsApi = await vsls.getApi();
  registerTreeDataProvider(vslsApi!);

  let webView: vscode.WebviewPanel | null;
  context.subscriptions.push(
    vscode.commands.registerCommand("liveshare.openWhiteboard", async () => {
      if (webView) {
        return webView.reveal();
      } else {
        webView = createWebView(context);

        // If the end-user closes the whiteboard, then we
        // need to ensure we re-created it on the next click.
        webView.onDidDispose(() => (webView = null));
      }

      let { default: initializeService } =
        vslsApi!.session.role === vsls.Role.Host
          ? require("./service/hostService")
          : require("./service/guestService");

      await initializeService(vslsApi, webView.webview);
    })
  );

  vslsApi!.onDidChangeSession(e => {
    // If there isn't a session ID, then that
    // means the session has been ended.
    if (!e.session.id && webView) {
      webView.dispose();
    }
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("liveshare.saveWhiteboard", async () => {
      if (webView) {
        const uri = await vscode.window.showSaveDialog({
          filters: {
            SVG: ["svg"]
          }
        });
        if (!uri) return;

        webView.webview.onDidReceiveMessage(({ command, data }) => {
          if (command === "snapshotSVGResponse") {
            fs.writeFileSync(uri.toString().replace("file://", ""), data);
          }
        });
        await webView.webview.postMessage({ command: "getSnapshotSVG" });
      }
    })
  );
}
