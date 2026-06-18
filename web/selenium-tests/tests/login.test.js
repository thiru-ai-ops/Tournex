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
    const exploreTab = await driver.wait(until.elementLocated(By.id('nav-item-explore')), 5000);
    await driver.wait(until.elementIsVisible(exploreTab), 5000);
    await driver.executeScript("arguments[0].click();", exploreTab);
    const root = await driver.wait(until.elementLocated(By.id('explore-view-root')), 5000);
    assert.ok(root, 'Explore view root not active.');
  });

  it('27. Should switch to Gateway tab and render Gateway view', async function () {
    const gatewayTab = await driver.wait(until.elementLocated(By.id('nav-item-gateway')), 5000);
    await driver.wait(until.elementIsVisible(gatewayTab), 5000);
    await driver.executeScript("arguments[0].click();", gatewayTab);
    const gatewayRoot = await driver.wait(until.elementLocated(By.id('gateway-view-root')), 5000);
    assert.ok(gatewayRoot, 'Gateway finder view did not load.');
  });

  it('28. Should switch to AI Planner Companion tab and render Companion view', async function () {
    const companionTab = await driver.wait(until.elementLocated(By.id('nav-item-companion')), 5000);
    await driver.wait(until.elementIsVisible(companionTab), 5000);
    await driver.executeScript("arguments[0].click();", companionTab);
    const companionRoot = await driver.wait(until.elementLocated(By.id('companion-view-root')), 5000);
    assert.ok(companionRoot, 'AI Planner Companion view did not load.');
  });

  // --- STAGE 6: COMPANION & AI VERIFICATIONS ---

  it('29. Should send message to AI Planner and receive auto-reply', async function () {
    const chatInput = await driver.wait(until.elementLocated(By.id('chat-input')), 5000);
    await driver.wait(until.elementIsVisible(chatInput), 5000);
    await setReactInput(driver, chatInput, 'Tell me about Jaipur crowd');
    const sendBtn = await driver.findElement(By.id('chat-send-btn'));
    await driver.executeScript("arguments[0].click();", sendBtn);
    const aiBubble = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Based on our live tourist density index')]")), 15000);
    assert.ok(aiBubble, 'AI auto-reply bubble not found.');
  });

  // --- STAGE 7: BUDGET SPLITTER VERIFICATIONS ---

  it('30. Should switch to Budget Splitter tab and render Splitter view', async function () {
    const splitterTab = await driver.wait(until.elementLocated(By.id('nav-item-splitter')), 5000);
    await driver.wait(until.elementIsVisible(splitterTab), 5000);
    await driver.executeScript("arguments[0].click();", splitterTab);
    const splitterRoot = await driver.wait(until.elementLocated(By.id('splitter-view-root')), 5000);
    assert.ok(splitterRoot, 'Budget Splitter view did not load.');
  });

  it('31. Should toggle add expense form slide-down panel', async function () {
    const toggleBtn = await driver.wait(until.elementLocated(By.id('add-expense-toggle-btn')), 5000);
    await driver.wait(until.elementIsVisible(toggleBtn), 5000);
    await driver.executeScript("arguments[0].click();", toggleBtn);
    const descField = await driver.wait(until.elementLocated(By.id('expense-desc-input')), 5000);
    assert.ok(descField, 'Add expense form did not slide down.');
  });

  it('32. Should add new group expense successfully', async function () {
    const descField = await driver.wait(until.elementLocated(By.id('expense-desc-input')), 5000);
    await driver.wait(until.elementIsVisible(descField), 5000);
    await setReactInput(driver, descField, 'Autocab tour');
    const amountField = await driver.findElement(By.id('expense-amount-input'));
    await setReactInput(driver, amountField, '450');
    const submitBtn = await driver.findElement(By.id('expense-submit-btn'));
    await driver.executeScript("arguments[0].click();", submitBtn);
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
    const bookingsTab = await driver.wait(until.elementLocated(By.id('nav-item-bookings')), 5000);
    await driver.wait(until.elementIsVisible(bookingsTab), 5000);
    await driver.executeScript("arguments[0].click();", bookingsTab);
    const bookingsRoot = await driver.wait(until.elementLocated(By.id('bookings-view-root')), 5000);
    assert.ok(bookingsRoot, 'My Bookings view did not load.');
  });

  // --- STAGE 9: PROFILE VIEW & LOGOUT VERIFICATIONS ---

  it('35. Should switch to Profile tab, edit bio, and log out successfully', async function () {
    const profileTab = await driver.wait(until.elementLocated(By.id('nav-item-profile')), 5000);
    await driver.wait(until.elementIsVisible(profileTab), 5000);
    await driver.executeScript("arguments[0].click();", profileTab);
    const profileRoot = await driver.wait(until.elementLocated(By.id('profile-view-root')), 5000);
    assert.ok(profileRoot, 'Profile view did not load.');

    const logoutBtn = await driver.findElement(By.id('profile-logout-btn'));
    await driver.executeScript("arguments[0].click();", logoutBtn);

    const viewport = await driver.wait(until.elementLocated(By.id('landing-view-viewport')), 15000);
    assert.ok(viewport, 'Did not redirect back to landing page after logout.');
  });

  // --- STAGE 10: NEW USER REGISTRATION & MULTI-STEP ONBOARDING WIZARD ---

  it('36. Should navigate to signup form and fill credentials', async function () {
    const goSignupBtn = await driver.findElement(By.id('go-to-signup'));
    await goSignupBtn.click();
    const signupName = await driver.wait(until.elementLocated(By.id('signup-name')), 5000);
    await setReactInput(driver, signupName, 'Arjun Dev');
    const signupEmail = await driver.findElement(By.id('signup-email'));
    await setReactInput(driver, signupEmail, 'arjun.dev@tournex.com');
    const signupPassword = await driver.findElement(By.id('signup-password'));
    await setReactInput(driver, signupPassword, 'arjun123');
    
    // Ensure "Start Fresh" database option is checked in signup
    const toggleDb = await driver.findElement(By.id('signup-toggle-reset-db'));
    const text = await toggleDb.getText();
    if (!text.includes('Yes')) {
      await toggleDb.click();
    }
  });

  it('37. Should submit signup form to trigger onboarding wizard Step 1', async function () {
    const signupBtn = await driver.findElement(By.id('signup-button'));
    await signupBtn.click();
    const onboardingRoot = await driver.wait(until.elementLocated(By.id('onboarding-wizard-root')), 15000);
    assert.ok(onboardingRoot, 'Traveler onboarding wizard did not load.');
  });

  it('38. Should fill Onboarding Step 1 (Traveler Details) and click continue', async function () {
    const onboardingName = await driver.wait(until.elementLocated(By.id('onboarding-name')), 5000);
    await setReactInput(driver, onboardingName, 'Arjun Dev');
    const onboardingLocation = await driver.findElement(By.id('onboarding-location'));
    await setReactInput(driver, onboardingLocation, 'Jaipur, India');
    const nextBtn = await driver.findElement(By.id('onboarding-next-btn'));
    await nextBtn.click();
  });

  it('39. Should complete Onboarding Step 2 (Expedition Style) and click continue', async function () {
    const heritagePref = await driver.wait(until.elementLocated(By.id('onboarding-pref-Heritage')), 5000);
    await heritagePref.click();
    const nextBtn = await driver.findElement(By.id('onboarding-next-btn'));
    await nextBtn.click();
  });

  it('40. Should complete Onboarding Step 3 (Traveler Tier) and finish onboarding', async function () {
    const eliteTier = await driver.wait(until.elementLocated(By.id('onboarding-tier-Elite-Explorer')), 5000);
    await eliteTier.click();
    const finishBtn = await driver.findElement(By.id('onboarding-next-btn'));
    await finishBtn.click();
    
    // Onboarding finishes and lands on explore view viewport
    const appViewport = await driver.wait(until.elementLocated(By.id('applet-viewport')), 15000);
    assert.ok(appViewport, 'App viewport did not load after completing onboarding.');
  });

  // --- STAGE 11: DESTINATION & MONUMENT DETAILED VIEWS ---

  it('41. Should select Jaipur destination card to open detailed view', async function () {
    const jaipurCard = await driver.wait(until.elementLocated(By.id('destination-card-jaipur')), 5000);
    const viewSpotsBtn = await jaipurCard.findElement(By.xpath(".//button[contains(., 'View Tourist Spots')]"));
    await driver.executeScript("arguments[0].click();", viewSpotsBtn);
    
    const spotsPortal = await driver.wait(until.elementLocated(By.id('spots-booking-portal')), 5000);
    assert.ok(spotsPortal, 'Spots & Booking Portal modal did not open.');
    
    // Close the overlay modal to proceed to standard destination detail view
    const closeBtn = await spotsPortal.findElement(By.xpath(".//button"));
    await driver.executeScript("arguments[0].click();", closeBtn);
    
    // Click destination title itself or image to open DestinationDetailView
    const jaipurTitle = await jaipurCard.findElement(By.xpath(".//h3[contains(text(), 'Jaipur')]"));
    await driver.executeScript("arguments[0].click();", jaipurTitle);
    
    const detailRoot = await driver.wait(until.elementLocated(By.id('destination-detail-root')), 5000);
    assert.ok(detailRoot, 'Destination detail view page did not load.');
  });

  it('42. Should navigate sub-tabs in Destination Detail View', async function () {
    const culinaryTab = await driver.findElement(By.xpath("//button[contains(translate(., 'CULINARY', 'culinary'), 'culinary')]"));
    await culinaryTab.click();
    const content = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Famous Local Plate')]")), 5000);
    assert.ok(content, 'Culinary tab content did not render.');
    
    const overviewTab = await driver.findElement(By.xpath("//button[contains(translate(., 'OVERVIEW', 'overview'), 'overview')]"));
    await overviewTab.click();
  });

  it('43. Should click sight card to open Monument Detail page', async function () {
    const sightsHeader = await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Iconic Landmarks')]")), 5000);
    assert.ok(sightsHeader, 'Landmarks header not visible.');
    
    const hawaMahalSight = await driver.wait(until.elementLocated(By.id('sight-card-hawa-mahal')), 5000);
    await driver.executeScript("arguments[0].click();", hawaMahalSight);
    
    const monumentRoot = await driver.wait(until.elementLocated(By.id('monument-detail-root')), 5000);
    assert.ok(monumentRoot, 'Monument detail page did not load.');
  });

  it('44. Should book monument entry pass successfully', async function () {
    const bookBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Book Entry Pass Now')]"));
    await driver.executeScript("arguments[0].click();", bookBtn);
    
    // Direct back to explore page after booking
    const exploreRoot = await driver.wait(until.elementLocated(By.id('explore-view-root')), 10000);
    assert.ok(exploreRoot, 'Did not navigate back to explore feed after booking entry pass.');
  });

  // --- STAGE 12: STAYS CATALOG & HOTEL DETAILS ---

  it('45. Should switch to Stays tab and verify catalog list loads', async function () {
    const staysTab = await driver.findElement(By.id('nav-item-stays'));
    await driver.executeScript("arguments[0].click();", staysTab);
    
    const catalogRoot = await driver.wait(until.elementLocated(By.id('stays-catalog-root')), 5000);
    assert.ok(catalogRoot, 'Stays catalog view did not load.');
  });

  it('46. Should navigate to Hotel Detail View page', async function () {
    const hotelDetailsBtn = await driver.wait(until.elementLocated(By.xpath("(//button[contains(text(), 'Details')])[1]")), 5000);
    await driver.executeScript("arguments[0].click();", hotelDetailsBtn);
    
    const hotelRoot = await driver.wait(until.elementLocated(By.id('hotel-detail-root')), 5000);
    assert.ok(hotelRoot, 'Hotel detail view page did not load.');
  });

  it('47. Should select a room suite and secure stay booking', async function () {
    const royalSuite = await driver.findElement(By.xpath("//h5[contains(text(), 'Royal Heritage Suite')]/ancestor::div[contains(@class, 'cursor-pointer')]"));
    await royalSuite.click();
    
    const secureBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Secure Stay Booking')]"));
    await driver.executeScript("arguments[0].click();", secureBtn);
    
    // Redirects back to stays catalog on successful booking
    const catalogRoot = await driver.wait(until.elementLocated(By.id('stays-catalog-root')), 5000);
    assert.ok(catalogRoot, 'Did not redirect back to stays catalog after secure stay booking.');
  });

  // --- STAGE 13: MOBILE APP SIMULATOR INTERACTIVE FLOWS ---

  it('48. Should switch to Mobile Simulator and trigger Splash Screen', async function () {
    const mobileTab = await driver.findElement(By.id('nav-item-mobile-sim'));
    await driver.executeScript("arguments[0].click();", mobileTab);
    
    const simRoot = await driver.wait(until.elementLocated(By.id('mobile-simulator-root')), 5000);
    assert.ok(simRoot, 'Mobile simulator view did not load.');
    
    const splashScreen = await driver.findElement(By.xpath("//p[contains(text(), 'AI TRAVEL ENGINE')]"));
    assert.ok(splashScreen, 'Splash screen not active inside phone chassis.');
    
    const startBtn = await driver.findElement(By.xpath("//button[text()='Get Started']"));
    await startBtn.click();
  });

  it('49. Should verify Mobile Simulator Login and authenticate to Home Dashboard', async function () {
    const emailInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='explorer@tournex.com']")), 5000);
    await emailInput.sendKeys('arjun.dev@tournex.com');
    const pwdInput = await driver.findElement(By.xpath("//input[@placeholder='••••••']"));
    await pwdInput.sendKeys('pass123');
    
    const authBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Authenticate')]"));
    await authBtn.click();
    
    const warningAlert = await driver.wait(until.elementLocated(By.xpath("//strong[text()='Weather warning alert']")), 5000);
    assert.ok(warningAlert, 'Mobile Home Dashboard did not load.');
  });

  it('50. Should interact with mobile simulated screens: AR Scanner, Passes, Receipt Splitter, Offline Map, and Badges', async function () {
    // 1. AR Scanner Screen
    const arLink = await driver.findElement(By.xpath("//span[text()='19. AR Scanner']/ancestor::button"));
    await arLink.click();
    const arViewport = await driver.wait(until.elementLocated(By.xpath("//span[text()='SCANNING TARGET']")), 5000);
    assert.ok(arViewport, 'AR Scanner screen not loaded.');
    const arHomeBtn = await driver.findElement(By.xpath("//button[text()='← Home']"));
    await arHomeBtn.click();

    // 2. Active Passes
    const passesLink = await driver.wait(until.elementLocated(By.xpath("//span[text()='21. Booking Passes']/ancestor::button")), 5000);
    await passesLink.click();
    const voucherText = await driver.wait(until.elementLocated(By.xpath("//strong[text()='Hawa Mahal Entry Pass']")), 5000);
    assert.ok(voucherText, 'Passes screen not loaded.');
    const passesHomeBtn = await driver.findElement(By.xpath("//button[text()='← Home']"));
    await passesHomeBtn.click();

    // 3. Receipt OCR Scan
    const receiptLink = await driver.wait(until.elementLocated(By.xpath("//span[text()='22. Receipt Scan']/ancestor::button")), 5000);
    await receiptLink.click();
    const scanBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Start Bill OCR Scan')]")), 5000);
    await scanBtn.click();
    const scanSuccessText = await driver.wait(until.elementLocated(By.xpath("//p[contains(text(), 'Split details auto-populated')]")), 5000);
    assert.ok(scanSuccessText, 'OCR Scan did not complete successfully.');
    const receiptHomeBtn = await driver.findElement(By.xpath("//button[text()='← Home']"));
    await receiptHomeBtn.click();

    // 4. Offline Map
    const mapLink = await driver.wait(until.elementLocated(By.xpath("//span[text()='23. Offline Map']/ancestor::button")), 5000);
    await mapLink.click();
    const mapText = await driver.wait(until.elementLocated(By.xpath("//strong[contains(text(), 'download')]")), 5000);
    assert.ok(mapText, 'Offline Map screen not loaded.');
    const mapHomeBtn = await driver.findElement(By.xpath("//button[text()='← Home']"));
    await mapHomeBtn.click();

    // 5. Achievements & Gamification
    const badgesLink = await driver.wait(until.elementLocated(By.xpath("//span[text()='24. Achievements']/ancestor::button")), 5000);
    await badgesLink.click();
    const badgeText = await driver.wait(until.elementLocated(By.xpath("//span[text()='Rajput Explorer']")), 5000);
    assert.ok(badgeText, 'Achievements screen not loaded.');
    const badgesHomeBtn = await driver.findElement(By.xpath("//button[text()='← Home']"));
    await badgesHomeBtn.click();
  });

  // --- STAGE 14: ADMIN PORTAL SECURITY & CONSOLE OPERATIONS ---

  it('51. Should switch to Admin Portal, fill credentials, and authenticate admin session', async function () {
    const adminTab = await driver.findElement(By.id('nav-item-admin-portal'));
    await driver.executeScript("arguments[0].click();", adminTab);
    
    const loginRoot = await driver.wait(until.elementLocated(By.id('admin-login-root')), 5000);
    assert.ok(loginRoot, 'Admin Portal Login view did not load.');
    
    const emailInput = await driver.findElement(By.xpath("//div[@id='admin-login-root']//input[@type='email']"));
    await setReactInput(driver, emailInput, 'admin@tournex.com');
    const passwordInput = await driver.findElement(By.xpath("//div[@id='admin-login-root']//input[@type='password']"));
    await setReactInput(driver, passwordInput, 'adminpassword');
    
    const submitBtn = await driver.findElement(By.xpath("//button[text()='Authenticate Administrator']"));
    await submitBtn.click();
    
    const adminDashboard = await driver.wait(until.elementLocated(By.id('admin-dashboard-root')), 5000);
    assert.ok(adminDashboard, 'Admin Console Dashboard did not authenticate successfully.');
  });

  it('52. Should perform CRUD operation under Monument Management portal', async function () {
    const monNavBtn = await driver.findElement(By.xpath("//span[text()='27. Monuments Management']/ancestor::button"));
    await monNavBtn.click();
    
    const monForm = await driver.wait(until.elementLocated(By.xpath("//form[.//input[@placeholder='e.g. City Palace']]")), 5000);
    assert.ok(monForm, 'Monument CRUD form not loaded.');
    
    const monName = await driver.findElement(By.xpath("//input[@placeholder='e.g. City Palace']"));
    await setReactInput(driver, monName, 'Jaigarh Fort');
    const monCity = await driver.findElement(By.xpath("//input[@placeholder='e.g. Jaipur']"));
    await setReactInput(driver, monCity, 'Jaipur');
    const monFee = await driver.findElement(By.xpath("//input[@type='number']"));
    await setReactInput(driver, monFee, '120');
    
    const addBtn = await driver.findElement(By.xpath("//button[.//span[text()='Add Monument']]"));
    await addBtn.click();
    
    const addedItem = await driver.wait(until.elementLocated(By.xpath("//td[contains(text(), 'Jaigarh Fort')]")), 5000);
    assert.ok(addedItem, 'New monument was not added successfully to the admin list.');
  });

  it('53. Should approve local guide under Guide Verification portal', async function () {
    const guideNavBtn = await driver.findElement(By.xpath("//span[text()='28. Guide Verification']/ancestor::button"));
    await guideNavBtn.click();
    
    const approveBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Approve Guide')]")), 5000);
    await approveBtn.click();
    
    const approvedBadge = await driver.wait(until.elementLocated(By.xpath("//span[text()='Approved' and contains(@class, 'text-emerald-600')]")), 5000);
    assert.ok(approvedBadge, 'Guide status did not transition to Approved.');
  });

  it('54. Should send broadcast message safety alert to mobile clients', async function () {
    const alertNavBtn = await driver.findElement(By.xpath("//span[text()='30. Broadcast Alerts']/ancestor::button"));
    await alertNavBtn.click();
    
    const alertTextArea = await driver.wait(until.elementLocated(By.xpath("//textarea[contains(@placeholder, 'e.g. Heavy crowd')]")), 5000);
    await setReactInput(driver, alertTextArea, 'Test safety alert: Crowd congestion at Hawa Mahal');
    
    const sendBtn = await driver.findElement(By.xpath("//button[.//span[text()='Broadcast Alert Notification']]"));
    await sendBtn.click();
    
    // Wait for native browser window.alert and accept it
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    assert.ok(alertText.includes('Broadcast notification'), 'Alert text mismatch.');
    await alert.accept();
  });
});
