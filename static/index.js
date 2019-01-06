const vscode = acquireVsCodeApi();
const whiteboardElement = document.getElementById("whiteboard");

const lc = LC.init(whiteboardElement, {
  backgroundColor: "#fff",
  imageURLPrefix: "literallycanvas/images"
});

const REMOTE_MESSAGE_HANDLERS = {
  backgroundColorChange(color) {
    lc.setColor("background", color, false);
  },
  clear() {
    lc.clear(false);
  },
  getSnapshot() {
    const snapshot = lc.getSnapshot(["shapes", "colors"]);
    vscode.postMessage({
      command: "snapshotResponse",
      data: JSON.stringify(snapshot)
    });
  },
  getSnapshotSVG() {
    const snapshot = lc.getSnapshot(["shapes", "colors"]);
    const snapshopSVG = LC.renderSnapshotToSVG(snapshot);
    vscode.postMessage({
      command: "snapshotSVGResponse",
      data: snapshopSVG
    });
  },
  loadSnapshot(snapshot) {
    const snapshotObject = JSON.parse(snapshot);
    lc.loadSnapshot(snapshotObject);
  },
  shapeSaved(shape) {
    const shapeObject = LC.JSONToShape(JSON.parse(shape));
    lc.saveShape(shapeObject, false);
  },
  redo() {
    lc.redo(false);
  },
  undo() {
    lc.undo(false);
  }
};

function initializeLocalHandlers() {
  lc.on("shapeSave", ({ shape }) => {
    vscode.postMessage({
      command: "shapeSaved",
      data: JSON.stringify(LC.shapeToJSON(shape))
    });
  });

  ["backgroundColorChange", "clear", "undo", "redo"].forEach(command => {
    lc.on(command, args => {
      // TODO: Clean up this logic
      let data;
      if (args && !args.action) {
        data = args;
      }
      vscode.postMessage({ command, data });
    });
  });
}

initializeLocalHandlers();

window.addEventListener("message", ({ data: message }) => {
  REMOTE_MESSAGE_HANDLERS[message.command](message.data);
});
