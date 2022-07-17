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

function escapeStringRegexp(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}

class MarkdownNode {
    constructor(text, level) {
        this.text = text;
        this.level = level;
        this.children = [];
    }
    append(node) {
        node.parent = this;
        this.children.push(node);
    }
    appendFirst(child) {
        this.children.unshift(child);
        child.parent = this;
    }
    appendSibling(node) {
        const indexOfThis = this.parent.children.findIndex((b) => b === this);
        this.parent.children.splice(indexOfThis + 1, 0, node);
    }
    remove(child) {
        child.parent = null;
        this.children.splice(this.children.indexOf(child), 1);
    }
    removeSelf() {
        this.parent.remove(this);
    }
    getNthAncestor(targetLevel) {
        let pointer = this;
        for (let level = 0; level < targetLevel; level++) {
            pointer = pointer.parent;
        }
        return pointer;
    }
}

class Block extends MarkdownNode {
    constructor(text, level, type) {
        super(text, level);
        this.children = [];
        this.type = type;
    }
    // TODO: TreeWalker will replace this
    findRecursively(matcher) {
        if (matcher(this)) {
            return this;
        }
        for (const child of this.children) {
            const found = child.findRecursively(matcher);
            if (found !== null) {
                return found;
            }
        }
        return null;
    }
    stringify() {
        const lines = [];
        // TODO: this should not handle the root block
        if (this.text !== null) {
            lines.push(this.text);
        }
        for (const block of this.children) {
            lines.push(...block.stringify());
        }
        return lines;
    }
}

class BlockParser {
    constructor(settings) {
        this.LIST_ITEM = /^(?<indentation>(?: {2}|\t)*)(?<listMarker>[-*]|\d+\.)\s/;
        this.INDENTED_LINE = /^(?<indentation>(?: {2}|\t)+)[^-]/;
        this.settings = settings;
    }
    parse(lines) {
        const flatBlocks = this.parseFlatBlocks(lines);
        const [root, children] = [flatBlocks[0], flatBlocks.slice(1)];
        this.buildTree(root, children);
        return root;
    }
    buildTree(root, flatBlocks) {
        let context = root;
        for (const block of flatBlocks) {
            // TODO: the logic for lists is idential to the logic for sections
            if (block.type === "list") {
                const stepsUpToSection = context.level - block.level;
                if (stepsUpToSection >= 0) {
                    const targetLevel = stepsUpToSection + 1;
                    context = context.getNthAncestor(targetLevel);
                }
                context.append(block);
                context = block;
            }
            else {
                const isTopLine = block.level === 1;
                if (isTopLine) {
                    context = root;
                }
                context.append(block);
            }
        }
    }
    parseFlatBlocks(lines) {
        const flatBlocks = [new Block(null, 0, "root")];
        for (const line of lines) {
            const listMatch = line.match(this.LIST_ITEM);
            const indentedLineMatch = line.match(this.INDENTED_LINE);
            if (listMatch) {
                const level = this.getLineLevelByIndentation(listMatch.groups.indentation);
                const block = new Block(line, level, "list");
                flatBlocks.push(block);
            }
            else if (indentedLineMatch) {
                const level = this.getLineLevelByIndentation(indentedLineMatch.groups.indentation);
                const block = new Block(line, level, "text");
                flatBlocks.push(block);
            }
            else {
                flatBlocks.push(new Block(line, 1, "text"));
            }
        }
        return flatBlocks;
    }
    getLineLevelByIndentation(indentation) {
        let levelsOfIndentation;
        if (this.settings.useTab) {
            levelsOfIndentation = indentation.length;
        }
        else {
            levelsOfIndentation = Math.ceil(indentation.length / this.settings.tabSize);
        }
        return levelsOfIndentation + 1;
    }
}

class Section extends MarkdownNode {
    constructor(text, level, blockContent) {
        super(text, level);
        this.blockContent = blockContent;
    }
    // TODO: TreeWalker should make this obsolete
    extractBlocksRecursively(filter) {
        const extracted = [];
        for (const block of this.blockContent.children) {
            if (!filter.blockFilter || filter.blockFilter(block)) {
                extracted.push(block);
            }
        }
        for (const block of extracted) {
            block.removeSelf();
        }
        for (const section of this.children) {
            if (!filter.sectionFilter || filter.sectionFilter(section)) {
                extracted.push(...section.extractBlocksRecursively(filter));
            }
        }
        return extracted;
    }
    stringify() {
        const lines = [];
        if (this.text) {
            lines.push(this.text);
        }
        for (const tree of [this.blockContent.children, this.children]) {
            for (const child of tree) {
                lines.push(...child.stringify());
            }
        }
        return lines;
    }
}

class SectionParser {
    constructor(settings) {
        this.HEADING = /^(?<headingToken>#+)\s.*$/;
        this.settings = settings;
    }
    parse(lines) {
        const rawSections = this.parseRawSections(lines);
        const flatSections = this.parseBlocksInSections(rawSections);
        const [root, children] = [flatSections[0], flatSections.slice(1)];
        this.buildTree(root, children);
        return root;
    }
    parseRawSections(lines) {
        const sections = [{ text: null, level: 0, lines: [] }];
        for (const line of lines) {
            const match = line.match(this.HEADING);
            if (match) {
                sections.push({
                    text: match[0],
                    level: match.groups.headingToken.length,
                    lines: [],
                });
            }
            else {
                const lastSection = sections[sections.length - 1];
                lastSection.lines.push(line);
            }
        }
        return sections;
    }
    parseBlocksInSections(raw) {
        return raw.map((s) => {
            return new Section(s.text, s.level, new BlockParser(this.settings).parse(s.lines));
        });
    }
    buildTree(root, flatSections) {
        let context = root;
        for (const section of flatSections) {
            const stepsUpToSection = context.level - section.level;
            if (stepsUpToSection >= 0) {
                const stepsUpToParent = stepsUpToSection + 1;
                context = context.getNthAncestor(stepsUpToParent);
            }
            context.append(section);
            context = section;
        }
    }
}

class Archiver {
    constructor(settings) {
        this.settings = settings;
        const escapedHeading = escapeStringRegexp(settings.archiveHeading);
        this.archivePattern = new RegExp(`^#+\\s+${escapedHeading}`);
        this.dateLevels = [];
        if (settings.useWeeks) {
            this.dateLevels.push("weeks");
        }
        if (settings.useDays) {
            this.dateLevels.push("days");
        }
        this.dateFormats = new Map([
            ["days", this.settings.dailyNoteFormat],
            ["weeks", this.settings.weeklyNoteFormat],
        ]);
        this.indentation = this.buildIndentation();
        this.parser = new SectionParser(this.settings.indentationSettings);
    }
    archiveTasksToSameFile(linesWithTasks) {
        const treeWithTasks = this.parser.parse(linesWithTasks);
        const newlyCompletedTasks = this.extractNewlyCompletedTasks(treeWithTasks);
        if (newlyCompletedTasks.length === 0) {
            return {
                summary: "No tasks to archive",
                lines: linesWithTasks,
            };
        }
        const archiveSection = this.getOrCreateArchiveSectionIn(treeWithTasks);
        this.archive(archiveSection, newlyCompletedTasks);
        const lines = treeWithTasks.stringify();
        return {
            summary: `Archived ${newlyCompletedTasks.length} tasks`,
            lines: lines,
        };
    }
    archiveTasksToSeparateFile(linesWithTasks, archive) {
        // TODO: copypasted part
        const treeWithTasks = this.parser.parse(linesWithTasks);
        const newlyCompletedTasks = this.extractNewlyCompletedTasks(treeWithTasks);
        if (newlyCompletedTasks.length === 0) {
            return {
                summary: "No tasks to archive",
                lines: linesWithTasks,
            };
        }
        const archiveSection = this.parser.parse(archive);
        this.archive(archiveSection, newlyCompletedTasks);
        return {
            summary: `Archived ${newlyCompletedTasks.length} tasks`,
            lines: treeWithTasks.stringify(),
            archiveLines: archiveSection.stringify(),
        };
    }
    archive(archiveSection, completedTasks) {
        const archiveBlock = archiveSection.blockContent;
        this.appendCompletedTasks(archiveBlock, completedTasks);
        this.addNewLinesIfNeeded(archiveBlock);
    }
    getOrCreateArchiveSectionIn(section) {
        // TODO: (later) works only for top level sections
        // Archives are always top-level, even when people use ## as top-level
        // But people can use # for file names
        // Define an option: top-level archive heading level. Heading-specific archives are the ones that are one level below top headings
        let archiveSection = section.children.find((s) => this.archivePattern.test(s.text));
        if (!archiveSection) {
            if (this.settings.addNewlinesAroundHeadings) {
                this.ensureNewlineFor(section);
            }
            const heading = this.buildArchiveHeading();
            const rootBlock = new Block(null, 0, "root");
            archiveSection = new Section(heading, 1, rootBlock);
            section.append(archiveSection);
        }
        return archiveSection;
    }
    ensureNewlineFor(section) {
        let lastSection = section;
        const childrenLength = section.children.length;
        if (childrenLength > 0) {
            lastSection = section.children[childrenLength - 1];
        }
        const blocksLength = lastSection.blockContent.children.length;
        if (blocksLength > 0) {
            const lastBlock = lastSection.blockContent.children[blocksLength - 1];
            // TODO: another needless null check
            if (lastBlock.text && lastBlock.text.trim().length !== 0) {
                // TODO: add an abstraction like appendText, appendListItem
                lastSection.blockContent.append(new Block("", 1, "text"));
            }
        }
    }
    extractNewlyCompletedTasks(tree) {
        // TODO: the AST should not leak details about bullets or heading tokens
        // TODO: duplicated regex
        const filter = {
            // TODO: another needless null test
            blockFilter: (block) => block.text !== null &&
                /^(?<listMarker>[-*]|\d+\.) \[x\]/.test(block.text),
            sectionFilter: (section) => !this.archivePattern.test(section.text),
        };
        return tree.extractBlocksRecursively(filter);
    }
    appendCompletedTasks(contents, newCompletedTasks) {
        let parentBlock = contents;
        // TODO: cludge for newlines
        parentBlock.children = parentBlock.children.filter((b) => b.text !== null && b.text.trim().length > 0);
        for (const [i, level] of this.dateLevels.entries()) {
            const indentedDateLine = this.buildDateLine(i, level);
            const thisDateInArchive = contents.findRecursively((b) => b.text !== null && b.text === indentedDateLine);
            if (thisDateInArchive !== null) {
                parentBlock = thisDateInArchive;
            }
            else {
                // TODO, this will break once I stringify based on levels
                const newBlock = new Block(indentedDateLine, 1, "list");
                contents.append(newBlock);
                parentBlock = newBlock;
            }
        }
        // TODO: Don't add indentation manually. Do it based on level while stringifying things
        const indentation = this.indentation.repeat(this.dateLevels.length);
        // TODO: TreeWalker will make this obsolete
        const addIndentationRecursively = (block) => {
            block.text = indentation + block.text;
            block.children.forEach(addIndentationRecursively);
        };
        newCompletedTasks.forEach((block) => {
            addIndentationRecursively(block);
            parentBlock.append(block);
        });
    }
    buildDateLine(lineLevel, dateTreeLevel) {
        const thisMoment = window.moment();
        const dateFormat = this.dateFormats.get(dateTreeLevel);
        const date = thisMoment.format(dateFormat);
        return this.indentation.repeat(lineLevel) + `- [[${date}]]`;
    }
    buildIndentation() {
        const settings = this.settings.indentationSettings;
        return settings.useTab ? "\t" : " ".repeat(settings.tabSize);
    }
    buildArchiveHeading() {
        // TODO: if there is no archive heading, I should build an ast, not a manual thing
        const headingToken = "#".repeat(this.settings.archiveHeadingDepth);
        return `${headingToken} ${this.settings.archiveHeading}`;
    }
    addNewLinesIfNeeded(blockContent) {
        if (this.settings.addNewlinesAroundHeadings) {
            // TODO: leaking details about block types
            blockContent.appendFirst(new Block("", 1, "text"));
            blockContent.append(new Block("", 1, "text"));
        }
    }
}

const DEFAULT_SETTINGS = {
    archiveHeading: "Archived",
    archiveHeadingDepth: 1,
    weeklyNoteFormat: "YYYY-MM-[W]-w",
    useWeeks: true,
    dailyNoteFormat: "YYYY-MM-DD",
    useDays: false,
    addNewlinesAroundHeadings: true,
    indentationSettings: {
        useTab: true,
        tabSize: 4,
    },
    archiveToSeparateFile: false,
    defaultArchiveFileName: "% (archive)",
};
class ObsidianTaskArchiver extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addCommand({
                id: "archive-tasks",
                name: "Archive tasks in this file",
                callback: () => this.archiveTasksInCurrentFile(),
            });
            yield this.loadSettings();
            this.addSettingTab(new ArchiverSettingTab(this.app, this));
        });
    }
    archiveTasksInCurrentFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeFile = this.app.workspace.getActiveFile();
            if (activeFile === null || activeFile.extension !== "md") {
                new obsidian.Notice("The archiver works only in markdown (.md) files!");
                return;
            }
            const activeFileContents = yield this.app.vault.read(activeFile);
            const activeFileLines = activeFileContents.split("\n");
            const archiver = new Archiver(this.settings);
            if (this.settings.archiveToSeparateFile) {
                const archiveFileHandle = yield this.getArchiveForFile(activeFile);
                const archiveFileContents = yield this.app.vault.read(archiveFileHandle);
                const archiveFileLines = archiveFileContents.split("\n");
                const archiveResult = archiver.archiveTasksToSeparateFile(activeFileLines, archiveFileLines);
                new obsidian.Notice(archiveResult.summary);
                this.app.vault.modify(activeFile, archiveResult.lines.join("\n"));
                this.app.vault.modify(archiveFileHandle, archiveResult.archiveLines.join("\n"));
            }
            else {
                const archiveResult = archiver.archiveTasksToSameFile(activeFileLines);
                new obsidian.Notice(archiveResult.summary);
                this.app.vault.modify(activeFile, archiveResult.lines.join("\n"));
            }
        });
    }
    getArchiveForFile(activeFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const archiveFileName = this.settings.defaultArchiveFileName.replace("%", activeFile.basename) + ".md";
            // TODO: archiving to a folder will happen here
            let archiveFile = this.app.vault.getAbstractFileByPath(archiveFileName);
            if (!archiveFile) {
                try {
                    archiveFile = yield this.app.vault.create(archiveFileName, "");
                }
                catch (error) {
                    console.error(`Unable to create an archive file with the name '${archiveFileName}'`);
                }
            }
            archiveFile = this.app.vault.getAbstractFileByPath(archiveFileName);
            if (!(archiveFile instanceof obsidian.TFile)) {
                throw new Error(`${archiveFileName} is a folder, not a file`);
            }
            return archiveFile;
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const getConfig = (key) => {
                return this.app.vault.getConfig(key);
            };
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData(), {
                indentationSettings: {
                    useTab: getConfig("useTab"),
                    tabSize: getConfig("tabSize"),
                },
            });
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
class ArchiverSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Obsidian Task Archiver Settings" });
        new obsidian.Setting(containerEl)
            .setName("Archive to a separate file")
            .setDesc("If checked, the archiver will search for a file based on the pattern and will try to create it if needed")
            .addToggle((toggleComponent) => {
            toggleComponent
                .setValue(this.plugin.settings.archiveToSeparateFile)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.archiveToSeparateFile = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Separate archive file name")
            .setDesc("If archiving to a separate file is on, replace the '%' with the active file name and try to find a file with this base name")
            .addText((textComponent) => {
            textComponent
                .setValue(this.plugin.settings.defaultArchiveFileName)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.defaultArchiveFileName = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Archive heading")
            .setDesc("A heading with this text will be used as an archive")
            .addText((textComponent) => {
            textComponent
                .setPlaceholder(this.plugin.settings.archiveHeading)
                .setValue(this.plugin.settings.archiveHeading)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.archiveHeading = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Add newlines around the archive")
            .setDesc("Add newlines around the contents of archive headings")
            .addToggle((toggleComponent) => {
            toggleComponent
                .setValue(this.plugin.settings.addNewlinesAroundHeadings)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.addNewlinesAroundHeadings = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Depth of new archive headings")
            .setDesc("New archives will be created by repeating '#' this many times")
            .addDropdown((dropdownComponent) => {
            dropdownComponent
                .addOptions({
                "1": "1",
                "2": "2",
                "3": "3",
                "4": "4",
                "5": "5",
                "6": "6",
            })
                .setValue(String(this.plugin.settings.archiveHeadingDepth))
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.archiveHeadingDepth =
                    Number(value);
                yield this.plugin.saveSettings();
            }));
        });
        containerEl.createEl("h3", { text: "Date tree" });
        new obsidian.Setting(containerEl)
            .setName("Use weeks")
            .setDesc("Add completed tasks under a link to the current week")
            .addToggle((toggleComponent) => toggleComponent
            .setValue(this.plugin.settings.useWeeks)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.useWeeks = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setDisabled(!this.plugin.settings.useWeeks)
            .setName("Weekly note pattern")
            .then((setting) => {
            setting.addMomentFormat((momentFormat) => {
                setting.descEl.appendChild(createFragment((fragment) => {
                    fragment.appendText("For more syntax, refer to ");
                    fragment.createEl("a", {
                        text: "format reference",
                        href: "https://momentjs.com/docs/#/displaying/format/",
                    }, (a) => {
                        a.setAttr("target", "_blank");
                    });
                    fragment.createEl("br");
                    fragment.appendText("Your current syntax looks like this: ");
                    momentFormat.setSampleEl(fragment.createEl("b"));
                    fragment.createEl("br");
                }));
                momentFormat
                    .setDefaultFormat(this.plugin.settings.weeklyNoteFormat)
                    .setPlaceholder(this.plugin.settings.weeklyNoteFormat)
                    .setValue(this.plugin.settings.weeklyNoteFormat)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.weeklyNoteFormat = value;
                    yield this.plugin.saveSettings();
                }));
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Use days")
            .setDesc("Add completed tasks under a link to the current day")
            .addToggle((toggleComponent) => toggleComponent
            .setValue(this.plugin.settings.useDays)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.useDays = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setDisabled(!this.plugin.settings.useDays)
            .setName("Daily note pattern")
            .then((setting) => {
            setting.addMomentFormat((momentFormat) => {
                setting.descEl.appendChild(createFragment((fragment) => {
                    fragment.appendText("For more syntax, refer to ");
                    fragment.createEl("a", {
                        text: "format reference",
                        href: "https://momentjs.com/docs/#/displaying/format/",
                    }, (a) => {
                        a.setAttr("target", "_blank");
                    });
                    fragment.createEl("br");
                    fragment.appendText("Your current syntax looks like this: ");
                    momentFormat.setSampleEl(fragment.createEl("b"));
                    fragment.createEl("br");
                }));
                momentFormat
                    .setDefaultFormat(this.plugin.settings.dailyNoteFormat)
                    .setPlaceholder(this.plugin.settings.dailyNoteFormat)
                    .setValue(this.plugin.settings.dailyNoteFormat)
                    .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.dailyNoteFormat = value;
                    yield this.plugin.saveSettings();
                }));
            });
        });
    }
}

module.exports = ObsidianTaskArchiver;
