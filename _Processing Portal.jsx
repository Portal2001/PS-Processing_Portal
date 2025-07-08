//by portal2001
(function () {
  if (
    parseInt(app.version.split(".")[0]) < 23 &&
    getSetting("outputFormat", "WebP") === "WebP"
  ) {
    return alert(
      "You must use Photoshop 2022 (v23) or later to save using the native WebP format."
    );
  }
  showDialog();
})();
function saveSetting(key, value) {
  var desc = new ActionDescriptor();
  switch (typeof value) {
    case "boolean":
      desc.putBoolean(stringIDToTypeID(key), value);
      break;
    case "string":
      desc.putString(stringIDToTypeID(key), value);
      break;
    case "number":
      desc.putDouble(stringIDToTypeID(key), value);
      break;
    default:
      break;
  }
  app.putCustomOptions("processingPortalSettings", desc, false);
}
function getSetting(key, defaultValue) {
  try {
    var desc = app.getCustomOptions("processingPortalSettings");
    if (!desc.hasKey(stringIDToTypeID(key))) return defaultValue;
    var type = desc.getType(stringIDToTypeID(key));
    switch (type) {
      case DescValueType.BOOLEANTYPE:
        return desc.getBoolean(stringIDToTypeID(key));
      case DescValueType.STRINGTYPE:
        return desc.getString(stringIDToTypeID(key));
      case DescValueType.DOUBLETYPE:
        return desc.getDouble(stringIDToTypeID(key));
      default:
        return defaultValue;
    }
  } catch (e) {
    return defaultValue;
  }
}
function showDialog() {
  var win = new Window("dialog", "Processing Portal (v4.3)");
  win.orientation = "column";
  win.alignChildren = "fill";
  win.spacing = 10;
  win.margins = 15;
  var infoText = win.add(
    "statictext",
    undefined,
    "Files will be saved into a subfolder next to each original file.",
    { multiline: true }
  );
  infoText.graphics.font = ScriptUI.newFont("dialog", "ITALIC", 13);
  var sourcePanel = win.add("panel", undefined, "Source & Destination");
  sourcePanel.orientation = "column";
  sourcePanel.alignChildren = ["fill", "top"];
  sourcePanel.margins = 15;
  var processFolderCheckbox = sourcePanel.add(
    "checkbox",
    undefined,
    "Process folder on disk (instead of open files)"
  );
  var folderGroup = sourcePanel.add("group", undefined, {
    orientation: "column",
    alignChildren: ["fill", "top"],
    margins: [15, 5, 0, 0],
  });
  folderGroup.visible = false;
  var inputGroup = folderGroup.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  inputGroup.add("statictext", undefined, "Input Folder: ");
  var inputPathText = inputGroup.add("edittext", undefined, "", {
    readonly: true,
  });
  inputPathText.preferredSize.width = 280;
  var inputBrowseBtn = inputGroup.add("button", undefined, "Browse...");
  var outputGroup = folderGroup.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  outputGroup.add("statictext", undefined, "Output Folder (optional):");
  var outputPathText = outputGroup.add("edittext", undefined, "", {
    readonly: true,
  });
  outputPathText.preferredSize.width = 230;
  var outputBrowseBtn = outputGroup.add("button", undefined, "Browse...");
  var formatPanel = win.add("panel", undefined, "Export Format");
  formatPanel.alignChildren = "fill";
  formatPanel.margins = 15;
  var formatGroup = formatPanel.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  formatGroup.add("statictext", undefined, "Save as type:");
  var formatDropdown = formatGroup.add("dropdownlist", undefined, [
    "WebP",
    "JPEG",
    "PNG",
    "TIFF",
  ]);
  var optionsGroup = formatPanel.add("group", undefined, {
    orientation: "stack",
  });
  var webp_jpeg_Group = optionsGroup.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  webp_jpeg_Group.add("statictext", undefined, "Quality:");
  var qualitySlider = webp_jpeg_Group.add("slider", undefined, 75, 0, 100);
  qualitySlider.size = [150, 20];
  var qualityText = webp_jpeg_Group.add("edittext", undefined, "75", {
    characters: 4,
  });
  qualitySlider.onChanging = function () {
    qualityText.text = Math.round(this.value);
  };
  qualityText.onChange = function () {
    var val = parseInt(this.text);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      qualitySlider.value = val;
    } else {
      this.text = Math.round(qualitySlider.value);
    }
  };
  var pngGroup = optionsGroup.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  pngGroup.add("statictext", undefined, "Compression:");
  var pngCompressionDropdown = pngGroup.add("dropdownlist", undefined, [
    "None / Fast",
    "Smallest File Size",
  ]);
  var tiffGroup = optionsGroup.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  tiffGroup.add("statictext", undefined, "Compression:");
  var tiffCompressionDropdown = tiffGroup.add("dropdownlist", undefined, [
    "NONE",
    "LZW",
    "ZIP",
  ]);
  var processingPanel = win.add("panel", undefined, "Processing Options");
  processingPanel.orientation = "row";
  processingPanel.alignChildren = ["fill", "top"];
  processingPanel.spacing = 20;
  processingPanel.margins = 15;
  var leftColumn = processingPanel.add("group", undefined, {
    orientation: "column",
    alignChildren: ["left", "top"],
    spacing: 10,
  });
  leftColumn.add("statictext", undefined, "Dimensions:").graphics.font =
    ScriptUI.newFont("dialog", "BOLD", 13);
  var fitImageGroup = leftColumn.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  var fitImageCheckbox = fitImageGroup.add(
    "checkbox",
    undefined,
    "Fit Longest Edge:"
  );
  var fitImageInput = fitImageGroup.add("editnumber", undefined, 1920, {
    characters: 5,
  });
  var ppiGroup = leftColumn.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  var ppiCheckbox = ppiGroup.add("checkbox", undefined, "Set PPI Value:");
  var ppiInput = ppiGroup.add("editnumber", undefined, 300, { characters: 5 });
  leftColumn.add("statictext", undefined, "Color Profile:").graphics.font =
    ScriptUI.newFont("dialog", "BOLD", 13);
  var colorProfileDropdown = leftColumn.add("dropdownlist", undefined, [
    "Convert to sRGB",
    "Convert to Grayscale",
    "Keep Current Profile",
  ]);
  var rightColumn = processingPanel.add("group", undefined, {
    orientation: "column",
    alignChildren: ["left", "top"],
    spacing: 10,
  });
  rightColumn.add("statictext", undefined, "Metadata:").graphics.font =
    ScriptUI.newFont("dialog", "BOLD", 13);
  var xmpDataCheckbox = rightColumn.add(
    "checkbox",
    undefined,
    "Include XMP Data"
  );
  var exifDataCheckbox = rightColumn.add(
    "checkbox",
    undefined,
    "Include EXIF Data"
  );
  var psDataCheckbox = rightColumn.add(
    "checkbox",
    undefined,
    "Include Photoshop Data"
  );
  var actionPanel = win.add("panel", undefined, "Run Action (Optional)");
  actionPanel.alignChildren = "fill";
  actionPanel.margins = 15;
  var actionSetGroup = actionPanel.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  actionSetGroup.add("statictext", undefined, "Action Set:");
  var actionSetDropdown = actionSetGroup.add(
    "dropdownlist",
    undefined,
    undefined,
    { preferredSize: [350, 25] }
  );
  var actionGroup = actionPanel.add("group", undefined, {
    orientation: "row",
    alignChildren: ["left", "center"],
  });
  actionGroup.add("statictext", undefined, "      Action:");
  var actionDropdown = actionGroup.add("dropdownlist", undefined, undefined, {
    preferredSize: [350, 25],
  });
  var bottomGroup = win.add("group", undefined, {
    orientation: "row",
    alignChildren: ["middle", "fill"],
  });
  var keepOpenCheckbox = bottomGroup.add(
    "checkbox",
    undefined,
    "Keep Originals Open"
  );
  var hideProgressCheckbox = bottomGroup.add(
    "checkbox",
    undefined,
    "Hide Progress for Max Speed"
  );
  var buttonGroup = bottomGroup.add("group", undefined, {
    orientation: "row",
    alignment: ["right", "center"],
  });
  buttonGroup.add("button", undefined, "Cancel", { name: "cancel" });
  var okButton = buttonGroup.add("button", undefined, "OK", { name: "ok" });
  function updateFormatOptions() {
    var selectedFormat = formatDropdown.selection.text;
    if (processFolderCheckbox.value) {
      if (
        outputPathText.text === "" ||
        outputPathText.text === inputPathText.text
      ) {
        infoText.text =
          "Files will be saved into a '" +
          selectedFormat.toLowerCase() +
          "' subfolder inside the Input folder.";
      } else {
        infoText.text =
          "Files will be saved from the Input folder directly into the Output folder.";
      }
    } else {
      infoText.text =
        "Files will be saved into a '" +
        selectedFormat.toLowerCase() +
        "' subfolder next to each original file.";
    }
    webp_jpeg_Group.visible =
      selectedFormat === "WebP" || selectedFormat === "JPEG";
    pngGroup.visible = selectedFormat === "PNG";
    tiffGroup.visible = selectedFormat === "TIFF";
    psDataCheckbox.enabled = selectedFormat === "WebP";
    if (selectedFormat !== "WebP") psDataCheckbox.value = false;
    var isWebP = selectedFormat === "WebP";
    var grayscaleOption = colorProfileDropdown.find("Convert to Grayscale");
    if (grayscaleOption) {
      grayscaleOption.enabled = !isWebP;
    }
    if (
      isWebP &&
      colorProfileDropdown.selection.text === "Convert to Grayscale"
    ) {
      colorProfileDropdown.selection =
        colorProfileDropdown.find("Convert to sRGB");
    }
  }
  formatDropdown.onChange = updateFormatOptions;
  inputPathText.onChange = updateFormatOptions;
  outputPathText.onChange = updateFormatOptions;
  processFolderCheckbox.onClick = function () {
    folderGroup.visible = this.value;
    keepOpenCheckbox.enabled = !this.value;
    if (this.value) {
      keepOpenCheckbox.value = false;
    }
    updateFormatOptions();
  };
  inputBrowseBtn.onClick = function () {
    var folder = Folder.selectDialog("Select the Input Folder");
    if (folder) {
      inputPathText.text = folder.fsName;
      updateFormatOptions();
    }
  };
  outputBrowseBtn.onClick = function () {
    var folder = Folder.selectDialog("Select the Output Folder");
    if (folder) {
      outputPathText.text = folder.fsName;
      updateFormatOptions();
    }
  };

  actionSetDropdown.add("item", "--- No Action Set Selected ---");
  var allActionSets = getActionSets();
  if (allActionSets && allActionSets.length > 0) {
    for (var i = 0; i < allActionSets.length; i++) {
      actionSetDropdown.add("item", allActionSets[i]);
    }
  }
  actionDropdown.add("item", "--- No Action Selected ---");
  actionSetDropdown.onChange = function () {
    actionDropdown.removeAll();
    actionDropdown.add("item", "--- No Action Selected ---");
    actionDropdown.selection = 0;
    if (this.selection.index > 0) {
      var allActions = getActions(this.selection.text);
      if (allActions && allActions.length > 0) {
        for (var i = 0; i < allActions.length; i++) {
          actionDropdown.add("item", allActions[i]);
        }
      }
    }
  };

  function loadSettings() {
    formatDropdown.selection =
      formatDropdown.find(getSetting("outputFormat", "WebP")) || 0;
    pngCompressionDropdown.selection = getSetting("pngCompression", 1);
    tiffCompressionDropdown.selection = getSetting("tiffCompression", 1);
    colorProfileDropdown.selection = getSetting("colorProfile", 0);
    qualitySlider.value = getSetting("quality", 75);
    qualityText.text = Math.round(qualitySlider.value);
    fitImageCheckbox.value = getSetting("fitImage", false);
    fitImageInput.text = getSetting("fitImageValue", 1920);
    fitImageInput.enabled = fitImageCheckbox.value;
    ppiCheckbox.value = getSetting("setPPI", false);
    ppiInput.text = getSetting("ppiValue", 300);
    ppiInput.enabled = ppiCheckbox.value;
    xmpDataCheckbox.value = getSetting("includeXMP", false);
    exifDataCheckbox.value = getSetting("includeEXIF", false);
    psDataCheckbox.value = getSetting("includePSData", false);
    keepOpenCheckbox.value = getSetting("keepOpen", true);
    hideProgressCheckbox.value = getSetting("hideProgress", true);
    processFolderCheckbox.value = getSetting("processFolder", false);
    inputPathText.text = getSetting("inputPath", "");
    outputPathText.text = getSetting("outputPath", "");
    processFolderCheckbox.onClick();
    var savedSet = getSetting("actionSet", "--- No Action Set Selected ---");
    actionSetDropdown.selection = actionSetDropdown.find(savedSet) || 0;
    actionSetDropdown.onChange();
    var savedAction = getSetting("actionName", "--- No Action Selected ---");
    actionDropdown.selection = actionDropdown.find(savedAction) || 0;
    updateFormatOptions();
  }

  fitImageCheckbox.onClick = function () {
    fitImageInput.enabled = this.value;
  };
  ppiCheckbox.onClick = function () {
    ppiInput.enabled = this.value;
  };

  okButton.onClick = function () {
    if (processFolderCheckbox.value && inputPathText.text === "") {
      return alert("Please select an Input folder.");
    }
    saveSetting("outputFormat", formatDropdown.selection.text);
    saveSetting("quality", Math.round(qualitySlider.value));
    saveSetting("pngCompression", pngCompressionDropdown.selection.index);
    saveSetting("tiffCompression", tiffCompressionDropdown.selection.index);
    saveSetting("colorProfile", colorProfileDropdown.selection.index);
    saveSetting("fitImage", fitImageCheckbox.value);
    saveSetting("fitImageValue", parseInt(fitImageInput.text));
    saveSetting("setPPI", ppiCheckbox.value);
    saveSetting("ppiValue", parseInt(ppiInput.text));
    saveSetting("includeXMP", xmpDataCheckbox.value);
    saveSetting("includeEXIF", exifDataCheckbox.value);
    saveSetting("includePSData", psDataCheckbox.value);
    saveSetting("keepOpen", keepOpenCheckbox.value);
    saveSetting("hideProgress", hideProgressCheckbox.value);
    saveSetting("actionSet", actionSetDropdown.selection.text);
    saveSetting("actionName", actionDropdown.selection.text);
    saveSetting("processFolder", processFolderCheckbox.value);
    saveSetting("inputPath", inputPathText.text);
    saveSetting("outputPath", outputPathText.text);
    var settings = {
      processFolder: processFolderCheckbox.value,
      inputPath: inputPathText.text,
      outputPath: outputPathText.text,
      outputFormat: formatDropdown.selection.text,
      quality: Math.round(qualitySlider.value),
      pngCompression: pngCompressionDropdown.selection.index,
      tiffCompression: tiffCompressionDropdown.selection.text,
      xmpData: xmpDataCheckbox.value,
      exifData: exifDataCheckbox.value,
      psData: psDataCheckbox.value,
      colorProfile: colorProfileDropdown.selection.text,
      fitValue: fitImageCheckbox.value ? parseInt(fitImageInput.text) : null,
      ppi: ppiCheckbox.value ? parseInt(ppiInput.text) : null,
      actionSet:
        actionSetDropdown.selection.index > 0
          ? actionSetDropdown.selection.text
          : null,
      actionName:
        actionDropdown.selection.index > 0
          ? actionDropdown.selection.text
          : null,
      hideProgress: hideProgressCheckbox.value,
      keepOpen: keepOpenCheckbox.value,
    };
    win.close();
    startProcessing(settings);
  };
  loadSettings();
  win.show();
}
function startProcessing(settings) {
  var savedDisplayDialogs = app.displayDialogs;
  app.displayDialogs = DialogModes.NO;
  if (settings.processFolder) {
    processFolderOnDisk(settings);
  } else {
    processOpenDocs(settings);
  }
  app.displayDialogs = savedDisplayDialogs;
  app.beep();
}

function processOpenDocs(settings) {
  if (app.documents.length === 0) {
    return alert(
      "There are no open documents to process. Please open some images first."
    );
  }
  var totalDocs = app.documents.length;
  var processedCount = 0;
  var skippedCount = 0;
  var progressWin, progressText, progressBar;
  if (!settings.hideProgress) {
    progressWin = new Window("palette", "Processing Open Files...", undefined, {
      closeButton: false,
    });
    progressWin.alignChildren = "fill";
    progressText = progressWin.add("statictext", undefined, "Starting...");
    progressBar = progressWin.add("progressbar", undefined, 0, totalDocs);
    progressWin.show();
  }
  for (var i = totalDocs - 1; i >= 0; i--) {
    var doc = app.documents[i];
    app.activeDocument = doc;
    if (!settings.hideProgress) {
      var progressIndex = totalDocs - i;
      progressText.text =
        "Processing (" + progressIndex + "/" + totalDocs + "): " + doc.name;
      progressBar.value = progressIndex;
      app.refresh();
    }
    try {
      var sourcePath = doc.path;
    } catch (e) {
      skippedCount++;
      continue;
    }
    var outputFolder = new Folder(
      sourcePath + "/" + settings.outputFormat.toLowerCase()
    );
    if (!outputFolder.exists) {
      outputFolder.create();
    }
    var escapedPath = outputFolder.fsName.replace(/\\/g, "\\\\");
    doc.suspendHistory(
      "Process with Portal",
      "runConversion(settings, new Folder('" + escapedPath + "'))"
    );
    if (!settings.keepOpen) {
      doc.close(SaveOptions.DONOTSAVECHANGES);
    }
    processedCount++;
  }
  if (!settings.hideProgress) {
    progressWin.close();
  }
  var summary =
    "Batch Complete!\n\n" + "Processed: " + processedCount + " files.\n";
  if (skippedCount > 0) {
    summary += "Skipped: " + skippedCount + " unsaved files.\n";
  }
  alert(summary);
}

function processFolderOnDisk(settings) {
  var inputFolder = new Folder(settings.inputPath);
  var outputFolder;
  if (settings.outputPath == "" || settings.outputPath == settings.inputPath) {
    outputFolder = new Folder(
      settings.inputPath + "/" + settings.outputFormat.toLowerCase()
    );
  } else {
    outputFolder = new Folder(settings.outputPath);
  }
  if (!outputFolder.exists) {
    outputFolder.create();
  }

  var fileList = inputFolder.getFiles(
    /\.(jpg|jpeg|tif|tiff|psd|psb|png|gif|webp)$/i
  );
  if (fileList.length === 0) {
    return alert(
      "No compatible image files were found in the selected input folder."
    );
  }

  var totalFiles = fileList.length;
  var processedCount = 0;
  var errorCount = 0;
  var firstError = null;
  var progressWin, progressText, progressBar;

  if (!settings.hideProgress) {
    progressWin = new Window("palette", "Processing Folder...", undefined, {
      closeButton: false,
    });
    progressWin.alignChildren = "fill";
    progressText = progressWin.add("statictext", undefined, "Starting...");
    progressBar = progressWin.add("progressbar", undefined, 0, totalFiles);
    progressWin.show();
  }
  for (var i = 0; i < totalFiles; i++) {
    var file = fileList[i];
    if (!settings.hideProgress) {
      progressText.text =
        "Processing (" +
        (i + 1) +
        "/" +
        totalFiles +
        "): " +
        decodeURI(file.name);
      progressBar.value = i + 1;
      app.refresh();
    }
    try {
      var doc = app.open(file);
      runConversion(settings, outputFolder);
      doc.close(SaveOptions.DONOTSAVECHANGES);
      processedCount++;
    } catch (e) {
      errorCount++;
      if (firstError === null) {
        firstError =
          "Failed to process '" +
          decodeURI(file.name) +
          "'.\n\nError: " +
          e.toString();
      }
      if (app.documents.length > 0) {
        try {
          app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        } catch (err) {}
      }
    }
  }
  if (!settings.hideProgress) {
    progressWin.close();
  }
  var summary =
    "Batch Complete!\n\n" +
    "Successfully Processed: " +
    processedCount +
    " of " +
    totalFiles +
    " files.\n";
  if (errorCount > 0) {
    summary +=
      "Failed to Process: " +
      errorCount +
      " files.\n\n" +
      "FIRST ERROR DETAILS:\n" +
      firstError;
  }
  summary += "\n\nOutput Location:\n" + decodeURI(outputFolder.fsName);
  alert(summary);
}

function runConversion(settings, outputFolder) {
  if (
    settings.outputFormat === "WebP" &&
    activeDocument.mode !== DocumentMode.RGB
  ) {
    activeDocument.changeMode(ChangeMode.RGB);
  }
  if (settings.colorProfile === "Convert to Grayscale") {
    if (activeDocument.mode !== DocumentMode.GRAYSCALE) {
      activeDocument.changeMode(ChangeMode.GRAYSCALE);
    }
  } else if (settings.colorProfile === "Convert to sRGB") {
    if (activeDocument.mode !== DocumentMode.RGB) {
      activeDocument.changeMode(ChangeMode.RGB);
    }
    try {
      activeDocument.convertProfile(
        "sRGB IEC61966-2.1",
        Intent.RELATIVECOLORIMETRIC,
        true,
        false
      );
    } catch (e) {}
  }

  if (activeDocument.bitsPerChannel != BitsPerChannelType.EIGHT) {
    activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
  }

  if (settings.actionSet && settings.actionName) {
    runAction(settings.actionSet, settings.actionName);
  }
  if (settings.fitValue !== null || settings.ppi !== null) {
    fitImage(settings.fitValue, settings.ppi);
  }
  var docName = activeDocument.name.replace(/\.[^\.]+$/, "");
  var saveFile;
  var saveOptions;

  switch (settings.outputFormat) {
    case "WebP":
      saveWebP(settings, outputFolder, docName);
      break;
    case "JPEG":
      saveOptions = new JPEGSaveOptions();
      saveOptions.quality = Math.round((settings.quality / 100) * 12);
      saveOptions.embedColorProfile = true;
      saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
      saveFile = new File(outputFolder + "/" + docName + ".jpg");
      activeDocument.saveAs(saveFile, saveOptions, true);
      break;
    case "PNG":
      saveOptions = new PNGSaveOptions();
      saveOptions.compression = settings.pngCompression === 0 ? 0 : 9;
      saveOptions.interlaced = false;
      saveFile = new File(outputFolder + "/" + docName + ".png");
      activeDocument.saveAs(saveFile, saveOptions, true);
      break;
    case "TIFF":
      saveOptions = new TiffSaveOptions();
      if (settings.tiffCompression === "LZW")
        saveOptions.imageCompression = TIFFEncoding.TIFFLZW;
      else if (settings.tiffCompression === "ZIP")
        saveOptions.imageCompression = TIFFEncoding.TIFFZIP;
      else saveOptions.imageCompression = TIFFEncoding.NONE;
      saveOptions.layers = false;
      saveFile = new File(outputFolder + "/" + docName + ".tif");
      activeDocument.saveAs(saveFile, saveOptions, true);
      break;
  }
}

function saveWebP(s, outputFolder, docName) {
  var saveFile = new File(outputFolder + "/" + docName + ".webp");
  var desc = new ActionDescriptor();
  var saveOpts = new ActionDescriptor();
  saveOpts.putEnumerated(
    stringIDToTypeID("compression"),
    stringIDToTypeID("WebPCompression"),
    stringIDToTypeID("compressionLossy")
  );
  saveOpts.putInteger(stringIDToTypeID("quality"), s.quality);
  saveOpts.putBoolean(stringIDToTypeID("includeXMPData"), s.xmpData);
  saveOpts.putBoolean(stringIDToTypeID("includeEXIFData"), s.exifData);
  saveOpts.putBoolean(stringIDToTypeID("includePsExtras"), s.psData);
  desc.putObject(
    stringIDToTypeID("as"),
    stringIDToTypeID("WebPFormat"),
    saveOpts
  );
  desc.putPath(stringIDToTypeID("in"), saveFile);
  desc.putBoolean(stringIDToTypeID("copy"), true);
  executeAction(stringIDToTypeID("save"), desc, DialogModes.NO);
}
function fitImage(fitValue, ppi) {
  var doc = activeDocument;
  var resampleMethod = ResampleMethod.BICUBIC;
  if (fitValue !== null && ppi !== null) {
    if (doc.height.value > doc.width.value)
      doc.resizeImage(null, UnitValue(fitValue, "px"), ppi, resampleMethod);
    else doc.resizeImage(UnitValue(fitValue, "px"), null, ppi, resampleMethod);
  } else if (fitValue !== null) {
    if (doc.height.value > doc.width.value)
      doc.resizeImage(
        null,
        UnitValue(fitValue, "px"),
        doc.resolution,
        resampleMethod
      );
    else
      doc.resizeImage(
        UnitValue(fitValue, "px"),
        null,
        doc.resolution,
        resampleMethod
      );
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
      ref.putIndex(charIDToTypeID("ASet"), i);
      var desc = executeActionGet(ref);
      sets.push(desc.getString(charIDToTypeID("Nm  ")));
      i++;
    }
  } catch (e) {}
  return sets;
}
function getActions(setName) {
  var actions = [];
  try {
    var i = 1;
    while (true) {
      var ref = new ActionReference();
      ref.putIndex(charIDToTypeID("Actn"), i);
      ref.putName(charIDToTypeID("ASet"), setName);
      var desc = executeActionGet(ref);
      actions.push(desc.getString(charIDToTypeID("Nm  ")));
      i++;
    }
  } catch (e) {}
  return actions;
}
function runAction(actionSet, actionName) {
  try {
    app.doAction(actionName, actionSet);
  } catch (e) {}
}
