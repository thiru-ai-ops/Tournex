package com.tournex.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;

public class ProfilePage extends BasePage {
    private final By mainTitle = AppiumBy.xpath("//*[@text='Explorer Profile']");
    
    // Form fields
    private final By nameInput = AppiumBy.xpath("//*[@text='FULL NAME']/following-sibling::TextInput");
    private final By locationInput = AppiumBy.xpath("//*[@text='LOCATION']/following-sibling::TextInput");
    private final By bioInput = AppiumBy.xpath("//*[@text='SHORT BIO']/following-sibling::TextInput");
    private final By updateButton = AppiumBy.xpath("//*[@text='Update Explorer Profile']");
    
    // Status
    private final By statusBadge = AppiumBy.xpath("//*[contains(@text, 'Mode') or contains(@text, 'Sync')]");
    
    // Actions
    private final By logoutButton = AppiumBy.xpath("//*[@text='Logout Travel Session']");

    public ProfilePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isProfileLoaded() {
        return isDisplayed(mainTitle);
    }

    public void enterName(String name) {
        type(nameInput, name);
    }

    public void enterLocation(String loc) {
        type(locationInput, loc);
    }

    public void enterBio(String bio) {
        type(bioInput, bio);
    }

    public void clickUpdate() {
        click(updateButton);
    }

    public void updateProfile(String name, String loc, String bio) {
        enterName(name);
        enterLocation(loc);
        enterBio(bio);
        clickUpdate();
    }

    public void clickLogout() {
        click(logoutButton);
    }

    public String getConnectionStatus() {
        return getText(statusBadge);
    }
}
