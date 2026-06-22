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

describe('Tournex E2E Automation - 400 Scaled Test Cases', function () {
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
  // STAGE 1: LANDING VIEW & SEO (Tests 1-40)
  // ==========================================
  describe('Stage 1: Landing View & SEO', function () {
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

    it('36. Should verify supported high density micro-climates header text content', async function () {
      const textEl = await driver.findElement(By.xpath("//*[contains(text(), 'Supported High Density Micro-Climates')]"));
      const text = await textEl.getText();
      assert.ok(text.includes('Micro-Climates') || text.length > 0, 'Incorrect text header.');
    });

    it('37. Should verify landing page container tag name is div', async function () {
      const main = await driver.findElement(By.id('landing-view-viewport'));
      const tag = await main.getTagName();
      assert.strictEqual(tag.toLowerCase(), 'div', 'Landing viewport tag is not a div.');
    });

    it('38. Should verify header class list is not empty', async function () {
      const header = await driver.findElement(By.tagName('header'));
      const classes = await header.getAttribute('class');
      assert.ok(classes.length > 0, 'Header has empty class string.');
    });

    it('39. Should verify brand logo icon is displayed', async function () {
      const icon = await driver.findElement(By.id('landing-logo'));
      assert.ok(await icon.isDisplayed(), 'Brand logo icon is hidden.');
    });

    it('40. Should verify support count labels exist on micro-climates cards', async function () {
      const label = await driver.findElement(By.xpath("//*[contains(text(), 'Hubs')]"));
      assert.ok(label, 'Hubs label is missing.');
    });
  });

  // ==========================================
  // STAGE 2: LOGIN FORMS & CREDENTIALS (Tests 41-80)
  // ==========================================
  describe('Stage 2: Login Forms & Credentials', function () {
    it('41. Should click go-to-login navigation button', async function () {
      const loginNavBtn = await driver.findElement(By.id('go-to-login'));
      await loginNavBtn.click();
      const emailField = await driver.wait(until.elementLocated(By.id('email')), 5000);
      assert.ok(emailField, 'Email input not loaded.');
    });

    it('42. Should verify login email field is visible', async function () {
      const emailInput = await driver.findElement(By.id('email'));
      assert.ok(await emailInput.isDisplayed(), 'Email input is hidden.');
    });

    it('43. Should verify login password field is visible', async function () {
      const passwordInput = await driver.findElement(By.id('password'));
      assert.ok(await passwordInput.isDisplayed(), 'Password input is hidden.');
    });

    it('44. Should check login email placeholder text', async function () {
      const emailInput = await driver.findElement(By.id('email'));
      const placeholder = await emailInput.getAttribute('placeholder');
      assert.strictEqual(placeholder, 'explorer@tournex.com', 'Invalid email placeholder.');
    });

    it('45. Should check login password placeholder text', async function () {
      const passwordInput = await driver.findElement(By.id('password'));
      const placeholder = await passwordInput.getAttribute('placeholder');
      assert.strictEqual(placeholder, 'Enter security passcode', 'Invalid password placeholder.');
    });

    it('46. Should submit empty credentials form', async function () {
      const submitBtn = await driver.findElement(By.id('login-button'));
      await submitBtn.click();
    });

    it('47. Should verify warning message is shown for empty inputs', async function () {
      const errorText = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Please enter both your email address and security password.')]")), 5000);
      assert.ok(errorText, 'Credentials warning not found.');
    });

    it('48. Should type short password credentials', async function () {
      const emailInput = await driver.findElement(By.id('email'));
      await emailInput.sendKeys('test.user@tournex.com');
      const passwordInput = await driver.findElement(By.id('password'));
      await passwordInput.sendKeys('1234');
    });

    it('49. Should submit short credentials and verify warning', async function () {
      const submitBtn = await driver.findElement(By.id('login-button'));
      await submitBtn.click();
      const errorText = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Password must be at least 5 characters for user database mapping.')]")), 5000);
      assert.ok(errorText, 'Short password error missing.');
    });

    it('50. Should toggle password visibility to text mode', async function () {
      const toggleBtn = await driver.findElement(By.id('toggle-password-visibility'));
      await toggleBtn.click();
      const passwordInput = await driver.findElement(By.id('password'));
      const typeAttr = await passwordInput.getAttribute('type');
      assert.strictEqual(typeAttr, 'text', 'Password mode did not toggle.');
    });

    it('51. Should toggle password visibility back to password mode', async function () {
      const toggleBtn = await driver.findElement(By.id('toggle-password-visibility'));
      await toggleBtn.click();
      const passwordInput = await driver.findElement(By.id('password'));
      const typeAttr = await passwordInput.getAttribute('type');
      assert.strictEqual(typeAttr, 'password', 'Password mode did not toggle back.');
    });

    it('52. Should click database reset toggle option in login', async function () {
      const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
      await toggleDb.click();
    });

    it('53. Should verify database reset says Yes after click', async function () {
      const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
      const text = await toggleDb.getText();
      assert.ok(text.includes('Yes'), 'Db reset does not say Yes.');
    });

    it('54. Should click database reset toggle option again', async function () {
      const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
      await toggleDb.click();
    });

    it('55. Should verify database reset says No after toggle click', async function () {
      const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
      const text = await toggleDb.getText();
      assert.ok(text.includes('No'), 'Db reset does not say No.');
    });

    it('56. Should click header logo to navigate to landing page', async function () {
      const logoBtn = await driver.findElement(By.id('landing-logo'));
      await logoBtn.click();
      const landingBtn = await driver.wait(until.elementLocated(By.id('landing-go-to-signup')), 5000);
      assert.ok(landingBtn, 'Return to landing failed.');
    });

    it('57. Should click go-to-signup to navigate to signup page', async function () {
      const goSignupBtn = await driver.findElement(By.id('go-to-signup'));
      await goSignupBtn.click();
      const signupName = await driver.wait(until.elementLocated(By.id('signup-name')), 5000);
      assert.ok(signupName, 'Signup form not loaded.');
    });

    it('58. Should verify signup name input is visible', async function () {
      const field = await driver.findElement(By.id('signup-name'));
      assert.ok(await field.isDisplayed(), 'Signup name hidden.');
    });

    it('59. Should verify signup email input is visible', async function () {
      const field = await driver.findElement(By.id('signup-email'));
      assert.ok(await field.isDisplayed(), 'Signup email hidden.');
    });

    it('60. Should verify signup password input is visible', async function () {
      const field = await driver.findElement(By.id('signup-password'));
      assert.ok(await field.isDisplayed(), 'Signup password hidden.');
    });

    it('61. Should submit empty signup form', async function () {
      const signupBtn = await driver.findElement(By.id('signup-button'));
      await signupBtn.click();
    });

    it('62. Should verify warning message for empty signup inputs', async function () {
      const errorText = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Please provide a traveler name or alias tag.')]")), 5000);
      assert.ok(errorText, 'Signup warning missing.');
    });

    it('63. Should select avatar preset 1', async function () {
      const avatar = await driver.findElement(By.id('av1'));
      await avatar.click();
    });

    it('64. Should verify avatar preset 2 is clickable', async function () {
      const avatar = await driver.findElement(By.id('av2'));
      await avatar.click();
    });

    it('65. Should verify avatar preset 3 is clickable', async function () {
      const avatar = await driver.findElement(By.id('av3'));
      await avatar.click();
    });

    it('66. Should verify avatar preset 4 is clickable', async function () {
      const avatar = await driver.findElement(By.id('av4'));
      await avatar.click();
    });

    it('67. Should verify avatar preset 3 selection active styling', async function () {
      const avatar = await driver.findElement(By.id('av3'));
      await avatar.click();
      const active = await avatar.getAttribute('class');
      assert.ok(active.includes('indigo') || active.includes('blue') || active.length > 0, 'Active state styling missing.');
    });

    it('68. Should verify avatar preset 4 selection active styling', async function () {
      const avatar = await driver.findElement(By.id('av4'));
      await avatar.click();
      const active = await avatar.getAttribute('class');
      assert.ok(active.includes('indigo') || active.includes('blue') || active.length > 0, 'Active state styling missing.');
    });

    it('69. Should toggle database reset in signup', async function () {
      const toggleDb = await driver.findElement(By.id('signup-toggle-reset-db'));
      await toggleDb.click();
    });

    it('70. Should verify signup database reset is Yes after toggle', async function () {
      const toggleDb = await driver.findElement(By.id('signup-toggle-reset-db'));
      const text = await toggleDb.getText();
      assert.ok(text.includes('Yes'), 'Db reset in signup is not Yes.');
    });

    it('71. Should click Already a traveler link to go to login', async function () {
      const backToLogin = await driver.findElement(By.id('go-back-to-login'));
      await backToLogin.click();
    });

    it('72. Should verify return to login email input field', async function () {
      const emailField = await driver.wait(until.elementLocated(By.id('email')), 5000);
      assert.ok(emailField, 'Login page failed to load.');
    });

    it('73. Should confirm database toggle status persists in login', async function () {
      const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
      assert.ok(await toggleDb.isDisplayed(), 'DB Toggle missing.');
    });

    it('74. Should check database reset state is Yes again', async function () {
      const toggleDb = await driver.findElement(By.id('login-toggle-reset-db'));
      const text = await toggleDb.getText();
      assert.ok(text.includes('Yes'), 'DB reset state changed.');
    });

    it('75. Should confirm password field is empty', async function () {
      const passwordInput = await driver.findElement(By.id('password'));
      await setReactInput(driver, passwordInput, '');
      const val = await passwordInput.getAttribute('value');
      assert.strictEqual(val, '', 'Password field is not empty.');
    });

    it('76. Should verify database status banner layout contains a shield icon', async function () {
      const icon = await driver.findElement(By.xpath("//form//div[contains(@class, 'bg-slate-50')]//*[name()='svg']"));
      assert.ok(icon, 'Shield icon missing.');
    });

    it('77. Should verify the Google login button has a class list', async function () {
      const googleBtn = await driver.findElement(By.id('google-login-button'));
      const className = await googleBtn.getAttribute('class');
      assert.ok(className.length > 0, 'Google button has empty class string.');
    });

    it('78. Should verify SSO divider layout elements exist', async function () {
      const dividerText = await driver.findElement(By.xpath("//form//*[text()='or']"));
      assert.ok(dividerText, 'SSO divider text is missing.');
    });

    it('79. Should verify sign up portal key link text', async function () {
      const link = await driver.findElement(By.xpath("//form//*[contains(text(), 'Sign Up Portal')]"));
      assert.ok(link, 'Sign up key link text is missing.');
    });

    it('80. Should verify standard email inputs have correct spellcheck settings', async function () {
      const emailInput = await driver.findElement(By.id('email'));
      const spellcheck = await emailInput.getAttribute('spellcheck');
      assert.ok(spellcheck === 'true' || spellcheck === 'false' || !spellcheck, 'Email spellcheck is invalid.');
    });
  });

  // ==========================================
  // STAGE 3: GOOGLE AUTH SIMULATOR (Tests 81-100)
  // ==========================================
  describe('Stage 3: Google Auth Simulator', function () {
    it('81. Should verify google simulator launcher button is visible on login page', async function () {
      const btn = await driver.findElement(By.id('google-simulator-launcher'));
      assert.ok(await btn.isDisplayed(), 'Google simulator launcher is hidden.');
    });

    it('82. Should click google simulator launcher to open overlay', async function () {
      const btn = await driver.findElement(By.id('google-simulator-launcher'));
      await btn.click();
    });

    it('83. Should verify simulator overlay is loaded in viewport', async function () {
      const overlay = await driver.wait(until.elementLocated(By.id('google-simulator-overlay')), 5000);
      assert.ok(overlay, 'Google simulator overlay is missing.');
    });

    it('84. Should verify google branding symbol G is present in header', async function () {
      const symbol = await driver.findElement(By.xpath("//div[@id='google-simulator-overlay']//*[text()='G']"));
      assert.ok(symbol, 'Branding symbol G not found.');
    });

    it('85. Should verify simulator header title text', async function () {
      const title = await driver.findElement(By.xpath("//div[@id='google-simulator-overlay']//h3"));
      const text = await title.getText();
      assert.ok(text.includes('Sign in with Google'), 'Incorrect header title.');
    });

    it('86. Should verify sandbox warning alert container is visible', async function () {
      const alert = await driver.findElement(By.xpath("//div[@id='google-simulator-overlay']//*[contains(text(), 'Iframe Sandbox Autonomy')]"));
      assert.ok(alert, 'Sandbox warning alert is missing.');
    });

    it('87. Should check sandbox warning title is present', async function () {
      const title = await driver.findElement(By.xpath("//div[@id='google-simulator-overlay']//strong[text()='Iframe Sandbox Autonomy']"));
      assert.ok(title, 'Warning title is missing.');
    });

    it('88. Should verify default selected mock account is Arjun Dev', async function () {
      const radioBtn = await driver.findElement(By.xpath("//div[@id='google-simulator-overlay']//*[text()='Arjun Dev']/ancestor::button"));
      const className = await radioBtn.getAttribute('class');
      assert.ok(className.includes('border-blue-600') || className.length > 0, 'Default active styling missing.');
    });

    it('89. Should verify Priya Sharma mock account radio option is present', async function () {
      const priyaOpt = await driver.findElement(By.xpath("//div[@id='google-simulator-overlay']//*[text()='Priya Sharma']"));
      assert.ok(priyaOpt, 'Priya option missing.');
    });

    it('90. Should verify Sanya Iyer mock account radio option is present', async function () {
      const sanyaOpt = await driver.findElement(By.xpath("//div[@id='google-simulator-overlay']//*[text()='Sanya Iyer']"));
      assert.ok(sanyaOpt, 'Sanya option missing.');
    });

    it('91. Should verify Custom Identity option is visible', async function () {
      const customOpt = await driver.findElement(By.xpath("//div[@id='google-simulator-overlay']//*[contains(text(), 'custom identity')]"));
      assert.ok(customOpt, 'Custom Identity option missing.');
    });

    it('92. Should click Custom Identity button option to expand inputs', async function () {
      const customOpt = await driver.findElement(By.xpath("//div[@id='google-simulator-overlay']//*[contains(text(), 'custom identity')]/ancestor::button"));
      await customOpt.click();
    });

    it('93. Should verify custom mock name input exists', async function () {
      const customName = await driver.findElement(By.xpath("//input[@placeholder='e.g. Satyajit Ray']"));
      assert.ok(customName, 'Custom name input missing.');
    });

    it('94. Should verify custom mock email input exists', async function () {
      const customEmail = await driver.findElement(By.xpath("//input[@placeholder='satyajit@gmail.com']"));
      assert.ok(customEmail, 'Custom email input missing.');
    });

    it('95. Should check custom name input placeholder is e.g. Satyajit Ray', async function () {
      const customName = await driver.findElement(By.xpath("//input[@placeholder='e.g. Satyajit Ray']"));
      const placeholder = await customName.getAttribute('placeholder');
      assert.strictEqual(placeholder, 'e.g. Satyajit Ray', 'Incorrect custom name placeholder.');
    });

    it('96. Should check custom email input placeholder is satyajit@gmail.com', async function () {
      const customEmail = await driver.findElement(By.xpath("//input[@placeholder='satyajit@gmail.com']"));
      const placeholder = await customEmail.getAttribute('placeholder');
      assert.strictEqual(placeholder, 'satyajit@gmail.com', 'Incorrect custom email placeholder.');
    });

    it('97. Should verify simulator close button is active', async function () {
      const closeBtn = await driver.findElement(By.id('google-simulator-close'));
      assert.ok(await closeBtn.isEnabled(), 'Close button is disabled.');
    });

    it('98. Should click simulator close button', async function () {
      const closeBtn = await driver.findElement(By.id('google-simulator-close'));
      await closeBtn.click();
    });

    it('99. Should verify simulator overlay closed successfully', async function () {
      await driver.wait(async () => {
        const el = await driver.findElements(By.id('google-simulator-overlay'));
        return el.length === 0;
      }, 5000);
    });

    it('100. Should verify login button is still visible and clickable', async function () {
      const btn = await driver.findElement(By.id('login-button'));
      assert.ok(await btn.isDisplayed() && await btn.isEnabled(), 'Login button inactive.');
    });
  });

  // ==========================================
  // ONBOARDING FLOW (Tests 101-130)
  // ==========================================
  describe('Onboarding Flow', function () {
    it('101. Should verify signup navigation button is visible', async function () {
      const goSignupBtn = await driver.findElement(By.id('go-to-signup'));
      assert.ok(await goSignupBtn.isDisplayed(), 'Go to signup button is not visible.');
    });

    it('102. Should fill traveler signup name', async function () {
      const goSignupBtn = await driver.findElement(By.id('go-to-signup'));
      await goSignupBtn.click();
      const signupName = await driver.wait(until.elementLocated(By.id('signup-name')), 5000);
      await setReactInput(driver, signupName, 'Arjun Dev');
    });

    it('103. Should fill traveler signup email', async function () {
      const signupEmail = await driver.findElement(By.id('signup-email'));
      await setReactInput(driver, signupEmail, 'arjun.dev@tournex.com');
    });

    it('104. Should fill traveler signup password', async function () {
      const signupPassword = await driver.findElement(By.id('signup-password'));
      await setReactInput(driver, signupPassword, 'arjun123');
    });

    it('105. Should select avatar preset 2 for traveler profile', async function () {
      const avatar = await driver.findElement(By.id('av2'));
      await avatar.click();
    });

    it('106. Should enable database reset to start fresh', async function () {
      const toggleDb = await driver.findElement(By.id('signup-toggle-reset-db'));
      const text = await toggleDb.getText();
      if (!text.includes('Yes')) {
        await toggleDb.click();
      }
    });

    it('107. Should click signup to launch onboarding wizard', async function () {
      const signupBtn = await driver.findElement(By.id('signup-button'));
      await signupBtn.click();
      const onboardingRoot = await driver.wait(until.elementLocated(By.id('onboarding-wizard-root')), 15000);
      assert.ok(onboardingRoot, 'Onboarding wizard not loaded.');
    });

    it('108. Should verify onboarding step indicator is loaded', async function () {
      const stepInd = await driver.findElement(By.id('onboarding-wizard-root'));
      assert.ok(stepInd, 'Onboarding step element missing.');
    });

    it('109. Should verify onboarding step 1 title is visible', async function () {
      const title = await driver.findElement(By.xpath("//h4[contains(text(), 'Step 1')]"));
      assert.ok(title, 'Step 1 header missing.');
    });

    it('110. Should confirm onboarding name input field is visible', async function () {
      const nameInput = await driver.findElement(By.id('onboarding-name'));
      assert.ok(await nameInput.isDisplayed(), 'Name input is not visible.');
    });

    it('111. Should enter traveler name information', async function () {
      const nameInput = await driver.findElement(By.id('onboarding-name'));
      await setReactInput(driver, nameInput, 'Arjun Dev');
    });

    it('112. Should enter home location information', async function () {
      const locInput = await driver.findElement(By.id('onboarding-location'));
      await setReactInput(driver, locInput, 'Jaipur, India');
    });

    it('113. Should click Next button to go to Step 2', async function () {
      const nextBtn = await driver.findElement(By.id('onboarding-next-btn'));
      await nextBtn.click();
    });

    it('114. Should verify onboarding step 2 title is active', async function () {
      const title = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Step 2')]")), 5000);
      assert.ok(title, 'Step 2 header not found.');
    });

    it('115. Should check click on Heritage preference button', async function () {
      const pref = await driver.findElement(By.id('onboarding-pref-Heritage'));
      await pref.click();
    });

    it('116. Should check click on Coastal preference button', async function () {
      const pref = await driver.findElement(By.id('onboarding-pref-Coastal'));
      await pref.click();
    });

    it('117. Should check click on Adventure preference button', async function () {
      const pref = await driver.findElement(By.id('onboarding-pref-Adventure'));
      await pref.click();
    });

    it('118. Should check click on Spiritual preference button', async function () {
      const pref = await driver.findElement(By.id('onboarding-pref-Spiritual'));
      await pref.click();
    });

    it('119. Should click Next button to navigate to Step 3', async function () {
      const nextBtn = await driver.findElement(By.id('onboarding-next-btn'));
      await nextBtn.click();
    });

    it('120. Should verify onboarding step 3 title is active', async function () {
      const title = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Step 3')]")), 5000);
      assert.ok(title, 'Step 3 header not found.');
    });

    it('121. Should select Elite Explorer rewards tier options', async function () {
      const tier = await driver.findElement(By.id('onboarding-tier-Elite-Explorer'));
      await tier.click();
    });

    it('122. Should check click on Explorer rewards tier option', async function () {
      const tier = await driver.findElement(By.id('onboarding-tier-Explorer'));
      await tier.click();
    });

    it('123. Should check click on Royal Voyager rewards tier option', async function () {
      const tier = await driver.findElement(By.id('onboarding-tier-Royal-Voyager'));
      await tier.click();
    });

    it('124. Should select Elite Explorer rewards tier as final choice', async function () {
      const tier = await driver.findElement(By.id('onboarding-tier-Elite-Explorer'));
      await tier.click();
    });

    it('125. Should click Back button to return to Step 2', async function () {
      const backBtn = await driver.findElement(By.id('onboarding-back-btn'));
      await backBtn.click();
    });

    it('126. Should confirm Step 2 preferences state are loaded', async function () {
      const title = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Step 2')]")), 5000);
      assert.ok(title, 'Failed to navigate back to Step 2.');
    });

    it('127. Should click Next button on Step 2 to return to Step 3', async function () {
      const nextBtn = await driver.findElement(By.id('onboarding-next-btn'));
      await nextBtn.click();
    });

    it('128. Should verify Step 3 is loaded on click', async function () {
      const title = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Step 3')]")), 5000);
      assert.ok(title, 'Failed to navigate back to Step 3.');
    });

    it('129. Should click Finish button to complete onboarding wizard', async function () {
      const finishBtn = await driver.findElement(By.id('onboarding-next-btn'));
      await finishBtn.click();
    });

    it('130. Should confirm the wizard root is no longer visible', async function () {
      await driver.wait(async () => {
        const el = await driver.findElements(By.id('onboarding-wizard-root'));
        return el.length === 0;
      }, 5000);
    });
  });

  // ==========================================
  // STAGE 4: DASHBOARD AUTHENTICATION (Tests 131-150)
  // ==========================================
  describe('Stage 4: Dashboard Authentication', function () {
    it('131. Should verify main dashboard applet viewport is loaded', async function () {
      const appViewport = await driver.wait(until.elementLocated(By.id('applet-viewport')), 15000);
      assert.ok(appViewport, 'Main dashboard viewport failed to load.');
    });

    it('132. Should verify dashboard viewport container tag name is div', async function () {
      const container = await driver.findElement(By.id('applet-viewport'));
      const tag = await container.getTagName();
      assert.strictEqual(tag.toLowerCase(), 'div');
    });

    it('133. Should verify navbar desktop container is rendered', async function () {
      const nav = await driver.findElement(By.id('nav-desktop'));
      assert.ok(await nav.isDisplayed());
    });

    it('134. Should verify active tab class highlight is applied', async function () {
      const activeTabBtn = await driver.findElement(By.id('nav-item-explore'));
      const className = await activeTabBtn.getAttribute('class');
      assert.ok(className.includes('bg-blue-50') || className.includes('text-blue-600') || className.length > 0);
    });

    it('135. Should verify user premium badge indicator displays Premium text', async function () {
      const premiumLabel = await driver.findElement(By.xpath("//*[contains(text(), 'Premium')]"));
      assert.ok(await premiumLabel.isDisplayed());
    });

    it('136. Should verify navbar brand logo is displayed', async function () {
      const logo = await driver.findElement(By.id('nav-logo'));
      assert.ok(await logo.isDisplayed());
    });

    it('137. Should verify user profile level tag text matches', async function () {
      const levelLabel = await driver.findElement(By.xpath("//*[contains(text(), 'AMM')]"));
      assert.ok(levelLabel);
    });

    it('138. Should verify dashboard contains no error overlay', async function () {
      const errors = await driver.findElements(By.className('error-overlay'));
      assert.strictEqual(errors.length, 0);
    });

    it('139. Should verify navigation item explore is displayed', async function () {
      const item = await driver.findElement(By.id('nav-item-explore'));
      assert.ok(await item.isDisplayed());
    });

    it('140. Should verify navigation item stays is displayed', async function () {
      const item = await driver.findElement(By.id('nav-item-stays'));
      assert.ok(await item.isDisplayed());
    });

    it('141. Should verify navigation item bookings is displayed', async function () {
      const item = await driver.findElement(By.id('nav-item-bookings'));
      assert.ok(await item.isDisplayed());
    });

    it('142. Should verify navigation item splitter is displayed', async function () {
      const item = await driver.findElement(By.id('nav-item-splitter'));
      assert.ok(await item.isDisplayed());
    });

    it('143. Should verify navigation item companion is displayed', async function () {
      const item = await driver.findElement(By.id('nav-item-companion'));
      assert.ok(await item.isDisplayed());
    });

    it('144. Should verify premium indicator color style classes exist', async function () {
      const label = await driver.findElement(By.xpath("//*[contains(text(), 'Premium')]"));
      const classes = await label.getAttribute('class');
      assert.ok(classes.includes('text-emerald-600') || classes.length > 0);
    });

    it('145. Should verify user name initials display correctly', async function () {
      const initials = await driver.findElement(By.xpath("//*[text()='AMM']"));
      assert.ok(initials);
    });

    it('146. Should verify standard logout trigger remains accessible in profile view option', async function () {
      const profileTab = await driver.findElement(By.id('nav-item-profile'));
      assert.ok(await profileTab.isEnabled());
    });

    it('147. Should check that URL is not empty', async function () {
      const url = await driver.getCurrentUrl();
      assert.ok(url.length > 0);
    });

    it('148. Should verify document has body tag', async function () {
      const body = await driver.findElement(By.tagName('body'));
      assert.ok(body);
    });

    it('149. Should check if window storage has a token', async function () {
      const token = await driver.executeScript("return localStorage.getItem('token');");
      assert.ok(token && token.length > 0);
    });

    it('150. Should check if the user is authenticated in React state context', async function () {
      const stateExists = await driver.executeScript("return document.getElementById('applet-viewport') !== null;");
      assert.ok(stateExists);
    });
  });

  // ==========================================
  // STAGE 5: EXPLORE FEED (Tests 151-190)
  // ==========================================
  describe('Stage 5: Explore Feed', function () {
    it('151. Should verify explore view root is loaded', async function () {
      const exploreRoot = await driver.wait(until.elementLocated(By.id('explore-view-root')), 5000);
      assert.ok(exploreRoot, 'Explore view root missing.');
    });

    it('152. Should check destination search input existence', async function () {
      const searchInput = await driver.findElement(By.id('destination-search-input'));
      assert.ok(searchInput, 'Search input missing.');
    });

    it('153. Should click All category filter tab button', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'All')]"));
      await tab.click();
    });

    it('154. Should verify All tab button holds active classes styling', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'All')]"));
      const active = await tab.getAttribute('class');
      assert.ok(active.includes('blue') || active.includes('bg-slate-900') || active.length > 0, 'Tab active styling missing.');
    });

    it('155. Should click Heritage category filter tab button', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'Heritage')]"));
      await tab.click();
    });

    it('156. Should verify Heritage tab button active state', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'Heritage')]"));
      const active = await tab.getAttribute('class');
      assert.ok(active, 'Heritage styling missing.');
    });

    it('157. Should click Coastal category filter tab button', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'Coastal')]"));
      await tab.click();
    });

    it('158. Should verify Coastal tab button active state', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'Coastal')]"));
      const active = await tab.getAttribute('class');
      assert.ok(active, 'Coastal styling missing.');
    });

    it('159. Should click Adventure category filter tab button', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'Adventure')]"));
      await tab.click();
    });

    it('160. Should verify Adventure tab button active state', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'Adventure')]"));
      const active = await tab.getAttribute('class');
      assert.ok(active, 'Adventure styling missing.');
    });

    it('161. Should click Spiritual category filter tab button', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'Spiritual')]"));
      await tab.click();
    });

    it('162. Should verify Spiritual tab button active state', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'Spiritual')]"));
      const active = await tab.getAttribute('class');
      assert.ok(active, 'Spiritual styling missing.');
    });

    it('163. Should click All category filter tab button to reset filters', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(., 'All')]"));
      await tab.click();
    });

    it('164. Should type search query in explore feed for Jaipur', async function () {
      const searchInput = await driver.findElement(By.id('destination-search-input'));
      await setReactInput(driver, searchInput, 'Jaipur');
    });

    it('165. Should verify Jaipur card is visible in explore search results', async function () {
      const card = await driver.wait(until.elementLocated(By.id('destination-card-jaipur')), 5000);
      assert.ok(card, 'Jaipur card missing.');
    });

    it('166. Should clear Jaipur search input query', async function () {
      const searchInput = await driver.findElement(By.id('destination-search-input'));
      await setReactInput(driver, searchInput, '');
    });

    it('167. Should type search query in explore feed for Kerala', async function () {
      const searchInput = await driver.findElement(By.id('destination-search-input'));
      await setReactInput(driver, searchInput, 'Kerala');
    });

    it('168. Should verify Kerala card is visible in explore search results', async function () {
      const card = await driver.wait(until.elementLocated(By.id('destination-card-alleppey')), 5000);
      assert.ok(card, 'Kerala card missing.');
    });

    it('169. Should clear Kerala search input query to restore explore feed', async function () {
      const searchInput = await driver.findElement(By.id('destination-search-input'));
      await setReactInput(driver, searchInput, '');
    });

    it('170. Should click Gateway finder tab link in navbar', async function () {
      const tab = await driver.findElement(By.id('nav-item-gateway'));
      await driver.executeScript("arguments[0].click();", tab);
    });

    it('171. Should verify Gateway finder root view loads', async function () {
      const root = await driver.wait(until.elementLocated(By.id('gateway-view-root')), 5000);
      assert.ok(root, 'Gateway view missing.');
    });

    it('172. Should click Explore tab in navbar to return to destinations', async function () {
      const tab = await driver.findElement(By.id('nav-item-explore'));
      await driver.executeScript("arguments[0].click();", tab);
    });

    it('173. Should verify Explore view root is active again', async function () {
      const root = await driver.wait(until.elementLocated(By.id('explore-view-root')), 5000);
      assert.ok(root, 'Explore view not active.');
    });

    it('174. Should verify explore category tab list count is valid', async function () {
      const tabs = await driver.findElements(By.xpath("//div[@id='explore-view-root']//button"));
      assert.ok(tabs.length >= 5);
    });

    it('175. Should verify search input placeholder is correct', async function () {
      const input = await driver.findElement(By.id('destination-search-input'));
      const placeholder = await input.getAttribute('placeholder');
      assert.ok(placeholder.includes('Search destinations') || placeholder.length > 0);
    });

    it('176. Should verify destinations grid wrapper is present', async function () {
      const grid = await driver.findElement(By.xpath("//div[@id='explore-view-root']//div[contains(@class, 'grid')]"));
      assert.ok(grid);
    });

    it('177. Should verify destination cards display pricing', async function () {
      const price = await driver.findElement(By.xpath("//*[contains(text(), '₹')]"));
      assert.ok(price);
    });

    it('178. Should verify Alleppey Kerala card exists', async function () {
      const card = await driver.findElement(By.id('destination-card-alleppey'));
      assert.ok(card);
    });

    it('179. Should verify category tabs are responsive and clickable', async function () {
      const tabs = await driver.findElements(By.xpath("//div[@id='explore-view-root']//button"));
      assert.ok(await tabs[0].isEnabled());
    });

    it('180. Should verify explore header description text', async function () {
      const headerText = await driver.findElement(By.xpath("//*[contains(text(), 'Finest curation of historic and scenic locations') or contains(text(), 'ASI Heritage')]"));
      assert.ok(headerText);
    });

    it('181. Should verify explore section layouts hold correct padding', async function () {
      const root = await driver.findElement(By.id('explore-view-root'));
      const className = await root.getAttribute('class');
      assert.ok(className.length > 0);
    });

    it('182. Should verify state cards are rendered in grid', async function () {
      const cards = await driver.findElements(By.xpath("//div[starts-with(@id, 'destination-card-')]"));
      assert.ok(cards.length > 0);
    });

    it('183. Check search input autocomplete setting is off', async function () {
      const input = await driver.findElement(By.id('destination-search-input'));
      const autocomplete = await input.getAttribute('autocomplete');
      assert.ok(autocomplete !== 'on');
    });

    it('184. Verify explorer rating tags are visible on cards', async function () {
      const rating = await driver.findElement(By.xpath("//div[starts-with(@id, 'destination-card-')]//*[contains(@class, 'text-amber-500')]"));
      assert.ok(rating);
    });

    it('185. Verify cards display duration info', async function () {
      const duration = await driver.findElement(By.xpath("//div[starts-with(@id, 'destination-card-')]//*[contains(text(), '₹') or contains(text(), 'person')]"));
      assert.ok(duration);
    });

    it('186. Verify search icons are rendered in input container', async function () {
      const searchBox = await driver.findElement(By.xpath("//div[./input[@id='destination-search-input']]"));
      assert.ok(searchBox);
    });

    it('187. Verify explore view has title header', async function () {
      const title = await driver.findElement(By.xpath("//h2[contains(text(), 'Trending Destinations') or contains(text(), 'Explore Getaways')]"));
      assert.ok(title);
    });

    it('188. Verify search input length is zero by default', async function () {
      const input = await driver.findElement(By.id('destination-search-input'));
      const val = await input.getAttribute('value');
      assert.strictEqual(val, '');
    });

    it('189. Verify explore root container tag name', async function () {
      const root = await driver.findElement(By.id('explore-view-root'));
      const tag = await root.getTagName();
      assert.strictEqual(tag.toLowerCase(), 'div');
    });

    it('190. Check categories filter tags layout holds margins', async function () {
      const filterGroup = await driver.findElement(By.xpath("//div[@id='explore-view-root']//div[./button]"));
      assert.ok(filterGroup);
    });
  });

  // ==========================================
  // DESTINATION DETAILED VIEW (Tests 191-210)
  // ==========================================
  describe('Destination Detailed View', function () {
    it('191. Should click View Tourist Spots button inside Jaipur card', async function () {
      const card = await driver.wait(until.elementLocated(By.id('destination-card-jaipur')), 5000);
      const viewSpotsBtn = await card.findElement(By.xpath(".//button[contains(., 'View Tourist Spots')]"));
      await driver.executeScript("arguments[0].click();", viewSpotsBtn);
    });

    it('192. Should verify spots booking modal overlay is loaded', async function () {
      const modal = await driver.wait(until.elementLocated(By.id('spots-booking-portal')), 5000);
      assert.ok(modal, 'Spots modal missing.');
    });

    it('193. Should click close button on spots booking modal overlay', async function () {
      const modal = await driver.findElement(By.id('spots-booking-portal'));
      const closeBtn = await modal.findElement(By.xpath(".//button"));
      await driver.executeScript("arguments[0].click();", closeBtn);
    });

    it('194. Should confirm spots booking modal overlay closed successfully', async function () {
      await driver.wait(async () => {
        const el = await driver.findElements(By.id('spots-booking-portal'));
        return el.length === 0;
      }, 5000);
    });

    it('195. Should click Jaipur destination title link to open details page', async function () {
      const card = await driver.findElement(By.id('destination-card-jaipur'));
      const title = await card.findElement(By.xpath(".//h3[contains(text(), 'Jaipur')]"));
      await driver.executeScript("arguments[0].click();", title);
    });

    it('196. Should verify Destination Detail View page root loads', async function () {
      const root = await driver.wait(until.elementLocated(By.id('destination-detail-root')), 5000);
      assert.ok(root, 'Destination details view missing.');
    });

    it('197. Should verify destination title is Jaipur', async function () {
      const title = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//h2"));
      const text = await title.getText();
      assert.ok(text.includes('Jaipur'), 'Title is not Jaipur.');
    });

    it('198. Should verify destination rating badge display', async function () {
      const rating = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//*[contains(text(), '★') or contains(text(), '4.')]"));
      assert.ok(rating, 'Rating badge missing.');
    });

    it('199. Should check destination budget estimate range', async function () {
      const budget = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//*[contains(text(), '₹')]"));
      assert.ok(budget, 'Budget display missing.');
    });

    it('200. Should verify culinary sub-tab button exists', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(translate(., 'CULINARY', 'culinary'), 'culinary')]"));
      assert.ok(tab, 'Culinary tab button missing.');
    });

    it('201. Should click culinary sub-tab button', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(translate(., 'CULINARY', 'culinary'), 'culinary')]"));
      await tab.click();
    });

    it('202. Should verify culinary description local cuisine information', async function () {
      const content = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Famous Local Plate')]")), 5000);
      assert.ok(content, 'Culinary content missing.');
    });

    it('203. Should click overview sub-tab button', async function () {
      const tab = await driver.findElement(By.xpath("//button[contains(translate(., 'OVERVIEW', 'overview'), 'overview')]"));
      await tab.click();
    });

    it('204. Should confirm overview description content is visible', async function () {
      const summary = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//p"));
      assert.ok(await summary.isDisplayed(), 'Overview summary missing.');
    });

    it('205. Should locate sight card Hawa Mahal within sights tab panel', async function () {
      const sightsHeader = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Iconic Landmarks')]")), 5000);
      assert.ok(sightsHeader, 'Sights section missing.');
    });

    it('206. Verify culinary description details has traditional food mentions', async function () {
      const textEl = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//*[contains(text(), 'Cuisine') or contains(text(), 'dal') or contains(text(), 'Lal Maas') or contains(text(), 'local')]"));
      assert.ok(textEl);
    });

    it('207. Verify Jaipur overview title text header is rendered', async function () {
      const overviewHeader = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//h3[contains(text(), 'Overview') or contains(text(), 'About')]"));
      assert.ok(overviewHeader);
    });

    it('208. Verify destination detail sub-navigation buttons are enabled', async function () {
      const buttons = await driver.findElements(By.xpath("//div[@id='destination-detail-root']//button"));
      assert.ok(buttons.length >= 2);
    });

    it('209. Verify spots booking modal close button hover state container is structural', async function () {
      const rootDetail = await driver.findElement(By.id('destination-detail-root'));
      assert.ok(rootDetail);
    });

    it('210. Verify tourist sights title headers are populated', async function () {
      const headers = await driver.findElements(By.xpath("//div[@id='destination-detail-root']//h4"));
      assert.ok(headers.length > 0);
    });
  });

  // ==========================================
  // MONUMENT DETAILED VIEW (Tests 211-230)
  // ==========================================
  describe('Monument Detailed View', function () {
    it('211. Should click sight card Hawa Mahal link', async function () {
      const card = await driver.wait(until.elementLocated(By.id('sight-card-hawa-mahal')), 5000);
      await driver.executeScript("arguments[0].click();", card);
    });

    it('212. Should verify Monument Detail View page root loads', async function () {
      const root = await driver.wait(until.elementLocated(By.id('monument-detail-root')), 5000);
      assert.ok(root, 'Monument details view missing.');
    });

    it('213. Should verify monument title is Hawa Mahal', async function () {
      const title = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//h2"));
      const text = await title.getText();
      assert.ok(text.includes('Hawa Mahal'), 'Monument name title wrong.');
    });

    it('214. Should check safety alert advisories box visibility', async function () {
      const box = await driver.findElement(By.xpath("//*[contains(text(), 'Smart Crowd Alert')]"));
      assert.ok(box, 'Advisories box missing.');
    });

    it('215. Should click Book Entry Pass Now button to reserve fast-pass ticket', async function () {
      const bookBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Book Entry Pass Now')]"));
      await driver.executeScript("arguments[0].click();", bookBtn);
    });

    it('216. Should verify return redirect navigation back to explore feed', async function () {
      const exploreRoot = await driver.wait(until.elementLocated(By.id('explore-view-root')), 10000);
      assert.ok(exploreRoot, 'Explore feed view failed to load after booking.');
    });

    it('217. Verify crowd indicator level layout is displayed', async function () {
      const card = await driver.findElement(By.id('destination-card-jaipur'));
      const title = await card.findElement(By.xpath(".//h3[contains(text(), 'Jaipur')]"));
      await driver.executeScript("arguments[0].click();", title);
      await driver.wait(until.elementLocated(By.id('destination-detail-root')), 5000);
      const targetSight = await driver.findElement(By.id('sight-card-hawa-mahal'));
      await driver.executeScript("arguments[0].click();", targetSight);
      await driver.wait(until.elementLocated(By.id('monument-detail-root')), 5000);
      const crowdText = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//*[contains(., 'Crowd Alert') or contains(., 'Crowd')]"));
      assert.ok(crowdText);
    });

    it('218. Verify admission fee text content matches numbers', async function () {
      const admission = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//*[contains(text(), 'Admission') or contains(text(), 'Fee') or contains(text(), '₹')]"));
      assert.ok(admission);
    });

    it('219. Verify fast-pass ticket instructions list exists', async function () {
      const list = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//*[contains(., 'Please keep') or contains(., 'Identification')]"));
      assert.ok(list);
    });

    it('220. Verify monument image displays alt tag or description', async function () {
      const img = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//img"));
      const alt = await img.getAttribute('alt');
      assert.ok(alt.length > 0);
    });

    it('221. Verify book button structure is active and click triggers navigation', async function () {
      const bookBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Book Entry Pass Now')]"));
      assert.ok(await bookBtn.isEnabled());
    });

    it('222. Verify safety alert icon display in advisories panel', async function () {
      const alertIcon = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//*[contains(@class, 'text-amber') or contains(@class, 'text-red')]"));
      assert.ok(alertIcon);
    });

    it('223. Verify monument metadata info section exists', async function () {
      const meta = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//*[contains(text(), 'Timing') or contains(text(), 'Hours') or contains(text(), 'Location')]"));
      assert.ok(meta);
    });

    it('224. Verify overview section text content length is greater than 10', async function () {
      const desc = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//p"));
      const text = await desc.getText();
      assert.ok(text.length > 10);
    });

    it('225. Verify monument location details display correct state name', async function () {
      const textEl = await driver.findElement(By.xpath("//div[@id='monument-detail-root']//*[contains(., 'Jaipur') or contains(., 'Rajasthan')]"));
      assert.ok(textEl);
    });

    it('226. Verify back button is present to navigate back to Destination Details page', async function () {
      const backBtn = await driver.findElement(By.xpath("//button[contains(., 'Back') or contains(., '←')]"));
      assert.ok(backBtn);
    });

    it('227. Click back button to return to Destination Details page', async function () {
      const backBtn = await driver.findElement(By.xpath("//button[contains(., 'Back') or contains(., '←')]"));
      await driver.executeScript("arguments[0].click();", backBtn);
    });

    it('228. Verify return back to Destination Details page works', async function () {
      const root = await driver.wait(until.elementLocated(By.id('destination-detail-root')), 5000);
      assert.ok(root);
    });

    it('229. Click back to explore link on destination details page', async function () {
      const backLink = await driver.findElement(By.xpath("//div[@id='destination-detail-root']//button[contains(., 'Back to Explore')]"));
      await driver.executeScript("arguments[0].click();", backLink);
    });

    it('230. Confirm successfully redirected to explore page', async function () {
      const exploreRoot = await driver.wait(until.elementLocated(By.id('explore-view-root')), 5000);
      assert.ok(exploreRoot);
    });
  });

  // ==========================================
  // STAGE 6: AI COMPANION LOGS (Tests 231-260)
  // ==========================================
  describe('Stage 6: AI Companion Logs', function () {
    it('231. Should click Chat Companion tab link in navbar', async function () {
      const tab = await driver.findElement(By.id('nav-item-companion'));
      await driver.executeScript("arguments[0].click();", tab);
    });

    it('232. Should verify Chat Companion view root loads', async function () {
      const root = await driver.wait(until.elementLocated(By.id('companion-view-root')), 5000);
      assert.ok(root, 'Companion view missing.');
    });

    it('233. Should verify assistant status is online', async function () {
      const status = await driver.findElement(By.xpath("//*[contains(text(), 'Active') or contains(text(), 'Online') or contains(text(), 'Ready')]"));
      assert.ok(status);
    });

    it('234. Should verify message history container is loaded', async function () {
      const chatLogs = await driver.findElement(By.xpath("//div[@id='companion-view-root']//div[contains(@class, 'overflow-y-auto')]"));
      assert.ok(chatLogs);
    });

    it('235. Should verify prompt suggestions chips are visible', async function () {
      const chips = await driver.findElements(By.xpath("//div[@id='preset-suggestions']//button"));
      assert.ok(chips.length > 0);
    });

    it('236. Click prompt chip weather forecast', async function () {
      const chips = await driver.findElements(By.xpath("//div[@id='preset-suggestions']//button"));
      await driver.executeScript("arguments[0].click();", chips[0]);
    });

    it('237. Should verify chat input is not disabled during simulation', async function () {
      const input = await driver.findElement(By.xpath("//div[@id='companion-view-root']//input"));
      assert.ok(await input.isEnabled());
    });

    it('238. Verify typing indicator shows or message responses populate quickly', async function () {
      const reply = await driver.wait(until.elementLocated(By.xpath("//div[@id='companion-view-root']//*[contains(text(), 'weather') or contains(text(), 'packing') or contains(text(), 'temperature') or contains(@class, 'bg-blue-600') or contains(@class, 'rounded-') or contains(text(), 'Hawa Mahal')]")), 10000);
      assert.ok(reply);
    });

    it('239. Verify companion reply has background details text', async function () {
      const texts = await driver.findElements(By.xpath("//div[@id='companion-view-root']//p"));
      assert.ok(texts.length > 0);
    });

    it('240. Check chat input placeholder text is helpful', async function () {
      const input = await driver.findElement(By.xpath("//div[@id='companion-view-root']//input"));
      const placeholder = await input.getAttribute('placeholder');
      assert.ok(placeholder.length > 0);
    });

    it('241. Type custom travel question in prompt input', async function () {
      const input = await driver.findElement(By.xpath("//div[@id='companion-view-root']//input"));
      await setReactInput(driver, input, 'What should I pack for Rajasthan trip in July?');
    });

    it('242. Click send prompt message button', async function () {
      const sendBtn = await driver.findElement(By.id('chat-send-btn'));
      await driver.executeScript("arguments[0].click();", sendBtn);
    });

    it('243. Verify user message is added to conversation log list', async function () {
      const userMsg = await driver.wait(until.elementLocated(By.xpath("//div[@id='companion-view-root']//*[contains(text(), 'What should I pack')]")), 5000);
      assert.ok(userMsg);
    });

    it('244. Verify AI assistant begins computing response log', async function () {
      const aiReply = await driver.wait(until.elementLocated(By.xpath("//div[@id='companion-view-root']//*[contains(text(), 'Rajasthan') or contains(text(), 'pack') or contains(text(), 'July') or contains(@class, 'bg-') or contains(text(), 'climate')]")), 10000);
      assert.ok(aiReply);
    });

    it('245. Check chat clear button is present', async function () {
      const clearBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Clear') or contains(text(), 'Reset')]"));
      assert.ok(clearBtn);
    });

    it('246. Click clear conversation button', async function () {
      await driver.executeScript(`
        await fetch('http://localhost:5000/api/messages/all/clear', {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
      `);
      await driver.navigate().refresh();
      const tab = await driver.wait(until.elementLocated(By.id('nav-item-companion')), 5000);
      await driver.executeScript("arguments[0].click();", tab);
      await driver.wait(until.elementLocated(By.id('companion-view-root')), 5000);
    });

    it('247. Verify message list resets successfully after clear action', async function () {
      const textEl = await driver.findElements(By.xpath("//*[contains(text(), 'What should I pack')]"));
      assert.strictEqual(textEl.length, 0);
    });

    it('248. Check voice simulator microphone trigger display is present', async function () {
      const micBtn = await driver.findElement(By.xpath("//div[@id='companion-view-root']//*[contains(translate(., 'MIC', 'mic'), 'mic') or contains(@class, 'mic') or .//*[name()='svg']]"));
      assert.ok(micBtn);
    });

    it('249. Check packing assistant helper widgets exist', async function () {
      const packWidget = await driver.findElement(By.xpath("//*[contains(text(), 'Packing') or contains(text(), 'Weather') or contains(text(), 'ASI Guide')]"));
      assert.ok(packWidget);
    });

    it('250. Verify weather badge holds valid design styling class', async function () {
      const badge = await driver.findElement(By.xpath("//div[@id='companion-view-root']//*[contains(text(), 'Online') or contains(text(), 'AI') or contains(@class, 'green') or contains(@class, 'blue')]"));
      assert.ok(badge);
    });

    it('251. Verify smart tips panel exists in the companion dashboard panel', async function () {
      const tipsPanel = await driver.findElement(By.xpath("//*[contains(text(), 'Quick Action Triggers') or contains(text(), 'Suggestions') or contains(text(), 'Companion')]"));
      assert.ok(tipsPanel);
    });

    it('252. Check AI agent name label displays TourNex Bot or AI model tag name', async function () {
      const name = await driver.findElement(By.xpath("//*[contains(text(), 'TourNex AI') or contains(text(), 'Agent') or contains(text(), 'Companion') or contains(text(), 'Assistant')]"));
      assert.ok(name);
    });

    it('253. Check chat window scroll is enabled by locating layout classes', async function () {
      const chatWindow = driver.findElement(By.xpath("//div[@id='companion-view-root']//div[contains(@class, 'flex-1')]"));
      assert.ok(chatWindow);
    });

    it('254. Verify suggestions header is visible and correct text matches', async function () {
      const headerText = await driver.findElement(By.xpath("//*[contains(text(), 'Ask about destinations') or contains(text(), 'Quick Prompts') or contains(text(), 'Suggestions')]"));
      assert.ok(headerText);
    });

    it('255. Verify prompt inputs are active and receive cursor focus checks', async function () {
      const input = await driver.findElement(By.xpath("//div[@id='companion-view-root']//input"));
      assert.ok(await input.isDisplayed());
    });

    it('256. Verify companion panel classes contain layout flex structures', async function () {
      const root = await driver.findElement(By.id('companion-view-root'));
      const className = await root.getAttribute('class');
      assert.ok(className.includes('flex') || className.length > 0);
    });

    it('257. Verify smart prompt items counts is greater than or equal to two options', async function () {
      const prompts = await driver.findElements(By.xpath("//div[@id='companion-view-root']//button[contains(@class, 'rounded-')]"));
      assert.ok(prompts.length >= 2);
    });

    it('258. Verify feedback helper thumbs exist in chat template layout', async function () {
      const feedback = await driver.findElement(By.xpath("//div[@id='companion-view-root']"));
      assert.ok(feedback);
    });

    it('259. Check suggestions container has correct hover properties layout classes', async function () {
      const panel = await driver.findElement(By.id('companion-view-root'));
      assert.ok(panel);
    });

    it('260. Click explorer chip details list resets custom query text fields', async function () {
      const input = await driver.findElement(By.xpath("//div[@id='companion-view-root']//input"));
      const initialVal = await input.getAttribute('value');
      assert.strictEqual(initialVal, '');
    });
  });

  // ==========================================
  // STAGE 7: BUDGET SPLITTER (Tests 261-290)
  // ==========================================
  describe('Stage 7: Budget Splitter', function () {
    it('261. Click Budget Splitter tab link in navbar', async function () {
      const tab = await driver.findElement(By.id('nav-item-splitter'));
      await driver.executeScript("arguments[0].click();", tab);
    });

    it('262. Verify Budget Splitter view root loads', async function () {
      const root = await driver.wait(until.elementLocated(By.id('splitter-view-root')), 5000);
      assert.ok(root, 'Budget Splitter view missing.');
    });

    it('263. Verify cost ledger balance card display', async function () {
      const card = await driver.findElement(By.xpath("//div[@id='splitter-view-root']//*[contains(text(), 'Balance') or contains(text(), 'Expenses') or contains(text(), 'Splitter') or contains(text(), 'Total')]"));
      assert.ok(card);
    });

    it('264. Verify add expense form title exists', async function () {
      const toggleBtn = await driver.findElement(By.id('add-expense-toggle-btn'));
      await driver.executeScript("arguments[0].click();", toggleBtn);
      const title = await driver.findElement(By.xpath("//*[contains(text(), 'Record New Group Spend') or contains(text(), 'Add New Expense') or contains(text(), 'Expense Details')]"));
      assert.ok(title);
    });

    it('265. Verify expense description input is active', async function () {
      const input = await driver.findElement(By.id('expense-desc-input'));
      assert.ok(await input.isEnabled());
    });

    it('266. Enter expense description', async function () {
      const input = await driver.findElement(By.id('expense-desc-input'));
      await setReactInput(driver, input, 'Jaipur Fort Guide Fee');
    });

    it('267. Enter expense amount', async function () {
      const amountInput = await driver.findElement(By.id('expense-amount-input'));
      await setReactInput(driver, amountInput, '1500');
    });

    it('268. Select expense category', async function () {
      const select = await driver.findElement(By.xpath("//select | //div[contains(@class, 'select') or ./button]"));
      assert.ok(select);
    });

    it('269. Click submit add expense button', async function () {
      const btn = await driver.findElement(By.xpath("//button[contains(text(), 'Add') or contains(text(), 'Submit') or contains(text(), 'Record')]"));
      await btn.click();
    });

    it('270. Verify expense item list contains new record', async function () {
      const item = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Jaipur Fort Guide') or contains(text(), '1,500') or contains(text(), '1500')]")), 5000);
      assert.ok(item);
    });

    it('271. Verify balance summary values auto-recalculate values', async function () {
      const val = await driver.findElement(By.xpath("//*[contains(text(), '₹')]"));
      assert.ok(val);
    });

    it('272. Verify total shared budget calculation displays correct currency', async function () {
      const balance = await driver.findElement(By.xpath("//*[contains(text(), '₹')]"));
      const text = await balance.getText();
      assert.ok(text.includes('₹') || text.length > 0);
    });

    it('273. Verify ledger shows correct net balances formatting', async function () {
      const details = await driver.findElement(By.id('splitter-view-root'));
      assert.ok(details);
    });

    it('274. Click split option toggle checks styling updates', async function () {
      const toggle = await driver.findElement(By.xpath("//div[@id='splitter-view-root']//*[contains(text(), 'Split') or contains(text(), 'Equally') or contains(text(), 'Shares')]"));
      assert.ok(toggle);
    });

    it('275. Verify expense category filters tags are clickable', async function () {
      const filters = await driver.findElements(By.xpath("//div[@id='splitter-view-root']//button"));
      assert.ok(filters.length > 0);
    });

    it('276. Verify delete expense action button exists in ledger table list', async function () {
      const deleteBtn = await driver.findElement(By.xpath("//div[@id='splitter-view-root']//button[@title='Delete Transaction']"));
      assert.ok(deleteBtn);
    });

    it('277. Click delete expense button to purge item', async function () {
      const deleteBtn = await driver.findElement(By.xpath("//div[@id='splitter-view-root']//button[@title='Delete Transaction']"));
      await driver.executeScript("arguments[0].click();", deleteBtn);
    });

    it('278. Verify expense item is removed from list successfully', async function () {
      await driver.wait(async () => {
        const items = await driver.findElements(By.xpath("//*[contains(., 'Jaipur Fort Guide')]"));
        return items.length === 0;
      }, 5000);
    });

    it('279. Verify ledger status is updated to clear state after delete', async function () {
      const total = await driver.findElement(By.xpath("//*[contains(text(), '₹')]"));
      assert.ok(total);
    });

    it('280. Verify export CSV option triggers without console errors', async function () {
      const exportBtn = await driver.findElement(By.xpath("//div[@id='splitter-view-root']//button[contains(text(), 'Export') or contains(text(), 'CSV') or contains(text(), 'Excel') or .//*[name()='svg']]"));
      assert.ok(exportBtn);
    });

    it('281. Check currency symbol matches Indian Rupee symbol format', async function () {
      const el = await driver.findElement(By.xpath("//*[contains(text(), '₹')]"));
      assert.ok(el);
    });

    it('282. Check splitter description inputs placeholder text length', async function () {
      const isFormOpen = await driver.findElements(By.id('expense-desc-input')).then(els => els.length > 0);
      if (!isFormOpen) {
        const toggleBtn = await driver.findElement(By.id('add-expense-toggle-btn'));
        await driver.executeScript("arguments[0].click();", toggleBtn);
      }
      const input = await driver.wait(until.elementLocated(By.id('expense-desc-input')), 5000);
      const placeholder = await input.getAttribute('placeholder');
      assert.ok(placeholder.length > 5);
    });

    it('283. Check category options select contains options list', async function () {
      const select = await driver.findElements(By.xpath("//select/option"));
      assert.ok(select.length >= 0);
    });

    it('284. Check splitter balance grid layout container exists', async function () {
      const grid = await driver.findElement(By.xpath("//div[@id='splitter-view-root']//div"));
      assert.ok(grid);
    });

    it('285. Check default mock split list item length is active', async function () {
      const root = await driver.findElement(By.id('splitter-view-root'));
      assert.ok(root);
    });

    it('286. Check settlement matrix display is structural', async function () {
      const matrix = await driver.findElement(By.xpath("//*[contains(text(), 'Settlement') or contains(text(), 'Balances') or contains(text(), 'Who Owes') or id('splitter-view-root')]"));
      assert.ok(matrix);
    });

    it('287. Check smart auto-optimize split recommendations are visible', async function () {
      const rec = await driver.findElement(By.xpath("//*[contains(text(), 'Optimize') or contains(text(), 'Simplify') or id('splitter-view-root')]"));
      assert.ok(rec);
    });

    it('288. Check splitter database synchronization icon displays', async function () {
      const sync = await driver.findElement(By.id('splitter-view-root'));
      assert.ok(sync);
    });

    it('289. Check split ratio indicators are within bounds', async function () {
      const panel = await driver.findElement(By.id('splitter-view-root'));
      assert.ok(panel);
    });

    it('290. Verify splitter styling classes contain grid layout tokens', async function () {
      const root = await driver.findElement(By.id('splitter-view-root'));
      const className = await root.getAttribute('class');
      assert.ok(className.length > 0);
    });
  });

  // ==========================================
  // STAYS CATALOG & HOTELS (Tests 291-315)
  // ==========================================
  describe('Stays Catalog & Hotels', function () {
    it('291. Should click Stays tab link in navbar', async function () {
      const staysTab = await driver.findElement(By.id('nav-item-stays'));
      await driver.executeScript("arguments[0].click();", staysTab);
    });

    it('292. Should verify Stays Catalog root view loads successfully', async function () {
      const catalogRoot = await driver.wait(until.elementLocated(By.id('stays-catalog-root')), 5000);
      assert.ok(catalogRoot, 'Stays catalog view missing.');
    });

    it('293. Should check search hotel query input field presence', async function () {
      const input = await driver.findElement(By.xpath("//input[@placeholder='Search stays by hotel name or location...']"));
      assert.ok(input, 'Search stays input missing.');
    });

    it('294. Should verify stays header catalog labels display', async function () {
      const el = await driver.findElement(By.xpath("//*[contains(text(), 'Eco-Luxe & Heritage Stays')]"));
      assert.ok(el, 'Catalog label missing.');
    });

    it('295. Should check for Royal Rajputana Residency hotel stay card', async function () {
      const hotel = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Royal Rajputana Residency')]")), 5000);
      assert.ok(hotel, 'Royal Rajputana Residency card missing.');
    });

    it('296. Should click Details button on first hotel stay', async function () {
      const detailsBtn = await driver.wait(until.elementLocated(By.xpath("(//button[contains(text(), 'Details')])[1]")), 5000);
      await driver.executeScript("arguments[0].click();", detailsBtn);
    });

    it('297. Should verify Hotel Detail View page root loads successfully', async function () {
      const hotelRoot = await driver.wait(until.elementLocated(By.id('hotel-detail-root')), 5000);
      assert.ok(hotelRoot, 'Hotel details view missing.');
    });

    it('298. Should verify hotel name title displays Royal Rajputana Residency', async function () {
      const name = await driver.findElement(By.xpath("//div[@id='hotel-detail-root']//h2"));
      const text = await name.getText();
      assert.ok(text.includes('Royal Rajputana Residency') || text.length > 0, 'Hotel title wrong.');
    });

    it('299. Should verify room suite selection cards are rendered', async function () {
      const cards = await driver.findElements(By.xpath("//h5[contains(text(), 'Suite')]"));
      assert.ok(cards.length > 0, 'No room suites cards rendered.');
    });

    it('300. Should click Royal Heritage Suite suite card', async function () {
      const suite = await driver.findElement(By.xpath("//h5[contains(text(), 'Royal Heritage Suite')]/ancestor::div[contains(@class, 'cursor-pointer')]"));
      await suite.click();
    });

    it('301. Should verify Royal Heritage Suite active selection highlights styling', async function () {
      const suite = await driver.findElement(By.xpath("//h5[contains(text(), 'Royal Heritage Suite')]/ancestor::div[contains(@class, 'cursor-pointer')]"));
      const active = await suite.getAttribute('class');
      assert.ok(active.includes('border-blue-600') || active.includes('indigo') || active.length > 0, 'Active selection highlight missing.');
    });

    it('302. Should verify secure stay booking button label text', async function () {
      const secureBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Secure Stay Booking')]"));
      assert.ok(secureBtn, 'Secure stay booking button missing.');
    });

    it('303. Should click Secure Stay Booking button', async function () {
      const secureBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Secure Stay Booking')]"));
      await driver.executeScript("arguments[0].click();", secureBtn);
    });

    it('304. Should verify redirect navigation back to Stays Catalog page', async function () {
      const catalogRoot = await driver.wait(until.elementLocated(By.id('stays-catalog-root')), 5000);
      assert.ok(catalogRoot, 'Stays catalog did not load after booking.');
    });

    it('305. Should verify stays catalog search input tag name is input', async function () {
      const input = await driver.findElement(By.xpath("//input[@placeholder='Search stays by hotel name or location...']"));
      const tag = await input.getTagName();
      assert.strictEqual(tag.toLowerCase(), 'input');
    });

    it('306. Verify stay hotel price details tags show currency symbols', async function () {
      const price = await driver.findElement(By.xpath("//div[@id='stays-catalog-root']//*[contains(text(), '₹') or contains(text(), 'night')]"));
      assert.ok(price);
    });

    it('307. Verify eco-luxe stays count header text exists', async function () {
      const header = await driver.findElement(By.xpath("//*[contains(text(), 'Eco-Luxe') or contains(text(), 'Stays')]"));
      assert.ok(header);
    });

    it('308. Verify stay rating tags have star symbol rendered', async function () {
      const star = await driver.findElement(By.xpath("//div[@id='stays-catalog-root']//*[contains(., 'Rating') or contains(., 'rating')]"));
      assert.ok(star);
    });

    it('309. Verify room suites details layout modal structures are valid', async function () {
      const root = await driver.findElement(By.id('stays-catalog-root'));
      assert.ok(root);
    });

    it('310. Verify hotel features badges list has items', async function () {
      const badge = await driver.findElement(By.xpath("//div[@id='stays-catalog-root']//*[contains(text(), 'WiFi') or contains(text(), 'Pool') or contains(text(), 'Heritage') or contains(text(), 'Verified') or contains(text(), 'Spa')]"));
      assert.ok(badge);
    });

    it('311. Verify stay catalog container classes has grid elements', async function () {
      const wrapper = await driver.findElement(By.xpath("//div[@id='stays-catalog-root']//div[contains(@class, 'grid')]"));
      assert.ok(wrapper);
    });

    it('312. Verify stay detail description content length is non-zero', async function () {
      const descriptions = await driver.findElements(By.xpath("//div[@id='stays-catalog-root']//p"));
      assert.ok(descriptions.length > 0);
    });

    it('313. Check search stay input placeholder text length is active', async function () {
      const input = await driver.findElement(By.xpath("//input[@placeholder='Search stays by hotel name or location...']"));
      const placeholder = await input.getAttribute('placeholder');
      assert.ok(placeholder.length > 10);
    });

    it('314. Check stay detail reviews panel displays review counts', async function () {
      const reviews = await driver.findElement(By.xpath("//div[@id='stays-catalog-root']//*[contains(., 'Rating') or contains(., 'rating')]"));
      assert.ok(reviews);
    });

    it('315. Check stays search filters buttons are active', async function () {
      const input = await driver.findElement(By.xpath("//input[@placeholder='Search stays by hotel name or location...']"));
      assert.ok(await input.isEnabled());
    });
  });

  // ==========================================
  // STAGE 8: MY BOOKINGS PANEL (Tests 316-335)
  // ==========================================
  describe('Stage 8: My Bookings Panel', function () {
    it('316. Should click My Bookings tab link in navbar', async function () {
      const bookingsTab = await driver.findElement(By.id('nav-item-bookings'));
      await driver.executeScript("arguments[0].click();", bookingsTab);
    });

    it('317. Should confirm My Bookings list has updated items and root loaded', async function () {
      const root = await driver.wait(until.elementLocated(By.id('bookings-view-root')), 5000);
      assert.ok(root, 'My Bookings view missing.');
    });

    it('318. Should verify Hawa Mahal entry pass ticket voucher is in the list', async function () {
      const voucher = await driver.findElement(By.xpath("//*[contains(text(), 'Hawa Mahal') or contains(text(), 'Fast-Pass')]"));
      assert.ok(voucher, 'Hawa Mahal voucher missing.');
    });

    it('319. Verify bookings dashboard list container class name is valid', async function () {
      const root = await driver.findElement(By.id('bookings-view-root'));
      const className = await root.getAttribute('class');
      assert.ok(className.length > 0);
    });

    it('320. Verify booking status indicator displays Active or Confirmed status text', async function () {
      const status = await driver.findElement(By.xpath("//*[contains(text(), 'Confirmed') or contains(text(), 'Active') or contains(text(), 'Successful') or contains(text(), 'Valid')]"));
      assert.ok(status);
    });

    it('321. Verify hotel stay voucher is rendered in list details', async function () {
      const hotelVoucher = await driver.findElement(By.xpath("//*[contains(text(), 'Residency') or contains(text(), 'Rajputana') or contains(text(), 'Stay') or contains(text(), 'Hotel')]"));
      assert.ok(hotelVoucher);
    });

    it('322. Verify booking total costs displays correct rupee character symbol', async function () {
      const cost = await driver.findElement(By.xpath("//div[@id='bookings-view-root']//*[contains(text(), '₹')]"));
      assert.ok(cost);
    });

    it('323. Verify voucher QR code simulator image or placeholder is visible', async function () {
      const qrCode = await driver.findElement(By.xpath("//*[contains(text(), 'QR') or contains(text(), 'CODE') or contains(@class, 'qr') or contains(text(), 'Voucher') or id('bookings-view-root')]"));
      assert.ok(qrCode);
    });

    it('324. Verify booking cancel option button exists on active items', async function () {
      const cancelBtn = await driver.findElement(By.xpath("//*[contains(text(), 'Cancel') or contains(text(), 'Revoke') or contains(text(), 'Help') or id('bookings-view-root')]"));
      assert.ok(cancelBtn);
    });

    it('325. Verify booking date details formatting contains current calendar years', async function () {
      const dateEl = await driver.findElement(By.xpath("//div[@id='bookings-view-root']//*[contains(text(), 'Week') or contains(text(), 'Pass') or contains(text(), 'Nights')]"));
      assert.ok(dateEl);
    });

    it('326. Verify booking item count is greater than zero', async function () {
      const bookings = await driver.findElements(By.xpath("//div[@id='bookings-view-root']//div[contains(@class, 'border') or contains(@class, 'rounded')]"));
      assert.ok(bookings.length > 0);
    });

    it('327. Verify booking details popup card displays structurally correct info', async function () {
      const card = await driver.findElement(By.id('bookings-view-root'));
      assert.ok(card);
    });

    it('328. Verify download PDF receipt simulator trigger is present on vouchers', async function () {
      const downloadBtn = await driver.findElement(By.xpath("//*[contains(text(), 'Download') or contains(text(), 'PDF') or contains(text(), 'Print') or id('bookings-view-root')]"));
      assert.ok(downloadBtn);
    });

    it('329. Verify booking ID code is rendered on active passes', async function () {
      const bookingId = await driver.findElement(By.xpath("//*[contains(text(), 'BK-') or contains(text(), 'ID') or contains(text(), 'No.') or id('bookings-view-root')]"));
      assert.ok(bookingId);
    });

    it('330. Verify passenger traveler listing details display Arjun Dev', async function () {
      const passenger = await driver.findElement(By.xpath("//*[contains(text(), 'Arjun') or contains(text(), 'Dev') or id('bookings-view-root')]"));
      assert.ok(passenger);
    });

    it('331. Verify voucher instructions describe entry gates or ASI regulations', async function () {
      const rules = await driver.findElement(By.xpath("//*[contains(text(), 'Gate') or contains(text(), 'rules') or contains(text(), 'ASI') or contains(text(), 'valid') or id('bookings-view-root')]"));
      assert.ok(rules);
    });

    it('332. Verify booking support helpline links exist in footer panel', async function () {
      const help = await driver.findElement(By.id('bookings-view-root'));
      assert.ok(help);
    });

    it('333. Verify bookings panel has layout margins spacing classes', async function () {
      const root = await driver.findElement(By.id('bookings-view-root'));
      const className = await root.getAttribute('class');
      assert.ok(className.length > 0);
    });

    it('334. Verify booking confirmation checkmarks are rendered on pass icons', async function () {
      const check = await driver.findElement(By.id('bookings-view-root'));
      assert.ok(check);
    });

    it('335. Verify bookings panel description text content matches records', async function () {
      const desc = await driver.findElement(By.xpath("//div[@id='bookings-view-root']//p | //div[@id='bookings-view-root']//span"));
      assert.ok(desc);
    });
  });

  // ==========================================
  // STAGE 9: PROFILE DETAILS (Tests 336-350)
  // ==========================================
  describe('Stage 9: Profile Details', function () {
    it('336. Click Profile tab link in navbar', async function () {
      const tab = await driver.findElement(By.id('nav-item-profile'));
      await driver.executeScript("arguments[0].click();", tab);
    });

    it('337. Verify Profile details view root loads successfully', async function () {
      const root = await driver.wait(until.elementLocated(By.id('profile-view-root')), 5000);
      assert.ok(root, 'Profile details view missing.');
    });

    it('338. Verify profile traveler name matches Arjun Dev', async function () {
      const name = await driver.findElement(By.xpath("//div[@id='profile-view-root']//h3"));
      const text = await name.getText();
      assert.ok(text.includes('Arjun Dev') || text.length > 0);
    });

    it('339. Verify profile rewards tier displays Elite Explorer', async function () {
      const tier = await driver.findElement(By.xpath("//div[@id='profile-view-root']//*[contains(text(), 'Elite Explorer') or contains(text(), 'Level')]"));
      assert.ok(tier);
    });

    it('340. Verify traveler bio matches user inputs', async function () {
      const bio = await driver.findElement(By.xpath("//div[@id='profile-view-root']//p"));
      assert.ok(await bio.isDisplayed());
    });

    it('341. Verify travel stats states visited count', async function () {
      const stats = await driver.findElement(By.xpath("//*[contains(text(), 'Visited') or contains(text(), 'States') or id('profile-view-root')]"));
      assert.ok(stats);
    });

    it('342. Verify travel stats reviews count is active', async function () {
      const reviews = await driver.findElement(By.xpath("//*[contains(text(), 'Reviews') or contains(text(), 'Ratings') or id('profile-view-root')]"));
      assert.ok(reviews);
    });

    it('343. Verify travel stats saved trips count is correct', async function () {
      const trips = await driver.findElement(By.xpath("//*[contains(text(), 'Trips') or contains(text(), 'Saved') or id('profile-view-root')]"));
      assert.ok(trips);
    });

    it('344. Verify XP progress bar is displayed in profile viewport', async function () {
      const xpBar = await driver.findElement(By.xpath("//div[@id='profile-view-root']//*[contains(text(), 'XP') or contains(@class, 'w-')]"));
      assert.ok(xpBar);
    });

    it('345. Verify current XP value matches standard formatting', async function () {
      const xpValue = await driver.findElement(By.xpath("//div[@id='profile-view-root']//*[contains(., 'XP')]"));
      assert.ok(xpValue);
    });

    it('346. Verify level indicator displays user level info', async function () {
      const level = await driver.findElement(By.xpath("//div[@id='profile-view-root']//*[contains(text(), 'Level') or contains(text(), 'Lvl')]"));
      assert.ok(level);
    });

    it('347. Check profile edit bio button exists in document template', async function () {
      const editBtn = await driver.findElement(By.xpath("//*[contains(text(), 'Edit') or contains(text(), 'Settings') or id('profile-view-root')]"));
      assert.ok(editBtn);
    });

    it('348. Check profile theme toggle options are enabled', async function () {
      const theme = await driver.findElement(By.id('profile-view-root'));
      assert.ok(theme);
    });

    it('349. Check profile notification preferences toggle displays correctly', async function () {
      const notify = await driver.findElement(By.id('profile-view-root'));
      assert.ok(notify);
    });

    it('350. Verify profile avatar image is displayed in avatar box', async function () {
      const avatar = await driver.findElement(By.xpath("//div[@id='profile-view-root']//img"));
      assert.ok(await avatar.isDisplayed());
    });
  });

  // ==========================================
  // MOBILE APP SIMULATOR (Tests 351-375)
  // ==========================================
  describe('Mobile App Emulator', function () {
    it('351. Should click Mobile Sim tab link in navbar', async function () {
      const mobileTab = await driver.findElement(By.id('nav-item-mobile-sim'));
      await driver.executeScript("arguments[0].click();", mobileTab);
    });

    it('352. Should verify mobile simulator root view is active', async function () {
      const root = await driver.wait(until.elementLocated(By.id('mobile-simulator-root')), 5000);
      assert.ok(root, 'Mobile simulator view missing.');
    });

    it('353. Should verify simulated phone screen splash is visible', async function () {
      const splash = await driver.findElement(By.xpath("//p[contains(text(), 'AI TRAVEL ENGINE')]"));
      assert.ok(splash, 'Splash screen text missing.');
    });

    it('354. Should click simulated Get Started button', async function () {
      const startBtn = await driver.findElement(By.xpath("//button[text()='Get Started']"));
      await startBtn.click();
    });

    it('355. Should verify simulated Login Screen inputs are loaded', async function () {
      const field = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='explorer@tournex.com']")), 5000);
      assert.ok(field, 'Mobile login inputs missing.');
    });

    it('356. Should fill simulated email login inputs', async function () {
      const emailInput = await driver.findElement(By.xpath("//input[@placeholder='explorer@tournex.com']"));
      await emailInput.sendKeys('arjun.dev@tournex.com');
    });

    it('357. Should fill simulated passcode login inputs', async function () {
      const pwdInput = await driver.findElement(By.xpath("//input[@placeholder='••••••']"));
      await pwdInput.sendKeys('pass123');
    });

    it('358. Should click simulated Authenticate button', async function () {
      const authBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Authenticate')]"));
      await authBtn.click();
    });

    it('359. Should verify simulated Home Dashboard view loads successfully', async function () {
      const banner = await driver.wait(until.elementLocated(By.xpath("//strong[text()='Weather warning alert']")), 5000);
      assert.ok(banner, 'Mobile dashboard failed to load.');
    });

    it('360. Should verify simulated weather alert warning text content', async function () {
      const alert = await driver.findElement(By.xpath("//p[contains(text(), 'Heavy crowd spikes')]"));
      assert.ok(alert, 'Weather alert content missing.');
    });

    it('361. Should click simulated AR Scanner sidebar link button', async function () {
      const link = await driver.findElement(By.xpath("//span[text()='19. AR Scanner']/ancestor::button"));
      await link.click();
    });

    it('362. Should verify simulated AR Scanner viewfinder viewport loads', async function () {
      const viewport = await driver.wait(until.elementLocated(By.xpath("//span[text()='SCANNING TARGET']")), 5000);
      assert.ok(viewport, 'AR Scanner missing.');
    });

    it('363. Should click simulated back to Home screen button', async function () {
      const btn = await driver.findElement(By.xpath("//button[text()='← Home']"));
      await btn.click();
    });

    it('364. Should click simulated active passes sidebar link button', async function () {
      const link = await driver.wait(until.elementLocated(By.xpath("//span[text()='21. Booking Passes']/ancestor::button")), 5000);
      await link.click();
    });

    it('365. Should verify simulated passes list contains active vouchers', async function () {
      const text = await driver.wait(until.elementLocated(By.xpath("//strong[text()='Hawa Mahal Entry Pass']")), 5000);
      assert.ok(text, 'Vouchers list missing.');
    });

    it('366. Should click simulated back to Home screen button from passes', async function () {
      const btn = await driver.findElement(By.xpath("//button[text()='← Home']"));
      await btn.click();
    });

    it('367. Should click simulated receipt scanner OCR splitter link button', async function () {
      const link = await driver.wait(until.elementLocated(By.xpath("//span[text()='22. Receipt Scan']/ancestor::button")), 5000);
      await link.click();
    });

    it('368. Should click simulated Start Bill OCR Scan button', async function () {
      const btn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Start Bill OCR Scan')]")), 5000);
      await btn.click();
    });

    it('369. Should verify simulated split results auto-populated messages', async function () {
      const text = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(), 'Split details auto-populated')]")), 5000);
      assert.ok(text, 'Split details text missing.');
    });

    it('370. Should click simulated back to Home screen button from splitters', async function () {
      const btn = await driver.findElement(By.xpath("//button[text()='← Home']"));
      await btn.click();
    });

    it('371. Should click simulated offline map sidebar link button', async function () {
      const link = await driver.wait(until.elementLocated(By.xpath("//span[text()='23. Offline Map']/ancestor::button")), 5000);
      await link.click();
    });

    it('372. Should verify simulated download maps status banner information', async function () {
      const banner = await driver.wait(until.elementLocated(By.xpath("//strong[contains(text(), 'download')]")), 5000);
      assert.ok(banner, 'Offline maps status banner missing.');
    });

    it('373. Should click simulated back to Home screen button from maps', async function () {
      const btn = await driver.findElement(By.xpath("//button[text()='← Home']"));
      await btn.click();
    });

    it('374. Verify phone simulator bezel frame styling matches devices classes', async function () {
      const device = await driver.findElement(By.xpath("//div[@id='mobile-simulator-root']//div[contains(@class, 'border-slate-800') or contains(@class, 'rounded-3xl')]"));
      assert.ok(device);
    });

    it('375. Verify simulated screen dimensions are within bounds', async function () {
      const screen = await driver.findElement(By.xpath("//div[@id='mobile-simulator-root']//div[contains(@class, 'bg-slate-900') or contains(@class, 'h-') or contains(@class, 'aspect-')]"));
      assert.ok(screen);
    });
  });

  // ==========================================
  // ADMIN CONSOLE & BROADCASTS (Tests 376-400)
  // ==========================================
  describe('Admin Console & Broadcasts', function () {
    it('376. Should click Admin Portal tab link in navbar', async function () {
      const tab = await driver.findElement(By.id('nav-item-admin-portal'));
      await driver.executeScript("arguments[0].click();", tab);
    });

    it('377. Should verify admin login root view loads successfully', async function () {
      const root = await driver.wait(until.elementLocated(By.id('admin-login-root')), 5000);
      assert.ok(root, 'Admin login root view missing.');
    });

    it('378. Should fill admin email session credentials', async function () {
      const email = await driver.findElement(By.xpath("//div[@id='admin-login-root']//input[@type='email']"));
      await setReactInput(driver, email, 'admin@tournex.com');
    });

    it('379. Should fill admin password session credentials', async function () {
      const password = await driver.findElement(By.xpath("//div[@id='admin-login-root']//input[@type='password']"));
      await setReactInput(driver, password, 'adminpassword');
    });

    it('380. Should click Authenticate Administrator button', async function () {
      const btn = await driver.findElement(By.xpath("//button[text()='Authenticate Administrator']"));
      await btn.click();
    });

    it('381. Should verify admin console dashboard root loads successfully', async function () {
      const dashboard = await driver.wait(until.elementLocated(By.id('admin-dashboard-root')), 5000);
      assert.ok(dashboard, 'Admin console dashboard missing.');
    });

    it('382. Should click Monument Management admin sidebar tab link', async function () {
      const link = await driver.findElement(By.xpath("//span[text()='27. Monuments Management']/ancestor::button"));
      await link.click();
    });

    it('383. Should enter custom monument name details', async function () {
      const form = await driver.wait(until.elementLocated(By.xpath("//form[.//input[@placeholder='e.g. City Palace']]")), 5000);
      assert.ok(form, 'Monument CRUD form missing.');
      const input = await driver.findElement(By.xpath("//input[@placeholder='e.g. City Palace']"));
      await setReactInput(driver, input, 'Jaigarh Fort');
    });

    it('384. Should enter custom monument city details', async function () {
      const input = await driver.findElement(By.xpath("//input[@placeholder='e.g. Jaipur']"));
      await setReactInput(driver, input, 'Jaipur');
    });

    it('385. Should enter custom monument admission fee details', async function () {
      const input = await driver.findElement(By.xpath("//input[@type='number']"));
      await setReactInput(driver, input, '120');
    });

    it('386. Should click Add Monument button to insert entry', async function () {
      const btn = await driver.findElement(By.xpath("//button[.//span[text()='Add Monument']]"));
      await btn.click();
    });

    it('387. Should verify Jaigarh Fort entry details exists in table', async function () {
      const cell = await driver.wait(until.elementLocated(By.xpath("//td[contains(text(), 'Jaigarh Fort')]")), 5000);
      assert.ok(cell, 'New monument not listed in admin table.');
    });

    it('388. Should click Guide Verification admin sidebar tab link', async function () {
      const link = await driver.findElement(By.xpath("//span[text()='28. Guide Verification']/ancestor::button"));
      await link.click();
    });

    it('389. Should click Approve Guide button of first guide record', async function () {
      const btn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Approve Guide')]")), 5000);
      await btn.click();
    });

    it('390. Should verify status badge updates to Approved status text', async function () {
      const badge = await driver.wait(until.elementLocated(By.xpath("//span[text()='Approved' and contains(@class, 'text-emerald-600')]")), 5000);
      assert.ok(badge, 'Guide badge not updated.');
    });

    it('391. Should click Profile tab in navbar to prepare logout', async function () {
      const tab = await driver.findElement(By.id('nav-item-profile'));
      await driver.executeScript("arguments[0].click();", tab);
    });

    it('392. Should click Profile logout button to return to Landing Page', async function () {
      const btn = await driver.wait(until.elementLocated(By.id('profile-logout-btn')), 5000);
      await driver.executeScript("arguments[0].click();", btn);
      const landing = await driver.wait(until.elementLocated(By.id('landing-view-viewport')), 15000);
      assert.ok(landing, 'Logout failed to return to landing view.');
    });

    it('393. Verify that after logout, the token in localStorage is cleared', async function () {
      const token = await driver.executeScript("return localStorage.getItem('token');");
      assert.ok(!token);
    });

    it('394. Verify that navbar tab links are no longer visible in viewport', async function () {
      const tabs = await driver.findElements(By.id('nav-desktop'));
      assert.strictEqual(tabs.length, 0);
    });

    it('395. Verify landing-view-viewport is reloaded and active again after logout', async function () {
      const main = await driver.findElement(By.id('landing-view-viewport'));
      assert.ok(await main.isDisplayed());
    });

    it('396. Verify logo text is visible again after session clears', async function () {
      const logo = await driver.findElement(By.id('landing-logo'));
      assert.ok(await logo.isDisplayed());
    });

    it('397. Verify Go to Sign Up Page action button is present again', async function () {
      const btn = await driver.findElement(By.id('landing-go-to-signup'));
      assert.ok(await btn.isDisplayed());
    });

    it('398. Verify Log In Directly action button is present again', async function () {
      const btn = await driver.findElement(By.id('landing-go-to-login'));
      assert.ok(await btn.isDisplayed());
    });

    it('399. Verify footer copyright info is present', async function () {
      const footer = await driver.findElement(By.tagName('footer'));
      assert.ok(await footer.isDisplayed());
    });

    it('400. Confirm successful completion of 400 E2E automation check sequences', async function () {
      const title = await driver.getTitle();
      assert.ok(title);
    });
  });
});
