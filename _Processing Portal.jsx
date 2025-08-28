//by portal2001
"use strict";
var G_SETTINGS;
var K = {
    s2t: function (s) { return stringIDToTypeID(s); },
    c2t: function (c) { return charIDToTypeID(c); },
    AS: "as", IN: "in", COPY: "copy", SAVE: "save", QUALITY: "quality",
    WEBP_FORMAT: "WebPFormat", COMPRESSION: "compression", WEBP_COMPRESSION: "WebPCompression",
    COMPRESSION_LOSSY: "compressionLossy", INCLUDE_XMP: "includeXMPData",
    INCLUDE_EXIF: "includeEXIFData", INCLUDE_PS_EXTRAS: "includePsExtras",
    WEBP_SHOP: "WebPShop", LOSSLESS: "lossless", INCLUDE_METADATA: "includeMetadata",
    ASET: "ASet", ACTN: "Actn", NAME: "Nm  "
};
var SETTINGS_ID = "processingPortalSettings_v5";

(function () {
    showDialog();
})();
function saveSetting(key, value) {
    var desc = new ActionDescriptor();
    switch (typeof value) {
        case "boolean": desc.putBoolean(K.s2t(key), value); break;
        case "string": desc.putString(K.s2t(key), value); break;
        case "number": desc.putDouble(K.s2t(key), value); break;
    }
    app.putCustomOptions(SETTINGS_ID, desc, false);
}
function getSetting(key, defaultValue) {
    try {
        var desc = app.getCustomOptions(SETTINGS_ID);
        if (!desc.hasKey(K.s2t(key))) return defaultValue;
        var type = desc.getType(K.s2t(key));
        switch (type) {
            case DescValueType.BOOLEANTYPE: return desc.getBoolean(K.s2t(key));
            case DescValueType.STRINGTYPE: return desc.getString(K.s2t(key));
            case DescValueType.DOUBLETYPE: return desc.getDouble(K.s2t(key));
            default: return defaultValue;
        }
    } catch (e) {
        return defaultValue;
    }
}
function showDialog() {
    var win = new Window("dialog", "Processing Portal (v5.5)");
    win.orientation = "column";
    win.alignChildren = "fill";
    win.spacing = 10;
    win.margins = 15;
    var ui = {};
    ui.infoText = win.add("statictext", undefined, "Files will be saved into a subfolder next to each original file.", { multiline: true });
    ui.infoText.graphics.font = ScriptUI.newFont("dialog", "ITALIC", 13);
    var sourcePanel = win.add("panel", undefined, "Source & Destination");
    sourcePanel.orientation = "column";
    sourcePanel.alignChildren = ["fill", "top"];
    sourcePanel.margins = 15;
    ui.processFolderCheckbox = sourcePanel.add("checkbox", undefined, "Process folder on disk (instead of open files)");
    var folderGroup = sourcePanel.add("group", undefined, { orientation: "column", alignChildren: ["fill", "top"], margins: [15, 5, 0, 0] });
    folderGroup.visible = false;
    var inputGroup = folderGroup.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    inputGroup.add("statictext", undefined, "Input Folder: ");
    ui.inputPathText = inputGroup.add("edittext", undefined, "", { readonly: true });
    ui.inputPathText.preferredSize.width = 280;
    var inputBrowseBtn = inputGroup.add("button", undefined, "Browse...");
    var outputGroup = folderGroup.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    outputGroup.add("statictext", undefined, "Output Folder (optional):");
    ui.outputPathText = outputGroup.add("edittext", undefined, "", { readonly: true });
    ui.outputPathText.preferredSize.width = 230;
    var outputBrowseBtn = outputGroup.add("button", undefined, "Browse...");
    var formatPanel = win.add("panel", undefined, "Export Format");
    formatPanel.alignChildren = "fill";
    formatPanel.margins = 15;
    var formatGroup = formatPanel.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    formatGroup.add("statictext", undefined, "Save as type:");
    ui.formatDropdown = formatGroup.add("dropdownlist", undefined, ["WebP", "JPEG", "PNG", "TIFF"]);
    var optionsGroup = formatPanel.add("group", undefined, { orientation: "stack" });
    var webp_jpeg_Group = optionsGroup.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    webp_jpeg_Group.add("statictext", undefined, "Quality:");
    ui.qualitySlider = webp_jpeg_Group.add("slider", undefined, 75, 0, 100);
    ui.qualitySlider.size = [150, 20];
    ui.qualityText = webp_jpeg_Group.add("edittext", undefined, "75", { characters: 4 });
    var pngGroup = optionsGroup.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    pngGroup.add("statictext", undefined, "Compression:");
    ui.pngCompressionDropdown = pngGroup.add("dropdownlist", undefined, ["None / Fast", "Smallest File Size"]);
    var tiffGroup = optionsGroup.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    tiffGroup.add("statictext", undefined, "Compression:");
    ui.tiffCompressionDropdown = tiffGroup.add("dropdownlist", undefined, ["NONE", "LZW", "ZIP"]);
    var processingPanel = win.add("panel", undefined, "Processing Options");
    processingPanel.orientation = "row";
    processingPanel.alignChildren = ["fill", "top"];
    processingPanel.spacing = 20;
    processingPanel.margins = 15;
    var leftColumn = processingPanel.add("group", undefined, { orientation: "column", alignChildren: ["left", "top"], spacing: 10 });
    leftColumn.add("statictext", undefined, "Dimensions:").graphics.font = ScriptUI.newFont("dialog", "BOLD", 13);
    var fitImageGroup = leftColumn.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    ui.fitImageCheckbox = fitImageGroup.add("checkbox", undefined, "Fit Longest Edge:");
    ui.fitImageInput = fitImageGroup.add("edittext", undefined, "1920", { characters: 5 });
    var ppiGroup = leftColumn.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    ui.ppiCheckbox = ppiGroup.add("checkbox", undefined, "Set PPI Value:");
    ui.ppiInput = ppiGroup.add("edittext", undefined, "300", { characters: 5 });
    leftColumn.add("statictext", undefined, "Color Profile:").graphics.font = ScriptUI.newFont("dialog", "BOLD", 13);
    ui.colorProfileDropdown = leftColumn.add("dropdownlist", undefined, ["Convert to sRGB", "Convert to Grayscale", "Keep Current Profile"]);
    var rightColumn = processingPanel.add("group", undefined, { orientation: "column", alignChildren: ["left", "top"], spacing: 10 });
    rightColumn.add("statictext", undefined, "Metadata:").graphics.font = ScriptUI.newFont("dialog", "BOLD", 13);
    ui.xmpDataCheckbox = rightColumn.add("checkbox", undefined, "Include XMP Data");
    ui.exifDataCheckbox = rightColumn.add("checkbox", undefined, "Include EXIF Data");
    ui.psDataCheckbox = rightColumn.add("checkbox", undefined, "Include Photoshop Data");
    var actionPanel = win.add("panel", undefined, "Run Action (Optional)");
    actionPanel.alignChildren = "fill";
    actionPanel.margins = 15;
    var actionSetGroup = actionPanel.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    actionSetGroup.add("statictext", undefined, "Action Set:");
    ui.actionSetDropdown = actionSetGroup.add("dropdownlist", undefined, undefined, { preferredSize: [350, 25] });
    var actionGroup = actionPanel.add("group", undefined, { orientation: "row", alignChildren: ["left", "center"] });
    actionGroup.add("statictext", undefined, "      Action:");
    ui.actionDropdown = actionGroup.add("dropdownlist", undefined, undefined, { preferredSize: [350, 25] });
    var bottomGroup = win.add("group", undefined, { orientation: "row", alignChildren: ["middle", "fill"] });
    ui.keepOpenCheckbox = bottomGroup.add("checkbox", undefined, "Keep Originals Open");
    ui.overwriteCheckbox = bottomGroup.add("checkbox", undefined, "Overwrite Existing");
    ui.hideProgressCheckbox = bottomGroup.add("checkbox", undefined, "Hide Progress");
    var buttonGroup = bottomGroup.add("group", undefined, { orientation: "row", alignment: ["right", "center"] });
    buttonGroup.add("button", undefined, "Cancel", { name: "cancel" });
    var okButton = buttonGroup.add("button", undefined, "OK", { name: "ok" });
    function updateFormatOptions() {
        var selectedFormat = ui.formatDropdown.selection.text;
        if (ui.processFolderCheckbox.value) {
            if (ui.outputPathText.text === "" || ui.outputPathText.text === ui.inputPathText.text) {
                ui.infoText.text = "Files will be saved into a '" + selectedFormat.toLowerCase() + "' subfolder inside the Input folder.";
            } else {
                ui.infoText.text = "Files will be saved from the Input folder directly into the Output folder.";
            }
        } else {
            ui.infoText.text = "Files will be saved into a '" + selectedFormat.toLowerCase() + "' subfolder next to each original file.";
        }
        webp_jpeg_Group.visible = selectedFormat === "WebP" || selectedFormat === "JPEG";
        pngGroup.visible = selectedFormat === "PNG";
        tiffGroup.visible = selectedFormat === "TIFF";
        ui.psDataCheckbox.enabled = selectedFormat === "WebP";
        if (selectedFormat !== "WebP") ui.psDataCheckbox.value = false;
        var isWebP = selectedFormat === "WebP";
        var grayscaleOption = ui.colorProfileDropdown.find("Convert to Grayscale");
        if (grayscaleOption) grayscaleOption.enabled = !isWebP;
        if (isWebP && ui.colorProfileDropdown.selection.text === "Convert to Grayscale") {
            ui.colorProfileDropdown.selection = ui.colorProfileDropdown.find("Convert to sRGB");
        }
    }
    ui.formatDropdown.onChange = updateFormatOptions;
    ui.inputPathText.onChange = updateFormatOptions;
    ui.outputPathText.onChange = updateFormatOptions;
    ui.processFolderCheckbox.onClick = function () {
        folderGroup.visible = this.value;
        ui.keepOpenCheckbox.enabled = !this.value;
        if (this.value) ui.keepOpenCheckbox.value = false;
        updateFormatOptions();
    };
    inputBrowseBtn.onClick = function () { var folder = Folder.selectDialog("Select the Input Folder"); if (folder) { ui.inputPathText.text = folder.fsName; updateFormatOptions(); } };
    outputBrowseBtn.onClick = function () { var folder = Folder.selectDialog("Select the Output Folder"); if (folder) { ui.outputPathText.text = folder.fsName; updateFormatOptions(); } };
    ui.qualitySlider.onChanging = function () { ui.qualityText.text = Math.round(this.value); };
    ui.qualityText.onChange = function () { var val = parseInt(this.text); if (!isNaN(val) && val >= 0 && val <= 100) ui.qualitySlider.value = val; else this.text = Math.round(ui.qualitySlider.value); };
    ui.fitImageCheckbox.onClick = function () { ui.fitImageInput.enabled = this.value; };
    ui.ppiCheckbox.onClick = function () { ui.ppiInput.enabled = this.value; };
    ui.actionSetDropdown.add("item", "--- No Action Set Selected ---");
    var allActionSets = getActionSets();
    if (allActionSets) { for (var i = 0; i < allActionSets.length; i++) { ui.actionSetDropdown.add("item", allActionSets[i]); } }
    ui.actionDropdown.add("item", "--- No Action Selected ---");
    ui.actionSetDropdown.onChange = function () {
        ui.actionDropdown.removeAll();
        ui.actionDropdown.add("item", "--- No Action Selected ---");
        ui.actionDropdown.selection = 0;
        if (this.selection.index > 0) { var allActions = getActions(this.selection.text); if (allActions) { for (var i = 0; i < allActions.length; i++) { ui.actionDropdown.add("item", allActions[i]); } } }
    };
    function loadSettings() {
        ui.formatDropdown.selection = ui.formatDropdown.find(getSetting("outputFormat", "WebP")) || 0;
        ui.pngCompressionDropdown.selection = getSetting("pngCompression", 1);
        ui.tiffCompressionDropdown.selection = getSetting("tiffCompression", 1);
        ui.colorProfileDropdown.selection = getSetting("colorProfile", 0);
        ui.qualitySlider.value = getSetting("quality", 75);
        ui.qualityText.text = Math.round(ui.qualitySlider.value);
        ui.fitImageCheckbox.value = getSetting("fitImage", false);
        ui.fitImageInput.text = getSetting("fitImageValue", 1920);
        ui.fitImageInput.enabled = ui.fitImageCheckbox.value;
        ui.ppiCheckbox.value = getSetting("setPPI", false);
        ui.ppiInput.text = getSetting("ppiValue", 300);
        ui.ppiInput.enabled = ui.ppiCheckbox.value;
        ui.xmpDataCheckbox.value = getSetting("includeXMP", false);
        ui.exifDataCheckbox.value = getSetting("includeEXIF", false);
        ui.psDataCheckbox.value = getSetting("includePSData", false);
        ui.keepOpenCheckbox.value = getSetting("keepOpen", true);
        ui.overwriteCheckbox.value = getSetting("overwrite", false);
        ui.hideProgressCheckbox.value = getSetting("hideProgress", true);
        ui.processFolderCheckbox.value = getSetting("processFolder", false);
        ui.inputPathText.text = getSetting("inputPath", "");
        ui.outputPathText.text = getSetting("outputPath", "");
        ui.processFolderCheckbox.onClick();
        var savedSet = getSetting("actionSet", "--- No Action Set Selected ---");
        ui.actionSetDropdown.selection = ui.actionSetDropdown.find(savedSet) || 0;
        ui.actionSetDropdown.onChange();
        var savedAction = getSetting("actionName", "--- No Action Selected ---");
        ui.actionDropdown.selection = ui.actionDropdown.find(savedAction) || 0;
        updateFormatOptions();
    }
    okButton.onClick = function () {
        if (ui.processFolderCheckbox.value && ui.inputPathText.text === "") return alert("Please select an Input folder.");
        if (ui.fitImageCheckbox.value && (!parseInt(ui.fitImageInput.text) || parseInt(ui.fitImageInput.text) <= 0)) return alert("Please enter a valid, positive number for the longest edge.");
        if (ui.ppiCheckbox.value && (!parseInt(ui.ppiInput.text) || parseInt(ui.ppiInput.text) <= 0)) return alert("Please enter a valid, positive number for the PPI value.");
        saveSetting("outputFormat", ui.formatDropdown.selection.text);
        saveSetting("quality", Math.round(ui.qualitySlider.value));
        G_SETTINGS = {
            processFolder: ui.processFolderCheckbox.value,
            inputPath: ui.inputPathText.text,
            outputPath: ui.outputPathText.text,
            outputFormat: ui.formatDropdown.selection.text,
            quality: Math.round(ui.qualitySlider.value),
            pngCompression: ui.pngCompressionDropdown.selection.index,
            tiffCompression: ui.tiffCompressionDropdown.selection.text,
            xmpData: ui.xmpDataCheckbox.value,
            exifData: ui.exifDataCheckbox.value,
            psData: ui.psDataCheckbox.value,
            colorProfile: ui.colorProfileDropdown.selection.text,
            fitValue: ui.fitImageCheckbox.value ? parseInt(ui.fitImageInput.text) : null,
            ppi: ui.ppiCheckbox.value ? parseInt(ui.ppiInput.text) : null,
            actionSet: ui.actionSetDropdown.selection.index > 0 ? ui.actionSetDropdown.selection.text : null,
            actionName: ui.actionDropdown.selection.index > 0 ? ui.actionDropdown.selection.text : null,
            hideProgress: ui.hideProgressCheckbox.value,
            keepOpen: ui.keepOpenCheckbox.value,
            overwrite: ui.overwriteCheckbox.value,
        };
        win.close();
        startProcessing();
    };
    loadSettings();
    win.center();
    win.show();
}
function startProcessing() {
    var savedDisplayDialogs = app.displayDialogs;
    app.displayDialogs = DialogModes.NO;
    try {
        if (G_SETTINGS.processFolder) {
            processFolderOnDisk();
        } else {
            processOpenDocs();
        }
    } catch (e) {
        alert("An unexpected error occurred: " + e);
    }
    app.displayDialogs = savedDisplayDialogs;
    app.beep();
}
function processOpenDocs() {
    if (app.documents.length === 0) return alert("There are no open documents to process.");
    var totalDocs = app.documents.length;
    var processedCount = 0;
    var skippedCount = 0;
    var errors = [];
    var progressWin, progressText, progressBar;
    if (!G_SETTINGS.hideProgress) {
        progressWin = new Window("palette", "Processing Open Files...", undefined, { closeButton: false });
        progressWin.alignChildren = "fill";
        progressText = progressWin.add("statictext", undefined, "Starting...");
        progressBar = progressWin.add("progressbar", undefined, 0, totalDocs);
        progressWin.show();
    }
    for (var i = totalDocs - 1; i >= 0; i--) {
        var doc = app.documents[i];
        app.activeDocument = doc;
        if (!G_SETTINGS.hideProgress) {
            var progressIndex = totalDocs - i;
            progressText.text = "Processing (" + progressIndex + "/" + totalDocs + "): " + doc.name;
            progressBar.value = progressIndex;
            app.refresh();
        }
        var sourcePath;
        try {
            sourcePath = doc.path;
        } catch (e) {
            skippedCount++;
            continue;
        }
        var outputFolder = new Folder(sourcePath + "/" + G_SETTINGS.outputFormat.toLowerCase());
        if (!outputFolder.exists) outputFolder.create();
        try {
            var escapedPath = outputFolder.fsName.replace(/\\/g, "\\\\");
            doc.suspendHistory(
                "Process with Portal",
                "runConversion(new Folder('" + escapedPath + "'))"
            );
            if (!G_SETTINGS.keepOpen) doc.close(SaveOptions.DONOTSAVECHANGES);
            processedCount++;
        } catch (e) {
            errors.push("Failed on '" + doc.name + "': " + e.message);
        }
    }
    if (!G_SETTINGS.hideProgress) progressWin.close();
    var summary = "Batch Complete!\n\nProcessed: " + processedCount + " files.\n";
    if (skippedCount > 0) summary += "Skipped: " + skippedCount + " unsaved files.\n";
    if (errors.length > 0) summary += "\nErrors (" + errors.length + "):\n- " + errors.join("\n- ");
    alert(summary);
}
function processFolderOnDisk() {
    var inputFolder = new Folder(G_SETTINGS.inputPath);
    var outputFolder;
    if (G_SETTINGS.outputPath === "" || G_SETTINGS.outputPath === G_SETTINGS.inputPath) {
        outputFolder = new Folder(G_SETTINGS.inputPath + "/" + G_SETTINGS.outputFormat.toLowerCase());
    } else {
        outputFolder = new Folder(G_SETTINGS.outputPath);
    }
    if (!outputFolder.exists) {
        if (!outputFolder.create()) {
            return alert("Error: Could not create output folder. Please check permissions.\n" + decodeURI(outputFolder.fsName));
        }
    }
    var fileList = inputFolder.getFiles(/\.(jpg|jpeg|tif|tiff|psd|psb|png|gif|webp)$/i);
    if (fileList.length === 0) return alert("No compatible image files were found.");
    var totalFiles = fileList.length;
    var processedCount = 0;
    var errors = [];
    var progressWin, progressText, progressBar;
    if (!G_SETTINGS.hideProgress) {
        progressWin = new Window("palette", "Processing Folder...", undefined, { closeButton: false });
        progressWin.alignChildren = "fill";
        progressText = progressWin.add("statictext", undefined, "Starting...");
        progressBar = progressWin.add("progressbar", undefined, 0, totalFiles);
        progressWin.show();
    }
    for (var i = 0; i < totalFiles; i++) {
        var file = fileList[i];
        if (!G_SETTINGS.hideProgress) {
            progressText.text = "Processing (" + (i + 1) + "/" + totalFiles + "): " + decodeURI(file.name);
            progressBar.value = i + 1;
            app.refresh();
        }
        try {
            var doc = app.open(file);
            runConversion(outputFolder);
            doc.close(SaveOptions.DONOTSAVECHANGES);
            processedCount++;
        } catch (e) {
            errors.push("Failed on '" + decodeURI(file.name) + "': " + e.message);
            if (app.documents.length > 0) try { app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); } catch (err) { }
        }
    }
    if (!G_SETTINGS.hideProgress) {
        progressWin.close();
    }

    var summary = "Batch Complete!\n\n" +
        "Successfully Processed: " + processedCount + " of " + totalFiles + " files.\n";

    if (errors.length > 0) {
        summary += "Failed to Process: " + errors.length + " files.\n\n" +
                   "ERRORS:\n- " + errors.join("\n- ");
    }

    summary += "\n\nOutput Location:\n" + decodeURI(outputFolder.fsName);
    alert(summary);
}

function runConversion(outputFolder) {
    if (G_SETTINGS.outputFormat === "WebP" && activeDocument.mode !== DocumentMode.RGB) activeDocument.changeMode(ChangeMode.RGB);
    if (G_SETTINGS.colorProfile === "Convert to Grayscale") {
        if (activeDocument.mode !== DocumentMode.GRAYSCALE) activeDocument.changeMode(ChangeMode.GRAYSCALE);
    } else if (G_SETTINGS.colorProfile === "Convert to sRGB") {
        if (activeDocument.mode !== DocumentMode.RGB) activeDocument.changeMode(ChangeMode.RGB);
        try { activeDocument.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, false); } catch (e) { }
    }
    if (activeDocument.bitsPerChannel != BitsPerChannelType.EIGHT) activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
    if (G_SETTINGS.actionSet && G_SETTINGS.actionName) runAction(G_SETTINGS.actionSet, G_SETTINGS.actionName);
    if (G_SETTINGS.fitValue !== null || G_SETTINGS.ppi !== null) fitImage(G_SETTINGS.fitValue, G_SETTINGS.ppi);
    var docName = activeDocument.name.replace(/\.[^\.]+$/, "");
    var saveFile;
    var saveOptions;
    var fileExtensionMap = { "WebP": ".webp", "JPEG": ".jpg", "PNG": ".png", "TIFF": ".tif" };
    var extension = fileExtensionMap[G_SETTINGS.outputFormat];
    saveFile = new File(outputFolder + "/" + docName + extension);
    if (!G_SETTINGS.overwrite && saveFile.exists) {
        throw new Error("File already exists and overwrite is disabled.");
    }
    switch (G_SETTINGS.outputFormat) {
        case "WebP": saveWebP(saveFile); break;
        case "JPEG":
            saveOptions = new JPEGSaveOptions();
            saveOptions.quality = Math.round((G_SETTINGS.quality / 100) * 12);
            saveOptions.embedColorProfile = true;
            saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
            activeDocument.saveAs(saveFile, saveOptions, true);
            break;
        case "PNG":
            saveOptions = new PNGSaveOptions();
            saveOptions.compression = G_SETTINGS.pngCompression === 0 ? 0 : 9;
            saveOptions.interlaced = false;
            activeDocument.saveAs(saveFile, saveOptions, true);
            break;
        case "TIFF":
            saveOptions = new TiffSaveOptions();
            if (G_SETTINGS.tiffCompression === "LZW") saveOptions.imageCompression = TIFFEncoding.TIFFLZW;
            else if (G_SETTINGS.tiffCompression === "ZIP") saveOptions.imageCompression = TIFFEncoding.TIFFZIP;
            else saveOptions.imageCompression = TIFFEncoding.NONE;
            saveOptions.layers = false;
            activeDocument.saveAs(saveFile, saveOptions, true);
            break;
    }
}

function saveWebP(saveFile) {
    var isModernVersion = parseInt(app.version.split(".")[0]) >= 23;
    var desc = new ActionDescriptor();
    var saveOpts = new ActionDescriptor();
    if (isModernVersion) {
        saveOpts.putEnumerated(K.s2t(K.COMPRESSION), K.s2t(K.WEBP_COMPRESSION), K.s2t(K.COMPRESSION_LOSSY));
        saveOpts.putInteger(K.s2t(K.QUALITY), G_SETTINGS.quality);
        saveOpts.putBoolean(K.s2t(K.INCLUDE_XMP), G_SETTINGS.xmpData);
        saveOpts.putBoolean(K.s2t(K.INCLUDE_EXIF), G_SETTINGS.exifData);
        saveOpts.putBoolean(K.s2t(K.INCLUDE_PS_EXTRAS), G_SETTINGS.psData);
        desc.putObject(K.s2t(K.AS), K.s2t(K.WEBP_FORMAT), saveOpts);
    } else {
        try { K.s2t(K.WEBP_SHOP); }
        catch (e) { throw new Error("The Google WebPShop plugin is not installed..."); }
        saveOpts.putBoolean(K.s2t(K.LOSSLESS), false);
        saveOpts.putInteger(K.s2t(K.QUALITY), G_SETTINGS.quality);
        saveOpts.putBoolean(K.s2t(K.INCLUDE_METADATA), G_SETTINGS.xmpData || G_SETTINGS.exifData);
        desc.putObject(K.s2t(K.AS), K.s2t(K.WEBP_SHOP), saveOpts);
    }
    desc.putPath(K.s2t(K.IN), saveFile);
    desc.putBoolean(K.s2t(K.COPY), true);
    executeAction(K.s2t(K.SAVE), desc, DialogModes.NO);
}

function fitImage(fitValue, ppi) {
    var doc = activeDocument;
    var resampleMethod = ResampleMethod.BICUBIC;
    if (fitValue !== null && ppi !== null) {
        if (doc.height.value > doc.width.value) doc.resizeImage(null, UnitValue(fitValue, "px"), ppi, resampleMethod);
        else doc.resizeImage(UnitValue(fitValue, "px"), null, ppi, resampleMethod);
    } else if (fitValue !== null) {
        if (doc.height.value > doc.width.value) doc.resizeImage(null, UnitValue(fitValue, "px"), doc.resolution, resampleMethod);
        else doc.resizeImage(UnitValue(fitValue, "px"), null, doc.resolution, resampleMethod);
    } else if (ppi !== null) {
        doc.resizeImage(undefined, undefined, ppi, ResampleMethod.NONE);
    }
}

function getActionSets() {
    var sets = [];
    try {
        var i = 1;
        while (true) {
            var ref = new ActionReference();
            ref.putIndex(K.c2t(K.ASET), i);
            var desc = executeActionGet(ref);
            sets.push(desc.getString(K.c2t(K.NAME)));
            i++;
        }
    } catch (e) { }
    return sets;
}

function getActions(setName) {
    var actions = [];
    try {
        var i = 1;
        while (true) {
            var ref = new ActionReference();
            ref.putIndex(K.c2t(K.ACTN), i);
            ref.putName(K.c2t(K.ASET), setName);
            var desc = executeActionGet(ref);
            actions.push(desc.getString(K.c2t(K.NAME)));
            i++;
        }
    } catch (e) { }
    return actions;
}

function runAction(actionSet, actionName) {
    try { app.doAction(actionSet, actionName); } catch (e) { }
}
