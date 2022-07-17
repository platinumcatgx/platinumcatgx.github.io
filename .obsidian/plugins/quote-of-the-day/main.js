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

// main.ts
__export(exports, {
  default: () => QuoteOfTheDay
});
var import_obsidian = __toModule(require("obsidian"));
var QUOTE_API_URL = "https://api.quotable.io";
var DEFAULT_SETTINGS = {
  quoteFormat: `> {content}
>
> &mdash; <cite>{author}</cite>\u270D\uFE0F`,
  quoteTagFormat: `>
> ---
> {tags}`,
  showTags: false
};
var QuoteOfTheDay = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.getMarkdownFromQuote = (qod) => {
      let text = this.settings.quoteFormat.replace("{content}", qod.content).replace("{author}", qod.author);
      if (this.settings.showTags) {
        let tags = qod.tags.map((t) => `#${t}`).join(" ");
        let quoteTags = this.settings.quoteTagFormat.replace("{tags}", tags);
        text += `
			${quoteTags}`;
      }
      return text;
    };
  }
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.addCommand({
        id: "qotd-editor-command",
        name: "Insert Random Quote of the Day",
        editorCallback: (editor, view) => __async(this, null, function* () {
          let qod = {
            content: "Oops, I did it again \u{1F64A}",
            author: "Britney Error \u{1F622}",
            tags: ["error"]
          };
          try {
            let response = yield fetch(`${QUOTE_API_URL}/random`);
            qod = yield response.json();
          } catch (err) {
            console.log(err);
            new import_obsidian.Notice(err.message);
          }
          editor.replaceSelection(this.getMarkdownFromQuote(qod));
        }),
        hotkeys: [
          {
            modifiers: ["Ctrl", "Shift"],
            key: "Q"
          }
        ]
      });
      this.addSettingTab(new QotDSettingsTab(this.app, this));
    });
  }
  onunload() {
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
var QotDSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Quote of the Day Settings" });
    new import_obsidian.Setting(containerEl).setName("Quote Format").setDesc("Format the way the quote is displayed").addTextArea((text) => {
      text.setPlaceholder("Quote format").setValue(this.plugin.settings.quoteFormat).onChange((value) => __async(this, null, function* () {
        console.log("New Quote format: " + value);
        let valid = value.contains("{author}") && value.contains("{content}");
        if (!valid) {
          new import_obsidian.Notice("Invalid format! Missing {author} or {content} field");
          return;
        }
        this.plugin.settings.quoteFormat = value;
        yield this.plugin.saveSettings();
      }));
      text.inputEl.setAttr("rows", 4);
      text.inputEl.addClass("settings_area");
    });
    new import_obsidian.Setting(containerEl).setName("Quote Tag Format").setDesc("Format the way the quote tags are displayed").addTextArea((text) => {
      text.setPlaceholder("Quote tag format").setValue(this.plugin.settings.quoteTagFormat).onChange((value) => __async(this, null, function* () {
        console.log("New Quote tag format: " + value);
        let valid = value.contains("{tags}");
        if (!valid) {
          new import_obsidian.Notice("Invalid format! Missing {tags} field");
          return;
        }
        this.plugin.settings.quoteTagFormat = value;
        yield this.plugin.saveSettings();
      }));
      text.inputEl.setAttr("rows", 4);
      text.inputEl.addClass("settings_area");
    });
    new import_obsidian.Setting(containerEl).setName("Show Quote Tags").setDesc("Display the quote tags").addToggle((toggle) => toggle.setValue(this.plugin.settings.showTags).onChange((value) => __async(this, null, function* () {
      console.log("New Show tags: " + value);
      this.plugin.settings.showTags = value;
      yield this.plugin.saveSettings();
    })));
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHtcclxuXHRBcHAsXHJcblx0RWRpdG9yLFxyXG5cdE1hcmtkb3duVmlldyxcclxuXHROb3RpY2UsXHJcblx0UGx1Z2luLFxyXG5cdFBsdWdpblNldHRpbmdUYWIsXHJcblx0U2V0dGluZyxcclxufSBmcm9tIFwib2JzaWRpYW5cIjtcclxuXHJcbmludGVyZmFjZSBRb3REU2V0dGluZ3Mge1xyXG5cdHF1b3RlRm9ybWF0OiBzdHJpbmc7XHJcblx0cXVvdGVUYWdGb3JtYXQ6IHN0cmluZztcclxuXHRzaG93VGFnczogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFF1b3RlT2ZEYXkge1xyXG5cdGNvbnRlbnQ6IHN0cmluZztcclxuXHRhdXRob3I6IHN0cmluZztcclxuXHR0YWdzOiBBcnJheTxzdHJpbmc+O1xyXG59XHJcblxyXG5jb25zdCBRVU9URV9BUElfVVJMID0gXCJodHRwczovL2FwaS5xdW90YWJsZS5pb1wiO1xyXG5cclxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogUW90RFNldHRpbmdzID0ge1xyXG5cdHF1b3RlRm9ybWF0OiBgPiB7Y29udGVudH1cclxuPlxyXG4+ICZtZGFzaDsgPGNpdGU+e2F1dGhvcn08L2NpdGU+XHUyNzBEXHVGRTBGYCxcclxuXHRxdW90ZVRhZ0Zvcm1hdDogYD5cclxuPiAtLS1cclxuPiB7dGFnc31gLFxyXG5cdHNob3dUYWdzOiBmYWxzZSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1b3RlT2ZUaGVEYXkgZXh0ZW5kcyBQbHVnaW4ge1xyXG5cdHNldHRpbmdzOiBRb3REU2V0dGluZ3M7XHJcblxyXG5cdGdldE1hcmtkb3duRnJvbVF1b3RlID0gKHFvZDogUXVvdGVPZkRheSkgPT4ge1xyXG5cdFx0bGV0IHRleHQgPSB0aGlzLnNldHRpbmdzLnF1b3RlRm9ybWF0XHJcblx0XHRcdC5yZXBsYWNlKFwie2NvbnRlbnR9XCIsIHFvZC5jb250ZW50KVxyXG5cdFx0XHQucmVwbGFjZShcInthdXRob3J9XCIsIHFvZC5hdXRob3IpO1xyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3Muc2hvd1RhZ3MpIHtcclxuXHRcdFx0bGV0IHRhZ3MgPSBxb2QudGFncy5tYXAoKHQpID0+IGAjJHt0fWApLmpvaW4oXCIgXCIpO1xyXG5cdFx0XHRsZXQgcXVvdGVUYWdzID0gdGhpcy5zZXR0aW5ncy5xdW90ZVRhZ0Zvcm1hdC5yZXBsYWNlKFxyXG5cdFx0XHRcdFwie3RhZ3N9XCIsXHJcblx0XHRcdFx0dGFnc1xyXG5cdFx0XHQpO1xyXG5cdFx0XHR0ZXh0ICs9IGBcclxuXHRcdFx0JHtxdW90ZVRhZ3N9YDtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0ZXh0O1xyXG5cdH07XHJcblxyXG5cdGFzeW5jIG9ubG9hZCgpIHtcclxuXHRcdGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcblxyXG5cdFx0Ly8gVGhpcyBhZGRzIGFuIGVkaXRvciBjb21tYW5kIHRoYXQgY2FuIHBlcmZvcm0gc29tZSBvcGVyYXRpb24gb24gdGhlIGN1cnJlbnQgZWRpdG9yIGluc3RhbmNlXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogXCJxb3RkLWVkaXRvci1jb21tYW5kXCIsXHJcblx0XHRcdG5hbWU6IFwiSW5zZXJ0IFJhbmRvbSBRdW90ZSBvZiB0aGUgRGF5XCIsXHJcblx0XHRcdGVkaXRvckNhbGxiYWNrOiBhc3luYyAoZWRpdG9yOiBFZGl0b3IsIHZpZXc6IE1hcmtkb3duVmlldykgPT4ge1xyXG5cdFx0XHRcdGxldCBxb2Q6IFF1b3RlT2ZEYXkgPSB7XHJcblx0XHRcdFx0XHRjb250ZW50OiBcIk9vcHMsIEkgZGlkIGl0IGFnYWluIFx1RDgzRFx1REU0QVwiLFxyXG5cdFx0XHRcdFx0YXV0aG9yOiBcIkJyaXRuZXkgRXJyb3IgXHVEODNEXHVERTIyXCIsXHJcblx0XHRcdFx0XHR0YWdzOiBbXCJlcnJvclwiXSxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtRVU9URV9BUElfVVJMfS9yYW5kb21gKTtcclxuXHRcdFx0XHRcdHFvZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0XHRuZXcgTm90aWNlKGVyci5tZXNzYWdlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24odGhpcy5nZXRNYXJrZG93bkZyb21RdW90ZShxb2QpKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0aG90a2V5czogW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG1vZGlmaWVyczogW1wiQ3RybFwiLCBcIlNoaWZ0XCJdLFxyXG5cdFx0XHRcdFx0a2V5OiBcIlFcIixcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdLFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gVGhpcyBhZGRzIGEgc2V0dGluZ3MgdGFiIHNvIHRoZSB1c2VyIGNhbiBjb25maWd1cmUgdmFyaW91cyBhc3BlY3RzIG9mIHRoZSBwbHVnaW5cclxuXHRcdHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgUW90RFNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblx0fVxyXG5cclxuXHRvbnVubG9hZCgpIHt9XHJcblxyXG5cdGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKFxyXG5cdFx0XHR7fSxcclxuXHRcdFx0REVGQVVMVF9TRVRUSU5HUyxcclxuXHRcdFx0YXdhaXQgdGhpcy5sb2FkRGF0YSgpXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG5cdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFFvdERTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG5cdHBsdWdpbjogUXVvdGVPZlRoZURheTtcclxuXHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUXVvdGVPZlRoZURheSkge1xyXG5cdFx0c3VwZXIoYXBwLCBwbHVnaW4pO1xyXG5cdFx0dGhpcy5wbHVnaW4gPSBwbHVnaW47XHJcblx0fVxyXG5cclxuXHRkaXNwbGF5KCk6IHZvaWQge1xyXG5cdFx0bGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XHJcblxyXG5cdFx0Y29udGFpbmVyRWwuZW1wdHkoKTtcclxuXHJcblx0XHRjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJRdW90ZSBvZiB0aGUgRGF5IFNldHRpbmdzXCIgfSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKFwiUXVvdGUgRm9ybWF0XCIpXHJcblx0XHRcdC5zZXREZXNjKFwiRm9ybWF0IHRoZSB3YXkgdGhlIHF1b3RlIGlzIGRpc3BsYXllZFwiKVxyXG5cdFx0XHQuYWRkVGV4dEFyZWEoKHRleHQpID0+IHtcclxuXHRcdFx0XHR0ZXh0LnNldFBsYWNlaG9sZGVyKFwiUXVvdGUgZm9ybWF0XCIpXHJcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucXVvdGVGb3JtYXQpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTmV3IFF1b3RlIGZvcm1hdDogXCIgKyB2YWx1ZSk7XHJcblx0XHRcdFx0XHRcdC8vYWRkIHF1b3RlIGZvcm1hdCB2YWxpZGF0aW9uXHJcblx0XHRcdFx0XHRcdGxldCB2YWxpZCA9XHJcblx0XHRcdFx0XHRcdFx0dmFsdWUuY29udGFpbnMoXCJ7YXV0aG9yfVwiKSAmJlxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlLmNvbnRhaW5zKFwie2NvbnRlbnR9XCIpO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXZhbGlkKSB7XHJcblx0XHRcdFx0XHRcdFx0bmV3IE5vdGljZShcclxuXHRcdFx0XHRcdFx0XHRcdFwiSW52YWxpZCBmb3JtYXQhIE1pc3Npbmcge2F1dGhvcn0gb3Ige2NvbnRlbnR9IGZpZWxkXCJcclxuXHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5xdW90ZUZvcm1hdCA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRleHQuaW5wdXRFbC5zZXRBdHRyKFwicm93c1wiLCA0KTtcclxuXHRcdFx0XHR0ZXh0LmlucHV0RWwuYWRkQ2xhc3MoXCJzZXR0aW5nc19hcmVhXCIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoXCJRdW90ZSBUYWcgRm9ybWF0XCIpXHJcblx0XHRcdC5zZXREZXNjKFwiRm9ybWF0IHRoZSB3YXkgdGhlIHF1b3RlIHRhZ3MgYXJlIGRpc3BsYXllZFwiKVxyXG5cdFx0XHQuYWRkVGV4dEFyZWEoKHRleHQpID0+IHtcclxuXHRcdFx0XHR0ZXh0LnNldFBsYWNlaG9sZGVyKFwiUXVvdGUgdGFnIGZvcm1hdFwiKVxyXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnF1b3RlVGFnRm9ybWF0KVxyXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIk5ldyBRdW90ZSB0YWcgZm9ybWF0OiBcIiArIHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0Ly9hZGQgdGFnIGZvcm1hdCB2YWxpZGF0aW9uXHJcblx0XHRcdFx0XHRcdGxldCB2YWxpZCA9IHZhbHVlLmNvbnRhaW5zKFwie3RhZ3N9XCIpO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXZhbGlkKSB7XHJcblx0XHRcdFx0XHRcdFx0bmV3IE5vdGljZShcIkludmFsaWQgZm9ybWF0ISBNaXNzaW5nIHt0YWdzfSBmaWVsZFwiKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MucXVvdGVUYWdGb3JtYXQgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR0ZXh0LmlucHV0RWwuc2V0QXR0cihcInJvd3NcIiwgNCk7XHJcblx0XHRcdFx0dGV4dC5pbnB1dEVsLmFkZENsYXNzKFwic2V0dGluZ3NfYXJlYVwiKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKFwiU2hvdyBRdW90ZSBUYWdzXCIpXHJcblx0XHRcdC5zZXREZXNjKFwiRGlzcGxheSB0aGUgcXVvdGUgdGFnc1wiKVxyXG5cdFx0XHQuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XHJcblx0XHRcdFx0dG9nZ2xlXHJcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1RhZ3MpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTmV3IFNob3cgdGFnczogXCIgKyB2YWx1ZSk7XHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dUYWdzID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0KTtcclxuXHR9XHJcbn1cclxuIl0s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
