import { applyTranslations, formatPrice, getCurrentLanguage, getPlanCopy, setupLanguageSelector, t } from "./i18n.js";

const plansGrid = document.querySelector("#plansGrid");
const demoNotice = document.querySelector("#demoNotice");
const checkoutModal = document.querySelector("#checkoutModal");
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutButton = document.querySelector("#checkoutButton");
const modalPlan = document.querySelector("#modalPlan");
const checkoutIdentity = document.querySelector("#checkoutIdentity");
const accountButton = document.querySelector("#accountButton");
const authModal = document.querySelector("#authModal");
const accountModal = document.querySelector("#accountModal");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const authError = document.querySelector("#authError");
const accountSummary = document.querySelector("#accountSummary");
const accountOrders = document.querySelector("#accountOrders");
const logoutButton = document.querySelector("#logoutButton");

let selectedPlan = null;
let pendingPlan = null;
let availablePlans = [];
let currentUser = null;

applyTranslations();
setupLanguageSelector();
loadSession();
loadPlans();

window.addEventListener("languagechange", () => {
  applyTranslations();
  renderPlans(availablePlans);
  updateAccountButton();
  if (selectedPlan) {
    updateCheckoutSummary();
  }
  if (!accountModal.hidden) {
    openAccountModal();
  }
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeCheckoutModal);
});

document.querySelectorAll("[data-close-auth]").forEach((element) => {
  element.addEventListener("click", closeAuthModal);
});

document.querySelectorAll("[data-close-account]").forEach((element) => {
  element.addEventListener("click", closeAccountModal);
});

document.querySelectorAll("[data-auth-mode]").forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCheckoutModal();
    closeAuthModal();
    closeAccountModal();
  }
});

accountButton.addEventListener("click", () => {
  if (currentUser) {
    openAccountModal();
  } else {
    openAuthModal();
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
      credentials: "same-origin",
      body: JSON.stringify({
        planId: selectedPlan.id,
        language: getCurrentLanguage()
      })
    });

    const payload = await response.json();

    if (response.status === 401) {
      pendingPlan = selectedPlan;
      closeCheckoutModal();
      openAuthModal();
      return;
    }

    if (!response.ok) {
      throw new Error(payload.error || t("checkoutStartError"));
    }

    window.location.href = payload.checkoutUrl;
  } catch (error) {
    checkoutButton.textContent = error.message;
    setTimeout(() => setCheckoutBusy(false), 2200);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(loginForm);
  await submitAuth("/api/auth/login", {
    email: form.get("email"),
    password: form.get("password")
  });
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(registerForm);
  await submitAuth("/api/auth/register", {
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password")
  });
});

logoutButton.addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
  currentUser = null;
  updateAccountButton();
  closeAccountModal();
});

async function loadSession() {
  try {
    const response = await fetch("/api/auth/me", { credentials: "same-origin" });
    const payload = await response.json();
    currentUser = payload.user;
    updateAccountButton();
  } catch {
    currentUser = null;
    updateAccountButton();
  }
}

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
          ${copy.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}
        </ul>
        <button class="button primary" type="button" data-plan-id="${escapeHtml(plan.id)}">${escapeHtml(t("buyPlan", { plan: copy.name }))}</button>
      </article>
    `;
  }).join("");

  plansGrid.querySelectorAll("[data-plan-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = plans.find((candidate) => candidate.id === button.dataset.planId);
      startPurchase(plan);
    });
  });
}

function startPurchase(plan) {
  selectedPlan = plan;
  if (!currentUser) {
    pendingPlan = plan;
    openAuthModal();
    return;
  }

  openCheckoutModal();
}

function openCheckoutModal() {
  if (!selectedPlan || !currentUser) {
    return;
  }

  updateCheckoutSummary();
  checkoutModal.hidden = false;
}

function updateCheckoutSummary() {
  const copy = getPlanCopy(selectedPlan.id);
  modalPlan.textContent = t("modalPlanSummary", {
    plan: copy.name,
    price: formatPrice(selectedPlan.priceCents, selectedPlan.currency),
    quota: copy.quota
  });
  checkoutIdentity.textContent = t("signedInAs", { email: currentUser.email });
}

function closeCheckoutModal() {
  checkoutModal.hidden = true;
  selectedPlan = null;
  setCheckoutBusy(false);
}

function openAuthModal() {
  authError.hidden = true;
  authError.textContent = "";
  authModal.hidden = false;
}

function closeAuthModal() {
  authModal.hidden = true;
}

async function openAccountModal() {
  if (!currentUser) {
    openAuthModal();
    return;
  }

  accountSummary.innerHTML = `
    <strong>${escapeHtml(currentUser.name)}</strong>
    <span>${escapeHtml(currentUser.email)}</span>
  `;
  accountOrders.innerHTML = `<div class="account-empty">${escapeHtml(t("loadingPurchases"))}</div>`;
  accountModal.hidden = false;

  try {
    const response = await fetch("/api/account/orders", { credentials: "same-origin" });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || t("ordersLoadError"));
    }
    renderAccountOrders(payload.orders);
  } catch (error) {
    accountOrders.innerHTML = `<div class="account-empty">${escapeHtml(error.message)}</div>`;
  }
}

function closeAccountModal() {
  accountModal.hidden = true;
}

function renderAccountOrders(orders) {
  if (!orders.length) {
    accountOrders.innerHTML = `<div class="account-empty">${escapeHtml(t("noPurchases"))}</div>`;
    return;
  }

  accountOrders.innerHTML = orders.map((order) => {
    const copy = getPlanCopy(order.planId);
    return `
      <article class="account-order">
        <div>
          <strong>${escapeHtml(copy.name)}</strong>
          <span>${escapeHtml(new Date(order.createdAt).toLocaleDateString())} · ${escapeHtml(copy.quota)}</span>
        </div>
        <code>${escapeHtml(order.apiKey)}</code>
      </article>
    `;
  }).join("");
}

async function submitAuth(path, body) {
  authError.hidden = true;
  authError.textContent = "";

  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body)
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || t("authError"));
    }

    currentUser = payload.user;
    updateAccountButton();
    closeAuthModal();

    if (pendingPlan) {
      selectedPlan = pendingPlan;
      pendingPlan = null;
      openCheckoutModal();
    }
  } catch (error) {
    authError.textContent = error.message;
    authError.hidden = false;
  }
}

function setAuthMode(mode) {
  const isRegister = mode === "register";
  loginForm.hidden = isRegister;
  registerForm.hidden = !isRegister;
  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === mode);
  });
}

function updateAccountButton() {
  accountButton.textContent = currentUser ? t("myAccount") : t("signIn");
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
