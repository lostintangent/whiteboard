import * as vscode from "vscode";

declare module 'vscode' {
  //#region https://github.com/microsoft/vscode/issues/90208

  export interface ExtensionContext {
		/**
		 * Get the uri of a resource contained in the extension.
		 *
		 * @param relativePath A relative path to a resource contained in the extension.
		 * @return The uri of the resource.
		 */
    asExtensionUri(relativePath: string): Uri;
  }

  //#endregion
}

function isNode(): boolean {
  return (typeof process !== 'undefined') && (typeof process.release !== 'undefined') && (process.release.name === 'node');
}

function getExtensionUri(context: vscode.ExtensionContext, relativePath: string): vscode.Uri {
  // Returns extension uri if this method is supported by VS Code.
  // Otherwise returns the absolute path as a Uri
  return context.asExtensionUri ?
    context.asExtensionUri(relativePath) :
    vscode.Uri.file(context.asAbsolutePath(relativePath));
}

export function createWebView(context: vscode.ExtensionContext): vscode.WebviewPanel {
  let staticResourcePathUri = getExtensionUri(context, 'static');

  if (isNode()) {
    staticResourcePathUri = staticResourcePathUri.with({
      scheme: "vscode-resource"
    });
  }

  const panel = vscode.window.createWebviewPanel(
    "vsls-whiteboard",
    "Live Share Whiteboard",
    vscode.ViewColumn.Active,
    {
      enableScripts: true,
      localResourceRoots: [staticResourcePathUri],
      retainContextWhenHidden: true
    }
  );

  panel.webview.html = getWebViewContents(staticResourcePathUri);
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
