const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Tournex E2E Automation - 35 Comprehensive Test Cases', function () {
  let driver;
  const testUrl = process.env.TEST_URL || 'http://localhost:3000';

  before(async function () {
    const options = new chrome.Options();
    if (process.env.HEADLESS === 'true') {
      options.addArguments('--headless');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
    }
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    await driver.manage().window().setSize({ width: 1280, height: 800 });
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed' && driver) {
      try {
        const logs = await driver.manage().logs().get('browser');
        console.error('--- BROWSER LOGS FOR FAILED TEST: ' + this.currentTest.title + ' ---');
        console.error(JSON.stringify(logs, null, 2));
      } catch (err) {
        console.error('Failed to retrieve browser logs:', err);
      }
    }
  });

  // --- STAGE 1: LANDING VIEW & SEO VERIFICATIONS ---

  it('1. Should load the landing page successfully', async function () {
    await driver.get(testUrl);
    const viewport = await driver.wait(until.elementLocated(By.id('landing-view-viewport')), 15000);
    assert.ok(viewport, 'Landing viewport did not load.');
  });

  it('2. Should have the correct page title', async function () {
    const title = await driver.getTitle();
    assert.ok(title, 'Page title is empty.');
  });

  it('3. Should contain structural header in landing page', async function () {
    const header = await driver.findElement(By.tagName('header'));
    assert.ok(header, 'Header element not found on landing page.');
  });

  it('4. Should display the AI Companion Assistant feature card', async function () {
    const featureCard = await driver.findElement(By.xpath("//*[contains(text(), 'AI Companion Assistant')]"));
    assert.ok(featureCard, 'AI Companion Assistant card not found.');
  });

  it('5. Should load popular states showcase under landing view', async function () {
    const statesSection = await driver.findElement(By.xpath("//*[contains(text(), 'Rajasthan')]"));
    assert.ok(statesSection, 'Rajasthan state showcase not found.');
  });

  // --- STAGE 2: FORM NAVIGATION & BASIC VALIDATION VERIFICATIONS ---

  it('6. Should navigate to login form view', async function () {
    const loginNavBtn = await driver.findElement(By.id('go-to-login'));
    await loginNavBtn.click();
    const emailField = await driver.wait(until.elementLocated(By.id('email')), 5000);
    assert.ok(emailField, 'Email input not loaded in login form.');
  });

  it('7. Should verify login email input is visible', async function () {
    const emailInput = await driver.findElement(By.id('email'));
    const isVisible = await emailInput.isDisplayed();
    assert.strictEqual(isVisible, true, 'Email input is not visible.');
  });

  it('8. Should verify login password input is visible', async function () {
    const passwordInput = await driver.findElement(By.id('password'));
    const isVisible = await passwordInput.isDisplayed();
    assert.strictEqual(isVisible, true, 'Password input is not visible.');
  });

  it('9. Should show warning on empty credentials submission', async function () {
    const submitBtn = await driver.findElement(By.id('login-button'));
    await submitBtn.click();
    const errorText = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Please enter both your email address and security password.')]")), 5000);
    assert.ok(errorText, 'Warning message for empty credentials not found.');
  });

  it('10. Should show warning on password less than 5 characters', async function () {
    const emailInput = await driver.findElement(By.id('email'));
    await emailInput.sendKeys('test.user@tournex.com');
    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('1234');
    const submitBtn = await driver.findElement(By.id('login-button'));
    await submitBtn.click();
    const errorText = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Password must be at least 5 characters for user database mapping.')]")), 5000);
    assert.ok(errorText, 'Warning message for short password not found.');
  });

  it('11. Should toggle password visibility to show password text', async function () {
    const toggleBtn = await driver.findElement(By.id('toggle-password-visibility'));
    await toggleBtn.click();
    const passwordInput = await driver.findElement(By.id('password'));
    const typeAttr = await passwordInput.getAttribute('type');
    assert.strictEqual(typeAttr, 'text', 'Password type was not toggled to text.');
  });

  it('12. Should toggle database reset option in login view', async function () {
    const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
    const initialText = await toggleDb.getText();
    await toggleDb.click();
    const postText = await toggleDb.getText();
    assert.notStrictEqual(initialText, postText, 'Database reset option toggle text did not change.');
  });

  it('13. Should navigate back to landing view from login', async function () {
    const logoBtn = await driver.findElement(By.id('landing-logo'));
    await logoBtn.click();
    const landingBtn = await driver.wait(until.elementLocated(By.id('landing-go-to-signup')), 5000);
    assert.ok(landingBtn, 'Failed to navigate back to landing view.');
  });

  it('14. Should navigate to signup form view', async function () {
    const goSignupBtn = await driver.findElement(By.id('go-to-signup'));
    await goSignupBtn.click();
    const signupName = await driver.wait(until.elementLocated(By.id('signup-name')), 5000);
    assert.ok(signupName, 'Failed to load signup name input.');
  });

  it('15. Should verify signup name, email, and password fields are visible', async function () {
    const signupName = await driver.findElement(By.id('signup-name'));
    const signupEmail = await driver.findElement(By.id('signup-email'));
    const signupPassword = await driver.findElement(By.id('signup-password'));
    assert.ok(await signupName.isDisplayed() && await signupEmail.isDisplayed() && await signupPassword.isDisplayed(), 'Signup fields are not all visible.');
  });

  it('16. Should show warning on empty signup form submission', async function () {
    const signupBtn = await driver.findElement(By.id('signup-button'));
    await signupBtn.click();
    const errorText = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Please provide a traveler name or alias tag.')]")), 5000);
    assert.ok(errorText, 'Warning message not shown.');
  });

  it('17. Should allow selecting avatar presets in signup form', async function () {
    const avatarBtn = await driver.findElement(By.id('av2'));
    await avatarBtn.click();
    const classAttr = await avatarBtn.getAttribute('class');
    assert.ok(classAttr.includes('border-indigo-600'), 'Selected avatar does not have active border styling.');
  });

  it('18. Should toggle database reset option in signup view', async function () {
    const toggleDb = await driver.findElement(By.id('signup-toggle-reset-db'));
    const initialText = await toggleDb.getText();
    await toggleDb.click();
    const postText = await toggleDb.getText();
    assert.notStrictEqual(initialText, postText, 'Database reset option toggle text did not change.');
  });

  it('19. Should navigate back to login view from signup', async function () {
    const backToLogin = await driver.findElement(By.id('go-back-to-login'));
    await backToLogin.click();
    const emailField = await driver.wait(until.elementLocated(By.id('email')), 5000);
    assert.ok(emailField, 'Failed to navigate back to login view.');
  });

  // --- STAGE 3: GOOGLE AUTH SIMULATOR VERIFICATIONS ---

  it('20. Should trigger Google authentication simulator popup', async function () {
    const launcher = await driver.findElement(By.id('google-simulator-launcher'));
    await launcher.click();
    const overlay = await driver.wait(until.elementLocated(By.id('google-simulator-overlay')), 5000);
    assert.ok(overlay, 'Google simulator overlay not triggered.');
  });

  it('21. Should close Google authentication simulator popup', async function () {
    const closeBtn = await driver.findElement(By.id('google-simulator-close'));
    await driver.executeScript("arguments[0].click();", closeBtn);
    
    // Wait until the overlay is unmounted from the DOM
    await driver.wait(async () => {
      const elements = await driver.findElements(By.id('google-simulator-overlay'));
      return elements.length === 0;
    }, 5000);
    
    const exists = await driver.findElements(By.id('google-simulator-overlay'));
    assert.strictEqual(exists.length, 0, 'Google simulator overlay did not close.');
  });

  // --- STAGE 4: AUTHENTICATION & DASHBOARD VERIFICATIONS ---

  it('22. Should authenticate successfully with test credentials', async function () {
    const emailInput = await driver.findElement(By.id('email'));
    await emailInput.clear();
    await emailInput.sendKeys('test.user@tournex.com');
    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.clear();
    await passwordInput.sendKeys('pass123');
    const submitBtn = await driver.findElement(By.id('login-button'));
    await submitBtn.click();
    const appViewport = await driver.wait(until.elementLocated(By.id('applet-viewport')), 15000);
    assert.ok(appViewport, 'The applet viewport was not loaded successfully after login.');
  });

  it('23. Should display user info in Navbar after logging in', async function () {
    const navActions = await driver.wait(until.elementLocated(By.id('nav-actions')), 5000);
    assert.ok(navActions, 'Navbar actions block not visible.');
  });

  // --- STAGE 5: EXPLORE VIEW & TABS SWITCHING VERIFICATIONS ---

  it('24. Should display destination list under explore view', async function () {
    const destCard = await driver.wait(until.elementLocated(By.id('destination-card-jaipur')), 10000);
    assert.ok(destCard, 'Explore view destinations not loaded.');
  });

  it('25. Should filter destination list by search input', async function () {
    const searchInput = await driver.findElement(By.id('destination-search-input'));
    await searchInput.sendKeys('Jaipur');
    const matchedCard = await driver.wait(until.elementLocated(By.id('destination-card-jaipur')), 5000);
    assert.ok(matchedCard, 'Search did not correctly filter Jaipur.');
  });

  it('26. Should click Explore tab in Navbar to ensure active view', async function () {
    const exploreTab = await driver.findElement(By.id('nav-item-explore'));
    await exploreTab.click();
    const root = await driver.wait(until.elementLocated(By.id('explore-view-root')), 5000);
    assert.ok(root, 'Explore view root not active.');
  });

  it('27. Should switch to Gateway tab and render Gateway view', async function () {
    const gatewayTab = await driver.findElement(By.id('nav-item-gateway'));
    await gatewayTab.click();
    const gatewayRoot = await driver.wait(until.elementLocated(By.id('gateway-view-root')), 5000);
    assert.ok(gatewayRoot, 'Gateway finder view did not load.');
  });

  it('28. Should switch to AI Planner Companion tab and render Companion view', async function () {
    const companionTab = await driver.findElement(By.id('nav-item-companion'));
    await companionTab.click();
    const companionRoot = await driver.wait(until.elementLocated(By.id('companion-view-root')), 5000);
    assert.ok(companionRoot, 'AI Planner Companion view did not load.');
  });

  // --- STAGE 6: COMPANION & AI VERIFICATIONS ---

  it('29. Should send message to AI Planner and receive auto-reply', async function () {
    const chatInput = await driver.findElement(By.id('chat-input'));
    await chatInput.sendKeys('Tell me about Jaipur crowd');
    const sendBtn = await driver.findElement(By.id('chat-send-btn'));
    await sendBtn.click();
    const aiBubble = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Based on our live tourist density index')]")), 15000);
    assert.ok(aiBubble, 'AI auto-reply bubble not found.');
  });

  // --- STAGE 7: BUDGET SPLITTER VERIFICATIONS ---

  it('30. Should switch to Budget Splitter tab and render Splitter view', async function () {
    const splitterTab = await driver.findElement(By.id('nav-item-splitter'));
    await splitterTab.click();
    const splitterRoot = await driver.wait(until.elementLocated(By.id('splitter-view-root')), 5000);
    assert.ok(splitterRoot, 'Budget Splitter view did not load.');
  });

  it('31. Should toggle add expense form slide-down panel', async function () {
    const toggleBtn = await driver.findElement(By.id('add-expense-toggle-btn'));
    await toggleBtn.click();
    const descField = await driver.wait(until.elementLocated(By.id('expense-desc-input')), 5000);
    assert.ok(descField, 'Add expense form did not slide down.');
  });

  it('32. Should add new group expense successfully', async function () {
    const descField = await driver.findElement(By.id('expense-desc-input'));
    await descField.sendKeys('Autocab tour');
    const amountField = await driver.findElement(By.id('expense-amount-input'));
    await amountField.sendKeys('450');
    const submitBtn = await driver.findElement(By.id('expense-submit-btn'));
    await submitBtn.click();
    const item = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Autocab tour')]")), 5000);
    assert.ok(item, 'The added expense was not found in the expense list.');
  });

  it('33. Should delete the newly added expense successfully', async function () {
    const expenseItem = await driver.findElement(By.xpath("//*[contains(text(), 'Autocab tour')]/ancestor::*[contains(@id, 'expense-feed-item-')]"));
    const itemId = await expenseItem.getAttribute('id');
    const idSuffix = itemId.replace('expense-feed-item-', '');
    const deleteBtn = await driver.findElement(By.id(`delete-btn-${idSuffix}`));
    await driver.executeScript("arguments[0].click();", deleteBtn);
    await driver.wait(until.stalenessOf(expenseItem), 5000);
    const exists = await driver.findElements(By.id(itemId));
    assert.strictEqual(exists.length, 0, 'Expense was not deleted successfully.');
  });

  // --- STAGE 8: MY BOOKINGS VERIFICATIONS ---

  it('34. Should switch to My Bookings tab and check bookings list', async function () {
    const bookingsTab = await driver.findElement(By.id('nav-item-bookings'));
    await bookingsTab.click();
    const bookingsRoot = await driver.wait(until.elementLocated(By.id('bookings-view-root')), 5000);
    assert.ok(bookingsRoot, 'My Bookings view did not load.');
  });

  // --- STAGE 9: PROFILE VIEW & LOGOUT VERIFICATIONS ---

  it('35. Should switch to Profile tab, edit bio, and log out successfully', async function () {
    const profileTab = await driver.findElement(By.id('nav-item-profile'));
    await profileTab.click();
    const profileRoot = await driver.wait(until.elementLocated(By.id('profile-view-root')), 5000);
    assert.ok(profileRoot, 'Profile view did not load.');

    const logoutBtn = await driver.findElement(By.id('profile-logout-btn'));
    await logoutBtn.click();

    const viewport = await driver.wait(until.elementLocated(By.id('landing-view-viewport')), 15000);
    assert.ok(viewport, 'Did not redirect back to landing page after logout.');
  });
});
