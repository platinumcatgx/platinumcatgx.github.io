/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class GhostFocusSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        this.containerEl.createEl('h1', { text: 'Ghost Fade Focus settings' });
        new obsidian.Setting(containerEl)
            .setName("Enable Ghost Fade Focus")
            .setDesc("Toggles the fade; using command palette or shortcut toggles this same value.")
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.enabled)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.enabled = value;
            yield this.plugin.saveSettings();
            this.plugin.removeGhostFadeFocusClassNamesFromCMs();
            if (value) {
                this.plugin.addGhostFadeFocusClassNamesToCMs();
            }
        })));
        this.containerEl.createEl('h2', { text: 'Opacity' });
        this.containerEl.createEl('p', { text: 'These will change the opacity levels used.' });
        let opacityLevel1;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 1")
            .setDesc("(Default 0.85)")
            .addSlider(slider => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_1)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel1.innerText = " " + value.toString();
            this.plugin.settings.opacity_1 = value;
            this.plugin.rootElement.style.setProperty('--ghost-fade-focus-opacity-1', `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv('', (el) => {
            opacityLevel1 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_1.toString();
        });
        let opacityLevel2;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 2")
            .setDesc("(Default 0.7)")
            .addSlider(slider => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_2)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel2.innerText = " " + value.toString();
            this.plugin.settings.opacity_2 = value;
            this.plugin.rootElement.style.setProperty('--ghost-fade-focus-opacity-2', `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv('', (el) => {
            opacityLevel2 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_2.toString();
        });
        let opacityLevel3;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 3")
            .setDesc("(Default 0.55)")
            .addSlider(slider => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_3)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel3.innerText = " " + value.toString();
            this.plugin.settings.opacity_3 = value;
            this.plugin.rootElement.style.setProperty('--ghost-fade-focus-opacity-3', `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv('', (el) => {
            opacityLevel3 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_3.toString();
        });
        let opacityLevel4;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 4")
            .setDesc("(Default 0.4)")
            .addSlider(slider => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_4)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel4.innerText = " " + value.toString();
            this.plugin.settings.opacity_4 = value;
            this.plugin.rootElement.style.setProperty('--ghost-fade-focus-opacity-4', `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv('', (el) => {
            opacityLevel4 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_4.toString();
        });
        let opacityLevel5;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 5")
            .setDesc("(Default 0.25)")
            .addSlider(slider => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_5)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel5.innerText = " " + value.toString();
            this.plugin.settings.opacity_5 = value;
            this.plugin.rootElement.style.setProperty('--ghost-fade-focus-opacity-5', `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv('', (el) => {
            opacityLevel5 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_5.toString();
        });
        let opacityLevel;
        new obsidian.Setting(containerEl)
            .setName("Opacity level outside of 5 steps")
            .setDesc("(Default 0.1)")
            .addSlider(slider => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel.innerText = " " + value.toString();
            this.plugin.settings.opacity = value;
            this.plugin.rootElement.style.setProperty('--ghost-fade-focus-opacity', `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv('', (el) => {
            opacityLevel = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity.toString();
        });
    }
}

let pluginState = {};
const setState = (key, value) => {
    pluginState = Object.assign(Object.assign({}, pluginState), { [key.valueOf()]: value });
};
const DEFAULT_SETTINGS = {
    enabled: false,
    opacity_1: 0.85,
    opacity_2: 0.7,
    opacity_3: 0.55,
    opacity_4: 0.4,
    opacity_5: 0.25,
    opacity: 0.1,
};
class GhostFocusPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.onCursorActivity = (cm) => {
            if (this.settings.enabled) {
                const currentCursorPos = cm.getDoc().getCursor();
                if (pluginState.currentLine !== currentCursorPos.line) {
                    setState("currentLine", currentCursorPos.line);
                    this.removeGhostFadeFocusClassNames(cm);
                    this.addGhostFadeFocusClassNames(cm);
                }
            }
        };
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign(DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    onFileChange() {
        if (this.settings.enabled) {
            this.addGhostFadeFocusClassNamesToCMs();
        }
    }
    addCSSVariables() {
        this.rootElement = document.documentElement;
        this.rootElement.style.setProperty('--ghost-fade-focus-opacity-1', `${this.settings.opacity_1}`);
        this.rootElement.style.setProperty('--ghost-fade-focus-opacity-2', `${this.settings.opacity_2}`);
        this.rootElement.style.setProperty('--ghost-fade-focus-opacity-3', `${this.settings.opacity_3}`);
        this.rootElement.style.setProperty('--ghost-fade-focus-opacity-4', `${this.settings.opacity_4}`);
        this.rootElement.style.setProperty('--ghost-fade-focus-opacity-5', `${this.settings.opacity_5}`);
        this.rootElement.style.setProperty('--ghost-fade-focus-opacity', `${this.settings.opacity}`);
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new GhostFocusSettingTab(this.app, this));
            this.registerEvent(this.app.workspace.on("file-open", this.onFileChange.bind(this)));
            pluginState = { currentLine: -1 };
            this.addCommand({
                id: "toggle-plugin",
                name: "Toggle plugin on/off",
                checkCallback: (checking) => {
                    const mdView = this.app.workspace.activeLeaf.view;
                    if (mdView && mdView.getMode() === "source") {
                        if (!checking) {
                            this.settings.enabled = !this.settings.enabled;
                            this.saveSettings();
                            this.removeGhostFadeFocusClassNamesFromCMs();
                            if (this.settings.enabled) {
                                this.addGhostFadeFocusClassNamesToCMs();
                            }
                        }
                        return true;
                    }
                    return false;
                },
            });
            this.registerCodeMirror((cm) => {
                cm.on("cursorActivity", this.onCursorActivity);
            });
            this.addCSSVariables();
        });
    }
    addGhostFadeFocusClassNamesToCMs() {
        this.app.workspace.iterateCodeMirrors((cm) => {
            this.addGhostFadeFocusClassNames(cm);
        });
    }
    addGhostFadeFocusClassNames(cm) {
        const totalLines = cm.lineCount();
        const currentCursorPosLine = cm.getDoc().getCursor().line;
        for (let i = -5; i <= 5; i++) {
            const lineNumber = currentCursorPosLine + i;
            if (lineNumber >= 0 && lineNumber < totalLines) {
                if (i === 0) {
                    cm.addLineClass(lineNumber, "wrap", "CodeMirror-activeline");
                }
                else {
                    if (this.settings.enabled) {
                        cm.addLineClass(lineNumber, "wrap", `ghost-fade-focus--${Math.abs(i)}`);
                    }
                }
            }
        }
        for (let i = 0; i < totalLines; i++) {
            if (i !== currentCursorPosLine) {
                cm.addLineClass(i, "wrap", "ghost-fade-focus");
            }
        }
    }
    removeGhostFadeFocusClassNamesFromCMs() {
        this.app.workspace.iterateCodeMirrors((cm) => {
            this.removeGhostFadeFocusClassNames(cm);
        });
    }
    removeGhostFadeFocusClassNames(cm) {
        for (let i = 0; i < cm.lineCount(); i++) {
            cm.removeLineClass(i, "wrap");
            if (i === cm.getDoc().getCursor().line) {
                cm.addLineClass(i, "wrap", "CodeMirror-activeline");
            }
        }
    }
    removeCSSVariables() {
        this.rootElement = document.documentElement;
        this.rootElement.style.removeProperty('--ghost-fade-focus-opacity-1');
        this.rootElement.style.removeProperty('--ghost-fade-focus-opacity-2');
        this.rootElement.style.removeProperty('--ghost-fade-focus-opacity-3');
        this.rootElement.style.removeProperty('--ghost-fade-focus-opacity-4');
        this.rootElement.style.removeProperty('--ghost-fade-focus-opacity-5');
        this.rootElement.style.removeProperty('--ghost-fade-focus-opacity');
    }
    onunload() {
        this.app.workspace.iterateCodeMirrors((cm) => {
            cm.off("cursorActivity", this.onCursorActivity);
            this.removeGhostFadeFocusClassNames(cm);
        });
        this.removeCSSVariables();
    }
}

module.exports = GhostFocusPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zZXR0aW5ncy50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxF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
