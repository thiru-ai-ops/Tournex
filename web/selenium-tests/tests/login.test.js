const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Tournex Login E2E Flow', function () {
  let driver;
  // Use local dev server by default, override via env variable in CI
  const testUrl = process.env.TEST_URL || 'http://localhost:3000';

  before(async function () {
    const options = new chrome.Options();
    
    // Check if running in headless environment (e.g. GitHub Actions)
    if (process.env.HEADLESS === 'true') {
      options.addArguments('--headless');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
    }

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should load landing page, navigate to login, and authenticate successfully', async function () {
    // 1. Open the application
    await driver.get(testUrl);

    // 2. Wait for landing page to render
    await driver.wait(until.elementLocated(By.id('landing-view-viewport')), 10000);

    // 3. Click "Log In" to open the form modal
    const loginNavBtn = await driver.findElement(By.id('go-to-login'));
    await loginNavBtn.click();

    // 4. Wait for the inputs to appear
    const emailInput = await driver.wait(until.elementLocated(By.id('email')), 5000);
    const passwordInput = await driver.findElement(By.id('password'));

    // 5. Enter sandbox login credentials (password needs to be >= 5 chars)
    await emailInput.sendKeys('test.user@tournex.com');
    await passwordInput.sendKeys('pass123');

    // 6. Click the login submission button
    const submitBtn = await driver.findElement(By.id('login-button'));
    await submitBtn.click();

    // 7. Verify the main app dashboard (applet-viewport) loaded successfully
    const appViewport = await driver.wait(until.elementLocated(By.id('applet-viewport')), 10000);
    assert.ok(appViewport, 'The applet viewport was not loaded successfully after login.');
  });
});
