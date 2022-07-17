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
  default: () => ImageCaptionPlugin
});
var import_obsidian2 = __toModule(require("obsidian"));

// src/md_processor.ts
var import_obsidian = __toModule(require("obsidian"));
function internalCaptionObserver(plugin, ctx) {
  return new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      if (!mutation.target.matches("span.image-embed")) {
        continue;
      }
      let caption_text = mutation.target.getAttribute("alt");
      if (caption_text === mutation.target.getAttribute("src")) {
        continue;
      }
      if (mutation.target.querySelector(ImageCaptionPlugin.caption_selector)) {
        continue;
      }
      const parsed = parseCaptionText(caption_text, plugin.settings.delimeter);
      const size = parsed.size;
      caption_text = parsed.text;
      if (caption_text) {
        const caption = addCaption(mutation.target, caption_text);
        ctx.addChild(caption);
      }
      if (size) {
        setSize(mutation.target, size);
      }
    }
    updateFigureIndices();
    plugin.removeObserver(observer);
  });
}
function externalCaptionObserver(plugin) {
  return new MutationObserver((mutations, observer) => {
    let update = false;
    for (const mutation of mutations) {
      const captions = [...mutation.addedNodes].filter((elm) => {
        return elm.matches(ImageCaptionPlugin.caption_selector);
      });
      if (captions.length) {
        update = true;
      }
    }
    if (update) {
      updateFigureIndices();
      plugin.removeObserver(observer);
    }
  });
}
function parseCaptionText(text, delimeter) {
  let start, end;
  let start_delim, end_delim;
  if (delimeter.length === 0) {
    start_delim = "";
    end_delim = "";
    start = 0;
    end = text.length - 1;
  } else if (delimeter.length == 1) {
    start_delim = delimeter[0];
    end_delim = delimeter[0];
    start = text.indexOf(start_delim);
    end = text.lastIndexOf(end_delim);
  } else if (delimeter.length === 2) {
    start_delim = delimeter[0];
    end_delim = delimeter[1];
    start = text.indexOf(start_delim);
    end = text.lastIndexOf(end_delim);
  } else {
    return {
      text: void 0,
      size: void 0
    };
  }
  let caption, remaining_text;
  if (start === -1 || end === -1 || start === end) {
    caption = void 0;
    remaining_text = [text];
  } else {
    const start_offset = start_delim.length;
    const end_offset = end_delim.length;
    caption = text.slice(start + start_offset, end);
    remaining_text = [
      text.slice(0, start),
      text.slice(end + end_offset)
    ];
  }
  let size = parseSize(remaining_text[0]);
  if (!size) {
    size = parseSize(remaining_text[1]);
  }
  return { text: caption, size };
}
function parseSize(text) {
  const size_pattern = /(\d+)x(\d+)/i;
  const match = text.match(size_pattern);
  if (!match) {
    return void 0;
  }
  return {
    width: match[1],
    height: match[2]
  };
}
function addCaption(target, caption_text) {
  const caption = document.createElement(ImageCaptionPlugin.caption_tag);
  caption.addClass(ImageCaptionPlugin.caption_class);
  caption.innerText = caption_text;
  target.appendChild(caption);
  return new import_obsidian.MarkdownRenderChild(caption);
}
function setSize(target, size) {
  const { width, height } = size;
  const img = target.querySelector("img");
  target.setAttribute("width", width);
  target.setAttribute("height", height);
  img.setAttribute("width", width);
  img.setAttribute("height", height);
}
function updateFigureIndices() {
  document.querySelectorAll("div.workspace-leaf").forEach((workspace) => {
    let index = 1;
    workspace.querySelectorAll(ImageCaptionPlugin.caption_selector).forEach((el) => {
      el.dataset.imageCaptionIndex = index;
      index += 1;
    });
  });
}
function processInternalImageCaption(plugin) {
  return function(el, ctx) {
    el.querySelectorAll("span.internal-embed").forEach((container) => {
      const observer = internalCaptionObserver(plugin, ctx);
      observer.observe(container, { attributes: true, attributesFilter: ["class"] });
      plugin.addObserver(observer);
    });
  };
}
function processExternalImageCaption(plugin) {
  return function(el, ctx) {
    const container_css_class = "obsidian-image-caption-external-embed";
    elms = [...el.querySelectorAll("img")];
    elms.filter((elm) => {
      return !elm.closest("span.internal-embed");
    }).forEach((img) => {
      if (img.closest(`.${container_css_class}`)) {
        return;
      }
      let caption_text = img.getAttribute("alt");
      const parsed = parseCaptionText(caption_text, plugin.settings.delimeter);
      const size = parsed.size;
      caption_text = parsed.text;
      if (!(caption_text || size)) {
        return;
      }
      const container = document.createElement("span");
      container.addClass(container_css_class);
      const observer = externalCaptionObserver(plugin, ctx);
      observer.observe(container, { childList: true });
      plugin.addObserver(observer);
      img.replaceWith(container);
      container.appendChild(img);
      if (caption_text) {
        const caption = addCaption(container, caption_text);
        ctx.addChild(new import_obsidian.MarkdownRenderChild(container));
        ctx.addChild(caption);
      }
      if (size) {
        setSize(container, size);
      }
    });
  };
}

// src/main.ts
var DEFAULT_SETTINGS = {
  css: "",
  label: "",
  delimeter: []
};
var _ImageCaptionPlugin = class extends import_obsidian2.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.caption_observers = [];
      this.registerMarkdownPostProcessor(processInternalImageCaption(this));
      this.registerMarkdownPostProcessor(processExternalImageCaption(this));
      this.addStylesheet();
      this.addSettingTab(new ImageCaptionSettingTab(this.app, this));
    });
  }
  onunload() {
    this.stylesheet.remove();
    this.clearObservers();
    this.removeCaptions();
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
  addObserver(observer) {
    this.caption_observers.push(observer);
  }
  removeObserver(observer) {
    observer.disconnect();
    const index = this.caption_observers.indexOf(observer);
    this.caption_observers.splice(index, 1);
  }
  clearObservers() {
    for (const observer of this.caption_observers) {
      observer.disconnect();
    }
    this.caption_observers = [];
  }
  addStylesheet() {
    this.stylesheet = document.createElement("style");
    this.stylesheet.setAttribute("type", "text/css");
    this.updateStylesheet();
    document.head.append(this.stylesheet);
  }
  updateStylesheet() {
    const css = this.settings.css ? `${_ImageCaptionPlugin.caption_selector} { ${this.settings.css} }` : "";
    let label = this.settings.label;
    if (label) {
      const number_pattern = /(^|[^\\])#/g;
      label = label.replace(number_pattern, "$1' attr(data-image-caption-index) '");
      label = label.replace("\\#", "#");
      label = `${_ImageCaptionPlugin.caption_selector}::before { content: '${label} ' }`;
    }
    this.stylesheet.innerText = `${css} ${label}`;
  }
  removeCaptions() {
    for (const caption of document.querySelectorAll(_ImageCaptionPlugin.caption_selector)) {
      caption.remove();
    }
  }
};
var ImageCaptionPlugin = _ImageCaptionPlugin;
ImageCaptionPlugin.caption_tag = "figcaption";
ImageCaptionPlugin.caption_class = "obsidian-image-caption";
ImageCaptionPlugin.caption_selector = `${_ImageCaptionPlugin.caption_tag}.${_ImageCaptionPlugin.caption_class}`;
var ImageCaptionSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    let { containerEl } = this;
    containerEl.empty();
    new import_obsidian2.Setting(containerEl).setName("Label").setDesc("Prepend this text before each caption.").addText((text) => text.setPlaceholder("Label").setValue(this.plugin.settings.label).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.label = value.trim();
      yield this.plugin.saveSettings();
      this.plugin.updateStylesheet();
    })));
    new import_obsidian2.Setting(containerEl).setName("CSS").setDesc("Custom CSS styling for captions.").addTextArea((text) => text.setPlaceholder("Enter your CSS").setValue(this.plugin.settings.css).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.css = value.trim();
      yield this.plugin.saveSettings();
      this.plugin.updateStylesheet();
    })));
    const delimeter = new import_obsidian2.Setting(containerEl).setName("Delimeter").setDesc("Identify the caption by surrounding it with the delimeter. Start and end delimeters mays be specified by separation with a comma (,).").setTooltip("If no delimeter is provided the entire alt text is taken to be the caption. If a single delimeter is specified it must indicate the start and end of the caption. If two delimeters are specified, by separation with a comma, the caption is taken to be the text between the start and end delimeters.");
    delimeter.addText((text) => text.setPlaceholder("Delimeter").setValue(this.plugin.settings.delimeter.join(", ")).onChange((value) => __async(this, null, function* () {
      let delimeters = value.split(",").map((d) => d.trim());
      if (delimeters.length > 2) {
        delimeter.controlEl.addClass("setting-error");
        return;
      }
      if (delimeters.length === 2 && delimeters.some((d) => !d)) {
        delimeter.controlEl.addClass("setting-error");
        return;
      }
      if (delimeters.length === 1 && delimeters[0] === "") {
        delimeters = [];
      }
      delimeter.controlEl.removeClass("setting-error");
      this.plugin.settings.delimeter = delimeters;
      yield this.plugin.saveSettings();
    })));
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL21kX3Byb2Nlc3Nvci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHtcclxuXHRBcHAsXHJcblx0UGx1Z2luLFxyXG5cdFBsdWdpblNldHRpbmdUYWIsXHJcblx0U2V0dGluZ1xyXG59IGZyb20gJ29ic2lkaWFuJztcclxuXHJcbmltcG9ydCB7XHJcblx0cHJvY2Vzc0ludGVybmFsSW1hZ2VDYXB0aW9uLFxyXG5cdHByb2Nlc3NFeHRlcm5hbEltYWdlQ2FwdGlvblxyXG59IGZyb20gJy4vbWRfcHJvY2Vzc29yJztcclxuXHJcblxyXG5pbnRlcmZhY2UgSW1hZ2VDYXB0aW9uU2V0dGluZ3Mge1xyXG5cdGNzczogc3RyaW5nO1xyXG5cdGxhYmVsOiBzdHJpbmc7XHJcblx0ZGVsaW1ldGVyOiBzdHJpbmdbXTtcclxufVxyXG5cclxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogSW1hZ2VDYXB0aW9uU2V0dGluZ3MgPSB7XHJcblx0Y3NzOiAnJyxcclxuXHRsYWJlbDogJycsXHJcblx0ZGVsaW1ldGVyOiBbXVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2VDYXB0aW9uUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuXHRzZXR0aW5nczogSW1hZ2VDYXB0aW9uU2V0dGluZ3M7XHJcblxyXG5cdHN0YXRpYyBjYXB0aW9uX3RhZzogc3RyaW5nID0gJ2ZpZ2NhcHRpb24nO1xyXG5cdHN0YXRpYyBjYXB0aW9uX2NsYXNzOiBzdHJpbmcgPSAnb2JzaWRpYW4taW1hZ2UtY2FwdGlvbic7XHJcblx0c3RhdGljIGNhcHRpb25fc2VsZWN0b3I6IHN0cmluZyA9IGAke0ltYWdlQ2FwdGlvblBsdWdpbi5jYXB0aW9uX3RhZ30uJHtJbWFnZUNhcHRpb25QbHVnaW4uY2FwdGlvbl9jbGFzc31gO1xyXG5cclxuXHJcblx0YXN5bmMgb25sb2FkKCkge1xyXG5cdFx0YXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuXHJcblx0XHR0aGlzLmNhcHRpb25fb2JzZXJ2ZXJzID0gW107XHJcblx0XHR0aGlzLnJlZ2lzdGVyTWFya2Rvd25Qb3N0UHJvY2Vzc29yKCBwcm9jZXNzSW50ZXJuYWxJbWFnZUNhcHRpb24oIHRoaXMgKSApO1xyXG5cdFx0dGhpcy5yZWdpc3Rlck1hcmtkb3duUG9zdFByb2Nlc3NvciggcHJvY2Vzc0V4dGVybmFsSW1hZ2VDYXB0aW9uKCB0aGlzICkgKTtcclxuXHJcblx0XHR0aGlzLmFkZFN0eWxlc2hlZXQoKTtcclxuXHRcdHRoaXMuYWRkU2V0dGluZ1RhYiggbmV3IEltYWdlQ2FwdGlvblNldHRpbmdUYWIoIHRoaXMuYXBwLCB0aGlzICkgKTtcclxuXHR9XHJcblxyXG5cdG9udW5sb2FkKCkge1xyXG5cdFx0dGhpcy5zdHlsZXNoZWV0LnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5jbGVhck9ic2VydmVycygpO1xyXG5cdFx0dGhpcy5yZW1vdmVDYXB0aW9ucygpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgbG9hZFNldHRpbmdzKCkge1xyXG5cdFx0dGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oIHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkgKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcclxuXHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEoIHRoaXMuc2V0dGluZ3MgKTtcclxuXHR9XHJcblxyXG5cdGFkZE9ic2VydmVyKCBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciApIHtcclxuXHRcdHRoaXMuY2FwdGlvbl9vYnNlcnZlcnMucHVzaCggb2JzZXJ2ZXIgKTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZU9ic2VydmVyKCBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciApIHtcclxuXHRcdG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuXHRcdGNvbnN0IGluZGV4ID0gdGhpcy5jYXB0aW9uX29ic2VydmVycy5pbmRleE9mKCBvYnNlcnZlciApO1xyXG5cdFx0dGhpcy5jYXB0aW9uX29ic2VydmVycy5zcGxpY2UoIGluZGV4LCAxICk7XHJcblx0fVxyXG5cclxuXHRjbGVhck9ic2VydmVycygpIHtcclxuXHRcdGZvciAoIGNvbnN0IG9ic2VydmVyIG9mIHRoaXMuY2FwdGlvbl9vYnNlcnZlcnMgKSB7XHJcblx0XHRcdG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmNhcHRpb25fb2JzZXJ2ZXJzID0gW107XHJcblx0fVxyXG5cclxuXHRhZGRTdHlsZXNoZWV0KCkge1xyXG5cdFx0dGhpcy5zdHlsZXNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3N0eWxlJyApO1xyXG5cdFx0dGhpcy5zdHlsZXNoZWV0LnNldEF0dHJpYnV0ZSggJ3R5cGUnLCAndGV4dC9jc3MnICk7XHJcblx0XHR0aGlzLnVwZGF0ZVN0eWxlc2hlZXQoKTtcclxuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kKCB0aGlzLnN0eWxlc2hlZXQgKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZVN0eWxlc2hlZXQoKSB7XHJcblx0XHRjb25zdCBjc3MgPSB0aGlzLnNldHRpbmdzLmNzcyA/IGAke0ltYWdlQ2FwdGlvblBsdWdpbi5jYXB0aW9uX3NlbGVjdG9yfSB7ICR7dGhpcy5zZXR0aW5ncy5jc3N9IH1gIDogJyc7XHJcblxyXG5cdFx0bGV0IGxhYmVsID0gdGhpcy5zZXR0aW5ncy5sYWJlbDtcclxuXHRcdGlmICggbGFiZWwgKSB7XHJcblx0XHRcdC8vIHJlcGxhY2UgYWxsIHVuZXNjYXBlZCBoYXNodGFncyB3aXRoIGltYWdlIGluZGV4XHJcblx0XHRcdGNvbnN0IG51bWJlcl9wYXR0ZXJuID0gLyhefFteXFxcXF0pIy9nO1xyXG5cdFx0XHRsYWJlbCA9IGxhYmVsLnJlcGxhY2UoIG51bWJlcl9wYXR0ZXJuLCBcIiQxJyBhdHRyKGRhdGEtaW1hZ2UtY2FwdGlvbi1pbmRleCkgJ1wiICk7ICAvLyBpbm5lciBxdW90ZXMgdXNlZCB0byBraWxsIHN0cmluZyBhbmQgaW5zZXJ0IGF0dHIuICsgYmV0d2VlbiBzdHJpbmdzIGJyZWFrcyBpdC5cclxuXHRcdFx0XHJcblx0XHRcdC8vIFJlcGxhY2UgZXNjYXBlZCBoYXNodGFncyB3aXRoIGhhc2h0YWdzXHJcblx0XHRcdGxhYmVsID0gbGFiZWwucmVwbGFjZSggJ1xcXFwjJywgJyMnICk7XHJcblxyXG5cdFx0XHRsYWJlbCA9IGAke0ltYWdlQ2FwdGlvblBsdWdpbi5jYXB0aW9uX3NlbGVjdG9yfTo6YmVmb3JlIHsgY29udGVudDogJyR7bGFiZWx9ICcgfWA7ICAvLyBhZGRpdGlvbmFsIHNwYWNlIGluIGNvbnRlbnQgaW50ZW50aW9uYWxcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnN0eWxlc2hlZXQuaW5uZXJUZXh0ID0gYCR7Y3NzfSAke2xhYmVsfWA7XHJcblx0fVxyXG5cclxuXHRyZW1vdmVDYXB0aW9ucygpIHtcclxuXHRcdGZvciAoIGNvbnN0IGNhcHRpb24gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggSW1hZ2VDYXB0aW9uUGx1Z2luLmNhcHRpb25fc2VsZWN0b3IgKSApIHtcclxuXHRcdFx0Y2FwdGlvbi5yZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0gIC8vIGVuZCBJbWFnZUNhcHRpb25QbHVnaW5cclxuXHJcblxyXG5jbGFzcyBJbWFnZUNhcHRpb25TZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XHJcblx0cGx1Z2luOiBJbWFnZUNhcHRpb25QbHVnaW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBhcHA6IEFwcCwgcGx1Z2luOiBJbWFnZUNhcHRpb25QbHVnaW4gKSB7XHJcblx0XHRzdXBlciggYXBwLCBwbHVnaW4gKTtcclxuXHRcdHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG5cdH1cclxuXHJcblx0ZGlzcGxheSgpOiB2b2lkIHtcclxuXHRcdGxldCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xyXG5cdFx0Y29udGFpbmVyRWwuZW1wdHkoKTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyggY29udGFpbmVyRWwgKVxyXG5cdFx0XHQuc2V0TmFtZSggJ0xhYmVsJyApXHJcblx0XHRcdC5zZXREZXNjKCAnUHJlcGVuZCB0aGlzIHRleHQgYmVmb3JlIGVhY2ggY2FwdGlvbi4nIClcclxuXHRcdFx0LmFkZFRleHQoICggdGV4dCApID0+IHRleHRcclxuXHRcdFx0XHQuc2V0UGxhY2Vob2xkZXIoICdMYWJlbCcgKVxyXG5cdFx0XHRcdC5zZXRWYWx1ZSggdGhpcy5wbHVnaW4uc2V0dGluZ3MubGFiZWwgKVxyXG5cdFx0XHRcdC5vbkNoYW5nZSggYXN5bmMgKCB2YWx1ZSApID0+IHtcclxuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmxhYmVsID0gdmFsdWUudHJpbSgpO1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi51cGRhdGVTdHlsZXNoZWV0KCk7XHJcblx0XHRcdFx0fSApXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoIGNvbnRhaW5lckVsIClcclxuXHRcdFx0LnNldE5hbWUoICdDU1MnIClcclxuXHRcdFx0LnNldERlc2MoICdDdXN0b20gQ1NTIHN0eWxpbmcgZm9yIGNhcHRpb25zLicgKVxyXG5cdFx0XHQuYWRkVGV4dEFyZWEoICggdGV4dCApID0+IHRleHRcclxuXHRcdFx0XHQuc2V0UGxhY2Vob2xkZXIoJ0VudGVyIHlvdXIgQ1NTJyApXHJcblx0XHRcdFx0LnNldFZhbHVlKCB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jc3MgKVxyXG5cdFx0XHRcdC5vbkNoYW5nZSggYXN5bmMgKCB2YWx1ZSApID0+IHtcclxuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmNzcyA9IHZhbHVlLnRyaW0oKTtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4udXBkYXRlU3R5bGVzaGVldCgpO1xyXG5cdFx0XHRcdH0gKVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdC8vIGRlbGltZXRlclxyXG5cdFx0Y29uc3QgZGVsaW1ldGVyID0gbmV3IFNldHRpbmcoIGNvbnRhaW5lckVsIClcclxuXHRcdFx0LnNldE5hbWUoICdEZWxpbWV0ZXInIClcclxuXHRcdFx0LnNldERlc2MoXHJcblx0XHRcdFx0J0lkZW50aWZ5IHRoZSBjYXB0aW9uIGJ5IHN1cnJvdW5kaW5nIGl0IHdpdGggdGhlIGRlbGltZXRlci4gJyArXHJcblx0XHRcdFx0J1N0YXJ0IGFuZCBlbmQgZGVsaW1ldGVycyBtYXlzIGJlIHNwZWNpZmllZCBieSBzZXBhcmF0aW9uIHdpdGggYSBjb21tYSAoLCkuJ1xyXG5cdFx0XHQpXHJcblx0XHRcdC5zZXRUb29sdGlwKFxyXG5cdFx0XHRcdCdJZiBubyBkZWxpbWV0ZXIgaXMgcHJvdmlkZWQgdGhlIGVudGlyZSBhbHQgdGV4dCBpcyB0YWtlbiB0byBiZSB0aGUgY2FwdGlvbi4gJyArXHJcblx0XHRcdFx0J0lmIGEgc2luZ2xlIGRlbGltZXRlciBpcyBzcGVjaWZpZWQgaXQgbXVzdCBpbmRpY2F0ZSB0aGUgc3RhcnQgYW5kIGVuZCBvZiB0aGUgY2FwdGlvbi4gJyArXHJcblx0XHRcdFx0J0lmIHR3byBkZWxpbWV0ZXJzIGFyZSBzcGVjaWZpZWQsIGJ5IHNlcGFyYXRpb24gd2l0aCBhIGNvbW1hLCB0aGUgY2FwdGlvbiBpcyB0YWtlbiB0byBiZSAnICtcclxuXHRcdFx0XHQndGhlIHRleHQgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBkZWxpbWV0ZXJzLidcclxuXHRcdFx0KTtcclxuXHJcblx0XHRkZWxpbWV0ZXIuYWRkVGV4dCggKCB0ZXh0ICkgPT4gdGV4dFxyXG5cdFx0XHQuc2V0UGxhY2Vob2xkZXIoICdEZWxpbWV0ZXInIClcclxuXHRcdFx0LnNldFZhbHVlKCB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWxpbWV0ZXIuam9pbiggJywgJyApIClcclxuXHRcdFx0Lm9uQ2hhbmdlKCBhc3luYyAoIHZhbHVlICkgPT4ge1xyXG5cdFx0XHRcdGxldCBkZWxpbWV0ZXJzID0gdmFsdWUuc3BsaXQoICcsJyApLm1hcCggZCA9PiBkLnRyaW0oKSApO1xyXG5cclxuXHRcdFx0XHQvLyB2YWxpZGF0ZSBzZXR0aW5nXHJcblx0XHRcdFx0aWYgKCBkZWxpbWV0ZXJzLmxlbmd0aCA+IDIgKSB7XHJcblx0XHRcdFx0XHQvLyB0b28gbWFueSBkZWxpbWV0ZXJzXHJcblx0XHRcdFx0XHRkZWxpbWV0ZXIuY29udHJvbEVsLmFkZENsYXNzKCAnc2V0dGluZy1lcnJvcicgKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICggZGVsaW1ldGVycy5sZW5ndGggPT09IDIgJiYgZGVsaW1ldGVycy5zb21lKCBkID0+ICFkICkgKSB7XHJcblx0XHRcdFx0XHQvLyBlbXB0eSBkZWxpbWV0ZXJcclxuXHRcdFx0XHRcdGRlbGltZXRlci5jb250cm9sRWwuYWRkQ2xhc3MoICdzZXR0aW5nLWVycm9yJyApO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gZGVsaW1ldGVycyB2YWxpZFxyXG5cdFx0XHRcdGlmICggZGVsaW1ldGVycy5sZW5ndGggPT09IDEgJiYgZGVsaW1ldGVyc1sgMCBdID09PSAnJyApIHtcclxuXHRcdFx0XHRcdC8vIG5vIGRlbGltZXRlciBzcGVjaWZpZWRcclxuXHRcdFx0XHRcdGRlbGltZXRlcnMgPSBbXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGRlbGltZXRlci5jb250cm9sRWwucmVtb3ZlQ2xhc3MoICdzZXR0aW5nLWVycm9yJyApO1xyXG5cdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmRlbGltZXRlciA9IGRlbGltZXRlcnM7XHJcblx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdH0gKVxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuIiwgImltcG9ydCB7XHJcblx0UGx1Z2luLFxyXG5cdE1hcmtkb3duUG9zdFByb2Nlc3NvcixcclxuXHRNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxyXG5cdE1hcmtkb3duUmVuZGVyQ2hpbGRcclxufSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5pbXBvcnQgSW1hZ2VDYXB0aW9uUGx1Z2luIGZyb20gJy4vbWFpbic7XHJcblxyXG5cclxuaW50ZXJmYWNlIEltYWdlU2l6ZSB7XHJcblx0d2lkdGg6IG51bWJlcjtcclxuXHRoZWlnaHQ6IG51bWJlclxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFJlZ2lzdGVycyBhIE11dGF0aW9uIE9ic2VydmVyIG9uIGFuIGltYWdlIHRvIGFkZCBhIGNhcHRpb24uXHJcbiAqIFRoZSBvYnNlcnZlciBpcyB1bnJlZ2lzdGVyZWQgYWZ0ZXIgdGhlIGNhcHRpb24gaGFzIGJlZW4gYWRkZWQuXHJcbiAqIE1lYW50IHRvIGJlIHVzZWQgZm9yIGludGVybmFsIGVtYmVkcy5cclxuICogIFxyXG4gKiBAcGFyYW0gcGx1Z2luIHtQbHVnaW59XHJcbiAqIEBwYXJhbSBjdHgge01hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHR9XHJcbiAqIEByZXR1cm5zIHtNdXRhdGlvbk9ic2VydmVyfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGludGVybmFsQ2FwdGlvbk9ic2VydmVyKFxyXG5cdHBsdWdpbjogUGx1Z2luLFxyXG5cdGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dFxyXG4pIHtcclxuXHRyZXR1cm4gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoICggbXV0YXRpb25zLCBvYnNlcnZlciApID0+IHtcclxuXHRcdGZvciAoIGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucyApIHtcclxuXHRcdFx0aWYgKCAhbXV0YXRpb24udGFyZ2V0Lm1hdGNoZXMoICdzcGFuLmltYWdlLWVtYmVkJyApICkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgY2FwdGlvbl90ZXh0ID0gbXV0YXRpb24udGFyZ2V0LmdldEF0dHJpYnV0ZSggJ2FsdCcgKTtcclxuXHRcdFx0aWYgKCBjYXB0aW9uX3RleHQgPT09IG11dGF0aW9uLnRhcmdldC5nZXRBdHRyaWJ1dGUoICdzcmMnICkgKSB7XHJcblx0XHRcdFx0Ly8gZGVmYXVsdCBjYXB0aW9uLCBza2lwXHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggbXV0YXRpb24udGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoIEltYWdlQ2FwdGlvblBsdWdpbi5jYXB0aW9uX3NlbGVjdG9yICkgKSB7XHJcblx0XHRcdFx0Ly8gY2FwdGlvbiBhbHJlYWR5IGFkZGVkXHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHBhcnNlZCA9IHBhcnNlQ2FwdGlvblRleHQoIGNhcHRpb25fdGV4dCwgcGx1Z2luLnNldHRpbmdzLmRlbGltZXRlciApO1xyXG5cdFx0XHRjb25zdCBzaXplID0gcGFyc2VkLnNpemU7XHJcblx0XHRcdGNhcHRpb25fdGV4dCA9IHBhcnNlZC50ZXh0O1xyXG5cclxuXHRcdFx0aWYgKCBjYXB0aW9uX3RleHQgKSB7XHJcblx0XHRcdFx0Y29uc3QgY2FwdGlvbiA9IGFkZENhcHRpb24oIG11dGF0aW9uLnRhcmdldCwgY2FwdGlvbl90ZXh0ICk7XHJcblx0XHRcdFx0Y3R4LmFkZENoaWxkKCBjYXB0aW9uICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggc2l6ZSApIHtcclxuXHRcdFx0XHRzZXRTaXplKCBtdXRhdGlvbi50YXJnZXQsIHNpemUgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSAgLy8gZW5kIGZvci4ub2ZcclxuXHJcblx0XHR1cGRhdGVGaWd1cmVJbmRpY2VzKCk7XHJcblx0XHRwbHVnaW4ucmVtb3ZlT2JzZXJ2ZXIoIG9ic2VydmVyICk7XHJcblxyXG5cdH0gKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBSZWdpc3RlcnMgYSBNdXRhdGlvbiBPYnNlcnZlciBvbiBhbiBpbWFnZSB0byBhZGQgYSBjYXB0aW9uLlxyXG4gKiBUaGUgb2JzZXJ2ZXIgaXMgdW5yZWdpc3RlcmVkIGFmdGVyIHRoZSBjYXB0aW9uIGhhcyBiZWVuIGFkZGVkLlxyXG4gKiBNZWFudCB0byBiZSB1c2VkIGZvciBleHRlcm5hbCBlbWJlZHMuXHJcbiAqICBcclxuICogQHBhcmFtIHBsdWdpbiB7UGx1Z2lufVxyXG4gKiBAcmV0dXJucyB7TXV0YXRpb25PYnNlcnZlcn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRlcm5hbENhcHRpb25PYnNlcnZlcihcclxuXHRwbHVnaW46IFBsdWdpblxyXG4pIHtcclxuXHRyZXR1cm4gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoICggbXV0YXRpb25zLCBvYnNlcnZlciApID0+IHtcclxuXHRcdGxldCB1cGRhdGUgPSBmYWxzZTtcclxuXHRcdGZvciAoIGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucyApIHtcclxuXHRcdFx0Y29uc3QgY2FwdGlvbnMgPSBbIC4uLm11dGF0aW9uLmFkZGVkTm9kZXMgXS5maWx0ZXIoXHJcblx0XHRcdFx0KCBlbG06IEhUTUxFbGVtZW50ICkgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVsbS5tYXRjaGVzKCBJbWFnZUNhcHRpb25QbHVnaW4uY2FwdGlvbl9zZWxlY3RvciApXHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0aWYgKCBjYXB0aW9ucy5sZW5ndGggKSB7XHJcblx0XHRcdFx0Ly8gbmV3IGNhcHRpb24gZXhpc3RzXHJcblx0XHRcdFx0dXBkYXRlID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdXBkYXRlICkge1xyXG5cdFx0XHR1cGRhdGVGaWd1cmVJbmRpY2VzKCk7XHJcblx0XHRcdHBsdWdpbi5yZW1vdmVPYnNlcnZlciggb2JzZXJ2ZXIgKTtcclxuXHRcdH1cclxuXHR9ICk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogUGFyc2VzIHRleHQgdG8gZXh0cmFjdCB0aGUgY2FwdGlvbiBhbmQgc2l6ZSBmb3IgdGhlIGltYWdlLlxyXG4gKiBcclxuICogQHBhcmFtIHRleHQge3N0cmluZ30gVGV4dCB0byBwYXJzZS5cclxuICogQHBhcmFtIGRlbGltZXRlciB7c3RyaW5nW119IERlbGltZXRlcihzKSB1c2VkIHRvIGluZGVpY2F0ZSBjYXB0aW9uIHRleHQuXHJcbiAqIEByZXR1cm5zIHsgeyBjYXB0aW9uOiBzdHJpbmcsIHNpemU/OiBJbWFnZVNpemUgfSB9XHJcbiAqIFx0XHRBbiBvYmVjdCBjb250YWluaW5nIHRoZSBjYXB0aW9uIHRleHQgYW5kIHNpemUuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZUNhcHRpb25UZXh0KCB0ZXh0OiBzdHJpbmcsIGRlbGltZXRlcjogc3RyaW5nW10gKTogc3RyaW5nIHwgbnVsbCB7XHJcblx0bGV0IHN0YXJ0LCBlbmQ7XHJcblx0bGV0IHN0YXJ0X2RlbGltLCBlbmRfZGVsaW07XHJcblx0aWYgKCBkZWxpbWV0ZXIubGVuZ3RoID09PSAwICkge1xyXG5cdFx0c3RhcnRfZGVsaW0gPSAnJztcclxuXHRcdGVuZF9kZWxpbSA9ICcnO1xyXG5cclxuXHRcdHN0YXJ0ID0gMDtcclxuXHRcdGVuZCA9IHRleHQubGVuZ3RoIC0gMTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIGRlbGltZXRlci5sZW5ndGggPT0gMSApIHtcclxuXHRcdC8vIHNpbmdsZSBkZWxpbWV0ZXIgY2hhcmFjdGVyXHJcblx0XHRzdGFydF9kZWxpbSA9IGRlbGltZXRlclsgMCBdO1xyXG5cdFx0ZW5kX2RlbGltID0gZGVsaW1ldGVyWyAwIF07XHJcblxyXG5cdFx0c3RhcnQgPSB0ZXh0LmluZGV4T2YoIHN0YXJ0X2RlbGltICk7XHJcblx0XHRlbmQgPSB0ZXh0Lmxhc3RJbmRleE9mKCBlbmRfZGVsaW0gKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAoIGRlbGltZXRlci5sZW5ndGggPT09IDIgKSB7XHJcblx0XHQvLyBzZXBhcmF0ZSBzdGFydCBhbmQgZW5kIGRlbGltZXRlclxyXG5cdFx0c3RhcnRfZGVsaW0gPSBkZWxpbWV0ZXJbIDAgXTtcclxuXHRcdGVuZF9kZWxpbSA9IGRlbGltZXRlclsgMSBdO1xyXG5cclxuXHRcdHN0YXJ0ID0gdGV4dC5pbmRleE9mKCBzdGFydF9kZWxpbSApO1xyXG5cdFx0ZW5kID0gdGV4dC5sYXN0SW5kZXhPZiggZW5kX2RlbGltICk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0Ly8gZXJyb3JcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHRleHQ6IHVuZGVmaW5lZCxcclxuXHRcdFx0c2l6ZTogdW5kZWZpbmVkXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Ly8gY2FwdGlvbiB0ZXh0XHJcblx0bGV0IGNhcHRpb24sIHJlbWFpbmluZ190ZXh0O1xyXG5cdGlmIChcclxuXHRcdHN0YXJ0ID09PSAtMSB8fFxyXG5cdFx0ZW5kID09PSAtMSB8fFxyXG5cdFx0c3RhcnQgPT09IGVuZCBcclxuXHQpIHtcclxuXHRcdGNhcHRpb24gPSB1bmRlZmluZWQ7XHJcblx0XHRyZW1haW5pbmdfdGV4dCA9IFsgdGV4dCBdO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdC8vIGV4Y2x1ZGUgZGVsaW1ldGVyc1xyXG5cdFx0Y29uc3Qgc3RhcnRfb2Zmc2V0ID0gc3RhcnRfZGVsaW0ubGVuZ3RoO1xyXG5cdFx0Y29uc3QgZW5kX29mZnNldCA9IGVuZF9kZWxpbS5sZW5ndGhcclxuXHJcblx0XHRjYXB0aW9uID0gdGV4dC5zbGljZSggc3RhcnQgKyBzdGFydF9vZmZzZXQsIGVuZCApO1xyXG5cdFx0cmVtYWluaW5nX3RleHQgPSBbXHJcblx0XHRcdHRleHQuc2xpY2UoIDAsIHN0YXJ0ICksXHJcblx0XHRcdHRleHQuc2xpY2UoIGVuZCArIGVuZF9vZmZzZXQgKVxyXG5cdFx0XTtcclxuXHR9XHJcblxyXG5cdC8vIHNpemVcclxuXHRsZXQgc2l6ZSA9IHBhcnNlU2l6ZSggcmVtYWluaW5nX3RleHRbIDAgXSApO1xyXG5cdGlmICggISBzaXplICkge1xyXG5cdFx0c2l6ZSA9IHBhcnNlU2l6ZSggcmVtYWluaW5nX3RleHRbIDEgXSApO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHsgdGV4dDogY2FwdGlvbiwgc2l6ZSB9O1xyXG59IFxyXG5cclxuXHJcbi8qKlxyXG4gKiBTZWFyY2hlcyBmb3IgYSBzaXplIHBhcmFtZXRlciBvZiB0aGUgZm9ybVxyXG4gKiA8d2lkdGg+eDxoZWlnaHQ+IHJldHVybmluZyB0aGUgcGFyYW1ldGVycyBpZiBmb3VuZC5cclxuICogXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGV4dCB0byBwYXJzZS5cclxuICogQHJldHVybnMge0ltYWdlU2l6ZXx1bmRlZmluZWR9IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgaW1hZ2Ugc2l6ZSxcclxuICogXHRcdG9yIHVuZGVmaW5lZCBpZiBub3QgZm91bmQuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZVNpemUoIHRleHQ6IHN0cmluZyApIHtcclxuXHRjb25zdCBzaXplX3BhdHRlcm4gPSAvKFxcZCspeChcXGQrKS9pO1xyXG5cdGNvbnN0IG1hdGNoID0gdGV4dC5tYXRjaCggc2l6ZV9wYXR0ZXJuICk7XHJcblx0aWYgKCAhIG1hdGNoICkge1xyXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHR3aWR0aDogbWF0Y2hbIDEgXSxcclxuXHRcdGhlaWdodDogbWF0Y2hbIDIgXVxyXG5cdH07XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogQWRkcyBhIGNhcHRpb24gdG8gYW4gaW1hZ2UuXHJcbiAqIFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXQgLSBQYXJlbnQgZWxlbWVudCBmb3IgdGhlIGNhcHRpb24uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjYXB0aW9uX3RleHQgLSBUZXh0IHRvIGFkZCBmb3IgdGhlIGNhcHRpb24uXHJcbiAqIEByZXR1cm5zIHtNYXJrZG93blJlbmRlckNoaWxkfSAtIENhcHRpb24gZWxlbWVudCB0aGF0IHdhcyBhZGRlZCB0byB0aGUgdGFyZ2V0IGFzIHRoZSBjYXB0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gYWRkQ2FwdGlvbihcclxuXHR0YXJnZXQ6IEhUTUxFbGVtZW50LFxyXG5cdGNhcHRpb25fdGV4dDogc3RyaW5nXHJcbik6IE1hcmtkb3duUmVuZGVyQ2hpbGQge1xyXG5cdGNvbnN0IGNhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBJbWFnZUNhcHRpb25QbHVnaW4uY2FwdGlvbl90YWcgKTtcclxuXHRjYXB0aW9uLmFkZENsYXNzKCBJbWFnZUNhcHRpb25QbHVnaW4uY2FwdGlvbl9jbGFzcyApO1xyXG5cdGNhcHRpb24uaW5uZXJUZXh0ID0gY2FwdGlvbl90ZXh0O1xyXG5cdHRhcmdldC5hcHBlbmRDaGlsZCggY2FwdGlvbiApO1xyXG5cclxuXHRyZXR1cm4gbmV3IE1hcmtkb3duUmVuZGVyQ2hpbGQoIGNhcHRpb24gKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IGZvciBhbiBpbWFnZS5cclxuICogXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldCAtIFBhcmVudCBlbGVtZW50IG9mIHRoZSBpbWFnZS5cclxuICogQHBhcmFtIHtJbWFnZVNpemV9IHNpemUgLSBXaWR0aCBhbmQgaGVpZ2h0IHZhbHVlcy5cclxuICovXHJcbmZ1bmN0aW9uIHNldFNpemUoXHJcblx0dGFyZ2V0OiBIVE1MRWxlbWVudCxcclxuXHRzaXplOiBJbWFnZVNpemVcclxuKSB7XHJcblx0Y29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBzaXplO1xyXG5cdGNvbnN0IGltZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCAnaW1nJyApO1xyXG5cclxuXHR0YXJnZXQuc2V0QXR0cmlidXRlKCAnd2lkdGgnLCB3aWR0aCApO1xyXG5cdHRhcmdldC5zZXRBdHRyaWJ1dGUoICdoZWlnaHQnLCBoZWlnaHQgKTtcclxuXHRpbWcuc2V0QXR0cmlidXRlKCAnd2lkdGgnLCB3aWR0aCApO1xyXG5cdGltZy5zZXRBdHRyaWJ1dGUoICdoZWlnaHQnLCBoZWlnaHQgKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIGluZGV4IGRhdGEgZm9yIGltYWdlcy5cclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUZpZ3VyZUluZGljZXMoKSB7XHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ2Rpdi53b3Jrc3BhY2UtbGVhZicgKS5mb3JFYWNoKFxyXG5cdFx0KCB3b3Jrc3BhY2U6IEhUTUxFbGVtZW50ICkgPT4ge1xyXG5cdFx0XHRsZXQgaW5kZXggPSAxO1xyXG5cdFx0XHR3b3Jrc3BhY2UucXVlcnlTZWxlY3RvckFsbCggSW1hZ2VDYXB0aW9uUGx1Z2luLmNhcHRpb25fc2VsZWN0b3IgKS5mb3JFYWNoKFxyXG5cdFx0XHRcdCggZWw6IEhUTUxFbGVtZW50ICkgPT4ge1xyXG5cdFx0XHRcdFx0ZWwuZGF0YXNldC5pbWFnZUNhcHRpb25JbmRleCA9IGluZGV4O1xyXG5cdFx0XHRcdFx0aW5kZXggKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0KTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBSZWdpc3RlcnMgTXV0YXRpb25PYnNlcnZlcnMgb24gaW50ZXJuYWwgaW1hZ2VzLlxyXG4gKiBcclxuICogQHBhcmFtIHtQbHVnaW59IHBsdWdpblxyXG4gKiBAcmV0dXJucyB7KEhUTUxFbGVtZW50LCBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0KSA9PiB2b2lkfVxyXG4gKiBcdFx0RnVuY3Rpb24gdGhhdCByZWdpc3RlcnMgaW50ZXJuYWwgaW1hZ2VzIHRvIGhhdmUgYSBjYXB0aW9uIGFkZGVkIHRvIHRoZW0uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0ludGVybmFsSW1hZ2VDYXB0aW9uKFxyXG5cdHBsdWdpbjogUGx1Z2luXHJcbik6ICggZWw6IEhUTUxFbGVtZW50LCBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQgKSA9PiB2b2lkIHtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIChcclxuXHRcdGVsOiBIVE1MRWxlbWVudCxcclxuXHRcdGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dFxyXG5cdCk6IHZvaWQge1xyXG5cdFx0ZWwucXVlcnlTZWxlY3RvckFsbCggJ3NwYW4uaW50ZXJuYWwtZW1iZWQnICkuZm9yRWFjaChcclxuXHRcdFx0KCBjb250YWluZXI6IEhUTUxFbGVtZW50ICkgPT4ge1xyXG5cdFx0XHRcdC8vIG11c3QgbGlzdGVuIGZvciBjbGFzcyBjaGFuZ2VzIGJlY2F1c2UgaW1hZ2VzXHJcblx0XHRcdFx0Ly8gbWF5IGJlIGxvYWRlZCBhZnRlciB0aGlzIHJ1blxyXG5cdFx0XHRcdGNvbnN0IG9ic2VydmVyID0gaW50ZXJuYWxDYXB0aW9uT2JzZXJ2ZXIoIHBsdWdpbiwgY3R4ICk7XHJcblx0XHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZShcclxuXHRcdFx0XHRcdGNvbnRhaW5lcixcclxuXHRcdFx0XHRcdHsgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlc0ZpbHRlcjogWyAnY2xhc3MnIF0gfVxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdHBsdWdpbi5hZGRPYnNlcnZlciggb2JzZXJ2ZXIgKTtcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHR9O1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2FwdGlvbiB0byBleHRlcm5hbCBpbWFnZXMuXHJcbiAqIFxyXG4gKiBAcGFyYW0ge1BsdWdpbn0gcGx1Z2luXHJcbiAqIEByZXR1cm5zIHsoSFRNTEVsZW1lbnQsIE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQpID0+IHZvaWR9XHJcbiAqIFx0XHRGdW5jdGlvbiB0aGF0IHJlZ2lzdGVycyBleHRlcm5hbCBpbWFnZXMgdG8gaGF2ZSBhIGNhcHRpb24gYWRkZWQgdG8gdGhlbS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzRXh0ZXJuYWxJbWFnZUNhcHRpb24oXHJcblx0cGx1Z2luOiBQbHVnaW5cclxuKTogKCBlbDogSFRNTEVsZW1lbnQsIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCApID0+IHZvaWQge1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gKFxyXG5cdFx0ZWw6IEhUTUxFbGVtZW50LFxyXG5cdFx0Y3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0XHJcblx0KTogdm9pZCB7XHJcblx0XHRjb25zdCBjb250YWluZXJfY3NzX2NsYXNzID0gJ29ic2lkaWFuLWltYWdlLWNhcHRpb24tZXh0ZXJuYWwtZW1iZWQnO1xyXG5cclxuXHRcdGVsbXMgPSBbIC4uLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoICdpbWcnICkgXTtcclxuXHRcdGVsbXMuZmlsdGVyKCAoIGVsbTogSFRNTEVsZW1lbnQgKSA9PiB7XHJcblx0XHRcdC8vIGZpbHRlciBvdXQgaW50ZXJuYWwgaW1hZ2VzXHJcblx0XHRcdHJldHVybiAhIGVsbS5jbG9zZXN0KCAnc3Bhbi5pbnRlcm5hbC1lbWJlZCcgKTtcclxuXHRcdH0gKS5mb3JFYWNoKFxyXG5cdFx0XHQoIGltZzogSFRNTEVsZW1lbnQgKSA9PiB7XHJcblx0XHRcdFx0aWYgKCBpbWcuY2xvc2VzdCggYC4ke2NvbnRhaW5lcl9jc3NfY2xhc3N9YCApICkge1xyXG5cdFx0XHRcdFx0Ly8gY2FwdGlvbiBhbHJlYWR5IGFkZGVkXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgY2FwdGlvbl90ZXh0ID0gaW1nLmdldEF0dHJpYnV0ZSggJ2FsdCcgKTtcclxuXHRcdFx0XHRjb25zdCBwYXJzZWQgPSBwYXJzZUNhcHRpb25UZXh0KFxyXG5cdFx0XHRcdFx0Y2FwdGlvbl90ZXh0LFxyXG5cdFx0XHRcdFx0cGx1Z2luLnNldHRpbmdzLmRlbGltZXRlclxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y29uc3Qgc2l6ZSA9IHBhcnNlZC5zaXplO1xyXG5cdFx0XHRcdGNhcHRpb25fdGV4dCA9IHBhcnNlZC50ZXh0O1xyXG5cdFx0XHRcdGlmICggISggY2FwdGlvbl90ZXh0IHx8IHNpemUgKSApIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIGNyZWF0ZSBjb250YWluZXJcclxuXHRcdFx0XHRjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcclxuXHRcdFx0XHRjb250YWluZXIuYWRkQ2xhc3MoIGNvbnRhaW5lcl9jc3NfY2xhc3MgKTtcclxuXHJcblx0XHRcdFx0Ly8gb2JzZXJ2ZSBjb250YWluZXIgZm9yIGNhcHRpb24gdG8gYmUgYWRkZWRcclxuXHRcdFx0XHRjb25zdCBvYnNlcnZlciA9IGV4dGVybmFsQ2FwdGlvbk9ic2VydmVyKCBwbHVnaW4sIGN0eCApO1xyXG5cdFx0XHRcdG9ic2VydmVyLm9ic2VydmUoXHJcblx0XHRcdFx0XHRjb250YWluZXIsXHJcblx0XHRcdFx0XHR7IGNoaWxkTGlzdDogdHJ1ZSB9XHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0cGx1Z2luLmFkZE9ic2VydmVyKCBvYnNlcnZlciApO1xyXG5cclxuXHRcdFx0XHQvLyBpbnNlcnQgY29udGFpbmVyIGludG8gRE9NXHJcblx0XHRcdFx0aW1nLnJlcGxhY2VXaXRoKCBjb250YWluZXIgKTtcclxuXHRcdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIGltZyApO1xyXG5cclxuXHRcdFx0XHQvLyBhZGQgY2FwdGlvblxyXG5cdFx0XHRcdGlmICggY2FwdGlvbl90ZXh0ICkge1xyXG5cdFx0XHRcdFx0Y29uc3QgY2FwdGlvbiA9IGFkZENhcHRpb24oIGNvbnRhaW5lciwgY2FwdGlvbl90ZXh0ICk7XHJcblxyXG5cdFx0XHRcdFx0Y3R4LmFkZENoaWxkKCBuZXcgTWFya2Rvd25SZW5kZXJDaGlsZCggY29udGFpbmVyICkgKTtcclxuXHRcdFx0XHRcdGN0eC5hZGRDaGlsZCggY2FwdGlvbiApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gc2V0IHNpemVcclxuXHRcdFx0XHRpZiAoIHNpemUgKSB7XHJcblx0XHRcdFx0XHRzZXRTaXplKCBjb250YWluZXIsIHNpemUgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblx0fTtcclxufSJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUtPOzs7QUNMUCxzQkFLTztBQW9CQSxpQ0FDTixRQUNBLEtBQ0M7QUFDRCxTQUFPLElBQUksaUJBQWtCLENBQUUsV0FBVyxhQUFjO0FBQ3ZELGVBQVksWUFBWSxXQUFZO0FBQ25DLFVBQUssQ0FBQyxTQUFTLE9BQU8sUUFBUyxxQkFBdUI7QUFDckQ7QUFBQTtBQUdELFVBQUksZUFBZSxTQUFTLE9BQU8sYUFBYztBQUNqRCxVQUFLLGlCQUFpQixTQUFTLE9BQU8sYUFBYyxRQUFVO0FBRTdEO0FBQUE7QUFHRCxVQUFLLFNBQVMsT0FBTyxjQUFlLG1CQUFtQixtQkFBcUI7QUFFM0U7QUFBQTtBQUdELFlBQU0sU0FBUyxpQkFBa0IsY0FBYyxPQUFPLFNBQVM7QUFDL0QsWUFBTSxPQUFPLE9BQU87QUFDcEIscUJBQWUsT0FBTztBQUV0QixVQUFLLGNBQWU7QUFDbkIsY0FBTSxVQUFVLFdBQVksU0FBUyxRQUFRO0FBQzdDLFlBQUksU0FBVTtBQUFBO0FBR2YsVUFBSyxNQUFPO0FBQ1gsZ0JBQVMsU0FBUyxRQUFRO0FBQUE7QUFBQTtBQUk1QjtBQUNBLFdBQU8sZUFBZ0I7QUFBQTtBQUFBO0FBY2xCLGlDQUNOLFFBQ0M7QUFDRCxTQUFPLElBQUksaUJBQWtCLENBQUUsV0FBVyxhQUFjO0FBQ3ZELFFBQUks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QUFDeEIsQUFMUixtQkFLUSxtQkFBMkIsR0FBRyxvQkFBbUIsZUFBZSxvQkFBbUI7QUErRTNGLDJDQUFxQyxrQ0FBaUI7QUFBQSxFQUdyRCxZQUFhLEtBQVUsUUFBNkI7QUFDbkQsVUFBTyxLQUFLO0FBQ1osU0FBSyxTQUFTO0FBQUE7QUFBQSxFQUdmLFVBQWdCO0FBQ2YsUUFBSSxFQUFFLGdCQUFnQjtBQUN0QixnQkFBWTtBQUVaLFFBQUkseUJBQVMsYUFDWCxRQUFTLFNBQ1QsUUFBUywwQ0FDVCxRQUFTLENBQUUsU0FBVSxLQUNwQixlQUFnQixTQUNoQixTQUFVLEtBQUssT0FBTyxTQUFTLE9BQy9CLFNBQVUsQ0FBUSxVQUFXO0FBQzdCLFdBQUssT0FBTyxTQUFTLFFBQVEsTUFBTTtBQUNuQyxZQUFNLEtBQUssT0FBTztBQUNsQixXQUFLLE9BQU87QUFBQTtBQUlmLFFBQUkseUJBQVMsYUFDWCxRQUFTLE9BQ1QsUUFBUyxvQ0FDVCxZQUFhLENBQUUsU0FBVSxLQUN4QixlQUFlLGtCQUNmLFNBQVUsS0FBSyxPQUFPLFNBQVMsS0FDL0IsU0FBVSxDQUFRLFVBQVc7QUFDN0IsV0FBSyxPQUFPLFNBQVMsTUFBTSxNQUFNO0FBQ2pDLFlBQU0sS0FBSyxPQUFPO0FBQ2xCLFdBQUssT0FBTztBQUFBO0FBS2YsVUFBTSxZQUFZLElBQUkseUJBQVMsYUFDN0IsUUFBUyxhQUNULFFBQ0EseUlBR0EsV0FDQTtBQU1GLGNBQVUsUUFBUyxDQUFFLFNBQVUsS0FDN0IsZUFBZ0IsYUFDaEIsU0FBVSxLQUFLLE9BQU8sU0FBUyxVQUFVLEtBQU0sT0FDL0MsU0FBVSxDQUFRLFVBQVc7QUFDN0IsVUFBSSxhQUFhLE1BQU0sTUFBTyxLQUFNLElBQUssT0FBSyxFQUFFO0FBR2hELFVBQUssV0FBVyxTQUFTLEdBQUk7QUFFNUIsa0JBQVUsVUFBVSxTQUFVO0FBQzlCO0FBQUE7QUFHRCxVQUFLLFdBQVcsV0FBVyxLQUFLLFdBQVcsS0FBTSxPQUFLLENBQUMsSUFBTTtBQUU1RCxrQkFBVSxVQUFVLFNBQVU7QUFDOUI7QUFBQTtBQUlELFVBQUssV0FBVyxXQUFXLEtBQUssV0FBWSxPQUFRLElBQUs7QUFFeEQscUJBQWE7QUFBQTtBQUdkLGdCQUFVLFVBQVUsWUFBYTtBQUNqQyxXQUFLLE9BQU8sU0FBUyxZQUFZO0FBQ2pDLFlBQU0sS0FBSyxPQUFPO0FBQUE7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
