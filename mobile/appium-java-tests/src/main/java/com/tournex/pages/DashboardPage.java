package com.tournex.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;

public class DashboardPage extends BasePage {
    private final By headerWelcome = AppiumBy.xpath("//*[contains(@text, 'Welcome back')]");
    private final By headerName = AppiumBy.xpath("//*[contains(@text, 'Welcome back')]/following-sibling::Text");
    private final By levelStat = AppiumBy.xpath("//*[contains(@text, 'Level ')]");
    
    // Shortcuts
    private final By exploreShortcut = AppiumBy.xpath("//*[@text='Explore']");
    private final By chatShortcut = AppiumBy.xpath("//*[@text='AI Chat']");
    private final By splitterShortcut = AppiumBy.xpath("//*[@text='Split Ledger']");
    
    // Header actions
    private final By notificationsBtn = AppiumBy.xpath("//*[@text='🔔']");
    private final By settingsBtn = AppiumBy.xpath("//*[@text='⚙️']");
    
    // Bottom Tab Icons (text tags)
    private final By homeTab = AppiumBy.xpath("//*[@text='🏠']");
    private final By exploreTab = AppiumBy.xpath("//*[@text='🧭']");
    private final By chatTab = AppiumBy.xpath("//*[@text='💬']");
    private final By splitterTab = AppiumBy.xpath("//*[@text='💸']");
    private final By profileTab = AppiumBy.xpath("//*[@text='👤']");

    public DashboardPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isDashboardLoaded() {
        return isDisplayed(headerWelcome);
    }

    public String getTravelerName() {
        return getText(headerName);
    }

    public String getLevelText() {
        return getText(levelStat);
    }

    public void clickExploreShortcut() {
        click(exploreShortcut);
    }

    public void clickChatShortcut() {
        click(chatShortcut);
    }

    public void clickSplitterShortcut() {
        click(splitterShortcut);
    }

    public void clickNotifications() {
        click(notificationsBtn);
    }

    public void clickSettings() {
        click(settingsBtn);
    }

    public void navigateToHomeTab() {
        click(homeTab);
    }

    public void navigateToExploreTab() {
        click(exploreTab);
    }

    public void navigateToChatTab() {
        click(chatTab);
    }

    public void navigateToSplitterTab() {
        click(splitterTab);
    }

    public void navigateToProfileTab() {
        click(profileTab);
    }
}
