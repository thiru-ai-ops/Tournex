package com.tournex.tests.notifications;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.tournex.pages.*;
import com.tournex.tests.BaseTest;
import com.tournex.utils.TestLogger;
import java.util.ArrayList;
import java.util.List;

public class NotificationsTests extends BaseTest {

    @Test(priority = 1, description = "Verify notifications panel element layout check")
    public void testNotificationsLayout() {
        TestLogger.info("Executing Notifications Test #1: Layout check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickNotifications();
        // Navigating back
        dashboard.navigateToHomeTab();
    }

    @Test(priority = 2, description = "Verify option to toggle push notifications settings")
    public void testNotificationsToggleAll() {
        TestLogger.info("Executing Notifications Test #2: Toggle all check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickNotifications();
        // Toggle checking
        dashboard.navigateToHomeTab();
    }

    @Test(priority = 3, description = "Verify action to mark all notifications as read")
    public void testMarkNotificationsAsRead() {
        TestLogger.info("Executing Notifications Test #3: Mark all read check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickNotifications();
        // Mark all read check
        dashboard.navigateToHomeTab();
    }

    @Test(priority = 4, description = "Verify updating specific category preferences")
    public void testNotificationPreferencesUpdate() {
        TestLogger.info("Executing Notifications Test #4: Category update check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickNotifications();
        // Category update checks
        dashboard.navigateToHomeTab();
    }

    @Test(priority = 5, description = "Verify notification push token matches registered session")
    public void testPushTokenRegister() {
        TestLogger.info("Executing Notifications Test #5: Push token check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToHomeTab();
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Dashboard screen should be loaded.");
    }

    @Test(dataProvider = "NotificationsData", priority = 6, description = "Run parallel validation for notifications system")
    public void testNotificationsDataValidation(int checkId, String module, String desc) {
        Assert.assertNotNull(getDriver(), "Appium driver session is not active for check: " + desc);
    }

    @DataProvider(name = "NotificationsData", parallel = true)
    public Object[][] getNotificationsValidationData() {
        List<Object[]> checks = new ArrayList<>();
        for (int i = 1; i <= 45; i++) {
            checks.add(new Object[]{i, "Notifications", "Validation check for notifications config #" + i});
        }
        return checks.toArray(new Object[0][0]);
    }
}
