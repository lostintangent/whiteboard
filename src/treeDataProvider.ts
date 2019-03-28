import { Command, ProviderResult, TreeDataProvider, TreeItem } from "vscode";
import { LiveShare, View } from "vsls";

const DATA_PROVIDER: TreeDataProvider<Command> = {
  getChildren(element?: Command): ProviderResult<Command[]> {
    return Promise.resolve([
      {
        command: "liveshare.openWhiteboard",
        title: "Whiteboard"
      }
    ]);
  },
  getTreeItem(element: Command): TreeItem {
    const treeItem = new TreeItem("Whiteboard");
    treeItem.contextValue = "whiteboard";
    treeItem.command = element;
    return treeItem;
  }
};

export function registerTreeDataProvider(vslsApi: LiveShare) {
  vslsApi.registerTreeDataProvider(View.Session, DATA_PROVIDER);
  vslsApi.registerTreeDataProvider(View.ExplorerSession, DATA_PROVIDER);
}
