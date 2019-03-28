import * as path from "path";
import * as vscode from "vscode";

export default function(context: vscode.ExtensionContext): vscode.WebviewPanel {
  const staticResourcePath = path.join(context.extensionPath, "static");
  const webViewBaseUri = vscode.Uri.file(staticResourcePath).with({
    scheme: "vscode-resource"
  });

  let webviewTitle = "Live Share Whiteboard";
  const panel = vscode.window.createWebviewPanel(
    "vsls-whiteboard",
    "Live Share Whiteboard",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      localResourceRoots: [webViewBaseUri],
      retainContextWhenHidden: true
    }
  );

  panel.webview.html = getWebViewContents(webViewBaseUri);
  return panel;
}

function getWebViewContents(webViewBaseUri: vscode.Uri): string {
  return `<!DOCTYPE html>
<html>
	<head>
		<base href="${webViewBaseUri.toString()}/" />
        <link href="literallycanvas/literallycanvas.css" rel="stylesheet" />
        <link href="index.css" rel="stylesheet" />

		<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-with-addons.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.js"></script>
		<script src="literallycanvas/literallycanvas.js"></script>
	</head>
	<body>
		<div id="whiteboard"></div>
		<script src="index.js"></script>
	</body>
</html>`;
}
