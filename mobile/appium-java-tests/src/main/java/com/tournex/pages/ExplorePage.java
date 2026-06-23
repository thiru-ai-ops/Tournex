package com.tournex.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;

public class ExplorePage extends BasePage {
    private final By mainTitle = AppiumBy.xpath("//*[@text='Explore India']");
    private final By searchInput = AppiumBy.xpath("//*[@placeholder='Search name, category, or state...']");
    private final By backButton = AppiumBy.xpath("//*[@text='← Back to Destinations']");
    
    // Package and stay reservation triggers
    private final By bookingPackageButton = AppiumBy.xpath("//*[contains(@text, 'Book Premium Tour Package')]");
    private final By bookingHotelButton = AppiumBy.xpath("//*[contains(@text, 'Book Stay')]");
    
    // First destination card from the list
    private final By firstDestinationCard = AppiumBy.xpath("//*[contains(@text, 'Jaipur') or contains(@text, 'Varanasi') or contains(@text, 'Fort')]");

    public ExplorePage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isExploreLoaded() {
        return isDisplayed(mainTitle);
    }

    public void enterSearchQuery(String query) {
        type(searchInput, query);
    }

    public void clickFirstDestination() {
        click(firstDestinationCard);
    }

    public void clickBack() {
        click(backButton);
    }

    public void clickBookPackage() {
        click(bookingPackageButton);
    }

    public void clickBookHotel() {
        click(bookingHotelButton);
    }
}
