import { Uri } from 'vscode';
import * as fs from "fs";

class FileAccess {
    public writeFile(uri: Uri, data: any): Promise<void> {
        return new Promise(function (resolve, reject) {
            fs.writeFile(uri.toString().replace("file://", ""), data, function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

export const fileAccess = new FileAccess();