/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
__export(exports, {
  default: () => WordlePlugin
});
var import_obsidian3 = __toModule(require("obsidian"));

// src/settings.ts
var import_obsidian = __toModule(require("obsidian"));
var DEFAULT_SETTINGS = {
  debug: false
};
var WordleSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Wordle" });
    new import_obsidian.Setting(containerEl).setName("Debug").setDesc("Turn on for debug prints in console.").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.debug);
      toggle.onChange((debug) => __async(this, null, function* () {
        this.plugin.settings.debug = debug;
        console.log(`[Wordle]: Set debug to ${debug}`);
        yield this.plugin.saveSettings();
      }));
    });
  }
};

// src/view.ts
var import_obsidian2 = __toModule(require("obsidian"));
var WORDLE_VIEW_TYPE = "wordle-view";
var WordleView = class extends import_obsidian2.ItemView {
  constructor(leaf) {
    super(leaf);
  }
  getViewType() {
    return WORDLE_VIEW_TYPE;
  }
  getDisplayText() {
    return "Wordle";
  }
  onOpen() {
    return __async(this, null, function* () {
      console.log("[Wordle]: Opening view.");
      const container = this.containerEl.children[1];
      container.id = "wordle-container";
      container.empty();
      const iframe = container.createEl("iframe");
      iframe.src = "https://www.powerlanguage.co.uk/wordle/";
      iframe.id = "wordle-iframe";
    });
  }
  onClose() {
    return __async(this, null, function* () {
      console.log("[Wordle]: Closing view.");
    });
  }
};

// src/main.ts
var WordlePlugin = class extends import_obsidian3.Plugin {
  onload() {
    return __async(this, null, function* () {
      console.log("[Wordle]: loaded plugin.");
      this.registerView(WORDLE_VIEW_TYPE, (leaf) => new WordleView(leaf));
      yield this.loadSettings();
      this.addSettingTab(new WordleSettingTab(this.app, this));
      yield this.activateView();
    });
  }
  onunload() {
    return __async(this, null, function* () {
      this.app.workspace.detachLeavesOfType(WORDLE_VIEW_TYPE);
      console.log("[Wordle]: unloaded plugin.");
    });
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
  activateView() {
    return __async(this, null, function* () {
      this.app.workspace.detachLeavesOfType(WORDLE_VIEW_TYPE);
      yield this.app.workspace.getRightLeaf(false).setViewState({
        type: WORDLE_VIEW_TYPE,
        active: true
      });
      this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(WORDLE_VIEW_TYPE)[0]);
    });
  }
};
