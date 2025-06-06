
const path = require("path");

require("dotenv").config();


module.exports = {
  ...(on, config) => {
    // Memuat file .env
    const envFile = path.resolve(__dirname, "../../.env");
    const envConfig = dotenv.config({ path: envFile }).parsed;

    // Menambahkan variabel lingkungan ke dalam konfigurasi Cypress
    config.env = { ...config.env, ...envConfig };

    return config;
  },

  e2e: {
    setupNodeEvents(on, config) {
      // kosong atau isi sesuai kebutuhan
    },
  },
  reporter: "mochawesome",
  reporterOptions: {
  reportDir: "cypress/reports/html",
  overwrite: true,
  html: true,
  json: true,
  },
  env: {
    AGODA_URL: process.env.AGODA_URL,
    AMAZON_URL: process.env.AMAZON_URL,
  },
  video: true,
};
