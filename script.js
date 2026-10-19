const form = document.getElementById("qrForm");
const urlInput = document.getElementById("urlInput");
const result = document.getElementById("result");
const qrContainer = document.getElementById("qrcode");
const resultUrl = document.getElementById("resultUrl");
const errorMessage = document.getElementById("errorMessage");
const clearBtn = document.getElementById("clearBtn");
const inputHint = document.getElementById("inputHint");
let currentUrl = "";

urlInput.addEventListener("input", () => {
  clearBtn.style.display = urlInput.value ? "block" : "none";
  errorMessage.hidden = true;
  inputHint.textContent = "Tip: include https:// for the best results.";
  inputHint.style.color = "";
});

clearBtn.addEventListener("click", () => {
  urlInput.value = "";
  urlInput.focus();
  clearBtn.style.display = "none";
  result.hidden = true;
  errorMessage.hidden = true;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorMessage.hidden = true;
  const raw = urlInput.value.trim();

  if (!raw) {
    showError("Please enter a website link first.");
    urlInput.focus();
    return;
  }

  let parsed;
  try {
    parsed = new URL(/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(raw) ? raw : `https://${raw}`);
  } catch {
    showError("That link doesn't look valid. Check it and try again.");
    return;
  }

  if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname.includes(".")) {
    showError("Please enter a valid website URL, such as https://example.com.");
    return;
  }

  currentUrl = parsed.href;
  urlInput.value = currentUrl;
  clearBtn.style.display = "block";
  if (typeof QRCode === "undefined") {
    showError("The QR generator library couldn't load. Check your internet connection and refresh the page.");
    return;
  }

  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: currentUrl,
    width: 200,
    height: 200,
    colorDark: "#1c2340",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
  resultUrl.textContent = currentUrl;
  result.hidden = false;
  inputHint.textContent = "Your QR code is ready to download.";
  inputHint.style.color = "#239b73";
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const canvas = qrContainer.querySelector("canvas");
  const image = qrContainer.querySelector("img");
  let dataUrl = canvas ? canvas.toDataURL("image/png") : image ? image.src : null;
  if (!dataUrl) {
    showError("Generate a QR code before downloading.");
    return;
  }
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "linkqr-code.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  result.hidden = true;
  urlInput.value = "";
  currentUrl = "";
  clearBtn.style.display = "none";
  inputHint.textContent = "Tip: include https:// for the best results.";
  inputHint.style.color = "";
  urlInput.focus();
  document.querySelector(".generator-card").scrollIntoView({ behavior: "smooth", block: "center" });
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}
