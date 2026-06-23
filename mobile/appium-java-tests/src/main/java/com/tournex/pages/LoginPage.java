package com.tournex.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;

public class LoginPage extends BasePage {
    private final By emailInput = AppiumBy.accessibilityId("emailInput");
    private final By passwordInput = AppiumBy.accessibilityId("passwordInput");
    private final By loginButton = AppiumBy.accessibilityId("loginButton");
    
    // XPath dynamic locator strategies for textual targets
    private final By googleLoginButton = AppiumBy.xpath("//*[@text='Continue with Google']");
    private final By guestBypassButton = AppiumBy.xpath("//*[@text='Explore as Guest (Offline Mode) →']");
    private final By createAccountLink = AppiumBy.xpath("//*[contains(@text, 'Create Account')]");
    private final By errorMessageText = AppiumBy.xpath("//*[contains(@text, '⚠️') or contains(@text, 'Invalid')]");

    public LoginPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isEmailFieldDisplayed() {
        return isDisplayed(emailInput);
    }

    public boolean isPasswordFieldDisplayed() {
        return isDisplayed(passwordInput);
    }

    public boolean isLoginButtonEnabled() {
        return isDisplayed(loginButton);
    }

    public void enterEmail(String email) {
        type(emailInput, email);
    }

    public void enterPassword(String pass) {
        type(passwordInput, pass);
    }

    public void clickSubmit() {
        click(loginButton);
    }

    public void performLogin(String email, String pass) {
        enterEmail(email);
        enterPassword(pass);
        clickSubmit();
    }

    public void clickGoogleLogin() {
        click(googleLoginButton);
    }

    public void clickGuestBypass() {
        click(guestBypassButton);
    }

    public void clickCreateAccount() {
        click(createAccountLink);
    }

    public String getErrorMessage() {
        return getText(errorMessageText);
    }
}
