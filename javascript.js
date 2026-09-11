const imageInput = document.getElementById("image-input");
const uploadCard = document.getElementById("upload-card");
const workspace = document.getElementById("workspace");
const demoStrip = document.getElementById("demo-strip");
const canvas = document.getElementById("composition-canvas");
const canvasScroll = document.getElementById("canvas-scroll");
const canvasSelectionLayer = document.getElementById("canvas-selection-layer");
const context = canvas.getContext("2d");
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
const themeToggle = document.getElementById("theme-toggle");
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
const hueSlider = document.getElementById("hue-slider");
const redInput = document.getElementById("red-input");
const greenInput = document.getElementById("green-input");
const blueInput = document.getElementById("blue-input");
const transparencySlider = document.getElementById("transparency-slider");
const transparencyValue = document.getElementById("transparency-value");
const eraseColorButton = document.getElementById("erase-color-button");
const rescaleButton = document.getElementById("rescale-button");
const eraseStatus = document.getElementById("erase-status");
const orderButtons = [...document.querySelectorAll("[data-order]")];
const alignButtons = [...document.querySelectorAll("[data-align]")];
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
let isVertical = false;
let gapSizes = [];
let paddingSize = 0;
let imageRects = [];
let displayedImages = [];
let selectedImageIndex = null;
let selectedImageIndexes = new Set();
let allGapsSelected = false;
let customOrder = false;
let manualOrder = [];
let draggedFileIndex = null;
let eraseColor = null;
let eraseMode = false;
let history = [];
let historyIndex = -1;
let isDarkTheme = true;
let animationFrameId = null;
let finishAnimation = null;
let lastBackgroundKey = null;
let borderThickness = 0;
let borderRadii = { topLeft: 0, bottomLeft: 0, bottomRight: 0, topRight: 0 };
let imageBorderSettings = new Map();
let copyFeedbackTimer = null;
const historyToastTimers = new Map();
let suppressCanvasClick = false;
let scrollInertiaFrameId = null;
let canvasDragState = null;
let hoveredImageIndex = null;
let selectionPulseTimer = null;
let highlightEnabled = false;

const orderNames = { desc: "maior → menor", asc: "menor → maior", custom: "ordem personalizada" };
const alignmentNames = { center: "centralizado", top: "para cima", bottom: "para baixo" };
const selectionBorderThickness = 3;

imageInput.addEventListener("change", (event) => {
  addImages(event.target.files);
  imageInput.value = "";
});

document.addEventListener("keydown", (event) => {
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
  updateLayoutLabel();
  commitHistory();
  renderComposition();
});
exportButton.addEventListener("click", exportComposition);
copyButton.addEventListener("click", copyComposition);
themeToggle.addEventListener("click", toggleTheme);
deleteImageButton.addEventListener("click", deleteSelectedImage);
canvas.addEventListener("click", handleCanvasClick);
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
colorSurface.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    chooseSurfaceColor(event);
  }
});
hueSlider.addEventListener("input", () => {
  selectedHue = Number(hueSlider.value);
  updateColorControls();
  if (getActiveColor()) setColor(hsvToHex(selectedHue, selectedSaturation, selectedValue), false);
});
hueSlider.addEventListener("change", () => commitHistory());
[transparencySlider].forEach((input) => {
  input.addEventListener("input", () => {
    setActiveOpacity(1 - Number(input.value) / 100);
    updateColorControls();
    renderComposition();
  });
  input.addEventListener("change", () => commitHistory());
});
[redInput, greenInput, blueInput].forEach((input) => {
  input.addEventListener("change", applyRgbInputs);
  input.addEventListener("blur", applyRgbInputs);
});
transparentToggle.addEventListener("click", () => {
  setActiveColor(null, false);
  updateColorControls();
  commitHistory();
  renderComposition();
});
borderThicknessInput.addEventListener("input", () => {
  borderThickness = clamp(Number.parseInt(borderThicknessInput.value, 10) || 0, 0, 200);
  borderThicknessInput.value = borderThickness;
  applyBorderControlsToSelection();
  renderComposition();
});
borderThicknessInput.addEventListener("change", commitHistory);
borderRadiusGeneralInput.addEventListener("input", () => {
  const radius = clamp(Number.parseInt(borderRadiusGeneralInput.value, 10) || 0, 0, 1000);
  borderRadiusGeneralInput.value = radius;
  Object.keys(borderRadii).forEach((corner) => { borderRadii[corner] = radius; });
  updateBorderControls();
  applyBorderControlsToSelection();
  renderComposition();
});
borderRadiusGeneralInput.addEventListener("change", commitHistory);
Object.entries(borderRadiusInputs).forEach(([corner, input]) => {
  input.addEventListener("input", () => {
    borderRadii[corner] = clamp(Number.parseInt(input.value, 10) || 0, 0, 1000);
    input.value = borderRadii[corner];
    updateBorderControls();
    applyBorderControlsToSelection();
    renderComposition();
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
applySpacingButton.addEventListener("click", applySpacing);
applyPaddingButton.addEventListener("click", applyPadding);
eraseColorButton.addEventListener("click", startColorErase);
rescaleButton.addEventListener("click", rescaleImagesToVisibleBounds);
selectAllGapsButton.addEventListener("click", () => {
  if (allGapsSelected) {
    allGapsSelected = false;
    selectedImageIndex = null;
    selectedImageIndexes.clear();
  } else {
    allGapsSelected = true;
    selectedImageIndex = null;
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

function addImages(fileCollection) {
  const validFiles = [...fileCollection].filter((file) => file.type.startsWith("image/"));
  if (!validFiles.length) return;

  const readers = validFiles.map((file) => loadImage(file));
  Promise.all(readers).then((newImages) => {
    selectedImages = [...selectedImages, ...newImages];
    manualOrder = [
      ...manualOrder.filter((item) => selectedImages.includes(item)),
      ...selectedImages.filter((item) => !manualOrder.includes(item))
    ];
    commitHistory();
    renderComposition(true);
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

function renderComposition(shouldScroll = false) {
  stopCurrentAnimation();
  if (!selectedImages.length) {
    canvas.width = 0;
    canvas.height = 0;
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

  canvas.width = totalWidth;
  canvas.height = totalHeight;
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
      const xPosition = Math.round(paddingSize + (maxWidth - image.width) / 2);
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
  animateComposition(previousRects, nextRects, renderableImages, totalWidth, totalHeight);

  workspace.hidden = false;
  demoStrip.hidden = true;
  copyButton.disabled = false;
  imageCount.textContent = `${orderedImages.length} ${orderedImages.length === 1 ? "imagem" : "imagens"}`;
  compositionSize.textContent = `${totalWidth.toLocaleString("pt-BR")} × ${totalHeight.toLocaleString("pt-BR")} px`;
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

  if (!previousRects.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

function stopCurrentAnimation() {
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  if (finishAnimation) finishAnimation();
  finishAnimation = null;
}

function getRenderableImage(image) {
  if (!eraseColor) return image;
  const processedCanvas = document.createElement("canvas");
  processedCanvas.width = image.width;
  processedCanvas.height = image.height;
  const processedContext = processedCanvas.getContext("2d");
  processedContext.drawImage(image, 0, 0);
  const pixels = processedContext.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
  const data = pixels.data;
  const tolerance = 0;
  for (let index = 0; index < data.length; index += 4) {
    const colorDistance = Math.max(
      Math.abs(data[index] - eraseColor.r),
      Math.abs(data[index + 1] - eraseColor.g),
      Math.abs(data[index + 2] - eraseColor.b)
    );
    if (data[index + 3] > 0 && colorDistance <= tolerance) data[index + 3] = 0;
  }
  processedContext.putImageData(pixels, 0, 0);
  return processedCanvas;
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
  if (!selectedImages.length || !eraseColor) return;
  const replacements = new Map();
  const nextImages = selectedImages.map((entry) => {
    const visibleImage = cropTransparentBounds(getRenderableImage(entry.image));
    if (visibleImage === entry.image || (visibleImage.width === entry.image.width && visibleImage.height === entry.image.height)) return entry;
    const nextEntry = { ...entry, image: visibleImage };
    replacements.set(entry, nextEntry);
    const settings = imageBorderSettings.get(entry.image);
    if (settings) imageBorderSettings.set(visibleImage, cloneBorderSettings(settings));
    imageBorderSettings.delete(entry.image);
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
  const orderLabel = customOrder ? orderNames.custom : orderNames[selectedOrder];
  layoutLabel.textContent = isVertical ? `${orderLabel} · vertical` : `${orderLabel} · ${alignmentNames[selectedAlignment]}`;
}

function selectImageAt(event) {
  if (!imageRects.length) return;
  const bounds = canvas.getBoundingClientRect();
  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;
  const x = (event.clientX - bounds.left) * scaleX;
  const y = (event.clientY - bounds.top) * scaleY;
  const target = imageRects.find((rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
  if (!target) {
    if (eraseMode) eraseStatus.textContent = "Cor apagada: ()";
    return;
  }
  if (eraseMode) {
    const pixel = context.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    eraseColor = { r: pixel[0], g: pixel[1], b: pixel[2] };
    eraseMode = false;
    eraseColorButton.classList.remove("is-active");
    canvasScroll.classList.remove("is-eyedropper");
    eraseStatus.textContent = `Cor apagada: (${rgbToHex(eraseColor).toUpperCase()})`;
    commitHistory();
    renderComposition();
    return;
  }
  selectImageGap(target.index, event.ctrlKey || event.metaKey);
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
  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;
  const x = (event.clientX - bounds.left) * scaleX;
  const y = (event.clientY - bounds.top) * scaleY;
  return imageRects.find((rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) || null;
}

function updateHoveredImage(event) {
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
    return `<div class="${classes.join(" ")}" data-image-index="${rect.index}" style="left:${rect.left - expansion}px;top:${rect.top - expansion}px;width:${width + selectionThickness}px;height:${height + selectionThickness}px;border-radius:${selectionRadii.topLeft}px ${selectionRadii.topRight}px ${selectionRadii.bottomRight}px ${selectionRadii.bottomLeft}px;--selection-thickness:${selectionThickness}px"></div>`;
  }).join("");
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

function canScrollTarget(target, deltaX, deltaY) {
  if (target === canvasScroll) {
    return (Math.abs(deltaX) > 0 && canvasScroll.scrollWidth > canvasScroll.clientWidth) || (Math.abs(deltaY) > 0 && canvasScroll.scrollHeight > canvasScroll.clientHeight);
  }
  const page = document.scrollingElement || document.documentElement;
  return (Math.abs(deltaX) > 0 && page.scrollWidth > page.clientWidth) || (Math.abs(deltaY) > 0 && page.scrollHeight > page.clientHeight);
}

function readScrollPosition(target) {
  return target === canvasScroll ? { x: canvasScroll.scrollLeft, y: canvasScroll.scrollTop } : { x: window.scrollX, y: window.scrollY };
}

function applyScrollDelta(target, deltaX, deltaY) {
  if (target === canvasScroll) {
    canvasScroll.scrollLeft += deltaX;
    canvasScroll.scrollTop += deltaY;
    return;
  }
  window.scrollTo({ left: window.scrollX + deltaX, top: window.scrollY + deltaY, behavior: "instant" });
}

function getScrollLimits(target) {
  if (target === canvasScroll) {
    return {
      x: Math.max(0, canvasScroll.scrollWidth - canvasScroll.clientWidth),
      y: Math.max(0, canvasScroll.scrollHeight - canvasScroll.clientHeight)
    };
  }
  const page = document.scrollingElement || document.documentElement;
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

function handleWheelScroll(event) {
  if (event.ctrlKey) return;
  const { x: deltaX, y: deltaY } = getWheelDelta(event);
  if (!deltaX && !deltaY) return;
  const canvasTarget = event.target instanceof Element ? event.target.closest(".canvas-scroll") : null;
  const preferredTarget = canvasTarget || (document.scrollingElement || document.documentElement);
  const target = canScrollTarget(preferredTarget, deltaX, deltaY) ? preferredTarget : (preferredTarget === canvasScroll ? (document.scrollingElement || document.documentElement) : preferredTarget);
  if (!canScrollTarget(target, deltaX, deltaY)) return;
  event.preventDefault();
  startWheelInertia(target, deltaX, deltaY);
}

function beginCanvasDrag(event) {
  if (event.button !== 0 || canvasScroll.classList.contains("is-eyedropper")) return;
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
    armed: false,
    holdTimer: null
  };
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
  const distance = Math.hypot(deltaX, deltaY);
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
  canvasScroll.scrollLeft -= deltaX;
  canvasScroll.scrollTop -= deltaY;
  canvasDragState.velocityX = -deltaX / elapsed;
  canvasDragState.velocityY = -deltaY / elapsed;
  canvasDragState.lastX = event.clientX;
  canvasDragState.lastY = event.clientY;
  canvasDragState.lastTime = now;
}

function finishCanvasDrag(event) {
  if (!canvasDragState || (event && canvasDragState.pointerId !== event.pointerId)) return;
  const state = canvasDragState;
  canvasDragState = null;
  window.clearTimeout(state.holdTimer);
  canvasScroll.classList.remove("is-dragging-scroll");
  if (state.moved) {
    startScrollInertia(
      () => ({ x: canvasScroll.scrollLeft, y: canvasScroll.scrollTop }),
      (deltaX, deltaY) => { canvasScroll.scrollLeft += deltaX; canvasScroll.scrollTop += deltaY; },
      state.velocityX,
      state.velocityY
    );
  }
}

function handleCanvasPointerLeave() {
  clearHoveredImage();
}

function initializeDragScrolling() {
  canvasScroll.addEventListener("pointerdown", beginCanvasDrag);
  canvasScroll.addEventListener("pointermove", moveCanvasDrag);
  canvasScroll.addEventListener("pointerup", finishCanvasDrag);
  canvasScroll.addEventListener("pointercancel", finishCanvasDrag);
  canvasScroll.addEventListener("pointerleave", handleCanvasPointerLeave);
  document.addEventListener("wheel", handleWheelScroll, { passive: false });
}

function startColorErase() {
  if (!selectedImages.length) return;
  eraseMode = !eraseMode;
  eraseColorButton.classList.toggle("is-active", eraseMode);
  canvasScroll.classList.toggle("is-eyedropper", eraseMode);
  eraseStatus.textContent = eraseColor ? `Cor apagada: (${rgbToHex(eraseColor).toUpperCase()})` : "Cor apagada: ()";
}

function selectImageGap(index, additive = false) {
  if (allGapsSelected) {
    allGapsSelected = false;
    selectedImageIndexes.clear();
  }
  if (additive) {
    if (selectedImageIndexes.has(index)) selectedImageIndexes.delete(index);
    else selectedImageIndexes.add(index);
    selectedImageIndex = selectedImageIndexes.has(index) ? index : [...selectedImageIndexes].at(-1) ?? null;
  } else if (selectedImageIndexes.size === 1 && selectedImageIndexes.has(index)) {
    selectedImageIndexes.clear();
    selectedImageIndex = null;
  } else {
    selectedImageIndexes = new Set([index]);
    selectedImageIndex = index;
  }
  if (selectedImageIndex !== null) syncBorderControlsFromSelection();
  updateSpacingControls();
  updateSelectionLayer();
  if (selectedImageIndexes.size) pulseSelectedImages();
}

function updateSpacingControls() {
  const hasImages = selectedImages.length > 0;
  const hasGaps = selectedImages.length > 1;
  spacingInput.disabled = !hasGaps;
  eraseColorButton.disabled = !hasImages;
  rescaleButton.disabled = !hasImages || !eraseColor;
  const hasSelection = allGapsSelected || selectedImageIndexes.size > 0 || selectedImageIndex !== null;
  deleteImageButton.disabled = !hasImages || !hasSelection;
  selectAllGapsButton.disabled = !hasImages;
  applySpacingButton.disabled = !hasGaps || (selectedImageIndex === null && !allGapsSelected) || selectedImageIndex >= selectedImages.length - 1;
  applyPaddingButton.disabled = !hasImages;
  borderParameterInputs.forEach((input) => { input.disabled = !hasImages || !hasSelection; });
  highlightToggle.disabled = !hasImages;
  highlightToggle.classList.toggle("is-active", highlightEnabled);
  highlightToggle.setAttribute("aria-pressed", String(highlightEnabled));
  selectAllGapsButton.classList.toggle("is-active", allGapsSelected);
  if (allGapsSelected) {
    spacingStatus.textContent = "Todos os espaços foram selecionados. O padding é geral.";
    selectedImageLabel.textContent = "todos";
    spacingInput.value = gapSizes.length ? gapSizes[0] : 0;
    paddingInput.value = paddingSize;
  } else if (selectedImageIndex !== null) {
    const isLastImage = selectedImageIndex >= selectedImages.length - 1;
    spacingStatus.textContent = isLastImage ? "Última imagem selecionada: ajuste apenas o padding geral." : "Imagem selecionada: ajuste o espaço até a próxima e o padding geral.";
    selectedImageLabel.textContent = isLastImage ? `${selectedImageIndex + 1}` : `${selectedImageIndex + 1} → ${selectedImageIndex + 2}`;
    spacingInput.value = isLastImage ? 0 : gapSizes[selectedImageIndex] || 0;
    spacingInput.disabled = isLastImage;
    paddingInput.value = paddingSize;
  } else if (hasImages) {
    spacingStatus.textContent = "Clique em uma imagem na prévia para escolher o espaço até a próxima.";
    selectedImageLabel.textContent = "—";
    spacingInput.value = 0;
    paddingInput.value = paddingSize;
  } else {
    spacingStatus.textContent = "Adicione imagens e clique em uma delas para editar espaço e padding.";
    selectedImageLabel.textContent = "—";
    spacingInput.value = 0;
    paddingInput.value = paddingSize;
  }
  fileList.querySelectorAll(".file-item").forEach((item) => {
    const index = Number(item.dataset.imageIndex);
    item.classList.toggle("is-selected", allGapsSelected || selectedImageIndexes.has(index) || index === selectedImageIndex);
  });
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
  imagesToDelete.forEach(({ image }) => imageBorderSettings.delete(image));
  selectedImages = selectedImages.filter((item) => !imagesToDelete.includes(item));
  manualOrder = manualOrder.filter((item) => selectedImages.includes(item));
  gapSizes = nextGaps;
  selectedImageIndex = null;
  selectedImageIndexes.clear();
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

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  applyTheme();
  try { localStorage.setItem("imgt-theme", isDarkTheme ? "dark" : "light"); } catch (error) { /* armazenamento opcional */ }
}

function applyTheme() {
  document.body.classList.toggle("dark-theme", isDarkTheme);
  document.documentElement.classList.toggle("dark-theme", isDarkTheme);
  themeToggle.setAttribute("aria-pressed", String(isDarkTheme));
  themeToggle.setAttribute("aria-label", isDarkTheme ? "Ativar modo claro" : "Ativar modo escuro");
  themeToggle.querySelector(".theme-toggle-icon").textContent = isDarkTheme ? "☀" : "☾";
  themeToggle.querySelector(".theme-toggle-label").textContent = isDarkTheme ? "claro" : "escuro";
}

function chooseSurfaceColor(event) {
  if (typeof event.clientX !== "number" || typeof event.clientY !== "number") return;
  const bounds = colorSurface.getBoundingClientRect();
  selectedSaturation = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
  selectedValue = clamp(1 - ((event.clientY - bounds.top) / bounds.height), 0, 1);
  setColor(hsvToHex(selectedHue, selectedSaturation, selectedValue));
}

function setColor(color, recordHistory = true) {
  const normalized = normalizeHex(color);
  if (!normalized) return;
  setActiveColor(normalized);
  const hsv = rgbToHsv(hexToRgb(normalized));
  selectedHue = hsv.h;
  selectedSaturation = hsv.s;
  selectedValue = hsv.v;
  updateColorControls();
  if (recordHistory) commitHistory();
  renderComposition();
}

function updateColorControls() {
  const activeColor = getActiveColor();
  const isTransparent = !activeColor;
  colorContextLabel.textContent = activeColorTarget === "border" ? "Cor da borda" : "Cor do vazio";
  colorValue.textContent = isTransparent ? "transparente" : activeColor.toUpperCase();
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
  emptyColorSummary.textContent = selectedColor ? selectedColor.toUpperCase() : "transparente";
  borderColorSummary.textContent = borderColor ? borderColor.toUpperCase() : "transparente";
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
    item.addEventListener("click", (event) => selectImageGap(Number(item.dataset.imageIndex), event.ctrlKey || event.metaKey));
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
  const [movedImage] = orderedImages.splice(fromIndex, 1);
  orderedImages.splice(toIndex, 0, movedImage);
  manualOrder = orderedImages;
  customOrder = true;
  selectedImageIndexes = new Set(orderedImages.map((image, index) => selectedObjects.has(image) ? index : -1).filter((index) => index >= 0));
  selectedImageIndex = primaryObject ? orderedImages.indexOf(primaryObject) : null;
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
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
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

async function copyComposition() {
  if (!selectedImages.length) return;
  if (!navigator.clipboard?.write || !window.ClipboardItem) {
    showCopyFeedback("Indisponível");
    return;
  }
  stopCurrentAnimation();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
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
  copyLabel.textContent = label;
  copyButton.classList.add("is-confirmed");
  copyFeedbackTimer = window.setTimeout(() => {
    copyLabel.textContent = "Copiar";
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
  toast.setAttribute("aria-label", `${action === "undo" ? "Desfeito" : "Refeito"}${count > 1 ? `, ${count} vezes` : ""}`);
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
    isVertical,
    highlightEnabled,
    imageBorderSettings: selectedImages.map(({ image }) => ({ image, settings: cloneBorderSettings(getImageBorderSettings(image)) })),
    gapSizes: [...gapSizes],
    paddingSize,
    borderThickness,
    borderRadii: { ...borderRadii },
    eraseColor: eraseColor ? { ...eraseColor } : null
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
  return sameImages && first.selectedColor === second.selectedColor && first.borderColor === second.borderColor && first.colorOpacity === second.colorOpacity && first.borderOpacity === second.borderOpacity && first.selectedHue === second.selectedHue && first.selectedSaturation === second.selectedSaturation && first.selectedValue === second.selectedValue && first.selectedOrder === second.selectedOrder && first.customOrder === second.customOrder && sameManualOrder && first.selectedAlignment === second.selectedAlignment && first.isVertical === second.isVertical && first.highlightEnabled === second.highlightEnabled && JSON.stringify(firstBorders) === JSON.stringify(secondBorders) && first.paddingSize === second.paddingSize && first.borderThickness === second.borderThickness && JSON.stringify(first.borderRadii) === JSON.stringify(second.borderRadii) && JSON.stringify(first.gapSizes) === JSON.stringify(second.gapSizes) && JSON.stringify(first.eraseColor) === JSON.stringify(second.eraseColor);
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
  eraseColor = snapshot.eraseColor ? { ...snapshot.eraseColor } : null;
  selectedImageIndex = null;
  selectedImageIndexes.clear();
  allGapsSelected = false;
  eraseMode = false;
  canvasScroll.classList.remove("is-eyedropper");
  eraseColorButton.classList.remove("is-active");
  eraseStatus.textContent = eraseColor ? `Cor apagada: (${rgbToHex(eraseColor).toUpperCase()})` : "Cor apagada: ()";
  verticalToggle.classList.toggle("is-active", isVertical);
  verticalToggle.setAttribute("aria-pressed", String(isVertical));
  highlightToggle.classList.toggle("is-active", highlightEnabled);
  highlightToggle.setAttribute("aria-pressed", String(highlightEnabled));
  alignButtons.forEach((button) => { button.disabled = isVertical; });
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
initializeDragScrolling();
applyTheme();
updateLayoutLabel();
updateColorControls();
history = [captureState()];
