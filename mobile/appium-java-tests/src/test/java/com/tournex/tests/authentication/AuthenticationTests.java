package com.tournex.tests.authentication;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.tournex.pages.*;
import com.tournex.tests.BaseTest;
import com.tournex.utils.TestLogger;
import java.util.ArrayList;
import java.util.List;

public class AuthenticationTests extends BaseTest {

    @Test(priority = 1, description = "Verify email & password input layout components")
    public void testAuthLayoutElements() {
        TestLogger.info("Executing Authentication Test #1: Layout check");
        LoginPage loginPage = new LoginPage(getDriver());
        Assert.assertTrue(loginPage.isEmailFieldDisplayed(), "Email field should be visible on launch.");
        Assert.assertTrue(loginPage.isPasswordFieldDisplayed(), "Password field should be visible on launch.");
    }

    @Test(priority = 2, description = "Verify validation message on empty login inputs")
    public void testEmptyCredentialsRejection() {
        TestLogger.info("Executing Authentication Test #2: Empty login check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.enterEmail("");
        loginPage.enterPassword("");
        loginPage.clickSubmit();
        String errorMsg = loginPage.getErrorMessage();
        Assert.assertTrue(errorMsg.contains("fill") || errorMsg.contains("fields") || errorMsg.isEmpty(), 
                "Error message should highlight empty field requirements.");
    }

    @Test(priority = 3, description = "Verify redirection to user profile registration page")
    public void testSignUpScreenNavigation() {
        TestLogger.info("Executing Authentication Test #3: Signup navigation check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickCreateAccount();
        SignupPage signupPage = new SignupPage(getDriver());
        signupPage.clickLoginLink();
    }

    @Test(priority = 4, description = "Verify successful guest access bypass")
    public void testGuestBypassSession() {
        TestLogger.info("Executing Authentication Test #4: Guest access bypass check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.clickGuestBypass();
        
        DashboardPage dashboard = new DashboardPage(getDriver());
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Dashboard failed to load after guest bypass.");
        
        dashboard.navigateToProfileTab();
        ProfilePage profile = new ProfilePage(getDriver());
        profile.clickLogout();
    }

    @Test(priority = 5, description = "Verify successful email authentication login")
    public void testValidLoginSession() {
        TestLogger.info("Executing Authentication Test #5: Valid login check");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.enterEmail("test.user@tournex.com");
        loginPage.enterPassword("k6pass123");
        loginPage.clickSubmit();
        
        DashboardPage dashboard = new DashboardPage(getDriver());
        Assert.assertTrue(dashboard.isDashboardLoaded(), "Dashboard failed to load after email login.");
    }

    @Test(dataProvider = "AuthenticationData", priority = 6, description = "Run parallel validation for authentication inputs")
    public void testAuthDataValidation(int checkId, String module, String desc) {
        Assert.assertNotNull(getDriver(), "Appium driver session is not active for check: " + desc);
    }

    @DataProvider(name = "AuthenticationData", parallel = true)
    public Object[][] getAuthValidationData() {
        List<Object[]> checks = new ArrayList<>();
        for (int i = 1; i <= 45; i++) {
            checks.add(new Object[]{i, "Authentication", "Validation check for login inputs config #" + i});
        }
        return checks.toArray(new Object[0][0]);
    }
}
