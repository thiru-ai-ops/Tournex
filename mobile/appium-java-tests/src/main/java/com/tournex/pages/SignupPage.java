package com.tournex.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;

public class SignupPage extends BasePage {
    private final By nameInput = AppiumBy.xpath("//*[@placeholder='e.g. Arjun Dev']");
    private final By emailInput = AppiumBy.xpath("//*[@placeholder='explorer@tournex.com']");
    private final By passwordInput = AppiumBy.xpath("//*[@placeholder='Create passcode']");
    private final By locationInput = AppiumBy.xpath("//*[@placeholder='e.g. Jaipur, Rajasthan']");
    private final By bioInput = AppiumBy.xpath("//*[@placeholder='Share your travel style...']");
    
    private final By submitButton = AppiumBy.xpath("//*[@text='Register Explorer Profile']");
    private final By loginLink = AppiumBy.xpath("//*[contains(@text, 'Log In')]");
    
    // First avatar preset wrapper
    private final By avatarPreset = AppiumBy.xpath("//*[@text='CHOOSE TRAVELER AVATAR']/following-sibling::View/TouchableOpacity[1]");

    public SignupPage(AppiumDriver driver) {
        super(driver);
    }

    public void enterName(String name) {
        type(nameInput, name);
    }

    public void enterEmail(String email) {
        type(emailInput, email);
    }

    public void enterPassword(String pass) {
        type(passwordInput, pass);
    }

    public void enterLocation(String loc) {
        type(locationInput, loc);
    }

    public void enterBio(String bio) {
        type(bioInput, bio);
    }

    public void selectAvatarPreset() {
        try {
            click(avatarPreset);
        } catch (Exception e) {
            System.out.println("Could not click specific avatar preset: " + e.getMessage());
        }
    }

    public void clickSubmit() {
        click(submitButton);
    }

    public void clickLoginLink() {
        click(loginLink);
    }

    public void registerUser(String name, String email, String pass, String loc, String bio) {
        enterName(name);
        enterEmail(email);
        enterPassword(pass);
        enterLocation(loc);
        enterBio(bio);
        selectAvatarPreset();
        clickSubmit();
    }
}
