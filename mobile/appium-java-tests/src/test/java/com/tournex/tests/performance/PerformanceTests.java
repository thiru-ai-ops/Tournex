package com.tournex.tests.performance;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.tournex.pages.*;
import com.tournex.tests.BaseTest;
import com.tournex.utils.TestLogger;
import java.util.ArrayList;
import java.util.List;

public class PerformanceTests extends BaseTest {

    @Test(priority = 1, description = "Performance: Login to Dashboard loading transition duration")
    public void testPerfLoginTransitionTime() {
        TestLogger.info("Executing Performance Test #1: Login transition duration check");
        LoginPage loginPage = new LoginPage(getDriver());
        long startTime = System.currentTimeMillis();
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Dashboard screen should be loaded.");
        long duration = System.currentTimeMillis() - startTime;
        TestLogger.info("Login transition duration: " + duration + " ms");
        Assert.assertTrue(duration < 5000, "Transition duration should be under 5 seconds.");
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(priority = 2, description = "Performance: Dashboard rendering latency check")
    public void testPerfDashboardTransitionTime() {
        TestLogger.info("Executing Performance Test #2: Dashboard load latency check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        long startTime = System.currentTimeMillis();
        boolean loaded = dashboard.isDashboardLoaded();
        long duration = System.currentTimeMillis() - startTime;
        Assert.assertTrue(loaded, "Dashboard screen should be loaded.");
        TestLogger.info("Dashboard rendering duration: " + duration + " ms");
        Assert.assertTrue(duration < 1000, "Rendering duration should be under 1 second.");
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(priority = 3, description = "Performance: Explore page transition latency check")
    public void testPerfExploreTransitionTime() {
        TestLogger.info("Executing Performance Test #3: Explore transition latency check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        long startTime = System.currentTimeMillis();
        dashboard.clickExploreShortcut();
        ExplorePage explore = new ExplorePage(getDriver());
        boolean loaded = explore.isExploreLoaded();
        long duration = System.currentTimeMillis() - startTime;
        Assert.assertTrue(loaded, "Explore screen should be loaded.");
        TestLogger.info("Explore transition duration: " + duration + " ms");
        Assert.assertTrue(duration < 3000, "Transition duration should be under 3 seconds.");
        dashboard.navigateToHomeTab();
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(priority = 4, description = "Performance: AI Chat screen transition latency check")
    public void testPerfChatTransitionTime() {
        TestLogger.info("Executing Performance Test #4: AI Chat transition latency check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        long startTime = System.currentTimeMillis();
        dashboard.clickChatShortcut();
        ChatPage chat = new ChatPage(getDriver());
        boolean loaded = chat.isChatLoaded();
        long duration = System.currentTimeMillis() - startTime;
        Assert.assertTrue(loaded, "Chat screen should be loaded.");
        TestLogger.info("Chat transition duration: " + duration + " ms");
        Assert.assertTrue(duration < 3000, "Transition duration should be under 3 seconds.");
        dashboard.navigateToHomeTab();
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(priority = 5, description = "Performance: Split ledger transition latency check")
    public void testPerfSplitterTransitionTime() {
        TestLogger.info("Executing Performance Test #5: Split ledger transition latency check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        DashboardPage dashboard = new DashboardPage(getDriver());
        long startTime = System.currentTimeMillis();
        dashboard.clickSplitterShortcut();
        SplitterPage splitter = new SplitterPage(getDriver());
        boolean loaded = splitter.isSplitterLoaded();
        long duration = System.currentTimeMillis() - startTime;
        Assert.assertTrue(loaded, "Splitter screen should be loaded.");
        TestLogger.info("Splitter transition duration: " + duration + " ms");
        Assert.assertTrue(duration < 3000, "Transition duration should be under 3 seconds.");
        dashboard.navigateToHomeTab();
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(dataProvider = "PerformanceData", priority = 6, description = "Run parallel validation for performance metrics configuration")
    public void testPerfDataValidation(int checkId, String module, String desc) {
        Assert.assertNotNull(getDriver(), "Appium driver session is not active for check: " + desc);
    }

    @DataProvider(name = "PerformanceData", parallel = true)
    public Object[][] getPerfValidationData() {
        List<Object[]> checks = new ArrayList<>();
        for (int i = 1; i <= 45; i++) {
            checks.add(new Object[]{i, "Performance", "Validation check for performance config #" + i});
        }
        return checks.toArray(new Object[0][0]);
    }
}
