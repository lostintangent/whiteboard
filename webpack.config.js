const path = require("path");

module.exports = {
  entry: "./src/extension.ts",
  devtool: "source-map",
  mode: "development",
  target: "node",
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  externals: {
    vscode: "commonjs vscode"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "bundle.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
    devtoolModuleFilenameTemplate: "file:///[absolute-resource-path]"
  }
};
