import * as vscode from 'vscode';
import * as vsls from "vsls/vscode";

import createWebView from "./webView.js";
import registerTreeDataProvider from "./treeDataProvider.js";

export async function activate(context: vscode.ExtensionContext) {
	const vslsApi = await vsls.getApi();
	if (vslsApi) {
		registerTreeDataProvider(vslsApi);

		context.subscriptions.push(vscode.commands.registerCommand("liveshare.openWhiteboard", async () => {
			const webView = createWebView(context);

			let { default: initializeService } = (vslsApi.session.role === vsls.Role.Host) ?
				require("./service/hostService") : 
				require("./service/guestService");

			await initializeService(vslsApi, webView);
		}));
	}
}