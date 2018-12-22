import * as vscode from 'vscode';
import * as vsls from "vsls/vscode";

import createWebView from "./webView.js";
import registerTreeDataProvider from "./treeDataProvider.js";

let webView: vscode.WebviewPanel;
export async function activate(context: vscode.ExtensionContext) {
	const vslsApi = await vsls.getApi();
	if (vslsApi) {
		registerTreeDataProvider(vslsApi);

		context.subscriptions.push(vscode.commands.registerCommand("liveshare.openWhiteboard", async () => {
			if (webView) {
				webView.reveal();
				return;
			}

			webView = createWebView(context);

			let { default: initializeService } = (vslsApi.session.role === vsls.Role.Host) ?
				require("./service/hostService") : 
				require("./service/guestService");

			await initializeService(vslsApi, webView.webview);
		}));
	}
}