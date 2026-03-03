import { Plugin } from 'obsidian';

export default class Viewer3D extends Plugin {
    async onload() {
        console.log('loading plugin')
    }
    async onunload() {
        console.log('unloading plugin')
    }
}