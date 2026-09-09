const imageInput = document.getElementById("image-input");
const uploadCard = document.getElementById("upload-card");
const workspace = document.getElementById("workspace");
const canvas = document.getElementById("composition-canvas");
const canvasScroll = document.getElementById("canvas-scroll");
const context = canvas.getContext("2d");
const fileList = document.getElementById("file-list");
const imageCount = document.getElementById("image-count");
const compositionSize = document.getElementById("composition-size");
const layoutLabel = document.getElementById("layout-label");
const addMoreButton = document.getElementById("add-more");
const verticalToggle = document.getElementById("vertical-toggle");
const exportButton = document.getElementById("export-button");
const colorWheel = document.getElementById("color-wheel");
const colorWheelCenter = document.getElementById("color-wheel-center");
const hexInput = document.getElementById("hex-input");
const colorName = document.getElementById("color-name");
const colorValue = document.getElementById("color-value");
const transparentToggle = document.getElementById("transparent-toggle");
const colorSurface = document.getElementById("color-surface");
const colorSurfaceCursor = document.getElementById("color-surface-cursor");
const hueSlider = document.getElementById("hue-slider");
const redInput = document.getElementById("red-input");
const greenInput = document.getElementById("green-input");
const blueInput = document.getElementById("blue-input");
const eraseColorButton = document.getElementById("erase-color-button");
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

let selectedImages = [];
let selectedColor = null;
let selectedHue = 100;
let selectedSaturation = 0.7;
let selectedValue = 0.9;
let selectedOrder = "desc";
let selectedAlignment = "center";
let isVertical = false;
let gapSizes = [];
let paddingSize = 0;
let imageRects = [];
let selectedImageIndex = null;
let allGapsSelected = false;
let eraseColor = null;
let eraseMode = false;
let history = [];
let historyIndex = -1;

const orderNames = { desc: "maior → menor", asc: "menor → maior" };
const alignmentNames = { center: "centralizado", top: "para cima", bottom: "para baixo" };

imageInput.addEventListener("change", (event) => {
  addImages(event.target.files);
  imageInput.value = "";
});

document.addEventListener("keydown", (event) => {
  if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
  const changed = event.shiftKey ? redo() : undo();
  if (changed) event.preventDefault();
});

addMoreButton.addEventListener("click", () => imageInput.click());
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
canvas.addEventListener("click", selectImageAt);
colorWheel.addEventListener("click", chooseWheelColor);
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
  if (selectedColor) setColor(hsvToHex(selectedHue, selectedSaturation, selectedValue), false);
});
hueSlider.addEventListener("change", () => commitHistory());
[redInput, greenInput, blueInput].forEach((input) => {
  input.addEventListener("change", applyRgbInputs);
  input.addEventListener("blur", applyRgbInputs);
});
transparentToggle.addEventListener("click", () => {
  selectedColor = null;
  updateColorControls();
  commitHistory();
  renderComposition();
});
orderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedOrder = button.dataset.order;
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
selectAllGapsButton.addEventListener("click", () => {
  allGapsSelected = true;
  selectedImageIndex = null;
  updateSpacingControls();
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

function renderComposition(shouldScroll = false) {
  const descending = [...selectedImages].sort((a, b) => b.image.height - a.image.height);
  const orderedImages = selectedOrder === "asc" ? descending.reverse() : descending;
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
  if (selectedColor) {
    context.fillStyle = selectedColor;
    context.fillRect(0, 0, totalWidth, totalHeight);
  }

  imageRects = [];
  if (isVertical) {
    let yPosition = paddingSize;
    orderedImages.forEach(({ image }, index) => {
      const renderableImage = getRenderableImage(image);
      const xPosition = Math.round(paddingSize + (maxWidth - image.width) / 2);
      imageRects.push({ left: xPosition, top: yPosition, right: xPosition + image.width, bottom: yPosition + image.height, index: imageRects.length });
      context.drawImage(renderableImage, xPosition, yPosition, image.width, image.height);
      yPosition += image.height + (gapSizes[index] || 0);
    });
  } else {
    let xPosition = paddingSize;
    orderedImages.forEach(({ image }, index) => {
      const renderableImage = getRenderableImage(image);
      const yPosition = paddingSize + (selectedAlignment === "top" ? 0 : selectedAlignment === "bottom" ? maxHeight - image.height : Math.round((maxHeight - image.height) / 2));
      imageRects.push({ left: xPosition, top: yPosition, right: xPosition + image.width, bottom: yPosition + image.height, index: imageRects.length });
      context.drawImage(renderableImage, xPosition, yPosition, image.width, image.height);
      xPosition += image.width + (gapSizes[index] || 0);
    });
  }

  workspace.hidden = false;
  imageCount.textContent = `${orderedImages.length} ${orderedImages.length === 1 ? "imagem" : "imagens"}`;
  compositionSize.textContent = `${totalWidth.toLocaleString("pt-BR")} × ${totalHeight.toLocaleString("pt-BR")} px`;
  renderFileList(orderedImages);
  updateSpacingControls();
  if (shouldScroll) workspace.scrollIntoView({ behavior: "smooth", block: "start" });
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

function updateLayoutLabel() {
  layoutLabel.textContent = isVertical ? `${orderNames[selectedOrder]} · vertical` : `${orderNames[selectedOrder]} · ${alignmentNames[selectedAlignment]}`;
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
    if (eraseMode) eraseStatus.textContent = "Clique dentro de uma imagem para escolher a cor.";
    return;
  }
  if (eraseMode) {
    const pixel = context.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    eraseColor = { r: pixel[0], g: pixel[1], b: pixel[2] };
    eraseMode = false;
    eraseColorButton.classList.remove("is-active");
    canvasScroll.classList.remove("is-eyedropper");
    eraseStatus.textContent = `cor selecionada: ${rgbToHex(eraseColor).toUpperCase()}`;
    commitHistory();
    renderComposition();
    return;
  }
  selectImageGap(target.index);
}

function startColorErase() {
  if (!selectedImages.length) return;
  eraseMode = !eraseMode;
  eraseColorButton.classList.toggle("is-active", eraseMode);
  canvasScroll.classList.toggle("is-eyedropper", eraseMode);
  eraseStatus.textContent = eraseMode ? "clique na cor de uma imagem na prévia" : "selecione uma cor dentro da prévia";
}

function selectImageGap(index) {
  selectedImageIndex = index;
  allGapsSelected = false;
  updateSpacingControls();
}

function updateSpacingControls() {
  const hasImages = selectedImages.length > 0;
  const hasGaps = selectedImages.length > 1;
  spacingInput.disabled = !hasGaps;
  eraseColorButton.disabled = !hasImages;
  selectAllGapsButton.disabled = !hasImages;
  applySpacingButton.disabled = !hasGaps || (selectedImageIndex === null && !allGapsSelected) || selectedImageIndex >= selectedImages.length - 1;
  applyPaddingButton.disabled = !hasImages;
  selectAllGapsButton.classList.toggle("is-active", allGapsSelected);
  if (allGapsSelected) {
    spacingStatus.textContent = "Todos os espaços foram selecionados. O padding é geral.";
    selectedImageLabel.textContent = "todos";
    spacingInput.value = gapSizes.length ? gapSizes[0] : 0;
    paddingInput.value = paddingSize;
  } else if (selectedImageIndex !== null) {
    const isLastImage = selectedImageIndex >= selectedImages.length - 1;
    spacingStatus.textContent = isLastImage ? "Última imagem selecionada: ajuste apenas o padding à direita." : "Imagem selecionada: ajuste o espaço até a próxima e o padding à direita.";
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
    item.classList.toggle("is-selected", Number(item.dataset.imageIndex) === selectedImageIndex);
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

function chooseWheelColor(event) {
  const bounds = colorWheel.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
  selectedHue = (angle + 90 + 360) % 360;
  selectedSaturation = Math.max(selectedSaturation, 0.7);
  selectedValue = Math.max(selectedValue, 0.9);
  setColor(hsvToHex(selectedHue, selectedSaturation, selectedValue));
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
  selectedColor = normalized;
  const hsv = rgbToHsv(hexToRgb(normalized));
  selectedHue = hsv.h;
  selectedSaturation = hsv.s;
  selectedValue = hsv.v;
  updateColorControls();
  if (recordHistory) commitHistory();
  renderComposition();
}

function updateColorControls() {
  const isTransparent = !selectedColor;
  colorName.textContent = isTransparent ? "Transparente" : "Cor escolhida";
  colorValue.textContent = isTransparent ? "transparente" : selectedColor.toUpperCase();
  const displayColor = hsvToHex(selectedHue, selectedSaturation, selectedValue);
  colorWheelCenter.style.background = isTransparent ? "transparent" : selectedColor;
  colorSurface.style.setProperty("--picker-hue", selectedHue);
  colorSurfaceCursor.style.left = `${selectedSaturation * 100}%`;
  colorSurfaceCursor.style.top = `${(1 - selectedValue) * 100}%`;
  hueSlider.value = Math.round(selectedHue);
  hexInput.value = selectedColor ? selectedColor.toUpperCase() : "";
  const rgb = hexToRgb(displayColor);
  redInput.value = rgb.r;
  greenInput.value = rgb.g;
  blueInput.value = rgb.b;
  transparentToggle.classList.toggle("is-active", isTransparent);
  transparentToggle.setAttribute("aria-pressed", String(isTransparent));
}

function applyHexInput() {
  const normalized = normalizeHex(hexInput.value);
  if (normalized) {
    setColor(normalized);
  } else if (hexInput.value.trim()) {
    hexInput.value = selectedColor ? selectedColor.toUpperCase() : "";
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
    <button class="file-item" type="button" data-image-index="${index}">
      <img class="file-thumb" src="${image.src}" alt="" />
      <div class="file-details">
        <span class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span>
        <span class="file-size">${image.width} × ${image.height} px</span>
      </div>
      <span class="file-index">${String(index + 1).padStart(2, "0")}</span>
    </button>
  `).join("");
  fileList.querySelectorAll(".file-item").forEach((item) => {
    item.addEventListener("click", () => selectImageGap(Number(item.dataset.imageIndex)));
  });
}

function exportComposition() {
  if (!selectedImages.length) return;
  const link = document.createElement("a");
  link.download = "imagem-em-fila.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function captureState() {
  return {
    selectedImages: [...selectedImages],
    selectedColor,
    selectedHue,
    selectedSaturation,
    selectedValue,
    selectedOrder,
    selectedAlignment,
    isVertical,
    gapSizes: [...gapSizes],
    paddingSize,
    eraseColor: eraseColor ? { ...eraseColor } : null
  };
}

function statesMatch(first, second) {
  if (!first || !second) return false;
  const sameImages = first.selectedImages.length === second.selectedImages.length && first.selectedImages.every((image, index) => image === second.selectedImages[index]);
  return sameImages && first.selectedColor === second.selectedColor && first.selectedHue === second.selectedHue && first.selectedSaturation === second.selectedSaturation && first.selectedValue === second.selectedValue && first.selectedOrder === second.selectedOrder && first.selectedAlignment === second.selectedAlignment && first.isVertical === second.isVertical && first.paddingSize === second.paddingSize && JSON.stringify(first.gapSizes) === JSON.stringify(second.gapSizes) && JSON.stringify(first.eraseColor) === JSON.stringify(second.eraseColor);
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
  selectedHue = snapshot.selectedHue;
  selectedSaturation = snapshot.selectedSaturation;
  selectedValue = snapshot.selectedValue;
  selectedOrder = snapshot.selectedOrder;
  selectedAlignment = snapshot.selectedAlignment;
  isVertical = snapshot.isVertical;
  gapSizes = [...snapshot.gapSizes];
  paddingSize = snapshot.paddingSize;
  eraseColor = snapshot.eraseColor ? { ...snapshot.eraseColor } : null;
  selectedImageIndex = null;
  allGapsSelected = false;
  eraseMode = false;
  canvasScroll.classList.remove("is-eyedropper");
  eraseColorButton.classList.remove("is-active");
  eraseStatus.textContent = eraseColor ? `cor selecionada: ${rgbToHex(eraseColor).toUpperCase()}` : "selecione uma cor dentro da prévia";
  verticalToggle.classList.toggle("is-active", isVertical);
  verticalToggle.setAttribute("aria-pressed", String(isVertical));
  alignButtons.forEach((button) => { button.disabled = isVertical; });
  orderButtons.forEach((button) => {
    const isActive = button.dataset.order === selectedOrder;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });
  alignButtons.forEach((button) => {
    const isActive = button.dataset.align === selectedAlignment;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });
  updateLayoutLabel();
  updateColorControls();
  if (selectedImages.length) {
    renderComposition();
  } else {
    workspace.hidden = true;
    fileList.innerHTML = "";
    updateSpacingControls();
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

updateLayoutLabel();
updateColorControls();
history = [captureState()];
