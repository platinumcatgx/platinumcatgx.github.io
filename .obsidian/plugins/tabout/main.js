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

class RuleEditModal extends obsidian.Modal {
    constructor(plugin, rule, idx) {
        super(plugin.app);
        this.plugin = plugin;
        this.rule = rule;
        this.idx = idx;
    }
    onOpen() {
        let { contentEl } = this;
        contentEl.empty();
        new obsidian.Setting(contentEl)
            .setName("Environment")
            .setClass("tabout-match-text")
            .setDesc("The Codemirror Token for the Environment.")
            .addText(text => {
            text
                .setValue(this.rule.tokenMatcher)
                .setPlaceholder("em")
                .onChange(value => {
                this.rule.tokenMatcher = value;
            });
        });
        new obsidian.Setting(contentEl)
            .setName("Jump after the Characters")
            .setClass("tabout-match-text")
            .setDesc("If enabled the Cursor will be set after the Characters, otherwise before them.")
            .addToggle(toggle => {
            toggle
                .setValue(this.rule.jumpAfter)
                .onChange(value => {
                this.rule.jumpAfter = value;
            });
        });
        this.rule.lookups.forEach((jumpChar, idx) => {
            new obsidian.Setting(contentEl)
                .setName(idx === 0 ? "Characters" : "")
                .setClass("tabout-jump-char")
                .addExtraButton(btn => {
                btn
                    .setIcon("trash")
                    .onClick(() => {
                    this.rule.lookups.remove(this.rule.lookups[idx]);
                    this.onOpen();
                });
            })
                .addText(text => {
                text
                    .setValue(jumpChar)
                    .setPlaceholder("**")
                    .onChange(value => {
                    this.rule.lookups[idx] = value;
                });
            });
        });
        new obsidian.Setting(contentEl)
            .setClass("tabout-jump-char")
            .addButton(bt => {
            bt.setButtonText("Add Character")
                .onClick(() => {
                this.rule.lookups.push("");
                this.onOpen();
            });
        });
        const btn = createEl("button", { text: "Save Rule", cls: "tabout-add-rule" });
        btn.onClickEvent(() => {
            this.close();
        });
        contentEl.createDiv({ cls: "tabout-add-rule-container" }).append(btn);
    }
    onClose() {
        let { contentEl } = this;
        contentEl.empty();
        dispatchEvent(new CustomEvent("tabout-edit-complete", { detail: { rule: this.rule, idx: this.idx } }));
    }
}

class RuleCreateModal extends obsidian.Modal {
    constructor(plugin, matcher = "") {
        super(plugin.app);
        this.plugin = plugin;
        this.rule = {
            lookups: [""],
            tokenMatcher: matcher,
            jumpAfter: true,
        };
    }
    onOpen() {
        let { contentEl } = this;
        contentEl.empty();
        new obsidian.Setting(contentEl)
            .setName("Environment")
            .setClass("tabout-match-text")
            .setDesc("The Codemirror Token for the Environment.")
            .addText(text => {
            text
                .setValue(this.rule.tokenMatcher)
                .setPlaceholder("em")
                .onChange(value => {
                this.rule.tokenMatcher = value;
            });
        });
        new obsidian.Setting(contentEl)
            .setName("Jump after the Characters")
            .setClass("tabout-match-text")
            .setDesc("If enabled the Cursor will be set after the Characters, otherwise before them.")
            .addToggle(toggle => {
            toggle
                .setValue(this.rule.jumpAfter)
                .onChange(value => {
                this.rule.jumpAfter = value;
            });
        });
        this.rule.lookups.forEach((jumpChar, idx) => {
            new obsidian.Setting(contentEl)
                .setName(idx === 0 ? "Characters" : "")
                .setClass("tabout-jump-char")
                .addExtraButton(btn => {
                btn
                    .setIcon("trash")
                    .onClick(() => {
                    this.rule.lookups.remove(this.rule.lookups[idx]);
                    this.onOpen();
                });
            })
                .addText(text => {
                text
                    .setValue(jumpChar)
                    .setPlaceholder("**")
                    .onChange(value => {
                    this.rule.lookups[idx] = value;
                });
            });
        });
        new obsidian.Setting(contentEl)
            .setClass("tabout-jump-char")
            .addButton(bt => {
            bt.setButtonText("Add Character")
                .onClick(() => {
                this.rule.lookups.push("");
                this.onOpen();
            });
        });
        const saveBtn = createEl("button", { text: "Add this Rule", cls: "tabout-add-rule" });
        saveBtn.onClickEvent(() => {
            if (this.rule.lookups.length >= 1 && this.rule.lookups.first()) {
                this.save();
                this.close();
            }
            else {
                new obsidian.Notice("Something is still Missing");
            }
        });
        const cancelBtn = createEl("button", { text: "Cancel", cls: "tabout-add-rule" });
        cancelBtn.onClickEvent(() => {
            this.close();
        });
        contentEl.createDiv({ cls: "tabout-add-rule-container" }).append(saveBtn, cancelBtn);
    }
    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
    save() {
        dispatchEvent(new CustomEvent("tabout-rule-create", { detail: { rule: this.rule } }));
    }
}

class TaboutSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        addEventListener("tabout-edit-complete", (e) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.rules[e.detail.idx] = e.detail.rule;
            this.display();
            yield this.plugin.saveSettings();
        }));
        addEventListener("tabout-rule-create", (e) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.rules.push(e.detail.rule);
            this.display();
            yield this.plugin.saveSettings();
        }));
    }
    display() {
        let { containerEl } = this;
        const { settings } = this.plugin;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian Tabout' });
        settings.rules.forEach((rule, idx) => {
            new obsidian.Setting(containerEl)
                .setName(`Rule #${idx}`)
                .setDesc(this.generateDescription(rule))
                .addButton(bt => {
                bt.setButtonText("Edit")
                    .onClick(() => {
                    new RuleEditModal(this.plugin, rule, idx).open();
                });
            })
                .addExtraButton(bt => {
                bt.setIcon("trash")
                    .setTooltip("Delete Rule")
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    settings.rules.remove(rule);
                    yield this.plugin.saveSettings();
                    this.display();
                }));
            });
        });
        const btn = createEl("button", { text: "Add Rule", cls: "tabout-add-rule" });
        btn.onClickEvent(() => {
            new RuleCreateModal(this.plugin).open();
        });
        containerEl.createDiv({ cls: "tabout-add-rule-container" }).append(btn);
    }
    generateDescription(rule) {
        let descEl = document.createDocumentFragment();
        descEl.append("This Rule is only active in ");
        descEl.append(createEl("code", { text: rule.tokenMatcher ? rule.tokenMatcher : "all" }));
        descEl.append(" Environments and with the press of ");
        descEl.append(createEl("kbd", { text: "Tab", cls: "tabout-kbd" }));
        descEl.append(" you will jump to one of these characters: ");
        rule.lookups.forEach((char, i) => {
            descEl.append(createEl("code", { text: char }));
            if (i != rule.lookups.length - 1) {
                descEl.append(", ");
            }
        });
        return descEl;
    }
}

const DEFAULT_SETTINGS = {
    rules: [
        {
            tokenMatcher: "hmd-internal-link",
            lookups: ["]]"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "strong",
            lookups: ["**"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "em",
            lookups: ["*"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "code",
            lookups: ["`"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "math",
            lookups: ["{", "("],
            jumpAfter: true,
        }
    ],
};

class TaboutPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.handleTabs = (cm, changeObj) => {
            var _a;
            if (changeObj.text.first() === "	") {
                for (let rule of this.settings.rules) {
                    // If Cursor is in correct environment
                    if (!rule.tokenMatcher || ((_a = cm.getTokenTypeAt(cm.getCursor())) === null || _a === void 0 ? void 0 : _a.contains(rule.tokenMatcher))) {
                        // Get Cursor Position
                        const pos = cm.getCursor();
                        // Get content of Line after Cursor
                        const afterCursor = cm.getLine(pos.line).substring(pos.ch);
                        // Determine the nearest character
                        const nextChar = Math.min(...this.getIndices(rule.lookups, afterCursor, rule.jumpAfter));
                        // If there is a nearest one jump right after it
                        if (nextChar != Infinity) {
                            // @ts-ignore Don't insert the Tab
                            changeObj.cancel();
                            cm.setCursor(pos.line, pos.ch + nextChar);
                        }
                    }
                }
            }
        };
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new TaboutSettingsTab(this.app, this));
            this.addCommand({
                id: "tabout-add-rule-here",
                name: "Add Rule for this Environment",
                editorCallback: (editor) => {
                    var _a;
                    //@ts-expect-error
                    new RuleCreateModal(this, (_a = editor.cm.getTokenTypeAt(editor.getCursor())) !== null && _a !== void 0 ? _a : "").open();
                }
            });
            this.registerCodeMirror((cm) => {
                cm.on("beforeChange", this.handleTabs);
            });
        });
    }
    getIndices(rules, afterCursor, jumpAfter) {
        let n = [];
        rules.forEach(r => {
            let idx = afterCursor.indexOf(r);
            if (idx != -1) {
                n.push(jumpAfter ? idx + r.length : idx);
            }
        });
        return n;
    }
    //This is needed to also work when Obsidian is set to using Spaces instead of Tabs. (doesnt work yet haha)
    getTabString(ch) {
        //@ts-expect-error
        if (this.app.vault.getConfig("useTab")) {
            return "";
        }
        else {
            let tab = "";
            //@ts-expect-error
            const tabSize = this.app.vault.getConfig("tabSize");
            let remaining = ch - tabSize;
            for (let i = 0; i < remaining; i++) {
                tab += " ";
            }
            return tab;
        }
    }
    onunload() {
        this.app.workspace.iterateCodeMirrors(cm => cm.off("beforeChange", this.handleTabs));
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}

module.exports = TaboutPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy91aS9ydWxlRWRpdE1vZGFsLnRzIiwic3JjL3VpL3J1bGVDcmVhdGVNb2RhbC50cyIsInNyYy91aS9zZXR0aW5ncy50cyIsInNyYy90eXBlcy50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJNb2RhbCIsIlNldHRpbmciLCJOb3RpY2UiLCJQbHVnaW5TZXR0aW5nVGFiIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9B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
