import {
  Command,
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem
} from "vscode";
import { LiveShare, View } from "vsls";

export interface IWhiteboardTreeDataProvider extends TreeDataProvider<Command> {
  updateWhiteboardState(isDirty: boolean): void;
}

const LABEL_PREFIX = "Whiteboard";

class WhiteboardTreeDataProvider implements IWhiteboardTreeDataProvider {
  private _treeCommand: Command = {
    command: "liveshare.openWhiteboard",
    title: LABEL_PREFIX
  };

  private _onDidChangeTreeData = new EventEmitter<Command>();
  public readonly onDidChangeTreeData: Event<Command> = this
    ._onDidChangeTreeData.event;

  getChildren(element?: Command): ProviderResult<Command[]> {
    return Promise.resolve([this._treeCommand]);
  }

  getTreeItem(element: Command): TreeItem {
    const treeItem = new TreeItem(LABEL_PREFIX);
    treeItem.label = element.title;
    treeItem.contextValue = LABEL_PREFIX;
    treeItem.command = element;
    return treeItem;
  }

  updateWhiteboardState(isDirty: boolean) {
    const suffix = isDirty ? " (*)" : "";
    this._treeCommand.title = `${LABEL_PREFIX}${suffix}`;
    this._onDidChangeTreeData.fire(this._treeCommand);
  }
}

export default function(vslsApi: LiveShare) {
  const treeDataProvider = new WhiteboardTreeDataProvider();
  vslsApi.registerTreeDataProvider(View.Session, treeDataProvider);
  vslsApi.registerTreeDataProvider(View.ExplorerSession, treeDataProvider);

  return treeDataProvider;
}
