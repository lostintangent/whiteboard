import { WebviewPanel } from "vscode";
import * as vsls from "vsls";

import initializeBaseService, { SERVICE_NAME } from "./service";

export default async function(
  vslsApi: vsls.LiveShare,
  webviewPanel: WebviewPanel
) {
  const service = await vslsApi.shareService(SERVICE_NAME);
  if (!service) return;

  let getSnapshotResolve: any;
  service.onRequest("getSnapshot", () => {
    return new Promise(resolve => {
      getSnapshotResolve = resolve;
      webviewPanel.webview.postMessage({ command: "getSnapshot" });
    });
  });

  const baseService = initializeBaseService(
    vslsApi.session.peerNumber,
    service,
    webviewPanel,
    true
  );
  baseService.setCustomWebviewHandler((command: string, data: any) => {
    if (command === "snapshotResponse") {
      getSnapshotResolve({ data });
      return true;
    } else {
      return false;
    }
  });
}
