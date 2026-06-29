import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const dataDir = path.join(rootDir, "data");
const orderFile = path.join(dataDir, "orders.json");
const userFile = path.join(dataDir, "users.json");
const sessionFile = path.join(dataDir, "sessions.json");

await loadEnv(path.join(rootDir, ".env"));
await fs.mkdir(dataDir, { recursive: true });
await ensureJsonFile(orderFile, []);
await ensureJsonFile(userFile, []);
await ensureJsonFile(sessionFile, []);

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "127.0.0.1";
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const DEMO_CHECKOUT = String(process.env.DEMO_CHECKOUT ?? (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes("replace_me"))).toLowerCase() === "true";
const ALLOWED_ORIGINS = new Set((process.env.ALLOWED_ORIGINS || BASE_URL).split(",").map((origin) => origin.trim()).filter(Boolean));
const SESSION_COOKIE = "kl_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const plans = {
  starter: {
    id: "starter",
    name: "Starter API Key",
    priceCents: 3900,
    currency: "usd",
    quota: "50,000 requests / month",
    description: "A profitable entry plan for prototypes, MVPs, and low-volume internal tools."
  },
  growth: {
    id: "growth",
    name: "Growth API Key",
    priceCents: 9900,
    currency: "usd",
    quota: "250,000 requests / month",
    description: "A stronger margin plan with priority routing and room for a growing product."
  },
  business: {
    id: "business",
    name: "Business API Key",
    priceCents: 29900,
    currency: "usd",
    quota: "1,000,000 requests / month",
    description: "Premium production access for teams that need scale, support, and reliability."
  }
};

const server = http.createServer(async (req, res) => {
  try {
    addSecurityHeaders(res);

    if (req.method === "OPTIONS") {
      setCors(req, res);
      res.writeHead(204).end();
      return;
    }

    const url = new URL(req.url || "/", BASE_URL);

    if (req.method === "GET" && url.pathname === "/health") {
      return sendJson(req, res, { ok: true, demoCheckout: DEMO_CHECKOUT });
    }

    if (req.method === "GET" && url.pathname === "/api/plans") {
      return sendJson(req, res, { plans: Object.values(plans), demoCheckout: DEMO_CHECKOUT });
    }

    if (req.method === "GET" && url.pathname === "/api/auth/me") {
      return getAuthMe(req, res);
    }

    if (req.method === "POST" && url.pathname === "/api/auth/register") {
      return registerUser(req, res);
    }

    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      return loginUser(req, res);
    }

    if (req.method === "POST" && url.pathname === "/api/auth/logout") {
      return logoutUser(req, res);
    }

    if (req.method === "GET" && url.pathname === "/api/account/orders") {
      return getAccountOrders(req, res);
    }

    if (req.method === "POST" && url.pathname === "/api/create-checkout-session") {
      return createCheckoutSession(req, res);
    }

    if (req.method === "GET" && url.pathname === "/api/order") {
      return getOrder(req, res, url);
    }

    if (req.method === "POST" && url.pathname === "/api/stripe/webhook") {
      return handleStripeWebhook(req, res);
    }

    return serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    return sendJson(req, res, { error: "Something went wrong." }, 500);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`API Key Store running at ${BASE_URL}`);
  console.log(DEMO_CHECKOUT ? "Demo checkout is enabled." : "Stripe checkout is enabled.");
});

async function createCheckoutSession(req, res) {
  setCors(req, res);
  const user = await getCurrentUser(req);
  if (!user) {
    return sendJson(req, res, { error: "Sign in before checkout." }, 401);
  }

  const body = await readJsonBody(req);
  const plan = plans[body.planId];
  const stripeLocale = stripeLocaleForLanguage(body.language);

  if (!plan) {
    return sendJson(req, res, { error: "Choose a valid plan." }, 400);
  }

  if (DEMO_CHECKOUT) {
    const sessionId = `demo_${crypto.randomUUID()}`;
    const order = await fulfillOrder({
      sessionId,
      planId: plan.id,
      userId: user.id,
      email: user.email,
      paymentStatus: "paid",
      gateway: "demo"
    });

    return sendJson(req, res, {
      checkoutUrl: `${BASE_URL}/success.html?session_id=${encodeURIComponent(sessionId)}`,
      orderId: order.id,
      mode: "demo"
    });
  }

  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes("replace_me")) {
    return sendJson(req, res, { error: "Stripe is not configured on the server." }, 500);
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${BASE_URL}/cancel.html`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", plan.currency);
  params.set("line_items[0][price_data][unit_amount]", String(plan.priceCents));
  params.set("line_items[0][price_data][product_data][name]", plan.name);
  params.set("line_items[0][price_data][product_data][description]", `${plan.quota}. ${plan.description}`);
  params.set("metadata[planId]", plan.id);
  params.set("metadata[userId]", user.id);
  params.set("customer_email", user.email);

  if (stripeLocale) {
    params.set("locale", stripeLocale);
  }

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const stripePayload = await stripeRes.json();

  if (!stripeRes.ok) {
    console.error(stripePayload);
    return sendJson(req, res, { error: stripePayload.error?.message || "Stripe checkout failed." }, 502);
  }

  return sendJson(req, res, { checkoutUrl: stripePayload.url, mode: "stripe" });
}

async function getOrder(req, res, url) {
  setCors(req, res);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return sendJson(req, res, { error: "Missing session_id." }, 400);
  }

  let order = await findOrderBySession(sessionId);

  if (!order && !sessionId.startsWith("demo_")) {
    const session = await retrieveStripeSession(sessionId);
    if (session?.payment_status === "paid") {
      order = await fulfillOrder({
        sessionId: session.id,
        planId: session.metadata?.planId,
        userId: session.metadata?.userId,
        email: session.customer_details?.email || session.customer_email || "",
        paymentStatus: session.payment_status,
        gateway: "stripe"
      });
    }
  }

  if (!order) {
    return sendJson(req, res, { status: "pending" }, 202);
  }

  return sendJson(req, res, {
    status: "paid",
    order: {
      id: order.id,
      planId: order.planId,
      planName: plans[order.planId]?.name || order.planId,
      email: order.email,
      apiKey: order.apiKey,
      createdAt: order.createdAt,
      quota: plans[order.planId]?.quota
    }
  });
}

async function handleStripeWebhook(req, res) {
  const payload = await readRawBody(req);
  const signature = req.headers["stripe-signature"];

  if (!STRIPE_WEBHOOK_SECRET || STRIPE_WEBHOOK_SECRET.includes("replace_me")) {
    return sendJson(req, res, { error: "Webhook secret is not configured." }, 500);
  }

  if (!verifyStripeSignature(payload, signature, STRIPE_WEBHOOK_SECRET)) {
    return sendJson(req, res, { error: "Invalid Stripe signature." }, 400);
  }

  const event = JSON.parse(payload.toString("utf8"));

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      await fulfillOrder({
        sessionId: session.id,
        planId: session.metadata?.planId,
        userId: session.metadata?.userId,
        email: session.customer_details?.email || session.customer_email || "",
        paymentStatus: session.payment_status,
        gateway: "stripe"
      });
    }
  }

  return sendJson(req, res, { received: true });
}

async function fulfillOrder({ sessionId, planId, userId, email, paymentStatus, gateway }) {
  if (!plans[planId]) {
    throw new Error(`Cannot fulfill unknown plan: ${planId}`);
  }

  const orders = await readOrders();
  const existing = orders.find((order) => order.sessionId === sessionId);

  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const order = {
    id: `ord_${crypto.randomUUID()}`,
    sessionId,
    planId,
    userId: userId || "",
    email,
    paymentStatus,
    gateway,
    apiKey: generateApiKey(planId),
    createdAt: now,
    updatedAt: now
  };

  orders.push(order);
  await fs.writeFile(orderFile, JSON.stringify(orders, null, 2));
  return order;
}

async function getAuthMe(req, res) {
  const user = await getCurrentUser(req);
  return sendJson(req, res, { user: user ? publicUser(user) : null });
}

async function registerUser(req, res) {
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  const name = normalizeName(body.name);
  const password = typeof body.password === "string" ? body.password : "";

  if (!name) {
    return sendJson(req, res, { error: "Enter your name." }, 400);
  }

  if (!email) {
    return sendJson(req, res, { error: "Enter a valid email." }, 400);
  }

  if (password.length < 8) {
    return sendJson(req, res, { error: "Use at least 8 characters for your password." }, 400);
  }

  const users = await readUsers();
  if (users.some((user) => user.email === email)) {
    return sendJson(req, res, { error: "An account already exists for this email." }, 409);
  }

  const now = new Date().toISOString();
  const user = {
    id: `usr_${crypto.randomUUID()}`,
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: now,
    updatedAt: now
  };

  users.push(user);
  await fs.writeFile(userFile, JSON.stringify(users, null, 2));
  await createSession(res, user.id);
  return sendJson(req, res, { user: publicUser(user) }, 201);
}

async function loginUser(req, res) {
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";
  const users = await readUsers();
  const user = users.find((candidate) => candidate.email === email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return sendJson(req, res, { error: "Email or password is incorrect." }, 401);
  }

  await createSession(res, user.id);
  return sendJson(req, res, { user: publicUser(user) });
}

async function logoutUser(req, res) {
  const token = parseCookies(req.headers.cookie || "")[SESSION_COOKIE];
  if (token) {
    const sessions = await readSessions();
    await fs.writeFile(sessionFile, JSON.stringify(sessions.filter((session) => session.token !== token), null, 2));
  }

  clearSessionCookie(res);
  return sendJson(req, res, { ok: true });
}

async function getAccountOrders(req, res) {
  const user = await getCurrentUser(req);
  if (!user) {
    return sendJson(req, res, { error: "Sign in to view your account." }, 401);
  }

  const orders = await readOrders();
  const accountOrders = orders
    .filter((order) => order.userId === user.id || (!order.userId && order.email === user.email))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((order) => ({
      id: order.id,
      planId: order.planId,
      planName: plans[order.planId]?.name || order.planId,
      quota: plans[order.planId]?.quota,
      apiKey: order.apiKey,
      paymentStatus: order.paymentStatus,
      gateway: order.gateway,
      createdAt: order.createdAt
    }));

  return sendJson(req, res, { orders: accountOrders });
}

async function retrieveStripeSession(sessionId) {
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes("replace_me")) {
    return null;
  }

  const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`
    }
  });

  if (!stripeRes.ok) {
    return null;
  }

  return stripeRes.json();
}

function verifyStripeSignature(payload, signatureHeader, secret) {
  if (!signatureHeader) {
    return false;
  }

  const parts = Object.fromEntries(signatureHeader.split(",").map((part) => {
    const [key, ...value] = part.split("=");
    return [key, value.join("=")];
  }));
  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature || !/^[a-f0-9]+$/i.test(signature)) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload.toString("utf8")}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
}

async function serveStatic(req, res, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const normalized = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, normalized);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) {
      res.writeHead(404).end("Not found");
      return;
    }

    const content = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType(filePath), "Cache-Control": cacheHeader(filePath) });
    res.end(content);
  } catch {
    const notFound = await fs.readFile(path.join(publicDir, "404.html")).catch(() => Buffer.from("Not found"));
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(notFound);
  }
}

async function readOrders() {
  return JSON.parse(await fs.readFile(orderFile, "utf8"));
}

async function readUsers() {
  return JSON.parse(await fs.readFile(userFile, "utf8"));
}

async function readSessions() {
  return JSON.parse(await fs.readFile(sessionFile, "utf8"));
}

async function findOrderBySession(sessionId) {
  const orders = await readOrders();
  return orders.find((order) => order.sessionId === sessionId);
}

function generateApiKey(planId) {
  const prefix = planId.slice(0, 3).toUpperCase();
  return `ak_${prefix}_${crypto.randomBytes(24).toString("base64url")}`;
}

function normalizeEmail(email) {
  if (typeof email !== "string") {
    return "";
  }

  const trimmed = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : "";
}

function normalizeName(name) {
  if (typeof name !== "string") {
    return "";
  }

  return name.trim().replace(/\s+/g, " ").slice(0, 80);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.scryptSync(password, salt, 64).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  const [algorithm, salt, hash] = String(storedHash).split("$");
  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "base64url");
  const actual = crypto.scryptSync(password, salt, 64);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

async function getCurrentUser(req) {
  const token = parseCookies(req.headers.cookie || "")[SESSION_COOKIE];
  if (!token) {
    return null;
  }

  const sessions = await readSessions();
  const now = Date.now();
  const session = sessions.find((candidate) => candidate.token === token && Date.parse(candidate.expiresAt) > now);
  if (!session) {
    return null;
  }

  const users = await readUsers();
  return users.find((user) => user.id === session.userId) || null;
}

async function createSession(res, userId) {
  const sessions = await readSessions();
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();
  sessions.push({ token, userId, createdAt: new Date().toISOString(), expiresAt });
  await fs.writeFile(sessionFile, JSON.stringify(sessions, null, 2));
  setSessionCookie(res, token);
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

function parseCookies(cookieHeader) {
  return Object.fromEntries(cookieHeader.split(";").map((cookie) => {
    const [name, ...value] = cookie.trim().split("=");
    return [name, decodeURIComponent(value.join("=") || "")];
  }).filter(([name]) => name));
}

function setSessionCookie(res, token) {
  const secure = BASE_URL.startsWith("https://") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`);
}

function clearSessionCookie(res) {
  const secure = BASE_URL.startsWith("https://") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`);
}

function stripeLocaleForLanguage(language) {
  return {
    en: "en",
    "zh-CN": "zh",
    "zh-TW": "zh-TW"
  }[language] || "auto";
}

async function readJsonBody(req) {
  const raw = await readRawBody(req);
  if (!raw.length) {
    return {};
  }

  try {
    return JSON.parse(raw.toString("utf8"));
  } catch {
    return {};
  }
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function sendJson(req, res, payload, status = 200) {
  setCors(req, res);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Stripe-Signature");
}

function addSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml"
  }[ext] || "application/octet-stream";
}

function cacheHeader(filePath) {
  return filePath.includes(`${path.sep}assets${path.sep}`) ? "public, max-age=86400" : "no-store";
}

async function ensureJsonFile(filePath, fallback) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2));
  }
}

async function loadEnv(envPath) {
  try {
    const raw = await fs.readFile(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split("=");
      if (!process.env[key]) {
        process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // .env is optional; .env.example documents supported values.
  }
}
