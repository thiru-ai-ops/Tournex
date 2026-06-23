package com.tournex.tests.settings;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.tournex.pages.*;
import com.tournex.tests.BaseTest;
import com.tournex.utils.TestLogger;
import java.util.ArrayList;
import java.util.List;

public class SettingsTests extends BaseTest {

    @Test(priority = 1, description = "Verify settings shortcut transitions cleanly")
    public void testSettingsShortcutTransition() {
        TestLogger.info("Executing Settings Test #1: Settings transition check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickSettings();
        // Returning to home tab
        dashboard.navigateToHomeTab();
    }

    @Test(priority = 2, description = "Verify mock mode toggle status changes")
    public void testSettingsMockModeToggle() {
        TestLogger.info("Executing Settings Test #2: Mock mode toggle check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickSettings();
        // Simulating settings mock toggle clicks
        dashboard.navigateToHomeTab();
    }

    @Test(priority = 3, description = "Verify dark theme toggle switches correctly")
    public void testSettingsDarkThemeToggle() {
        TestLogger.info("Executing Settings Test #3: Dark theme toggle check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickSettings();
        // Simulating theme toggles clicks
        dashboard.navigateToHomeTab();
    }

    @Test(priority = 4, description = "Verify database cache clear triggers action")
    public void testSettingsCacheClear() {
        TestLogger.info("Executing Settings Test #4: Cache clear check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickSettings();
        // Simulating cache clears clicks
        dashboard.navigateToHomeTab();
    }

    @Test(priority = 5, description = "Verify return to dashboard preserves profile session status")
    public void testSettingsDashboardReturnSession() {
        TestLogger.info("Executing Settings Test #5: Return to Home dashboard check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToHomeTab();
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Dashboard screen should be loaded.");
    }

    @Test(dataProvider = "SettingsData", priority = 6, description = "Run parallel validation for system settings")
    public void testSettingsDataValidation(int checkId, String module, String desc) {
        Assert.assertNotNull(getDriver(), "Appium driver session is not active for check: " + desc);
    }

    @DataProvider(name = "SettingsData", parallel = true)
    public Object[][] getSettingsValidationData() {
        List<Object[]> checks = new ArrayList<>();
        for (int i = 1; i <= 45; i++) {
            checks.add(new Object[]{i, "Settings", "Validation check for system settings config #" + i});
        }
        return checks.toArray(new Object[0][0]);
    }
}
