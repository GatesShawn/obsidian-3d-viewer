import { FileView } from "obsidian";

class MyFileView extends FileView {
    getViewType(): string {
        return "my-file-view";
    }
}