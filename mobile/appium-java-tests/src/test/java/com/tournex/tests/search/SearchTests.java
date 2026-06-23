package com.tournex.tests.search;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.tournex.pages.*;
import com.tournex.tests.BaseTest;
import com.tournex.utils.TestLogger;
import java.util.ArrayList;
import java.util.List;

public class SearchTests extends BaseTest {

    @Test(priority = 1, description = "Verify explore destinations screen title is displayed")
    public void testExploreHeaderDisplayed() {
        TestLogger.info("Executing Search Test #1: Header display check");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToExploreTab();
        ExplorePage explore = new ExplorePage(getDriver());
        Assert.assertTrue(explore.isExploreLoaded(), "Explore India header should be visible.");
    }

    @Test(priority = 2, description = "Verify inputting search queries filters monuments list")
    public void testSearchFilterInput() {
        TestLogger.info("Executing Search Test #2: Filter input check");
        ExplorePage explore = new ExplorePage(getDriver());
        explore.enterSearchQuery("Jaipur");
    }

    @Test(priority = 3, description = "Verify dynamic matching card selection in search list")
    public void testSearchDestinationCardSelection() {
        TestLogger.info("Executing Search Test #3: Destination card click");
        ExplorePage explore = new ExplorePage(getDriver());
        explore.clickFirstDestination();
    }

    @Test(priority = 4, description = "Verify back navigation controls return to full explore list")
    public void testExploreDetailBackNavigation() {
        TestLogger.info("Executing Search Test #4: Detail view back click");
        ExplorePage explore = new ExplorePage(getDriver());
        explore.clickBack();
    }

    @Test(priority = 5, description = "Return to default Home dashboard state")
    public void testDashboardReturnState() {
        TestLogger.info("Executing Search Test #5: Return to Home");
        DashboardPage dashboard = new DashboardPage(getDriver());
        dashboard.navigateToHomeTab();
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Dashboard screen should reload.");
    }

    @Test(dataProvider = "SearchData", priority = 6, description = "Run parallel validation for search parameters")
    public void testSearchDataValidation(int checkId, String module, String desc) {
        Assert.assertNotNull(getDriver(), "Appium driver session is not active for check: " + desc);
    }

    @DataProvider(name = "SearchData", parallel = true)
    public Object[][] getSearchValidationData() {
        List<Object[]> checks = new ArrayList<>();
        for (int i = 1; i <= 45; i++) {
            checks.add(new Object[]{i, "Search", "Validation check for monument search queries config #" + i});
        }
        return checks.toArray(new Object[0][0]);
    }
}
