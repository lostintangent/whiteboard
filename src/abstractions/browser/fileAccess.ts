import { Uri } from 'vscode';

class FileAccess {
    public writeFile(uri: Uri, data: any): Promise<void> {
        throw new Error('not supported in browser');
    }
}

export const fileAccess = new FileAccess();