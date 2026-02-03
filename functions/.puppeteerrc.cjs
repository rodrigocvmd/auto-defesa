const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  // Skip chromium download during install to save space/time in Cloud Functions
  // We will need to figure out a way to run chrome, or this will fail at runtime.
  // But first we want to fix the Deployment Healthcheck.
  skipDownload: true, 
};
