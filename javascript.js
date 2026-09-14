const imageInput = document.getElementById("image-input");
const uploadCard = document.getElementById("upload-card");
const workspace = document.getElementById("workspace");
const demoStrip = document.getElementById("demo-strip");
const canvas = document.getElementById("composition-canvas");
const canvasFrame = document.querySelector(".canvas-frame");
const canvasScroll = document.getElementById("canvas-scroll");
const canvasStage = document.getElementById("canvas-stage");
const canvasSelectionLayer = document.getElementById("canvas-selection-layer");
const canvasZoomLabel = document.getElementById("canvas-zoom-label");
let context = canvas.getContext("2d");
const fileList = document.getElementById("file-list");
const imageCount = document.getElementById("image-count");
const compositionSize = document.getElementById("composition-size");
const layoutLabel = document.getElementById("layout-label");
const addMoreButton = document.getElementById("add-more");
const highlightToggle = document.getElementById("highlight-toggle");
const verticalToggle = document.getElementById("vertical-toggle");
const exportButton = document.getElementById("export-button");
const copyButton = document.getElementById("copy-button");
const copyLabel = document.getElementById("copy-label");
const historyToastStack = document.getElementById("history-toast-stack");
const scrollFireworksLayer = document.getElementById("scroll-fireworks-layer");
const themeToggle = document.getElementById("theme-toggle");
const aboutButton = document.getElementById("about-button");
const settingsButton = document.getElementById("settings-button");
const settingsOverlay = document.getElementById("settings-overlay");
const settingsClose = document.getElementById("settings-close");
const scrollStarsToggle = document.getElementById("scroll-stars-toggle");
const previewQualitySelect = document.getElementById("preview-quality-select");
const aboutOverlay = document.getElementById("about-overlay");
const aboutClose = document.getElementById("about-close");
const deleteImageButton = document.getElementById("delete-image-button");
const hexInput = document.getElementById("hex-input");
const colorContextLabel = document.getElementById("color-context-label");
const colorValue = document.getElementById("color-value");
const colorTargetButtons = [...document.querySelectorAll("[data-color-target]")];
const emptyColorSummary = document.getElementById("empty-color-summary");
const borderColorSummary = document.getElementById("border-color-summary");
const transparentToggle = document.getElementById("transparent-toggle");
const colorSurface = document.getElementById("color-surface");
const colorSurfaceCursor = document.getElementById("color-surface-cursor");
const erasePickerCard = document.getElementById("erase-picker-card");
const erasePickerSwatch = document.getElementById("erase-picker-swatch");
const erasePickerHex = document.getElementById("erase-picker-hex");
const erasePickerName = document.getElementById("erase-picker-name");
const erasePickerType = document.getElementById("erase-picker-type");
const hueSlider = document.getElementById("hue-slider");
const redInput = document.getElementById("red-input");
const greenInput = document.getElementById("green-input");
const blueInput = document.getElementById("blue-input");
const transparencySlider = document.getElementById("transparency-slider");
const transparencyValue = document.getElementById("transparency-value");
const eraseColorButton = document.getElementById("erase-color-button");
const eraseBorderButton = document.getElementById("erase-border-button");
const rescaleButton = document.getElementById("rescale-button");
const eraseStatus = document.getElementById("erase-status");
const eraseResetButton = document.getElementById("erase-reset-button");
const erasedColorsList = document.getElementById("erased-colors-list");
const orderButtons = [...document.querySelectorAll("[data-order]")];
const alignButtons = [...document.querySelectorAll("[data-align]")];
const horizontalAlignButtons = [...document.querySelectorAll("[data-horizontal-align]")];
const spacingStatus = document.getElementById("spacing-status");
const selectedImageLabel = document.getElementById("selected-image-label");
const spacingInput = document.getElementById("spacing-input");
const paddingInput = document.getElementById("padding-input");
const applySpacingButton = document.getElementById("apply-spacing");
const applyPaddingButton = document.getElementById("apply-padding");
const selectAllGapsButton = document.getElementById("select-all-gaps");
const borderThicknessInput = document.getElementById("border-thickness-input");
const borderRadiusGeneralInput = document.getElementById("border-radius-general-input");
const borderRadiusInputs = {
  topLeft: document.getElementById("border-radius-top-left-input"),
  bottomLeft: document.getElementById("border-radius-bottom-left-input"),
  bottomRight: document.getElementById("border-radius-bottom-right-input"),
  topRight: document.getElementById("border-radius-top-right-input")
};
const borderParameterInputs = [borderThicknessInput, borderRadiusGeneralInput, ...Object.values(borderRadiusInputs)];

const browserLocale = navigator.languages?.[0] || navigator.language || "pt-BR";
const uiLanguage = browserLocale.toLowerCase().startsWith("pt") ? "pt" : "en";

function t(key, portuguese) {
  if (uiLanguage !== "en") return portuguese;
  const english = {
    image: "image",
    images: "images",
    transparent: "transparent",
    largerSmaller: "larger → smaller",
    smallerLarger: "smaller → larger",
    customOrder: "custom order",
    top: "top",
    center: "centered",
    bottom: "bottom",
    left: "left",
    right: "right",
    erasedColor: "Erased color: ()",
    erasedColorValue: (value) => `Erased color: (${value})`,
    erasedColorsCount: (count) => `Erased colors: (${count})`,
    noErasedColors: "No erased colors",
    allGapsSelected: "All gaps selected. Padding is global.",
    allImages: "all",
    lastImage: "Last image selected: adjust only the global padding.",
    selectedImage: "Image selected: adjust the space to the next image and the global padding.",
    chooseSpace: "Click an image in the preview to choose the space to the next one.",
    addImagesToEdit: "Add images and click one to edit its space and padding.",
    copied: "Copied",
    copy: "Copy",
    unavailable: "Unavailable",
    failed: "Failed",
    copiedCount: (count) => `${count} copied`,
    emptyColor: "Empty color",
    borderColor: "Border color",
    light: "light",
    dark: "dark",
    erasedColorType: "Erased color",
    chooseColor: "Choose a color",
    black: "Black",
    white: "White",
    gray: "Gray",
    brown: "Brown",
    red: "Red",
    orange: "Orange",
    yellow: "Yellow",
    green: "Green",
    cyan: "Cyan",
    blue: "Blue",
    purple: "Purple",
    pink: "Pink",
    themeLightAria: "Activate light mode",
    themeDarkAria: "Activate dark mode",
    undone: "Undone",
    redone: "Redone",
    times: "times"
  };
  return english[key] ?? portuguese;
}

function setLanguageText(selector, value, html = false) {
  const element = document.querySelector(selector);
  if (!element) return;
  if (html) element.innerHTML = value;
  else element.textContent = value;
}

function applyBrowserLanguage() {
  const isEnglish = uiLanguage === "en";
  document.documentElement.lang = isEnglish ? "en" : "pt-BR";
  if (!isEnglish) return;

  document.title = "CaptiMage";
  document.querySelector('meta[name="description"]')?.setAttribute("content", "Combine images into a custom composition.");
  document.querySelector(".brand")?.setAttribute("aria-label", "CaptiMage, home");
  setLanguageText(".topbar-note", "image composition");
  setLanguageText(".theme-toggle-label", "dark");
  setLanguageText(".about-button > span:last-child", "About");
  settingsButton?.setAttribute("aria-label", "Open settings");
  settingsButton?.setAttribute("title", "Settings");
  setLanguageText("#settings-title", "Settings");
  setLanguageText(".settings-dialog-header .eyebrow", "settings");
  setLanguageText(".settings-dialog-header p", "Customize preview performance without reducing the final file quality.");
  setLanguageText(".settings-toggle-option strong", "Scroll stars");
  setLanguageText(".settings-toggle-option small", "Show or hide the stars that appear when the page is scrolled.");
  setLanguageText(".settings-option:not(.settings-toggle-option) strong", "Preview resolution");
  setLanguageText(".settings-option:not(.settings-toggle-option) small", "A lower resolution makes the preview lighter. Export and copy still use the original resolution.");
  setLanguageText("#preview-quality-select option[value='1']", "Original · 100%");
  setLanguageText("#preview-quality-select option[value='0.75']", "High · 75%");
  setLanguageText("#preview-quality-select option[value='0.5']", "Medium · 50%");
  setLanguageText("#preview-quality-select option[value='0.25']", "Light · 25%");
  settingsClose?.setAttribute("aria-label", "Close settings");
  const heroEyebrow = document.querySelector(".hero > .eyebrow");
  if (heroEyebrow?.lastChild) heroEyebrow.lastChild.textContent = " local tool · your files never leave the browser";
  setLanguageText("#page-title", "Join images.<br /><em>Your way.</em>", true);
  setLanguageText(".intro", "Send multiple images and we will organize them from largest to smallest, with centered alignment and transparent spacing.");
  setLanguageText(".upload-copy strong", "Send images");
  setLanguageText(".upload-copy span", "Choose two or more images from your computer");
  setLanguageText(".drop-hint", "or drag and drop your images here");
  document.querySelector(".demo-strip")?.setAttribute("aria-label", "Animated composition example");
  setLanguageText(".demo-heading span:first-child", "✦ an idea of the result");
  setLanguageText(".demo-heading span:last-child", "automatic preview");
  document.querySelectorAll(".demo-image img").forEach((image) => {
    image.alt = image.alt.replace("Paisagem montanhosa", "Mountain landscape").replace("Lago entre montanhas", "Lake between mountains").replace("Paisagem natural vista de cima", "Aerial natural landscape").replace("Casa moderna cercada por natureza", "Modern house surrounded by nature").replace("Casa com jardim", "House with garden");
  });
  const workspaceEyebrow = document.querySelector(".workspace-heading .eyebrow");
  if (workspaceEyebrow?.lastChild) workspaceEyebrow.lastChild.textContent = " preview";
  setLanguageText(".workspace-heading h2", "Your composition");
  setLanguageText("#add-more", "+ Add more");
  setLanguageText("#highlight-toggle", "✦ Highlight");
  setLanguageText("#vertical-toggle", "↕ Vertical");
  setLanguageText("#copy-label", "Copy");
  copyButton?.setAttribute("aria-label", "Copy selected images");
  copyButton?.setAttribute("title", "Copy selected images");
  setLanguageText("#export-button > span:first-child", "Export");
  setLanguageText("#image-count", "0 images");
  const sortLabel = document.querySelector(".sort-label");
  if (sortLabel?.firstChild) sortLabel.firstChild.textContent = "layout: ";
  setLanguageText("#empty-color-target span", "Empty color");
  setLanguageText("#border-color-target span", "Border color");
  setLanguageText(".rgb-caption", "adjust · RGB");
  setLanguageText("#erase-reset-button", "Reset");
  setLanguageText(".hex-color span", "HEX");
  setLanguageText("#transparent-toggle", "transparent");
  setLanguageText(".transparency-label span", "transparency");
  setLanguageText(".hue-control .slider-label", "color");
  setLanguageText("#erase-border-button", "Erase borders");
  setLanguageText("#erase-color-button", "Erase colors");
  setLanguageText("#rescale-button", "Rescale");
  setLanguageText(".layout-block > .control-title", "Order and alignment");
  setLanguageText(".layout-block .layout-subtitle:not(.alignment-subtitle):not(.horizontal-alignment-subtitle):not(.border-subtitle)", "image order");
  setLanguageText(".alignment-subtitle", "vertical alignment");
  setLanguageText(".horizontal-alignment-subtitle", "horizontal alignment");
  setLanguageText(".border-subtitle", "image borders");
  setLanguageText("[data-order=desc]", "↗ larger → smaller");
  setLanguageText("[data-order=asc]", "↘ smaller → larger");
  setLanguageText("[data-align=top]", "↑ top");
  setLanguageText("[data-align=center]", "↕ centered");
  setLanguageText("[data-align=bottom]", "↓ bottom");
  setLanguageText("[data-horizontal-align=left]", "← left");
  setLanguageText("[data-horizontal-align=center]", "↔ centered");
  setLanguageText("[data-horizontal-align=right]", "→ right");
  ["thickness", "general radius", "top-left radius", "bottom-left radius", "bottom-right radius", "top-right radius"].forEach((label, index) => {
    const field = document.querySelectorAll(".border-field span")[index];
    if (field) field.textContent = ["border thickness", "general border radius", "top-left radius", "bottom-left radius", "bottom-right radius", "top-right radius"][index];
  });
  setLanguageText("canvas[aria-label]", "Preview of the final composition");
  setLanguageText(".spacing-heading .control-title", "Space between images");
  setLanguageText(".spacing-status", "Click an image in the preview to choose the space to the next one.");
  setLanguageText(".spacing-hint", "unit: px");
  setLanguageText("#apply-spacing", "Apply space");
  setLanguageText("#apply-padding", "Apply padding");
  setLanguageText("#select-all-gaps", "Select all");
  document.querySelector("#delete-image-button")?.setAttribute("aria-label", "Delete selected image");
  document.querySelector("#delete-image-button")?.setAttribute("title", "Delete selected image");
  document.querySelector("#about-close")?.setAttribute("aria-label", "Close manual");
  document.querySelector("[aria-label='Escolher o tipo de cor']")?.setAttribute("aria-label", "Choose color type");
  document.querySelector("[aria-label='Ajuste RGB']")?.setAttribute("aria-label", "RGB adjustment");
  document.querySelector("#hex-input")?.setAttribute("aria-label", "Color HEX code");
  document.querySelector("#transparency-slider")?.setAttribute("aria-label", "Transparency of selected color");
  document.querySelector("#hue-slider")?.setAttribute("aria-label", "Choose color hue");
  document.querySelector(".erase-actions")?.setAttribute("aria-label", "Erase and scale actions");
  document.querySelector("[aria-label='Ordem das imagens']")?.setAttribute("aria-label", "Image order");
  document.querySelector("[aria-label='Alinhamento vertical']")?.setAttribute("aria-label", "Vertical alignment");
  document.querySelector("[aria-label='Alinhamento horizontal']")?.setAttribute("aria-label", "Horizontal alignment");
  setLanguageText(".footer", "A simple tool for side-by-side images ✦");
  translateManualToEnglish();
}

function translateManualToEnglish() {
  setLanguageText(".about-dialog-header .eyebrow", "quick manual");
  setLanguageText("#about-title", "How to use CaptiMage");
  setLanguageText(".about-dialog-header p", "Build an image composition, adjust every detail and export the result without leaving your browser.");
  const cards = [...document.querySelectorAll(".about-card")];
  const setCard = (index, kicker, title, description) => {
    const card = cards[index];
    if (!card) return;
    card.querySelector(".about-card-kicker").textContent = kicker;
    card.querySelector("h3").textContent = title;
    if (description !== null) card.querySelector("p").innerHTML = description;
  };
  setCard(0, "history", "Undo and redo", "Undo or redo changes made to the composition.");
  const shortcuts = cards[0]?.querySelectorAll(".shortcut-row span:first-child");
  if (shortcuts?.length) { shortcuts[0].textContent = "Undo"; shortcuts[1].textContent = "Redo"; }
  setCard(1, "start", "Add images", "Click <strong>Send images</strong>, drag files onto the page or paste an image with <kbd>Ctrl</kbd> + <kbd>V</kbd>.");
  setCard(2, "composition", "Order and direction", "Choose larger → smaller, smaller → larger or enable vertical mode. In vertical mode, choose the horizontal alignment.");
  setCard(3, "selection", "Select images", "Click to select. Use <kbd>Ctrl</kbd> for individual images, <kbd>Shift</kbd> for a range and <kbd>Ctrl</kbd> + <kbd>A</kbd> to select all.");
  setCard(4, "organize", "Reorder and move", "Drag an image in the preview or the bottom list to change its position. Use the right mouse button in the preview to navigate.");
  setCard(5, "finishing", "Colors and borders", "Configure the empty color, transparency, borders, radii and spacing. <strong>Erase colors</strong> lets you choose colors directly in the preview.");
  setCard(6, "result", "Copy and export", "Use <strong>Copy</strong> to send the composition to the clipboard or <strong>Export</strong> to save a file.");
  setCard(8, "order", "Layout and alignment", "<strong>Larger → smaller</strong> and <strong>smaller → larger</strong> sort images by height. In horizontal mode, vertical alignment controls their vertical position. In vertical mode, horizontal alignment offers left, centered and right.");
  setCard(9, "spacing", "Space and padding", "Select an image, enter the space to the next one and click <strong>Apply space</strong>. <strong>Global padding</strong> adds margin around the composition. <strong>Select all</strong> applies the same space to every gap.");
  setCard(11, "preview", "Quick interactions", null);
  const rowSets = {
    7: [["+ Add more", "Adds more images without removing the current ones."], ["Highlight", "Marks selected images with the selection color when copied or exported."], ["Vertical", "Switches between a horizontal row and vertically stacked images."], ["Copy", "Copies only selected images, preserving their spacing, padding, background, borders and radii."], ["Export", "Saves the final composition as PNG and lets you choose the name and location."], ["☾ / ☀", "Switches between dark and light themes."], ["?", "Opens this manual."], ["⚙", "Opens settings for scroll stars and preview resolution."]],
    10: [["Empty color / Border color", "Chooses which area is edited. HEX, RGB, the color surface and sliders change the active color."], ["Transparent", "Removes the active color and makes the empty area or border transparent. Click again to return to the chosen color."], ["Erase borders", "Removes colors connected to the borders of selected images."], ["Erase colors", "Activates the eyedropper. Click a color in the preview to remove it from selected images. The card shows its swatch, HEX and color name."], ["Reset", "Removes erased colors from selected images. The list supports Ctrl or Shift selection and Delete."], ["Rescale", "Crops transparent space created by removing colors or borders from selected images."], ["Image borders", "Sets thickness, general radius and the four individual corner radii."]],
    11: [["Select", "Click an image quickly to select it. Click a selected image again to remove its selection."], ["Ctrl and Shift", "Hold Ctrl to add or remove individual images. Hold Shift to select the range between the current selection and the clicked image."], ["Select all", "Use the Select all button or Ctrl + A. Press it again to clear the selection."], ["Reorder in preview", "Hold the left button on an image, move it to another position and release to confirm. The rearrangement animation appears after the move."], ["Reorder in list", "In the image list below the preview, hold an item or its icon and drag it to the desired position."], ["Navigate preview", "Hold the right button and move the mouse to pan the preview. Inertia continues the movement briefly after release."], ["Both buttons", "You can hold an image with the left button and, without releasing it, use the right button to navigate the preview."], ["Mouse wheel", "Use the wheel to scroll the page, preview or color list depending on where the pointer is. Scrolling is smooth and accelerated."], ["Preview zoom", "Hold Shift and use the wheel inside the preview to zoom in or out. The zoom only affects the preview area."], ["Hover and glow", "Hovering an image shows its selection border. Clicking it shows a quick glow contained within the image."]],
    12: [["Ctrl + A", "Selects every image. Press it again to clear the selection."], ["Ctrl + C", "Copies selected images individually to the browser clipboard."], ["Ctrl + V", "Adds pasted images after the last selected image."], ["Delete", "Deletes selected images or, when the color list is focused, selected colors."], ["Ctrl + Z", "Undoes the last change. Ctrl + Shift + Z redoes it."], ["Enter", "Confirms numeric values for space, padding, borders, RGB, HEX and sliders."], ["Esc", "Closes the manual when it is open."], ["Drag files", "Drop images onto the page to add them without opening the file picker."]]
  };
  Object.entries(rowSets).forEach(([cardIndex, rows]) => {
    cards[Number(cardIndex)]?.querySelectorAll(".manual-list > div").forEach((row, index) => {
      if (!rows[index]) return;
      row.querySelector("strong").innerHTML = rows[index][0];
      row.querySelector("span").innerHTML = rows[index][1];
    });
  });
  setLanguageText(".about-dialog-footer", "Tip: color, border, erase and rescale changes affect only selected images. Padding is always global.");
}

let selectedImages = [];
let selectedColor = null;
let borderColor = "#ffffff";
let colorOpacity = 1;
let borderOpacity = 1;
let activeColorTarget = "empty";
let selectedHue = 100;
let selectedSaturation = 0.7;
let selectedValue = 0.9;
let selectedOrder = "desc";
let selectedAlignment = "center";
let selectedHorizontalAlignment = "center";
let isVertical = false;
let gapSizes = [];
let paddingSize = 0;
let imageRects = [];
let displayedImages = [];
let selectedImageIndex = null;
let selectedImageIndexes = new Set();
let selectionAnchorIndex = null;
let allGapsSelected = false;
let customOrder = false;
let manualOrder = [];
let draggedFileIndex = null;
let eraseColor = null;
let erasedColors = [];
let selectedErasedColorIndexes = new Set();
let erasedColorAnchorIndex = null;
let eraseMode = false;
let eraseBorders = false;
let history = [];
let historyIndex = -1;
let isDarkTheme = true;
let animationFrameId = null;
let finishAnimation = null;
let lastBackgroundKey = null;
let borderThickness = 0;
let borderRadii = { topLeft: 0, bottomLeft: 0, bottomRight: 0, topRight: 0 };
let imageBorderSettings = new Map();
let imageEraseSettings = new Map();
const imageRenderCache = new WeakMap();
let copyFeedbackTimer = null;
const historyToastTimers = new Map();
let suppressCanvasClick = false;
let scrollInertiaFrameId = null;
let canvasDragState = null;
let canvasReorderState = null;
let reorderHoverIndex = null;
let hoveredImageIndex = null;
let selectionPulseTimer = null;
let highlightEnabled = false;
let panelMotionTimer = null;
let lastFireworksAt = 0;
let lastFireworksDirection = null;
let fireworkFrameId = null;
let pendingFireworkDirection = null;
let aboutPreviousFocus = null;
let compositionRenderFrameId = null;
let compositionRenderShouldScroll = false;
let internalImageClipboard = [];
let previewZoom = 1;
let previewQuality = 1;
let showScrollFireworks = true;
let compositionWidth = 0;
let compositionHeight = 0;

const orderNames = { desc: "maior → menor", asc: "menor → maior", custom: "ordem personalizada" };
const alignmentNames = { center: "centralizado", top: "para cima", bottom: "para baixo" };
const horizontalAlignmentNames = { left: "esquerda", center: "centralizado", right: "direita" };
const selectionBorderThickness = 3;

function cloneEraseSettings(settings = {}) {
  return {
    colors: (settings.colors || []).map((color) => ({ ...color })),
    eraseBorders: Boolean(settings.eraseBorders)
  };
}

function getImageEraseSettings(image) {
  if (!imageEraseSettings.has(image)) imageEraseSettings.set(image, cloneEraseSettings());
  return imageEraseSettings.get(image);
}

function getSelectedImageEntries() {
  const selectedIndexes = new Set([
    ...selectedImageIndexes,
    ...(selectedImageIndex === null ? [] : [selectedImageIndex])
  ]);
  return displayedImages.filter((_, index) => selectedIndexes.has(index));
}

function syncEraseSelectionState() {
  const selectedEntries = getSelectedImageEntries();
  const colorMap = new Map();
  selectedEntries.forEach(({ image }) => {
    getImageEraseSettings(image).colors.forEach((color) => {
      const key = `${color.r},${color.g},${color.b}`;
      if (!colorMap.has(key)) colorMap.set(key, { ...color });
    });
  });
  erasedColors = [...colorMap.values()];
  selectedErasedColorIndexes = new Set([...selectedErasedColorIndexes].filter((index) => index >= 0 && index < erasedColors.length));
  eraseColor = selectedErasedColorIndexes.size
    ? { ...erasedColors[[...selectedErasedColorIndexes].at(-1)] }
    : erasedColors.length ? { ...erasedColors[erasedColors.length - 1] } : null;
  eraseBorders = selectedEntries.length > 0 && selectedEntries.every(({ image }) => getImageEraseSettings(image).eraseBorders);
}

imageInput.addEventListener("change", (event) => {
  addImages(event.target.files);
  imageInput.value = "";
});

document.addEventListener("paste", (event) => {
  if (isTypingTarget(event.target)) return;
  const clipboardImages = [...(event.clipboardData?.items || [])]
    .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
    .map((item) => item.getAsFile())
    .filter(Boolean)
    .map((file, index) => file.name ? file : new File([file], `imagem-colada-${Date.now()}-${index + 1}.png`, { type: file.type || "image/png" }));
  const htmlImages = clipboardImages.length ? [] : getImagesFromClipboardHtml(event.clipboardData?.getData("text/html") || "");
  const externalClipboardImages = clipboardImages.length ? clipboardImages : htmlImages;
  const useInternalClipboard = internalImageClipboard.length > externalClipboardImages.length;
  const pastedImages = useInternalClipboard ? internalImageClipboard : externalClipboardImages;
  if (!pastedImages.length) return;
  event.preventDefault();
  addImages(pastedImages, { afterSelection: true });
  internalImageClipboard = [];
});

document.addEventListener("pointerup", handleGlobalPointerRelease);
document.addEventListener("pointercancel", handleGlobalPointerRelease);
window.addEventListener("blur", () => {
  internalImageClipboard = [];
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a" && !isTypingTarget(event.target) && !selectAllGapsButton.disabled) {
    event.preventDefault();
    selectAllGapsButton.click();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c" && !isTypingTarget(event.target)) {
    const selectedEntries = getSelectedImageEntries();
    if (selectedEntries.length) {
      event.preventDefault();
      copySelectedImages(selectedEntries);
      return;
    }
  }
  if (event.key === "Delete" && !isTypingTarget(event.target) && selectedErasedColorIndexes.size) {
    event.preventDefault();
    deleteSelectedErasedColors();
    return;
  }
  if (event.key === "Delete" && !isTypingTarget(event.target) && !deleteImageButton.disabled) {
    event.preventDefault();
    deleteImageButton.click();
    return;
  }
  if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
  const changed = event.shiftKey ? redo() : undo();
  if (changed) {
    event.preventDefault();
    showHistoryToast(event.shiftKey ? "redo" : "undo");
  }
});

addMoreButton.addEventListener("click", () => imageInput.click());
highlightToggle.addEventListener("click", () => {
  if (highlightToggle.disabled) return;
  highlightEnabled = !highlightEnabled;
  highlightToggle.classList.toggle("is-active", highlightEnabled);
  highlightToggle.setAttribute("aria-pressed", String(highlightEnabled));
  commitHistory();
  renderComposition();
});
verticalToggle.addEventListener("click", () => {
  isVertical = !isVertical;
  verticalToggle.classList.toggle("is-active", isVertical);
  verticalToggle.setAttribute("aria-pressed", String(isVertical));
  alignButtons.forEach((button) => { button.disabled = isVertical; });
  horizontalAlignButtons.forEach((button) => { button.disabled = !isVertical; });
  updateLayoutLabel();
  commitHistory();
  renderComposition();
});
exportButton.addEventListener("click", exportComposition);
copyButton.addEventListener("click", copyComposition);
themeToggle.addEventListener("click", toggleTheme);
aboutButton.addEventListener("click", openAbout);
aboutClose.addEventListener("click", closeAbout);
settingsButton.addEventListener("click", () => settingsOverlay.hidden ? openSettings() : closeSettings());
settingsClose.addEventListener("click", closeSettings);
scrollStarsToggle.addEventListener("change", (event) => setScrollFireworksEnabled(event.target.checked));
previewQualitySelect.addEventListener("change", (event) => setPreviewQuality(event.target.value));
aboutOverlay.addEventListener("click", (event) => {
  if (event.target === aboutOverlay) closeAbout();
});
settingsOverlay.addEventListener("click", (event) => {
  if (event.target === settingsOverlay) closeSettings();
});
erasedColorsList.addEventListener("keydown", (event) => {
  if (event.key !== "Delete" || isTypingTarget(event.target) || !selectedErasedColorIndexes.size) return;
  event.preventDefault();
  event.stopPropagation();
  deleteSelectedErasedColors();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !aboutOverlay.hidden) closeAbout();
  if (event.key === "Escape" && !settingsOverlay.hidden) closeSettings();
});
deleteImageButton.addEventListener("click", deleteSelectedImage);
canvas.addEventListener("click", handleCanvasClick);
canvasScroll.addEventListener("pointerdown", beginCanvasReorder);
canvasScroll.addEventListener("pointermove", moveCanvasReorder);
canvasScroll.addEventListener("pointerup", finishCanvasReorder);
canvasScroll.addEventListener("pointercancel", finishCanvasReorder);
canvasScroll.addEventListener("contextmenu", (event) => event.preventDefault());
colorTargetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeColorTarget = button.dataset.colorTarget;
    syncHsvFromActiveColor();
    updateColorControls();
  });
});
hexInput.addEventListener("change", applyHexInput);
hexInput.addEventListener("blur", applyHexInput);
colorSurface.addEventListener("click", chooseSurfaceColor);
let isColorSurfaceDragging = false;
colorSurface.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  isColorSurfaceDragging = true;
  colorSurface.setPointerCapture?.(event.pointerId);
  chooseSurfaceColor(event, false);
  event.preventDefault();
});
colorSurface.addEventListener("pointermove", (event) => {
  if (!isColorSurfaceDragging) return;
  chooseSurfaceColor(event, false);
  event.preventDefault();
});
colorSurface.addEventListener("pointerup", (event) => {
  isColorSurfaceDragging = false;
  if (colorSurface.hasPointerCapture?.(event.pointerId)) colorSurface.releasePointerCapture(event.pointerId);
  commitHistory();
});
colorSurface.addEventListener("pointercancel", () => { isColorSurfaceDragging = false; });
colorSurface.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    chooseSurfaceColor(event);
  }
});
hueSlider.addEventListener("input", () => {
  selectedHue = Number(hueSlider.value);
  updateColorControls();
  if (getActiveColor()) {
    setColor(hsvToHex(selectedHue, selectedSaturation, selectedValue), false, false);
    scheduleCompositionRender();
  }
});
hueSlider.addEventListener("change", () => commitHistory());
[transparencySlider].forEach((input) => {
  input.addEventListener("input", () => {
    setActiveOpacity(1 - Number(input.value) / 100);
    updateColorControls();
    scheduleCompositionRender();
  });
  input.addEventListener("change", () => commitHistory());
});
[redInput, greenInput, blueInput].forEach((input) => {
  input.addEventListener("change", applyRgbInputs);
  input.addEventListener("blur", applyRgbInputs);
});
transparentToggle.addEventListener("click", () => {
  if (!getActiveColor()) {
    setColor(hsvToHex(selectedHue, selectedSaturation, selectedValue));
    return;
  }
  setActiveColor(null, false);
  updateColorControls();
  commitHistory();
  renderComposition();
});
borderThicknessInput.addEventListener("input", () => {
  borderThickness = clamp(Number.parseInt(borderThicknessInput.value, 10) || 0, 0, 200);
  borderThicknessInput.value = borderThickness;
  applyBorderControlsToSelection();
  scheduleCompositionRender();
});
borderThicknessInput.addEventListener("change", commitHistory);
borderRadiusGeneralInput.addEventListener("input", () => {
  const radius = clamp(Number.parseInt(borderRadiusGeneralInput.value, 10) || 0, 0, 1000);
  borderRadiusGeneralInput.value = radius;
  Object.keys(borderRadii).forEach((corner) => { borderRadii[corner] = radius; });
  updateBorderControls();
  applyBorderControlsToSelection();
  scheduleCompositionRender();
});
borderRadiusGeneralInput.addEventListener("change", commitHistory);
Object.entries(borderRadiusInputs).forEach(([corner, input]) => {
  input.addEventListener("input", () => {
    borderRadii[corner] = clamp(Number.parseInt(input.value, 10) || 0, 0, 1000);
    input.value = borderRadii[corner];
    updateBorderControls();
    applyBorderControlsToSelection();
    scheduleCompositionRender();
  });
  input.addEventListener("change", commitHistory);
});

const enterParameterHandlers = new Map([
  [hexInput, applyHexInput],
  [redInput, applyRgbInputs],
  [greenInput, applyRgbInputs],
  [blueInput, applyRgbInputs],
  [spacingInput, () => applySpacing()],
  [paddingInput, () => applyPadding()],
  [borderThicknessInput, () => { borderThicknessInput.dispatchEvent(new Event("change")); }],
  [borderRadiusGeneralInput, () => { borderRadiusGeneralInput.dispatchEvent(new Event("change")); }],
  [borderRadiusInputs.topLeft, () => { borderRadiusInputs.topLeft.dispatchEvent(new Event("change")); }],
  [borderRadiusInputs.bottomLeft, () => { borderRadiusInputs.bottomLeft.dispatchEvent(new Event("change")); }],
  [borderRadiusInputs.bottomRight, () => { borderRadiusInputs.bottomRight.dispatchEvent(new Event("change")); }],
  [borderRadiusInputs.topRight, () => { borderRadiusInputs.topRight.dispatchEvent(new Event("change")); }],
  [hueSlider, () => hueSlider.dispatchEvent(new Event("change"))],
  [transparencySlider, () => transparencySlider.dispatchEvent(new Event("change"))]
]);
enterParameterHandlers.forEach((handler, input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handler();
  });
});
orderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedOrder = button.dataset.order;
    customOrder = false;
    manualOrder = [];
    orderButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-checked", String(isActive));
    });
    updateLayoutLabel();
    commitHistory();
    renderComposition();
  });
});
alignButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isVertical) return;
    selectedAlignment = button.dataset.align;
    alignButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-checked", String(isActive));
    });
    updateLayoutLabel();
    commitHistory();
    renderComposition();
  });
});
horizontalAlignButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!isVertical) return;
    selectedHorizontalAlignment = button.dataset.horizontalAlign;
    horizontalAlignButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-checked", String(isActive));
    });
    updateLayoutLabel();
    commitHistory();
    renderComposition();
  });
});
applySpacingButton.addEventListener("click", applySpacing);
applyPaddingButton.addEventListener("click", applyPadding);
eraseColorButton.addEventListener("click", startColorErase);
eraseBorderButton.addEventListener("click", toggleBorderErase);
rescaleButton.addEventListener("click", rescaleImagesToVisibleBounds);
eraseResetButton.addEventListener("click", resetErasedColors);
selectAllGapsButton.addEventListener("click", () => {
  selectedErasedColorIndexes.clear();
  erasedColorAnchorIndex = null;
  if (allGapsSelected) {
    allGapsSelected = false;
    selectedImageIndex = null;
    selectedImageIndexes.clear();
    selectionAnchorIndex = null;
  } else {
    allGapsSelected = true;
    selectedImageIndex = null;
    selectionAnchorIndex = null;
    selectedImageIndexes = new Set(displayedImages.map((_, index) => index));
  }
  updateSpacingControls();
  if (allGapsSelected) pulseSelectedImages();
});

["dragenter", "dragover"].forEach((eventName) => {
  uploadCard.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadCard.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  uploadCard.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadCard.classList.remove("is-dragging");
  });
});

uploadCard.addEventListener("drop", (event) => addImages(event.dataTransfer.files));

function hasDraggedImageFiles(event) {
  return [...(event.dataTransfer?.files || [])].some((file) => file.type.startsWith("image/"))
    || [...(event.dataTransfer?.types || [])].includes("Files");
}

document.addEventListener("dragover", (event) => {
  if (!hasDraggedImageFiles(event) || uploadCard.contains(event.target)) return;
  event.preventDefault();
  uploadCard.classList.add("is-dragging");
});

document.addEventListener("dragleave", (event) => {
  if (event.relatedTarget === null) uploadCard.classList.remove("is-dragging");
});

document.addEventListener("drop", (event) => {
  if (uploadCard.contains(event.target) || !hasDraggedImageFiles(event)) return;
  const imageFiles = [...(event.dataTransfer?.files || [])].filter((file) => file.type.startsWith("image/"));
  if (!imageFiles.length) return;
  event.preventDefault();
  uploadCard.classList.remove("is-dragging");
  addImages(imageFiles);
});

function addImages(fileCollection, options = {}) {
  const validFiles = [...fileCollection].filter((file) => file.type.startsWith("image/"));
  if (!validFiles.length) return;

  const readers = validFiles.map((file) => loadImage(file));
  Promise.all(readers).then((newImages) => {
    const currentOrder = getOrderedImages();
    const selectedSet = new Set(getSelectedImageEntries());
    const selectedIndexes = currentOrder
      .map((entry, index) => selectedSet.has(entry) ? index : -1)
      .filter((index) => index >= 0);
    const insertIndex = options.afterSelection && selectedIndexes.length
      ? Math.max(...selectedIndexes) + 1
      : currentOrder.length;
    const nextOrder = [
      ...currentOrder.slice(0, insertIndex),
      ...newImages,
      ...currentOrder.slice(insertIndex)
    ];
    selectedImages = [...selectedImages, ...newImages];
    manualOrder = nextOrder;
    customOrder = options.afterSelection && selectedIndexes.length > 0 ? true : customOrder;
    if (options.afterSelection && selectedIndexes.length) {
      gapSizes = [...gapSizes];
      gapSizes.splice(insertIndex, 0, 0);
      allGapsSelected = false;
      selectedImageIndexes = new Set(newImages.map((entry) => nextOrder.indexOf(entry)));
      selectedImageIndex = nextOrder.indexOf(newImages.at(-1));
      selectionAnchorIndex = nextOrder.indexOf(newImages[0]);
    }
    orderButtons.forEach((button) => {
      const isActive = !customOrder && button.dataset.order === selectedOrder;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-checked", String(isActive));
    });
    updateLayoutLabel();
    commitHistory();
    renderComposition(true);
    pulseWorkspacePanels();
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ file, image });
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}

function getOrderedImages() {
  manualOrder = [
    ...manualOrder.filter((item) => selectedImages.includes(item)),
    ...selectedImages.filter((item) => !manualOrder.includes(item))
  ];
  if (customOrder) return manualOrder.filter((item) => selectedImages.includes(item));
  const descending = [...selectedImages].sort((a, b) => b.image.height - a.image.height);
  return selectedOrder === "asc" ? descending.reverse() : descending;
}

function pulseWorkspacePanels() {
  const className = "image-added-flash";
  document.body.classList.remove(className);
  void workspace.offsetWidth;
  document.body.classList.add(className);
  window.clearTimeout(panelMotionTimer);
  panelMotionTimer = window.setTimeout(() => {
    document.body.classList.remove(className);
  }, 900);
}

function renderComposition(shouldScroll = false, animate = true) {
  if (compositionRenderFrameId !== null) {
    cancelAnimationFrame(compositionRenderFrameId);
    compositionRenderFrameId = null;
    compositionRenderShouldScroll = false;
  }
  stopCurrentAnimation(animate);
  if (!selectedImages.length) {
    canvas.width = 0;
    canvas.height = 0;
    compositionWidth = 0;
    compositionHeight = 0;
    applyPreviewZoom();
    displayedImages = [];
    imageRects = [];
    hoveredImageIndex = null;
    canvasSelectionLayer.innerHTML = "";
    workspace.hidden = true;
    demoStrip.hidden = false;
    copyButton.disabled = true;
    fileList.innerHTML = "";
    updateSpacingControls();
    return;
  }
  const previousRects = imageRects.map((rect) => ({ ...rect }));
  const backgroundKey = `${selectedColor || "transparent"}:${colorOpacity}`;
  const shouldFadeBackground = lastBackgroundKey !== null && lastBackgroundKey !== backgroundKey;
  lastBackgroundKey = backgroundKey;
  const orderedImages = getOrderedImages();
  const nextRects = [];
  const renderableImages = new Map();
  const maxHeight = Math.max(...orderedImages.map(({ image }) => image.height));
  const maxWidth = Math.max(...orderedImages.map(({ image }) => image.width));
  const gapCount = Math.max(0, orderedImages.length - 1);
  gapSizes = [...gapSizes.slice(0, gapCount), ...Array(Math.max(0, gapCount - gapSizes.length)).fill(0)];
  const totalGap = gapSizes.reduce((sum, gap) => sum + gap, 0);
  const totalWidth = isVertical ? maxWidth + paddingSize * 2 : orderedImages.reduce((sum, { image }) => sum + image.width, 0) + totalGap + paddingSize * 2;
  const totalHeight = isVertical ? orderedImages.reduce((sum, { image }) => sum + image.height, 0) + totalGap + paddingSize * 2 : maxHeight + paddingSize * 2;

  compositionWidth = totalWidth;
  compositionHeight = totalHeight;
  canvas.width = Math.max(1, Math.round(totalWidth * previewQuality));
  canvas.height = Math.max(1, Math.round(totalHeight * previewQuality));
  context = canvas.getContext("2d");
  context.setTransform(previewQuality, 0, 0, previewQuality, 0, 0);
  context.imageSmoothingEnabled = true;
  applyPreviewZoom();
  context.clearRect(0, 0, totalWidth, totalHeight);
  if (selectedColor && colorOpacity > 0) {
    context.fillStyle = colorWithOpacity(selectedColor, colorOpacity);
    context.fillRect(0, 0, totalWidth, totalHeight);
  }

  if (isVertical) {
    let yPosition = paddingSize;
    orderedImages.forEach(({ image }, index) => {
      const renderableImage = getRenderableImage(image);
      renderableImages.set(image, renderableImage);
      const xOffset = selectedHorizontalAlignment === "left"
        ? 0
        : selectedHorizontalAlignment === "right"
          ? maxWidth - image.width
          : Math.round((maxWidth - image.width) / 2);
      const xPosition = Math.round(paddingSize + xOffset);
      nextRects.push({ left: xPosition, top: yPosition, right: xPosition + image.width, bottom: yPosition + image.height, index: nextRects.length, image, borderSettings: cloneBorderSettings(getImageBorderSettings(image)) });
      yPosition += image.height + (gapSizes[index] || 0);
    });
  } else {
    let xPosition = paddingSize;
    orderedImages.forEach(({ image }, index) => {
      const renderableImage = getRenderableImage(image);
      renderableImages.set(image, renderableImage);
      const yPosition = paddingSize + (selectedAlignment === "top" ? 0 : selectedAlignment === "bottom" ? maxHeight - image.height : Math.round((maxHeight - image.height) / 2));
      nextRects.push({ left: xPosition, top: yPosition, right: xPosition + image.width, bottom: yPosition + image.height, index: nextRects.length, image, borderSettings: cloneBorderSettings(getImageBorderSettings(image)) });
      xPosition += image.width + (gapSizes[index] || 0);
    });
  }

  imageRects = nextRects;
  displayedImages = orderedImages;
  hoveredImageIndex = hoveredImageIndex !== null && hoveredImageIndex < orderedImages.length ? hoveredImageIndex : null;
  updateSelectionLayer();
  animateComposition(animate ? previousRects : [], nextRects, renderableImages, totalWidth, totalHeight);

  workspace.hidden = false;
  demoStrip.hidden = true;
  copyButton.disabled = false;
  imageCount.textContent = `${orderedImages.length} ${orderedImages.length === 1 ? t("image", "imagem") : t("images", "imagens")}`;
  compositionSize.textContent = `${totalWidth.toLocaleString(uiLanguage === "en" ? "en-US" : "pt-BR")} × ${totalHeight.toLocaleString(uiLanguage === "en" ? "en-US" : "pt-BR")} px`;
  renderFileList(orderedImages);
  updateSpacingControls();
  if (shouldFadeBackground) {
    canvas.classList.remove("canvas-fade");
    void canvas.offsetWidth;
    canvas.classList.add("canvas-fade");
    canvas.addEventListener("animationend", () => canvas.classList.remove("canvas-fade"), { once: true });
  }
  if (shouldScroll) workspace.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scheduleCompositionRender(shouldScroll = false) {
  compositionRenderShouldScroll ||= shouldScroll;
  if (compositionRenderFrameId !== null) return;
  compositionRenderFrameId = requestAnimationFrame(() => {
    const shouldScrollNow = compositionRenderShouldScroll;
    compositionRenderFrameId = null;
    compositionRenderShouldScroll = false;
    renderComposition(shouldScrollNow, false);
  });
}

function drawHighlightBorders(rects) {
  if (!highlightEnabled) return;
  const selectedIndexes = allGapsSelected
    ? new Set(imageRects.map((rect) => rect.index))
    : new Set([...selectedImageIndexes, ...(selectedImageIndex === null ? [] : [selectedImageIndex])]);
  if (!selectedIndexes.size) return;

  context.save();
  context.strokeStyle = isDarkTheme ? "#ed7926" : "#3c6d2e";
  context.lineJoin = "round";
  rects.forEach((rect) => {
    if (!selectedIndexes.has(rect.index)) return;
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const thickness = clamp(selectionBorderThickness, 1, Math.min(width, height) / 2);
    const outerRadii = clampCornerRadii(rect.borderSettings?.radii || borderRadii, width, height);
    context.globalAlpha = clamp(rect.opacity, 0, 1);
    context.lineWidth = thickness;
    roundedRectPath(context, rect.left, rect.top, width, height, outerRadii);
    context.stroke();
  });
  context.restore();
}

function animateComposition(previousRects, nextRects, renderableImages, totalWidth, totalHeight) {
  const previousByImage = new Map(previousRects.map((rect) => [rect.image, rect]));
  const nextImages = new Set(nextRects.map((rect) => rect.image));
  const transitions = nextRects.map((end) => {
    const start = previousByImage.get(end.image) || end;
    return {
      image: end.image,
      source: renderableImages.get(end.image),
      start,
      end,
      borderSettings: end.borderSettings || getImageBorderSettings(end.image),
      startOpacity: previousByImage.has(end.image) ? 1 : 0,
      endOpacity: 1
    };
  });

  previousRects.forEach((start) => {
    if (!nextImages.has(start.image)) {
      transitions.push({
        image: start.image,
        source: getRenderableImage(start.image),
        start,
        end: start,
        borderSettings: start.borderSettings || getImageBorderSettings(start.image),
        startOpacity: 1,
        endOpacity: 0
      });
    }
  });

  const drawFrame = (progress) => {
    const eased = 1 - Math.pow(1 - progress, 3);
    const drawnRects = [];
    context.clearRect(0, 0, totalWidth, totalHeight);
    if (selectedColor && colorOpacity > 0) {
      context.fillStyle = colorWithOpacity(selectedColor, colorOpacity);
      context.fillRect(0, 0, totalWidth, totalHeight);
    }
    transitions.forEach(({ source, start, end, borderSettings, startOpacity, endOpacity }) => {
      const x = start.left + (end.left - start.left) * eased;
      const y = start.top + (end.top - start.top) * eased;
      const opacity = startOpacity + (endOpacity - startOpacity) * eased;
      const travel = Math.hypot(end.left - start.left, end.top - start.top);
      const blur = Math.min(3.2, travel / 70) * Math.sin(Math.PI * progress);
      context.save();
      context.globalAlpha = opacity;
      context.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : "none";
      drawRenderableImage(source, x, y, end.right - end.left, end.bottom - end.top, borderSettings);
      context.restore();
      drawnRects.push({ left: x, top: y, right: x + end.right - end.left, bottom: y + end.bottom - end.top, index: end.index, opacity, borderSettings });
    });
    drawHighlightBorders(drawnRects);
  };

  if (!previousRects.length) {
    drawFrame(1);
    return;
  }

  const startedAt = performance.now();
  const duration = 520;
  finishAnimation = () => drawFrame(1);
  const tick = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    drawFrame(progress);
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(tick);
    } else {
      animationFrameId = null;
      finishAnimation = null;
    }
  };
  animationFrameId = requestAnimationFrame(tick);
}

function stopCurrentAnimation(complete = true) {
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  if (complete && finishAnimation) finishAnimation();
  finishAnimation = null;
}

function getRenderableImage(image) {
  const eraseSettings = getImageEraseSettings(image);
  const colorsToErase = eraseSettings.colors;
  if (!colorsToErase.length && !eraseSettings.eraseBorders) return image;
  const signature = `${eraseSettings.eraseBorders ? 1 : 0}|${colorsToErase.map(({ r, g, b }) => `${r},${g},${b}`).join(";")}`;
  const cached = imageRenderCache.get(image);
  if (cached?.signature === signature) return cached.result;
  const processedCanvas = document.createElement("canvas");
  processedCanvas.width = image.width;
  processedCanvas.height = image.height;
  const processedContext = processedCanvas.getContext("2d", { willReadFrequently: true });
  processedContext.drawImage(image, 0, 0);
  const pixels = processedContext.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
  const data = pixels.data;
  if (colorsToErase.length) {
    const erasedColorSet = new Set(colorsToErase.map(({ r, g, b }) => (r << 16) | (g << 8) | b));
    for (let index = 0; index < data.length; index += 4) {
      if (data[index + 3] === 0) continue;
      const colorKey = (data[index] << 16) | (data[index + 1] << 8) | data[index + 2];
      if (erasedColorSet.has(colorKey)) data[index + 3] = 0;
    }
  }
  processedContext.putImageData(pixels, 0, 0);
  if (eraseSettings.eraseBorders) removeConnectedEdgeColor(processedCanvas);
  imageRenderCache.set(image, { signature, result: processedCanvas });
  return processedCanvas;
}

function removeConnectedEdgeColor(sourceCanvas) {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  if (!width || !height) return;
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const pixels = sourceContext.getImageData(0, 0, width, height);
  const data = pixels.data;
  const corners = [0, (width - 1) * 4, ((height - 1) * width) * 4, ((height * width) - 1) * 4];
  if (corners.some((offset) => data[offset + 3] === 0)) return;
  const reference = { r: data[corners[0]], g: data[corners[0] + 1], b: data[corners[0] + 2] };
  const tolerance = 4;
  const matchesReference = (pixelIndex) => {
    const offset = pixelIndex * 4;
    return data[offset + 3] > 0
      && Math.max(Math.abs(data[offset] - reference.r), Math.abs(data[offset + 1] - reference.g), Math.abs(data[offset + 2] - reference.b)) <= tolerance;
  };
  if (corners.some((offset) => Math.max(Math.abs(data[offset] - reference.r), Math.abs(data[offset + 1] - reference.g), Math.abs(data[offset + 2] - reference.b)) > tolerance)) return;

  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let queueStart = 0;
  let queueEnd = 0;
  const enqueue = (pixelIndex) => {
    if (visited[pixelIndex] || !matchesReference(pixelIndex)) return;
    visited[pixelIndex] = 1;
    queue[queueEnd] = pixelIndex;
    queueEnd += 1;
  };
  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }
  while (queueStart < queueEnd) {
    const pixelIndex = queue[queueStart];
    queueStart += 1;
    data[pixelIndex * 4 + 3] = 0;
    const x = pixelIndex % width;
    if (x > 0) enqueue(pixelIndex - 1);
    if (x < width - 1) enqueue(pixelIndex + 1);
    if (pixelIndex >= width) enqueue(pixelIndex - width);
    if (pixelIndex < width * (height - 1)) enqueue(pixelIndex + width);
  }
  sourceContext.putImageData(pixels, 0, 0);
}

function cropTransparentBounds(source) {
  const width = source.width;
  const height = source.height;
  if (!width || !height) return source;
  const sourceCanvas = source instanceof HTMLCanvasElement ? source : (() => {
    const canvasCopy = document.createElement("canvas");
    canvasCopy.width = width;
    canvasCopy.height = height;
    canvasCopy.getContext("2d").drawImage(source, 0, 0);
    return canvasCopy;
  })();
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const pixels = sourceContext.getImageData(0, 0, width, height).data;
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[(y * width + x) * 4 + 3] === 0) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < left || bottom < top) {
    const emptyCanvas = document.createElement("canvas");
    emptyCanvas.width = 1;
    emptyCanvas.height = 1;
    return emptyCanvas;
  }
  if (left === 0 && top === 0 && right === width - 1 && bottom === height - 1) return source;
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = right - left + 1;
  croppedCanvas.height = bottom - top + 1;
  croppedCanvas.getContext("2d").drawImage(sourceCanvas, left, top, croppedCanvas.width, croppedCanvas.height, 0, 0, croppedCanvas.width, croppedCanvas.height);
  return croppedCanvas;
}

function rescaleImagesToVisibleBounds() {
  const selectedEntries = getSelectedImageEntries();
  if (!selectedEntries.length || !selectedEntries.some(({ image }) => {
    const settings = getImageEraseSettings(image);
    return settings.colors.length || settings.eraseBorders;
  })) return;
  const selectedSet = new Set(selectedEntries);
  const replacements = new Map();
  const nextImages = selectedImages.map((entry) => {
    if (!selectedSet.has(entry)) return entry;
    const visibleImage = cropTransparentBounds(getRenderableImage(entry.image));
    if (visibleImage === entry.image || (visibleImage.width === entry.image.width && visibleImage.height === entry.image.height)) return entry;
    const nextEntry = { ...entry, image: visibleImage };
    replacements.set(entry, nextEntry);
    const settings = imageBorderSettings.get(entry.image);
    if (settings) imageBorderSettings.set(visibleImage, cloneBorderSettings(settings));
    imageBorderSettings.delete(entry.image);
    const eraseSettings = imageEraseSettings.get(entry.image);
    if (eraseSettings) imageEraseSettings.set(visibleImage, cloneEraseSettings(eraseSettings));
    imageEraseSettings.delete(entry.image);
    return nextEntry;
  });
  if (!replacements.size) return;
  selectedImages = nextImages;
  manualOrder = manualOrder.map((entry) => replacements.get(entry) || entry);
  commitHistory();
  renderComposition();
}

function drawRenderableImage(source, x, y, width, height, settings = null) {
  const activeSettings = settings || { thickness: borderThickness, radii: borderRadii };
  const thickness = clamp(activeSettings.thickness, 0, Math.min(width, height) / 2);
  const outerRadii = clampCornerRadii(activeSettings.radii, width, height);
  const borderColorValue = borderColor ? colorWithOpacity(borderColor, borderOpacity) : "transparent";
  context.save();
  roundedRectPath(context, x, y, width, height, outerRadii);
  context.clip();
  if (thickness > 0 && borderColor) {
    context.fillStyle = borderColorValue;
    context.fillRect(x, y, width, height);
  }
  const inset = thickness;
  const innerWidth = Math.max(0, width - inset * 2);
  const innerHeight = Math.max(0, height - inset * 2);
  const innerRadii = {
    topLeft: Math.max(0, outerRadii.topLeft - inset),
    topRight: Math.max(0, outerRadii.topRight - inset),
    bottomRight: Math.max(0, outerRadii.bottomRight - inset),
    bottomLeft: Math.max(0, outerRadii.bottomLeft - inset)
  };
  roundedRectPath(context, x + inset, y + inset, innerWidth, innerHeight, innerRadii);
  context.clip();
  context.drawImage(source, x + inset, y + inset, innerWidth, innerHeight);
  context.restore();
}

function roundedRectPath(targetContext, x, y, width, height, radii) {
  const topLeft = radii.topLeft;
  const topRight = radii.topRight;
  const bottomRight = radii.bottomRight;
  const bottomLeft = radii.bottomLeft;
  targetContext.beginPath();
  targetContext.moveTo(x + topLeft, y);
  targetContext.lineTo(x + width - topRight, y);
  targetContext.quadraticCurveTo(x + width, y, x + width, y + topRight);
  targetContext.lineTo(x + width, y + height - bottomRight);
  targetContext.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
  targetContext.lineTo(x + bottomLeft, y + height);
  targetContext.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
  targetContext.lineTo(x, y + topLeft);
  targetContext.quadraticCurveTo(x, y, x + topLeft, y);
  targetContext.closePath();
}

function clampCornerRadii(radii, width, height) {
  const nextRadii = { ...radii };
  const horizontalScale = width / Math.max(1, nextRadii.topLeft + nextRadii.topRight, nextRadii.bottomLeft + nextRadii.bottomRight);
  const verticalScale = height / Math.max(1, nextRadii.topLeft + nextRadii.bottomLeft, nextRadii.topRight + nextRadii.bottomRight);
  const scale = Math.min(1, horizontalScale, verticalScale);
  Object.keys(nextRadii).forEach((corner) => { nextRadii[corner] = Math.max(0, nextRadii[corner] * scale); });
  return nextRadii;
}

function updateLayoutLabel() {
  const orderLabel = customOrder
    ? t("customOrder", "ordem personalizada")
    : selectedOrder === "asc" ? t("smallerLarger", "menor → maior") : t("largerSmaller", "maior → menor");
  layoutLabel.textContent = isVertical
    ? `${orderLabel} · vertical · ${selectedHorizontalAlignment === "left" ? t("left", "esquerda") : selectedHorizontalAlignment === "right" ? t("right", "direita") : t("center", "centralizado")}`
    : `${orderLabel} · ${selectedAlignment === "top" ? t("top", "para cima") : selectedAlignment === "bottom" ? t("bottom", "para baixo") : t("center", "centralizado")}`;
}

function selectImageAt(event) {
  if (!imageRects.length) return;
  if (eraseMode) positionErasePicker(event);
  const bounds = canvas.getBoundingClientRect();
  const scaleX = compositionWidth / bounds.width;
  const scaleY = compositionHeight / bounds.height;
  const x = (event.clientX - bounds.left) * scaleX;
  const y = (event.clientY - bounds.top) * scaleY;
  const target = imageRects.find((rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
  if (!target) {
    if (eraseMode) updateEraseStatus();
    return;
  }
  if (eraseMode) {
    const pixelX = clamp(Math.floor(x * previewQuality), 0, Math.max(0, canvas.width - 1));
    const pixelY = clamp(Math.floor(y * previewQuality), 0, Math.max(0, canvas.height - 1));
    const pixel = context.getImageData(pixelX, pixelY, 1, 1).data;
    addErasedColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
    eraseMode = false;
    eraseColorButton.classList.remove("is-active");
    canvasScroll.classList.remove("is-eyedropper");
    commitHistory();
    renderComposition();
    return;
  }
  selectImageGap(target.index, event.ctrlKey || event.metaKey, event.shiftKey);
}

function handleCanvasClick(event) {
  if (suppressCanvasClick) {
    suppressCanvasClick = false;
    return;
  }
  selectImageAt(event);
}

function getCanvasImageAt(event) {
  if (!imageRects.length) return null;
  const bounds = canvas.getBoundingClientRect();
  const scaleX = compositionWidth / bounds.width;
  const scaleY = compositionHeight / bounds.height;
  const x = (event.clientX - bounds.left) * scaleX;
  const y = (event.clientY - bounds.top) * scaleY;
  return imageRects.find((rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) || null;
}

function updateHoveredImage(event) {
  updateErasePickerFromPointer(event);
  const nextIndex = getCanvasImageAt(event)?.index ?? null;
  if (nextIndex === hoveredImageIndex) return;
  hoveredImageIndex = nextIndex;
  updateSelectionLayer();
}

function clearHoveredImage() {
  if (hoveredImageIndex === null) return;
  hoveredImageIndex = null;
  updateSelectionLayer();
}

function positionErasePicker(event) {
  if (!erasePickerCard || !canvasFrame || !event) return;
  const frameBounds = canvasFrame.getBoundingClientRect();
  const cardWidth = erasePickerCard.offsetWidth || 230;
  const cardHeight = erasePickerCard.offsetHeight || 60;
  const left = clamp(event.clientX - frameBounds.left + 16, 8, Math.max(8, frameBounds.width - cardWidth - 8));
  const top = clamp(event.clientY - frameBounds.top - cardHeight - 14, 8, Math.max(8, frameBounds.height - cardHeight - 8));
  erasePickerCard.style.left = `${left}px`;
  erasePickerCard.style.top = `${top}px`;
}

function updateErasePickerFromPointer(event) {
  if (!eraseMode || !erasePickerCard) return;
  positionErasePicker(event);
  const target = getCanvasImageAt(event);
  if (!target) {
    updateErasePickerCard(null, event);
    return;
  }
  const bounds = canvas.getBoundingClientRect();
  const x = clamp((event.clientX - bounds.left) * compositionWidth / bounds.width, 0, Math.max(0, compositionWidth - 1));
  const y = clamp((event.clientY - bounds.top) * compositionHeight / bounds.height, 0, Math.max(0, compositionHeight - 1));
  const pixelX = clamp(Math.floor(x * previewQuality), 0, Math.max(0, canvas.width - 1));
  const pixelY = clamp(Math.floor(y * previewQuality), 0, Math.max(0, canvas.height - 1));
  const pixel = context.getImageData(pixelX, pixelY, 1, 1).data;
  updateErasePickerCard({ r: pixel[0], g: pixel[1], b: pixel[2] }, event);
}

function isPointerInsideCanvasScroll(event) {
  if (!event || typeof event.clientX !== "number" || typeof event.clientY !== "number") return true;
  const bounds = canvasScroll.getBoundingClientRect();
  return event.clientX >= bounds.left && event.clientX <= bounds.right
    && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
}

function pulseSelectedImages() {
  updateSelectionLayer();
  window.clearTimeout(selectionPulseTimer);
  const selected = [...canvasSelectionLayer.querySelectorAll(".canvas-selection.is-selected")];
  selected.forEach((element) => {
    element.classList.remove("is-pulse");
    void element.offsetWidth;
    element.classList.add("is-pulse");
  });
  selectionPulseTimer = window.setTimeout(() => {
    selected.forEach((element) => element.classList.remove("is-pulse"));
  }, 720);
}

function updateSelectionLayer() {
  if (!canvasSelectionLayer) return;
  canvasSelectionLayer.innerHTML = imageRects.map((rect) => {
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const radii = clampCornerRadii(rect.borderSettings?.radii || borderRadii, width, height);
    const selectionThickness = selectionBorderThickness;
    const expansion = selectionThickness / 2;
    const selectionRadii = {
      topLeft: radii.topLeft + expansion,
      topRight: radii.topRight + expansion,
      bottomRight: radii.bottomRight + expansion,
      bottomLeft: radii.bottomLeft + expansion
    };
    const isSelected = allGapsSelected || selectedImageIndexes.has(rect.index) || selectedImageIndex === rect.index;
    const classes = ["canvas-selection"];
    if (hoveredImageIndex === rect.index) classes.push("is-hovered");
    if (isSelected) classes.push("is-selected");
    if (canvasReorderState?.sourceIndex === rect.index) classes.push("is-reorder-source");
    if (reorderHoverIndex === rect.index) classes.push("is-reorder-target");
    return `<div class="${classes.join(" ")}" data-image-index="${rect.index}" style="left:${rect.left - expansion}px;top:${rect.top - expansion}px;width:${width + selectionThickness}px;height:${height + selectionThickness}px;border-radius:${selectionRadii.topLeft}px ${selectionRadii.topRight}px ${selectionRadii.bottomRight}px ${selectionRadii.bottomLeft}px;--selection-thickness:${selectionThickness}px"></div>`;
  }).join("");
}

function applyPreviewZoom() {
  if (!canvasStage || !canvas) return;
  const width = compositionWidth * previewZoom;
  const height = compositionHeight * previewZoom;
  canvasStage.style.width = `${width}px`;
  canvasStage.style.height = `${height}px`;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvasSelectionLayer.style.width = `${compositionWidth}px`;
  canvasSelectionLayer.style.height = `${compositionHeight}px`;
  canvasSelectionLayer.style.right = "auto";
  canvasSelectionLayer.style.bottom = "auto";
  canvasSelectionLayer.style.transform = `scale(${previewZoom})`;
  canvasSelectionLayer.style.transformOrigin = "top left";
  if (canvasZoomLabel) canvasZoomLabel.textContent = `${Math.round(previewZoom * 100)}%`;
}

function setPreviewZoom(nextZoom, event = null) {
  const next = clamp(nextZoom, .5, 3);
  if (Math.abs(next - previewZoom) < .001) return;
  const beforeBounds = canvas.getBoundingClientRect();
  const pointerX = event ? event.clientX : beforeBounds.left + beforeBounds.width / 2;
  const pointerY = event ? event.clientY : beforeBounds.top + beforeBounds.height / 2;
  const anchorX = clamp((pointerX - beforeBounds.left) / Math.max(1, beforeBounds.width), 0, 1);
  const anchorY = clamp((pointerY - beforeBounds.top) / Math.max(1, beforeBounds.height), 0, 1);
  previewZoom = next;
  applyPreviewZoom();
  const afterBounds = canvas.getBoundingClientRect();
  const anchoredPointX = afterBounds.left + afterBounds.width * anchorX;
  const anchoredPointY = afterBounds.top + afterBounds.height * anchorY;
  canvasScroll.scrollLeft += anchoredPointX - pointerX;
  canvasScroll.scrollTop += anchoredPointY - pointerY;
}

function cancelScrollInertia() {
  if (scrollInertiaFrameId !== null) cancelAnimationFrame(scrollInertiaFrameId);
  scrollInertiaFrameId = null;
  cancelWheelInertia();
}

function startScrollInertia(readPosition, applyDelta, velocityX, velocityY) {
  cancelScrollInertia();
  const friction = 0.93;
  const frameDuration = 16;

  const tick = () => {
    velocityX *= friction;
    velocityY *= friction;
    if (Math.abs(velocityX) < 0.02 && Math.abs(velocityY) < 0.02) {
      scrollInertiaFrameId = null;
      return;
    }

    const before = readPosition();
    applyDelta(velocityX * frameDuration, velocityY * frameDuration);
    const after = readPosition();
    if (after.x === before.x) velocityX = 0;
    if (after.y === before.y) velocityY = 0;
    scrollInertiaFrameId = requestAnimationFrame(tick);
  };

  if (Math.abs(velocityX) >= 0.02 || Math.abs(velocityY) >= 0.02) {
    scrollInertiaFrameId = requestAnimationFrame(tick);
  }
}

let wheelInertiaFrameId = null;
let wheelInertiaTarget = null;
let wheelGoalX = 0;
let wheelGoalY = 0;

function cancelWheelInertia() {
  if (wheelInertiaFrameId !== null) cancelAnimationFrame(wheelInertiaFrameId);
  wheelInertiaFrameId = null;
  wheelInertiaTarget = null;
  wheelGoalX = 0;
  wheelGoalY = 0;
}

function getWheelDelta(event) {
  const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  return { x: event.deltaX * multiplier, y: event.deltaY * multiplier };
}

function getPageScrollTarget() {
  return document.scrollingElement || document.documentElement;
}

function isPageScrollTarget(target) {
  return target === getPageScrollTarget();
}

function canScrollTarget(target, deltaX, deltaY) {
  if (!target) return false;
  return (Math.abs(deltaX) > 0 && target.scrollWidth > target.clientWidth) || (Math.abs(deltaY) > 0 && target.scrollHeight > target.clientHeight);
}

function readScrollPosition(target) {
  return isPageScrollTarget(target)
    ? { x: window.scrollX, y: window.scrollY }
    : { x: target.scrollLeft, y: target.scrollTop };
}

function applyScrollDelta(target, deltaX, deltaY) {
  if (!isPageScrollTarget(target)) {
    target.scrollLeft += deltaX;
    target.scrollTop += deltaY;
    return;
  }
  window.scrollTo({
    left: window.scrollX + deltaX,
    top: window.scrollY + deltaY,
    behavior: "instant"
  });
}

function getScrollLimits(target) {
  if (!isPageScrollTarget(target)) {
    return {
      x: Math.max(0, target.scrollWidth - target.clientWidth),
      y: Math.max(0, target.scrollHeight - target.clientHeight)
    };
  }
  const page = getPageScrollTarget();
  return {
    x: Math.max(0, page.scrollWidth - page.clientWidth),
    y: Math.max(0, page.scrollHeight - page.clientHeight)
  };
}

function startWheelInertia(target, deltaX, deltaY) {
  if (wheelInertiaTarget !== target) {
    cancelWheelInertia();
    wheelInertiaTarget = target;
    const current = readScrollPosition(target);
    wheelGoalX = current.x;
    wheelGoalY = current.y;
  }
  const limits = getScrollLimits(target);
  wheelGoalX = clamp(wheelGoalX + deltaX, 0, limits.x);
  wheelGoalY = clamp(wheelGoalY + deltaY, 0, limits.y);
  if (wheelInertiaFrameId !== null) return;

  const tick = () => {
    const current = readScrollPosition(target);
    const differenceX = wheelGoalX - current.x;
    const differenceY = wheelGoalY - current.y;
    if (Math.abs(differenceX) < .5 && Math.abs(differenceY) < .5) {
      applyScrollDelta(target, differenceX, differenceY);
      wheelInertiaFrameId = null;
      wheelInertiaTarget = null;
      wheelGoalX = 0;
      wheelGoalY = 0;
      return;
    }
    const stepX = Math.sign(differenceX) * Math.min(Math.abs(differenceX) * .2, 28);
    const stepY = Math.sign(differenceY) * Math.min(Math.abs(differenceY) * .2, 28);
    applyScrollDelta(target, stepX, stepY);
    wheelInertiaFrameId = requestAnimationFrame(tick);
  };

  wheelInertiaFrameId = requestAnimationFrame(tick);
}

function getReorderTargetIndex(event) {
  const directTarget = getCanvasImageAt(event);
  if (directTarget) return directTarget.index;
  if (!imageRects.length) return null;
  const bounds = canvas.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) return null;
  const scaleX = compositionWidth / bounds.width;
  const scaleY = compositionHeight / bounds.height;
  const x = (event.clientX - bounds.left) * scaleX;
  const y = (event.clientY - bounds.top) * scaleY;
  let nearestIndex = null;
  let nearestDistance = Infinity;
  imageRects.forEach((rect) => {
    const center = isVertical ? (rect.top + rect.bottom) / 2 : (rect.left + rect.right) / 2;
    const distance = isVertical ? Math.abs(y - center) : Math.abs(x - center);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = rect.index;
    }
  });
  return nearestIndex;
}

function beginCanvasReorder(event) {
  if (event.button !== 0 || canvasScroll.classList.contains("is-eyedropper") || !imageRects.length) return;
  const target = getCanvasImageAt(event);
  if (!target) return;
  cancelScrollInertia();
  selectImageAt(event);
  suppressCanvasClick = true;
  if (canvasDragState || (event.buttons & 2) === 2) {
    pulseSelectedImages();
    return;
  }
  canvasReorderState = { pointerId: event.pointerId, sourceIndex: target.index, moved: false };
  reorderHoverIndex = target.index;
  canvasScroll.classList.add("is-reordering");
  updateSelectionLayer();
  pulseSelectedImages();
}

function moveCanvasReorder(event) {
  if (!canvasReorderState || canvasReorderState.pointerId !== event.pointerId) return;
  const targetIndex = getReorderTargetIndex(event);
  if (targetIndex === null) return;
  if (targetIndex !== canvasReorderState.sourceIndex && !canvasReorderState.moved) {
    canvasReorderState.moved = true;
    canvasScroll.setPointerCapture?.(event.pointerId);
  }
  if (targetIndex !== reorderHoverIndex) {
    reorderHoverIndex = targetIndex;
    updateSelectionLayer();
  }
  if (canvasReorderState.moved) event.preventDefault();
}

function finishCanvasReorder(event) {
  if (!canvasReorderState || (event && canvasReorderState.pointerId !== event.pointerId)) return;
  if (event && event.type === "pointerup" && event.button !== 0) return;
  const state = canvasReorderState;
  const targetIndex = reorderHoverIndex;
  canvasReorderState = null;
  reorderHoverIndex = null;
  canvasScroll.classList.remove("is-reordering");
  const rightButtonStillDown = event?.type === "pointerup"
    && (event.buttons & 2) === 2
    || Boolean(canvasDragState && canvasDragState.pointerId === state.pointerId);
  if (!rightButtonStillDown && canvasScroll.hasPointerCapture?.(state.pointerId)) canvasScroll.releasePointerCapture(state.pointerId);
  if (event && !isPointerInsideCanvasScroll(event)) clearHoveredImage();
  updateSelectionLayer();
  if (!state.moved) {
    pulseSelectedImages();
    return;
  }
  if (targetIndex === null || targetIndex === state.sourceIndex) return;
  suppressCanvasClick = true;
  reorderImages(state.sourceIndex, targetIndex);
}

function handleWheelScroll(event) {
  const elementTarget = event.target instanceof Element ? event.target : null;
  const canvasTarget = elementTarget?.closest(".canvas-scroll");
  if (event.shiftKey && canvasTarget === canvasScroll && imageRects.length) {
    event.preventDefault();
    cancelScrollInertia();
    const { x: zoomX, y: zoomY } = getWheelDelta(event);
    const delta = zoomY || zoomX;
    if (delta) setPreviewZoom(previewZoom * Math.pow(1.12, -delta / 100), event);
    return;
  }
  if (event.ctrlKey) return;
  const { x: deltaX, y: deltaY } = getWheelDelta(event);
  if (!deltaX && !deltaY) return;
  const aboutTarget = elementTarget?.closest(".about-dialog");
  const erasedColorsTarget = elementTarget?.closest(".erased-colors-list");
  const pageTarget = getPageScrollTarget();
  const preferredTarget = aboutTarget || erasedColorsTarget || canvasTarget || pageTarget;
  const target = canScrollTarget(preferredTarget, deltaX, deltaY)
    ? preferredTarget
    : (preferredTarget === canvasScroll || preferredTarget === erasedColorsList ? pageTarget : preferredTarget);
  if (!canScrollTarget(target, deltaX, deltaY)) return;
  event.preventDefault();
  startWheelInertia(target, deltaX, deltaY);
  if (target !== erasedColorsList && deltaY) scheduleScrollFireworks(deltaY < 0 ? "up" : "down");
}

function scheduleScrollFireworks(direction) {
  if (!scrollFireworksLayer || !showScrollFireworks) return;
  pendingFireworkDirection = direction;
  if (fireworkFrameId !== null) return;
  fireworkFrameId = requestAnimationFrame(() => {
    fireworkFrameId = null;
    const nextDirection = pendingFireworkDirection;
    pendingFireworkDirection = null;
    if (nextDirection) spawnScrollFireworks(nextDirection);
  });
}

function spawnScrollFireworks(direction) {
  if (!scrollFireworksLayer || !showScrollFireworks) return;
  const now = performance.now();
  if (direction === lastFireworksDirection && now - lastFireworksAt < 90) return;
  lastFireworksAt = now;
  lastFireworksDirection = direction;
  const count = 20;
  for (let index = 0; index < count; index += 1) {
    while (scrollFireworksLayer.childElementCount >= 40) {
      scrollFireworksLayer.firstElementChild?.remove();
    }
    const star = document.createElement("span");
    const travelY = direction === "up" ? -(110 + Math.random() * 210) : 110 + Math.random() * 210;
    star.className = "scroll-firework-star";
    star.style.setProperty("--start-x", `${8 + Math.random() * 84}%`);
    star.style.setProperty("--start-y", direction === "up" ? "calc(100% + 10px)" : "-10px");
    star.style.setProperty("--travel-x", `${-85 + Math.random() * 170}px`);
    star.style.setProperty("--travel-y", `${travelY}px`);
    star.style.setProperty("--star-delay", `${Math.random() * .16}s`);
    star.style.setProperty("--star-rotation", `${-80 + Math.random() * 160}deg`);
    star.textContent = "✦";
    star.addEventListener("animationend", () => star.remove(), { once: true });
    scrollFireworksLayer.appendChild(star);
  }
}

function beginCanvasDrag(event) {
  if (event.button !== 2 || canvasScroll.classList.contains("is-eyedropper")) return;
  createCanvasDragState(event);
}

function createCanvasDragState(event, armed = false) {
  cancelScrollInertia();
  const state = canvasDragState = {
    pointerId: event.pointerId,
    lastX: event.clientX,
    lastY: event.clientY,
    currentX: event.clientX,
    currentY: event.clientY,
    lastTime: event.timeStamp || performance.now(),
    velocityX: 0,
    velocityY: 0,
    moved: false,
    armed,
    holdTimer: null
  };
  if (armed) return;
  state.holdTimer = window.setTimeout(() => {
    if (canvasDragState !== state) return;
    state.armed = true;
    state.lastX = state.currentX;
    state.lastY = state.currentY;
    state.lastTime = performance.now();
  }, 100);
}

function moveCanvasDrag(event) {
  updateHoveredImage(event);
  if (canvasDragState && event.buttons !== undefined && (event.buttons & 2) !== 2) {
    finishCanvasDrag({ pointerId: event.pointerId, type: "pointerup", button: 2, buttons: event.buttons });
    return;
  }
  if (!canvasDragState && (event.buttons & 2) === 2 && !canvasScroll.classList.contains("is-eyedropper")) {
    createCanvasDragState(event, true);
  }
  if (!canvasDragState || canvasDragState.pointerId !== event.pointerId) return;
  canvasDragState.currentX = event.clientX;
  canvasDragState.currentY = event.clientY;
  if (!canvasDragState.armed) {
    canvasDragState.lastX = event.clientX;
    canvasDragState.lastY = event.clientY;
    canvasDragState.lastTime = event.timeStamp || performance.now();
    return;
  }
  const now = event.timeStamp || performance.now();
  const deltaX = event.clientX - canvasDragState.lastX;
  const deltaY = event.clientY - canvasDragState.lastY;
  const elapsed = Math.max(1, now - canvasDragState.lastTime);
  const canPanBothAxes = previewZoom > 1.001;
  const panX = canPanBothAxes || !isVertical ? deltaX : 0;
  const panY = canPanBothAxes || isVertical ? deltaY : 0;
  const distance = Math.hypot(panX, panY);
  if (!canvasDragState.moved && distance < 4) {
    canvasDragState.lastX = event.clientX;
    canvasDragState.lastY = event.clientY;
    canvasDragState.lastTime = now;
    return;
  }

  if (!canvasDragState.moved) {
    canvasDragState.moved = true;
    suppressCanvasClick = true;
    canvasScroll.classList.add("is-dragging-scroll");
    canvasScroll.setPointerCapture?.(event.pointerId);
  }
  event.preventDefault();
  canvasScroll.scrollLeft -= panX;
  canvasScroll.scrollTop -= panY;
  canvasDragState.velocityX = -panX / elapsed;
  canvasDragState.velocityY = -panY / elapsed;
  canvasDragState.lastX = event.clientX;
  canvasDragState.lastY = event.clientY;
  canvasDragState.lastTime = now;
}

function finishCanvasDrag(event) {
  if (!canvasDragState || (event && canvasDragState.pointerId !== event.pointerId)) return;
  if (event && event.type === "pointerup" && event.button !== 2) return;
  const state = canvasDragState;
  canvasDragState = null;
  window.clearTimeout(state.holdTimer);
  canvasScroll.classList.remove("is-dragging-scroll");
  const leftButtonStillDown = event?.type === "pointerup"
    && (event.buttons & 1) === 1
    || Boolean(canvasReorderState && canvasReorderState.pointerId === state.pointerId);
  if (!leftButtonStillDown && canvasScroll.hasPointerCapture?.(state.pointerId)) canvasScroll.releasePointerCapture(state.pointerId);
  if (event && !isPointerInsideCanvasScroll(event)) clearHoveredImage();
  if (state.moved) {
    startScrollInertia(
      () => ({ x: canvasScroll.scrollLeft, y: canvasScroll.scrollTop }),
      (deltaX, deltaY) => { canvasScroll.scrollLeft += deltaX; canvasScroll.scrollTop += deltaY; },
      state.velocityX,
      state.velocityY
    );
  }
}

function handleGlobalPointerRelease(event) {
  finishCanvasReorder(event);
  finishCanvasDrag(event);
}

function handleCanvasPointerLeave() {
  clearHoveredImage();
  if (eraseMode && erasePickerCard) erasePickerCard.hidden = true;
}

function initializeDragScrolling() {
  canvasScroll.addEventListener("pointerdown", beginCanvasDrag);
  canvasScroll.addEventListener("pointermove", moveCanvasDrag);
  canvasScroll.addEventListener("pointerup", finishCanvasDrag);
  canvasScroll.addEventListener("pointercancel", finishCanvasDrag);
  canvasScroll.addEventListener("pointerleave", handleCanvasPointerLeave);
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("wheel", handleWheelScroll, { passive: false });
}

function startColorErase() {
  if (!getSelectedImageEntries().length) return;
  eraseMode = !eraseMode;
  eraseColorButton.classList.toggle("is-active", eraseMode);
  canvasScroll.classList.toggle("is-eyedropper", eraseMode);
  updateEraseStatus();
}

function toggleBorderErase() {
  const selectedEntries = getSelectedImageEntries();
  if (!selectedEntries.length) return;
  const nextValue = !selectedEntries.every(({ image }) => getImageEraseSettings(image).eraseBorders);
  selectedEntries.forEach(({ image }) => {
    getImageEraseSettings(image).eraseBorders = nextValue;
  });
  eraseBorders = nextValue;
  eraseBorderButton.classList.toggle("is-active", eraseBorders);
  eraseBorderButton.setAttribute("aria-pressed", String(eraseBorders));
  commitHistory();
  renderComposition();
}

function resetErasedColors() {
  const selectedEntries = getSelectedImageEntries();
  if (!selectedEntries.length) return;
  const hasEraseSettings = selectedEntries.some(({ image }) => {
    const settings = getImageEraseSettings(image);
    return settings.colors.length || settings.eraseBorders;
  });
  if (!hasEraseSettings && !eraseMode) return;
  selectedEntries.forEach(({ image }) => {
    const settings = getImageEraseSettings(image);
    settings.colors = [];
    settings.eraseBorders = false;
  });
  eraseColor = null;
  selectedErasedColorIndexes.clear();
  erasedColorAnchorIndex = null;
  eraseBorders = false;
  eraseMode = false;
  eraseColorButton.classList.remove("is-active");
  eraseBorderButton.classList.remove("is-active");
  eraseBorderButton.setAttribute("aria-pressed", "false");
  canvasScroll.classList.remove("is-eyedropper");
  updateEraseStatus();
  commitHistory();
  renderComposition();
}

function updateEraseStatus() {
  if (!erasedColors.length) {
    eraseStatus.textContent = t("erasedColor", "Cor apagada: ()");
  } else if (selectedErasedColorIndexes.size === 1) {
    const index = [...selectedErasedColorIndexes][0];
    eraseStatus.textContent = t("erasedColorValue", (value) => `Cor apagada: (${value})`)(rgbToHex(erasedColors[index]).toUpperCase());
  } else {
    eraseStatus.textContent = t("erasedColorsCount", (count) => `Cores apagadas: (${count})`)(erasedColors.length);
  }
  updateErasePickerCard();
}

function getColorName(color) {
  if (!color) return t("chooseColor", "Selecione uma cor");
  const { h, s, v } = rgbToHsv(color);
  if (v < .12) return t("black", "Preto");
  if (s < .08 && v > .9) return t("white", "Branco");
  if (s < .12) return t("gray", "Cinza");
  if (v < .42 && h >= 5 && h < 45) return t("brown", "Marrom");
  if (h < 15 || h >= 345) return t("red", "Vermelho");
  if (h < 45) return t("orange", "Laranja");
  if (h < 70) return t("yellow", "Amarelo");
  if (h < 165) return t("green", "Verde");
  if (h < 205) return t("cyan", "Ciano");
  if (h < 255) return t("blue", "Azul");
  if (h < 315) return t("purple", "Roxo");
  return t("pink", "Rosa");
}

function updateErasePickerCard(colorOverride, event = null) {
  if (!erasePickerCard) return;
  const shouldShow = eraseMode || Boolean(eraseColor);
  erasePickerCard.hidden = !shouldShow;
  if (!shouldShow) return;
  if (event) positionErasePicker(event);
  const color = colorOverride !== undefined
    ? colorOverride
    : eraseColor || (selectedErasedColorIndexes.size ? erasedColors[[...selectedErasedColorIndexes].at(-1)] : null);
  if (color) {
    const hex = rgbToHex(color).toUpperCase();
    erasePickerSwatch.style.background = hex;
    erasePickerSwatch.classList.remove("is-empty");
    erasePickerHex.textContent = hex;
    erasePickerName.textContent = getColorName(color);
  } else {
    erasePickerSwatch.style.background = "";
    erasePickerSwatch.classList.add("is-empty");
    erasePickerHex.textContent = "—";
    erasePickerName.textContent = t("chooseColor", "Selecione uma cor");
  }
  erasePickerType.textContent = t("erasedColorType", "Cor apagada");
}

function renderErasedColorsList() {
  if (!erasedColorsList) return;
  syncEraseSelectionState();
  selectedErasedColorIndexes = new Set([...selectedErasedColorIndexes].filter((index) => index >= 0 && index < erasedColors.length));
  erasedColorsList.hidden = false;
  erasedColorsList.innerHTML = erasedColors.length
    ? erasedColors.map((color, index) => {
      const isSelected = selectedErasedColorIndexes.has(index);
      return `<button class="erased-color-item${isSelected ? " is-selected" : ""}" type="button" role="option" aria-selected="${isSelected}" data-erased-color-index="${index}"><span class="erased-color-swatch" style="--erased-color:${rgbToHex(color)}"></span><span class="erased-color-value">${rgbToHex(color).toUpperCase()}</span><span class="erased-color-index">${String(index + 1).padStart(2, "0")}</span></button>`;
    }).join("")
    : `<div class="erased-colors-empty">${t("noErasedColors", "Nenhuma cor apagada")}</div>`;
  erasedColorsList.querySelectorAll(".erased-color-item").forEach((item) => {
    item.addEventListener("click", (event) => selectErasedColor(Number(item.dataset.erasedColorIndex), event.ctrlKey || event.metaKey, event.shiftKey));
  });
  updateEraseStatus();
}

function selectErasedColor(index, additive = false, range = false) {
  if (range && erasedColorAnchorIndex !== null) {
    const start = Math.min(erasedColorAnchorIndex, index);
    const end = Math.max(erasedColorAnchorIndex, index);
    selectedErasedColorIndexes = new Set(Array.from({ length: end - start + 1 }, (_, offset) => start + offset));
  } else if (additive) {
    if (selectedErasedColorIndexes.has(index)) selectedErasedColorIndexes.delete(index);
    else selectedErasedColorIndexes.add(index);
  } else if (selectedErasedColorIndexes.size === 1 && selectedErasedColorIndexes.has(index)) {
    selectedErasedColorIndexes.clear();
  } else {
    selectedErasedColorIndexes = new Set([index]);
  }
  if (!range) erasedColorAnchorIndex = index;
  eraseColor = selectedErasedColorIndexes.size ? erasedColors[[...selectedErasedColorIndexes].at(-1)] : erasedColor;
  renderErasedColorsList();
  erasedColorsList.querySelector(`[data-erased-color-index="${index}"]`)?.focus();
}

function addErasedColor(color) {
  const selectedEntries = getSelectedImageEntries();
  if (!selectedEntries.length) return;
  selectedEntries.forEach(({ image }) => {
    const settings = getImageEraseSettings(image);
    const exists = settings.colors.some((item) => item.r === color.r && item.g === color.g && item.b === color.b);
    if (!exists) settings.colors.push({ ...color });
  });
  syncEraseSelectionState();
  const index = erasedColors.findIndex((item) => item.r === color.r && item.g === color.g && item.b === color.b);
  selectedErasedColorIndexes = index >= 0 ? new Set([index]) : new Set();
  erasedColorAnchorIndex = index >= 0 ? index : null;
  renderErasedColorsList();
}

function deleteSelectedErasedColors() {
  if (!selectedErasedColorIndexes.size) return;
  const removedColors = selectedErasedColorIndexes
    .map((index) => erasedColors[index])
    .filter(Boolean);
  const selectedEntries = getSelectedImageEntries();
  selectedEntries.forEach(({ image }) => {
    const settings = getImageEraseSettings(image);
    settings.colors = settings.colors.filter((color) => !removedColors.some((removed) => removed.r === color.r && removed.g === color.g && removed.b === color.b));
  });
  selectedErasedColorIndexes.clear();
  erasedColorAnchorIndex = null;
  renderErasedColorsList();
  commitHistory();
  renderComposition();
}

function selectImageGap(index, additive = false, range = false) {
  selectedErasedColorIndexes.clear();
  erasedColorAnchorIndex = null;
  if (allGapsSelected) {
    allGapsSelected = false;
    selectedImageIndexes.clear();
  }
  if (range && selectionAnchorIndex !== null) {
    const start = Math.min(selectionAnchorIndex, index);
    const end = Math.max(selectionAnchorIndex, index);
    selectedImageIndexes = new Set(Array.from({ length: end - start + 1 }, (_, offset) => start + offset));
    selectedImageIndex = index;
  } else if (additive) {
    if (selectedImageIndexes.has(index)) selectedImageIndexes.delete(index);
    else selectedImageIndexes.add(index);
    selectedImageIndex = selectedImageIndexes.has(index) ? index : [...selectedImageIndexes].at(-1) ?? null;
  } else if (selectedImageIndexes.size === 1 && selectedImageIndexes.has(index)) {
    selectedImageIndexes.clear();
    selectedImageIndex = null;
    selectionAnchorIndex = null;
  } else {
    selectedImageIndexes = new Set([index]);
    selectedImageIndex = index;
  }
  if (!range) selectionAnchorIndex = index;
  if (selectedImageIndex !== null) syncBorderControlsFromSelection();
  updateSpacingControls();
  updateSelectionLayer();
  if (selectedImageIndexes.size) pulseSelectedImages();
}

function updateSpacingControls() {
  const hasImages = selectedImages.length > 0;
  const hasGaps = selectedImages.length > 1;
  const hasSelection = allGapsSelected || selectedImageIndexes.size > 0 || selectedImageIndex !== null;
  const selectedEntries = getSelectedImageEntries();
  if (!hasSelection && eraseMode) {
    eraseMode = false;
    eraseColorButton.classList.remove("is-active");
    canvasScroll.classList.remove("is-eyedropper");
  }
  syncEraseSelectionState();
  const hasEraseSettings = selectedEntries.some(({ image }) => {
    const settings = getImageEraseSettings(image);
    return settings.colors.length || settings.eraseBorders;
  });
  spacingInput.disabled = !hasGaps;
  eraseColorButton.disabled = !hasSelection;
  eraseBorderButton.disabled = !hasSelection;
  eraseBorderButton.classList.toggle("is-active", hasSelection && eraseBorders);
  eraseBorderButton.setAttribute("aria-pressed", String(eraseBorders));
  rescaleButton.disabled = !hasSelection || !hasEraseSettings;
  eraseResetButton.disabled = !hasSelection || (!hasEraseSettings && !eraseMode);
  deleteImageButton.disabled = !hasImages || !hasSelection;
  copyButton.disabled = !hasSelection;
  selectAllGapsButton.disabled = !hasImages;
  applySpacingButton.disabled = !hasGaps || (selectedImageIndex === null && !allGapsSelected) || selectedImageIndex >= selectedImages.length - 1;
  applyPaddingButton.disabled = !hasImages;
  borderParameterInputs.forEach((input) => { input.disabled = !hasImages || !hasSelection; });
  highlightToggle.disabled = !hasImages;
  highlightToggle.classList.toggle("is-active", highlightEnabled);
  highlightToggle.setAttribute("aria-pressed", String(highlightEnabled));
  selectAllGapsButton.classList.toggle("is-active", allGapsSelected);
  if (allGapsSelected) {
    spacingStatus.textContent = t("allGapsSelected", "Todos os espaços foram selecionados. O padding é geral.");
    selectedImageLabel.textContent = t("allImages", "todos");
    spacingInput.value = gapSizes.length ? gapSizes[0] : 0;
    paddingInput.value = paddingSize;
  } else if (selectedImageIndex !== null) {
    const isLastImage = selectedImageIndex >= selectedImages.length - 1;
    spacingStatus.textContent = isLastImage
      ? t("lastImage", "Última imagem selecionada: ajuste apenas o padding geral.")
      : t("selectedImage", "Imagem selecionada: ajuste o espaço até a próxima e o padding geral.");
    selectedImageLabel.textContent = isLastImage ? `${selectedImageIndex + 1}` : `${selectedImageIndex + 1} → ${selectedImageIndex + 2}`;
    spacingInput.value = isLastImage ? 0 : gapSizes[selectedImageIndex] || 0;
    spacingInput.disabled = isLastImage;
    paddingInput.value = paddingSize;
  } else if (hasImages) {
    spacingStatus.textContent = t("chooseSpace", "Clique em uma imagem na prévia para escolher o espaço até a próxima.");
    selectedImageLabel.textContent = "—";
    spacingInput.value = 0;
    paddingInput.value = paddingSize;
  } else {
    spacingStatus.textContent = t("addImagesToEdit", "Adicione imagens e clique em uma delas para editar espaço e padding.");
    selectedImageLabel.textContent = "—";
    spacingInput.value = 0;
    paddingInput.value = paddingSize;
  }
  fileList.querySelectorAll(".file-item").forEach((item) => {
    const index = Number(item.dataset.imageIndex);
    item.classList.toggle("is-selected", allGapsSelected || selectedImageIndexes.has(index) || index === selectedImageIndex);
  });
  renderErasedColorsList();
}

function applySpacing() {
  const pixels = Math.max(0, Number.parseInt(spacingInput.value, 10) || 0);
  if (allGapsSelected) {
    gapSizes = Array(Math.max(0, selectedImages.length - 1)).fill(pixels);
  } else if (selectedImageIndex !== null && selectedImageIndex < selectedImages.length - 1) {
    gapSizes[selectedImageIndex] = pixels;
  } else {
    return;
  }
  commitHistory();
  renderComposition();
}

function applyPadding() {
  const pixels = Math.max(0, Number.parseInt(paddingInput.value, 10) || 0);
  paddingSize = pixels;
  commitHistory();
  renderComposition();
}

function deleteSelectedImage() {
  const indexes = allGapsSelected
    ? displayedImages.map((_, index) => index)
    : [...new Set([...selectedImageIndexes, ...(selectedImageIndex === null ? [] : [selectedImageIndex])])].sort((a, b) => a - b);
  if (!indexes.length) return;

  const indexSet = new Set(indexes);
  const imagesToDelete = displayedImages.filter((_, index) => indexSet.has(index));
  const remainingImages = displayedImages.filter((_, index) => !indexSet.has(index));
  const nextGaps = [];
  for (let index = 0; index < remainingImages.length - 1; index += 1) {
    const from = displayedImages.indexOf(remainingImages[index]);
    const to = displayedImages.indexOf(remainingImages[index + 1]);
    let gap = 0;
    for (let gapIndex = from; gapIndex < to; gapIndex += 1) gap += gapSizes[gapIndex] || 0;
    nextGaps.push(gap);
  }
  imagesToDelete.forEach(({ image }) => {
    imageBorderSettings.delete(image);
    imageEraseSettings.delete(image);
  });
  selectedImages = selectedImages.filter((item) => !imagesToDelete.includes(item));
  manualOrder = manualOrder.filter((item) => selectedImages.includes(item));
  gapSizes = nextGaps;
  selectedImageIndex = null;
  selectedImageIndexes.clear();
  selectionAnchorIndex = null;
  allGapsSelected = false;
  eraseMode = false;
  canvasScroll.classList.remove("is-eyedropper");
  eraseColorButton.classList.remove("is-active");
  deleteImageButton.classList.add("is-triggered");
  setTimeout(() => deleteImageButton.classList.remove("is-triggered"), 180);
  commitHistory();
  renderComposition();
}

function isTypingTarget(target) {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}

function openAbout() {
  aboutPreviousFocus = document.activeElement;
  aboutOverlay.hidden = false;
  document.body.classList.add("modal-open");
  aboutClose.focus();
}

function closeAbout() {
  aboutOverlay.hidden = true;
  document.body.classList.remove("modal-open");
  if (aboutPreviousFocus instanceof HTMLElement) aboutPreviousFocus.focus();
}

function loadUserSettings() {
  try {
    const savedStars = localStorage.getItem("captimage-scroll-stars");
    const savedQuality = Number(localStorage.getItem("captimage-preview-quality"));
    if (savedStars !== null) showScrollFireworks = savedStars !== "false";
    if ([1, .75, .5, .25].includes(savedQuality)) previewQuality = savedQuality;
  } catch (error) {
    showScrollFireworks = true;
    previewQuality = 1;
  }
  if (scrollStarsToggle) scrollStarsToggle.checked = showScrollFireworks;
  if (previewQualitySelect) previewQualitySelect.value = String(previewQuality);
}

function openSettings() {
  settingsOverlay.hidden = false;
  settingsButton.classList.add("is-open");
  document.body.classList.add("modal-open");
  settingsClose.focus();
}

function closeSettings() {
  settingsOverlay.hidden = true;
  settingsButton.classList.remove("is-open");
  if (aboutOverlay.hidden) document.body.classList.remove("modal-open");
  settingsButton.focus();
}

function setPreviewQuality(value) {
  const nextQuality = Number(value);
  if (![1, .75, .5, .25].includes(nextQuality) || nextQuality === previewQuality) return;
  previewQuality = nextQuality;
  try { localStorage.setItem("captimage-preview-quality", String(previewQuality)); } catch (error) { /* armazenamento opcional */ }
  if (selectedImages.length) renderComposition(false, false);
}

function setScrollFireworksEnabled(enabled) {
  showScrollFireworks = Boolean(enabled);
  if (!showScrollFireworks && scrollFireworksLayer) scrollFireworksLayer.replaceChildren();
  try { localStorage.setItem("captimage-scroll-stars", String(showScrollFireworks)); } catch (error) { /* armazenamento opcional */ }
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  applyTheme();
  try { localStorage.setItem("imgt-theme", isDarkTheme ? "dark" : "light"); } catch (error) { /* armazenamento opcional */ }
}

function applyTheme() {
  document.body.classList.toggle("dark-theme", isDarkTheme);
  document.documentElement.classList.toggle("dark-theme", isDarkTheme);
  themeToggle.setAttribute("aria-pressed", String(isDarkTheme));
  themeToggle.setAttribute("aria-label", isDarkTheme
    ? t("themeLightAria", "Ativar modo claro")
    : t("themeDarkAria", "Ativar modo escuro"));
  themeToggle.querySelector(".theme-toggle-icon").textContent = isDarkTheme ? "☀" : "☾";
  themeToggle.querySelector(".theme-toggle-label").textContent = isDarkTheme
    ? t("light", "claro")
    : t("dark", "escuro");
}

function chooseSurfaceColor(event, recordHistory = true) {
  if (typeof event.clientX !== "number" || typeof event.clientY !== "number") return;
  const bounds = colorSurface.getBoundingClientRect();
  selectedSaturation = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
  selectedValue = clamp(1 - ((event.clientY - bounds.top) / bounds.height), 0, 1);
  setColor(hsvToHex(selectedHue, selectedSaturation, selectedValue), recordHistory, false);
  scheduleCompositionRender();
}

function setColor(color, recordHistory = true, shouldRender = true) {
  const normalized = normalizeHex(color);
  if (!normalized) return;
  setActiveColor(normalized);
  const hsv = rgbToHsv(hexToRgb(normalized));
  selectedHue = hsv.h;
  selectedSaturation = hsv.s;
  selectedValue = hsv.v;
  updateColorControls();
  if (recordHistory) commitHistory();
  if (shouldRender) renderComposition();
}

function updateColorControls() {
  const activeColor = getActiveColor();
  const isTransparent = !activeColor;
  colorContextLabel.textContent = activeColorTarget === "border" ? t("borderColor", "Cor da borda") : t("emptyColor", "Cor do vazio");
  colorValue.textContent = isTransparent ? t("transparent", "transparente") : activeColor.toUpperCase();
  const displayColor = hsvToHex(selectedHue, selectedSaturation, selectedValue);
  colorSurface.style.setProperty("--picker-hue", selectedHue);
  colorSurfaceCursor.style.left = `${selectedSaturation * 100}%`;
  colorSurfaceCursor.style.top = `${(1 - selectedValue) * 100}%`;
  hueSlider.value = Math.round(selectedHue);
  hexInput.value = activeColor ? activeColor.toUpperCase() : "";
  const rgb = hexToRgb(displayColor);
  redInput.value = rgb.r;
  greenInput.value = rgb.g;
  blueInput.value = rgb.b;
  transparentToggle.classList.toggle("is-active", isTransparent);
  transparentToggle.setAttribute("aria-pressed", String(isTransparent));
  transparencySlider.value = Math.round((1 - getActiveOpacity()) * 100);
  transparencySlider.disabled = isTransparent;
  transparencyValue.textContent = isTransparent ? "—" : `${Math.round((1 - getActiveOpacity()) * 100)}%`;
  emptyColorSummary.textContent = selectedColor ? selectedColor.toUpperCase() : t("transparent", "transparente");
  borderColorSummary.textContent = borderColor ? borderColor.toUpperCase() : t("transparent", "transparente");
  colorTargetButtons.forEach((button) => {
    const isActive = button.dataset.colorTarget === activeColorTarget;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  updateBorderControls();
}

function getActiveColor() {
  return activeColorTarget === "border" ? borderColor : selectedColor;
}

function setActiveColor(color, updateOpacity = true) {
  if (activeColorTarget === "border") borderColor = color;
  else selectedColor = color;
  if (updateOpacity && color === null) setActiveOpacity(1);
}

function getActiveOpacity() {
  return activeColorTarget === "border" ? borderOpacity : colorOpacity;
}

function setActiveOpacity(opacity) {
  if (activeColorTarget === "border") borderOpacity = opacity;
  else colorOpacity = opacity;
}

function syncHsvFromActiveColor() {
  const activeColor = getActiveColor();
  if (!activeColor) return;
  const hsv = rgbToHsv(hexToRgb(activeColor));
  selectedHue = hsv.h;
  selectedSaturation = hsv.s;
  selectedValue = hsv.v;
}

function cloneBorderSettings(settings = {}) {
  return {
    thickness: clamp(Number(settings.thickness) || 0, 0, 200),
    radii: {
      topLeft: clamp(Number(settings.radii?.topLeft) || 0, 0, 1000),
      bottomLeft: clamp(Number(settings.radii?.bottomLeft) || 0, 0, 1000),
      bottomRight: clamp(Number(settings.radii?.bottomRight) || 0, 0, 1000),
      topRight: clamp(Number(settings.radii?.topRight) || 0, 0, 1000)
    }
  };
}

function getImageBorderSettings(image) {
  if (!imageBorderSettings.has(image)) imageBorderSettings.set(image, cloneBorderSettings());
  return imageBorderSettings.get(image);
}

function getSelectedBorderTargets() {
  if (allGapsSelected) return displayedImages.map(({ image }) => image);
  const indexes = new Set([...selectedImageIndexes, ...(selectedImageIndex === null ? [] : [selectedImageIndex])]);
  return [...indexes].map((index) => displayedImages[index]?.image).filter(Boolean);
}

function applyBorderControlsToSelection() {
  const settings = cloneBorderSettings({ thickness: borderThickness, radii: borderRadii });
  getSelectedBorderTargets().forEach((image) => imageBorderSettings.set(image, cloneBorderSettings(settings)));
}

function syncBorderControlsFromSelection() {
  if (selectedImageIndex === null || !displayedImages[selectedImageIndex]) return;
  const settings = getImageBorderSettings(displayedImages[selectedImageIndex].image);
  borderThickness = settings.thickness;
  borderRadii = { ...settings.radii };
  updateBorderControls();
}

function updateBorderControls() {
  borderThicknessInput.value = borderThickness;
  const radii = Object.values(borderRadii);
  const generalRadius = radii.every((radius) => radius === radii[0]) ? radii[0] : "";
  borderRadiusGeneralInput.value = generalRadius;
  Object.entries(borderRadiusInputs).forEach(([corner, input]) => { input.value = borderRadii[corner]; });
}

function applyHexInput() {
  const normalized = normalizeHex(hexInput.value);
  if (normalized) {
    setColor(normalized);
  } else if (hexInput.value.trim()) {
    const activeColor = getActiveColor();
    hexInput.value = activeColor ? activeColor.toUpperCase() : "";
  }
}

function applyRgbInputs() {
  const rgb = {
    r: clamp(Number.parseInt(redInput.value, 10) || 0, 0, 255),
    g: clamp(Number.parseInt(greenInput.value, 10) || 0, 0, 255),
    b: clamp(Number.parseInt(blueInput.value, 10) || 0, 0, 255)
  };
  redInput.value = rgb.r;
  greenInput.value = rgb.g;
  blueInput.value = rgb.b;
  setColor(rgbToHex(rgb));
}

function normalizeHex(value) {
  const cleanValue = value.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleanValue)) return null;
  return `#${cleanValue.toLowerCase()}`;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: Number.parseInt(clean.slice(0, 2), 16),
    g: Number.parseInt(clean.slice(2, 4), 16),
    b: Number.parseInt(clean.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function colorWithOpacity(hex, opacity) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(opacity, 0, 1)})`;
}

function rgbToHsv({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const difference = max - min;
  let hue = 0;
  if (difference) {
    if (max === r) hue = 60 * (((g - b) / difference) % 6);
    else if (max === g) hue = 60 * ((b - r) / difference + 2);
    else hue = 60 * ((r - g) / difference + 4);
  }
  return { h: (hue + 360) % 360, s: max ? difference / max : 0, v: max };
}

function hsvToHex(hue, saturation, value) {
  const chroma = value * saturation;
  const segment = (hue % 360) / 60;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = value - chroma;
  const [red, green, blue] = segment < 1 ? [chroma, x, 0] : segment < 2 ? [x, chroma, 0] : segment < 3 ? [0, chroma, x] : segment < 4 ? [0, x, chroma] : segment < 5 ? [x, 0, chroma] : [chroma, 0, x];
  return rgbToHex({ r: Math.round((red + match) * 255), g: Math.round((green + match) * 255), b: Math.round((blue + match) * 255) });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderFileList(orderedImages) {
  fileList.innerHTML = orderedImages.map(({ file, image }, index) => `
    <button class="file-item" type="button" draggable="true" data-image-index="${index}">
      <img class="file-thumb" src="${image.src || image.toDataURL("image/png")}" alt="" />
      <div class="file-details">
        <span class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span>
        <span class="file-size">${image.width} × ${image.height} px</span>
      </div>
      <span class="file-index">${String(index + 1).padStart(2, "0")}</span>
    </button>
  `).join("");
  fileList.querySelectorAll(".file-item").forEach((item) => {
    item.addEventListener("click", (event) => selectImageGap(Number(item.dataset.imageIndex), event.ctrlKey || event.metaKey, event.shiftKey));
    item.addEventListener("dragstart", handleFileDragStart);
    item.addEventListener("dragover", handleFileDragOver);
    item.addEventListener("dragleave", handleFileDragLeave);
    item.addEventListener("drop", handleFileDrop);
    item.addEventListener("dragend", handleFileDragEnd);
  });
}

function handleFileDragStart(event) {
  draggedFileIndex = Number(event.currentTarget.dataset.imageIndex);
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(draggedFileIndex));
  event.currentTarget.classList.add("is-dragging");
}

function handleFileDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  if (Number(event.currentTarget.dataset.imageIndex) !== draggedFileIndex) event.currentTarget.classList.add("is-drop-target");
}

function handleFileDragLeave(event) {
  event.currentTarget.classList.remove("is-drop-target");
}

function handleFileDrop(event) {
  event.preventDefault();
  const targetIndex = Number(event.currentTarget.dataset.imageIndex);
  event.currentTarget.classList.remove("is-drop-target");
  if (draggedFileIndex === null || draggedFileIndex === targetIndex) return;
  reorderImages(draggedFileIndex, targetIndex);
}

function handleFileDragEnd() {
  draggedFileIndex = null;
  fileList.querySelectorAll(".file-item").forEach((item) => item.classList.remove("is-dragging", "is-drop-target"));
}

function reorderImages(fromIndex, toIndex) {
  const orderedImages = [...getOrderedImages()];
  const selectedObjects = allGapsSelected
    ? new Set(orderedImages)
    : new Set([...selectedImageIndexes, ...(selectedImageIndex === null ? [] : [selectedImageIndex])].map((index) => orderedImages[index]).filter(Boolean));
  const primaryObject = selectedImageIndex === null ? null : orderedImages[selectedImageIndex];
  const anchorObject = selectionAnchorIndex === null ? null : orderedImages[selectionAnchorIndex];
  const [movedImage] = orderedImages.splice(fromIndex, 1);
  orderedImages.splice(toIndex, 0, movedImage);
  manualOrder = orderedImages;
  customOrder = true;
  selectedImageIndexes = new Set(orderedImages.map((image, index) => selectedObjects.has(image) ? index : -1).filter((index) => index >= 0));
  selectedImageIndex = primaryObject ? orderedImages.indexOf(primaryObject) : null;
  selectionAnchorIndex = anchorObject ? orderedImages.indexOf(anchorObject) : null;
  orderButtons.forEach((button) => {
    button.classList.remove("is-active");
    button.setAttribute("aria-checked", "false");
  });
  updateLayoutLabel();
  commitHistory();
  renderComposition();
  updateSpacingControls();
  updateSelectionLayer();
  pulseSelectedImages();
}

async function exportComposition() {
  if (!selectedImages.length) return;
  stopCurrentAnimation();
  const exportCanvas = renderOriginalComposition();
  const blob = await new Promise((resolve) => exportCanvas.toBlob(resolve, "image/png"));
  if (!blob) return;

  if (typeof window.showSaveFilePicker === "function") {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: "imagem-em-fila.png",
        types: [{ description: "Imagem PNG", accept: { "image/png": [".png"] } }]
      });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  const link = document.createElement("a");
  link.download = "imagem-em-fila.png";
  link.href = URL.createObjectURL(blob);
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function prepareImageClipboardItem(entry, index) {
  const originalFile = entry.file;
  const originalType = originalFile?.type?.startsWith("image/") ? originalFile.type : "image/png";
  const canWriteOriginal = !window.ClipboardItem.supports || window.ClipboardItem.supports(originalType);
  if (originalFile && canWriteOriginal) {
    return { blob: originalFile, type: originalType, name: originalFile.name || `imagem-copiada-${index + 1}.png` };
  }
  const fallbackBlob = await new Promise((resolve) => {
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = entry.image.naturalWidth || entry.image.width;
    sourceCanvas.height = entry.image.naturalHeight || entry.image.height;
    const sourceContext = sourceCanvas.getContext("2d");
    sourceContext.drawImage(entry.image, 0, 0);
    sourceCanvas.toBlob(resolve, "image/png");
  });
  return fallbackBlob ? { blob: fallbackBlob, type: "image/png", name: `imagem-copiada-${index + 1}.png` } : null;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function getImagesFromClipboardHtml(html) {
  const dataUrls = [...html.matchAll(/<img\b[^>]*\bsrc=["'](data:image\/[^"']+)["'][^>]*>/gi)]
    .map((match) => match[1]);
  return dataUrls.map((dataUrl, index) => {
    const [header, encoded] = dataUrl.split(",", 2);
    if (!encoded) return null;
    const mimeType = header.match(/^data:(image\/[^;]+);base64$/i)?.[1] || "image/png";
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new File([bytes], `imagem-colada-${Date.now()}-${index + 1}.${mimeType.split("/")[1] || "png"}`, { type: mimeType });
  }).filter(Boolean);
}

async function copySelectedImages(entries) {
  if (!entries.length) return;
  if (!navigator.clipboard?.write || !window.ClipboardItem) {
    showCopyFeedback("Indisponível");
    return;
  }
  try {
    const preparedImages = (await Promise.all(entries.map(prepareImageClipboardItem))).filter(Boolean);
    if (!preparedImages.length) return;
    internalImageClipboard = preparedImages.map(({ blob, type, name }) => new File([blob], name, { type }));
    let clipboardItems;
    if (preparedImages.length === 1) {
      const [{ blob, type }] = preparedImages;
      clipboardItems = [new ClipboardItem({ [type]: blob })];
    } else {
      const dataUrls = await Promise.all(preparedImages.map(({ blob }) => blobToDataUrl(blob)));
      const html = `<!doctype html><html><body><!--StartFragment--><div>${dataUrls
        .map((dataUrl, index) => `<img src="${dataUrl}" alt="Imagem ${index + 1}" style="display:block;max-width:100%;" />`)
        .join("")}<!--EndFragment--></div></body></html>`;
      const plainText = preparedImages.map(({ name }, index) => name || `Imagem ${index + 1}`).join("\n");
      const firstImage = preparedImages[0];
      clipboardItems = [new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plainText], { type: "text/plain" }),
        [firstImage.type]: firstImage.blob
      })];
    }
    await navigator.clipboard.write(clipboardItems);
    showCopyFeedback(preparedImages.length > 1 ? `${preparedImages.length} copiadas` : "Copiado");
  } catch (error) {
    showCopyFeedback("Falhou");
  }
}

function getCompositionLayout(sourceRects) {
  const gaps = sourceRects.slice(0, -1).map((rect) => gapSizes[rect.index] || 0);
  const maxHeight = Math.max(...sourceRects.map((rect) => rect.image.height));
  const maxWidth = Math.max(...sourceRects.map((rect) => rect.image.width));
  const totalGap = gaps.reduce((sum, gap) => sum + gap, 0);
  const width = isVertical ? maxWidth + paddingSize * 2 : sourceRects.reduce((sum, rect) => sum + rect.image.width, 0) + totalGap + paddingSize * 2;
  const height = isVertical ? sourceRects.reduce((sum, rect) => sum + rect.image.height, 0) + totalGap + paddingSize * 2 : maxHeight + paddingSize * 2;
  const rects = [];
  if (isVertical) {
    let top = paddingSize;
    sourceRects.forEach((sourceRect, index) => {
      const image = sourceRect.image;
      const offset = selectedHorizontalAlignment === "left"
        ? 0
        : selectedHorizontalAlignment === "right"
          ? maxWidth - image.width
          : Math.round((maxWidth - image.width) / 2);
      const left = Math.round(paddingSize + offset);
      rects.push({ ...sourceRect, left, top, right: left + image.width, bottom: top + image.height });
      top += image.height + (gaps[index] || 0);
    });
  } else {
    let left = paddingSize;
    sourceRects.forEach((sourceRect, index) => {
      const image = sourceRect.image;
      const offset = selectedAlignment === "top" ? 0 : selectedAlignment === "bottom" ? maxHeight - image.height : Math.round((maxHeight - image.height) / 2);
      const top = Math.round(paddingSize + offset);
      rects.push({ ...sourceRect, left, top, right: left + image.width, bottom: top + image.height });
      left += image.width + (gaps[index] || 0);
    });
  }
  return { rects, width, height };
}

function renderOriginalComposition(sourceRects = imageRects) {
  if (!sourceRects.length) return null;
  const layout = getCompositionLayout(sourceRects);
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = Math.max(1, layout.width);
  exportCanvas.height = Math.max(1, layout.height);
  const previousContext = context;
  context = exportCanvas.getContext("2d");
  context.clearRect(0, 0, layout.width, layout.height);
  if (selectedColor && colorOpacity > 0) {
    context.fillStyle = colorWithOpacity(selectedColor, colorOpacity);
    context.fillRect(0, 0, layout.width, layout.height);
  }
  layout.rects.forEach((rect) => {
    drawRenderableImage(getRenderableImage(rect.image), rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top, rect.borderSettings);
  });
  if (highlightEnabled) drawHighlightBorders(layout.rects.map((rect) => ({ ...rect, opacity: 1 })));
  context = previousContext;
  return exportCanvas;
}

async function copyComposition() {
  const selectedEntries = getSelectedImageEntries();
  if (!selectedEntries.length) return;
  if (!navigator.clipboard?.write || !window.ClipboardItem) {
    showCopyFeedback("Indisponível");
    return;
  }
  stopCurrentAnimation();
  const selectedImagesSet = new Set(selectedEntries.map(({ image }) => image));
  const selectedRects = imageRects.filter((rect) => selectedImagesSet.has(rect.image));
  const exportCanvas = renderOriginalComposition(selectedRects);
  const blob = await new Promise((resolve) => exportCanvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    showCopyFeedback("Copiado");
  } catch (error) {
    showCopyFeedback("Falhou");
  }
}

function showCopyFeedback(label) {
  window.clearTimeout(copyFeedbackTimer);
  const localizedLabel = uiLanguage === "en"
    ? label === "Copiado" ? t("copied", "Copiado")
      : label === "Indisponível" ? t("unavailable", "Indisponível")
        : label === "Falhou" ? t("failed", "Falhou")
          : /^\d+ copiadas$/.test(label) ? t("copiedCount", (count) => `${count} copiadas`)(label.match(/^\d+/)[0]) : label
    : label;
  copyLabel.textContent = localizedLabel;
  copyButton.classList.add("is-confirmed");
  copyFeedbackTimer = window.setTimeout(() => {
    copyLabel.textContent = t("copy", "Copiar");
    copyButton.classList.remove("is-confirmed");
  }, 1500);
}

function showHistoryToast(action) {
  let toast = historyToastStack.querySelector(`[data-history-action="${action}"]`);
  const wasExisting = Boolean(toast);
  if (!toast) {
    toast = document.createElement("div");
    toast.className = `history-toast ${action}`;
    toast.dataset.historyAction = action;
    toast.dataset.count = "0";
    toast.innerHTML = `<span class="history-toast-icon">${action === "undo" ? "↶" : "↷"}</span><span class="history-toast-count" aria-hidden="true"></span>`;
    if (action === "undo") historyToastStack.prepend(toast);
    else historyToastStack.appendChild(toast);
  }
  const count = Number(toast.dataset.count || 0) + 1;
  toast.dataset.count = String(count);
  const countBadge = toast.querySelector(".history-toast-count");
  countBadge.textContent = count > 1 ? String(count) : "";
  countBadge.classList.toggle("is-visible", count > 1);
  toast.setAttribute("role", "status");
  const actionLabel = action === "undo" ? t("undone", "Desfeito") : t("redone", "Refeito");
  toast.setAttribute("aria-label", `${actionLabel}${count > 1 ? `, ${count} ${t("times", "vezes")}` : ""}`);
  toast.classList.remove("is-leaving");
  if (wasExisting) {
    toast.classList.remove("is-refreshing");
    void toast.offsetWidth;
    toast.classList.add("is-refreshing");
  }
  const previousTimers = historyToastTimers.get(action);
  if (previousTimers) {
    window.clearTimeout(previousTimers.leave);
    window.clearTimeout(previousTimers.remove);
  }
  const leave = window.setTimeout(() => toast.classList.add("is-leaving"), 1050);
  const remove = window.setTimeout(() => {
    toast.remove();
    historyToastTimers.delete(action);
  }, 1450);
  historyToastTimers.set(action, { leave, remove });
}

function captureState() {
  return {
    selectedImages: [...selectedImages],
    selectedColor,
    borderColor,
    colorOpacity,
    borderOpacity,
    selectedHue,
    selectedSaturation,
    selectedValue,
    selectedOrder,
    customOrder,
    manualOrder: [...manualOrder],
    selectedAlignment,
    selectedHorizontalAlignment,
    isVertical,
    highlightEnabled,
    imageBorderSettings: selectedImages.map(({ image }) => ({ image, settings: cloneBorderSettings(getImageBorderSettings(image)) })),
    gapSizes: [...gapSizes],
    paddingSize,
    borderThickness,
    borderRadii: { ...borderRadii },
    eraseColor: eraseColor ? { ...eraseColor } : null,
    erasedColors: erasedColors.map((color) => ({ ...color })),
    eraseBorders,
    imageEraseSettings: selectedImages.map(({ image }) => ({ image, settings: cloneEraseSettings(getImageEraseSettings(image)) }))
  };
}

function statesMatch(first, second) {
  if (!first || !second) return false;
  const sameImages = first.selectedImages.length === second.selectedImages.length && first.selectedImages.every((image, index) => image === second.selectedImages[index]);
  const firstBorders = (first.imageBorderSettings || []).map(({ settings }) => settings);
  const secondBorders = (second.imageBorderSettings || []).map(({ settings }) => settings);
  const firstOrder = first.manualOrder || first.selectedImages;
  const secondOrder = second.manualOrder || second.selectedImages;
  const sameManualOrder = firstOrder.length === secondOrder.length && firstOrder.every((image, index) => image === secondOrder[index]);
  const firstErasedColors = first.erasedColors || (first.eraseColor ? [first.eraseColor] : []);
  const secondErasedColors = second.erasedColors || (second.eraseColor ? [second.eraseColor] : []);
  const firstImageEraseSettings = first.imageEraseSettings
    ? first.imageEraseSettings.map(({ settings }) => settings)
    : first.selectedImages.map(() => ({ colors: firstErasedColors, eraseBorders: Boolean(first.eraseBorders) }));
  const secondImageEraseSettings = second.imageEraseSettings
    ? second.imageEraseSettings.map(({ settings }) => settings)
    : second.selectedImages.map(() => ({ colors: secondErasedColors, eraseBorders: Boolean(second.eraseBorders) }));
  return sameImages && first.selectedColor === second.selectedColor && first.borderColor === second.borderColor && first.colorOpacity === second.colorOpacity && first.borderOpacity === second.borderOpacity && first.selectedHue === second.selectedHue && first.selectedSaturation === second.selectedSaturation && first.selectedValue === second.selectedValue && first.selectedOrder === second.selectedOrder && first.customOrder === second.customOrder && sameManualOrder && first.selectedAlignment === second.selectedAlignment && first.selectedHorizontalAlignment === second.selectedHorizontalAlignment && first.isVertical === second.isVertical && first.highlightEnabled === second.highlightEnabled && JSON.stringify(firstBorders) === JSON.stringify(secondBorders) && first.paddingSize === second.paddingSize && first.borderThickness === second.borderThickness && JSON.stringify(first.borderRadii) === JSON.stringify(second.borderRadii) && JSON.stringify(first.gapSizes) === JSON.stringify(second.gapSizes) && JSON.stringify(firstImageEraseSettings) === JSON.stringify(secondImageEraseSettings);
}

function commitHistory() {
  const snapshot = captureState();
  if (statesMatch(history[historyIndex], snapshot)) return;
  history = history.slice(0, historyIndex + 1);
  history.push(snapshot);
  historyIndex = history.length - 1;
  if (history.length > 50) {
    history.shift();
    historyIndex -= 1;
  }
}

function undo() {
  if (historyIndex <= 0) return false;
  historyIndex -= 1;
  restoreState(history[historyIndex]);
  return true;
}

function redo() {
  if (historyIndex >= history.length - 1) return false;
  historyIndex += 1;
  restoreState(history[historyIndex]);
  return true;
}

function restoreState(snapshot) {
  selectedImages = [...snapshot.selectedImages];
  selectedColor = snapshot.selectedColor;
  borderColor = snapshot.borderColor || "#ffffff";
  colorOpacity = typeof snapshot.colorOpacity === "number" ? snapshot.colorOpacity : 1;
  borderOpacity = typeof snapshot.borderOpacity === "number" ? snapshot.borderOpacity : 1;
  selectedHue = snapshot.selectedHue;
  selectedSaturation = snapshot.selectedSaturation;
  selectedValue = snapshot.selectedValue;
  selectedOrder = snapshot.selectedOrder;
  customOrder = Boolean(snapshot.customOrder);
  manualOrder = snapshot.manualOrder ? [...snapshot.manualOrder] : [...selectedImages];
  selectedAlignment = snapshot.selectedAlignment;
  selectedHorizontalAlignment = snapshot.selectedHorizontalAlignment || "center";
  isVertical = snapshot.isVertical;
  highlightEnabled = Boolean(snapshot.highlightEnabled);
  const fallbackBorderSettings = { thickness: snapshot.borderThickness, radii: snapshot.borderRadii };
  imageBorderSettings = new Map((snapshot.imageBorderSettings || []).map(({ image, settings }) => [image, cloneBorderSettings(settings)]));
  selectedImages.forEach(({ image }) => {
    if (!imageBorderSettings.has(image)) imageBorderSettings.set(image, cloneBorderSettings(fallbackBorderSettings));
  });
  gapSizes = [...snapshot.gapSizes];
  paddingSize = snapshot.paddingSize;
  borderThickness = typeof snapshot.borderThickness === "number" ? snapshot.borderThickness : 0;
  borderRadii = snapshot.borderRadii ? { ...snapshot.borderRadii } : { topLeft: 0, bottomLeft: 0, bottomRight: 0, topRight: 0 };
  const fallbackEraseSettings = {
    colors: (snapshot.erasedColors || (snapshot.eraseColor ? [snapshot.eraseColor] : [])).map((color) => ({ ...color })),
    eraseBorders: Boolean(snapshot.eraseBorders)
  };
  imageEraseSettings = new Map((snapshot.imageEraseSettings || []).map(({ image, settings }) => [image, cloneEraseSettings(settings)]));
  selectedImages.forEach(({ image }) => {
    if (!imageEraseSettings.has(image)) imageEraseSettings.set(image, cloneEraseSettings(fallbackEraseSettings));
  });
  erasedColors = [];
  eraseColor = null;
  selectedErasedColorIndexes.clear();
  erasedColorAnchorIndex = null;
  eraseBorders = false;
  selectedImageIndex = null;
  selectedImageIndexes.clear();
  selectionAnchorIndex = null;
  allGapsSelected = false;
  eraseMode = false;
  canvasScroll.classList.remove("is-eyedropper");
  eraseColorButton.classList.remove("is-active");
  eraseBorderButton.classList.toggle("is-active", eraseBorders);
  eraseBorderButton.setAttribute("aria-pressed", String(eraseBorders));
  updateEraseStatus();
  verticalToggle.classList.toggle("is-active", isVertical);
  verticalToggle.setAttribute("aria-pressed", String(isVertical));
  highlightToggle.classList.toggle("is-active", highlightEnabled);
  highlightToggle.setAttribute("aria-pressed", String(highlightEnabled));
  alignButtons.forEach((button) => { button.disabled = isVertical; });
  horizontalAlignButtons.forEach((button) => { button.disabled = !isVertical; });
  orderButtons.forEach((button) => {
    const isActive = !customOrder && button.dataset.order === selectedOrder;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });
  alignButtons.forEach((button) => {
    const isActive = button.dataset.align === selectedAlignment;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });
  horizontalAlignButtons.forEach((button) => {
    const isActive = button.dataset.horizontalAlign === selectedHorizontalAlignment;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });
  updateLayoutLabel();
  syncHsvFromActiveColor();
  updateColorControls();
  if (selectedImages.length) {
    renderComposition();
  } else {
    workspace.hidden = true;
    copyButton.disabled = true;
    fileList.innerHTML = "";
    updateSpacingControls();
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

try { isDarkTheme = localStorage.getItem("imgt-theme") !== "light"; } catch (error) { isDarkTheme = true; }
loadUserSettings();
applyBrowserLanguage();
initializeDragScrolling();
applyTheme();
updateLayoutLabel();
updateColorControls();
history = [captureState()];
