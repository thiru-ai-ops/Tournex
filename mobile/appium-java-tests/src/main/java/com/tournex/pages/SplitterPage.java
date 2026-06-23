package com.tournex.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;

public class SplitterPage extends BasePage {
    private final By mainTitle = AppiumBy.xpath("//*[@text='Splitter Ledger']");
    private final By ledgerAmountText = AppiumBy.xpath("//*[contains(@text, 'Group Travel Ledger')]/following-sibling::Text");
    
    // Form fields
    private final By descriptionInput = AppiumBy.xpath("//*[@placeholder='Expense Description (e.g. Dinner at Lassiwala)']");
    private final By amountInput = AppiumBy.xpath("//*[@placeholder='Amount (₹)']");
    private final By submitButton = AppiumBy.xpath("//*[@text='Add to Split Bill']");
    
    // Actions
    private final By wipeLedgerButton = AppiumBy.xpath("//*[@text='Wipe Split Ledger']");
    private final By deleteExpenseBtn = AppiumBy.xpath("//*[@text='Delete']");

    public SplitterPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isSplitterLoaded() {
        return isDisplayed(mainTitle);
    }

    public String getLedgerTotal() {
        return getText(ledgerAmountText);
    }

    public void enterDescription(String desc) {
        type(descriptionInput, desc);
    }

    public void enterAmount(String amt) {
        type(amountInput, amt);
    }

    public void clickSubmit() {
        click(submitButton);
    }

    public void recordExpense(String desc, String amt) {
        enterDescription(desc);
        enterAmount(amt);
        clickSubmit();
    }

    public void clickWipeLedger() {
        if (isDisplayed(wipeLedgerButton)) {
            click(wipeLedgerButton);
        }
    }

    public void deleteFirstExpense() {
        if (isDisplayed(deleteExpenseBtn)) {
            click(deleteExpenseBtn);
        }
    }
}
