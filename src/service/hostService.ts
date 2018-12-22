import { WebView } from "../webView";
import * as vsls from "vsls/vscode";

import initializeBaseService, { SERVICE_NAME } from "./service";

export default async function (vslsApi: vsls.LiveShare, webView: WebView) {              
    const service = await vslsApi.shareService(SERVICE_NAME); 
    if (!service) return;

    let getSnapshotResolve: any;
    service.onRequest("getSnapshot", () => {
        return new Promise((resolve) => {
            getSnapshotResolve = resolve;
            webView.postMessage({ command: "getSnapshot" });
        })
    });

    const baseService = initializeBaseService(vslsApi.session.peerNumber, service, webView);
    baseService.setCustomWebviewHandler((command: string, data: any) => {
        if (command === "snapshotResponse") {
            getSnapshotResolve({ data });
            return true;
        } else {
            return false;
        }
    });
}