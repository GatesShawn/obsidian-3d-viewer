import {App, Editor, MarkdownView, Modal, Notice, Plugin, FuzzySuggestModal, TFile} from 'obsidian';
import {DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab} from "./settings";
import { main } from './webgl';
import { STLHandler } from './STLHandler';

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('box', 'Load STL', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new STLFilePickerModal(this.app).open();
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status bar text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-modal-simple',
			name: 'Open modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		// Command to load STL files
		this.addCommand({
			id: 'load-stl-file',
			name: 'Load STL File',
			callback: () => {
				new STLFilePickerModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'replace-selected',
			name: 'Replace selected content',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection('Sample editor command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-modal-complex',
			name: 'Open modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
				return false;
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			new Notice("Click");
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
		// main(); // Commented out to fix build error
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class STLFilePickerModal extends FuzzySuggestModal<TFile> {
	constructor(app: App) {
		super(app);
		this.setPlaceholder("Select an STL file...");
	}

	getItems(): TFile[] {
		return this.app.vault.getFiles().filter(file => file.extension === 'stl');
	}

	getItemText(file: TFile): string {
		return file.path;
	}

	onChooseItem(file: TFile, evt: MouseEvent | KeyboardEvent) {
		new STLViewerModal(this.app, file).open();
	}
}

class STLViewerModal extends Modal {
	private canvas: HTMLCanvasElement;
	private file: TFile;

	constructor(app: App, file: TFile) {
		super(app);
		this.file = file;
	}

	async onOpen() {
		const {contentEl} = this;
		contentEl.empty();

		contentEl.createEl('h2', {text: `Viewing: ${this.file.name}`});

		this.canvas = contentEl.createEl('canvas', {
			attr: {
				width: '800',
				height: '600',
				style: 'border: 1px solid #ccc; display: block; margin: 10px auto;'
			}
		});

		try {
			const data = await this.app.vault.adapter.readBinary(this.file.path);
			const geometry = STLHandler.parseSTL(data);
			
			// Render the 3D model
			main(this.canvas, geometry.vertices, geometry.indices);
			
		} catch (error) {
			contentEl.createEl('p', {text: `Error loading STL file: ${(error as Error).message}`});
		}
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
