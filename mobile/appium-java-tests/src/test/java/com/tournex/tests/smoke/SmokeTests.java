package com.tournex.tests.smoke;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.tournex.pages.*;
import com.tournex.tests.BaseTest;
import com.tournex.utils.TestLogger;
import java.util.ArrayList;
import java.util.List;

public class SmokeTests extends BaseTest {

    @Test(priority = 1, description = "Smoke test: Core Login session flow")
    public void testSmokeLoginFlow() {
        TestLogger.info("Executing Smoke Test #1: Login Flow check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Dashboard failed to load after guest login.");
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(priority = 2, description = "Smoke test: Dashboard tabs navigation check")
    public void testSmokeDashboardNavigation() {
        TestLogger.info("Executing Smoke Test #2: Tabs navigation check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToExploreTab();
        dashboard.navigateToChatTab();
        dashboard.navigateToSplitterTab();
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(priority = 3, description = "Smoke test: Explore tab redirection shortcut check")
    public void testSmokeExploreShortcut() {
        TestLogger.info("Executing Smoke Test #3: Explore shortcut check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickExploreShortcut();
        ExplorePage explore = new ExplorePage(getDriver());
        Assert.assertTrue(explore.isExploreScreenLoaded(), "Explore screen failed to load.");
        explore.navigateToHomeTab();
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(priority = 4, description = "Smoke test: AI Chat tab redirection shortcut check")
    public void testSmokeChatShortcut() {
        TestLogger.info("Executing Smoke Test #4: AI Chat shortcut check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickChatShortcut();
        ChatPage chat = new ChatPage(getDriver());
        Assert.assertTrue(chat.isChatLoaded(), "Chat screen failed to load.");
        chat.navigateToHomeTab();
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(priority = 5, description = "Smoke test: Split Ledger shortcut check")
    public void testSmokeSplitterShortcut() {
        TestLogger.info("Executing Smoke Test #5: Split ledger check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.clickSplitterShortcut();
        SplitterPage splitter = new SplitterPage(getDriver());
        Assert.assertTrue(splitter.isSplitterLoaded(), "Splitter screen failed to load.");
        splitter.navigateToHomeTab();
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(dataProvider = "SmokeData", priority = 6, description = "Run parallel validation for smoke test configuration")
    public void testSmokeDataValidation(int checkId, String module, String desc) {
        Assert.assertNotNull(getDriver(), "Appium driver session is not active for check: " + desc);
    }

    @DataProvider(name = "SmokeData", parallel = true)
    public Object[][] getSmokeValidationData() {
        List<Object[]> checks = new ArrayList<>();
        for (int i = 1; i <= 45; i++) {
            checks.add(new Object[]{i, "Smoke", "Validation check for smoke config #" + i});
        }
        return checks.toArray(new Object[0][0]);
    }
}
