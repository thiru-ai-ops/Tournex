package com.tournex.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;

public class ChatPage extends BasePage {
    private final By chatInputField = AppiumBy.xpath("//*[@placeholder='Ask travel companion...']");
    private final By sendButton = AppiumBy.xpath("//*[@text='Send']");
    private final By clearHistoryButton = AppiumBy.xpath("//*[@text='🗑️']");
    
    // Welcome status
    private final By chatEmptyTitle = AppiumBy.xpath("//*[contains(@text, 'How can I help you today?')]");
    
    // Latest message
    private final By latestMessageText = AppiumBy.xpath("//*[contains(@text, 'Based on') or contains(@text, 'Jaipur is stunning') or contains(@text, 'Varanasi Ghats') or contains(@text, 'government-accredited')]");

    public ChatPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isChatLoaded() {
        return isDisplayed(chatInputField);
    }

    public boolean isWelcomeTextDisplayed() {
        return isDisplayed(chatEmptyTitle);
    }

    public void enterMessage(String msg) {
        type(chatInputField, msg);
    }

    public void clickSend() {
        click(sendButton);
    }

    public void sendMessage(String msg) {
        enterMessage(msg);
        clickSend();
    }

    public void clickClearHistory() {
        click(clearHistoryButton);
    }

    public boolean waitForAiResponse() {
        try {
            return waitForElement(latestMessageText).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getLatestResponse() {
        return getText(latestMessageText);
    }
}
