import { WebviewPanel } from "vscode";
import * as vsls from "vsls";

import initializeBaseService, { SERVICE_NAME } from "./service";
import { IWhiteboardTreeDataProvider } from "../treeDataProvider";

export default async function(
  vslsApi: vsls.LiveShare,
  webviewPanel: WebviewPanel,
  treeDataProvider: IWhiteboardTreeDataProvider
) {
  const service = await vslsApi.getSharedService(SERVICE_NAME);
  if (!service) return;

  setTimeout(async () => {
    const { data } = await service.request("getSnapshot", []);
    webviewPanel.webview.postMessage({ command: "loadSnapshot", data });
  }, 500);

  initializeBaseService(
    vslsApi.session.peerNumber,
    service,
    webviewPanel,
    treeDataProvider
  );
}
