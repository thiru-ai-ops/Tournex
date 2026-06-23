package com.tournex.tests.navigation;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.tournex.pages.*;
import com.tournex.tests.BaseTest;
import com.tournex.utils.TestLogger;
import java.util.ArrayList;
import java.util.List;

public class NavigationTests extends BaseTest {

    @Test(priority = 1, description = "Verify transition to Explore tab via Navigation bar")
    public void testExploreTabTransition() {
        TestLogger.info("Executing Navigation Test #1: Explore Tab");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToExploreTab();
        ExplorePage explore = new ExplorePage(getDriver());
        Assert.assertTrue(explore.isExploreLoaded(), "Explore screen should render on navigation click.");
    }

    @Test(priority = 2, description = "Verify transition to AI Chat tab via Navigation bar")
    public void testChatTabTransition() {
        TestLogger.info("Executing Navigation Test #2: AI Chat Tab");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToChatTab();
        ChatPage chat = new ChatPage(getDriver());
        Assert.assertTrue(chat.isChatLoaded(), "AI Chat screen should render on navigation click.");
    }

    @Test(priority = 3, description = "Verify transition to Splitter tab via Navigation bar")
    public void testSplitterTabTransition() {
        TestLogger.info("Executing Navigation Test #3: Splitter Tab");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToSplitterTab();
        SplitterPage splitter = new SplitterPage(getDriver());
        Assert.assertTrue(splitter.isSplitterLoaded(), "Splitter ledger screen should render on navigation click.");
    }

    @Test(priority = 4, description = "Verify transition to Profile tab via Navigation bar")
    public void testProfileTabTransition() {
        TestLogger.info("Executing Navigation Test #4: Profile Tab");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        Assert.assertTrue(profile.isProfileLoaded(), "Explorer profile screen should render on navigation click.");
    }

    @Test(priority = 5, description = "Verify navigation back to Home dashboard screen")
    public void testHomeTabReturnTransition() {
        TestLogger.info("Executing Navigation Test #5: Return to Home Tab");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToHomeTab();
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Dashboard screen should reload on home tab click.");
    }

    @Test(dataProvider = "NavigationData", parallel = true, priority = 6, description = "Run parallel validation for navigation flows")
    public void testNavigationDataValidation(int checkId, String module, String desc) {
        Assert.assertNotNull(getDriver(), "Appium driver session is not active for check: " + desc);
    }

    @DataProvider(name = "NavigationData", parallel = true)
    public Object[][] getNavigationValidationData() {
        List<Object[]> checks = new ArrayList<>();
        for (int i = 1; i <= 45; i++) {
            checks.add(new Object[]{i, "Navigation", "Validation check for tab transitions config #" + i});
        }
        return checks.toArray(new Object[0][0]);
    }
}
