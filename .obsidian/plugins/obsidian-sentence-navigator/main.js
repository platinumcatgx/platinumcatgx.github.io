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

// main.ts
__export(exports, {
  default: () => SentenceNavigator
});
var import_obsidian = __toModule(require("obsidian"));

// constants.ts
var WHOLE_SENTENCE = /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/gm;

// utils.ts
var getCursorAndParagraphText = (editor) => {
  const cursorPosition = editor.getCursor();
  return {
    cursorPosition,
    paragraphText: editor.getLine(cursorPosition.line)
  };
};
var forEachSentence = (paragraphText, callback) => {
  const sentences = paragraphText.matchAll(WHOLE_SENTENCE);
  for (const sentence of sentences) {
    callback(sentence);
  }
};
var setCursorAtStartOfLine = (editor, line) => {
  editor.setCursor({
    line,
    ch: 0
  });
};
var setCursorAtEndOfLine = (editor, line) => {
  editor.setCursor({
    line,
    ch: editor.getLine(line).length
  });
};
var setCursorAtNextWordCharacter = ({
  editor,
  cursorPosition,
  paragraphText,
  direction
}) => {
  let ch = cursorPosition.ch;
  if (direction === "start") {
    while (ch > 0 && paragraphText.charAt(ch - 1) === " ") {
      ch--;
    }
  } else {
    while (ch < paragraphText.length && paragraphText.charAt(ch) === " ") {
      ch++;
    }
  }
  editor.setCursor({
    ch,
    line: cursorPosition.line
  });
};
var getPrevNonEmptyLine = (editor, currentLine) => {
  let prevLine = currentLine - 1;
  while (prevLine > 0 && editor.getLine(prevLine).length === 0) {
    prevLine--;
  }
  return prevLine;
};
var getNextNonEmptyLine = (editor, currentLine) => {
  let nextLine = currentLine + 1;
  while (nextLine < editor.lineCount() && editor.getLine(nextLine).length === 0) {
    nextLine++;
  }
  return nextLine;
};

// actions.ts
var deleteToBoundary = (editor, boundary) => {
  let { cursorPosition, paragraphText } = getCursorAndParagraphText(editor);
  const originalCursorPosition = cursorPosition;
  if (paragraphText.charAt(cursorPosition.ch) === " " || paragraphText.charAt(cursorPosition.ch - 1) === " ") {
    setCursorAtNextWordCharacter({
      editor,
      cursorPosition,
      paragraphText,
      direction: boundary
    });
    ({ cursorPosition, paragraphText } = getCursorAndParagraphText(editor));
  }
  let done = false;
  forEachSentence(paragraphText, (sentence) => {
    if (!done && cursorPosition.ch >= sentence.index && cursorPosition.ch <= sentence.index + sentence[0].length) {
      if (boundary === "start") {
        const newParagraph = paragraphText.substring(0, sentence.index) + paragraphText.substring(originalCursorPosition.ch);
        const cutPortionLength = paragraphText.length - newParagraph.length;
        editor.setLine(cursorPosition.line, newParagraph);
        editor.setCursor({
          line: cursorPosition.line,
          ch: originalCursorPosition.ch - cutPortionLength
        });
      } else {
        const remainingSentenceLength = sentence.index + sentence[0].length - cursorPosition.ch;
        const newParagraph = paragraphText.substring(0, originalCursorPosition.ch) + paragraphText.substring(cursorPosition.ch + remainingSentenceLength);
        editor.setLine(cursorPosition.line, newParagraph);
        editor.setCursor(originalCursorPosition);
      }
      done = true;
    }
  });
};
var moveToStartOfCurrentSentence = (editor) => {
  let { cursorPosition, paragraphText } = getCursorAndParagraphText(editor);
  if (cursorPosition.ch === 0) {
    setCursorAtEndOfLine(editor, getPrevNonEmptyLine(editor, cursorPosition.line));
  }
  ({ cursorPosition, paragraphText } = getCursorAndParagraphText(editor));
  forEachSentence(paragraphText, (sentence) => {
    const startOfSentence = sentence.index;
    while (cursorPosition.ch > 0 && paragraphText.charAt(cursorPosition.ch - 1) === " ") {
      editor.setCursor({
        line: cursorPosition.line,
        ch: cursorPosition.ch - 1
      });
      ({ cursorPosition, paragraphText } = getCursorAndParagraphText(editor));
    }
    if (cursorPosition.ch > startOfSentence && startOfSentence + sentence[0].length >= cursorPosition.ch) {
      const newPosition = startOfSentence;
      editor.setCursor({
        line: cursorPosition.line,
        ch: newPosition
      });
      if (newPosition >= paragraphText.length) {
        setCursorAtStartOfLine(editor, getPrevNonEmptyLine(editor, cursorPosition.line));
      }
    }
  });
};
var moveToStartOfNextSentence = (editor) => {
  let { cursorPosition, paragraphText } = getCursorAndParagraphText(editor);
  if (cursorPosition.ch === paragraphText.length) {
    setCursorAtStartOfLine(editor, getNextNonEmptyLine(editor, cursorPosition.line));
  } else {
    forEachSentence(paragraphText, (sentence) => {
      const startOfSentence = sentence.index;
      const endOfSentence = startOfSentence + sentence[0].length;
      while (cursorPosition.ch < paragraphText.length && paragraphText.charAt(cursorPosition.ch) === " ") {
        editor.setCursor({
          line: cursorPosition.line,
          ch: cursorPosition.ch + 1
        });
        ({ cursorPosition, paragraphText } = getCursorAndParagraphText(editor));
      }
      if (cursorPosition.ch >= startOfSentence && cursorPosition.ch <= endOfSentence) {
        const newPosition = {
          line: cursorPosition.line,
          ch: endOfSentence
        };
        setCursorAtNextWordCharacter({
          editor,
          cursorPosition: newPosition,
          paragraphText,
          direction: "end"
        });
        if (endOfSentence >= paragraphText.length) {
          setCursorAtStartOfLine(editor, getNextNonEmptyLine(editor, cursorPosition.line));
        }
      }
    });
  }
};
var selectSentence = (editor) => {
  const { cursorPosition, paragraphText } = getCursorAndParagraphText(editor);
  let found = false;
  forEachSentence(paragraphText, (sentence) => {
    if (!found && cursorPosition.ch <= sentence.index + sentence[0].length) {
      editor.setSelection({ line: cursorPosition.line, ch: sentence.index }, {
        line: cursorPosition.line,
        ch: sentence.index + sentence[0].length + 1
      });
      found = true;
    }
  });
};

// main.ts
var SentenceNavigator = class extends import_obsidian.Plugin {
  onload() {
    this.addCommand({
      id: "backward-delete-sentence",
      name: "Delete to beginning of sentence",
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Backspace" }],
      editorCallback: (editor) => deleteToBoundary(editor, "start")
    });
    this.addCommand({
      id: "forward-delete-sentence",
      name: "Delete to end of sentence",
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Delete" }],
      editorCallback: (editor) => deleteToBoundary(editor, "end")
    });
    this.addCommand({
      id: "move-start-current-sentence",
      name: "Move to start of current sentence",
      editorCallback: (editor) => moveToStartOfCurrentSentence(editor)
    });
    this.addCommand({
      id: "move-start-next-sentence",
      name: "Move to start of next sentence",
      editorCallback: (editor) => moveToStartOfNextSentence(editor)
    });
    this.addCommand({
      id: "select-sentence",
      name: "Select current sentence",
      editorCallback: (editor) => selectSentence(editor)
    });
  }
};
