export const languages = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文"
};

const defaultLanguage = "en";

const dictionaries = {
  en: {
    pageTitleHome: "KeyLaunch API Access",
    pageTitleSuccess: "Payment Complete | KeyLaunch",
    pageTitleCancel: "Checkout Canceled | KeyLaunch",
    pageTitle404: "Page Not Found | KeyLaunch",
    languageLabel: "Language",
    navPlans: "Plans",
    navSecurity: "Security",
    navFaq: "FAQ",
    buyAccess: "Buy access",
    heroAlt: "Developer dashboard showing secure API and checkout panels",
    heroEyebrow: "Secure API key checkout",
    heroTitle: "KeyLaunch API Access",
    heroCopy: "Sell production-ready API keys through hosted payment, then issue credentials automatically after checkout succeeds.",
    choosePlan: "Choose a plan",
    viewFlow: "View flow",
    highlightsLabel: "Store highlights",
    hostedCheckoutTitle: "Hosted checkout",
    hostedCheckoutCopy: "Stripe keeps card handling off your server.",
    automaticKeysTitle: "Automatic keys",
    automaticKeysCopy: "Paid sessions create unique API keys.",
    webhookReadyTitle: "Webhook ready",
    webhookReadyCopy: "Fulfillment runs when payment is confirmed.",
    plansEyebrow: "Plans",
    plansTitle: "Pick the key that fits your traffic.",
    demoNotice: "Demo checkout is enabled. You can test the full flow without charging a card.",
    loadingPlans: "Loading plans...",
    plansUnavailable: "Plans are unavailable right now.",
    paymentFlowEyebrow: "Payment flow",
    securityTitle: "A safer checkout path for selling access.",
    securityCopy: "Customers never type card details into your server. They choose a plan, pay through the gateway, and return to a verified success page where their key is created.",
    stepOneTitle: "Customer selects a plan",
    stepOneCopy: "The storefront posts the selected plan to your backend.",
    stepTwoTitle: "Stripe hosts payment",
    stepTwoCopy: "The backend creates a Checkout Session and redirects the customer.",
    stepThreeTitle: "Key is issued after payment",
    stepThreeCopy: "The success page and webhook both verify payment before fulfillment.",
    faqEyebrow: "FAQ",
    faqTitle: "Ready for the common questions.",
    faqStorageTitle: "Where are API keys stored?",
    faqStorageCopy: "This starter stores orders in local JSON for development. For production, move orders and keys to a database with encryption at rest.",
    faqEmailTitle: "Can keys be emailed?",
    faqEmailCopy: "Yes. Add a transactional email provider after the webhook fulfillment step to send keys and receipts.",
    faqSubscriptionTitle: "Can this handle subscriptions?",
    faqSubscriptionCopy: "The current starter sells one-time access. Stripe subscriptions can be added by switching Checkout mode and mapping plans to recurring prices.",
    checkoutCloseLabel: "Close checkout",
    checkoutEyebrow: "Checkout",
    checkoutTitle: "Complete your API access purchase",
    customerEmail: "Customer email",
    emailPlaceholder: "you@example.com",
    continuePayment: "Continue to payment",
    startingCheckout: "Starting checkout...",
    checkoutStartError: "Checkout could not be started.",
    formNote: "The key is shown after payment succeeds. In production, also email it from the webhook.",
    footerCopy: "Built for hosted payments and automatic key delivery.",
    mostPopular: "Most popular",
    apiAccess: "API access",
    oneTime: "one-time",
    buyPlan: "Buy {plan}",
    modalPlanSummary: "{plan} - {price} one-time - {quota}",
    copied: "Copied",
    copy: "Copy",
    successEyebrow: "Payment complete",
    successTitle: "Your API key is ready.",
    verifyingSession: "Verifying your checkout session...",
    apiKeyLabel: "API key",
    backToStore: "Back to store",
    missingSession: "This success link is missing a checkout session.",
    pendingPayment: "Payment is still being confirmed. Refresh this page in a moment.",
    orderLoadError: "Order could not be loaded.",
    issuedFor: "Thanks. {plan} has been issued for {email}.",
    planLabel: "Plan",
    quotaLabel: "Quota",
    orderLabel: "Order",
    included: "Included",
    cancelEyebrow: "Checkout canceled",
    cancelTitle: "No payment was taken.",
    cancelCopy: "You can return to the plans and choose an API key whenever you are ready.",
    viewPlans: "View plans",
    signIn: "Sign in",
    createAccount: "Create account",
    myAccount: "My account",
    signOut: "Sign out",
    accountEyebrow: "Account",
    accountTitle: "Sign in or create your account",
    closeAccount: "Close account window",
    password: "Password",
    fullName: "Full name",
    passwordHint: "Use at least 8 characters.",
    signedInAs: "Signed in as {email}",
    savedPurchases: "Saved purchases",
    loadingPurchases: "Loading purchases...",
    noPurchases: "No purchases yet.",
    ordersLoadError: "Purchases could not be loaded.",
    authError: "Account request failed.",
    notFoundTitle: "Page not found.",
    notFoundCopy: "The page you requested does not exist."
  },
  "zh-CN": {
    pageTitleHome: "KeyLaunch API 访问",
    pageTitleSuccess: "付款完成 | KeyLaunch",
    pageTitleCancel: "结账已取消 | KeyLaunch",
    pageTitle404: "页面未找到 | KeyLaunch",
    languageLabel: "语言",
    navPlans: "套餐",
    navSecurity: "安全",
    navFaq: "常见问题",
    buyAccess: "购买访问权限",
    heroAlt: "显示安全 API 和结账面板的开发者仪表盘",
    heroEyebrow: "安全的 API 密钥结账",
    heroTitle: "KeyLaunch API 访问",
    heroCopy: "通过托管支付销售可用于生产环境的 API 密钥，并在结账成功后自动发放凭证。",
    choosePlan: "选择套餐",
    viewFlow: "查看流程",
    highlightsLabel: "商店亮点",
    hostedCheckoutTitle: "托管结账",
    hostedCheckoutCopy: "Stripe 负责处理银行卡信息，你的服务器无需接触卡数据。",
    automaticKeysTitle: "自动发放密钥",
    automaticKeysCopy: "付款成功后创建唯一 API 密钥。",
    webhookReadyTitle: "Webhook 就绪",
    webhookReadyCopy: "付款确认后自动完成交付。",
    plansEyebrow: "套餐",
    plansTitle: "选择适合你流量的 API 密钥。",
    demoNotice: "演示结账已开启。你可以测试完整流程，不会真实扣款。",
    loadingPlans: "正在加载套餐...",
    plansUnavailable: "暂时无法加载套餐。",
    paymentFlowEyebrow: "支付流程",
    securityTitle: "更安全的访问权限销售流程。",
    securityCopy: "客户不会在你的服务器输入银行卡信息。他们选择套餐，通过支付网关付款，然后回到已验证的成功页面领取密钥。",
    stepOneTitle: "客户选择套餐",
    stepOneCopy: "前端会把所选套餐发送到你的后端。",
    stepTwoTitle: "Stripe 托管支付",
    stepTwoCopy: "后端创建 Checkout Session 并将客户重定向到支付页面。",
    stepThreeTitle: "付款后发放密钥",
    stepThreeCopy: "成功页和 webhook 都会在交付前验证付款状态。",
    faqEyebrow: "常见问题",
    faqTitle: "回答客户最关心的问题。",
    faqStorageTitle: "API 密钥存在哪里？",
    faqStorageCopy: "此 starter 在开发环境中使用本地 JSON 保存订单。生产环境应迁移到数据库，并对订单和密钥进行静态加密。",
    faqEmailTitle: "可以通过邮件发送密钥吗？",
    faqEmailCopy: "可以。在 webhook 交付步骤后接入交易邮件服务，用于发送密钥和收据。",
    faqSubscriptionTitle: "可以做订阅制吗？",
    faqSubscriptionCopy: "当前 starter 销售一次性访问权限。你可以切换 Checkout 模式，并把套餐映射到 Stripe recurring price 来支持订阅。",
    checkoutCloseLabel: "关闭结账窗口",
    checkoutEyebrow: "结账",
    checkoutTitle: "完成 API 访问权限购买",
    customerEmail: "客户邮箱",
    emailPlaceholder: "you@example.com",
    continuePayment: "继续支付",
    startingCheckout: "正在进入结账...",
    checkoutStartError: "无法开始结账。",
    formNote: "付款成功后会显示密钥。生产环境中也建议通过 webhook 发送邮件。",
    footerCopy: "为托管支付和自动密钥交付而构建。",
    mostPopular: "最受欢迎",
    apiAccess: "API 访问",
    oneTime: "一次性",
    buyPlan: "购买{plan}",
    modalPlanSummary: "{plan} - {price} 一次性 - {quota}",
    copied: "已复制",
    copy: "复制",
    successEyebrow: "付款完成",
    successTitle: "你的 API 密钥已准备好。",
    verifyingSession: "正在验证你的结账会话...",
    apiKeyLabel: "API 密钥",
    backToStore: "返回商店",
    missingSession: "此成功链接缺少结账会话。",
    pendingPayment: "付款仍在确认中。请稍后刷新此页面。",
    orderLoadError: "无法加载订单。",
    issuedFor: "谢谢。已为 {email} 发放 {plan}。",
    planLabel: "套餐",
    quotaLabel: "额度",
    orderLabel: "订单",
    included: "已包含",
    cancelEyebrow: "结账已取消",
    cancelTitle: "未收取任何款项。",
    cancelCopy: "你可以返回套餐页面，随时选择 API 密钥。",
    viewPlans: "查看套餐",
    signIn: "登录",
    createAccount: "创建账户",
    myAccount: "我的账户",
    signOut: "退出登录",
    accountEyebrow: "账户",
    accountTitle: "登录或创建你的账户",
    closeAccount: "关闭账户窗口",
    password: "密码",
    fullName: "姓名",
    passwordHint: "请至少使用 8 个字符。",
    signedInAs: "已登录：{email}",
    savedPurchases: "已保存的购买记录",
    loadingPurchases: "正在加载购买记录...",
    noPurchases: "暂无购买记录。",
    ordersLoadError: "无法加载购买记录。",
    authError: "账户请求失败。",
    notFoundTitle: "页面未找到。",
    notFoundCopy: "你请求的页面不存在。"
  },
  "zh-TW": {
    pageTitleHome: "KeyLaunch API 存取",
    pageTitleSuccess: "付款完成 | KeyLaunch",
    pageTitleCancel: "結帳已取消 | KeyLaunch",
    pageTitle404: "找不到頁面 | KeyLaunch",
    languageLabel: "語言",
    navPlans: "方案",
    navSecurity: "安全",
    navFaq: "常見問題",
    buyAccess: "購買存取權",
    heroAlt: "顯示安全 API 與結帳面板的開發者儀表板",
    heroEyebrow: "安全的 API 金鑰結帳",
    heroTitle: "KeyLaunch API 存取",
    heroCopy: "透過託管支付銷售可用於正式環境的 API 金鑰，並在結帳成功後自動發放憑證。",
    choosePlan: "選擇方案",
    viewFlow: "查看流程",
    highlightsLabel: "商店亮點",
    hostedCheckoutTitle: "託管結帳",
    hostedCheckoutCopy: "Stripe 負責處理信用卡資料，你的伺服器不需要接觸卡片資訊。",
    automaticKeysTitle: "自動發放金鑰",
    automaticKeysCopy: "付款成功後建立唯一 API 金鑰。",
    webhookReadyTitle: "Webhook 就緒",
    webhookReadyCopy: "付款確認後自動完成交付。",
    plansEyebrow: "方案",
    plansTitle: "選擇符合你流量需求的 API 金鑰。",
    demoNotice: "示範結帳已開啟。你可以測試完整流程，不會實際扣款。",
    loadingPlans: "正在載入方案...",
    plansUnavailable: "目前無法載入方案。",
    paymentFlowEyebrow: "付款流程",
    securityTitle: "更安全的存取權銷售流程。",
    securityCopy: "客戶不會在你的伺服器輸入信用卡資料。他們選擇方案，透過支付閘道付款，再回到已驗證的成功頁面領取金鑰。",
    stepOneTitle: "客戶選擇方案",
    stepOneCopy: "前端會把所選方案送到你的後端。",
    stepTwoTitle: "Stripe 託管付款",
    stepTwoCopy: "後端建立 Checkout Session 並將客戶重新導向至付款頁面。",
    stepThreeTitle: "付款後發放金鑰",
    stepThreeCopy: "成功頁與 webhook 都會在交付前驗證付款狀態。",
    faqEyebrow: "常見問題",
    faqTitle: "回答客戶最在意的問題。",
    faqStorageTitle: "API 金鑰存在哪裡？",
    faqStorageCopy: "此 starter 在開發環境中使用本機 JSON 儲存訂單。正式環境應改用資料庫，並對訂單與金鑰進行靜態加密。",
    faqEmailTitle: "可以透過 Email 發送金鑰嗎？",
    faqEmailCopy: "可以。在 webhook 交付步驟後接入交易郵件服務，用於寄送金鑰與收據。",
    faqSubscriptionTitle: "可以做訂閱制嗎？",
    faqSubscriptionCopy: "目前 starter 銷售一次性存取權。你可以切換 Checkout 模式，並把方案對應到 Stripe recurring price 來支援訂閱。",
    checkoutCloseLabel: "關閉結帳視窗",
    checkoutEyebrow: "結帳",
    checkoutTitle: "完成 API 存取權購買",
    customerEmail: "客戶 Email",
    emailPlaceholder: "you@example.com",
    continuePayment: "繼續付款",
    startingCheckout: "正在進入結帳...",
    checkoutStartError: "無法開始結帳。",
    formNote: "付款成功後會顯示金鑰。正式環境中也建議透過 webhook 寄送 Email。",
    footerCopy: "為託管支付與自動金鑰交付而打造。",
    mostPopular: "最受歡迎",
    apiAccess: "API 存取",
    oneTime: "一次性",
    buyPlan: "購買{plan}",
    modalPlanSummary: "{plan} - {price} 一次性 - {quota}",
    copied: "已複製",
    copy: "複製",
    successEyebrow: "付款完成",
    successTitle: "你的 API 金鑰已準備好。",
    verifyingSession: "正在驗證你的結帳工作階段...",
    apiKeyLabel: "API 金鑰",
    backToStore: "返回商店",
    missingSession: "此成功連結缺少結帳工作階段。",
    pendingPayment: "付款仍在確認中。請稍後重新整理此頁面。",
    orderLoadError: "無法載入訂單。",
    issuedFor: "謝謝。已為 {email} 發放 {plan}。",
    planLabel: "方案",
    quotaLabel: "額度",
    orderLabel: "訂單",
    included: "已包含",
    cancelEyebrow: "結帳已取消",
    cancelTitle: "未收取任何款項。",
    cancelCopy: "你可以返回方案頁面，隨時選擇 API 金鑰。",
    viewPlans: "查看方案",
    signIn: "登入",
    createAccount: "建立帳戶",
    myAccount: "我的帳戶",
    signOut: "登出",
    accountEyebrow: "帳戶",
    accountTitle: "登入或建立你的帳戶",
    closeAccount: "關閉帳戶視窗",
    password: "密碼",
    fullName: "姓名",
    passwordHint: "請至少使用 8 個字元。",
    signedInAs: "已登入：{email}",
    savedPurchases: "已儲存的購買紀錄",
    loadingPurchases: "正在載入購買紀錄...",
    noPurchases: "尚無購買紀錄。",
    ordersLoadError: "無法載入購買紀錄。",
    authError: "帳戶請求失敗。",
    notFoundTitle: "找不到頁面。",
    notFoundCopy: "你要求的頁面不存在。"
  }
};

export const planCopy = {
  en: {
    starter: {
      name: "Starter API Key",
      description: "A profitable entry plan for prototypes, MVPs, and low-volume internal tools.",
      quota: "50,000 requests / month",
      features: ["Instant API key delivery", "Healthy starter margin", "Community launch support"]
    },
    growth: {
      name: "Growth API Key",
      description: "A stronger margin plan with priority routing and room for a growing product.",
      quota: "250,000 requests / month",
      features: ["Instant API key delivery", "Priority usage limits", "Email support"]
    },
    business: {
      name: "Business API Key",
      description: "Premium production access for teams that need scale, support, and reliability.",
      quota: "1,000,000 requests / month",
      features: ["Instant API key delivery", "High request ceiling", "Priority support path"]
    }
  },
  "zh-CN": {
    starter: {
      name: "入门 API 密钥",
      description: "适合原型、MVP 和低流量内部工具的盈利入门套餐。",
      quota: "每月 50,000 次请求",
      features: ["即时发放 API 密钥", "保留健康利润空间", "社区级启动支持"]
    },
    growth: {
      name: "增长 API 密钥",
      description: "利润空间更强，带优先路由，适合正在增长的产品。",
      quota: "每月 250,000 次请求",
      features: ["即时发放 API 密钥", "优先使用额度", "邮件支持"]
    },
    business: {
      name: "商业 API 密钥",
      description: "面向团队的高级生产访问权限，提供规模、支持和可靠性。",
      quota: "每月 1,000,000 次请求",
      features: ["即时发放 API 密钥", "高请求额度", "优先支持通道"]
    }
  },
  "zh-TW": {
    starter: {
      name: "入門 API 金鑰",
      description: "適合原型、MVP 與低流量內部工具的獲利入門方案。",
      quota: "每月 50,000 次請求",
      features: ["即時發放 API 金鑰", "保留健康利潤空間", "社群級啟動支援"]
    },
    growth: {
      name: "成長 API 金鑰",
      description: "利潤空間更強，含優先路由，適合正在成長的產品。",
      quota: "每月 250,000 次請求",
      features: ["即時發放 API 金鑰", "優先使用額度", "Email 支援"]
    },
    business: {
      name: "商業 API 金鑰",
      description: "面向團隊的高階正式環境存取權，提供規模、支援與可靠性。",
      quota: "每月 1,000,000 次請求",
      features: ["即時發放 API 金鑰", "高請求額度", "優先支援通道"]
    }
  }
};

export function getCurrentLanguage() {
  const stored = localStorage.getItem("keylaunch-language");
  return dictionaries[stored] ? stored : defaultLanguage;
}

export function setLanguage(language) {
  const nextLanguage = dictionaries[language] ? language : defaultLanguage;
  localStorage.setItem("keylaunch-language", nextLanguage);
  applyTranslations();
  window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: nextLanguage } }));
}

export function t(key, replacements = {}) {
  const dictionary = dictionaries[getCurrentLanguage()] || dictionaries[defaultLanguage];
  const fallback = dictionaries[defaultLanguage][key] || key;
  let value = dictionary[key] || fallback;

  for (const [name, replacement] of Object.entries(replacements)) {
    value = value.replaceAll(`{${name}}`, replacement);
  }

  return value;
}

export function getPlanCopy(planId) {
  const language = getCurrentLanguage();
  return planCopy[language]?.[planId] || planCopy[defaultLanguage][planId];
}

export function setupLanguageSelector() {
  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = getCurrentLanguage();
    select.addEventListener("change", () => setLanguage(select.value));
  });
}

export function applyTranslations() {
  const language = getCurrentLanguage();
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.setAttribute("alt", t(element.dataset.i18nAlt));
  });

  const pageKey = document.body.dataset.pageTitle;
  if (pageKey) {
    document.title = t(pageKey);
  }

  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = language;
  });
}

export function formatPrice(cents, currency) {
  return new Intl.NumberFormat(localeForIntl(), {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(cents / 100);
}

function localeForIntl() {
  return {
    en: "en-US",
    "zh-CN": "zh-CN",
    "zh-TW": "zh-TW"
  }[getCurrentLanguage()] || "en-US";
}
