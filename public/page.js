import { applyTranslations, setupLanguageSelector } from "./i18n.js";

applyTranslations();
setupLanguageSelector();

window.addEventListener("languagechange", applyTranslations);
