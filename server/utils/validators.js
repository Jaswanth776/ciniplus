const { ALLOWED_LANGUAGES } = require("../config/constants");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isAllowedLanguage = (language) => ALLOWED_LANGUAGES.includes(language);

module.exports = {
  isValidEmail,
  isAllowedLanguage
};
