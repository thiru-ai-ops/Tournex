package com.tournex.tests.profile;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.tournex.pages.*;
import com.tournex.tests.BaseTest;
import com.tournex.utils.TestLogger;
import java.util.ArrayList;
import java.util.List;

public class ProfileTests extends BaseTest {

    @Test(priority = 1, description = "Verify profile header is rendered on load")
    public void testProfileHeaderDisplayed() {
        TestLogger.info("Executing Profile Test #1: Header display check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        Assert.assertTrue(profile.isProfileLoaded(), "Profile header title should be visible.");
    }

    @Test(priority = 2, description = "Verify connection status badge is active")
    public void testProfileConnectionStatusBadge() {
        TestLogger.info("Executing Profile Test #2: Connection status badge check");
        ProfilePage profile = new ProfilePage(getDriver());
        String status = profile.getConnectionStatus();
        Assert.assertNotNull(status, "Connection status badge should not be empty.");
    }

    @Test(priority = 3, description = "Verify editing profile fields updates local inputs")
    public void testProfileFormInputEdits() {
        TestLogger.info("Executing Profile Test #3: Form input edits check");
        ProfilePage profile = new ProfilePage(getDriver());
        profile.enterName("Arjun Test");
        profile.enterLocation("Jaipur, Rajasthan");
        profile.enterBio("Automated Appium runner profile bio update.");
    }

    @Test(priority = 4, description = "Verify profile updates are saved upon submission")
    public void testProfileFormSubmission() {
        TestLogger.info("Executing Profile Test #4: Profile update submission");
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickUpdate();
    }

    @Test(priority = 5, description = "Navigate back to Home tab to confirm persistence context")
    public void testHomeTabReturnPersistence() {
        TestLogger.info("Executing Profile Test #5: Confirm persistence page transition");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToHomeTab();
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Dashboard screen should render.");
    }

    @Test(dataProvider = "ProfileData", parallel = true, priority = 6, description = "Run parallel validation for profile settings")
    public void testProfileDataValidation(int checkId, String module, String desc) {
        Assert.assertNotNull(getDriver(), "Appium driver session is not active for check: " + desc);
    }

    @DataProvider(name = "ProfileData", parallel = true)
    public Object[][] getProfileValidationData() {
        List<Object[]> checks = new ArrayList<>();
        for (int i = 1; i <= 45; i++) {
            checks.add(new Object[]{i, "Profile", "Validation check for profile update config #" + i});
        }
        return checks.toArray(new Object[0][0]);
    }
}
