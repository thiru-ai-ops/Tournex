const { remote } = require('webdriverio');
const assert = require('assert');
const path = require('path');

describe('Tournex Mobile App E2E Login & Logout Test', function () {
  this.timeout(180000); // 3 minutes timeout
  let client;

  before(async function () {
    const apkPath = process.env.APP_PATH || path.resolve(__dirname, '../../android/app/build/outputs/apk/debug/app-debug.apk');
    console.log(`Using APK path: ${apkPath}`);

    const opts = {
      hostname: '127.0.0.1',
      port: 4723,
      path: '/',
      capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Emulator',
        'appium:app': apkPath,
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 600,
        'appium:appWaitActivity': 'com.tournex.mobile.MainActivity',
      }
    };
    client = await remote(opts);
  });

  after(async function () {
    if (client) {
      await client.deleteSession();
    }
  });

  it('should fill login credentials, authenticate, see dashboard, and logout', async function () {
    console.log('Waiting for Email Input field...');
    const emailInput = await client.$('~emailInput');
    await emailInput.waitForDisplayed({ timeout: 45000 });
    
    console.log('Entering email...');
    await emailInput.setValue('arjun.travels@gmail.com');
    
    console.log('Entering password...');
    const passwordInput = await client.$('~passwordInput');
    await passwordInput.setValue('google_oauth_bypass_pass');
    
    console.log('Clicking login button...');
    const loginButton = await client.$('~loginButton');
    await loginButton.click();
    
    console.log('Waiting for welcome text on Home Dashboard...');
    const welcomeText = await client.$('~welcomeText');
    await welcomeText.waitForDisplayed({ timeout: 60000 });
    
    const textContent = await welcomeText.getText();
    console.log(`Welcome message text: "${textContent}"`);
    assert(textContent.includes('Namaste'), 'Welcome message should contain Namaste');
    
    console.log('Clicking logout button...');
    const logoutButton = await client.$('~logoutButton');
    await logoutButton.click();
    
    console.log('Verifying redirection back to Login screen...');
    await emailInput.waitForDisplayed({ timeout: 20000 });
    console.log('Redirection verified. Test passed!');
  });
});
