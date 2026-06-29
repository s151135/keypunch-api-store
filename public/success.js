import { applyTranslations, getPlanCopy, setupLanguageSelector, t } from "./i18n.js";

const statusText = document.querySelector("#statusText");
const keyBox = document.querySelector("#keyBox");
const apiKeyInput = document.querySelector("#apiKey");
const copyButton = document.querySelector("#copyButton");
const orderMeta = document.querySelector("#orderMeta");

const params = new URLSearchParams(window.location.search);
const sessionId = params.get("session_id");
let currentOrder = null;

applyTranslations();
setupLanguageSelector();

window.addEventListener("languagechange", () => {
  applyTranslations();
  if (currentOrder) {
    renderOrder(currentOrder);
  } else if (!sessionId) {
    statusText.textContent = t("missingSession");
  } else {
    statusText.textContent = t("verifyingSession");
  }
});

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(apiKeyInput.value);
  copyButton.textContent = t("copied");
  setTimeout(() => {
    copyButton.textContent = t("copy");
  }, 1800);
});

if (!sessionId) {
  statusText.textContent = t("missingSession");
} else {
  loadOrder(sessionId);
}

async function loadOrder(id) {
  try {
    const response = await fetch(`/api/order?session_id=${encodeURIComponent(id)}`);
    const payload = await response.json();

    if (response.status === 202) {
      statusText.textContent = t("pendingPayment");
      return;
    }

    if (!response.ok) {
      throw new Error(payload.error || t("orderLoadError"));
    }

    currentOrder = payload.order;
    renderOrder(currentOrder);
  } catch (error) {
    statusText.textContent = error.message;
  }
}

function renderOrder(order) {
  const copy = getPlanCopy(order.planId);
  statusText.textContent = t("issuedFor", { plan: copy.name, email: order.email });
  apiKeyInput.value = order.apiKey;
  orderMeta.innerHTML = `
    <dt>${escapeHtml(t("planLabel"))}</dt><dd>${escapeHtml(copy.name)}</dd>
    <dt>${escapeHtml(t("quotaLabel"))}</dt><dd>${escapeHtml(copy.quota || t("included"))}</dd>
    <dt>${escapeHtml(t("orderLabel"))}</dt><dd>${escapeHtml(order.id)}</dd>
  `;
  keyBox.hidden = false;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
