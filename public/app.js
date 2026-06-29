import { applyTranslations, formatPrice, getCurrentLanguage, getPlanCopy, setupLanguageSelector, t } from "./i18n.js";

const plansGrid = document.querySelector("#plansGrid");
const demoNotice = document.querySelector("#demoNotice");
const modal = document.querySelector("#checkoutModal");
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutButton = document.querySelector("#checkoutButton");
const modalPlan = document.querySelector("#modalPlan");
const emailInput = document.querySelector("#email");

let selectedPlan = null;
let availablePlans = [];

applyTranslations();
setupLanguageSelector();
loadPlans();

window.addEventListener("languagechange", () => {
  applyTranslations();
  renderPlans(availablePlans);
  if (selectedPlan) {
    updateModalSummary();
  }
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedPlan) {
    return;
  }

  setCheckoutBusy(true);

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: selectedPlan.id,
        email: emailInput.value,
        language: getCurrentLanguage()
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || t("checkoutStartError"));
    }

    window.location.href = payload.checkoutUrl;
  } catch (error) {
    checkoutButton.textContent = error.message;
    setTimeout(() => setCheckoutBusy(false), 2200);
  }
});

async function loadPlans() {
  try {
    const response = await fetch("/api/plans");
    const payload = await response.json();

    if (!response.ok) {
      throw new Error("Plans could not be loaded.");
    }

    demoNotice.hidden = !payload.demoCheckout;
    availablePlans = payload.plans;
    renderPlans(availablePlans);
  } catch {
    plansGrid.innerHTML = `<div class="loading-card">${escapeHtml(t("plansUnavailable"))}</div>`;
  }
}

function renderPlans(plans) {
  if (!plans.length) {
    plansGrid.innerHTML = `<div class="loading-card">${escapeHtml(t("loadingPlans"))}</div>`;
    return;
  }

  plansGrid.innerHTML = plans.map((plan) => {
    const featured = plan.id === "growth";
    const copy = getPlanCopy(plan.id);
    const features = copy.features;

    return `
      <article class="plan-card ${featured ? "featured" : ""}">
        <span class="plan-kicker">${featured ? escapeHtml(t("mostPopular")) : escapeHtml(t("apiAccess"))}</span>
        <h3>${escapeHtml(copy.name)}</h3>
        <p class="plan-description">${escapeHtml(copy.description)}</p>
        <div class="price">
          <strong>${formatPrice(plan.priceCents, plan.currency)}</strong>
          <span>${escapeHtml(t("oneTime"))}</span>
        </div>
        <p class="quota">${escapeHtml(copy.quota)}</p>
        <ul>
          ${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}
        </ul>
        <button class="button primary" type="button" data-plan-id="${escapeHtml(plan.id)}">${escapeHtml(t("buyPlan", { plan: copy.name }))}</button>
      </article>
    `;
  }).join("");

  plansGrid.querySelectorAll("[data-plan-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlan = plans.find((plan) => plan.id === button.dataset.planId);
      openModal();
    });
  });
}

function openModal() {
  if (!selectedPlan) {
    return;
  }

  updateModalSummary();
  modal.hidden = false;
  emailInput.focus();
}

function updateModalSummary() {
  const copy = getPlanCopy(selectedPlan.id);
  modalPlan.textContent = t("modalPlanSummary", {
    plan: copy.name,
    price: formatPrice(selectedPlan.priceCents, selectedPlan.currency),
    quota: copy.quota
  });
}

function closeModal() {
  modal.hidden = true;
  selectedPlan = null;
  setCheckoutBusy(false);
}

function setCheckoutBusy(isBusy) {
  checkoutButton.disabled = isBusy;
  checkoutButton.textContent = isBusy ? t("startingCheckout") : t("continuePayment");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
