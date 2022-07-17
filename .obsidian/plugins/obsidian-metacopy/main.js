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
  copy: () => copy,
  createLink: () => createLink,
  default: () => MetaCopy,
  disableMetaCopy: () => disableMetaCopy,
  getValue: () => getValue
});
var import_obsidian3 = __toModule(require("obsidian"));

// src/settings.ts
var import_obsidian = __toModule(require("obsidian"));
var DEFAULT_SETTINGS = {
  copyKey: "",
  baseLink: "",
  keyLink: "",
  comport: false,
  disableKey: "",
  folderNote: false,
  defaultKeyLink: ""
};
var CopySettingsTabs = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Metacopy Settings" });
    new import_obsidian.Setting(containerEl).setName("Key").setDesc("The key which you want to copy the value").addTextArea((text) => text.setPlaceholder("key1, key2, key3,\u2026").setValue(this.plugin.settings.copyKey).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.copyKey = value;
      yield this.plugin.saveSettings();
    })));
    containerEl.createEl("h3", { text: "Link creator" });
    new import_obsidian.Setting(containerEl).setName("Base link").setDesc("The base of the link").addText((text) => text.setPlaceholder("https://obsidian-file.github.io/").setValue(this.plugin.settings.baseLink).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.baseLink = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("key link").setDesc("The key to create as link").addText((text) => text.setPlaceholder("").setValue(this.plugin.settings.keyLink).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.keyLink = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Default value").setDesc("If you want to active the link creation without the key set.").addText((text) => text.setPlaceholder("").setValue(this.plugin.settings.defaultKeyLink).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.defaultKeyLink = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Folder Note").setDesc("if file name = key link, remove the file name in the link").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.folderNote);
      toggle.onChange((value) => __async(this, null, function* () {
        this.plugin.settings.folderNote = value;
        yield this.plugin.saveSettings();
      }));
    });
    containerEl.createEl("h3", { text: "Disable MetaCopy" });
    containerEl.createEl("p", {
      text: "Disable Metacopy context menu with a frontmatter key."
    });
    containerEl.createEl("p", {
      text: "Also disable the URL creation in command modal."
    });
    new import_obsidian.Setting(containerEl).setName("Menu behavior").setDesc("Enable : require a configured key to enable the menu").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.comport);
      toggle.onChange((value) => __async(this, null, function* () {
        this.plugin.settings.comport = value;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian.Setting(containerEl).setName("Key menu").setDesc("Key used to disable/enable Metacopy file menu").addText((text) => text.setPlaceholder("").setValue(this.plugin.settings.disableKey).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.disableKey = value;
      yield this.plugin.saveSettings();
    })));
  }
};

// src/modal.ts
var import_obsidian2 = __toModule(require("obsidian"));
function getAllMeta(app, file, settings) {
  let metaValue = [];
  const frontmatter = app.metadataCache.getCache(file.path).frontmatter;
  const keyMeta = settings.copyKey.replace(" ", ",").replace(",,", ",");
  let listKey = keyMeta.split(",");
  listKey = listKey.map((x) => x.trim());
  if (listKey.length > 0) {
    for (let i = 0; i < listKey.length; i++) {
      if (frontmatter[listKey[i]]) {
        metaValue.push(frontmatter[listKey[i].trim()]);
      }
    }
  }
  let mappedListKey = listKey.map((key, i) => ({
    key,
    value: metaValue[i]
  }));
  mappedListKey = JSON.parse(JSON.stringify(mappedListKey));
  Object.entries(mappedListKey).forEach(([k, v]) => {
    if (v.value === void 0) {
      mappedListKey.remove(v);
    }
  });
  const enableMetaCopy = disableMetaCopy(app, settings, file);
  if (enableMetaCopy && settings.defaultKeyLink) {
    mappedListKey[mappedListKey.length] = {
      key: "Copy link",
      value: settings.defaultKeyLink
    };
  }
  return mappedListKey;
}
var CopyMetaSuggester = class extends import_obsidian2.FuzzySuggestModal {
  constructor(app, settings, file) {
    super(app);
    this.file = file;
    this.settings = settings;
  }
  getItemText(item) {
    return item.key;
  }
  getItems() {
    return getAllMeta(this.app, this.file, this.settings);
  }
  onChooseItem(item, evt) {
    item.value = item.value.toString();
    if (item.value.split(",").length > 1) {
      item.value = "- " + item.value.replaceAll(",", "\n- ");
    }
    const contents = createLink(this.app, this.file, this.settings, item.value, item.key);
    copy(contents, item.key);
  }
};

// src/main.ts
function copy(content, item) {
  return __async(this, null, function* () {
    yield navigator.clipboard.writeText(content);
    let message = "Metadata " + item + " copied to clipboard";
    if (item == "DefaultKey" || item == this.settings.keyLink) {
      message = "Metacopy URL send to clipboard";
    }
    new import_obsidian3.Notice(message);
  });
}
function getMeta(app, file, settings) {
  const fileCache = app.metadataCache.getFileCache(file);
  const meta = fileCache == null ? void 0 : fileCache.frontmatter;
  if (meta === void 0) {
    return ["", ""];
  }
  let linkValue = "";
  let metaKey = "";
  if (settings) {
    const keyMeta = settings.copyKey.replace(" ", ",").replace(",,", ",");
    const listKey = keyMeta.split(",");
    metaKey = keyMeta;
    if (listKey.length > 1) {
      for (let i = 0; i < listKey.length; i++) {
        if (meta[listKey[i]] !== void 0) {
          linkValue = meta[listKey[i]].trim();
          metaKey = listKey[i].trim();
          break;
        }
      }
    } else {
      linkValue = meta[listKey[0]];
      metaKey = listKey[0];
    }
  }
  let metaKeys = [linkValue, metaKey];
  if (!linkValue && settings.defaultKeyLink) {
    return [settings.defaultKeyLink, "DefaultKey"];
  }
  return metaKeys;
}
function checkMeta(app, settings) {
  const file = app.workspace.getActiveFile();
  const meta = getMeta(app, file, settings);
  let checkKey = false;
  if (meta[1] != "DefaultKey") {
    checkKey = true;
  }
  return !!file && checkKey;
}
function disableMetaCopy(app, settings, file) {
  const toggle = settings.comport;
  const fileCache = app.metadataCache.getFileCache(file);
  const meta = fileCache == null ? void 0 : fileCache.frontmatter;
  if (toggle) {
    if (meta === void 0) {
      return false;
    } else
      return !!meta[settings.disableKey];
  } else {
    if (meta === void 0) {
      return false;
    } else
      return !meta[settings.disableKey];
  }
}
function checkSlash(link) {
  let slash = link.match(/\/*$/);
  if (slash[0].length != 1) {
    link = link.replace(/\/*$/, "") + "/";
  }
  return link;
}
function createLink(app, file, settings, contents, metaKey) {
  let url = contents;
  const folderPath = checkSlash(contents).replace(/(^\/|\/$)/, "");
  let folder = folderPath.split("/").slice(-1)[0];
  if (settings) {
    let baseLink = settings.baseLink;
    baseLink = checkSlash(baseLink);
    const keyLink = settings.keyLink;
    const folderNote = settings.folderNote;
    let fileName = file.name.replace(".md", "");
    if (metaKey === keyLink || metaKey == "DefaultKey" || metaKey == "Copy link") {
      if (fileName === folder && folderNote) {
        fileName = "/";
      } else {
        fileName = "/" + fileName + "/";
      }
      url = baseLink + folderPath + fileName;
      url = encodeURI(url);
    }
  }
  return url;
}
function getValue(app, file, settings) {
  return __async(this, null, function* () {
    const meta = getMeta(app, file, settings);
    if (!meta) {
      return false;
    }
    meta[0] = meta[0].toString();
    if (meta[0].split(",").length > 1) {
      meta[0] = "- " + meta[0].replaceAll(",", "\n- ");
    }
    const contents = createLink(app, file, settings, meta[0], meta[1]);
    yield copy(contents, meta[1]);
  });
}
var MetaCopy = class extends import_obsidian3.Plugin {
  onload() {
    return __async(this, null, function* () {
      console.log("MetaCopy loaded");
      yield this.loadSettings();
      this.addSettingTab(new CopySettingsTabs(this.app, this));
      this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
        const meta = getMeta(this.app, file, this.settings);
        if (!meta) {
          return false;
        }
        const keyMeta = meta[1];
        let title = "Copy [" + keyMeta + "]";
        let icon = "two-blank-pages";
        const enableMetaCopy = disableMetaCopy(this.app, this.settings, file);
        if ((keyMeta === this.settings.keyLink || this.settings.defaultKeyLink) && enableMetaCopy) {
          title = "Copy URL";
          icon = "link";
        }
        if (meta[0] && enableMetaCopy) {
          menu.addSeparator();
          menu.addItem((item) => {
            item.setTitle(title).setIcon(icon).onClick(() => __async(this, null, function* () {
              yield getValue(this.app, file, this.settings);
            }));
          });
          menu.addSeparator();
        }
      }));
      this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, view) => {
        const meta = getMeta(this.app, view.file, this.settings);
        if (!meta) {
          return false;
        }
        const keyMeta = meta[1];
        const enableMetaCopy = disableMetaCopy(this.app, this.settings, view.file);
        if ((keyMeta === this.settings.keyLink || this.settings.defaultKeyLink) && enableMetaCopy) {
          menu.addSeparator();
          menu.addItem((item) => {
            item.setTitle("Copy URL").setIcon("link").onClick(() => __async(this, null, function* () {
              yield getValue(this.app, view.file, this.settings);
            }));
          });
          menu.addSeparator();
        }
      }));
      this.addCommand({
        id: "obsidian-metacopy",
        name: "Metacopy",
        hotkeys: [],
        checkCallback: (checking) => {
          const fileMeta = checkMeta(this.app, this.settings);
          if (fileMeta) {
            if (!checking) {
              new CopyMetaSuggester(this.app, this.settings, this.app.workspace.getActiveFile()).open();
            }
            return true;
          }
          return false;
        }
      });
    });
  }
  onunload() {
    return __async(this, null, function* () {
      console.log("MetaCopy unloaded");
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
};
