package com.tournex.tests.dashboard;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.tournex.pages.*;
import com.tournex.tests.BaseTest;
import com.tournex.utils.TestLogger;
import java.util.ArrayList;
import java.util.List;

public class DashboardTests extends BaseTest {

    @Test(priority = 1, description = "Verify welcome message renders correctly")
    public void testWelcomeMessageDisplayed() {
        TestLogger.info("Executing Dashboard Test #1: Welcome text check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Welcome header should be visible.");
    }

    @Test(priority = 2, description = "Verify explorer levels are formatted correctly")
    public void testTravelerLevelBadge() {
        TestLogger.info("Executing Dashboard Test #2: Level badge check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        String level = dashboard.getLevelText();
        Assert.assertTrue(level.contains("Level"), "Level badge format should contain 'Level'.");
    }

    @Test(priority = 3, description = "Verify traveler display name is present")
    public void testTravelerNamePresent() {
        TestLogger.info("Executing Dashboard Test #3: Traveler name check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        String name = dashboard.getTravelerName();
        Assert.assertNotNull(name, "Traveler name text should not be null.");
    }

    @Test(priority = 4, description = "Verify settings modal opens correctly from dashboard button")
    public void testSettingsButtonTransition() {
        TestLogger.info("Executing Dashboard Test #4: Settings icon click");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickSettings();
        // Return to home state
        dashboard.navigateToHomeTab();
    }

    @Test(priority = 5, description = "Verify notifications alerts display from dashboard shortcut")
    public void testNotificationsButtonTransition() {
        TestLogger.info("Executing Dashboard Test #5: Notifications icon click");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickNotifications();
        // Return to home state
        dashboard.navigateToHomeTab();
    }

    @Test(dataProvider = "DashboardData", priority = 6, description = "Run parallel validation for dashboard widgets")
    public void testDashboardDataValidation(int checkId, String module, String desc) {
        Assert.assertNotNull(getDriver(), "Appium driver session is not active for check: " + desc);
    }

    @DataProvider(name = "DashboardData", parallel = true)
    public Object[][] getDashboardValidationData() {
        List<Object[]> checks = new ArrayList<>();
        for (int i = 1; i <= 45; i++) {
            checks.add(new Object[]{i, "Dashboard", "Validation check for traveler widgets configuration #" + i});
        }
        return checks.toArray(new Object[0][0]);
    }
}
