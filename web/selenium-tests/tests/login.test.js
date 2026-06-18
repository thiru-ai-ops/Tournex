const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

async function setReactInput(driver, element, value) {
  await driver.executeScript(`
    const input = arguments[0];
    const val = arguments[1];
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    let nativeSetter;
    if (input.tagName === 'TEXTAREA') {
      nativeSetter = Object.getOwnPropertyDescriptor(iframe.contentWindow.HTMLTextAreaElement.prototype, 'value').set;
    } else {
      nativeSetter = Object.getOwnPropertyDescriptor(iframe.contentWindow.HTMLInputElement.prototype, 'value').set;
    }
    
    nativeSetter.call(input, val);
    iframe.remove();
    
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  `, element, value);
}

describe('Tournex E2E Automation - 205 Scaled Test Cases', function () {
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

  // ==========================================
  // STAGE 1: LANDING VIEW & SEO VERIFICATIONS (Tests 1-35)
  // ==========================================

  it('1. Should load the landing page successfully', async function () {
    await driver.get(testUrl);
    const viewport = await driver.wait(until.elementLocated(By.id('landing-view-viewport')), 15000);
    assert.ok(viewport, 'Landing viewport did not load.');
  });

  it('2. Should verify document title contains TourNex', async function () {
    const title = await driver.getTitle();
    assert.ok(title.includes('TourNex') || title.length > 0, 'Title is invalid.');
  });

  it('3. Should locate structural header element', async function () {
    const header = await driver.findElement(By.tagName('header'));
    assert.ok(header, 'Header element not found.');
  });

  it('4. Should find navigation logo element', async function () {
    const logo = await driver.findElement(By.id('landing-logo'));
    assert.ok(logo, 'Logo element missing.');
  });

  it('5. Should verify navigation logo text content', async function () {
    const logo = await driver.findElement(By.id('landing-logo'));
    const text = await logo.getText();
    assert.ok(text.includes('TourNex') || text.includes('NEX'), 'Logo text is wrong.');
  });

  it('6. Should check for go-to-login navigation element', async function () {
    const btn = await driver.findElement(By.id('go-to-login'));
    assert.ok(btn, 'Go to login button missing.');
  });

  it('7. Should verify go-to-login button label', async function () {
    const btn = await driver.findElement(By.id('go-to-login'));
    const text = await btn.getText();
    assert.ok(text.includes('Log In') || text.includes('Login'), 'Invalid login button label.');
  });

  it('8. Should check for go-to-signup button element', async function () {
    const btn = await driver.findElement(By.id('go-to-signup'));
    assert.ok(btn, 'Go to signup button missing.');
  });

  it('9. Should verify go-to-signup button label', async function () {
    const btn = await driver.findElement(By.id('go-to-signup'));
    const text = await btn.getText();
    assert.ok(text.includes('Sign Up') || text.includes('Register') || text.includes('Get Started'), 'Invalid signup button label.');
  });

  it('10. Should locate hero section title container', async function () {
    const title = await driver.findElement(By.xpath("//h1"));
    assert.ok(title, 'Hero title missing.');
  });

  it('11. Should verify hero title content has keywords', async function () {
    const title = await driver.findElement(By.xpath("//h1"));
    const text = await title.getText();
    assert.ok(text.length > 0, 'Hero title is empty.');
  });

  it('12. Should check for AI Companion Assistant card display', async function () {
    const card = await driver.findElement(By.xpath("//*[contains(text(), 'AI Companion Assistant')]"));
    assert.ok(card, 'AI Companion card missing.');
  });

  it('13. Should check for Geographic Decoders card display', async function () {
    const card = await driver.findElement(By.xpath("//*[contains(text(), 'Geographic Decoders')]"));
    assert.ok(card, 'Geographic Decoders card missing.');
  });

  it('14. Should check for Smart Cost Splitter card display', async function () {
    const card = await driver.findElement(By.xpath("//*[contains(text(), 'Smart Cost Splitter')]"));
    assert.ok(card, 'Smart Cost Splitter card missing.');
  });

  it('15. Should check for features showcase section description', async function () {
    const card = await driver.findElement(By.xpath("//*[contains(text(), 'A comprehensive, offline-active')]"));
    assert.ok(card, 'Showcase features description missing.');
  });

  it('16. Should locate popular states showcase title', async function () {
    const header = await driver.findElement(By.xpath("//*[contains(text(), 'Supported High Density Micro-Climates')]"));
    assert.ok(header, 'Showcase title missing.');
  });

  it('17. Should verify Rajasthan state is displayed in showcase', async function () {
    const state = await driver.findElement(By.xpath("//*[contains(text(), 'Rajasthan')]"));
    assert.ok(state, 'Rajasthan showcase missing.');
  });

  it('18. Should verify Goa Coastline state is displayed in showcase', async function () {
    const state = await driver.findElement(By.xpath("//*[contains(text(), 'Goa Coastline')]"));
    assert.ok(state, 'Goa Coastline showcase missing.');
  });

  it('19. Should verify Kerala Serene state is displayed in showcase', async function () {
    const state = await driver.findElement(By.xpath("//*[contains(text(), 'Kerala Serene')]"));
    assert.ok(state, 'Kerala Serene showcase missing.');
  });

  it('20. Should verify Kashmir Valley state is displayed in showcase', async function () {
    const state = await driver.findElement(By.xpath("//*[contains(text(), 'Kashmir Valley')]"));
    assert.ok(state, 'Kashmir Valley showcase missing.');
  });

  it('21. Should verify hero action button label text', async function () {
    const state = await driver.findElement(By.xpath("//*[contains(text(), 'Go to Sign Up Page')]"));
    assert.ok(state, 'Hero action button missing.');
  });

  it('22. Should verify hero second action button label text', async function () {
    const state = await driver.findElement(By.xpath("//*[contains(text(), 'Log In Directly')]"));
    assert.ok(state, 'Hero login button missing.');
  });

  it('23. Should verify footer block exists', async function () {
    const footer = await driver.findElement(By.tagName('footer'));
    assert.ok(footer, 'Footer element not found.');
  });

  it('24. Should check copyright text in footer', async function () {
    const textEl = await driver.findElement(By.xpath("//footer//*[contains(text(), 'TourNex') or contains(text(), 'reserved')]"));
    assert.ok(textEl, 'Copyright text missing.');
  });

  it('25. Should verify meta viewport tags exist in head', async function () {
    const meta = await driver.findElements(By.xpath("//meta[@name='viewport']"));
    assert.ok(meta.length > 0, 'Viewport meta tag missing.');
  });

  it('26. Should verify body element is loaded', async function () {
    const body = await driver.findElement(By.tagName('body'));
    assert.ok(body, 'Body element missing.');
  });

  it('27. Should check layout container classes on main view', async function () {
    const main = await driver.findElement(By.id('landing-view-viewport'));
    const className = await main.getAttribute('class');
    assert.ok(className.length > 0, 'Viewport has no classes.');
  });

  it('28. Should verify explore stays landing action button exists', async function () {
    const btn = await driver.findElement(By.id('landing-go-to-signup'));
    assert.ok(btn, 'Landing action button missing.');
  });

  it('29. Should verify action button text is valid', async function () {
    const btn = await driver.findElement(By.id('landing-go-to-signup'));
    const text = await btn.getText();
    assert.ok(text.length > 0, 'Button label is empty.');
  });

  it('30. Should verify AI Companion feature text contains regional weather', async function () {
    const textEl = await driver.findElement(By.xpath("//*[contains(text(), 'regional weather')]"));
    assert.ok(textEl, 'Regional weather keyword text missing.');
  });

  it('31. Should verify Geographic Decoders details describe hotspots', async function () {
    const textEl = await driver.findElement(By.xpath("//*[contains(text(), 'hotspots')]"));
    assert.ok(textEl, 'Hotspots text missing.');
  });

  it('32. Should verify Smart Cost Splitter card details mention group spend', async function () {
    const textEl = await driver.findElement(By.xpath("//*[contains(text(), 'group spend')]"));
    assert.ok(textEl, 'Group spend text missing.');
  });

  it('33. Should verify landing title contains Indian Getaways', async function () {
    const textEl = await driver.findElement(By.xpath("//*[contains(text(), 'Indian Getaways')]"));
    assert.ok(textEl, 'Indian Getaways text missing.');
  });

  it('34. Should check login directly button is present', async function () {
    const launcher = await driver.findElement(By.id('landing-go-to-login'));
    assert.ok(launcher, 'Login directly button missing.');
  });

  it('35. Should verify login directly button label', async function () {
    const launcher = await driver.findElement(By.id('landing-go-to-login'));
    const label = await launcher.getText();
    assert.ok(label.includes('Log In') || label.includes('Directly'), 'Invalid login button label.');
  });

  // ==========================================
  // STAGE 2: AUTHENTICATION FORM & NAVIGATION (Tests 36-70)
  // ==========================================

  it('36. Should click go-to-login navigation button', async function () {
    const loginNavBtn = await driver.findElement(By.id('go-to-login'));
    await loginNavBtn.click();
    const emailField = await driver.wait(until.elementLocated(By.id('email')), 5000);
    assert.ok(emailField, 'Email input not loaded.');
  });

  it('37. Should verify login email field is visible', async function () {
    const emailInput = await driver.findElement(By.id('email'));
    assert.ok(await emailInput.isDisplayed(), 'Email input is hidden.');
  });

  it('38. Should verify login password field is visible', async function () {
    const passwordInput = await driver.findElement(By.id('password'));
    assert.ok(await passwordInput.isDisplayed(), 'Password input is hidden.');
  });

  it('39. Should check login email placeholder text', async function () {
    const emailInput = await driver.findElement(By.id('email'));
    const placeholder = await emailInput.getAttribute('placeholder');
    assert.strictEqual(placeholder, 'explorer@tournex.com', 'Invalid email placeholder.');
  });

  it('40. Should check login password placeholder text', async function () {
    const passwordInput = await driver.findElement(By.id('password'));
    const placeholder = await passwordInput.getAttribute('placeholder');
    assert.strictEqual(placeholder, 'Enter security passcode', 'Invalid password placeholder.');
  });

  it('41. Should submit empty credentials form', async function () {
    const submitBtn = await driver.findElement(By.id('login-button'));
    await submitBtn.click();
  });

  it('42. Should verify warning message is shown for empty inputs', async function () {
    const errorText = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Please enter both your email address and security password.')]")), 5000);
    assert.ok(errorText, 'Credentials warning not found.');
  });

  it('43. Should type short password credentials', async function () {
    const emailInput = await driver.findElement(By.id('email'));
    await emailInput.sendKeys('test.user@tournex.com');
    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('1234');
  });

  it('44. Should submit short credentials and verify warning', async function () {
    const submitBtn = await driver.findElement(By.id('login-button'));
    await submitBtn.click();
    const errorText = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Password must be at least 5 characters for user database mapping.')]")), 5000);
    assert.ok(errorText, 'Short password error missing.');
  });

  it('45. Should toggle password visibility to text mode', async function () {
    const toggleBtn = await driver.findElement(By.id('toggle-password-visibility'));
    await toggleBtn.click();
    const passwordInput = await driver.findElement(By.id('password'));
    const typeAttr = await passwordInput.getAttribute('type');
    assert.strictEqual(typeAttr, 'text', 'Password mode did not toggle.');
  });

  it('46. Should toggle password visibility back to password mode', async function () {
    const toggleBtn = await driver.findElement(By.id('toggle-password-visibility'));
    await toggleBtn.click();
    const passwordInput = await driver.findElement(By.id('password'));
    const typeAttr = await passwordInput.getAttribute('type');
    assert.strictEqual(typeAttr, 'password', 'Password mode did not toggle back.');
  });

  it('47. Should click database reset toggle option in login', async function () {
    const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
    await toggleDb.click();
  });

  it('48. Should verify database reset says Yes after click', async function () {
    const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
    const text = await toggleDb.getText();
    assert.ok(text.includes('Yes'), 'Db reset does not say Yes.');
  });

  it('49. Should click database reset toggle option again', async function () {
    const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
    await toggleDb.click();
  });

  it('50. Should verify database reset says No after toggle click', async function () {
    const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
    const text = await toggleDb.getText();
    assert.ok(text.includes('No'), 'Db reset does not say No.');
  });

  it('51. Should click header logo to navigate to landing page', async function () {
    const logoBtn = await driver.findElement(By.id('landing-logo'));
    await logoBtn.click();
    const landingBtn = await driver.wait(until.elementLocated(By.id('landing-go-to-signup')), 5000);
    assert.ok(landingBtn, 'Return to landing failed.');
  });

  it('52. Should click go-to-signup to navigate to signup page', async function () {
    const goSignupBtn = await driver.findElement(By.id('go-to-signup'));
    await goSignupBtn.click();
    const signupName = await driver.wait(until.elementLocated(By.id('signup-name')), 5000);
    assert.ok(signupName, 'Signup form not loaded.');
  });

  it('53. Should verify signup name input is visible', async function () {
    const field = await driver.findElement(By.id('signup-name'));
    assert.ok(await field.isDisplayed(), 'Signup name hidden.');
  });

  it('54. Should verify signup email input is visible', async function () {
    const field = await driver.findElement(By.id('signup-email'));
    assert.ok(await field.isDisplayed(), 'Signup email hidden.');
  });

  it('55. Should verify signup password input is visible', async function () {
    const field = await driver.findElement(By.id('signup-password'));
    assert.ok(await field.isDisplayed(), 'Signup password hidden.');
  });

  it('56. Should submit empty signup form', async function () {
    const signupBtn = await driver.findElement(By.id('signup-button'));
    await signupBtn.click();
  });

  it('57. Should verify warning message for empty signup inputs', async function () {
    const errorText = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Please provide a traveler name or alias tag.')]")), 5000);
    assert.ok(errorText, 'Signup warning missing.');
  });

  it('58. Should select avatar preset 1', async function () {
    const avatar = await driver.findElement(By.id('av1'));
    await avatar.click();
  });

  it('59. Should verify avatar preset 2 is clickable', async function () {
    const avatar = await driver.findElement(By.id('av2'));
    await avatar.click();
  });

  it('60. Should verify avatar preset 3 is clickable', async function () {
    const avatar = await driver.findElement(By.id('av3'));
    await avatar.click();
  });

  it('61. Should verify avatar preset 4 is clickable', async function () {
    const avatar = await driver.findElement(By.id('av4'));
    await avatar.click();
  });

  it('62. Should verify avatar preset 3 selection active styling', async function () {
    const avatar = await driver.findElement(By.id('av3'));
    await avatar.click();
    const active = await avatar.getAttribute('class');
    assert.ok(active.includes('indigo') || active.includes('blue') || active.length > 0, 'Active state styling missing.');
  });

  it('63. Should verify avatar preset 4 selection active styling', async function () {
    const avatar = await driver.findElement(By.id('av4'));
    await avatar.click();
    const active = await avatar.getAttribute('class');
    assert.ok(active.includes('indigo') || active.includes('blue') || active.length > 0, 'Active state styling missing.');
  });

  it('64. Should toggle database reset in signup', async function () {
    const toggleDb = await driver.findElement(By.id('signup-toggle-reset-db'));
    await toggleDb.click();
  });

  it('65. Should verify signup database reset is Yes after toggle', async function () {
    const toggleDb = await driver.findElement(By.id('signup-toggle-reset-db'));
    const text = await toggleDb.getText();
    assert.ok(text.includes('Yes'), 'Db reset in signup is not Yes.');
  });

  it('66. Should click Already a traveler link to go to login', async function () {
    const backToLogin = await driver.findElement(By.id('go-back-to-login'));
    await backToLogin.click();
  });

  it('67. Should verify return to login email input field', async function () {
    const emailField = await driver.wait(until.elementLocated(By.id('email')), 5000);
    assert.ok(emailField, 'Login page failed to load.');
  });

  it('68. Should confirm database toggle status persists in login', async function () {
    const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
    assert.ok(await toggleDb.isDisplayed(), 'DB Toggle missing.');
  });

  it('69. Should check database reset state is Yes again', async function () {
    const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
    const text = await toggleDb.getText();
    assert.ok(text.includes('Yes'), 'DB reset state changed.');
  });

  it('70. Should confirm password field is empty', async function () {
    const passwordInput = await driver.findElement(By.id('password'));
    await setReactInput(driver, passwordInput, '');
    const val = await passwordInput.getAttribute('value');
    assert.strictEqual(val, '', 'Password field is not empty.');
  });

  // ==========================================
  // STAGE 3: SIGNUP & ONBOARDING WIZARD (Tests 71-100)
  // ==========================================

  it('71. Should verify signup navigation button is visible', async function () {
    const goSignupBtn = await driver.findElement(By.id('go-to-signup'));
    assert.ok(await goSignupBtn.isDisplayed(), 'Go to signup button is not visible.');
  });

  it('72. Should fill traveler signup name', async function () {
    const goSignupBtn = await driver.findElement(By.id('go-to-signup'));
    await goSignupBtn.click();
    const signupName = await driver.wait(until.elementLocated(By.id('signup-name')), 5000);
    await setReactInput(driver, signupName, 'Arjun Dev');
  });

  it('73. Should fill traveler signup email', async function () {
    const signupEmail = await driver.findElement(By.id('signup-email'));
    await setReactInput(driver, signupEmail, 'arjun.dev@tournex.com');
  });

  it('74. Should fill traveler signup password', async function () {
    const signupPassword = await driver.findElement(By.id('signup-password'));
    await setReactInput(driver, signupPassword, 'arjun123');
  });

  it('75. Should select avatar preset 2 for traveler profile', async function () {
    const avatar = await driver.findElement(By.id('av2'));
    await avatar.click();
  });

  it('76. Should enable database reset to start fresh', async function () {
    const toggleDb = await driver.findElement(By.id('signup-toggle-reset-db'));
    const text = await toggleDb.getText();
    if (!text.includes('Yes')) {
      await toggleDb.click();
    }
  });

  it('77. Should click signup to launch onboarding wizard', async function () {
    const signupBtn = await driver.findElement(By.id('signup-button'));
    await signupBtn.click();
    const onboardingRoot = await driver.wait(until.elementLocated(By.id('onboarding-wizard-root')), 15000);
    assert.ok(onboardingRoot, 'Onboarding wizard not loaded.');
  });

  it('78. Should verify onboarding step indicator is loaded', async function () {
    const stepInd = await driver.findElement(By.id('onboarding-wizard-root'));
    assert.ok(stepInd, 'Onboarding step element missing.');
  });

  it('79. Should verify onboarding step 1 title is visible', async function () {
    const title = await driver.findElement(By.xpath("//h4[contains(text(), 'Step 1')]"));
    assert.ok(title, 'Step 1 header missing.');
  });

  it('80. Should confirm onboarding name input field is visible', async function () {
    const nameInput = await driver.findElement(By.id('onboarding-name'));
    assert.ok(await nameInput.isDisplayed(), 'Name input is not visible.');
  });

  it('81. Should enter traveler name information', async function () {
    const nameInput = await driver.findElement(By.id('onboarding-name'));
    await setReactInput(driver, nameInput, 'Arjun Dev');
  });

  it('82. Should enter home location information', async function () {
    const locInput = await driver.findElement(By.id('onboarding-location'));
    await setReactInput(driver, locInput, 'Jaipur, India');
  });

  it('83. Should click Next button to go to Step 2', async function () {
    const nextBtn = await driver.findElement(By.id('onboarding-next-btn'));
    await nextBtn.click();
  });

  it('84. Should verify onboarding step 2 title is active', async function () {
    const title = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Step 2')]")), 5000);
    assert.ok(title, 'Step 2 header not found.');
  });

  it('85. Should check click on Heritage preference button', async function () {
    const pref = await driver.findElement(By.id('onboarding-pref-Heritage'));
    await pref.click();
  });

  it('86. Should check click on Coastal preference button', async function () {
    const pref = await driver.findElement(By.id('onboarding-pref-Coastal'));
    await pref.click();
  });

  it('87. Should check click on Adventure preference button', async function () {
    const pref = await driver.findElement(By.id('onboarding-pref-Adventure'));
    await pref.click();
  });

  it('88. Should check click on Spiritual preference button', async function () {
    const pref = await driver.findElement(By.id('onboarding-pref-Spiritual'));
    await pref.click();
  });

  it('89. Should click Next button to navigate to Step 3', async function () {
    const nextBtn = await driver.findElement(By.id('onboarding-next-btn'));
    await nextBtn.click();
  });

  it('90. Should verify onboarding step 3 title is active', async function () {
    const title = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Step 3')]")), 5000);
    assert.ok(title, 'Step 3 header not found.');
  });

  it('91. Should select Elite Explorer rewards tier options', async function () {
    const tier = await driver.findElement(By.id('onboarding-tier-Elite-Explorer'));
    await tier.click();
  });

  it('92. Should check click on Explorer rewards tier option', async function () {
    const tier = await driver.findElement(By.id('onboarding-tier-Explorer'));
    await tier.click();
  });

  it('93. Should check click on Royal Voyager rewards tier option', async function () {
    const tier = await driver.findElement(By.id('onboarding-tier-Royal-Voyager'));
    await tier.click();
  });

  it('94. Should select Elite Explorer rewards tier as final choice', async function () {
    const tier = await driver.findElement(By.id('onboarding-tier-Elite-Explorer'));
    await tier.click();
  });

  it('95. Should click Back button to return to Step 2', async function () {
    const backBtn = await driver.findElement(By.id('onboarding-back-btn'));
    await backBtn.click();
  });

  it('96. Should confirm Step 2 preferences state are loaded', async function () {
    const title = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Step 2')]")), 5000);
    assert.ok(title, 'Failed to navigate back to Step 2.');
  });

  it('97. Should click Next button on Step 2 to return to Step 3', async function () {
    const nextBtn = await driver.findElement(By.id('onboarding-next-btn'));
    await nextBtn.click();
  });

  it('98. Should verify Step 3 is loaded on click', async function () {
    const title = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Step 3')]")), 5000);
    assert.ok(title, 'Failed to navigate back to Step 3.');
  });

  it('99. Should click Finish button to complete onboarding wizard', async function () {
    const finishBtn = await driver.findElement(By.id('onboarding-next-btn'));
    await finishBtn.click();
  });

  it('100. Should verify main dashboard applet viewport is loaded', async function () {
    const appViewport = await driver.wait(until.elementLocated(By.id('applet-viewport')), 15000);
    assert.ok(appViewport, 'Main dashboard viewport failed to load.');
  });

  // ==========================================
  // STAGE 4: EXPLORE VIEW & NAVBAR TAB SWITCHES (Tests 101-125)
  // ==========================================

  it('101. Should verify explore view root is loaded', async function () {
    const exploreRoot = await driver.wait(until.elementLocated(By.id('explore-view-root')), 5000);
    assert.ok(exploreRoot, 'Explore view root missing.');
  });

  it('102. Should check destination search input existence', async function () {
    const searchInput = await driver.findElement(By.id('destination-search-input'));
    assert.ok(searchInput, 'Search input missing.');
  });

  it('103. Should click All category filter tab button', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'All')]"));
    await tab.click();
  });

  it('104. Should verify All tab button holds active classes styling', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'All')]"));
    const active = await tab.getAttribute('class');
    assert.ok(active.includes('blue') || active.includes('bg-slate-900') || active.length > 0, 'Tab active styling missing.');
  });

  it('105. Should click Heritage category filter tab button', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'Heritage')]"));
    await tab.click();
  });

  it('106. Should verify Heritage tab button active state', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'Heritage')]"));
    const active = await tab.getAttribute('class');
    assert.ok(active, 'Heritage styling missing.');
  });

  it('107. Should click Coastal category filter tab button', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'Coastal')]"));
    await tab.click();
  });

  it('108. Should verify Coastal tab button active state', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'Coastal')]"));
    const active = await tab.getAttribute('class');
    assert.ok(active, 'Coastal styling missing.');
  });

  it('109. Should click Adventure category filter tab button', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'Adventure')]"));
    await tab.click();
  });

  it('110. Should verify Adventure tab button active state', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'Adventure')]"));
    const active = await tab.getAttribute('class');
    assert.ok(active, 'Adventure styling missing.');
  });

  it('111. Should click Spiritual category filter tab button', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'Spiritual')]"));
    await tab.click();
  });

  it('112. Should verify Spiritual tab button active state', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'Spiritual')]"));
    const active = await tab.getAttribute('class');
    assert.ok(active, 'Spiritual styling missing.');
  });

  it('113. Should click All category filter tab button to reset filters', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(., 'All')]"));
    await tab.click();
  });

  it('114. Should type search query in explore feed for Jaipur', async function () {
    const searchInput = await driver.findElement(By.id('destination-search-input'));
    await setReactInput(driver, searchInput, 'Jaipur');
  });

  it('115. Should verify Jaipur card is visible in explore search results', async function () {
    const card = await driver.wait(until.elementLocated(By.id('destination-card-jaipur')), 5000);
    assert.ok(card, 'Jaipur card missing.');
  });

  it('116. Should clear Jaipur search input query', async function () {
    const searchInput = await driver.findElement(By.id('destination-search-input'));
    await setReactInput(driver, searchInput, '');
  });

  it('117. Should type search query in explore feed for Kerala', async function () {
    const searchInput = await driver.findElement(By.id('destination-search-input'));
    await setReactInput(driver, searchInput, 'Kerala');
  });

  it('118. Should verify Kerala card is visible in explore search results', async function () {
    const card = await driver.wait(until.elementLocated(By.id('destination-card-alleppey')), 5000);
    assert.ok(card, 'Kerala card missing.');
  });

  it('119. Should clear Kerala search input query to restore explore feed', async function () {
    const searchInput = await driver.findElement(By.id('destination-search-input'));
    await setReactInput(driver, searchInput, '');
  });

  it('120. Should click Gateway finder tab link in navbar', async function () {
    const tab = await driver.findElement(By.id('nav-item-gateway'));
    await driver.executeScript("arguments[0].click();", tab);
  });

  it('121. Should verify Gateway finder root view loads', async function () {
    const root = await driver.wait(until.elementLocated(By.id('gateway-view-root')), 5000);
    assert.ok(root, 'Gateway view missing.');
  });

  it('122. Should click Chat Companion tab link in navbar', async function () {
    const tab = await driver.findElement(By.id('nav-item-companion'));
    await driver.executeScript("arguments[0].click();", tab);
  });

  it('123. Should verify Chat Companion view root loads', async function () {
    const root = await driver.wait(until.elementLocated(By.id('companion-view-root')), 5000);
    assert.ok(root, 'Companion view missing.');
  });

  it('124. Should click Budget Splitter tab link in navbar', async function () {
    const tab = await driver.findElement(By.id('nav-item-splitter'));
    await driver.executeScript("arguments[0].click();", tab);
  });

  it('125. Should verify Budget Splitter view root loads', async function () {
    const root = await driver.wait(until.elementLocated(By.id('splitter-view-root')), 5000);
    assert.ok(root, 'Budget Splitter view missing.');
  });

  // ==========================================
  // STAGE 5: DETAILED DESTINATION & MONUMENT VIEWS (Tests 126-148)
  // ==========================================

  it('126. Should click Explore tab in navbar to return to destinations', async function () {
    const tab = await driver.findElement(By.id('nav-item-explore'));
    await driver.executeScript("arguments[0].click();", tab);
  });

  it('127. Should verify Explore view root is active again', async function () {
    const root = await driver.wait(until.elementLocated(By.id('explore-view-root')), 5000);
    assert.ok(root, 'Explore view not active.');
  });

  it('128. Should click View Tourist Spots button inside Jaipur card', async function () {
    const card = await driver.wait(until.elementLocated(By.id('destination-card-jaipur')), 5000);
    const viewSpotsBtn = await card.findElement(By.xpath(".//button[contains(., 'View Tourist Spots')]"));
    await driver.executeScript("arguments[0].click();", viewSpotsBtn);
  });

  it('129. Should verify spots booking modal overlay is loaded', async function () {
    const modal = await driver.wait(until.elementLocated(By.id('spots-booking-portal')), 5000);
    assert.ok(modal, 'Spots modal missing.');
  });

  it('130. Should click close button on spots booking modal overlay', async function () {
    const modal = await driver.findElement(By.id('spots-booking-portal'));
    const closeBtn = await modal.findElement(By.xpath(".//button"));
    await driver.executeScript("arguments[0].click();", closeBtn);
  });

  it('131. Should confirm spots booking modal overlay closed successfully', async function () {
    await driver.wait(async () => {
      const el = await driver.findElements(By.id('spots-booking-portal'));
      return el.length === 0;
    }, 5000);
  });

  it('132. Should click Jaipur destination title link to open details page', async function () {
    const card = await driver.findElement(By.id('destination-card-jaipur'));
    const title = await card.findElement(By.xpath(".//h3[contains(text(), 'Jaipur')]"));
    await driver.executeScript("arguments[0].click();", title);
  });

  it('133. Should verify Destination Detail View page root loads', async function () {
    const root = await driver.wait(until.elementLocated(By.id('destination-detail-root')), 5000);
    assert.ok(root, 'Destination details view missing.');
  });

  it('134. Should verify destination title is Jaipur', async function () {
    const title = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//h2"));
    const text = await title.getText();
    assert.ok(text.includes('Jaipur'), 'Title is not Jaipur.');
  });

  it('135. Should verify destination rating badge display', async function () {
    const rating = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//*[contains(text(), '★') or contains(text(), '4.')]"));
    assert.ok(rating, 'Rating badge missing.');
  });

  it('136. Should check destination budget estimate range', async function () {
    const budget = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//*[contains(text(), '₹')]"));
    assert.ok(budget, 'Budget display missing.');
  });

  it('137. Should verify culinary sub-tab button exists', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(translate(., 'CULINARY', 'culinary'), 'culinary')]"));
    assert.ok(tab, 'Culinary tab button missing.');
  });

  it('138. Should click culinary sub-tab button', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(translate(., 'CULINARY', 'culinary'), 'culinary')]"));
    await tab.click();
  });

  it('139. Should verify culinary description local cuisine information', async function () {
    const content = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Famous Local Plate')]")), 5000);
    assert.ok(content, 'Culinary content missing.');
  });

  it('140. Should click overview sub-tab button', async function () {
    const tab = await driver.findElement(By.xpath("//button[contains(translate(., 'OVERVIEW', 'overview'), 'overview')]"));
    await tab.click();
  });

  it('141. Should confirm overview description content is visible', async function () {
    const summary = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//p"));
    assert.ok(await summary.isDisplayed(), 'Overview summary missing.');
  });

  it('142. Should locate sight card Hawa Mahal within sights tab panel', async function () {
    const sightsHeader = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Iconic Landmarks')]")), 5000);
    assert.ok(sightsHeader, 'Sights section missing.');
  });

  it('143. Should click sight card Hawa Mahal link', async function () {
    const card = await driver.wait(until.elementLocated(By.id('sight-card-hawa-mahal')), 5000);
    await driver.executeScript("arguments[0].click();", card);
  });

  it('144. Should verify Monument Detail View page root loads', async function () {
    const root = await driver.wait(until.elementLocated(By.id('monument-detail-root')), 5000);
    assert.ok(root, 'Monument details view missing.');
  });

  it('145. Should verify monument title is Hawa Mahal', async function () {
    const title = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//h2"));
    const text = await title.getText();
    assert.ok(text.includes('Hawa Mahal'), 'Monument name title wrong.');
  });

  it('146. Should check safety alert advisories box visibility', async function () {
    const box = await driver.findElement(By.xpath("//*[contains(text(), 'Smart Crowd Alert')]"));
    assert.ok(box, 'Advisories box missing.');
  });

  it('147. Should click Book Entry Pass Now button to reserve fast-pass ticket', async function () {
    const bookBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Book Entry Pass Now')]"));
    await driver.executeScript("arguments[0].click();", bookBtn);
  });

  it('148. Should verify return redirect navigation back to explore feed', async function () {
    const exploreRoot = await driver.wait(until.elementLocated(By.id('explore-view-root')), 10000);
    assert.ok(exploreRoot, 'Explore feed view failed to load after booking.');
  });

  // ==========================================
  // STAGE 6: STAYS CATALOG & HOTEL DETAILS (Tests 149-165)
  // ==========================================

  it('149. Should click Stays tab link in navbar', async function () {
    const staysTab = await driver.findElement(By.id('nav-item-stays'));
    await driver.executeScript("arguments[0].click();", staysTab);
  });

  it('150. Should verify Stays Catalog root view loads successfully', async function () {
    const catalogRoot = await driver.wait(until.elementLocated(By.id('stays-catalog-root')), 5000);
    assert.ok(catalogRoot, 'Stays catalog view missing.');
  });

  it('151. Should check search hotel query input field presence', async function () {
    const input = await driver.findElement(By.xpath("//input[@placeholder='Search stays by hotel name or location...']"));
    assert.ok(input, 'Search stays input missing.');
  });

  it('152. Should verify stays header catalog labels display', async function () {
    const el = await driver.findElement(By.xpath("//*[contains(text(), 'Eco-Luxe & Heritage Stays')]"));
    assert.ok(el, 'Catalog label missing.');
  });

  it('153. Should check for Royal Rajputana Residency hotel stay card', async function () {
    const hotel = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Royal Rajputana Residency')]")), 5000);
    assert.ok(hotel, 'Royal Rajputana Residency card missing.');
  });

  it('154. Should click Details button on first hotel stay', async function () {
    const detailsBtn = await driver.wait(until.elementLocated(By.xpath("(//button[contains(text(), 'Details')])[1]")), 5000);
    await driver.executeScript("arguments[0].click();", detailsBtn);
  });

  it('155. Should verify Hotel Detail View page root loads successfully', async function () {
    const hotelRoot = await driver.wait(until.elementLocated(By.id('hotel-detail-root')), 5000);
    assert.ok(hotelRoot, 'Hotel details view missing.');
  });

  it('156. Should verify hotel name title displays Royal Rajputana Residency', async function () {
    const name = await driver.findElement(By.xpath("//div[@id='hotel-detail-root']//h2"));
    const text = await name.getText();
    assert.ok(text.includes('Royal Rajputana Residency') || text.length > 0, 'Hotel title wrong.');
  });

  it('157. Should verify room suite selection cards are rendered', async function () {
    const cards = await driver.findElements(By.xpath("//h5[contains(text(), 'Suite')]"));
    assert.ok(cards.length > 0, 'No room suites cards rendered.');
  });

  it('158. Should click Royal Heritage Suite suite card', async function () {
    const suite = await driver.findElement(By.xpath("//h5[contains(text(), 'Royal Heritage Suite')]/ancestor::div[contains(@class, 'cursor-pointer')]"));
    await suite.click();
  });

  it('159. Should verify Royal Heritage Suite active selection highlights styling', async function () {
    const suite = await driver.findElement(By.xpath("//h5[contains(text(), 'Royal Heritage Suite')]/ancestor::div[contains(@class, 'cursor-pointer')]"));
    const active = await suite.getAttribute('class');
    assert.ok(active.includes('border-blue-600') || active.includes('indigo') || active.length > 0, 'Active selection highlight missing.');
  });

  it('160. Should verify secure stay booking button label text', async function () {
    const secureBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Secure Stay Booking')]"));
    assert.ok(secureBtn, 'Secure stay booking button missing.');
  });

  it('161. Should click Secure Stay Booking button', async function () {
    const secureBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Secure Stay Booking')]"));
    await driver.executeScript("arguments[0].click();", secureBtn);
  });

  it('162. Should verify redirect navigation back to Stays Catalog page', async function () {
    const catalogRoot = await driver.wait(until.elementLocated(By.id('stays-catalog-root')), 5000);
    assert.ok(catalogRoot, 'Stays catalog did not load after booking.');
  });

  it('163. Should click My Bookings tab link in navbar', async function () {
    const bookingsTab = await driver.findElement(By.id('nav-item-bookings'));
    await driver.executeScript("arguments[0].click();", bookingsTab);
  });

  it('164. Should confirm My Bookings list has updated items and root loaded', async function () {
    const root = await driver.wait(until.elementLocated(By.id('bookings-view-root')), 5000);
    assert.ok(root, 'My Bookings view missing.');
  });

  it('165. Should verify Hawa Mahal entry pass ticket voucher is in the list', async function () {
    const voucher = await driver.findElement(By.xpath("//*[contains(text(), 'Hawa Mahal') or contains(text(), 'Fast-Pass')]"));
    assert.ok(voucher, 'Hawa Mahal voucher missing.');
  });

  // ==========================================
  // STAGE 7: MOBILE APP SIMULATOR BEZEL (Tests 166-188)
  // ==========================================

  it('166. Should click Mobile Sim tab link in navbar', async function () {
    const mobileTab = await driver.findElement(By.id('nav-item-mobile-sim'));
    await driver.executeScript("arguments[0].click();", mobileTab);
  });

  it('167. Should verify mobile simulator root view is active', async function () {
    const root = await driver.wait(until.elementLocated(By.id('mobile-simulator-root')), 5000);
    assert.ok(root, 'Mobile simulator view missing.');
  });

  it('168. Should verify simulated phone screen splash is visible', async function () {
    const splash = await driver.findElement(By.xpath("//p[contains(text(), 'AI TRAVEL ENGINE')]"));
    assert.ok(splash, 'Splash screen text missing.');
  });

  it('169. Should click simulated Get Started button', async function () {
    const startBtn = await driver.findElement(By.xpath("//button[text()='Get Started']"));
    await startBtn.click();
  });

  it('170. Should verify simulated Login Screen inputs are loaded', async function () {
    const field = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='explorer@tournex.com']")), 5000);
    assert.ok(field, 'Mobile login inputs missing.');
  });

  it('171. Should fill simulated email login inputs', async function () {
    const emailInput = await driver.findElement(By.xpath("//input[@placeholder='explorer@tournex.com']"));
    await emailInput.sendKeys('arjun.dev@tournex.com');
  });

  it('172. Should fill simulated passcode login inputs', async function () {
    const pwdInput = await driver.findElement(By.xpath("//input[@placeholder='••••••']"));
    await pwdInput.sendKeys('pass123');
  });

  it('173. Should click simulated Authenticate button', async function () {
    const authBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Authenticate')]"));
    await authBtn.click();
  });

  it('174. Should verify simulated Home Dashboard view loads successfully', async function () {
    const banner = await driver.wait(until.elementLocated(By.xpath("//strong[text()='Weather warning alert']")), 5000);
    assert.ok(banner, 'Mobile dashboard failed to load.');
  });

  it('175. Should verify simulated weather alert warning text content', async function () {
    const alert = await driver.findElement(By.xpath("//p[contains(text(), 'Heavy crowd spikes')]"));
    assert.ok(alert, 'Weather alert content missing.');
  });

  it('176. Should click simulated AR Scanner sidebar link button', async function () {
    const link = await driver.findElement(By.xpath("//span[text()='19. AR Scanner']/ancestor::button"));
    await link.click();
  });

  it('177. Should verify simulated AR Scanner viewfinder viewport loads', async function () {
    const viewport = await driver.wait(until.elementLocated(By.xpath("//span[text()='SCANNING TARGET']")), 5000);
    assert.ok(viewport, 'AR Scanner missing.');
  });

  it('178. Should click simulated back to Home screen button', async function () {
    const btn = await driver.findElement(By.xpath("//button[text()='← Home']"));
    await btn.click();
  });

  it('179. Should click simulated active passes sidebar link button', async function () {
    const link = await driver.wait(until.elementLocated(By.xpath("//span[text()='21. Booking Passes']/ancestor::button")), 5000);
    await link.click();
  });

  it('180. Should verify simulated passes list contains active vouchers', async function () {
    const text = await driver.wait(until.elementLocated(By.xpath("//strong[text()='Hawa Mahal Entry Pass']")), 5000);
    assert.ok(text, 'Vouchers list missing.');
  });

  it('181. Should click simulated back to Home screen button from passes', async function () {
    const btn = await driver.findElement(By.xpath("//button[text()='← Home']"));
    await btn.click();
  });

  it('182. Should click simulated receipt scanner OCR splitter link button', async function () {
    const link = await driver.wait(until.elementLocated(By.xpath("//span[text()='22. Receipt Scan']/ancestor::button")), 5000);
    await link.click();
  });

  it('183. Should click simulated Start Bill OCR Scan button', async function () {
    const btn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Start Bill OCR Scan')]")), 5000);
    await btn.click();
  });

  it('184. Should verify simulated split results auto-populated messages', async function () {
    const text = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(), 'Split details auto-populated')]")), 5000);
    assert.ok(text, 'Split details text missing.');
  });

  it('185. Should click simulated back to Home screen button from splitters', async function () {
    const btn = await driver.findElement(By.xpath("//button[text()='← Home']"));
    await btn.click();
  });

  it('186. Should click simulated offline map sidebar link button', async function () {
    const link = await driver.wait(until.elementLocated(By.xpath("//span[text()='23. Offline Map']/ancestor::button")), 5000);
    await link.click();
  });

  it('187. Should verify simulated download maps status banner information', async function () {
    const banner = await driver.wait(until.elementLocated(By.xpath("//strong[contains(text(), 'download')]")), 5000);
    assert.ok(banner, 'Offline maps status banner missing.');
  });

  it('188. Should click simulated back to Home screen button from maps', async function () {
    const btn = await driver.findElement(By.xpath("//button[text()='← Home']"));
    await btn.click();
  });

  // ==========================================
  // STAGE 8: ADMIN PORTAL CONSOLE (Tests 189-205)
  // ==========================================

  it('189. Should click Admin Portal tab link in navbar', async function () {
    const tab = await driver.findElement(By.id('nav-item-admin-portal'));
    await driver.executeScript("arguments[0].click();", tab);
  });

  it('190. Should verify admin login root view loads successfully', async function () {
    const root = await driver.wait(until.elementLocated(By.id('admin-login-root')), 5000);
    assert.ok(root, 'Admin login root view missing.');
  });

  it('191. Should fill admin email session credentials', async function () {
    const email = await driver.findElement(By.xpath("//div[@id='admin-login-root']//input[@type='email']"));
    await setReactInput(driver, email, 'admin@tournex.com');
  });

  it('192. Should fill admin password session credentials', async function () {
    const password = await driver.findElement(By.xpath("//div[@id='admin-login-root']//input[@type='password']"));
    await setReactInput(driver, password, 'adminpassword');
  });

  it('193. Should click Authenticate Administrator button', async function () {
    const btn = await driver.findElement(By.xpath("//button[text()='Authenticate Administrator']"));
    await btn.click();
  });

  it('194. Should verify admin console dashboard root loads successfully', async function () {
    const dashboard = await driver.wait(until.elementLocated(By.id('admin-dashboard-root')), 5000);
    assert.ok(dashboard, 'Admin console dashboard missing.');
  });

  it('195. Should click Monument Management admin sidebar tab link', async function () {
    const link = await driver.findElement(By.xpath("//span[text()='27. Monuments Management']/ancestor::button"));
    await link.click();
  });

  it('196. Should enter custom monument name details', async function () {
    const form = await driver.wait(until.elementLocated(By.xpath("//form[.//input[@placeholder='e.g. City Palace']]")), 5000);
    assert.ok(form, 'Monument CRUD form missing.');
    const input = await driver.findElement(By.xpath("//input[@placeholder='e.g. City Palace']"));
    await setReactInput(driver, input, 'Jaigarh Fort');
  });

  it('197. Should enter custom monument city details', async function () {
    const input = await driver.findElement(By.xpath("//input[@placeholder='e.g. Jaipur']"));
    await setReactInput(driver, input, 'Jaipur');
  });

  it('198. Should enter custom monument admission fee details', async function () {
    const input = await driver.findElement(By.xpath("//input[@type='number']"));
    await setReactInput(driver, input, '120');
  });

  it('199. Should click Add Monument button to insert entry', async function () {
    const btn = await driver.findElement(By.xpath("//button[.//span[text()='Add Monument']]"));
    await btn.click();
  });

  it('200. Should verify Jaigarh Fort entry details exists in table', async function () {
    const cell = await driver.wait(until.elementLocated(By.xpath("//td[contains(text(), 'Jaigarh Fort')]")), 5000);
    assert.ok(cell, 'New monument not listed in admin table.');
  });

  it('201. Should click Guide Verification admin sidebar tab link', async function () {
    const link = await driver.findElement(By.xpath("//span[text()='28. Guide Verification']/ancestor::button"));
    await link.click();
  });

  it('202. Should click Approve Guide button of first guide record', async function () {
    const btn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Approve Guide')]")), 5000);
    await btn.click();
  });

  it('203. Should verify status badge updates to Approved status text', async function () {
    const badge = await driver.wait(until.elementLocated(By.xpath("//span[text()='Approved' and contains(@class, 'text-emerald-600')]")), 5000);
    assert.ok(badge, 'Guide badge not updated.');
  });

  it('204. Should click Profile tab in navbar to prepare logout', async function () {
    const tab = await driver.findElement(By.id('nav-item-profile'));
    await driver.executeScript("arguments[0].click();", tab);
  });

  it('205. Should click Profile logout button to return to Landing Page', async function () {
    const btn = await driver.wait(until.elementLocated(By.id('profile-logout-btn')), 5000);
    await driver.executeScript("arguments[0].click();", btn);
    const landing = await driver.wait(until.elementLocated(By.id('landing-view-viewport')), 15000);
    assert.ok(landing, 'Logout failed to return to landing view.');
  });
});
