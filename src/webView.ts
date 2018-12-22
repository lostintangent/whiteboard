import * as path from "path";
import * as vscode from "vscode";

export interface WebView {
    onDidReceiveMessage: vscode.Event<any>;
    postMessage: (message: any) => Thenable<any>;
}

export default function (context: vscode.ExtensionContext): WebView {
    const staticResourcePath = path.join(context.extensionPath, "static");
    const webViewBaseUri = vscode.Uri.file(staticResourcePath).with({ scheme: "vscode-resource" });

    const panel = vscode.window.createWebviewPanel("vsls-whiteboard", "Live Share Whiteboard", vscode.ViewColumn.Active, {
        enableScripts: true,
        localResourceRoots: [webViewBaseUri],
        retainContextWhenHidden: true
    });

    panel.webview.html = getWebViewContents(webViewBaseUri);
    return panel.webview;
}

function getWebViewContents(webViewBaseUri: vscode.Uri): string {
    return `<!DOCTYPE html>
<html>
	<head>
		<base href="${webViewBaseUri.toString()}/" />
        <link href="literallycanvas/css/literallycanvas.css" rel="stylesheet" />
        <link href="index.css" rel="stylesheet" />

		<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-with-addons.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.js"></script>
		<script src="literallycanvas/js/literallycanvas.js"></script>
	</head>
	<body>
		<div id="whiteboard"></div>
		<script src="index.js"></script>
	</body>
</html>`;
}